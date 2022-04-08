const db = openDatabase('querys_app','1.0','Almacenamiento de prueba de información, consultas sqlite', 1000000);

function select(nombreTabla, jsonProp){
	console.log('Generando consulta..')
	let query = 'SELECT ';
	let objectVars = [], objectVals = [], objectCond = [], params = [];
	let condicion = false, status = true;
	let type = '', queryReturn = '', mensaje = '', contBucle = 1;

	return new Promise(function(resolve, reject){
		if (jsonProp) {
			// existen las columnas?
			if (jsonProp.cols && jsonProp.cols.length > 0) {
				query += jsonProp.cols.replace(/,$/, '');
			} else {
				query += '*';
				// sera todo *
			}
			// hay condiciones ?  
			if (jsonProp.where) {
				if (jsonProp.where.variables && jsonProp.where.valores) {
					console.log('Hay propiedades')
					// agregar el where
					query += ` FROM ${nombreTabla} WHERE `;
					// se convierte en arreglo
					objectVars = jsonProp.where.variables.replace(/,$/, '').split(',');
					objectVals = jsonProp.where.valores.replace(/__$/, '').split('__');
					if (jsonProp.where.condiciones) {
						// hay condiciones
						objectCond = jsonProp.where.condiciones.split(',')
						condicion = true;
					}
					objectVars.forEach(function(variable, index){
						if (!objectVals[index]) { 
							mensaje = ``;
							reject(`La cantidad de valores no corresponde a las variables enviadas:\nvars: ${objectVars.length}\nvals: ${objectVals.length}\nseparacion: ___`) 
						};
						query += variable + ' ';
						if (condicion > 0) {
							if (objectCond[index]) {
								// agrega la condicion que lleva
								query += `${objectCond[index]} `;
							} else {
								// agrega el operador =
								query += '= ';
							}
						} else {
							// todas las condiciones serán =
								query += '= ';
						}
						query += '? ';
						if (objectVars.length > contBucle) {
							query += `AND `;
						}
						contBucle++;
					})
				} else {
					query += ` FROM ${nombreTabla} `;
					status = false
				}
			} else {
					query += ` FROM ${nombreTabla} `;
					status = false;
			}
			resolve({queryReturn : query, status : status})
		}
	})
	.then(function(data){
		queryReturn = data.queryReturn
		return new Promise(function(resolve, reject){
			// hay agrupaciones
			contBucle = 1;
			if (jsonProp.group) {
				if (jsonProp.group.variables) {
					queryReturn += `GROUP BY `;
					// si las existen valores dentro del grupo 
					if (jsonProp.group.valores && jsonProp.group.condiciones) {
						objectVars = jsonProp.group.variables.replace(/,$/, '').split(',');
						objectCond = jsonProp.group.condiciones.replace(/,$/, '').split(',')
						objectVals = jsonProp.group.valores.replace(/__$/, '').split('__');
						if (objectVars.length == objectVals.length && objectVars.length == objectCond.length) {
							objectVars.forEach(function(variable, index){
								queryReturn += `${objectVars[index]} `;
								queryReturn += `${objectCond[index]} `;
								type = parseInt(objectVals[index]);
								type = typeof type;
								if (type == 'number') {
									queryReturn += `${objectVals[index]}`;
								} else {
									queryReturn += `"${objectVals[index]}"`;
								}
								if (contBucle == objectVars.length) {
									queryReturn += '';
								} else {
									queryReturn += ',';
								}
								contBucle++;
							})
						} else {
							reject(`Faltan parametros en para agrupar con condicionales, deben ser la misma cantidad de variables\nvars: ${objectVars.length}\ncondc:${objectCond.length}\nvals:${objectVals.length}\nseparacion: ___`)
						}
					} else {
						queryReturn += jsonProp.group.variables;
					}
				}
			}
			// hay ordenamiento
			if (jsonProp.order && jsonProp.order.variables) {
				console.log('Hay ordenamiento')
				queryReturn += ` ORDER BY ${jsonProp.order.variables.replace(/,$/, '')}`;
				if (jsonProp.order.type) {
					queryReturn += ` ${jsonProp.order.type}`;
				}
			}
			// hay limite
			if (jsonProp.limit) {
				if (jsonProp.limit.start || jsonProp.limit.start == 0) {
					queryReturn += ` LIMIT ${jsonProp.limit.start}`;
					if (jsonProp.limit.end){
						// agregar end
						queryReturn += `, ${jsonProp.limit.end}`;
					}
				}
			}
			// finalize
			queryReturn += ';';
			data.status = true;
			data.queryReturn = queryReturn;
			resolve(data)
		})
	})
	.then(function(data){
		queryReturn = data.queryReturn;
		// obtener los valores de los parametros de que existen en la consulta
		if (data.status && jsonProp.where && jsonProp.where.valores) {
				params = jsonProp.where.valores.replace(/__$/, '').split('__');
		}
		console.warn('INFO:\nQuery: %s\nValores: [%s]',queryReturn, params.toString());
		return new Promise(function(resolve, reject){
			db.transaction(function(tx){
				console.log('Ejecutando consulta...')
				tx.executeSql(queryReturn, params, function(tx, results){
					console.log('Resultados encontrados: %s', results.rows.length)
					console.table(results.rows)
					resolve(results.rows);
				})
			}, function(err){
				console.log(err)
			})
		})

	})
}

function insert(nombreTabla, jsonProp){
	let mensaje = '';
	return new Promise(function(resolve, reject){
		if (jsonProp.cols) {
			resolve(jsonProp.cols.replace(/__$/,'').split('__'))
		} else {
			mensaje = 'No hay columnas para insertar.\n';
			reject(mensaje)
		}
	}) 
	.then(function(data){
		query = `INSERT INTO ${nombreTabla} VALUES (`
		data.forEach(function(item){
			query += '?,'
		})
		query = query.replace(/,$/,'');
		query += ');'
		// console.log(query)
		return new Promise(function(resolve, reject){
			console.log('Consulta: %s', query)
			db.transaction(function(tx){
				tx.executeSql(query, data)
			}, function(err){
				reject(err.message)
			}, function(){
				mensaje = `Fila insertada: ${JSON.stringify(data)}`
				console.log(mensaje)
				resolve(data)
			})
		})
	}) 
}

module.exports = { select, insert, db };