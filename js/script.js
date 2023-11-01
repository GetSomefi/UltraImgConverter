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
                tempView.append(img) //original_temp.jpg

                /*stage 2. convert*/
                const responseUpload = res.json().then((json)=> {
                    console.log("jiisoni:",json)

                    const ogFileSize = json[0].file.size / 1000
                    indicator.innerHTML += "<br>Converting (Filesize: "+ogFileSize.toFixed(2)+"kt) (this may take a while) <span class='load'></span>"
                    
                    /*convert part*/
                    fetch('/convertFile', {
                        method: 'POST',
                        body: data
                    }).then( (res)=>{
                        indicator.innerText = "File conversion failed ❌"
                        if(res.ok){
                            console.log(res.body);
                            indicator.innerText = "File conversion (Filesize: "+ogFileSize.toFixed(2)+"kt) complete 👍"

                            const img2 = document.createElement("img")
                            img2.src = "./static"+randLocation+"/uploads/output.webp"
                            img2.classList = "img-preview webp";
                            tempView.append(img2) //original_temp.jpg

                            const img3 = document.createElement("img")
                            img3.src = "./static"+randLocation+"/uploads/output.avif"
                            img3.classList = "img-preview avif";
                            tempView.append(img3) //original_temp.avif
                        }
                    });
                });
            }
        })
        console.log(m)
    //,1000);
}
document.getElementById("convert").addEventListener("click", uploadFile)