﻿
var canvas = document.getElementById("jogo");
var context = canvas.getContext("2d");
var audio = document.getElementById('audio');
var raio = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;
var altRaq = 10;
var largRaq = 75;
var raqX = (canvas.width - largRaq) / 2;
var pressDir = false;
var pressEsq = false;
var linhaTijolo = 5;
var colunaTijolo = 5;
var largTij = 75;
var altTij = 20;
var preencTij = 10;
var margemTopo = 55;
var margemEsq = 30;
var score = 0;
var lives = 3;

var tijolos = [];
for (var c = 0; c < colunaTijolo; c++) {
  tijolos[c] = [];
  for (var r = 0; r < linhaTijolo; r++) {
    tijolos[c][r] = {
      x: 0,
      y: 0,
      status: 1
    };
  }
}

document.addEventListener("keydown", pressionaTecla, false);
document.addEventListener("keyup", soltaTecla, false);
document.addEventListener("mousemove", moveMouse, false);


//função para verificar se a tecla foi pressionada
function pressionaTecla(e) {
  if (e.keyCode == 39) {
    pressDir = true;
  } else if (e.keyCode == 37) {
    pressEsq = true;
  }
}

//função para verificar se a tecla foi solta
function soltaTecla(e) {
  if (e.keyCode == 39) {
    pressDir = false;
  } else if (e.keyCode == 37) {
    pressEsq = false;
  }
}

//função para detectar o movimento do mouse
function moveMouse(e) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    raqX = relativeX - largRaq / 2;
  }
}


//função para detectar a colisão
function detectaColisao() {
  for (var c = 0; c < colunaTijolo; c++) {
    for (var r = 0; r < linhaTijolo; r++) {
      var b = tijolos[c][r];
      if (b.status == 1) {
        if (x > b.x && x < b.x + largTij && y > b.y && y < b.y + altTij) {
          dy = -dy;
          b.status = 0;
          score++;
          if (score == linhaTijolo * colunaTijolo) {
            alert("Parabéns.Você venceu!");
            document.location.reload();
          }
        }
      }
    }
  }
}

//função para desenhar a bola
function desenhaBola() {
  context.beginPath();
  context.arc(x, y, raio, 0, Math.PI * 2);
  context.fillStyle = "#5F9EA0";
  context.fill();
  context.closePath();
}

//função para desenhar a raquete
function desenhaRaquete() {
  context.beginPath();
  context.rect(raqX, canvas.height - altRaq, largRaq, altRaq);
  context.fillStyle = "#2F4F4F";
  context.fill();
  context.closePath();
}

//função para desenhar os tijolinhos
function desenhaTijolo() {
  for (var c = 0; c < colunaTijolo; c++) {
    for (var r = 0; r < linhaTijolo; r++) {
      if (tijolos[c][r].status == 1) {
        var tX = (r * (largTij + preencTij)) + margemEsq;
        var tY = (c * (altTij + preencTij)) + margemTopo;
        tijolos[c][r].x = tX;
        tijolos[c][r].y = tY;
        context.beginPath();
        context.rect(tX, tY, largTij, altTij);
        context.fillStyle = "#FFA07A";
        context.fill();
        context.closePath();
      }
    }
  }
}

//função para escrever o nome do jogo
function escreveNome() {
  context.font = "16px Arial";
  context.fillStyle = "#2F4F4F";
  context.fillText("Breakout" , 190, 25);
}
//função para escrever a pontuação
function escrevePonto() {
  context.font = "16px Arial";
  context.fillStyle = "#2F4F4F";
  context.fillText("Pontos: " + score, 8, 40);
}

//função para escrever as vidas restantes
function escreveVida() {
  context.font = "16px Arial";
  context.fillStyle = "#2F4F4F";
  context.fillText("Vidas: " + lives, canvas.width - 65, 40);
}

//função para desenhar todos os elementos do jogo
function desenha() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  desenhaTijolo();
  desenhaBola();
  desenhaRaquete();
  escrevePonto();
  escreveVida();
  escreveNome();
  detectaColisao();

  if (x + dx > canvas.width - raio || x + dx < raio) {
    dx = -dx;
  }
  if (y + dy < raio) {
    dy = -dy;
  } else if (y + dy > canvas.height - raio) {
    if (x > raqX && x < raqX + largRaq) {
      dy = -dy;
    } else {
      lives--;
      audio.play(); // chamada para o áudio quando a bolinha cair fora da raquete
      if (!lives) {
        alert("Você perdeu.Tente novamente!");
        document.location.reload();
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        raqX = (canvas.width - largRaq) / 2;
      }
    }
  }

  if (pressDir && raqX < canvas.width - largRaq) {
    raqX += 7;
  } else if (pressEsq && raqX > 0) {
    raqX -= 7;
  }

  x += dx;
  y += dy;
  requestAnimationFrame(desenha);
}

desenha();