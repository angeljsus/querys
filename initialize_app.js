const { db, select, insert } = require(__dirname + '\\js\\querys.js');
document.addEventListener('DOMContentLoaded', init)


function init(){
	
	let jsonSelect = {
		cols : 'usuario, COUNT(proyecto),',
		where : {
			variables : 'proyecto', //valores: '7', condiciones: '<'
		},
		group: {
			variables : 'usuario',// condiciones: '=, <', valores : '1__7'
		},
		order : { 
			variables: 'usuario,', type : 'DESC' 
		},
		limit : {
			start: 0, end: 2
		}
	}

	// ejemplo llamar función para seleccionar retorna objeto de resultados obtenidos
	select('tabla1',jsonSelect)
	.then(function(obj){
		console.log(obj)
	})
	.catch(function(msj){
		console.error(msj)
	})

	let jsonInsert = {
		cols : '11__usuario prueba 1__DOM__25',
	}
	// ejemplo llamar función para insertar retorna objeto de datos insertados
	insert('t1', jsonInsert)
	.then(function(obj){
		console.warn(obj)
	})
	.catch(function(msj){
		console.error(msj)
	})

	
}
