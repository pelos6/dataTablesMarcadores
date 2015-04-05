<?php
// http://librosweb.es/foro/pregunta/308/como-extraer-los-atributos-src-title-y-alt-de-una-imagen-html-mediante-php/
header ('Content-type: text/html; charset=utf-8');
include("mysqlMarcador.php");
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
$doc = new DOMDocument();
$result = $doc->loadHTMLFile('bookmarks_5_4_15.html');
var_dump($result);
error_log("DEBUG: pasado result " .$result);
$tdt = $doc->getElementsByTagName('a');
//$tdt = $doc->getElementsByTagName('href');
//$tdt = $doc->getElementsByTagName('h3');
//$tdt = $doc->getElementsByTagName('h3');
$total_DT = $tdt->length;
error_log("DEBUG: pasado celdas " .$total_DT);

foreach ($tdt as $book) {
    $href   = $book->getAttribute('href');
    echo $book->nodeValue;
    echo "<br>";
    echo "la dirección ".$href;
    echo "<br>";
        // en la select meto el auto incremental para idMarcador
        $query = "INSERT INTO marcadoresimportados (idMarcador, urlMarcador, conceptoMarcador) ";
        $query = $query . "select max(idMarcador) + 1 , '" . $href . "',' ". $book->nodeValue . "' from marcadoresimportados ";
        error_log("DEBUG: la query primera " . $query);
        
        /*En función del resultado correcto o no, mostraremos el mensaje que corresponda*/
        $query_res = mysql_query($query);
        
        // Comprobar el resultado
       /* if (!$query_res) {
            $mensaje = 'Error en la consulta: ' . mysql_error() . "\n";
            error_log("El ERROR de la consulta " . $mensaje);
            $estado = mysql_errno();
        } else {
            $mensaje = "Creación correcta";
            $estado  = 0;
        }*/
}
?>