{
const dropZone = document.getElementById('convertthislabel');
const fileInput = document.getElementById('convertthis');
const fileText = document.getElementById('file-path');

// Estetään selaimen oletustoiminta (ettei tiedosto avaudu selaimeen)
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Lisätään visuaalinen efekti, kun tiedosto on laatikon päällä
['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
});

// Käsitellään pudotettu tiedosto
dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;

    // Siirretään tiedostot piilotetulle input-elementille
    fileInput.files = files;

    // Päivitetään teksti näyttämään valitun tiedoston nimi
    if (files.length > 0) {
        fileText.textContent = `File: ${files[0].name}`;
    }
    uploadFile();
}, false);

// Päivitetään teksti myös silloin, jos tiedosto valitaan perinteisesti klikkaamalla
// fileInput.addEventListener('change', () => {
//     if (fileInput.files.length > 0) {
//         fileText.textContent = `File: ${fileInput.files[0].name}`;
//     }
//     uploadFile();
// });
}