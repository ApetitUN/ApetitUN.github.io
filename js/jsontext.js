
function myFunction(){
    var JSONtext = "{ \"nodes\":" + JSON.stringify(hot.getSourceData()) + ", \"links\":" + JSON.stringify(hot2.getSourceData()) + "}";
    document.getElementById("p1").innerHTML = JSONtext;
}
