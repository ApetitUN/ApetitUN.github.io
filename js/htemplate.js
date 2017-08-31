var silhouette = "data:image/png;base64,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"

$(function () {

  $('#reload').on('click', function () {

    document.getElementById("crop").src = imagetest

    var
      data1 = [
        {
          "name": "Carlos Alberto",
          "lastname": "Gomez Barona",
          "cover": imagetest
        },
        {
          "name": "Alvaro Camilo",
          "lastname": "Calero Pino",
          "cover": silhouette
        },{
          "name": "Alvaro Camilo",
          "lastname": "Calero Pino",
          "cover": silhouette
        },{
          "name": "Alvaro Camilo",
          "lastname": "Calero Pino",
          "cover": silhouette
        },{
          "name": "Alvaro Camilo",
          "lastname": "Calero Pino",
          "cover": silhouette
        },{
          "name": "Alvaro Camilo",
          "lastname": "Calero Pino",
          "cover": silhouette
        },
        {
          "name": "Juan Andrés",
          "lastname": "Barreto Díaz",
          "cover": silhouette
        }
      ],
      container1 = document.getElementById('example1'),
      settings1 = {
        data: data1,
        contextMenu: true,
        colHeaders: ["Foto", "Apellidos", "Nombre(s)"],
        // rowHeaders: true,
        colWidths: [120, 200, 200],
        columns: [
          { data: "cover", renderer: coverRenderer },
          { data: "lastname" },
          { data: "name" }
        ]
      },
      hot1;

    hot1 = new Handsontable(container1, settings1);
    if(this.hot1){
      this.hot1.render();
    }

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

  })

})



