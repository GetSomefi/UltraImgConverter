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
                indicator.innerText = "✔️ File Uploaded"
                
                const tempView = document.getElementById("preview")

                tempView.replaceChildren();

                const img = document.createElement("img");
                img.src = `./static${randLocation}/uploads/original_temp.jpg?t=${Date.now()}`;
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

                                const sizeEl = document.createElement("span");
                                sizeEl.classList = "filesize-element";
                                sizeEl.innerText = ogFileSize.toFixed(2)+"kt";
                                contOrig.appendChild(sizeEl);

                                const convertedFiles = json[1];

                                convertedFiles.forEach(convFile => {
                                    const convertedImgContainer = document.createElement("div");

                                    const convFileSize = (convFile.size/1024); //kt
                                    
                                    if(convFile.format == "heif")
                                        convFile.format = "avif";

                                    const reduction = -((convFileSize - ogFileSize) / ogFileSize) * 100;
                                    const convertedImgInfo = document.createElement("div");
                                    //convertedImgInfo.innerHTML += "File "+convFile.format+" filesize: "+convFileSize.toFixed(2)+"kt";
                                    const reductionBar = document.createElement("div");
                                    reductionBar.classList = "reduction-bar";
                                    const reductionAmount = document.createElement("p");
                                    reductionAmount.classList = "reduction-amount-bar";
                                    reductionAmount.innerText = `Reduction: ${reduction.toFixed(2)}%`;
                                    reductionAmount.style.width = `${reduction.toFixed(2)}%`;
                                    reductionBar.appendChild(reductionAmount);
                                    convertedImgInfo.appendChild(reductionBar);
                                

                                    const img2 = document.createElement("img")
                                    img2.src = `./static${randLocation}/uploads/output.${convFile.format}?t=${Date.now()}`;
                                    img2.classList = `img-preview ${convFile.format}`;
                                    
                                    const convertedImg = document.createElement("a");
                                    convertedImg.classList = `previewImageContainer conv-${convFile.format}`;
                                    convertedImg.href = `./static${randLocation}/uploads/output.${convFile.format}?t=${Date.now()}`;
                                    //convertedImg.download = "webp_"+randLocation+".webp";
                                    convertedImg.download = `${convFile.format}_${randLocation}.${convFile.format}`;
                                    convertedImg.appendChild(img2);

                                    const convertedSizeEl = sizeEl.cloneNode(true);
                                    convertedSizeEl.innerText = (convFile.size / 1024).toFixed(2) + "kt";
                                    convertedImg.appendChild(convertedSizeEl);
                    
                                    convertedImgContainer.append(convertedImg);
                                    convertedImgContainer.append(convertedImgInfo);

                                    tempView.append(convertedImgContainer); //.webp
                                });
                            });
                        }
                    });
                });
            }
        })
        console.log(m)
    //,1000);
}
//document.getElementById("convert").addEventListener("click", ()=>uploadFile)
document.getElementById("convertthis").addEventListener("change", uploadFile)