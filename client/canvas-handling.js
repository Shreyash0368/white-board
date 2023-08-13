const canvas = document.getElementById("drawing-page");
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const toolDropdown = document.querySelector(".tool-box-dropdown");
const toolBox = document.querySelector(".tool-box");
let toolBoxFlag = false;

const pencil = document.querySelector(".fa-pencil");
const pencilEditPanel = document.querySelector(".pencil-edit");
const pencilColorInput = document.getElementById("pencil-color");
const pencilWidthInput = document.getElementById("pencil-width");

const eraser = document.querySelector(".fa-eraser");
const eraserEditPanel = document.querySelector(".eraser-edit");
const eraserWidthInput = document.getElementById("eraser-width");

let isDrawing = false;
let pencilFlag = false;
let eraserFlag = false;

// dropdown for toolbox display
toolDropdown.onclick = (e) => {
    toolBoxFlag = !toolBoxFlag
    if (toolBoxFlag) {
        toolBox.style.display = 'flex';
    }
    else {
        toolBox.style.display = 'none';
    }
}

// chnage canvas size with window
window.onresize = handleResize;

function handleResize() {
    // Store the current canvas content
    const offscreenCanvas = document.createElement("canvas");
    const offscreenCtx = offscreenCanvas.getContext("2d");

    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
    offscreenCtx.drawImage(canvas, 0, 0);

    // Resize the canvas to match the new window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Redraw the preserved contents back onto the resized canvas
    ctx.drawImage(offscreenCanvas, 0, 0, offscreenCanvas.width, offscreenCanvas.height, 0, 0, canvas.width, canvas.height);
}

// pencil draw event listeners
pencil.onclick = (e) => {
    eraserFlag = false;
    eraser.classList.remove("in-use");
    eraserEditPanel.style.display = 'none';

    changePencilColor('#000000');
    changePencilWidth(2);

    if (!pencilFlag) {
        canvas.addEventListener("mousedown", mouseDownHandler);
        canvas.addEventListener("mousemove", mouseMoveHandler);
        canvas.addEventListener("mouseup", stopDrawing);
        pencil.classList.add("in-use");
        pencilEditPanel.style.display = 'flex';

    }
    else {
        canvas.removeEventListener("mousedown", mouseDownHandler);
        canvas.removeEventListener("mousemove", mouseMoveHandler);
        canvas.removeEventListener("mouseup", mouseUpHandler);
        pencil.classList.remove("in-use");
        pencilEditPanel.style.display = 'none';
    }

    pencilFlag = !pencilFlag;
}

function mouseDownHandler(e) {
    const rect = canvas.getBoundingClientRect();
    let lastX = (e.clientX - rect.left) * (canvas.width / rect.width);
    let lastY = (e.clientY - rect.top) * (canvas.height / rect.height);
    isDrawing = true; 
    let startCoord = [lastX, lastY, isDrawing]; 
    socket.emit('startDrawing', startCoord); 
}

function mouseMoveHandler(e) {
    if (!isDrawing) return;
    // Adjust mouse event coordinates to the current canvas size
    const rect = canvas.getBoundingClientRect();
    let currentX = (e.clientX - rect.left) * (canvas.width / rect.width);
    let currentY = (e.clientY - rect.top) * (canvas.height / rect.height);
    let color = pencilColorInput.value;   
    let width;     
    if (pencilFlag) width = Math.round(pencilWidthInput.valueAsNumber / 10);    
    if (eraserFlag) width = Math.round(eraserWidthInput.valueAsNumber / 4);
    socket.emit('draw', [currentX, currentY, color, width, isDrawing]);
    // draw([currentX, currentY, color, width]);

}

function mouseUpHandler() {
    socket.emit('stopDrawing');
}

function startDrawing([x, y, isDrawing]) {
    if (!isDrawing) return;
    // Adjust mouse event coordinates to the current canvas size
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    saveOldCnavas();
}

function draw([x, y, color, width, isDrawing]) {
    if (!isDrawing) return;

    ctx.strokeStyle = color;
    ctx.lineWidth = Number(width);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    ctx.lineTo(x, y);
    ctx.stroke();    
}



function stopDrawing() {
    isDrawing = false;
}

// changing pencil color and width
pencilColorInput.onchange = colorChangeHandler;
pencilWidthInput.onchange = pencilWidthChangeHandler;

function colorChangeHandler(e) {    
    changePencilColor(pencilColorInput.value);
}

function changePencilColor(colorVal) {
    pencilColorInput.value = colorVal;
}

function pencilWidthChangeHandler(e) {    
    changePencilWidth(Math.round(pencilWidthInput.valueAsNumber));
}

function changePencilWidth(widthVal) {
    pencilWidthInput.valueAsNumber = (widthVal);
}


// Eraser Implementation
eraser.onclick = (e) => {
    pencilFlag = false;
    pencil.classList.remove("in-use");
    pencilEditPanel.style.display = 'none';


    changePencilColor('#FFFFFF');
    changeEraserWidth(10);

    if (!eraserFlag) {
        canvas.addEventListener("mousedown", mouseDownHandler);
        canvas.addEventListener("mousemove", mouseMoveHandler);
        canvas.addEventListener("mouseup", stopDrawing);
        eraser.classList.add("in-use");
        eraserEditPanel.style.display = 'flex';

    }
    else {
        canvas.removeEventListener("mousedown", mouseDownHandler);
        canvas.removeEventListener("mousemove", mouseMoveHandler);
        canvas.removeEventListener("mouseup", stopDrawing);
        eraser.classList.remove("in-use");
        eraserEditPanel.style.display = 'none';
    }

    eraserFlag = !eraserFlag;
}

eraserWidthInput.onchange = (e) => {       
    changeEraserWidth(Math.round(eraserWidthInput.valueAsNumber));
}

function changeEraserWidth(widthVal) {
    eraserWidthInput.valueAsNumber = widthVal;
}

// socket handling
socket.on('startDrawing', (data) => {
    startDrawing(data);
})

socket.on('draw', (data) => {
    draw(data);
})

socket.on('stopDrawing', () => {
    stopDrawing();
})

