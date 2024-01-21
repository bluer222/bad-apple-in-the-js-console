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
var frame = 1;
var framestart = 0;
var recording = false;
var frameend = 0;
console.warn = () => {};
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
//open function(async to prevent setimeout from complaining)
async function newFrame() {
if (images[frame].complete && images[frame].naturalWidth !== 0) {
    // Image is already loaded, proceed with using it
    drawIt();
  } else {
    //wait for it to load first
    images[frame].addEventListener("load", () => {
        drawIt(frame);
    }, false,);
  }
}
var recording;
var video = false;
async function record(){
    recording = true
          // Prompt the user to select a screen or window to capture
          const stream = await navigator.mediaDevices.getDisplayMedia();
           video = document.createElement('video');
          video.srcObject = stream;
          await video.play();
}
function captureScreenshot() {
    try {
      // Create a canvas to draw the video frame onto
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
  
      // Draw the video frame onto the canvas
      context.drawImage(video, 0, 0);
  
      // Create a link to download the canvas as an image
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png');
      link.download = 'screenshot.png';
      link.click();
  
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  }
function drawIt(){
     // Iterate through pixels using x and y coordinates
        //draw image
        canvas.style.width = width + "px";
        canvas.style.height = height + "px";
        canvas.width = width;
        canvas.height = height/size;
        ctx.drawImage(images[frame], 0, 0, canvas.width, canvas.height);
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
            const pixelColor = data[index] < 127;
            if (pixelColor) {
                if (currentColor == "") {
                    currentColor = "black";
                    currentWidth = 0;
                } else if (currentColor == "black") {
                    currentWidth += 1;
                } else if (currentColor == "white") {
                    lines[y] += space.repeat(Math.round(currentWidth / spaceWidth));
                    currentColor = ""
                }
            } else {
                if (currentColor == "") {
                    currentColor = "white";
                    currentWidth = 0
                } else if (currentColor == "white") {
                    currentWidth += 1
                } else if (currentColor == "black") {
                    lines[y] += char.repeat(Math.round(currentWidth / charWidth));
                    currentColor = ""
                }
            }
            x += 1; // Move to the next pixel horizontally
            if (x >= canvas.width) {
                if (currentColor == "white") {
                    lines[y] += space.repeat(Math.round(currentWidth / spaceWidth));
                    currentColor = ""
                }
                if (currentColor == "black") {
                    lines[y] += char.repeat(Math.round(currentWidth / charWidth));
                    currentColor = ""
                }
                x = 0; // Reset x to the beginning of the row
                y += 1; // Move to the next row
                lines.push("");
            }
        }
        let full = ""
        //lines.forEach((element) => console.log("%c" + element, style));
       lines.forEach((element) => full+=(element+"\n"));
       console.log("%c"+full, style);
       console.log("frame:" + frame);
        lines = [""];
        frameend = Date.now();
        console.log("frame took:" + (frameend-framestart) + "ms")
        frame += 1;
        console.warn = () => {};
        if(recording){
            captureScreenshot();
            setTimeout(()=>{
            framestart = Date.now();
            newFrame();
            console.warn = () => {};
            }, 33);
        }else{
        setTimeout(()=>{
            framestart = Date.now();
            newFrame();
        }, 33-(frameend-framestart))
    }
}
function getTextWidth(text, font) {
    // re-use canvas object for better performance
    ctx.font = font;
    const metrics = ctx.measureText(text);
    return metrics.width/1.5;
}

function start() {
    //resolution for edge detection
    width = Number(document.getElementById("pix").value);
    height = width * (3 / 4);
    space = document.getElementById("space").value;
    char = document.getElementById("char").value;
    size = Number(document.getElementById("size").value);
    style = "font-size: " + size + "px; font-family: Arial; line-height: 1;";
    spaceWidth = getTextWidth(space, style);
    charWidth = getTextWidth(char, style);
    console.log("loading images")
    lines = [""];
    for (let i = 0; i < 6561; i++) {
        //load image
        images.push(new Image()); // Create new img element
        images[i].src = "badApple/bad_apple_" + (i+1).toString().padStart(3, 0) + ".png";
    }
    console.log("starting")
    frame = 0;
    framestart = Date.now();
    newFrame();
}