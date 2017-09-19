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
    number,
    selectedColumn;



hot = new Handsontable(container, {
    startRows: 8,
    startCols: 6,
    dataSchema:
    {
        id: null,
        name: null,
        className: null,
        shape: null,
        text: null,
        image: null,
        image2: null,
        loaded: null,
        style: {
            lineWidth: null,
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
            source: ['a', 'b', 'c', 'd']
        },
        {
            data: "shape",
            type: 'dropdown',
            source: ['a', 'b', 'c', 'd']
        },
        { data: "text" },
        {
            data: "image",
            renderer: coverRenderer,
            type: 'dropdown',
            source: ['http://d279m997dpfwgl.cloudfront.net/wp/2013/03/Asma-Khalid_300.jpg', 'http://img2.zergnet.com/2031933_300.jpg', 'https://i.cbc.ca/1.2115364.1382070777!/httpImage/image.jpg_gen/derivatives/original_300/morton.jpg', 'http://img1.zergnet.com/1391764_300.jpg']
        },
        {
            data: "image2",
            renderer: coverRenderer,
            type: 'dropdown',
            source: ['http://d279m997dpfwgl.cloudfront.net/wp/2013/03/Asma-Khalid_300.jpg', 'http://img2.zergnet.com/2031933_300.jpg', 'https://i.cbc.ca/1.2115364.1382070777!/httpImage/image.jpg_gen/derivatives/original_300/morton.jpg', 'http://img1.zergnet.com/1391764_300.jpg']
        },
        { data: "loaded" },
        {
            data: "style.lineWidth",
            type: 'dropdown',
            source: ['10px', '20px', '30px']
        }, {
            data: "style.radius",
            type: 'dropdown',
            source: ['1px', '2px', '3px']
        }, {
            data: "style.lineColor",
            type: 'dropdown',
            renderer: colorRenderer,
            allowInvalid: false,
            source: ['#d53e4f', '#3288bd', '#66c265', '#4d4d4d']
        }
    ],
    currentRowClassName: 'currentRow',
    rowHeaders: true,
    rowHeights: 60,
    colHeaders: ["ID", "Nombre", "ClassName", "Figura", "Descripción", "Imagen", "Imagen2", "Cargado", "Longitud linea", "Radio", "Color de línea"],
    colWidths: [70, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    minSpareRows: 1,
    // width: 1300,
    // height: 400,
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
    }
});

hot.updateSettings({
    contextMenu: {
        callback: function (key, options) {
            if (key === 'edit') {
                number = (hot.getSelected()[0]);
                var dialogScrollable = new mdc.dialog.MDCDialog(document.querySelector('#mdc-dialog-with-list'));
                dialogScrollable.show();
                selectedColumn = (hot.getSelected()[1]);
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
                //isHtmlName: true,
                disabled: function () {
                    // if first row, disable this option
                    return ((hot.getSelected()[1] === 5) && (hot.getSelected()[1] === 6))
                }
            }
        }
    }
})

function colorRenderer(instance, td, row, col, prop, value, cellProperties) {
    var colorize = Handsontable.helper.stringify(value), p, text;

    p = document.createElement("LI")
    p.style.backgroundColor = value

    Handsontable.dom.addEvent(p, 'mousedown', function (e) {
        e.preventDefault(); // prevent selection quirk
    });

    Handsontable.dom.empty(td);
    td.appendChild(p);
    return td;
}

function coverRenderer(instance, td, row, col, prop, value, cellProperties) {
    var escaped = Handsontable.helper.stringify(value),
        img;

    if (escaped.indexOf('http') === 0 || escaped.indexOf('data:image') === 0) {
        img = document.createElement('IMG');
        img.src = value;
        //Gconsole.log(img.src)
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


Handsontable.dom.addEvent(autosave, 'click', function () {
    if (autosave.checked) {
        exampleConsole.innerText = 'Changes will be autosaved';
    }
    else {
        exampleConsole.innerText = 'Changes will not be autosaved';
    }
});





