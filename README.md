# CONSULTAS SLQITE

Librería Javascript que permite la ejecución de consultas a las tablas de una base de datos Sqlite.

## Incluir módulo

Llamar las funciones a ejecutar dentro del código.

```javascript
const { select, insert, update,  deleteReg } = require('./js/querys.js')
```

## Funciones

### `select( tableName, { props } )`

#### Descripción

Ejecuta consultas de tipo `SELECT` para acceder a información almacenada dentro de las tablas de la base de datos.

#### Parámetros

- **tableName** (*string* *):  nombre de la tabla en la que se realizará la consulta de datos.
- **props** (*json* *): objeto con las propiedades y valores que contendrá la consulta, el objeto puede estar vacío `{}` o incluir cualquiera de las siguientes propiedades:
  - **cols** (*string*): nombre de las columnas de la tabla que presentarán la información encontrada. Cada nombre de columna debe ser separado por coma `"cols":"id,nombre,ciudad"`, también es posible retornar valores ejecutando funciones dentro de las columnas `"cols":"COUNT(*)"`.
    ```javascript
    // columnas 
    { "cols":"id,nombre,ciudad"}
    // SELECT id,nombre,ciudad FROM tableName
  
    // función 
    { "cols":"count(*) total" }
    // SELECT count(*) total FROM tableName
    
    // objeto vacío 
    { }
    // SELECT * FROM tableName
    ```
  - **where** *(json)*: carga las condiciones que ejecutará la consulta.
    - **variables** (*string**): nombre de las columnas de la tabla en las que se compararán valores. Las variables deben ir separadas por coma `,`.
    - **valores** (*string**): valores que contendrán las columnas de la tabla puestas en `where.variables`. Cada valor debe ir separado por doble guion bajo `__`.
    - **condiciones** (*string*): conjunto de condiciones enviadas para la comparación de datos dentro de la consulta. En caso de no existir `where.condiciones` la condición será siempre `=` (igual que). Cada condición debe separarse por una coma `,`.
    
    ```javascript
        ...
            // sin condiciones
            "where": {
                "variables":"ciudad,edad",
                "valores":"San Luis Potosí__30"
            }
            // ... WHERE ciudad = "San Luis Potosí" AND edad = 30
            
            // con condiciones
            "where": {
                "variables":"ciudad,edad",
                "valores":"San Luis Potosí__30",
                "condiciones":"=,<"
            }
            // ... WHERE ciudad = "San Luis Potosí" AND edad < 30
    ```
  - **group** *(json)*: agrupa la información que se obtenga con la consulta.
    - **variables** (*string**): nombre de las columnas de la tabla en que se van a agrupar los resultados. Las variables deben ir separadas por coma `,`.
    - **valores** (*string*): si es necesario realizar una comparación en para agrupar los resultados por un valor. Cada valor debe ir separado por doble guion bajo `__`.
    - **condiciones** (*string*): conjunto de condiciones enviadas para la comparación de datos dentro de la consulta. En caso de no existir `group.condiciones` la condición será siempre `=` (igual que). Cada condición debe separarse por una coma `,`.
    ```javascript
    ...
        // por columna
        "group":{
            "variables":"edad,ciudad"
        }
        // ... GROUP BY edad,ciudad
        
        // por columna y valor
        "group":{
            "variables":"edad",
            "valores":30
        }
        // ... GROUP BY edad = 30
        
         // por columna, valor y condición
        "group":{
            "variables":"edad",
            "valores":30,
            "condiciones":"<"
        }
        // ... GROUP BY edad < 30
    ```
  - **order** *(json)*: ordenar los resultados obtenidos por la consulta.
    - **variables** *(string)*: nombre de las columnas de la tabla para ordenar.
    - **type** *(string)*: valor de la manera en que se ordenarán los resultados `ASC` ascendente o `DESC` descendente.
    ```javascript
    ...
        // con columnas
        "order": {
            "variables":"nombre,edad"
        }
        //... ORDER BY nombre, edad
        
        // con tipo de orden
        "order": {
            "variables":"nombre,edad",
            "type":"DESC"
        }
        //... ORDER BY nombre, edad DESC
    ```
  - **limit** *(json)*: limitar la cantidad de resultados a regresar por la consulta.
    - **start** *(number)*: limite total o inicial de resultados.
    - **end** *(number)*: limite final de resultados.
    ```javascript
    ...
        // valor inicial
        "limit": {
            "start":10
        }
        // ... LIMIT 10
        
        // valor inicial y final
        "limit": {
            "start":10,
            "end": 28
        }
        // ... LIMIT 10, 28
    ```
#### Resultados 

La función `select` regresa un objeto de tipo `json` con los datos encontrados por la consulta generada con los parámetros enviados. En caso de no encontrar registros manda un objeto vacio `{}`.
```javascript
    let jsonSelect = {
        "cols" : "id,nombre,apellidos,ciudad,edad",
        "where" : {
            "variables" : "apellidos", 
            "valores": "Masa López",
            "condiciones": "="
        }
    }
    
    select('tabla1', jsonSelect)
     .then(function(respObj){
        // ejemplo contenido del respObj: 
        // { id:98, nombre:"Faustino", apellidos:"Masa López", ciudad:"Puebla", edad:34 }
         console.log(respObj);
     })
     .catch(function(errMsj){
         console.error(errMsj)
     })
```

### `insert( tableName, { props } )`

#### Descripción

Ejecuta consultas de tipo `INSERT` para agregar información dentro de las tablas de la base de datos.

#### Parámetros

- **tableName** (*string* *):  nombre de la tabla en la que se realizará la inserción de datos.
- **props** (*json* *): objeto que contiene la información para insertar dentro de la base de datos.
    - **cols** (*string**): conjunto de valores que para cada columna de la tabla. Cada valor debe ir separado por doble guion bajo `__`.
