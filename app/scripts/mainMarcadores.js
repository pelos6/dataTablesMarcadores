console.log('\'Allo \'Allo! marcadores!!!');
'use strict';
// saco este metodo de additional.methods para no tener que cargar el archivo completo
// lo modifico para que admita espacios en blanco, acentos y la ñ
jQuery.validator.addMethod("validaNombre", function(value, element) {
    return this.optional(element) || /^[a-z ñáéíóú]+$/i.test(value);
}, "Letters only please");
// Las validaciones del formulario crearMarcador
var validatorCrear = $('#crearMarcador').validate({
    rules: {
        urlMarcadorCrear: {
            required: true,
            minlength: 10,
            maxlength: 200
        }
    },
    // unos cuantos mensajes personalizados
    messages: {
        urlMarcadorCrear: {
            required: "Para crear un marcador es necesario una URL"/*,
            digits: "El numero de colegiado solo puede tener numeros",
            minlength: "El número de colegiado debe tener al menos {0} digitos", // {0} es el valor del primer parametro 
            maxlength: "El número de colegiado debe tener como mucho {0} digitos"*/
        }
    },
    submitHandler: function(form) {
        console.log("en el boton  submitHandler botonConfirmarCrearMarcador");
        //  mievento.preventDefault();
        // no es necesario el idmarcador pues lo genera el programa con un secuencial
        // var idmarcador = $("#idmarcadorEditar").val();
        var urlMarcadorCrear = $("#urlMarcadorCrear").val();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            // un unico php para todas las acciones
            url: "php/mto_marcador.php",
            async: false,
            //estos son los datos que queremos usar, en json:
            data: {
                accion: 'crearMarcador', // la acción que ejecuto el php es un parámetro más
               //clinicas: clinicas,
                urlMarcador: urlMarcadorCrear
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
var validatorEditar = $('#editarmarcador').validate({
    rules: {
        nombreEditar: {
            required: true,
            minlength: 2,
            validaNombre: true, // modificado para que admita ñ, acentos, espacios ...
            maxlength: 100
        },
        numeroColegiadoEditar: {
            required: true,
            digits: true, // solo numeros pero no cifras (-12) no es válido
            minlength: 4,
            maxlength: 7
        },
        'seleccionaClinicasEditar[]': {
            required: true,
            minlength: 1
        }
    },
    // unos cuantos mensajes personalizados
    messages: {
        numeroColegiadoEditar: {
            required: "Para modificar un marcador es necesario un numero de colegiado",
            digits: "El numero de colegiado solo puede tener numeros",
            minlength: "El número de colegiado debe tener al menos {0} digitos", // {0} es el valor del primer parametro 
            maxlength: "El número de colegiado debe tener como mucho {0} digitos"
        },
        nombreEditar: {
            required: "Para editar un marcador es necesario un nombre de marcador",
            minlength: "El nombre del marcador debe tener al menos {0} caracteres", // {0} es el valor del primer parametro
            maxlength: "El nombre del marcador no puede tener mas de {0} caracteres",
            validaNombre: "El nombre del marcador solo puede contener letras"
        },
        'seleccionaClinicasEditar[]': {
            required: "Cada marcador editado tiene que tener alguna clínica asignada",
            minlength: "El marcador editado debe tener al menos {0} clinica asignada",
        }
    },
    submitHandler: function(form) {
        console.log("en el boton  submitHandler botonConfirmarEditarmarcador");
        //  mievento.preventDefault();
        var idmarcador = $("#idmarcadorEditar").val();
        var clinicas = $("#seleccionaClinicasEditar").val();
        var nombre = $("#nombreEditar").val();
        var numeroColegiado = $("#numeroColegiadoEditar").val();
        $.ajax({
            type: 'POST',
            dataType: 'json',
            // un unico php para todas las acciones
            url: "php/mto_marcador.php",
            async: false,
            //estos son los datos que queremos usar, en json:
            data: {
                accion: 'editarMarcador', // la acción que ejecuto el php es un parámetro más
                idmarcador: idmarcador,
                clinicas: clinicas,
                nombre: nombre,
                numeroColegiado: numeroColegiado
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
    })
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
$(document).ready(function() {
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
                    }},
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
                    'columns': [ {
                        'data': 'hrefMarcador'
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
                    }]
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
                    $('#idmarcadorEditar').val(aData.idmarcador);
                    $('#nombreEditar').val(aData.nombremarcador);
                    $('#numeroColegiadoEditar').val(aData.numeroColegiado);
                    // $('#clinicasEditar').val(aData.nombreClinica);
                    // pero no funciona con el campo select !!!!
                    // $('#selecClinicas').val(aData.nombreClinica);
                    // cargamos las clinicas por ajax (como todo en este ejercicio ;) usando el metodo post al llamarlo con un objeto ...
                    $('#seleccionaClinicasEditar').load("php/mto_marcador.php", ({
                        idmarcador: aData.idmarcador,
                        accion: 'cargarClinicasmarcador' // la acción que ejecuta el php
                    }));
                    /*******
                    // cargo un array con las clinicas del marcador a editar de la fila
                    console.log (aData.nombremarcador);
                    var clinicas = (aData.nombreClinica).split(',');
                    console.log(clinicas);
                    // pongo los valores de las clinicas cargadas a no seleccionadas aunque ya estan así !!!!
                    $("#modal-editar").find("option").each(function() {
                        $(this).prop('selected', false);
                    });
                    // vuelvo a recorrer las opciones de la select
                    $('#modal-editar').find('option').each(function() {
                        var actual = $(this);
                        // recorro las clinicas del marcador
                        clinicas.forEach(function(element) {
                          //  console.log(clinicas.);
                            // si coincide la de la select con la del marcador
                            if (actual.text() == element) {
                                // la pongo como selecionada
                                actual.prop('selected', true);
                            }
                        });
                    });

                    /*********/
                    console.log('en el boton-editar-marcador ' + aData.idmarcador + ' ' + aData.nombremarcador);

                });
                // --------EDITAR marcador - GUARDAR  ------
                // lo que pasa al usar el boton Guardar del formulario editar
                $("#botonGuardarEditarmarcador").click(function(mievento) {
                    console.log("en el boton botonConfirmarEditarmarcador");
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
