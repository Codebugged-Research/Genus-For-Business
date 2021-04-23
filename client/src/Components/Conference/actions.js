import Peer from 'simple-peer';

const wrtc = require('wrtc');

var globalStream;
var socketOwn;
var meetID;
var videoHandler;

var screenShareIndicator = false;
var sharedStream;

var myPeers = [];

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

// const handleShareScreen = () => { 
//     const shareBtn = document.getElementById("shareBtn");

//     if(!screenShareIndicator){
//         navigator.mediaDevices.getDisplayMedia({cursor: true})
//         .then((sharedScreen) => {

//             screenShareIndicator = true;
//             sharedStream = sharedScreen;
//             shareBtn.disabled = true;

//             if(peers.length !== 0){
//                 peers.forEach((peerElem) => {
//                     peerElem[0].replaceTrack(ownVideo.current.srcObject.getVideoTracks()[0], sharedStream.getVideoTracks()[0], ownVideo.current.srcObject);
//                 })
//             }

//             sharedScreen.getTracks()[0].onended = () => {
//                 screenShareIndicator = false;
//                 shareBtn.disabled = false;

//                 if(peers.length !== 0){
//                     peers.forEach((peerElem) => {
//                         peerElem[0].replaceTrack(sharedStream.getVideoTracks()[0], ownVideo.current.srcObject.getVideoTracks()[0], ownVideo.current.srcObject);
//                     })
//                 }
//             }
//         })
//         .catch((err) => {
//             errorToast("shareError");
//         })
//     }
// }

const createPeer = (userToSignal, callerID, stream, createPeerVideo) => {
    const peer = new Peer({
        initiator: true,
        trickle: false,
        wrtc: wrtc,
        stream: stream,
        config:{
            iceServers:[
                { urls: 'stun:stun.l.google.com:19302' }, 
                { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
            ]
        }
    })

    peer.on("signal", data => {
        socketOwn.emit("callUserGetStream", {toCall: userToSignal, sender: callerID, dataSentAlong: data})
    })

    peer.on("stream", stream => {
        videoHandler(stream, peer.id);
    })

    socketOwn.on("accepted", (data) => {
        peer.signal(data.forYou);
    })

    return peer;
}

const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
        initiator: false,
        trickle: false,
        wrtc: wrtc,
        stream
    })

    peer.on("signal", signal => {
        socketOwn.emit("returningSignal", signal, callerID)
    })

    peer.signal(incomingSignal);
    return peer;
}

export const actions = (name, meetId, socket, errorToast, createPeerVideo) => {
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
        videoHandler = createPeerVideo;

        const ownVideo = document.getElementById("ownVideo");
        createOwnVideo(ownVideo);
        // handleShareScreen();

        toggleVideoTracks();
        toggleAudioTracks();

        socket.emit("getAllUsers", meetId);
        socket.on("allUsers", users => {
            const peers = [];
            users.forEach(userID => {
                const peer = createPeer(userID[0], socket.id, stream, createPeerVideo);
                peers.push([peer, userID[0]]);
            })
            myPeers = peers;
        })

        socket.on("userJoined", payload => {
            const peer = addPeer(payload.signal, payload.callerID, stream, createPeerVideo);

        })
    })
    .catch((err) => {
        errorToast("streamError");
    })
}