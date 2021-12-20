var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var i, Timer;
var ship;
var aster1 = [];
var aster2 = [];
var life1 = [];
var fire = [];
var expl = [];
var bonus = [];

var points = 0;
var life = 5;

//загрузка изображений
aster1img = new Image();
aster1img.src = 'astero1.png';

aster2img = new Image();
aster2img.src = 'astero2.png';

life1img = new Image();
life1img.src = 'life.png';

//shieldimg 	= new Image();
//shieldimg.src = 'shield.png';

fireimg = new Image();
fireimg.src = 'fire.png';

shipimg = new Image();
shipimg.src = 'ship01.png';

explimg = new Image();
explimg.src = 'expl222.png';

bonusimg = new Image();
bonusimg.src = 'bonus.png'

//совместимость с браузерами
var requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (callback) {
			window.setTimeout(callback, 1000 / 20);
		};
})();

//начальные установки
function init() {
	canvas.addEventListener("mousemove", function (event) {

		var rect = canvas.getBoundingClientRect(), root = document.documentElement;

		var mouseX = event.clientX - rect.left - root.scrollLeft;
		var mouseY = event.clientY - rect.top - root.scrollTop;

		var width_canvas = document.getElementById("game").offsetWidth;
		var height_canvas = document.getElementById("game").offsetHeight;

		ship.x = mouseX * 1000 / width_canvas - 25;
		ship.y = mouseY * 600 / height_canvas - 13;
	});

	Timer = 0;
	ship = { x: 500, y: 300, animx: 0, animy: 0 };
}

