{
    'use strict';
    console.log("Hello World!")

    let video = document.createElement("video");
    let canvasElement = document.getElementById("canvas");
    let canvas = canvasElement.getContext("2d");
    let loadingMessage = document.getElementById("loadingMessage");

    let outputContainer = document.getElementById("output");
    let outputMessage = document.getElementById("outputMessage");
    let outputData = document.getElementById("outputData");

    outputData.addEventListener('click',(e) =>{
        console.log(e.currentTarget.innerText);
        console.log("click");
        window.open(e.currentTarget.innerText,'_blank');
    });

    function drawLine(begin, end, color) {
        canvas.beginPath();
        canvas.moveTo(begin.x, begin.y);
        canvas.lineTo(end.x, end.y);
        canvas.lineWidth = 5;
        canvas.strokeStyle = color;
        canvas.stroke();
    }

    // // Use facingMode: environment to attemt to get the front camera on phones
    navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }})
    .then(function(stream) {
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
        video.play();
        
        requestAnimationFrame(tick);
    })
    .catch(function(err) {
        console.log(err.name + ": " + err.message); 
    }); 

    function tick() {
        loadingMessage.innerText = "⌛ Loading video..."
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
            loadingMessage.hidden = true;
            canvasElement.hidden = false;
            outputContainer.hidden = false;

            canvasElement.height = video.videoHeight;
            canvasElement.width = video.videoWidth;

            canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

            var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
            var code = jsQR(imageData.data, imageData.width, imageData.height,
                 {
                    inversionAttempts: "dontInvert",
                }
            );

            if (code) {
                drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");

                outputMessage.hidden = true;
                outputData.parentElement.hidden = false;
                outputData.innerText = code.data;    
                            
            } else {
                outputMessage.hidden = false;
                outputData.parentElement.hidden = true;
            }
        }
        requestAnimationFrame(tick);
    }
}