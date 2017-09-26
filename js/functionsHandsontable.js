function updateIDs(hs){
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


function coverRenderer(instance, td, row, col, prop, value, cellProperties) {
    var escaped = Handsontable.helper.stringify(value),
        img;

        td.appendChild(addAutocompleteArrow())

    if (escaped.indexOf('http') === 0 || escaped.indexOf('data:image') === 0) {
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