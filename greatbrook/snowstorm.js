/**
author: Amos Decker

creates a snowstorm effect using javascript canvas
**/

// get the canvas element by ID:
var canvas = document.getElementById("snow");
var width = canvas.width;
var height = canvas.height;

// get the context - the 2d plane on which you can draw
var ctx = canvas.getContext("2d");

var horizDist = .15
var vertDist = .3
var radiusAdj = .8 // the bigger this is the bigger the flakes will be 

var flakes = []

var prevScrollPos = 0

function addSnow(numFlakes)
/* adds a certain number of flakes to the screen */
{
    clearCanvas()
    
    ctx.fillStyle = 'white'

    var radius = Math.random() + radiusAdj
    var centerX = Math.random() * width

    ctx.beginPath()
    ctx.arc(centerX, 0, radius, 0, 2 * Math.PI)
    ctx.fill()

    flakes.push([centerX, 0, radius])
}


function moveFlakes()
/* removes the snowflakes that have gotten to the bottom */
{
    var scroll = window.scrollY // gets how far from the top of window the scroll bar is
    clearCanvas()
    var newFlakes = []
    for(var i = 0; i < flakes.length; i++)
    {
      flakes[i][1] += vertDist + (scroll - prevScrollPos) // how much to move vertically. It adjusts for scroll position so if you scroll down the flakes will appear to be in the same spot relative to the parallax

      var moveRight = (flakes[i][2] > 0.5 + (radiusAdj / 2)); // if the radius is above a certain size, move it to the right
      if(moveRight)
      {
        flakes[i][0] += Math.random() * horizDist
      }
      else
      {
        flakes[i][0] -= Math.random() * horizDist
      }
      

      if(flakes[i][1] < height && flakes[i][0] > 0 && flakes[i][0] < width)
      {
        newFlakes.push(flakes[i])
      }
      
      ctx.fillStyle = 'white'

      ctx.beginPath()
      ctx.arc(flakes[i][0], flakes[i][1], flakes[i][2], 0, 2 * Math.PI)
      ctx.fill()
    }
    prevScrollPos = scroll
    flakes = newFlakes

}


function clearCanvas()
/* deletes everything from the canvas */
{
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

setInterval(addSnow, 1000, 10);
setInterval(moveFlakes, 15);