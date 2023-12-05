window.addEventListener('load' , ev => {
    let params = new URLSearchParams(location.search);
    document.getElementById('id').value = params.get('id');
    document.getElementById('imagen').addEventListener('change' , ev => {
        let imag = ev.target.files[0];
         let blob = new Blob([imag], {type: imag.type});
        document.getElementsByClassName('preview')[0].src = URL.createObjectURL(blob);
    });
});