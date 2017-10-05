// List of images to use in an instance in handsontable 
var list_images = {}

// Variable declarations
var
    $ = function (id) {
        return document.getElementById(id);
    },
    container = $('example1'), // name of container div in HTML
    load = $('load'),
    save = $('save'),
    reload = $('reload'),
    hot, // name of handsontable instance
    number, // number of row selected (used by load image function)
    selectedColumn, // selected row (used by load image function)
    colorData = [],
    colors = ['#d53e4f', '#3288bd', '#66c265', '#4d4d4d'];

// Change of arroy to Object 
while (color = colors.shift()) {
    colorData.push([
        [color]
    ]);
}

//  Initialization of handsontable
hot = new Handsontable(container, {
    startRows: 1, // Number of initial rows
    dataSchema: // Default squema used by handsontable to create data with null or default values 
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
    columns: [ // Defines order of data load or squema. 
        { data: "id" },
        { data: "name" },
        {
            data: "className",
            type: 'dropdown',
            source: ['personas', 'bienes', 'empresas', 'vehiculos', 'conectores', 'cuentasbancarias']
        },
        {
            data: "image",
            renderer: coverRenderer, // Each column in handsontable can call an function, this is placed in /commonHandsontable/functionsHandsontable.js 
            type: 'dropdown',
            source: ['/img/conector/bienes.png', '/img/conector/dinero.png', '/img/conector/empresas.png',
                '/img/conector/enemigo.png', '/img/conector/familia.png', '/img/conector/movilidad.png',
                '/img/icono/bienes.png', '/img/icono/empresa.png', '/img/icono/persona.png',
                '/img/icono/reporte.png', '/img/icono/cuentas.png', '/img/icono/local.png', '/img/icono/vehiculo.png'
            ]
        },
        {
            data: "image2",
            renderer: coverRenderer,
            type: 'dropdown',
            source: ['/img/conector/bienes.png', '/img/conector/dinero.png', '/img/conector/empresas.png',
                '/img/conector/enemigo.png', '/img/conector/familia.png', '/img/conector/movilidad.png',
                '/img/icono/bienes.png', '/img/icono/empresa.png', '/img/icono/persona.png',
                '/img/icono/reporte.png', '/img/icono/cuentas.png', '/img/icono/local.png', '/img/icono/vehiculo.png']
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
    rowHeaders: true, // Allows show number of rows
    rowHeights: 55,
    colHeaders: ["ID", "Nombre", "Tipo de nodo", "Icono", "Foto", "Descripción", "Tamaño", "Color del borde", "Figura", "Cargado", "Longitud de línea"],
    colWidths: [1, 100, 100, 100, 100, 300, 100, 100, 1, 1, 1],
    stretchH: 'all', // Allows width: 100%
    persistentState: true,
    contextMenu: true, // Context Menu is enabled
    afterCreateRow: function (index) {
        updateIDs(hot) // Recalcule ID's after create new row
    },
    afterRemoveRow: function (index) {
        updateIDs(hot) // Recalcule ID's after remove new row
    },
});

// after change allows edit values of other cells 
hot.addHook('afterChange', function () {
    if (hot.getSelected() != undefined) {
        var row = hot.getSelected()[0]
        var column = hot.getSelected()[1]
        var imageXtype = {
            "personas": "icono/persona.png", "bienes": "icono/bienes.png", "empresas": "icono/empresa.png",
            "vehiculos": "icono/vehiculo.png", "conectores": "conector/enemigo.png", "cuentasbancarias": "icono/cuentas.png"
        }

        var classNameValue = hot.getDataAtCell(row, column) // Recover data at cell
        if (column == 2) { // If the column is equal to "className" -> "Tipo de nodo"
            if (imageXtype[classNameValue] == undefined) {
                hot.getSourceData()[row].image = "/img/icono/preloader.gif"
                hot.getSourceData()[row].image2 = "/img/icono/preloader.gif"
            }
            else {
                hot.getSourceData()[row].image = "/img/" + imageXtype[classNameValue] // Match with image 
                hot.getSourceData()[row].image2 = "/img/" + imageXtype[classNameValue]
                hot.render()
            }
            if (classNameValue === "empresas" || classNameValue === "bienes" || classNameValue === "cuentasbancarias") {
                hot.getSourceData()[row].shape = "square" // replace in cell [row, shape]
            } else if (classNameValue === "conectores" || classNameValue === "personas") {
                hot.getSourceData()[row].shape = "circle"
            } else if (classNameValue === "vehiculos") {
                hot.getSourceData()[row].shape = "triangle"
            }
        }
    }

}
)

// We can modify the table after read settings
hot.updateSettings({
    contextMenu: { // modify context menu
        callback: function (key, options) {
            if (key === 'edit') { // create new option key
                number = (hot.getSelected()[0]); // get Selected recovers [row, column, ...]
                var dialogScrollable = new mdc.dialog.MDCDialog(document.querySelector('#mdc-dialog-with-list')); // call to dialog in index
                dialogScrollable.show(); // show this
                selectedColumn = (hot.getSelected()[1]);
                list_images = {} // initialize object 
                var testImage = new Image() // create new Image to be used in canvas
                var canvas = document.getElementById("canvas2"); // create a canvas to draw an image
                canvas.width = 100;
                canvas.height = 100;
                canvas.style.display = "none"; // no display this
                var x = 0;
                var y = 0;
                var imgWidth = 100; 
                var imgHeight = 100;
                var ctx = canvas.getContext("2d"); // create new context to draw over


                $('#accept').on('click', function () {
                    if (currentImage != undefined) {

                        document.getElementById("crop").src = currentImage // recover the image after call "crop" function in "/js/vendor/opencv/myLoad.js"

                        testImage.src = currentImage // copy the image in testImage.src
                        testImage.onload = function () { 
                            //console.log("El elemento seleccionado es " + hot.getSourceData()[number].className)
                            if (hot.getSourceData()[number].className == "personas" || hot.getSourceData()[number].className == "conectores") { // create a circle
                                ctx.beginPath();
                                ctx.arc(50, 50, imgHeight * 0.5, 0, Math.PI * 2, true);
                                ctx.closePath();
                                ctx.clip();
                                ctx.drawImage(testImage, x, y, imgWidth, imgHeight);

                            } else if (hot.getSourceData()[number].className == "vehiculos") { // triangle
                                ctx.beginPath();
                                ctx.moveTo(50, 0);
                                ctx.lineTo(0, imgHeight);
                                ctx.lineTo(imgHeight, imgHeight);
                                ctx.closePath();
                                ctx.clip();
                                ctx.drawImage(testImage, x, y, imgWidth, imgHeight);

                            } else { // square
                                ctx.drawImage(testImage, x, y, imgWidth, imgHeight);

                            }
                            list_images[number] = canvas.toDataURL() // save the edited image to the array with selected row (number)
                            for (var n in list_images) { // interate over the array to assign in source data 
                                if (selectedColumn == 3) {
                                    hot.getSourceData()[n].image = list_images[n];
                                }
                                //  else if (selectedColumn == 4)
                                //     hot.getSourceData()[n].image2 = list_images[n];
                            }
                            hot.loadData(hot.getSourceData()) //reload table
                        }
                        list_images[number] = currentImage
                        for (var n in list_images) {
                            if (selectedColumn == 4) {
                                hot.getSourceData()[n].image2 = list_images[n];
                            }
                        }
                        hot.loadData(hot.getSourceData())

                    }

                })

            }
        },
        items: {  // modify the options in the context menu. 
            'row_above': { // add new row above enabled
                name: function () {
                    return "<i class=\"mdl-color-text--grey material-icons\" role=\"presentation\" style=\"font-size: 14px;\">keyboard_arrow_up</i> Insertar fila encima";
                }
            }, 'row_below': { // add new row below enabled
                name: function () {
                    return "<i class=\"mdl-color-text--grey material-icons\" role=\"presentation\" style=\"font-size: 14px;\">keyboard_arrow_down</i> Insertar fila debajo";
                }
            }, 'remove_row': { // remove selected row(s)
                name: function () {
                    return "<i class=\"mdl-color-text--grey material-icons\" role=\"presentation\" style=\"font-size: 14px;\">delete</i> Eliminar fila(s)";
                }
            },
            "hsep1": "---------", // add a simple separator
            "edit": { // new function
                name: function () {
                    return "<i class=\"mdl-color-text--grey material-icons\" role=\"presentation\" style=\"font-size: 14px;\">photo_library</i> Editar foto";
                },
                disabled: function () { // enable this option only in columns 3 and 4 (image and image2)
                    return !(((hot.getSelected()[1] === 3) || (hot.getSelected()[1] === 4)))
                }
            }
        }
    }
})