//функция обновления состояния игры
function update() {
	Timer++;

	var modal = document.getElementById('modalGame');
	var span = document.getElementsByClassName("close")[0];

	function modalGame() {
		modal.style.display = "block";
	}

	span.onclick = function () {
		modal.style.display = "none";
	}

	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}
	}

	if (life == 0) {
		modalGame();
	}

	document.getElementById('pointsModal').innerHTML = `You earned ` + points + ` points`;

	//пауза
	onkeypress = function (event) {
		if (event.code == 'KeyP') {
			alert('PAUSE')
		}
	}

	if (life == 0) { //остановка функции
		return;
	}

	//условия для уровней
	var speed = 80;

	if (points > 50) {
		speed = 60;
	}

	if (points > 100) {
		speed = 40;
	}

	if (points > 150) {
		speed = 20;
	}

	if (points > 200) {
		speed = 10;
	}

	if (points > 300) {
		speed = 5;
	}

	//спавн астероидов
	if (Timer % speed == 0) {
		aster1.push({
			angle: 0,
			dxangle: Math.random() * 0.2 - 0.1,
			del: 0,
			x: Math.random() * 950,
			y: -50,
			dx: Math.random() * 2 - 1,
			dy: Math.random() * 2 + 1
		});
	}

	if (Timer % speed == 0) {
		aster2.push({
			angle: 0,
			dxangle: Math.random() * 0.2 - 0.1,
			del: 0,
			x: Math.random() * 950,
			y: -50,
			dx: Math.random() * 2 - 1,
			dy: Math.random() * 2 + 1
		});
	}

	//выстрел x3
	//if (Timer%30==0) {
	//fire.push({x:ship.x+10,y:ship.y,dx:0,dy:-5.2});
	//fire.push({x:ship.x+10,y:ship.y,dx:0.5,dy:-5});
	//fire.push({x:ship.x+10,y:ship.y,dx:-0.5,dy:-5});
	//}

	//проверим корабль на столкновение с астеройдом aster1
	for (i in aster1) {
		if (ship.x < aster1[i].x + (30) &&
			ship.x + (30) > aster1[i].x &&
			ship.y < aster1[i].y + (30) &&
			ship.y + (30) > aster1[i].y) {
			life = life - 1;
			aster1.splice(i, 1);
			soundClickСollision();
		}
	}

	for (i in aster2) {
		if (ship.x < aster2[i].x + (30) &&
			ship.x + (30) > aster2[i].x &&
			ship.y < aster2[i].y + (30) &&
			ship.y + (30) > aster2[i].y) {
			life = life - 1;
			aster2.splice(i, 1);
			soundClickСollision();
		}
	}

	document.getElementById('life').innerHTML = `LIFE: ` + life;

	//движение астероидов
	for (i in aster1) {
		aster1[i].x = aster1[i].x + aster1[i].dx;
		aster1[i].y = aster1[i].y + aster1[i].dy;
		aster1[i].angle = aster1[i].angle + aster1[i].dxangle;

		//граничные условия
		if (aster1[i].x <= 0 || aster1[i].x >= 950) aster1[i].dx = -aster1[i].dx;
		if (aster1[i].y >= 1050) aster1.splice(i, 1);

		//проверим каждый астероид на столкновение с каждой пулей
		for (j in fire) {
			if (Math.abs(aster1[i].x + 25 - fire[j].x - 15) < 50 && Math.abs(aster1[i].y - fire[j].y) < 25) {

				//произошло столкновение
				if (soundClickExplosion());//звук взрыва

				//счет попаданий переменная (points)
				if (points++);
				console.log(points);

				//спавн взрыва
				expl.push({ x: aster1[i].x - 25, y: aster1[i].y - 25, animx: 0, animy: 0 });

				//помечаем астероид на удаление
				aster1[i].del = 1;
				fire.splice(j, 1);
				break;
			}
		}
		//удаляем астероиды
		if (aster1[i].del == 1) aster1.splice(i, 1);
	}

	document.getElementById("points").innerHTML = `POINTS: ` + points; //отрисовываем очки в html

	var level = 1;
	document.getElementById("level").innerHTML = `LEVEL: ` + level;
	if (points > 50) {
		level = 2;
		document.getElementById("level").innerHTML = `LEVEL: ` + level;
	}

	if (points > 100) {
		level = 3;
		document.getElementById("level").innerHTML = `LEVEL: ` + level;
	}

	if (points > 150) {
		level = 4;
		document.getElementById("level").innerHTML = `LEVEL: ` + level;
	}

	if (points > 200) {
		level = 5;
		document.getElementById("level").innerHTML = `LEVEL: ` + level;
	}

	if (points > 300) {
		level = 'HARDCORE';
		document.getElementById("level").innerHTML = level;
	}

	for (i in aster2) {
		aster2[i].x = aster2[i].x + aster2[i].dx;
		aster2[i].y = aster2[i].y + aster2[i].dy;
		aster2[i].angle = aster2[i].angle + aster2[i].dxangle;

		//граничные условия
		if (aster2[i].x <= 0 || aster2[i].x >= 950) aster2[i].dx = -aster2[i].dx;
		if (aster2[i].y >= 1050) aster2.splice(i, 1);

		//проверим каждый астероид на столкновение с каждой пулей
		for (j in fire) {

			if (Math.abs(aster2[i].x + 25 - fire[j].x - 15) < 50 && Math.abs(aster2[i].y - fire[j].y) < 25) {
				//произошло столкновение
				if (soundClickExplosion());//звук взрыва

				//счет выстрелов переменная (а)
				if (points++);
				console.log(points);


				//спавн взрыва
				expl.push({ x: aster2[i].x - 25, y: aster2[i].y - 25, animx: 0, animy: 0 });


				//помечаем астероид на удаление
				aster2[i].del = 1;
				fire.splice(j, 1); break;
			}
		}
		//удаляем астероиды
		if (aster2[i].del == 1) aster2.splice(i, 1);
	}

	//двигаем пули
	for (i in fire) {
		fire[i].x = fire[i].x + fire[i].dx;
		fire[i].y = fire[i].y + fire[i].dy;

		if (fire[i].y < -30) fire.splice(i, 1);
	}

	//Анимация взрывов
	for (i in expl) {
		expl[i].animx = expl[i].animx + 0.5;
		if (expl[i].animx > 4) { expl[i].animy++; expl[i].animx = 0 }
		if (expl[i].animy > 4)
			expl.splice(i, 1);
	}

	//анимация щита
	/* ship.animx = ship.animx + 1;
	if (ship.animx > 4) { ship.animy++; ship.animx = 0 }
	if (ship.animy > 3) {
		ship.animx = 0; ship.animy = 0;
	} */

	//спавн жизней
	if (Timer % 100 == 0) { //условие колличества тиков для спавна жизни
		life1.push({
			angle: 0,
			dxangle: Math.random() * 0.2 - 0.1,
			del: 0,
			x: Math.random() * 950,
			y: -50,
			dx: Math.random() * 2 - 1,
			dy: Math.random() * 2 + 1
		});
	}

	//движение жизней
	for (i in life1) {
		life1[i].x = life1[i].x + life1[i].dx;
		life1[i].y = life1[i].y + life1[i].dy;
		life1[i].angle = life1[i].angle + life1[i].dxangle;

		//граничные условия
		if (life1[i].x <= 0 || life1[i].x >= 950) life1[i].dx = -life1[i].dx;
		if (life1[i].y >= 1050) life1.splice(i, 1);
	}

	//проверим корабль на столкновение с жизнью
	for (i in life1) {
		if (ship.x < life1[i].x + (30) &&
			ship.x + (30) > life1[i].x &&
			ship.y < life1[i].y + (30) &&
			ship.y + (30) > life1[i].y) {
			life = life + 1;
			points = points + 5;
			life1.splice(i, 1);
			soundLife();
		}
	}


	//спавн бонусов
	if (Timer % 500 == 0) { //условие колличества тиков для спавна бонуса
		bonus.push({
			angle: 0,
			dxangle: Math.random() * 0.2 - 0.1,
			del: 0,
			x: Math.random() * 950,
			y: -50,
			dx: Math.random() * 2 - 1,
			dy: Math.random() * 2 + 1
		});
	}

	//движение жизней
	for (i in bonus) {
		bonus[i].x = bonus[i].x + bonus[i].dx;
		bonus[i].y = bonus[i].y + bonus[i].dy;
		bonus[i].angle = bonus[i].angle + bonus[i].dxangle;

		//граничные условия
		if (bonus[i].x <= 0 || bonus[i].x >= 950) bonus[i].dx = -bonus[i].dx;
		if (bonus[i].y >= 1050) bonus.splice(i, 1);
	}

	//проверим корабль на столкновение с жизнью
	for (i in bonus) {
		if (ship.x < bonus[i].x + (30) &&
			ship.x + (30) > bonus[i].x &&
			ship.y < bonus[i].y + (30) &&
			ship.y + (30) > bonus[i].y) {
			points = points + 10;
			bonus.splice(i, 1);
			soundBonus();
		}
	}
}

