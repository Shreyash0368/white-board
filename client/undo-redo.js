const undoBtn = document.getElementById("undo");
const redobtn = document.getElementById("redo");

let undoStackGolbal = [];
let redoStackGlobal = [];

undoBtn.onclick = socket.emit.bind(socket, 'undo');
redobtn.onclick = socket.emit.bind(socket, 'redo');

function saveOldCnavas() {
    undoStackGolbal.push(canvas.toDataURL());
    redoStackGlobal = [];
    socket.on('stackUpdate', [undoStackGolbal, redoStackGlobal]);
    // updateGlobal([undoStackGolbal, redoStackGlobal]);
}

function updateGlobal([undoStack, redoStack]) {
    undoStackGolbal = undoStack;
    redoStackGlobal = redoStack;
}

function undoHandler(data) {
    undo();
}

function undo() {
    if (undoStackGolbal.length < 1) return;

    redoStackGlobal.push(canvas.toDataURL()); // pushing the current state into redo stack before changing to older one
    let oldState = new Image();
    oldState.src = undoStackGolbal.pop();
    oldState.onload = (e) => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(oldState, 0, 0)
    }
    // redoStack.push(oldCanvasURL);
}

function redo() {
    if (redoStackGlobal.length < 1) return;

    undoStackGolbal.push(canvas.toDataURL());
    let newState = new Image();
    newState.src = redoStackGlobal.pop();
    newState.onload = (e) => {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(newState, 0, 0);
    }

}

// update stack using socket
socket.on('stackUpdate', (data) => {
    updateGlobal(data);
})

socket.on('undo', () => {
    undo();
})

socket.on('redo', () => {
    redo();
})