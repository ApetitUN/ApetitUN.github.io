//var imagetest = "https://pbs.twimg.com/profile_images/671824524086796291/M9EyXA_V_reasonably_small.jpg"
$(function () {

  $('#reload').on('click', function () {

    document.getElementById("crop").src = imagetest

    var
      data1 = [
        {
          "name": "Carlos",
          "lastname": "Gomez",
          "cover": imagetest
        },
        {
          "name": "Camilo",
          "lastname": "Calero",
          "cover": "https://pbs.twimg.com/profile_images/671824524086796291/M9EyXA_V_reasonably_small.jpg"
        },
        {
          "name": "Juan",
          "lastname": "Barreto",
          "cover": "https://pbs.twimg.com/profile_images/671824524086796291/M9EyXA_V_reasonably_small.jpg"
        }
      ],
      container1 = document.getElementById('example1'),
      settings1 = {
        data: data1,
        //contextMenu: true,
        colHeaders: ["Name", "Lastname", "Images"],
        // rowHeaders: true,
        colWidths: [200, 200, 200],
        columns: [
          { data: "name" },
          { data: "lastname" },
          { data: "cover", renderer: coverRenderer }
        ]
      },
      hot1;

    hot1 = new Handsontable(container1, settings1);
    hot1.render();

    function coverRenderer(instance, td, row, col, prop, value, cellProperties) {
      var escaped = Handsontable.helper.stringify(value),
        img;

      if (escaped.indexOf('http') === 0 || escaped.indexOf('data:image') === 0) {
        img = document.createElement('IMG');
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

  })

})