function render() {
	//очистка холста
	context.clearRect(0, 0, 1000, 600);
	//рисуем фон
	//context.drawImage(fon, 0, 0, 600, 600);
	//рисуем пули
	for (i in fire)
		context.drawImage(fireimg, fire[i].x, fire[i].y, 10, 22);
	//рисуем корабль
	context.drawImage(shipimg, ship.x, ship.y);
	//рисуем щит
	//context.drawImage(shieldimg, 192*Math.floor(ship.animx),192*Math.floor(ship.animy),192,192, ship.x-25, ship.y-25, 100, 100);

	//рисуем жизни
	for (i in life1) {
		context.drawImage(life1img, life1[i].x, life1[i].y, 40, 30);
	}

	//рисуем бонусы
	for (i in bonus) {
		context.drawImage(bonusimg, bonus[i].x, bonus[i].y, 50, 50);
	}

	//рисуем астероиды
	for (i in aster1) {
		//вращение астероидов
		context.save();
		context.translate(aster1[i].x + 25, aster1[i].y + 25);
		context.rotate(aster1[i].angle);
		context.drawImage(aster1img, -25, -25, 50, 50);
		context.restore();
	}

	for (i in aster2) {
		//вращение астероидов
		context.save();
		context.translate(aster2[i].x + 25, aster2[i].y + 25);
		context.rotate(aster2[i].angle);
		context.drawImage(aster2img, -25, -25, 50, 50);
		context.restore();
	}

	//рисуем взрывы
	for (i in expl) {
		context.drawImage(explimg, 190 * Math.floor(expl[i].animx), 190 * Math.floor(expl[i].animy), 190, 190, expl[i].x, expl[i].y, 100, 100);
	}

	if (life > 5) {
		life = 5;
	}


	if (life == 5) {
		document.getElementById('life').style.color = "green";
	}
	if (life == 4) {
		document.getElementById('life').style.color = "yellow";
	}
	if (life == 3) {
		document.getElementById('life').style.color = "yellow";
	}
	if (life == 2) {
		document.getElementById('life').style.color = "red";
	}
	if (life == 1) {
		document.getElementById('life').style.color = "red";
	}

	
}

