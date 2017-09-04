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
    hot;

hot = new Handsontable(container, {
    startRows: 8,
    startCols: 6,
    columns: [
        { data: "cover", renderer: coverRenderer },
        { data: "lastname" },
        { data: "name" }
    ],
    rowHeaders: true,
    colHeaders: true,
    minSpareRows: 1,
    persistentState: true,
    //contextMenu: true,
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


function coverRenderer(instance, td, row, col, prop, value, cellProperties) {
    var escaped = Handsontable.helper.stringify(value),
        img;

    if (escaped.indexOf('http') === 0 || escaped.indexOf('data:image') === 0) {
        img = document.createElement('IMG');
        img.src = value;
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

// Handsontable.dom.addEvent(reload, 'click', function () {
//     $.getJSON("json/dataload.json", function(data){
//         document.getElementById("crop").src = imagetest
//         data.data[0].cover = imagetest

//     });
//     // ajax('json/dataload.json', 'GET', '', function (res) {
//     //     var data = JSON.parse(res.response);
//     //     //var image = data.data[0].cover;
//     //     //console.log(image)
//     //     console.log("1: " + data.data[0].cover)
//     //     document.getElementById("crop").src = imagetest
//     //     console.log(imagetest)
//     //     data.data[0].cover = imagetest
//     //     console.log("3: " + data.data[0].cover)
//     // });
// });

Handsontable.dom.addEvent(load, 'click', function () {
    ajax('json/dataload.json', 'GET', '', function (res) {
        var data = JSON.parse(res.response);
        
        document.getElementById("crop").src = imagetest
        data.data[0].cover = imagetest

        hot.loadData(data.data);
        exampleConsole.innerText = 'Data loaded';
    });
});

Handsontable.dom.addEvent(save, 'click', function () {
    // save all cell's data

    //var response = JSON.parse(res.response);
    var csvContent = "data:text/csv;charset=utf-8,";
    var dataToSave = hot.getData()
    dataToSave.forEach(function (infoArray, index) {
        dataString = infoArray.join("|");
        csvContent += dataString + "\n";
    });    
    //console.log(JSON.stringify(hot.getData()))
    //exampleConsole.innerHTML = JSON.stringify(hot.getData())

    var encodedUri = encodeURI(csvContent)
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "my_data.csv");
    document.body.appendChild(link); // Required for FF
    
    link.click(); // This will download the data file named "my_data.csv".
    window.open(encodedUri)
    //hot.save(response.data);

});

Handsontable.dom.addEvent(autosave, 'click', function () {
    if (autosave.checked) {
        exampleConsole.innerText = 'Changes will be autosaved';
    }
    else {
        exampleConsole.innerText = 'Changes will not be autosaved';
    }
});
