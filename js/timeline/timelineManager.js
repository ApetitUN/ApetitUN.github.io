// Please read comments in js/netChart/nodesManager.js and js/netChart/linksManager.js
var
$ = function (id) {
    return document.getElementById(id);
},
container = $('example3'),
load2 = $('load2'),
save2 = $('save2'),
reload = $('accept'),
hot3,
number;


hot3 = new Handsontable(container, {
startRows: 1,
// startCols: 6,
dataSchema: {
    img: "",
    name: "",
    description: "",
    start: ""
},
columns: [
    {
        data: "img",
        renderer: coverRenderer,
        type: 'dropdown',
        source: ['img/icono/bienes.png', 'img/icono/empresa.png', 'img/icono/persona.png',
        'img/icono/reporte.png', 'img/icono/cuentas.png', 'img/icono/local.png']
    },
    { data: "name" },
    {
        data: "description"
    },

    {
        data: "start",
        type: 'date',
        // Date picker (pikadate)
        datePickerConfig: {
            defaultDate: '1995-05-01T01:05',
            allowEmpty: false,
            showWeekNumber: true,
            yearRange: ['1900','2030'],
        }
    }
],
currentRowClassName: 'currentRow',
rowHeaders: true,
rowHeights: 55,
colHeaders: ["Imagen", "Nombre del evento", "Descripción", "Fecha del evento"],
colWidths: [100, 100, 100, 100],
//minSpareRows: 1,
stretchH: 'all',
persistentState: true,
contextMenu: true,
});

hot3.updateSettings({
contextMenu: {
    callback: function (key, options) {
        if (key === 'edit') {
            number = (hot3.getSelected()[0]);
            var dialogScrollable = new mdc.dialog.MDCDialog(document.querySelector('#mdc-dialog-with-list'));
            dialogScrollable.show();
            selectedColumn = (hot3.getSelected()[1]);
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
                        // ctx.beginPath();
                        // ctx.arc(50, 50, imgHeight * 0.5, 0, Math.PI * 2, true);
                        // ctx.closePath();
                        // ctx.clip();

                        ctx.drawImage(testImage, x, y, imgWidth, imgHeight);

                        auxiliarImage = canvas.toDataURL()
                        list_images[number] = canvas.toDataURL()
                        for (var n in list_images) {
                            if (selectedColumn == 0) {
                                hot3.getSourceData()[n].img = list_images[n];
                            } 
                        }
                        hot3.loadData(hot3.getSourceData())
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
                return !(hot3.getSelected()[1] === 0)
            }
        }
    }
}
})

Handsontable.dom.addEvent(load2, 'click', function () {
var input, file, fr, dataTotal, data;

if (typeof window.FileReader !== 'function') {
    alert("The file API isn't supported on this browser yet.");
    return;
}

input = document.getElementById('fileinput');
if (!input) {
    alert("Um, couldn't find the fileinput element.");
}
else if (!input.files) {
    alert("This browser doesn't seem to support the `files` property of file inputs.");
}
else if (!input.files[0]) {
    alert("Por favor, selecciona un archivo.");
}
else {
    file = input.files[0];
    fr = new FileReader();
    fr.onload = receivedText;
    fr.readAsText(file);
}

function receivedText(e) {
    lines = e.target.result;
    list_images = {}
    dataTotal = JSON.parse("{ \"data\":" + lines + "}");
    hot3.loadData(dataTotal.data)
    //console.log(hot3.getSourceDataAtCol(1))
}
});

Handsontable.dom.addEvent(save2, 'click', function () {
var encodedUri = encodeURIComponent(JSON.stringify(hot3.getSourceData()))
var link = document.createElement("a");
link.setAttribute("href", 'data:text/plain;charset=utf-u,' + encodedUri);
link.setAttribute("download", "data.json");
document.body.appendChild(link);
link.click();
//window.open(encodedUri)
});