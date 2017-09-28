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


//  Update IDs of rows


function updateIDs(hs) {
    for (var i = 0; i < hs.getRowHeader().length; i++) {
        hs.getSourceData()[i].id = i + 1
    }
}

function addAutocompleteArrow() {
    var div, divText
    div = document.createElement("DIV")
    div.className = "htAutocompleteArrow"
    divText = document.createTextNode("▼")
    div.appendChild(divText)
    return div;
}

// Functions renderer
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

function colorDropdownRenderer(instance, td, row, col, prop, value, cellProperties) {
    var colorize = Handsontable.helper.stringify(value), p, a, b;
    p = document.createElement("DIV")
    p.className = "circleColor2"
    p.style.backgroundColor = value
    if(value == "#d53e4f"){
        b = " rojo"
    } else if(value == "#3288bd"){
        b = " azul"
    } else if(value == "#66c265"){
        b = " verde"
    } else if(value == "#4d4d4d"){
        b = " gris"
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


function coverRenderer(instance, td, row, col, prop, value, cellProperties) {
    var escaped = Handsontable.helper.stringify(value),
        img;

    td.appendChild(addAutocompleteArrow())

    if (escaped.indexOf('http') === 0 || escaped.indexOf('data:image') === 0 || escaped.indexOf('/images/') === 0) {
        img = document.createElement('IMG');
        img.setAttribute('style', 'border-radius: 50%')
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
    var updateCellWithName = Handsontable.helper.stringify(value), textOnCell, internText;
    textOnCell = document.createElement("P")
    internText = document.createTextNode(value + " : " + hot.getSourceDataAtCol(1)[value - 1])

    textOnCell.appendChild(internText)
    Handsontable.dom.empty(td)
    td.appendChild(addAutocompleteArrow())
    td.appendChild(textOnCell)
    return td;
}

function hiddenText(instance, td, row, col, prop, value, cellProperties) {
    var hide = Handsontable.helper.stringify(value), doc
    doc = document.createElement("A")
    doc.style.fontSize = 1;
    Handsontable.dom.empty(td)
    td.appendChild(doc)
    return td;
}

// Render for dropdown

function colorHighlighter(item) {
    var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&');
    var label = item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
      return '<strong>' + match + '</strong>';
    });
    return '<span style="margin-right: 30px; background-color: ' + item + '">&nbsp;&nbsp;&nbsp;</span>' + label;
  }