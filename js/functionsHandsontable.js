function addAutocompleteArrow(){
    var div, divText
    div = document.createElement("DIV")
    div.className = "htAutocompleteArrow"
    divText = document.createTextNode("▼")
    div.appendChild(divText)
    return div;
}

function colorRenderer(instance, td, row, col, prop, value, cellProperties) {
    var colorize = Handsontable.helper.stringify(value);
    
    td.style.backgroundColor = value

    Handsontable.dom.empty(td);
    td.appendChild(addAutocompleteArrow())
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

    
    if (escaped.indexOf('http') === 0 || escaped.indexOf('data:image') === 0) {
        img = document.createElement('IMG');
        // img.setAttribute('style', 'border-radius: 50%')
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
    td.appendChild(addAutocompleteArrow())
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
    td.appendChild(textOnCell)
    td.appendChild(addAutocompleteArrow())
    return td;
}