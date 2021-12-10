


/** TODO: maybe have the obstacles come from top to bottom, with the player
 * going side to side to be more like a volcano. change gravity to something else
 * 
 * Also, have the obstacles introduce questions if you hit them which gives you time 
 * advantages for getting them right.
 * 
 * users can ignore all and still get to the end but will lose time at the end.
 * 
 * will additionally get the questions at the end as an option to learn more!
 * 
 * make responsive to fit with the website
 * 
 */






var myGamePiece;
var myObstacles = [];
var myClimbed;
var timesRested = 0;
var endPoint = 100;
var completed = false;

function startGame() {
    myGamePiece = new component(30, 30, "red", 10, 120);
    myGamePiece.gravity = 0.05;
    myClimbed = new component("30px", "Consolas", "black", 150, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 480; // og: 480
        this.canvas.height = 270; // og: 270
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        this.hitBottom();
        this.hitTop();
    }
    this.hitTop = function () {
        if (this.y <= 0) {
            this.y = 0;
            this.gravitySpeed = 0;
        }
    }
    this.hitBottom = function () {
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        // Removes the bars that end their route through the canvas (saves from an ever-growing array)
        if (myObstacles[1].x == 0) {
            myObstacles.shift();
            myObstacles.shift();
            console.log("removed the two oldest (top/bottom obstacles from array")
        }
        // Checks if the player touches an obstacle. if so, prompts them for a question
        // It then removes the two oldest (the obstacle pair that player touched) and continues with
        // the game
        if (myGamePiece.crashWith(myObstacles[i])) {
            alert("you decided to take a well deserved rest. here is something to think about:");
            // TODO: change from alert to an actual question prompt somehow..
            // if they are right, give a bonus to the points.
            timesRested += 1;
            myObstacles.shift();
            myObstacles.shift();
        }
        if (myGamePiece.crashWith(myObstacles[i]) && completed == true) {
            alert("you finished!!!");
            // TODO: change from alert to an actual question prompt somehow..
            // if they are right, give a bonus to the points.
            return;
        }
    }
    myGameArea.clear();
    myGameArea.frameNo += 1;

    // Creates a new bar every 150 ms
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        y = myGameArea.canvas.width;
        minHeight = 20; //og 20
        maxHeight = 200; //og 200
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        if (myGameArea.frameNo < endPoint) {
            myObstacles.push(new component(10, height, "green", x, 0));
            myObstacles.push(new component(10, x - height - gap, "green", x, height + gap));
        } else {
            // creates an unescapable finish line at height of volcano
            myObstacles.push(new component(x, y, "blue", x, 0));
            completed = true;
        }

        console.log(myObstacles)
    }

    // creates an unescapable finish line at height of volcano
    //if (myGameArea.frameNo == endPoint) {
    //  height = myGameArea.canvas.height;
    // x, width = myGameArea.canvas.width;
    // myObstacles.push(new component(width, height, "blue", x, 0));
    //}
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
    }

    myClimbed.text = "Feet climbed: " + myGameArea.frameNo;
    myClimbed.update();
    myGamePiece.newPos();
    myGamePiece.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}

function questions() {

}