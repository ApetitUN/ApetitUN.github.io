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

var colorData = [],
    colors = ['#d53e4f', '#3288bd', '#66c265', '#4d4d4d', '#ff7f2a', '#ffcc00'];

// Change of arroy to Object
while (color = colors.shift()) {
    colorData.push([
        [color]
    ]);
}


//  Update IDs of rows
function updateIDs(hs) {
    for (var i = 0; i < hs.getRowHeader().length; i++) {
        hs.getSourceData()[i].id = i + 1
    }
    //hs.render()
}

// add element arrow in handsontable
function addAutocompleteArrow() {
    var div, divText
    div = document.createElement("DIV")
    div.className = "htAutocompleteArrow"
    divText = document.createTextNode("▼")
    div.appendChild(divText)
    return div;
}

// Color renderer to create circle in cell
function colorRenderer(instance, td, row, col, prop, value, cellProperties) {
    var colorize = Handsontable.helper.stringify(value), div2;
    div2 = document.createElement("DIV")
    div2.className = "circleColor"
    div2.style.backgroundColor = value

    Handsontable.dom.empty(td);
    td.appendChild(addAutocompleteArrow())
    td.appendChild(div2)
    return td;
}

// Create dropdown with color and text
function colorDropdownRenderer(instance, td, row, col, prop, value, cellProperties) {
    var colorize = Handsontable.helper.stringify(value), p, a, b;
    p = document.createElement("DIV")
    p.className = "circleColor2"
    p.style.backgroundColor = value
    if (value == "#d53e4f") {
        b = " rojo"
    } else if (value == "#3288bd") {
        b = " azul"
    } else if (value == "#66c265") {
        b = " verde"
    } else if (value == "#4d4d4d") {
        b = " gris"
    } else if (value == '#ffcc00') {
        b = " amarillo"
    } else if (value == '#ff7f2a') {
        b = " naranja"
    }
    a = document.createTextNode(b)
    Handsontable.dom.addEvent(p, 'mousedown', function (e) {
        e.preventDefault(); // prevent selection quirk
    });
    Handsontable.dom.empty(td);
    td.appendChild(p)
    td.appendChild(a)
    return td;
}

// Create renderer to allow upload local image
function coverRenderer(instance, td, row, col, prop, value, cellProperties) {
    var escaped = Handsontable.helper.stringify(value),
        img;

    td.appendChild(addAutocompleteArrow())

    if (escaped.indexOf('http') === 0 || escaped.indexOf('data:image') === 0 || escaped.indexOf('img/') === 0) {
        img = document.createElement('IMG');
        //img.setAttribute('style', 'border-radius: 50%')
        img.setAttribute('width', '50px')
        img.setAttribute('heigth', '50px')
        img.src = value;

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

// shows IDs in handsontable (actually hidden)
function copyOfIDRenderer(instance, td, row, col, prop, value, cellProperties) {
    var idNode = Handsontable.helper.stringify(value), idText, textOnText
    idText = document.createElement("P");
    textOnText = document.createTextNode(row + 1)
    idText.appendChild(textOnText)
    value = idText.childNodes[0].textContent
    Handsontable.dom.empty(td);
    td.appendChild(idText)
    return td
}

// shows number ID and data at cell in dropdown
function updateDropdownGraphCell(instance, td, row, col, prop, value, cellProperties) {
    var updateCellWithName = Handsontable.helper.stringify(value), textOnCell, internText;
    textOnCell = document.createElement("P")
    internText = document.createTextNode(value + " : " + hot.getSourceDataAtCol(1)[value - 1])

    textOnCell.appendChild(internText)
    Handsontable.dom.empty(td)
    td.appendChild(textOnCell)

    return td;
}

// shows number ID and data at cell in cell
function updateGraphCell(instance, td, row, col, prop, value, cellProperties) {
    var updateCellWithName = Handsontable.helper.stringify(value), textOnCell, internText;
    textOnCell = document.createElement("P")
    internText = document.createTextNode(value + " : " + hot.getSourceDataAtCol(1)[value - 1])

    textOnCell.appendChild(internText)
    Handsontable.dom.empty(td)
    td.appendChild(addAutocompleteArrow())
    td.appendChild(textOnCell)
    return td;
}

// sets font 1px to "hidden" cell
function hiddenText(instance, td, row, col, prop, value, cellProperties) {
    var hide = Handsontable.helper.stringify(value), doc
    doc = document.createElement("A")
    doc.style.fontSize = 1;
    Handsontable.dom.empty(td)
    td.appendChild(doc)
    td.style.display = "none";
    return td;
}