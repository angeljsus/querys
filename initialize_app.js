const { db, select, insert } = require(__dirname + '\\js\\querys.js');
document.addEventListener('DOMContentLoaded', init)

function init(){

	// inicializar las tablas
	comprobarTablas()
	.then(function(){
		// EJECUTAR LA PRECARGA DE INFORMACIÓN
		runPrecarga()
			.then(function(){
				console.warn('¡PRECARGA COMPROBADA!')
				// EJECUTAR CONSULTAS DESPUES DE PRECARGAR DATOS
				let jsonSelect = {
						cols : 'id, nombre',
						where : {
							variables : 'id,', valores: '7__', condiciones: '<'
						},
						group: {
							variables : 'edad',// condiciones: '=,<', valores : '1__7'
						},
						order : { 
							variables: 'id,', type : 'DESC' 
						},
						limit : {
							start: false, end: 0
						}
					}
				// ejemplo llamar función para seleccionar, retorna objeto de resultados obtenidos
				select('t1',jsonSelect)
				.then(function(obj){
					console.log(obj)
				})
				.catch(function(msj){
					console.error(msj)
				})

				let jsonInsert = {
					cols : '11__usuario prueba 1__DOM__25',
				}
				// ejemplo llamar función para insertar, retorna objeto de datos insertados
				insert('t1', jsonInsert)
				.then(function(obj){
					console.warn(obj)
				})
				.catch(function(msj){
					console.error(msj)
				})

				let jsonUpdate = {
					cols : 'Pedro__Rocoso', 
					colsNames: 'nombre,apellidos', 
					where : { 
						variables : 'edad,', valores : '12', condiciones : '='
					}
				}
				// ejemplo llamar función para actualizar registros, retorna el numero de filas actualizadas
				update('t1', jsonUpdate)
				.then(function(rowsAffected){
					console.log(rowsAffected)
				})
				.catch(function(msj){
					console.error(msj)
				})

				let jsonDelete = {
					where : { 
						variables : 'edad,', valores : '12', condiciones : '='
					}
				}
				// ejemplo llamar función para eliminar registros, retorna el numero de filas eliminadas
				deleteReg('t1', jsonDelete)
				.then(function(rowsAffected){
					console.log(rowsAffected)
				})
				.catch(function(msj){
					console.error(msj)
				})

			})
	})
}
