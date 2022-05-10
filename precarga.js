function runPrecarga(){
	// inicializar tablas y tipos de consulta a realizar
	let objQuerys =
		{
			tableName: 't1',
			querys: [
				`INSERT INTO t1 VALUES (1,"Adrian","Cisneros",65),
				(2,"Cruz","López",80),
				(3,"Guille","Durón",22);`,
				// update, insert, o delete para otra tabla, consulta como nuevo elemento del arreglo
			]
		}
	// crear la versión, insertando los datos del json.querys y validando que no existan registros dentro de json.tableName
	return setVersionApp('1','Versión inicial de la aplicación, precarga de usuarios', objQuerys)
		.then(function(version){
			// eliminar datos antes de crear una nueva versión (si los datos son para la misma tabla), una vez creada la versión saltar consulta
			if (version == 1) {
				// si es necesario, ejecutar distintas consultas antes de actualizar
				return deleteReg('t1', {})
			}
			return;
		})
		.then(function(){
			// datos para la nueva versión
			objQuerys =
			{
				tableName: 't1',
				querys: [
					`INSERT INTO t1 VALUES (1,"Adrian","Cisneros",100),
					(2,"Cruz","López",20),
					(3,"Guille","Durón",42);`,
				]
			}
			// crear la versión, insertando los datos del json.querys y validando que no existan registros dentro de json.tableName
			return setVersionApp('2','Versión segunda de la aplicación, actualización de edades', objQuerys)
		})
		.then(function(){
			// ... continuar agregando nuevas versiones, siempre una mayor a la anterior
		})
}