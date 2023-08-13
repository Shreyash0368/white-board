const noteHeader = document.querySelector(".header");
let allNotes = document.querySelectorAll(".sticky-note");
const contentArea = document.querySelector(".content-area");
const noteButton = document.getElementById("note");
let noteFlag = false;
let minimizeFlag = false;

noteButton.onclick = (e) => {
    noteFlag = !noteFlag;
    allNotes = document.querySelectorAll(".sticky-note");

    if (noteFlag) {
        if (allNotes.length === 0) {
            let noteDiv = document.createElement('div');
            noteDiv = noteCreator(noteDiv);
            document.body.appendChild(noteDiv);
            noteDiv.style.display = 'block';
        }

        allNotes.forEach((note) => {
            note.style.display = 'block';
        })
        noteButton.classList.add("in-use");
    }
    else {
        allNotes.forEach((note) => {
            note.style.display = 'none';
        })
        noteButton.classList.remove("in-use");
    }
}

function noteCreator(noteDiv) {
    noteDiv.setAttribute('class', 'sticky-note');
    noteDiv.innerHTML = `
                <div class="header"></div>
                <div class="button" id="minimize"></div>
                <div class="button" id="remove"></div>
                <div class="content-area" contenteditable="true" spellcheck="false"></div>
            `;

    const noteHeader = noteDiv.querySelector(".header");
    const contentArea = noteDiv.querySelector(".content-area");
    const remove = noteDiv.querySelector("#remove");
    const minimize = noteDiv.querySelector("#minimize");

    minimizeNote(minimize, contentArea);
    removeNote(remove);
    dragNDrop(noteHeader, noteDiv);

    return noteDiv;
}

function minimizeNote(minimize, contentArea) {
    minimize.onclick = (e) => {
        minimizeFlag = !minimizeFlag;
        if (minimizeFlag) {
            contentArea.style.display = 'none';
        }
        else {
            contentArea.style.display = 'block';
        }
    }
}

function removeNote(remove) {
    remove.onclick = (e) => {
        const parent = remove.parentNode;
        parent.remove();
        allNotes = document.querySelectorAll(".sticky-note");
        if (allNotes.length === 0) {
            noteButton.click();
        }
    }
}

function dragNDrop(noteHeader, note) {
    noteHeader.onmousedown = function (event) {

        let shiftX = event.clientX - note.getBoundingClientRect().left;
        let shiftY = event.clientY - note.getBoundingClientRect().top;

        note.style.position = 'absolute';
        note.style.zIndex = 1000;
        document.body.append(note);

        moveAt(event.pageX, event.pageY);

        // moves the noteHeader at (pageX, pageY) coordinates
        // taking initial shifts into account
        function moveAt(pageX, pageY) {
            note.style.left = pageX - shiftX + 'px';
            note.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        // move the noteHeader on mousemove
        document.addEventListener('mousemove', onMouseMove);

        // drop the noteHeader, remove unneeded handlers
        noteHeader.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            note.onmouseup = null;
        };
    };

    noteHeader.ondragstart = function () {
        return false;
    };
}