```javascript
    {
        "cols":"89__Sammy Lorem__st Wally__Kansas City"
    }
    // INSERT INTO tableName VALUES (89,"Sammy Lorem","st Wally","Kansas City");
```
#### Resultados

La función `insert` regresa un objeto de tipo `array` con la información que fue insertada dentro de la base de datos. En caso de no encontrar registros manda el objeto vacio `[]`.
```javascript
    let jsonInsert = {
        "cols" : "89__Sammy Lorem__st Wally__Kansas City",
    }
    
    insert('tabla1', jsonInsert)
     .then(function(respObj){
        // ejemplo contenido del respObj: 
        // ["89","Sammy Lorem","st Wally","Kansas City"]
         console.log(respObj);
     })
     .catch(function(errMsj){
         console.error(errMsj)
     })
```

### `update( tableName, { props } )`

#### Descripción

Ejecuta consultas de tipo `UPDATE` para actualizar registros dentro de las tablas de la base de datos.

#### Parámetros

- **tableName** (*string* *):  nombre de la tabla en la que se actualizará información.
- **props** (*json* *): objeto con las propiedades y valores que contendrá la consulta, el objeto debe incluir las siguientes propiedades:
  - **cols** (*string**): valores que tendrán las columnas de la tabla que serán actualizadas. Cada valor debe ir separado por doble guion bajo `__`.
  - **colsNames** (*string**): nombre de las columnas de la tabla que serán actualizadas. Cada columna debe ir separado por una coma `,`.
    ```javascript
        // actualizará todos los registros
        {
            "cols":"New York",
            "colsNames":"ciudad"
        }
        // UPDATE tableName SET ciudad = "New York"
    ```
  - **where** *(json)*: carga las condiciones que ejecutará la consulta.
    - **variables** (*string**): nombre de las columnas de la tabla en las que se compararán valores. Las variables deben ir separadas por coma `,`.
    - **valores** (*string**): valores que contendrán las columnas de la tabla puestas en `where.variables`. Cada valor debe ir separado por doble guion bajo `__`.
    - **condiciones** (*string*): conjunto de condiciones enviadas para la comparación de datos dentro de la consulta. En caso de no existir `where.condiciones` la condición será siempre `=` (igual que). Cada condición debe separarse por una coma `,`.
    ```javascript
    ...
        // sin condiciciones
        "where": {
            "variables":"ciudad,edad",
            "valores":"New York__30"
        }
        // ... WHERE ciudad = "New York" AND edad = 30
        
        // con condiciciones
        "where": {
            "variables":"ciudad,edad",
            "valores":"New York__30",
            "condiciones":"<"
        }
        // ... WHERE ciudad = "New York" AND edad < 30
    ```
#### Resultados

La función `update` regresa una variable de tipo `integer` con la cantidad de filas actualizadas. En caso de no actualizar registros manda la variable con valor `0`.
```javascript
    let jsonUpdate = {
        cols : '43 st Wally__New york', 
        colsNames: 'direccion,ciudad', 
        where : { variables : 'id,', valores : '89', condiciones : '='
    }
    
    update('tabla1', jsonUpdate)
     .then(function(rowsAffected){
        // ejemplo contenido del rowsAffected: 
        // 1 
         console.log('Filas modificadas: %s', rowsAffected);
         // con log
         // Filas modificadas: 1 
     })
     .catch(function(errMsj){
         console.error(errMsj)
     })
```

### `deleteReg( tableName, { props } )`

#### Descripción

Ejecuta consultas de tipo `DELETE` para eliminar registros dentro de las tablas de la base de datos.

#### Parámetros

- **tableName** (*string* *):  nombre de la tabla en la que se eliminarán registros de información.
- **props** (*json* *): objeto con las propiedades y valores que contendrá la consulta, el objeto puede ir vacio para eliminar todos los registros de una tabla `{}` o puede  incluir las siguientes propiedades:
    - **where** *(json)*: carga las condiciones que ejecutará la consulta.
        - **variables** (*string**): nombre de las columnas de la tabla en las que se compararán valores. Las variables deben ir separadas por coma `,`.
        - **valores** (*string**): valores que contendrán las columnas de la tabla puestas en `where.variables`. Cada valor debe ir separado por doble guion bajo `__`.
        - **condiciones** (*string*): conjunto de condiciones enviadas para la comparación de datos dentro de la consulta. En caso de no existir `where.condiciones` la condición será siempre `=` (igual que). Cada condición debe separarse por una coma `,`.
        ```javascript
            // objeto vacio
            {}
            // DELETE FROM tablaName
             
            // sin condiciones
            "where": {
                "variables":"ciudad,id",
                "valores":"New York__30"
            }
            // DELETE FROM tablaName WHERE ciudad = "New York" AND id = 30
            
            // con condiciones
            "where": {
                "variables":"ciudad,edad",
                "valores":"New York__30",
                "condiciones":"<"
            }
            // DELETE FROM tablaName WHERE ciudad = "New York" AND id < 30
        ```
#### Resultados

La función `deleteReg` regresa una variable de tipo `integer` con la cantidad de filas eliminada. En caso de no eliminar registros manda la variable con valor `0`.
```javascript
    let jsonDelete = {
        where : { variables : 'id,', valores : '9', condiciones : '<'
    }
    
    deleteReg('tabla1', jsonDelete)
     .then(function(rowsAffected){
        // ejemplo contenido del rowsAffected: 
        // 1 
         console.log('Filas eliminadas: %s', rowsAffected);
         // con log
         // Filas eliminadas: 8 
     })
     .catch(function(errMsj){
         console.error(errMsj)
     })
```