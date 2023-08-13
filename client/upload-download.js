const download = document.getElementById("download");
const upload = document.getElementById("upload");
const fileInput = document.getElementById("note-image");


download.onclick = (e) => {
    const url = canvas.toDataURL();
    const a = document.createElement('a');
    a.href = url;
    a.download = 'image.png';
    a.click();
}

upload.onclick = (e) => {
    fileInput.click();
}

fileInput.onchange = (e) => {
    const file = fileInput.files[0];

    if (file) {
        const fr = new FileReader();
        fr.readAsDataURL(file)

        fr.onload = (e) => {
            const url = e.target.result;
            const img = document.createElement('img');
            img.style.width = '100%';
            img.style.height = '50%';
            img.style.objectFit = 'fill';
            img.src = url;

            let noteDiv = document.createElement('div');
            noteDiv = noteCreator(noteDiv);
            const contentArea = noteDiv.querySelector('.content-area');
            contentArea.appendChild(img);
            document.body.appendChild(noteDiv);
            noteDiv.style.display = 'block';
        }
    }
}


