// get the canvas element by ID:
var canvas = document.getElementById("loading-canvas");

// get the context - the 2d plane on which you can draw
var ctx = canvas.getContext("2d");

//ctx.textAlign = "start";
//ctx.textBaseline = "top";
//ctx.font = "25px Futura";
//
//ctx.fillStyle = "black";
//ctx.fillRect(0, 240, 500, 75)
//
//ctx.fillStyle = "white";
//ctx.fillText("use your arrow keys or the buttons below", 22, 250);
//ctx.fillText("to move the square throught the maze", 35, 280);
////                
////                ctx.fillStyle = "yellow"
////                ctx.fillRect(0, 0, 150, 75); // (x, y, width, height)


function showProgress(percentage)
/* the percentage is between 0 and 1.  */
{
    clearCanvas()
    ctx.fillStyle = "blue"
    ctx.fillRect(0, 0, canvas.width, percentage * canvas.height)
}

function showDone()
/* Displays a green check showing that the process is complete */
{
    console.log("SHOWING DONE")
    clearCanvas()
    ctx.fillStyle = "green"
    ctx.fillRect(0, 0, canvas.width, canvas.height)//    var img = new Image();
//    img.onload = function () {ctx.drawImage(img, 0, 0)}
//    img.src = "images/ok.png";
}

function clearCanvas()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}


//ctx.fillStyle = "blue";
//ctx.fillRect(0, 0, 20, 20);
//
//// SETTING UP MOTION
//var xPos = 5;
//var yPos = 5;
//
//// MOVE stuff when button is clicked
//function move(x, y)
//{
//    xPos += x;
//    yPos += y;
//
//    if (xPos > 500)
//    {
//        xPos = 0;
//    }
//    if (xPos < 0)
//    {
//        xPos = 500;
//    }
//    if (yPos > 500)
//    {
//        yPos = 0;
//    }
//    if (yPos < 0)
//    {
//        yPos = 500;
//    }
//
//    // clears the canvas
//    ctx.clearRect(0, 0, canvas.width, canvas.height);
//
//    // draws new rectangle in new position
//    ctx.fillRect(xPos, yPos, 20, 20);
//}
//
//window.onkeydown = function (e) 
//{
//    var code = e.keyCode;
//    switch(code)
//    {
//        case 38: // up
//            move(0, -5);
//            break;
//        case 39: // right
//            move(5, 0);
//            break;
//        case 40: // down
//            move(0, 5);
//            break;
//        case 37: // left
//            move(-5, 0);
//            break;
//    }
//};