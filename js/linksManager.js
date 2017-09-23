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
        type: null,
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
                data:  colorData,
                columns: [{renderer:colorDropdownRenderer}]
            
            }
        },
        {
            data: "style.radius", type: 'dropdown',
            source: ['5', '10', '15']
        }
    ],
    currentRowClassName: 'currentRow',
    rowHeaders: true,
    rowHeights: 60,
    colHeaders: ["ID", "Inicio", "Fin", "Valor", "Tipo", "Color de relleno", "Longitud de línea"],
    colWidths: [50, 100, 100, 1, 100, 100, 100],
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
    afterCreateRow: function(index){
        for(var i = 0; i < hot2.getRowHeader().length; i++){
            hot2.setDataAtCell(i, 0, i+1)
        }
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

function copyOfIDRenderer(instance, td, row, col, prop, value, cellProperties) {
    var idNode = Handsontable.helper.stringify(value), idText, textOnText
    idText = document.createElement("P");
    textOnText = document.createTextNode(row+1)
    idText.appendChild(textOnText)
    value = idText.childNodes[0].textContent 
    Handsontable.dom.empty(td);
    td.appendChild(idText)
    return td
}

// var rows = hot.countRows();  
// for(var i = 0; i < rows; i++){
//     hot2.setDataAtCell(i, 0, i + 1)
// }

function updateDropdownGraphCell(instance, td, row, col, prop, value, cellProperties) {
    var updateCellWithName = Handsontable.helper.stringify(value), textOnCell, internText;
    textOnCell = document.createElement("P")
    internText = document.createTextNode(value + " : " + hot.getSourceDataAtCol(1)[value - 1])

    textOnCell.appendChild(internText)
    Handsontable.dom.empty(td)
    td.appendChild(textOnCell)
    
    return td;
}

function updateGraphCell(instance, td, row, col, prop, value, cellProperties) {
    var updateCellWithName = Handsontable.helper.stringify(value), textOnCell, internText, div, divText;
    div = document.createElement("DIV")
    div.className = "htAutocompleteArrow"
    divText = document.createTextNode("▼")
    div.appendChild(divText)
    textOnCell = document.createElement("P")
    internText = document.createTextNode(value + " : " + hot.getSourceDataAtCol(1)[value - 1])

    textOnCell.appendChild(internText)
    Handsontable.dom.empty(td)
    td.appendChild(textOnCell)
    td.appendChild(div)
    return td;
}

function colorRenderer(instance, td, row, col, prop, value, cellProperties) {
    var colorize = Handsontable.helper.stringify(value), div, divText;
    div = document.createElement("DIV")
    div.className = "htAutocompleteArrow"
    divText = document.createTextNode("▼")
    div.appendChild(divText)
    //p = document.createElement("LI")
    //p.style.listStyleType = "none"
    td.style.backgroundColor = value

    Handsontable.dom.empty(td);
    td.appendChild(div)
    //td.appendChild(p);
    return td;
}

function colorDropdownRenderer(instance, td, row, col, prop, value, cellProperties) {
    var colorize = Handsontable.helper.stringify(value), p;
    p = document.createElement("LI")
    p.style.backgroundColor = value

    Handsontable.dom.addEvent(p, 'mousedown', function (e) {
        e.preventDefault(); // prevent selection quirk
    });

    Handsontable.dom.empty(td);
    td.appendChild(p);
    return td;
}


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





