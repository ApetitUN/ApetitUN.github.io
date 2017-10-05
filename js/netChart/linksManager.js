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
        type: "direct",
        style: {
            fillColor: null,
            radius: null
        }
    },
    columns: [
        { data: "id" },
        {
            data: "from"
        },
        {
            data: "to"
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
        { data: "value" },
        {
            data: "type", renderer: hiddenText
        }
    ],
    currentRowClassName: 'currentRow',
    rowHeaders: true,
    rowHeights: 25,
    colHeaders: ["ID", "Inicio", "Fin", "Color de la línea", "Grosor de línea", "Valor", "Tipo"],
    colWidths: [1, 300, 300, 200, 200, 1, 1],
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
                    ]
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
                    ]
                },
                renderer: updateGraphCell,
                persistentState: true

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
            { data: "value" },
            {
                data: "type", renderer: hiddenText
            }
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







