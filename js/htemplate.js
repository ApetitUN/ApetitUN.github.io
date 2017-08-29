var
  data1 = [
    ['', 'Kia', 'Nissan', 'Toyota', 'Honda'],
    ['2008', 10, 11, 12, 13],
    ['2009', 20, 11, 14, 13],
    ['2010', 30, 15, 12, 13]
  ],
  container1 = document.getElementById('example1'),
  settings1 = {
    data: data1,
    contextMenu: true,
    rowHeaders: true,
    colHeaders: true
  },
  hot1;

hot1 = new Handsontable(container1, settings1);
data1[0][1] = 'Ford'; // change "Kia" to "Ford" programatically
hot1.render();


function coverRenderer (instance, td, row, col, prop, value, cellProperties) {
  var escaped = Handsontable.helper.stringify(value),
    img;

  if (escaped.indexOf('http') === 0) {
    img = document.createElement('IMG');
    img.src = value;

    Handsontable.dom.addEvent(img, 'mousedown', function (e){
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
