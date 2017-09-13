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
    container = $('example1'),
    exampleConsole = $('example1console'),
    autosave = $('autosave'),
    load = $('load'),
    save = $('save'),
    reload = $('reload'),
    autosaveNotification,
    hot,
    number;



hot = new Handsontable(container, {
    startRows: 8,
    startCols: 6,
    columns: [
        { data: "id" },
        { data: "name" },
        { data: "className" },
        { data: "shape" },
        { data: "text" },
        { data: "image", renderer: coverRenderer },
        { data: "image2", renderer: coverRenderer },
        { data: "loaded" },
        {
            data: "style.lineWidth",
            type: 'dropdown',
            source: ['yellow', 'red', 'orange', 'green']
        }, {
            data: "style.radius",
            type: 'dropdown',
            source: ['1px', '2px', '3px']
        }, {
            data: "style.lineColor",
            type: 'dropdown',
            source: ['yellow', 'red', 'orange', 'green']
        }
    ],
    currentRowClassName: 'currentRow',
    rowHeaders: true,
    rowHeights: 60,
    colHeaders: ["ID", "Nombre", "ClassName", "Figura", "Descripción", "Imagen", "Imagen2", "Cargado", "Longitud linea", "Radio", "Color de línea"],
    colWidths: [70, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    minSpareRows: 1,
    width: 600,
    height: 400,
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
    }
});

hot.updateSettings({
    contextMenu: {
        callback: function (key, options) {
            if (key === 'edit') {
                number = (hot.getSelected()[0]);
                document.getElementById("dialog-with-list-activation").disabled = false;
                (function () {
                    var dialogScrollable = new mdc.dialog.MDCDialog(document.querySelector('#mdc-dialog-with-list'));
                    document.querySelector('#dialog-with-list-activation').addEventListener('click', function (evt) {
                        dialogScrollable.lastFocusedTarget = evt.target;
                        dialogScrollable.show();
                    });
                })();
                (function () {
                    // Hack to work around style-loader async loading styles
                    setTimeout(function () {
                        mdc.ripple.MDCRipple.attachTo(document.querySelector('#dialog-with-list-activation'));
                    }, 200);
                })();
                //document.getElementById("dialog-with-list-activation").disabled = true;
            }
        },
        items: {
            'row_above': {
                name: "Insertar fila encima"
            }, 'row_below': { name: "Insertar debajo" }, 'remove_row': { name: "Eliminar fila" },
            "edit": {
                name: 'Habilitar edición',
                //isHtmlName: true,
                disabled: function () {
                    // if first row, disable this option
                    return !(hot.getSelected()[0, 2, 0, 3] === 0)
                }
            }
        }
    }
})


function coverRenderer(instance, td, row, col, prop, value, cellProperties) {
    var escaped = Handsontable.helper.stringify(value),
        img;

    if (escaped.indexOf('http') === 0 || escaped.indexOf('data:image') === 0) {
        img = document.createElement('IMG');
        img.src = value;
        img.setAttribute('style', 'border-radius: 50%')
        img.setAttribute('width', '50px')
        img.setAttribute('heigth', '50px')


        Handsontable.dom.addEvent(img, 'mousedown', function (e) {
            e.preventDefault(); // prevent selection quirk
        });

        Handsontable.dom.empty(td);
        td.appendChild(img);
    }
    else {
        // render as text
        Handsontable.renderers.TextRenderer.apply(this, arguments);
    }

    return td;
}

// Handsontable.dom.addEvent(load, 'click', function () {
//     var input, file, fr, list_images = {}, dataTotal, data;

//     if (typeof window.FileReader !== 'function') {
//         alert("The file API isn't supported on this browser yet.");
//         return;
//     }

//     input = document.getElementById('fileinput');
//     if (!input) {
//         alert("Um, couldn't find the fileinput element.");
//     }
//     else if (!input.files) {
//         alert("This browser doesn't seem to support the `files` property of file inputs.");
//     }
//     else if (!input.files[0]) {
//         alert("Por favor, selecciona un archivo.");
//     }
//     else {
//         file = input.files[0];
//         fr = new FileReader();
//         fr.onload = receivedText;
//         fr.readAsText(file);
//     }

//     function receivedText(e) {
//         lines = e.target.result;
//         dataTotal = JSON.parse("{ \"data\":" + lines + "}");
//         data = dataTotal.data;
//         console.log("NODES: "+ data.nodes)

//         $('#accept').on('click', function () {
//             if (currentImage != undefined) {
//                 document.getElementById("crop").src = currentImage
//                 list_images[number] = currentImage
//                 for (var n in list_images) {
//                     data.nodes[n].image = list_images[n]
//                 }
//             }
//             hot.loadData(data.nodes)
//         })

//         //currentImage = undefined
//         console.log("Images: "+list_images)
//         hot.loadData(data.nodes);
//         exampleConsole.innerText = 'Data loaded';
//         //var tw = list_images

//     }
// });

// Handsontable.dom.addEvent(refresh, 'click', function(){
//     alert("to implement");
// });

// Handsontable.dom.addEvent(save, 'click', function () {
//     var csvContent = "data:text/csv;charset=utf-8,";
//     var dataToSave = hot.getSourceData()
//     var encodedUri = encodeURIComponent(JSON.stringify(dataToSave))
//     var link = document.createElement("a");
//     link.setAttribute("href", 'data:text/plain;charset=utf-u,' + encodedUri);
//     link.setAttribute("download", "data.json");
//     document.body.appendChild(link);
//     link.click();
//     window.open(encodedUri)
// });

Handsontable.dom.addEvent(autosave, 'click', function () {
    if (autosave.checked) {
        exampleConsole.innerText = 'Changes will be autosaved';
    }
    else {
        exampleConsole.innerText = 'Changes will not be autosaved';
    }
});





