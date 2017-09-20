var JSONtext = "{ \"nodes\":" + JSON.stringify(node2) + ", \"links\":" + JSON.stringify(link2) + "}";

function myFunction(){
    document.getElementById("p1").innerHTML = JSONtext;
}
