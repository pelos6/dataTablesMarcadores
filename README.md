# Mantenimiento de marcadores

## Es una primera versión sin control de acceso. hay una versión con control de acceso con php

Aprovechando la practica del CFGS -DAWEC.
Una aplicación para gestionar e importar los marcadores de Chrome usando datatables, mysql, ajax y php ...


1. Carga de marcadores
   - Exportación en html de los marcadores de Chrome.
   - Creo la tabla marcadoresImportados con marcadores.sql
   - Uso extraeMarcadores para insertar en la tabla marcadoresImportados los marcadores. 

2. Html, js y css
   - Uso Yeoman para crear el esqueleto de la aplicacíon.
   - grunt para gestionar los js requeridod, dataTables, jqueryValidate, bootstrap y growl

3. La busqueda se puede hacer en general con el searh superior o por columna con los searchs inferiores 
