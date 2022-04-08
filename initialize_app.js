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

	// ejemplo llamar función para seleccionar
	select('tabla1', jsonObject)

	let jsonInsert = 
	{
		cols : '8,texto prueba 1 log,ARTD961115F982,5',
		keyCol : 'id_persona,rfc_persona',
		posKey: '1,3'
	}
	// ejemplo llamar función para insertar
	insert('t1', jsonInsert);

	
}
