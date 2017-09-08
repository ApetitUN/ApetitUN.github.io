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
    number = function () {
        var getNumber = parseInt(document.getElementById("sample3").value)
        return getNumber - 1
    };

hot = new Handsontable(container, {
    startRows: 8,
    startCols: 6,
    columns: [
        { data: "cover", renderer: coverRenderer },
        { data: "lastname" },
        { data: "name" }
    ],
    rowHeaders: true,
    rowHeights: 110,
    colHeaders: ["Foto", "Apellidos", "Nombre(s)"],
    colWidths: [120, 200, 200],
    minSpareRows: 1,
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
           
            (function() {
                var dialogScrollable = new mdc.dialog.MDCDialog(document.querySelector('#mdc-dialog-with-list'));
                document.querySelector('#dialog-with-list-activation').addEventListener('click', function (evt) {
                  dialogScrollable.lastFocusedTarget = evt.target;
                  dialogScrollable.show();
                });
              })();
              (function() {
                //mdc.dialog.MDCDialog.attachTo(document.querySelector('.mdc-dialog'));
              
                // Hack to work around style-loader async loading styles
                setTimeout(function() {
                    mdc.ripple.MDCRipple.attachTo(document.querySelector('#dialog-with-list-activation'));
                }, 200);
              })();
        }
      },
      items: {
        "edit": {name: 'Show Scrolling Dialog', 
        //isHtmlName: true,
        disabled: function () {
            // if first row, disable this option
            return ! (hot.getSelected()[0,2,0,3] === 0)
          }}
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
        img.setAttribute('width', '100px')
        img.setAttribute('heigth', '100px')


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

Handsontable.dom.addEvent(load, 'click', function () {
    var input, file, fr, data;

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
        data = JSON.parse(lines);

        if (imagetest != undefined) {
            document.getElementById("crop").src = imagetest
            data.data[number()].cover = imagetest
        }

        hot.loadData(data.data);
        exampleConsole.innerText = 'Data loaded';
    }
});

Handsontable.dom.addEvent(save, 'click', function () {
    var csvContent = "data:text/csv;charset=utf-8,";
    var dataToSave = hot.getSourceData()
    var encodedUri = encodeURIComponent("{ \"data\":" + JSON.stringify(dataToSave) + "}")
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




