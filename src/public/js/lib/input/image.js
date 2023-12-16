function previewImage(input, preview) {
    input.addEventListener('change', (ev) => {
        let image = ev.target.files[0];
        let blob = new Blob([image], {type: image.type});
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            preview.src = reader.result;
            document.getElementById("preview").src = reader.result;
        }
    });
}

export default previewImage;