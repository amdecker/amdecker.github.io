/**
author: Amos Decker

Sets up a canvas that is used for showing the progress of an event
**/

// get the canvas element by ID:
var canvas = document.getElementById("loading-canvas");

// get the context - the 2d plane on which you can draw
var ctx = canvas.getContext("2d");


function showProgress(percentage)
/* given the percentage is between 0 and 1, it fills the screen from top down with blue */
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
}


function clearCanvas()
/* deletes everything from the canvas */
{
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}
