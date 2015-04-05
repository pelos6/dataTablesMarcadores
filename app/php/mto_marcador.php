<?php

/* Database connection information */
include("mysqlMarcador.php");

/*
 * Local functions
 */

function fatal_error($sErrorMessage = '')
{
    header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error');
    die($sErrorMessage);
}

/*
 * MySQL conexión. Común a todas las acciones.
 */
if (!$gaSql['link'] = mysql_pconnect($gaSql['server'], $gaSql['user'], $gaSql['password'])) {
    fatal_error('Could not open connection to server');
}

if (!mysql_select_db($gaSql['db'], $gaSql['link'])) {
    fatal_error('Could not select database ');
}

mysql_query('SET names utf8');
//error_log (" DEBUG: la acción ".$_REQUEST['accion']);
error_log(" DEBUG: la acción " . $_POST['accion']);

/*
 * Recuperamos los datos de la pantalla y los filtramos.
 */
// filtra la entrada permitiendo ñ y acentos ...
$accion = filter_input(INPUT_POST, "accion", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);

switch ($accion) {
    case 'cargarTabla':
         /* Easy set variables
         */
        // DB table to use
         $table = 'vMarcadoresImportados';      
        // Table's primary key
        $primaryKey = 'idMarcador';       
        // Array of database columns which should be read and sent back to DataTables.
        // The `db` parameter represents the column name in the database, while the `dt`
        // parameter represents the DataTables column identifier. In this case simple
        // indexes
        $columns = array(
            array(
                'db' => 'idMarcador',
                'dt' => 'idMarcador'
            ),
            array(
                'db' => 'hrefMarcador',
                'dt' => 'hrefMarcador'
            ),
            array(
                'db' => 'urlMarcador',
                'dt' => 'urlMarcador'
            ),
            array(
                'db' => 'conceptoMarcador',
                'dt' => 'conceptoMarcador'
            )
        );        
        // SQL server connection information
        $sql_details = array(
            'user' => $gaSql['user'],
            'pass' => $gaSql['password'],
            //'db'   => 'datatables',
            'db' => $gaSql['db'] ,
            'host' => $gaSql['server']
        );
        require('ssp.class.php');
        
        echo json_encode(
        // SSP::simple( $_GET, $sql_details, $table, $primaryKey, $columns )
            SSP::simple($_POST, $sql_details, $table, $primaryKey, $columns));
        
       /* $mensaje = "Carga correcta de la tabla";
        $estado  = 0;*/
        
        break;
    // Creando el Marcador y las clinicas asociadas
    case 'crearMarcador':
        $urlMarcador          = filter_input(INPUT_POST, "urlMarcador", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);
        $conceptoMarcador          = filter_input(INPUT_POST, "conceptoMarcador", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);
        // en la select meto el auto incremental para idMarcador
        $query = "INSERT INTO marcadoresImportados (idMarcador, urlMarcador, conceptoMarcador) ";
        $query = $query . "select max(idMarcador) + 1 , '" . $urlMarcador . "' , '" . $conceptoMarcador . "' from marcadoresImportados ";
        error_log("DEBUG: la query primera " . $query);
        
        /*En función del resultado correcto o no, mostraremos el mensaje que corresponda*/
        $query_res = mysql_query($query);
        
        // Comprobar el resultado
        if (!$query_res) {
            $mensaje = 'Error en la consulta: ' . mysql_error() . "\n";
            error_log("El ERROR de la consulta " . $mensaje);
            $estado = mysql_errno();
        } else {
            $mensaje = "Creación correcta";
            $estado  = 0;
        }
     
        break;
    case 'editarMarcador':
        $urlMarcador          = filter_input(INPUT_POST, "urlMarcador", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);
        $conceptoMarcador = filter_input(INPUT_POST, "conceptoMarcador", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);
        $idMarcador = filter_input(INPUT_POST, "idMarcador", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);
        /* Consulta UPDATE */
        $query = "UPDATE marcadoresImportados SET urlMarcador = '" . $urlMarcador . "', conceptoMarcador = '" . $conceptoMarcador . "'  WHERE idMarcador = '" . $idMarcador . "' ";
        error_log("DEBUG: la query de update " . $query);
        
        /*En función del resultado correcto o no, mostraremos el mensaje que corresponda*/
        $query_res = mysql_query($query);
        
        // Comprobar el resultado
        if (!$query_res) {
            $mensaje = 'Error en la consulta: ' . mysql_error() . "\n";
            error_log("El ERROR de la consulta " . $mensaje);
            $estado = mysql_errno();
        } else {
            $mensaje = "Actualización correcta";
            $estado  = 0;
        }
        break;
    case 'borrarMarcador':
        $idMarcador = filter_input(INPUT_POST, "idMarcador", FILTER_SANITIZE_STRING, FILTER_FLAG_ENCODE_AMP);
        /* Consulta DELETE marcador*/
        $query = "DELETE FROM marcadoresImportados WHERE idMarcador = '" . $idMarcador . "' ";
        error_log("DEBUG: la query de delete 1 " . $query);
        /*En función del resultado correcto o no, mostraremos el mensaje que corresponda*/
        $query_res = mysql_query($query);
        // Comprobar el resultado
        if (!$query_res) {
            $mensaje = 'Error en la consulta 1 de borrado de clinicas de doctor : ' . mysql_error() . "\n";
            error_log("El ERROR de la consulta 1 " . $mensaje);
            $estado = mysql_errno();
        } else {
             $mensaje = "Borrado correcto del marcador ";
            $estado = 0;
        }
        break;
}
/* la accion cargar tabla tiene ya su respuesta */
if ($accion != 'cargarTabla') {
    $resultado   = array();
    $resultado[] = array(
        'mensaje' => $mensaje,
        'estado' => $estado
    );
    echo json_encode($resultado);
}
?>