function soundClickBlaster() {
	var audio = new Audio(); // Создаём новый элемент Audio
	audio.src = 'blaster.mp3'; // Указываем путь к звуку "клика"
	audio.autoplay = true; // Автоматически запускаем
}

function soundClickExplosion() {
	var audio = new Audio(); // Создаём новый элемент Audio
	audio.src = 'explosion.mp3'; // Указываем путь к звуку "клика"
	audio.autoplay = true; // Автоматически запускаем
}

function soundClickСollision() {
	var audio = new Audio(); // Создаём новый элемент Audio
	audio.src = 'collision.mp3'; // Указываем путь к звуку "клика"
	audio.autoplay = true; // Автоматически запускаем
}

function oneShot() {
	fire.push({ x: ship.x + 20, y: ship.y, dx: 0, dy: -5.2 });
	soundClickBlaster()
}

function testLoadData() {
	$.ajax("https://gamespacejorneyv01.dzmitry.repl.co/name.json",
		{ type:'GET', dataType:'json', success:dataLoaded, error:errorHandler }
	);
}

function dataLoaded(data) {
	localStorage.setItem('player', JSON.stringify(data));
	console.log('загруженные через AJAX данные:');
	console.log(data);
}

function errorHandler(statusStr,errorStr) {
	alert(statusStr+' '+errorStr);
}

testLoadData();

var localPlayer = localStorage.getItem('player');
data = JSON.parse(localPlayer);

/* var player = [
	{ neme: 'Saimon', point: '412' },
	{ name: 'Lex', point: '384' },
	{ name: 'Xobot', point: '376' },
]; */

function playerAdd() {

	if (document.getElementById("name").value == '') {
		alert("Please enter a valid name");
	}
	else {
		data.push({
			name: document.getElementById('name').value,
			point: points,
		})
		localStorage.setItem('player', JSON.stringify(data));

		window.location.reload();
	}
}

function exit() {
	window.close();
}

function soundClickBlaster() {
	var audio = new Audio(); // Создаём новый элемент Audio
	audio.src = 'blaster.mp3'; // Указываем путь к звуку "клика"
	audio.autoplay = true; // Автоматически запускаем
}

function soundClickExplosion() {
	var audio = new Audio(); // Создаём новый элемент Audio
	audio.src = 'explosion.mp3'; // Указываем путь к звуку "клика"
	audio.autoplay = true; // Автоматически запускаем
}

function soundLife() {
	var audio = new Audio(); // Создаём новый элемент Audio
	audio.src = 'life.mp3'; // Указываем путь к звуку "клика"
	audio.autoplay = true; // Автоматически запускаем
}

function soundBonus() {
	var audio = new Audio(); // Создаём новый элемент Audio
	audio.src = 'bonus.mp3'; // Указываем путь к звуку "клика"
	audio.autoplay = true; // Автоматически запускаем
}

/* function soundLevelUp() {
	var audio = new Audio(); // Создаём новый элемент Audio
	audio.src = 'levelUp.mp3'; // Указываем путь к звуку "клика"
	audio.autoplay = true; // Автоматически запускаем
} */

//основной игровой цикл
function game() {
	update();
	render();
	requestAnimFrame(game);
}

//старт игры
function installGame() {
	init();
	game();
}

function exitMenu() {
	document.getElementById('containerGame').style.display = "none";
	document.getElementById('containerMenu').style.display = "block";
}




