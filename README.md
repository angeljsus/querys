# CONSULTAS SQLITE
### `select(tableName, objectJson)`

#### Descripción
La función realiza consultas de tipo `SELECT` para cualquier tabla pasada por parámetro, y con las propiedades recibidas por el `objectJson`. La función regresa un objeto con la información encontrada dentro de la tabla. 

#### tableName 
Tabla donde se realiza la consulta.

#### objectJson
##### Propiedades
- **cols (string)**: nombre de las columnas de la tabla a retornar con los valores de la consulta separadas por coma `"cols":"id,nombre,ciudad"`, en caso de no existir la propiedad `cols` dentro del objeto la consulta selecciona todos los campos. Es posible retornar valores ejecutando funciones dentro de las columnas `"cols":"COUNT(*)"`.
    ```
    "cols":"id,nombre,ciudad"
    
    // SELECT id,nombre,ciudad FROM tableName
    
    "cols":"COUNT(*) total"
    // SELECT COUNT(*) total FROM tableName
    ```
- **where (json)**: condiciones que contendrá la consulta:
    - **variables (string) * :** nombre de las columnas de la tabla a comparar `"variables":"ciudad,edad"`.
     - **valores (string) * :** valores para las columnas a comparar dentro de la propiedad *variables* del *where* estos valores deben ser separados por doble guion bajo `"valores":"San Luis Potosí__30"` 
        ``` 
        ...
            "where": {
                "variables":"ciudad,edad",
                "valores":"San Luis Potosí__30"
            }
        // ... WHERE ciudad = "San Luis Potosí" AND edad = 30
        ```
    - **condiciones (string):** conjunto de condiciones enviadas para la comparación de datos dentro de la consulta `"condiciones":"=,<"`, si no existe este valor ejecuta la comparación `=`.
        ``` 
        ...
            "where": {
                "variables":"ciudad,edad",
                "valores":"San Luis Potosí__30",
                "condiciones":"=,<"
            }
        // ... WHERE ciudad = "San Luis Potosí" AND edad < 30
        ```
- **group (json)**: 
     - **variables (string) * :** nombre de las columnas de la tabla para agrupar `"variables":"edad"`.
        ```
        ...
            "group":{
                "variables":"edad"
            }
            // ... GROUP BY edad
        ```
    - **valores (string) * :** valores para las columnas a comparar dentro de la propiedad *variables* dentro de *group*, estos valores deben ser separados por doble guion bajo `"valores":"30"` 
        ```
        ...
            "group":{
                "variables":"edad",
                "valores":"30"
            }
            // ... GROUP BY edad = 30
        ```
    - **condiciones (string):** conjunto de condiciones enviadas para la comparación de datos dentro de la consulta `"condiciones":"=,<"`, si no existe este valor ejecuta la comparación `=`
        ```
        ...
            "group":{
                "variables":"edad",
                "valores":"30",
                "condicion":"<"
            }
            // ... GROUP BY edad < 30
        ```
- **order (json)**:
    - **variables (string):** nombre de las columnas de la tabla para ordenar.
        ```
        ...
            "order": {
                "variables":"nombre,edad"
            }
            //... ORDER BY nombre, edad
        ```
    - **type (string):** tipo de ordenamiento los valores pueden ser `ASC` ascendente o `DESC` descendente.
        ```
        ...
            "order": {
                "variables":"nombre,edad",
                "type":"DESC"
            }
            // ... ORDER BY nombre, edad DESC
        ```
- **limit (json):**
    - **start (integer):** límite inicial de resultados.
        ```
        ...
            "limit": {
                "start":"10"
            }
            // ... LIMIT 10
        ```
    - **end (integer):** límite final de resultados
        ```
        ...
            "limit": {
                "start":"10",
                "end":"15"
            }
            // ... LIMIT 10,15
        ```
### `insert(tableName, objectJson)`
#### Descripción
Con la función inserta la información recibida dentro del `objectJson`, y devuelve un objeto (tipo arreglo) con la información insertada.
#### tableName 
Tabla donde se realiza la consulta.

#### objectJson
##### Propiedades
- **cols (string)**: valores a insertar dentro de cada columna de la tabla, cada valor debe ser separado por dos guiones bajos `__`
    ```
    {
        "cols":"89__Sammy Lorem__st Wally__Kansas City"
    }
    // INSERT INTO tableName VALUES (89,"Sammy Lorem","st Wally","Kansas City");
    ```
### `update(tableName, objectJson)`
#### Descripción
La función ejecuta consultas para la actualización de registros de la tabla. Devuelve el número de filas que recibieron actualización.
#### tableName 
Tabla donde se realiza la consulta.
#### objectJson
##### Propiedades
- **cols (string)***: nuevos valores a almacenar dentro de cada columna que se requiere actualizar, los valores van separados por doble guion bajo `__`
- **colsNames(string)***: nombre de las columnas que serán actualizadas con la consulta.
    ```
    {
        "cols":"New York",
        "colsNames":"ciudad"
    }
    // UPDATE tableName SET ciudad = "New York"
    ```
- **where (json)**: condiciones que contendrá la consulta:
    - **variables (string) * :** nombre de las columnas de la tabla a comparar `"variables":"ciudad,edad"`.
     - **valores (string) * :** valores para las columnas a comparar dentro de la propiedad *variables* del *where* estos valores deben ser separados por doble guion bajo `"valores":"New York__30"` 
        ``` 
        ...
            "where": {
                "variables":"ciudad,edad",
                "valores":"New York__30"
            }
        // ... WHERE ciudad = "New York" AND edad = 30
        ```
    - **condiciones (string):** conjunto de condiciones enviadas para la comparación de datos dentro de la consulta `"condiciones":"=,<"`, si no existe este valor ejecuta la comparación `=`.
        ``` 
        ...
            "where": {
                "variables":"ciudad,edad",
                "valores":"New York__30",
                "condiciones":"=,<"
            }
        // ... WHERE ciudad = "New York" AND edad < 30
        ```
### `delete(tableName, objectJson)`
#### Descripción
La función elimina el registro si es que existe dentro de la tabla. Devuelve el número de filas removidas de la tabla.
#### tableName 
Tabla donde se realiza la consulta.

#### objectJson
##### Propiedades
- **where (json)**: condiciones que contendrá la consulta:
    - **variables (string) * :** nombre de las columnas de la tabla a comparar `"variables":"ciudad,edad"`.
     - **valores (string) * :** valores para las columnas a comparar dentro de la propiedad *variables* del *where* estos valores deben ser separados por doble guion bajo `"valores":"New York__30"` 
        ``` 
        ...
            "where": {
                "variables":"ciudad,edad",
                "valores":"New York__30"
            }
        // DELETE FROM tablaName WHERE ciudad = "New York" AND edad = 30
        ```
    - **condiciones (string):** conjunto de condiciones enviadas para la comparación de datos dentro de la consulta `"condiciones":"=,<"`, si no existe este valor ejecuta la comparación `=`.
        ``` 
        ...
            "where": {
                "variables":"ciudad,edad",
                "valores":"New York__30",
                "condiciones":"=,<"
            }
        // ... WHERE ciudad = "New York" AND edad < 30
         ```