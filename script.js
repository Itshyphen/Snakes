var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var score=0;
var lives=3;
var fps=8;
var paused=false;
function startGame() {
    apple=new Component(gs-2,gs-2,"red",14,14);
    obstacle=new Component(gs-2, gs-2, "blue", 3, 3);
    game.start();
}
// game parameter
var gs = tc = 20; // 20 x 20 = 400
var dx = dy = 0;

// snake parameter
var minsize = 3;
var tail = minsize;
var body = [];
var snakeX = snakeY = 10;
var game = {
    start : function() {
        this.interval = setInterval(render, 1000/fps);
    },
    clear : function() {

        context.clearRect(0, 0, canvas.width, canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
        document.getElementById("bg").pause();
    }
}

function render() {
    document.getElementById("bg").play();
    if(apple.collide()){
        eat.play();
        tail++;
        score++;
        document.getElementById("eat").play();
        document.getElementById('score').innerHTML=score.toString();
        apple.newPos();
    }
    if(obstacle.collide()){
        document.getElementById("fail").play();
        tail=tail+4;
        score--;
        document.getElementById('score').innerHTML=score.toString();
        obstacle.newPos();
    }
    game.clear();
    draw();
    apple.draw();
    if (score>6) obstacle.draw();
}
// draw the snake
function draw() {
    // movement of snake
    snakeX += dx;
    snakeY += dy;

    if (snakeX < 0) snakeX = gs - 1;
    if (snakeX > gs - 1) snakeX = 0;
    if (snakeY < 0) snakeY = gs - 1;
    if (snakeY > gs - 1) snakeY = 0;

    context.fillStyle = "rgba(0,0,0,0)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = "black";
    for (var i = 0; i < body.length; i++) {
        context.beginPath();
        context.arc(body[i].x * tc, body[i].y * tc, 9, 0, 2 * Math.PI, 0);
        context.fill();

        //snake bites it's tail
        if (body[i].x == snakeX && body[i].y == snakeY && tail>4) {
            lives--;
            tail=0.6*tail;
            document.getElementById("fail").play();
            if(lives==0){
                game.stop();
                document.getElementById('hide').style.display='block';
            }
            document.getElementById('lives').innerHTML=lives.toString();

        }
    }

    body.push({ x: snakeX, y: snakeY });
    while (body.length > tail) {
        body.shift();
    }
}
function Component(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;

    this.collide=function () {
        var d1 = snakeX - this.x;
        var d2 = snakeY - this.y;
        var distance = Math.sqrt(d1 * d1 + d2 * d2)*tc;

        if (distance < 18) {
            // collision detected!
            return true;
        }
        return false;
    }

    this.newPos=function(){
        this.x = Math.floor(Math.random()*gs);
        this.y = Math.floor(Math.random()*gs);
    }
    this.draw = function() {
        context.beginPath();
        context.arc(this.x*tc, this.y*tc, 9, 0, 2 * Math.PI, 0);
        context.fillStyle = color;
        context.fill();
    }
}

// input
document.addEventListener("keydown",keyPush);
function keyPush(event){
    switch(event.keyCode){
        case 37:
            if(dx!==1){
                dx=-1;dy=0;}
            break;
        case 38:
            if(dy!==1){
                dx=0;dy=-1;}
            break;
        case 39:
            if(dx!==-1){
                dx=1;dy=0;}
            break;
        case 40:
            if(dy!==-1){
                dx=0;dy=1;}
            break;
        case 32:
            paused=!(paused);
            paused?game.stop():game.start();
            break;
    }
}
