function ajax(url, method, params, callback) {
    var obj;

    try {
        obj = new XMLHttpRequest();
    } catch (e) {
        try {
            obj = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                obj = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                alert("Your browser does not support Ajax.");
                return false;
            }
        }
    }
    obj.onreadystatechange = function () {
        if (obj.readyState == 4) {
            callback(obj);
        }
    };
    obj.open(method, url, true);
    obj.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    obj.send(params);

    return obj;
}

var
    $ = function (id) {
        return document.getElementById(id);
    },
    container = $('example2'),
    exampleConsole = $('example1console'),
    autosave = $('autosave'),
    load = $('load'),
    save = $('save'),
    reload = $('accept'),
    autosaveNotification,
    hot2,
    number;



hot2 = new Handsontable(container, {
    startRows: 1,
    // startCols: 6,
    dataSchema: {
        id: 1,
        from: null,
        to: null,
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
        { data: "value" },
        {
            data: "type", type: 'dropdown',
            source: ['indirect', 'direct']
        },
        {
            data: "style.fillColor",
            type: 'handsontable',
            renderer: colorRenderer,
            allowInvalid: false,
            handsontable: {
                data: colorData,
                columns: [{ renderer: colorDropdownRenderer }]

            }
        },
        {
            data: "style.radius", type: 'dropdown',
            source: ['5', '10', '15']
        }
    ],
    currentRowClassName: 'currentRow',
    rowHeaders: true,
    rowHeights: 20,
    colHeaders: ["ID", "Inicio", "Fin", "Valor", "Tipo", "Color de relleno", "Grosor de línea"],
    colWidths: [1, 100, 100, 1, 1, 100, 100],
    //minSpareRows: 1,
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
        updateIDs(hot2)
    },
    afterRemoveRow: function (index) {
        updateIDs(hot2)
    }
});

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
                    data: hot.getRowHeader().map(function (e) {
                        return [e];
                    }), columns: [
                        { renderer: updateDropdownGraphCell, type: 'numeric' }
                    ]
                },
                renderer: updateGraphCell

            },
            {
                data: "to",
                type: 'handsontable',
                handsontable: {
                    //colHeaders: ['ID'],
                    autoColumnSize: true,
                    data: hot.getRowHeader().map(function (e) {
                        return [e];
                    }), columns: [
                        { renderer: updateDropdownGraphCell, type: 'numeric' }
                    ]
                },
                renderer: updateGraphCell
            },
            { data: "value" },
            {
                data: "type", type: 'dropdown',
                source: ['indirect', 'direct']
            },
            {
                data: "style.fillColor",
                type: 'dropdown',
                renderer: colorRenderer,
                allowInvalid: false,
                source: ['#d53e4f', '#3288bd', '#66c265', '#4d4d4d']
            },
            {
                data: "style.radius", type: 'dropdown',
                source: ['5', '10', '15']
            }
        ]
    })
});

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
        list_images = {}
        dataTotal = JSON.parse("{ \"data\":" + lines + "}");
        data = dataTotal.data;

        hot.loadData(data.nodes);
        hot2.loadData(data.links);
        exampleConsole.innerText = 'Data loaded';
        //console.log(hot.getSourceDataAtCol(1))
    }
});

Handsontable.dom.addEvent(save, 'click', function () {
    var nodeToSave = hot.getSourceData()
    var dataToSave = hot2.getSourceData()
    var encodedUri = encodeURIComponent("{ \"nodes\":" + JSON.stringify(nodeToSave) + ", \"links\":" + JSON.stringify(dataToSave) + "}")
    var link = document.createElement("a");
    link.setAttribute("href", 'data:text/plain;charset=utf-u,' + encodedUri);
    link.setAttribute("download", "data.json");
    document.body.appendChild(link);
    link.click();
    window.open(encodedUri)
});

Handsontable.dom.addEvent(autosave, 'click', function () {
    if (autosave.checked) {
        exampleConsole.innerText = 'Changes will be autosaved';
    }
    else {
        exampleConsole.innerText = 'Changes will not be autosaved';
    }
});





