async function moveData(url = "", data = {}) {
    console.log("Sending: ",data);
    // Default options are marked with *
    const response = await fetch(url, {
        method: data.method, // *GET, POST, PUT, DELETE, etc.
        mode: "same-origin", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

document.getElementById("write").addEventListener("click", () =>
    moveData("./fileSystem", { method:"PUT", msg: document.getElementById("writethis").value }).then((data) => {
        console.log("Received: ", data); // JSON data parsed by `data.json()` call
    })
)

const uploadFile = () => {
    const randLocation = document.getElementById("rand-location").innerText
    console.log("Uploading file...");
    const input = document.querySelector('input#convertthis')

    const data = new FormData()
    data.set('upload-file', input.files[0])
    //data.append('user', 'testBoy123')
    
    console.log(data)

    let indicator = document.getElementById("file-upload-indicator");
    indicator.innerText = "➡️☁️"

    //setTimeout( () => //small delay
        let m = fetch('/uploadFile', {
        method: 'PUT',
        body: data
        })
        .then( (res)=>{
            console.log("File upload response: ", res);
            indicator.innerText = "Upload failed ❌"
            if(res.ok){
                /*stage 1. upload complete*/
                indicator.innerText = "Done ✔️"
                
                const tempView = document.getElementById("preview")

                const img = document.createElement("img")
                img.src = "./static"+randLocation+"/uploads/original_temp.jpg"
                img.classList = "img-preview";

                const contOrig = document.createElement("div");
                contOrig.classList = "previewImageContainer conv-original";
                contOrig.appendChild(img);

                tempView.append(contOrig) //original_temp.jpg

                /*stage 2. convert*/
                const responseUpload = res.json().then((json)=> {
                    console.log("Upload:",json)

                    const ogFileSize = json[0].file.size / 1024 //kt
                    indicator.innerHTML += "<br>Converting (Filesize: "+ogFileSize.toFixed(2)+"kt) (this may take a while) <span class='load'></span>"
                    
                    /*convert part*/
                    fetch('/convertFile', {
                        method: 'POST',
                        body: data
                    }).then( (res)=>{
                        indicator.innerText = "File conversion failed ❌"
                        if(res.ok){
                            const responseConvertion = res.json().then((json)=> {
                                console.log("Convert:",json)
                                indicator.innerHTML = "File conversion (Filesize: "+ogFileSize.toFixed(2)+"kt) complete 👍<br>";

                                const convertedFiles = json[1];

                                convertedFiles.forEach(convFile => {
                                    const convFileSize = (convFile.size/1024); //kt
                                    const reduction = -((convFileSize - ogFileSize) / ogFileSize) * 100;
                                    indicator.innerHTML += "File "+convFile.format+" filesize: "+convFileSize.toFixed(2)+"kt reduction: <b>" + reduction.toFixed(2) + "%</b> <br>";
                                });

                                const img2 = document.createElement("img")
                                img2.src = "./static"+randLocation+"/uploads/output.webp"
                                img2.classList = "img-preview webp";
                                
                                const contWebp = document.createElement("a");
                                contWebp.classList = "previewImageContainer conv-webp";
                                contWebp.href = "./static"+randLocation+"/uploads/output.webp";
                                contWebp.download = "webp_"+randLocation+".webp";
                                contWebp.appendChild(img2);
                
                                tempView.append(contWebp); //.webp

                                const img3 = document.createElement("img")
                                img3.src = "./static"+randLocation+"/uploads/output.avif"
                                img3.classList = "img-preview avif";

                                const contAvif = document.createElement("a");
                                contAvif.classList = "previewImageContainer conv-avif";
                                contAvif.href = "./static"+randLocation+"/uploads/output.avif";
                                contAvif.download = "avif_"+randLocation+".avif";
                                contAvif.appendChild(img3);
                
                                tempView.append(contAvif) //.avif
                            });
                        }
                    });
                });
            }
        })
        console.log(m)
    //,1000);
}
document.getElementById("convert").addEventListener("click", uploadFile)
document.getElementById("convertthis").addEventListener("change", uploadFile)