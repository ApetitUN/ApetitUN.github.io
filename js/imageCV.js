var face_cascade;

show_image = function (mat, canvas_id) {
  var data = mat.data(); 	// output is a Uint8Array that aliases directly into the Emscripten heap

  channels = mat.channels();
  channelSize = mat.elemSize1();

  var canvas = document.getElementById(canvas_id);
  canvas.style.display = "none";

  ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.width = mat.cols;
  canvas.height = mat.rows;

  imdata = ctx.createImageData(mat.cols, mat.rows);

  for (var i = 0, j = 0; i < data.length; i += channels, j += 4) {
    imdata.data[j] = data[i];
    imdata.data[j + 1] = data[i + 1 % channels];
    imdata.data[j + 2] = data[i + 2 % channels];
    imdata.data[j + 3] = 255;
  }
  ctx.putImageData(imdata, 0, 0);
}

var inputElement = document.getElementById("input");
inputElement.addEventListener("change", handleFiles, false);
function handleFiles(e) {
  var canvas = document.getElementById('canvas1');
  canvas.style.display = "none";
  var canvasWidth = 600;
  var canvasHeight = 400;
  var ctx = canvas.getContext('2d');
  var url = URL.createObjectURL(e.target.files[0]);
  var img = new Image();
  img.onload = function () {
    //ctx.drawImage(img, 20, 20);

    var scaleFactor = Math.min((canvasWidth / img.width), (canvasHeight / img.height));
    canvas.width = img.width * scaleFactor;
    canvas.height = img.height * scaleFactor;
    ctx.drawImage(img, 0, 0, img.width * scaleFactor, img.height * scaleFactor);
  }
  img.src = url;
}

function getInput() {
  var canvas = document.getElementById('canvas1');
  var ctx = canvas.getContext('2d');
  var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return imgData;
}

function makeGray() {
  var src = cv.matFromArray(getInput(), 24); // 24 for rgba
  var res = new cv.Mat();
  cv.cvtColor(src, res, cv.ColorConversionCodes.COLOR_RGBA2GRAY.value, 0)
  show_image(res, "canvas1")
  src.delete();
  res.delete();
}
var upPoint = {}, downPoint = {};
function detectFace() {

  if (face_cascade == undefined) {
    //console.log("Creating the Face cascade classifier");
    face_cascade = new cv.CascadeClassifier();
    face_cascade.load('../../test/data/haarcascade_frontalface_default.xml');
  }

  var img = cv.matFromArray(getInput(), 24); // 24 for rgba


  var img_gray = new cv.Mat();
  var img_color = new cv.Mat(); // Opencv likes RGB
  cv.cvtColor(img, img_gray, cv.ColorConversionCodes.COLOR_RGBA2GRAY.value, 0);
  cv.cvtColor(img, img_color, cv.ColorConversionCodes.COLOR_RGBA2RGB.value, 0);


  var faces = new cv.RectVector();
  var s1 = [0, 0];
  var s2 = [0, 0];
  face_cascade.detectMultiScale(img_gray, faces, 1.1, 3, 0, s1, s2);

  for (var i = 0; i < faces.size(); i += 1) {
    var faceRect = faces.get(i);
    x = faceRect.x;
    y = faceRect.y;
    w = faceRect.width;
    h = faceRect.height;
    var prt = 0.3;
    var p1 = [x - w * prt / 2, y - h * prt / 2];
    var p2 = [x + w + w * prt / 2, y + h + h * prt / 2];
    upPoint[i] = p1
    downPoint[i] = p2
    var color = new cv.Scalar(26,117,207);
    cv.rectangle(img_color, p1, p2, color, 2, 8, 0);
    //console.log("POINT1: " + p1 + "\nPOINT2: " + p2)
    faceRect.delete();
    color.delete();

  }

  show_image(img_color, "canvas1");

  img.delete();
  img_color.delete();
  faces.delete();
  img_gray.delete();
}

function download() {
  var dt = canvas1.toDataURL('image/jpeg');
  this.href = dt;
};
downloadLnk.addEventListener('click', download, false);

var ress = [];

function runTest(fct) {
  var start = performance.now();
  fct()
  var end = performance.now();
  var time = end - start;
  var res = { testName: fct.name, executionTime_ms: time };
  ress.push(res);
  var d = new Date().toString();
  var filename = "file_" + fct.name + "_" + d;
  downloadLnk.setAttribute('download', filename);
  downloadLnk.click();
}

function runAllTests() {
  ress = [];
  runTest(detectFace);
}

function convertArrayOfObjectsToCSV(args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || ',';
  lineDelimiter = args.lineDelimiter || '\n';

  keys = Object.keys(data[0]);

  result = '';
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function (item) {
    ctr = 0;
    keys.forEach(function (key) {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

var container;
var Zee;
var Control = {
  detectFace: detectFace,
  runAllTests: runAllTests
};

