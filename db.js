function getDatabase(){
	return openDatabase('querys_app','1.0','Almacenamiento de prueba de información, consultas sqlite', 1000000);
}

function comprobarTablas(){
	const db = getDatabase();
	return new Promise(function(resolve, reject){
		db.transaction(function(tx){
			
			tx.executeSql(`CREATE TABLE IF NOT EXISTS TBL_REG_VERSION (
					numero_version int primary key,
					fecha_version varchar(10),
					descripcion_version varchar(100)
				);`
			);

			tx.executeSql(`CREATE TABLE IF NOT EXISTS t1 (
					id int primary key,
					nombre varchar(200),
					apellidos varchar(300),
					edad int
				);`
			);

			tx.executeSql(`CREATE TABLE IF NOT EXISTS t2 (
					id int,
					modelo varchar(200),
					color varchar(300),
					year int
				);`
			);

			tx.executeSql(`CREATE TABLE IF NOT EXISTS t3 (
					id int,
					sabor varchar(200),
					cantidad int
				);`
			);
		}, function(err){
			reject(err.message)
			// console.error(err.message)
		}, function(){
			resolve();
		})
	})
}

function setVersionApp(versionNumber, description, data){
	const date = new Date();
	let day = date.getDate(); 
	let month = date.getMonth()+1;
	let year = date.getFullYear();
	if (day < 10) {
		day = `0${day}`;
	}
	if (month < 10) {
		month = `0${month}`
	}
	const dateFormat = `${year}-${month}-${day}`
	return getVersionData()
		.then(function(obj){
			if (!obj) {
				return insert('TBL_REG_VERSION',{cols: `${versionNumber}__${dateFormat}__${description}`})
					.then(function(){
						return versionNumber;
					})
					.catch(function(msj){
						console.error(msj)
					})
			} else{
				if (versionNumber > obj.numero_version) {
					return update('TBL_REG_VERSION',{cols:`${versionNumber}__${dateFormat}__${description}`, colsNames:'numero_version,fecha_version,descripcion_version', where: {variables :'numero_version', valores: '1__'}})
						.then(function(){
							return obj.numero_version;
						})
						.catch(function(err){
							console.error(err)
						})
				}
				return obj.numero_version;
			}
		})
		.then(function(version){
			return new Promise(function(resolve, reject){
				if (data.tableName == '') {
					reject('Falta la propiedad obj.tableName en la precarga de información version = '+ versionNumber)
				} else {
					return comprobarInformacion(data.tableName, data.querys)
						.then(function(){
							resolve(version);
						})
				}
			})
		})
}

function getVersionData(){
	return select('TBL_REG_VERSION',{})
		.then(function(obj){
			return obj[0];
		});
}

function comprobarInformacion(tableName, querys, version){
	const db = getDatabase();
	return select(tableName,{cols:'count(*) total'})
		.then(function(obj){
			if (obj[0].total == 0) {
				db.transaction(function(tx){
					querys.forEach(function(query, index){
						tx.executeSql(query)
					})
				}, function(err){
					console.error(err.message)
				}, function(){
					return getVersionData()
						.then(function(obj){
							console.log('¡TERMINO DE INSERTAR DATOS PARA VERSIÓN [%s]!', obj.numero_version);
						})
				})
			}
		})
}