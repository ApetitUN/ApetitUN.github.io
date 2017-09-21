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
        id: null,
        name: null,
        className: null,
        shape: null,
        text: null,
        image: null,
        image2: null,
        loaded: "true",
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
            source: ['personas', 'bienes', 'empresas', 'vehiculos', 'conectores', 'cuentasbancarias']
        },
        {
            data: "shape",
            type: 'dropdown',
            source: ['circle', 'square', 'triangle']
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
            source: ['5', '10', '15']
        }, {
            data: "style.radius",
            type: 'dropdown',
            source: ['60', '100', '150']
        }, {
            data: "style.lineColor",
            type: 'handsontable',
            renderer: colorRenderer,
            allowInvalid: false,
            handsontable: {
                data:  colorData,
                columns: [{renderer:colorDropdownRenderer}]
            
            }
        }
    ],
    currentRowClassName: 'currentRow',
    rowHeaders: true,
    rowHeights: 60,
    colHeaders: ["ID", "Nombre", "ClassName", "Figura", "Descripción", "Imagen", "Imagen2", "Cargado", "Longitud de línea", "Radio", "Color de línea"],
    colWidths: [50, 100, 100, 100, 300, 100, 100, 1, 100, 100, 100],
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
                list_images = {}
                $('#accept').on('click', function () {
                    if (currentImage != undefined) {
                        document.getElementById("crop").src = currentImage
                        list_images[number] = currentImage
                        for (var n in list_images) {
                            if (selectedColumn == 5) {
                                hot.getSourceData()[n].image = list_images[n];
                            } else if (selectedColumn == 6)
                                hot.getSourceData()[n].image2 = list_images[n];
                        }
                    }
                    hot.loadData(hot.getSourceData())
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
                    return !(((hot.getSelected()[1] === 5) || (hot.getSelected()[1] === 6)))
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


Handsontable.dom.addEvent(autosave, 'click', function () {
    if (autosave.checked) {
        exampleConsole.innerText = 'Changes will be autosaved';
    }
    else {
        exampleConsole.innerText = 'Changes will not be autosaved';
    }
});





