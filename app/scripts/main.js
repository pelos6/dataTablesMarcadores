console.log('\'Allo \'Allo! marcadores!!!');
'use strict';

$(document).ready(function() {
// la validación de la url mas localhost y file
jQuery.validator.addMethod("urlLocalhost", function(value, element) {
    console.log("en el metodo " + value);
    if (value.indexOf('localhost') != -1) {
        return true;
    } else if (value.indexOf('file') != -1) {
        return true;
    }else {
        // contributed by Scott Gonzalez: http://projects.scottsplayground.com/iri/
        return this.optional(element) || /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
    }
}, "Debes introducir una url o al menos algo que lo parezca o localhost");
    // Las validaciones del formulario crearMarcador
    var validatorCrear = $('#crearMarcador').validate({
        rules: {
            conceptoMarcadorCrear: {
                required: true,
                minlength: 2,
                maxlength: 400
            },
            urlMarcadorCrear: {
                required: true,
                minlength: 10,
                maxlength: 400,
                urlLocalhost: true
                    //  url: true -- pero no admite localhost
            }
        },
        // unos cuantos mensajes personalizados
        messages: {
            conceptoMarcadorCrear: {
                required: "Para crear un marcador es necesario algo que explique su concepto",
                minlength: "El concepto del marcador debe tener al menos {0} digitos", // {0} es el valor del primer parametro 
                maxlength: "El concepto del marcador debe tener como mucho {0} digitos"
            },
            urlMarcadorCrear: {
                required: "Para crear un marcador es necesario una URL",
                minlength: "La URL del marcador debe tener al menos {0} digitos", // {0} es el valor del primer parametro 
                maxlength: "La URL del marcador debe tener como mucho {0} digitos"
            }
        },
        submitHandler: function(form) {
            console.log("en el boton  submitHandler botonConfirmarCrearMarcador");
            //  mievento.preventDefault();
            // no es necesario el idmarcador pues lo genera el programa con un secuencial
            // var idmarcador = $("#idmarcadorEditar").val();
            var urlMarcadorCrear = $("#urlMarcadorCrear").val();
            var conceptoMarcadorCrear = $("#conceptoMarcadorCrear").val();
            console.log("la url a insertar " + urlMarcadorCrear);
            $.ajax({
                type: 'POST',
                dataType: 'json',
                // un unico php para todas las acciones
                url: "php/mto_marcador.php",
                async: false,
                //estos son los datos que queremos usar, en json:
                data: {
                    accion: 'crearMarcador', // la acción que ejecuto el php es un parámetro más
                    urlMarcador: urlMarcadorCrear,
                    conceptoMarcador: conceptoMarcadorCrear
                },
                error: function(xhr, status, error) {
                    //el error se muestra con growl
                    $.growl.error({
                        message: "Error al crear un marcador!" + error
                    });
                },
                success: function(data) {
                    //obtenemos el mensaje del servidor, es un array!!!
                    //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                    var $mitabla = $("#miTabla").dataTable({
                        bRetrieve: true
                    });
                    //actualizamos datatables:
                    $mitabla.fnDraw();
                    $.growl({
                        title: "Exito!",
                        // colocando el mensaje centrado arriba ... manias ...
                        location: "tc",
                        size: "large",
                        style: "warning",
                        message: "El marcador ha sido creado con exito"
                    });
                    $('#modal-crear').modal('hide');
                },
                complete: {
                    //si queremos hacer algo al terminar la petición ajax

                }
            });
        }
    });
    // Las validaciones del formulario editarmarcador
    // atención que van con name y no con id
    var validatorEditar = $('#editarMarcador').validate({
        rules: {
            urlMarcadorEditar: {
                required: true,
                minlength: 10,
                maxlength: 400,
                urlLocalhost: true
                    //  url: true -- pero no admite localhost
            },
            conceptoMarcadorEditar: {
                required: true,
                minlength: 2,
                maxlength: 400
            }
        },
              // unos cuantos mensajes personalizados
        messages: {
            conceptoMarcadorEditar: {
                required: "Para editra un marcador es necesario algo que explique su concepto",
                minlength: "El concepto del marcador debe tener al menos {0} digitos", // {0} es el valor del primer parametro 
                maxlength: "El concepto del marcador debe tener como mucho {0} digitos"
            },
            urlMarcadorEditar: {
                required: "Para editar un marcador es necesario una URL",
                minlength: "La URL del marcador debe tener al menos {0} digitos", // {0} es el valor del primer parametro 
                maxlength: "La URL del marcador debe tener como mucho {0} digitos"
            }
        },
        submitHandler: function(form) {
            console.log("en el boton  submitHandler botonConfirmarEditarmarcador");
            //  mievento.preventDefault();
            var idMarcador = $("#idMarcadorEditar").val();
            var urlMarcador = $("#urlMarcadorEditar").val();
            var conceptoMarcador = $("#conceptoMarcadorEditar").val();
            $.ajax({
                type: 'POST',
                dataType: 'json',
                // un unico php para todas las acciones
                url: "php/mto_marcador.php",
                async: false,
                //estos son los datos que queremos usar, en json:
                data: {
                    accion: 'editarMarcador', // la acción que ejecuto el php es un parámetro más
                    idMarcador: idMarcador,
                    urlMarcador: urlMarcador,
                    conceptoMarcador: conceptoMarcador
                },
                error: function(xhr, status, error) {
                    //el error se muestra con growl
                    $.growl.error({
                        message: "Error al editar un marcador!" + error
                    });
                },
                success: function(data) {
                    //obtenemos el mensaje del servidor, es un array!!!
                    //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                    var $mitabla = $("#miTabla").dataTable({
                        bRetrieve: true
                    });
                    //actualizamos datatables:
                    $mitabla.fnDraw();
                    $.growl({
                        title: "Exito!",
                        // colocando el mensaje centrado arriba ... manias ...
                        location: "tc",
                        size: "large",
                        style: "warning",
                        message: "El marcador ha sido editado con exito"
                    });
                    $('#modal-editar').modal('hide');
                },
                complete: {
                    //si queremos hacer algo al terminar la petición ajax

                }
            });
        }
    });

    /* Limpiamos los formularios de crear y editar */
    $('#modal-crear').on('hidden.bs.modal', function() {
        validatorCrear.resetForm();
    })
    $('#modal-editar').on('hidden.bs.modal', function() {
        validatorEditar.resetForm();
    });
    /* mas limpio con el código anterior ...
    $("#botonCancelarEditarmarcador").click(function() {
        validatorEditar.resetForm();
    });
    $("#botonCancelarCrearmarcador").click(function() {
        validatorCrear.resetForm();
    });
    $(".close").click(function() {
        validatorEditar.resetForm();
        validatorCrear.resetForm();
    });
    */
    // cargando la tabla con dataTable
    var miTabla = $('#miTabla').DataTable({
        'processing': true,
        'serverSide': true,
        //'ajax': 'php/cargar_marcadores_clinicas.php',
        'ajax': {
            type: 'POST',
            dataType: 'json',
            // un unico php para todas las acciones
            url: "php/mto_marcador.php",
            async: false,
            //estos son los datos que queremos usar, en json:
            data: {
                accion: 'cargarTabla'
            }
        },
        // 'ajax': 'php/cargar_marcadores_clinicas.php',
        'language': {
            'sProcessing': 'Procesando...',
            'sLengthMenu': 'Mostrar _MENU_ registros',
            'sZeroRecords': 'No se encontraron resultados',
            'sEmptyTable': 'Ningún dato disponible en esta tabla',
            'sInfo': 'Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros',
            'sInfoEmpty': 'Mostrando registros del 0 al 0 de un total de 0 registros',
            'sInfoFiltered': '(filtrado de un total de _MAX_ registros)',
            'sInfoPostFix': '',
            'sSearch': 'Buscar:',
            'sUrl': '',
            'sInfoThousands': ',',
            'sLoadingRecords': 'Cargando...',
            'oPaginate': {
                'sFirst': 'Primero',
                'sLast': 'Último',
                'sNext': 'Siguiente',
                'sPrevious': 'Anterior'
            },
            'oAria': {
                'sSortAscending': ': Activar para ordenar la columna de manera ascendente',
                'sSortDescending': ': Activar para ordenar la columna de manera descendente'
            }
        },
        'columns': [{
            'data': 'hrefMarcador'
        }, {
            'data': 'conceptoMarcador'
        }, {
            'data': 'urlMarcador'
        }, {
            'data': 'idMarcador',
            /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
            botón de edición o borrado*/
            'render': function(data) {
                return '<a href="#modal-editar" class="btn btn-primary editarbtn" data-toggle="modal"  data-backdrop="static" >Editar</a>';
            }
        }, {
            'data': 'idMarcador',
            /*añadimos las clases editarbtn y borrarbtn para procesar los eventos click de los botones. No lo hacemos mediante id ya que habrá más de un
            botón de edición o borrado*/
            'render': function(data) {
                return '<a href="#modal-borrar" class="btn btn-warning borrarbtn" data-toggle="modal"  data-backdrop="static" >Borrar</a>';
                // return '<button id=' + data + ' class="btn btn-warning borrarbtn " >Borrar</button>';
            }
        }],
        "columnDefs": [{
            "targets": [2],
            "visible": false,
            "searchable": false
        }]
    });
    // Apply the search
    miTabla.columns().every(function() {
        var that = this;
        $('input', this.footer()).on('keyup change', function() {
            that
                .search(this.value)
                .draw();
        });
    });

    // --------CREAR marcador ------
    // Lo que pasa al usar el botón crear marcador.
    // Este botón esta desde el principio de la carga de la página.
    $("#boton-crear-marcador").click(function(e) {
        console.log('en el boton-crear-marcador');
        // valores a vacio para evitar recarga con valores anteriores
        $('#urlMarcadorCrear').val('');
    });

    // --------CREAR marcador - GUARDAR  ------
    // lo que pasa al usar el boton Guardar del formulario crear
    $("#botonGuardarCrearMarcador").click(function(mievento) {
        /** ya esta controlado en el validate **/
        // la validación del formulario para crear marcador
        console.log('en el botonGuardarCrearMarcador');
        // mievento.preventDefault();
        /***/

    });
    // --------EDITAR marcador ------
    // lo que pasa al usar el botón editar para cada marcador 
    // como los botones se crean con datatables no estan al inicio. 
    // por eso se referencian a traves de #tabla y con on
    $('#tabla').on('click', '.editarbtn', function() {
        /* marcador = $(this).attr('nombremarcador');
         console.log("en editar marcador " + marcador);*/
        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        $('#idMarcadorEditar').val(aData.idMarcador);
        $('#urlMarcadorEditar').val(aData.urlMarcador);
        $('#conceptoMarcadorEditar').val(aData.conceptoMarcador);

        console.log('en el boton-editar-marcador ' + aData.idMarcador + ' ' + aData.hrefMarcador);

    });
    // --------EDITAR marcador - GUARDAR  ------
    // lo que pasa al usar el boton Guardar del formulario editar
    $("#botonGuardarEditarMarcador").click(function(mievento) {
        console.log("en el boton botonGuardarEditarMarcador "+ validatorCrear);
    });
    /*    $('#tabla tbody').on('click', 'tr', function() {
            console.log(miTabla.row(this).data());
        });*/
    // --------BORRAR marcador ------
    // lo que pasa al usar el botón borrar para cada marcador 
    $('#tabla').on('click', '.borrarbtn', function() {
        /*     marcador = $(this).attr('idmarcador');
           console.log("en borrar marcador " + marcador);*/
        var nRow = $(this).parents('tr')[0];
        var aData = miTabla.row(nRow).data();
        $('#idMarcadorBorrar').val(aData.idMarcador);
        $('#hrefMarcadorBorrar').val(aData.hrefMarcador);
        $('#modal-borrar p').html("¿Seguro que quiere borrar el marcador " + aData.hrefMarcador + "?");
        console.log('en el boton-borrar-marcador ' + aData.idMarcador + ' ' + aData.hrefMarcador);

    });
    // --------BORRAR marcador - BORRAR  ------
    // lo que pasa al usar el boton Borrar del formulario borrar
    $("#botonBorrarBorrarMarcador").click(function(mievento) {
        console.log("en el boton botonBorrarBorrarmarcador");

        var idMarcador = $("#idMarcadorBorrar").val();

        $.ajax({
            type: 'POST',
            dataType: 'json',
            // un unico php para todas las acciones
            url: "php/mto_marcador.php",
            async: false,
            //estos son los datos que queremos usar, en json:
            data: {
                accion: 'borrarMarcador',
                idMarcador: idMarcador
            },
            error: function(xhr, status, error) {
                // mostraríamos alguna ventana de alerta con el error
                // por ejemplo la base de datos caida
                $.growl.error({
                    // colocando el mensaje top centre ...
                    location: "tc",
                    message: "Error al borrar un marcador!" + error
                });
            },
            success: function(data) {
                //obtenemos el mensaje del servidor, es un array!!!
                //var mensaje = (data["mensaje"]) //o data[0], en función del tipo de array!!
                //actualizamos datatables:
                console.log(data[0].estado + ' ' + data[0].mensaje);
                if (data[0].estado == 0) {
                    var $mitabla = $("#miTabla").dataTable({
                        bRetrieve: true
                    });
                    $mitabla.fnDraw();
                    $.growl({
                        title: "Exito!",
                        // colocando el mensaje top centre ...
                        location: "tc",
                        size: "large",
                        style: "warning",
                        message: "El marcador ha sido borrado con exito"
                    });
                } else {
                    $.growl.error({
                        // colocando el mensaje top centre ...
                        location: "tc",
                        message: "Error al borrar un marcador!" + data[0].mensaje
                    });
                }
            },
            complete: function(data) {
                //si queremos hacer algo al terminar la petición ajax
            }
        });

    });

});


/*// Botones con personalidad
$("button.boton").mousedown(function() {
    $(this).animate({
        'top': '5px',
        'boxShadowY': '0'
    }, 100);
}).mouseup(function() {
    $(this).animate({
        'top': '0',
        'boxShadowY': '5px'
    }, 100);
});*/
// firma circular
var circ = document.getElementById('circular');
var textarr = circ.textContent.split('');
circ.textContent = '';
for (var i = 0; i < textarr.length; i++) {
    circ.innerHTML += '<span style="-webkit-transform: rotate(' + (((i + 1) * 16) - 16) + 'deg);transform: rotate(' + (((i + 1) * 16) - 16) + 'deg);">' + textarr[i] + '</span>';
}
