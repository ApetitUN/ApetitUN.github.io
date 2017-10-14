var test = document.getElementsByClassName("htCore")
for(var i = 0; i < test.length; i++){
    test[i].classList.add("mdl-data-table")
    test[i].classList.add("mdl-js-data-table")
    // test[i].classList.add("mdl-shadow--2dp")
}

var test2 = document.getElementsByTagName("th")
for(var i=0; i < test2.length; i++){
    test2[i].classList.add("mdl-data-table__cell--non-numeric")
}

var test3 = document.getElementsByTagName("td")
for(var i=0; i < test3.length; i++){
    test3[i].classList.add("mdl-data-table__cell--non-numeric")
}