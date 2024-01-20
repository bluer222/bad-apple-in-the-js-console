//define vars
var width;
var space;
var char;
var size;
var height;
var spaceWidth = 1;
var charWidth = 1;
var lines = [];
var images = [];
var style = "";
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
//open function

async function newFrame(frame) {
    //once image loads
    images[frame].addEventListener("load", () => {
        // Iterate through pixels using x and y coordinates
        //draw image
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(images[frame], 0, 0, width, height);
        canvas.width = width;
        canvas.height = height;
        //get windows to open
        let currentColor = "";
        let currentWidth = "";
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        var x = 0;
        var y = 0;
        while (y < canvas.height) {
            const index = (y * canvas.width + x) * 4; // Calculate index based on x and y
            // Get pixel colors
            const pixelColor = data[index] < 100;
            if (pixelColor) {
                if (currentColor == "") {
                    currentColor = "black";
                    currentWidth = 0;
                } else if (currentColor == "black") {
                    currentWidth += 1;
                } else if (currentColor == "white") {
                    lines[y / size] += space.repeat(Math.round(currentWidth / spaceWidth));
                    currentColor = ""
                }
            } else {
                if (currentColor == "") {
                    currentColor = "white";
                    currentWidth = 0
                } else if (currentColor == "white") {
                    currentWidth += 1
                } else if (currentColor == "black") {
                    lines[y / size] += char.repeat(Math.round(currentWidth / charWidth));
                    currentColor = ""
                }
            }
            x += 1; // Move to the next pixel horizontally
            if (x >= canvas.width) {
                if (currentColor == "white") {
                    lines[y / size] += space.repeat(Math.round(currentWidth / spaceWidth));
                    currentColor = ""
                }
                if (currentColor == "black") {
                    lines[y / size] += char.repeat(Math.round(currentWidth / charWidth));
                    currentColor = ""
                }
                x = 0; // Reset x to the beginning of the row
                y += size; // Move to the next row, skipping 9 rows
            }
        }
        lines.forEach((element) => console.log(element, style));
        lines = [];
        for (let y = 0; y < height; y += size) {
            lines.push([]);
        }
        newFrame(frame + 1);
    }, false,);
}
function getPixelColor(x, y) {
    const imgData = ctx.getImageData(x, y, 1, 1);
    const imageData = imgData.data;
    // Extract the color components (red, green, blue, alpha)
    const red = imageData[0];
    //const green = imageData[1];
    //const blue = imageData[2];
    // Return the color as a string in the format "rgb(red, green, blue)"
    return red < 100;
}
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    ctx.font = font;
    const metrics = ctx.measureText(text);
    return metrics.width;
}

function start() {
    //resolution for edge detection
    width = Number(document.getElementById("pix").value);
    height = width * (3 / 4);
    space = document.getElementById("space").value;
    char = document.getElementById("char").value;
    size = Number(document.getElementById("size").value);
    style = size + "px Arial";
    spaceWidth = getTextWidth(space, style);
    charWidth = getTextWidth(char, style);
    for (let y = 0; y < height; y += size) {
        lines.push([]);
    }
    console.log("loading images")
    for (let i = 0; i < 6562; i++) {
        //load image
        images.push(new Image()); // Create new img element
        images[i].src = "badApple/bad_apple_" + i.toString().padStart(3, 0) + ".png";
    }
    console.log("starting")
    newFrame(1);
}