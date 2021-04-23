import Peer from 'simple-peer';

const wrtc = require('wrtc');

var globalStream;
var socketOwn;
var meetID;

const createOwnVideo = (container) => {
    container.srcObject = globalStream;
    container.muted = true;

    container.addEventListener("loadedmetadata", () => {
        container.play();
    })
}

const toggleVideoTracks = () => {

    const stopVideo = document.getElementById("stopVideo");

    if(stopVideo){
        stopVideo.addEventListener("click", () => {
            if(globalStream.getVideoTracks()[0].enabled){
                globalStream.getVideoTracks()[0].enabled = false;
        
                document.getElementById("videoOn").style.display = "none";
                document.getElementById("videoOff").style.display = "flex";
            } else {
                globalStream.getVideoTracks()[0].enabled = true;
        
                document.getElementById("videoOff").style.display = "none";
                document.getElementById("videoOn").style.display = "flex";
            }
        })
    }
}

const toggleAudioTracks = () => {

    const stopAudio = document.getElementById("stopAudio");
    if(stopAudio){
        stopAudio.addEventListener("click", () => {
            if(globalStream.getAudioTracks()[0].enabled){
                globalStream.getAudioTracks()[0].enabled = false;
    
                document.getElementById("audioOn").style.display = "none";
                document.getElementById("audioOff").style.display = "flex";
            } else {
                globalStream.getAudioTracks()[0].enabled = true;
    
                document.getElementById("audioOff").style.display = "none";
                document.getElementById("audioOn").style.display = "flex";
            }
        })
    }
}

const handleShareScreen = () => { 
    const shareBtn = document.getElementById("shareBtn");

    if(!screenShareIndicator){
        navigator.mediaDevices.getDisplayMedia({cursor: true})
        .then((sharedScreen) => {

            screenShareIndicator = true;
            sharedStream = sharedScreen;
            shareBtn.disabled = true;

            if(peers.length !== 0){
                peers.forEach((peerElem) => {
                    peerElem[0].replaceTrack(ownVideo.current.srcObject.getVideoTracks()[0], sharedStream.getVideoTracks()[0], ownVideo.current.srcObject);
                })
            }

            sharedScreen.getTracks()[0].onended = () => {
                screenShareIndicator = false;
                shareBtn.disabled = false;

                if(peers.length !== 0){
                    peers.forEach((peerElem) => {
                        peerElem[0].replaceTrack(sharedStream.getVideoTracks()[0], ownVideo.current.srcObject.getVideoTracks()[0], ownVideo.current.srcObject);
                    })
                }
            }
        })
        .catch((err) => {
            errorToast("shareError");
        })
    }
}

export const actions = (meetId, socket, errorToast) => {
    navigator.mediaDevices.getUserMedia({
        video: {
            width: 300,
            height: 300
        },
        audio: true
    })
    .then((stream) => {
        globalStream = stream;
        socketOwn = socket;
        meetID = meetId;

        const ownVideo = document.getElementById("ownVideo");
        createOwnVideo(ownVideo);
        shareScreenHandler();

        toggleVideoTracks();
        toggleAudioTracks();


    })
    .catch((err) => {
        console.log(err);
        errorToast("streamError");
    })
}