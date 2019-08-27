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
var radiusAdj = 1 // the bigger this is the bigger the flakes will be 

var flakes = []

var prevScrollPos = 0

function addSnow(numFlakes)
/* adds a certain number of flakes to the screen */
{
    clearCanvas()
    
    ctx.fillStyle = 'white'

    for(var i = 0; i < numFlakes; i++)
    {
      var radius = Math.random() + radiusAdj
      var centerX = Math.random() * width

      ctx.beginPath()
      ctx.arc(centerX, 0, radius, 0, 2 * Math.PI)
      ctx.fill()

      flakes.push([centerX, 0, radius, Math.random()]) // that last one is to make 1/2 move slightly right as they fall and 1/2 move left
    }
    
}


function adjustScroll()
/* changes position of flakes to account for scrolling up/down to maintain parallax effect */
{
    var scroll = window.pageYOffset // gets how far from the top of window the scroll bar is
    clearCanvas()
    var newFlakes = []
    for(var i = 0; i < flakes.length; i++)
    {
      flakes[i][1] += scroll - prevScrollPos // how much to move vertically. It adjusts for scroll position so if you scroll down the flakes will appear to be in the same spot relative to the parallax
      

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


function moveFlakes()
/* removes the snowflakes that have gotten to the bottom */
{
    clearCanvas()
    var newFlakes = []
    for(var i = 0; i < flakes.length; i++)
    {
      flakes[i][1] += vertDist// how much to move vertically. 

      var moveRight = (flakes[i][3] > .5); // 1/2 should move right and 1/2 to the left
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
    flakes = newFlakes
}


function clearCanvas()
/* deletes everything from the canvas */
{
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

setInterval(addSnow, 1001, 5);
setInterval(moveFlakes, 15, false);
setInterval(adjustScroll, 2);