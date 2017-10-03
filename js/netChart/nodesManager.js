var list_images = {}


var
    $ = function (id) {
        return document.getElementById(id);
    },
    container = $('example1'),
    exampleConsole = $('example1console'),
    autosave = $('autosave'),
    load = $('load'),
    save = $('save'),
    reload = $('reload'),
    autosaveNotification,
    hot,
    number,
    selectedColumn,
    colorData = [],
    colors = ['#d53e4f', '#3288bd', '#66c265', '#4d4d4d'];

while (color = colors.shift()) {
    colorData.push([
        [color]
    ]);
}

hot = new Handsontable(container, {
    startRows: 1,
    dataSchema:
    {
        id: 1,
        name: null,
        className: null,
        shape: null,
        text: null,
        image: null,
        image2: null,
        loaded: "true",
        style: {
            lineWidth: "10",
            radius: null,
            lineColor: null
        }
    },
    columns: [
        { data: "id" },
        { data: "name" },
        {
            data: "className",
            type: 'dropdown',
            source: ['personas', 'bienes', 'empresas', 'vehiculos', 'conectores', 'cuentasbancarias']
        },
        {
            data: "image",
            renderer: coverRenderer,
            type: 'dropdown',
            source: ['/images/bienes.png', '/images/dinero.png', '/images/empresas.png', '/images/enemigo.png', '/images/familia.png', '/images/movilidad.png']
        },
        {
            data: "image2",
            renderer: coverRenderer,
            type: 'dropdown',
            source: ['/images/bienes.png', '/images/dinero.png', '/images/empresas.png', '/images/enemigo.png', '/images/familia.png', '/images/movilidad.png']
        },
        { data: "text" }, {
            data: "style.radius",
            type: 'dropdown',
            source: ['60', '100', '150']
        }, {
            data: "style.lineColor",
            type: 'handsontable',
            renderer: colorRenderer,
            allowInvalid: false,
            handsontable: {
                data: colorData,
                autoColumnSize: true,
                columns: [{ renderer: colorDropdownRenderer }]

            }
        },
        {
            data: "shape",
            renderer: hiddenText
            // type: 'dropdown',
            // source: ['circle', 'square', 'triangle']
        },
        {
            data: "loaded",
            renderer: hiddenText
        },
        {
            data: "style.lineWidth",
            // type: 'dropdown',
            // source: ['5', '10', '15']
        }
    ],
    currentRowClassName: 'currentRow',
    rowHeaders: true,
    rowHeights: 55,
    colHeaders: ["ID", "Nombre", "Tipo de nodo", "Icono", "Foto", "Descripción", "Tamaño", "Color del borde", "Figura", "Cargado", "Longitud de línea"],
    colWidths: [1, 100, 100, 100, 100, 300, 100, 100, 1, 1, 1],
    stretchH: 'all',
    persistentState: true,
    contextMenu: true,
    afterChange: function (change, source) {
        if (source === 'loadData') {
            return; //don't save this change
        }
        if (!autosave.checked) {
            return;
        }
        clearTimeout(autosaveNotification);
        ajax('json/save.json', 'GET', JSON.stringify({ data: change }), function (data) {
            exampleConsole.innerText = 'Autosaved (' + change.length + ' ' + 'cell' + (change.length > 1 ? 's' : '') + ')';
            autosaveNotification = setTimeout(function () {
                exampleConsole.innerText = 'Changes will be autosaved';
            }, 1000);
        });
    },
    afterCreateRow: function (index) {
        updateIDs(hot)
    },
    afterRemoveRow: function (index) {
        updateIDs(hot)
    },
});

