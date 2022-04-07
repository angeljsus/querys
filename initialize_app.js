const { db, select, insert } = require(__dirname + '\\js\\querys.js');
document.addEventListener('DOMContentLoaded', init)


function init(){
	let jsonObject = {
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

	select('tabla1', jsonObject)
	
}
