var modal = document.getElementById('modalScore');
var span = document.getElementsByClassName("close")[0];



function modalScore() {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none"; //закрытие модального окна
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

function closeModal() {
    modal.style.display = "none"; //закрытие модального окна
}

function exit() {
    window.close();
}


var asd = localStorage.getItem('player');
d = JSON.parse(asd);
var elem;
var a;

function add() {
    var i;
    for (i = 0; i < d.length; ++i) {
        elem = d[i];
        console.log(elem);
        
    }
}
add();

function add2() {
    a = " ";
    d.forEach(function(item) {
        Object.keys(item).forEach(function(key) {
          a = key + " --- " + item[key];
        //document.getElementById("element1").innerHTML(key + item[key]);
        document.getElementById("progress").innerHTML += a + "<br>";
        console.log(a);
        });
    });
}
add2();


function startGame() {
    document.getElementById('containerGame').style.display="block";
    document.getElementById('containerMenu').style.display="none";
}