hot.addHook('afterChange', function () {
    if (hot.getSelected() != undefined) {
        var row = hot.getSelected()[0]
        var column = hot.getSelected()[1]
        var imageXtype = {
            "personas": "persona.png", "bienes": "bienes.png", "empresas": "local.png",
            "vehiculos": "vehiculo.png", "conectores": "reporte.png", "cuentasbancarias": "cuentas.png"
        }

        var classNameValue = hot.getDataAtCell(row, column)
        if (column == 2) {
            if (imageXtype[classNameValue] == undefined)
                hot.getSourceData()[row].image = "/images/logo/preloader.gif"
            else
                hot.getSourceData()[row].image = "/images/logo/" + imageXtype[classNameValue]
            if (classNameValue === "empresas" || classNameValue === "bienes" || classNameValue === "cuentasbancarias") {
                hot.getSourceData()[row].shape = "square"
            } else if (classNameValue === "conectores" || classNameValue === "personas") {
                hot.getSourceData()[row].shape = "circle"
            } else if (classNameValue === "vehiculos") {
                hot.getSourceData()[row].shape = "triangle"
            }
        }
    }

}
)

hot.updateSettings({
    contextMenu: {
        callback: function (key, options) {
            if (key === 'edit') {
                number = (hot.getSelected()[0]);
                var dialogScrollable = new mdc.dialog.MDCDialog(document.querySelector('#mdc-dialog-with-list'));
                dialogScrollable.show();
                selectedColumn = (hot.getSelected()[1]);
                list_images = {}
                var testImage = new Image()
                var canvas = document.getElementById("canvas2");
                canvas.width = 100;
                canvas.height = 100;
                canvas.style.display = "none";
                var x = 0;
                var y = 0;
                var imgWidth = 100;
                var imgHeight = 100;
                var auxiliarImage
                var ctx = canvas.getContext("2d");


                $('#accept').on('click', function () {
                    if (currentImage != undefined) {

                        document.getElementById("crop").src = currentImage

                        testImage.src = currentImage
                        testImage.onload = function () {
                            ctx.beginPath();
                            ctx.arc(50, 50, imgHeight * 0.5, 0, Math.PI * 2, true);
                            ctx.closePath();
                            ctx.clip();

                            ctx.drawImage(testImage, x, y, imgWidth, imgHeight);

                            auxiliarImage = canvas.toDataURL()
                            list_images[number] = canvas.toDataURL()
                            for (var n in list_images) {
                                if (selectedColumn == 3) {
                                    hot.getSourceData()[n].image = list_images[n];
                                } else if (selectedColumn == 4)
                                    hot.getSourceData()[n].image2 = list_images[n];
                            }
                            hot.loadData(hot.getSourceData())
                        }
                        // console.log(auxiliarImage)
                    }
                })

            }
        },
        items: {
            'row_above': {
                name: function () {
                    return "<i class=\"mdl-color-text--grey material-icons\" role=\"presentation\" style=\"font-size: 14px;\">keyboard_arrow_up</i> Insertar fila encima";
                }
            }, 'row_below': {
                name: function () {
                    return "<i class=\"mdl-color-text--grey material-icons\" role=\"presentation\" style=\"font-size: 14px;\">keyboard_arrow_down</i> Insertar fila debajo";
                }
            }, 'remove_row': {
                name: function () {
                    return "<i class=\"mdl-color-text--grey material-icons\" role=\"presentation\" style=\"font-size: 14px;\">delete</i> Eliminar fila";
                }
            },
            "hsep1": "---------",
            "edit": {
                name: function () {
                    return "<i class=\"mdl-color-text--grey material-icons\" role=\"presentation\" style=\"font-size: 14px;\">photo_library</i> Editar foto";
                },
                disabled: function () {
                    return !(((hot.getSelected()[1] === 3) || (hot.getSelected()[1] === 4)))
                }
            }
        }
    }
})


Handsontable.dom.addEvent(autosave, 'click', function () {
    if (autosave.checked) {
        exampleConsole.innerText = 'Changes will be autosaved';
    }
    else {
        exampleConsole.innerText = 'Changes will not be autosaved';
    }
});





