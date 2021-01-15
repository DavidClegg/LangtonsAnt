// Initialising the canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
// Adding a little variance to the width and height to produce multiple patterns from the same screen resolution
const width = window.innerWidth - parseInt(Math.random()*2);
const height = window.innerHeight - parseInt(Math.random()*2);
canvas.setAttribute("width", `${width}px`);
canvas.setAttribute("height", `${height}px`);

// Initialising the grid
let grid = [];
for(let h = 0; h < height; h++)
{
    grid.push([])
    for(let w = 0; w < width; w++)
    {
        // This just pushes an array of 0's
        grid[h].push([0])
    }
}

// Initialising the ant.
// This is built to be expandable and include multiple ants
let y = Math.floor(height * 0.5); // Y Position
let x = Math.floor(width * 0.5); // X Position
let d = 0; // Current direction
ants = [ // An array of the ants in the game.
    {"y" : Math.floor(height * 0.5),
     "x" : Math.floor(width * 0.5),
     "d" : 0}
     // I likely could have made this with a function to simplify it.
]
// Functions that take in an ant and changes it's x or y.
const dDN = (a) => a.y++; // Down
const dUP = (a) => a.y--; // Up
const dRT = (a) => a.x++; // Right
const dLT = (a) => a.x--; // Left
const directions = [dUP, dRT, dDN, dLT]; // Directions

// The colour scheme I went with originally.
const colours = ['rgb(176, 218, 79)',"#333"]//'rgb(39, 75, 98)'];
ctx.fillStyle = colours[1];
ctx.fillRect(0, 0, canvas.width, canvas.height); // Flood fill the background
let m = 0; // Move number, used in testing to skip to m steps
let stepScale = 1000; // Number of updates per frame.
function update()
{
    // Main update loop
    for(let i=0;i<stepScale;i++){
        m++;
        for(let ant of ants){
            let block = grid[ant.y][ant.x]; // Gets the current location of the current ant
            if(block == 0)
            {
                // if it is standing on 0 then rotate clockwise
                // and change it to 1
                ant.d = (ant.d + 1) % 4;
                grid[ant.y][ant.x] = 1;
                ctx.fillStyle = `hsl(${m/100000%360}, 70%, 50%)`;
                //ctx.fillStyle = colours[0]; // default

                //ctx.fillStyle = `hsl(${m/10000%180+180}, 100%, 50%)`;
                // colour vomit, don't use

            } else if(block == 1)
            {
                // if it is standing on 1 then rotate anticlockwise
                // and change it to 0
                ant.d = (ant.d + 3) % 4; // +3 is used instead of -1 because this will never cause an underflow if ant.d == 0
                grid[ant.y][ant.x] = 0;
                ctx.fillStyle = colours[1]; // default

                //ctx.fillStyle = `hsl(${m/100000%180}, 100%, 50%)`
                //colour vomit, don't use
            }
            // colour the current block
            ctx.fillRect(ant.x, ant.y, 1, 1);
            // move the current ant
            directions[ant.d](ant);
            // deal with borders by treating the surface as a torus
            ant.x = (ant.x + width)%width;
            ant.y = (ant.y + height)%height;
        }
    }
    requestAnimationFrame(update);
}
update()
