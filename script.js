// Create Canvas
const canvas = document.getElementById("pong");
const context = canvas.getContext("2d");

// Game States
let gameStarted = false;
let gameOver = false;

// Draw Start Text
function drawStartText() {
    context.fillStyle = "WHITE";
    context.font = "30px orbit";
    context.fillText("Press any key to start the game", canvas.width / 2 - 280, canvas.height / 2);
}

// Draw User Paddle

const user = {
    x: 10,
    y: 1 + canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}
// Draw CPU Paddle

const cpu = {
    x: (canvas.width - 10) - 10,
    y: canvas.height / 2 - 50,
    width: 10,
    height: 100,
    color: "WHITE",
    score: 0
}

//Draw Ball 

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    speed: 5,
    // velocity = speed + direction
    velocityX: 5,
    velocityY: 5,
    color: "WHITE"
}

// Draw Rect Function 

function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}
//Create Net
const net = {
    x: canvas.width / 2 - 1,
    y: 0,
    width: 2,
    height: 5,
    color: "WHITE"
}
// Draw Net
function drawNet() {
    for (let i = 0; i <= canvas.height; i += 14) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color)
    }
}

// Draw Circle

function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2);
    context.closePath();
    context.fill();
}

// Draw Text
function drawText(text, x, y, color) {
    context.fillStyle = color;
    context.font = "40px orbit";
    context.fillText(text, x, y);

    if (gameOver) {
        context.font = "30px orbit";
        context.fillText("Press 'Restart' to play again", canvas.width / 2 - 275, canvas.height / 2 + 50);
    }
}

function render() {
    // clear canvas
    drawRect(0, 0, canvas.width, canvas.height, "BLACK");
    // The net
    drawNet();
    // The Score
    drawText(user.score, canvas.width / 4, canvas.height / 5, "WHITE");
    drawText(cpu.score, 3 * canvas.width / 4, canvas.height / 5, "WHITE");
    // The User and CPU paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(cpu.x, cpu.y, cpu.width, cpu.height, cpu.color);
    // The Ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
    // Display winner when game is over
    if (gameOver) {
        let winner = user.score > cpu.score ? "HUMAN" : "MARS";
        drawText(`Winner: ${winner}`, canvas.width / 2 - 175, canvas.height / 2 - 100, "WHITE");
    }

}
// Game Restart
function restart() {
    window.location.reload();
}

// User paddle Controller
document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowUp") {
        user.y -= 55;
    } else if (event.key === "ArrowDown") {
        user.y += 55;
    }
});

// Collision detection (p = PLayer & b = Ball)        
function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;

}
// Update (logic)
function update() {
    if (gameOver) return;

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    // AI Control for CPU
    let cpuLevel = 0.1;
    cpu.y += (ball.y - (cpu.y + cpu.height / 2)) * cpuLevel;
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.velocityY = - ball.velocityY;
    }
    let player = (ball.x + ball.radius < canvas.width / 2) ? user : cpu;

    if (collision(ball, player)) {
        // Position of the ball colliding with the player 
        let collidePoint = (ball.y - (player.y + player.height / 2));
        // Normalisaion
        collidePoint = collidePoint / (player.height / 2);
        //calculate angle in the radian 
        let angleRad = collidePoint * (Math.PI / 4);
        // X direction of the  ball when it collides
        let direction = (ball.x + ball.radius < canvas.width / 2) ? 1 : -1;
        //change vel X and Y 
        ball.velocityX = direction * ball.speed * Math.cos(angleRad);
        ball.velocityY = ball.speed * Math.sin(angleRad);
        // When ball hit by the paddle, the speed inscreases
        ball.speed += 0.5;

    }
    //update the score
    if (ball.x - ball.radius < 0) {
        // CPU scored
        cpu.score++;
        resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
        // User scored
        user.score++;
        resetBall();
    }
    // Check for score limit
    if (user.score >= 11 || cpu.score >= 11) {
        gameOver = true;
    }
    function resetBall() {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.speed = 5;
        if (user.score + 1) {
            ball.velocityX = ball.velocityX;
            ball.velocityX = -5;
            ball.velocityY = 5;
        } else {
            ball.velocityX = ball.velocityX;
            ball.velocityX = 5;
            ball.velocityY = 5;
        }

    }

}
// Event Listener for starting the game
document.addEventListener("keydown", function (event) {
    if (!gameStarted) {
        gameStarted = true;
        game();
    }
});
//Game initailisaion 
function game() {
    if (!gameStarted) {
        drawRect(0, 0, canvas.width, canvas.height, "BLACK");
        drawStartText();
        return;
    }
    render();
    update();
}

canvas.addEventListener("mousemove", function (event) {
    let rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height / 2;
});

// Loop 
const framePerSecond = 55;
setInterval(game, 1000 / framePerSecond);
