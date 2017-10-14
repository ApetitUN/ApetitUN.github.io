// Please, read comments in "/js/netChart/nodesManager.js"
// Declare variables
var
$ = function (id) {
    return document.getElementById(id);
},
container = $('example2'),
load = $('load'),
save = $('save'),
reload = $('accept'),
hot2;

hot2 = new Handsontable(container, {
startRows: 1,
// default schema to allow handsontable define an estructure 
dataSchema: {
    id: 1,
    from: 1,
    to: 1,
    value: null,
    type: "directo",
    style: {
        fillColor: "#d53e4f",
        radius: '15'
    }
},
columns: [
    {
        data: "id",
        renderer: copyOfIDRenderer

    }, {
        data: "from",
        type: 'handsontable',
        // editor: false,
        handsontable: {
            //colHeaders: ['ID'],
            autoColumnSize: true,
            height: 120,
            data: hot.getRowHeader().map(function (e) {
                return [e];
            }), columns: [
                { renderer: updateDropdownGraphCell, type: 'numeric' }
            ],
            rowHeights: 10,
            stretchH: "all",
        },
        renderer: updateGraphCell,
        //persistentState: true

    },
    {
        data: "to",
        type: 'handsontable',
        // editor: false,
        handsontable: {
            //colHeaders: ['ID'],
            autoColumnSize: true,
            //width: 500,
            height: 120,
            data: hot.getRowHeader().map(function (e) {
                return [e];
            }), columns: [
                { renderer: updateDropdownGraphCell, type: 'numeric' }
            ],
            rowHeights: 10,
            stretchH: "all",
        },
        renderer: updateGraphCell,
        persistentState: true

    },
    {
        data: "type", type: "dropdown", // editor: false,
        source: ['directo', 'familiares', 'bienes', 'vehículos', 'cuentas bancarias', 'empresas']
    },
    {
        data: "style.fillColor",
        type: 'handsontable',
        renderer: colorRenderer,
        allowInvalid: false,
        // editor: false,
        handsontable: {
            autoColumnSize: true,
            data: colorData,
            //stretchH: "all",
            columns: [{ renderer: colorDropdownRenderer }]

        }
    },
    {
        data: "style.radius", type: 'dropdown', // editor: false,
        source: ['5', '10', '15']
    },

    { data: "value", renderer: hiddenText },
],
currentRowClassName: 'currentRow',
rowHeaders: true,
rowHeights: 55,
colHeaders: ["ID", "Inicio", "Fin", "Tipo", "Color de la línea", "Grosor de línea", "Valor"],
colWidths: [1, 300, 300, 100, 200, 200, 1],
stretchH: 'all',
persistentState: true,
contextMenu: true,
afterCreateRow: function (index) {
    updateIDs(hot2)
},
afterRemoveRow: function (index) {
    updateIDs(hot2) // Recalcule ID's after create new row
}
});

//  Update the columns after settings, because we need data of nodes
hot2.addHook('afterChange', function () {
    //window.document.documentElement.click(),    
hot2.updateSettings({
    columns: [
        {
            data: "id",
            renderer: copyOfIDRenderer

        }, {
            data: "from",
            type: 'handsontable',
            handsontable: {
                //colHeaders: ['ID'],
                autoColumnSize: true,
                //width: 500,
                height: 120,
                data: hot.getRowHeader().map(function (e) {
                    return [e];
                }), columns: [
                    { renderer: updateDropdownGraphCell, type: 'numeric' }
                ],
                rowHeights: 10,
                stretchH: "all",
            },
            renderer: updateGraphCell,
            //persistentState: true

        },
        {
            data: "to",
            type: 'handsontable',
            handsontable: {
                //colHeaders: ['ID'],
                autoColumnSize: true,
                //width: 500,
                height: 120,
                data: hot.getRowHeader().map(function (e) {
                    return [e];
                }), columns: [
                    { renderer: updateDropdownGraphCell, type: 'numeric' }
                ],
                rowHeights: 10,
                stretchH: "all",
            },
            renderer: updateGraphCell,
            //persistentState: true

        },
        {
            data: "type", type: "dropdown",
            source: ['directo', 'familiares', 'bienes', 'vehículos', 'cuentas bancarias', 'empresas']
        },
        {
            data: "style.fillColor",
            type: 'handsontable',
            renderer: colorRenderer,
            allowInvalid: false,
            handsontable: {
                autoColumnSize: true,
                data: colorData,
                columns: [{ renderer: colorDropdownRenderer }]

            }
        },
        {
            data: "style.radius", type: 'dropdown',
            source: ['5', '10', '15']
        },

        { data: "value", renderer: hiddenText },
    ]
})
});

// Edit the context menu
hot2.updateSettings({
contextMenu: {
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
        }
    }
}
})


var typeLinksColumns = 3
hot2.addHook('afterChange', function () {
if (hot2.getSelected() != undefined) {
    var row = hot2.getSelected()[0]
    var column = hot2.getSelected()[1]
    var typeXstyle = {
        "directo": ['#d53e4f', 10],
        "familiares": ['#3288bd', 10],
        "bienes": ['#4d4d4d', 10],
        "vehículos": ['#ff7f2a', 10],
        "cuentas bancarias": ['#66c265', 10],
        "empresas": ['#ffcc00', 10],
    }
    var cellValue = hot2.getDataAtCell(row, column) // Recover data at cell
    if (column == typeLinksColumns) {
        if (cellValue != undefined) {
            hot2.getSourceData()[row].style.radius = (typeXstyle[cellValue][1])
            hot2.getSourceData()[row].style.fillColor = (typeXstyle[cellValue][0])
            hot2.render()
        }
    }

}
}
)

// Load JSON to handsontable
Handsontable.dom.addEvent(load, 'click', function () {
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
    list_images = {} // reset list of images
    dataTotal = JSON.parse("{ \"data\":" + lines + "}"); // concat the string due to handsontable purpose
    data = dataTotal.data;

    hot.loadData(data.nodes); // load data in nodes
    hot2.loadData(data.links); // load data in links
}
});



// Save handsontable to JSON
Handsontable.dom.addEvent(save, 'click', function () {
// save JSON with defined structure
var nodeToSave = hot.getSourceData()
var dataToSave = hot2.getSourceData()
var encodedUri = encodeURIComponent("{ \"nodes\":" + JSON.stringify(nodeToSave) + ", \"links\":" + JSON.stringify(dataToSave) + "}")
var link = document.createElement("a");
link.setAttribute("href", 'data:text/plain;charset=utf-u,' + encodedUri);
link.setAttribute("download", "data.json");
document.body.appendChild(link);
link.click();
});







