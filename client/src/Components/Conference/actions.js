import Peer from 'simple-peer';

const wrtc = require('wrtc');

var globalStream;
var socketOwn;
var meetID;
var videoHandler;
var yourName;

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

const handleShareScreen = (errorToast) => { 
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

const createPeer = (userToSignal, callerID, stream) => {
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

    peers.push([peer, peer._id, userToSignal]);
    if(screenShareIndicator){
        peer.replaceTrack(globalStream.getVideoTracks()[0], sharedStream.getVideoTracks()[0], globalStream);
    }

    peer.on("signal", data => {
        socketOwn.emit("callUserGetStream", {toCall: userToSignal, sender: callerID, dataSentAlong: data})
    })

    peer.on("stream", stream => {
        videoHandler(stream, peer._id);
    })

    peer.on('error', (err) => {
        myPeers.forEach((peers) => {
            if(peers[1] === peer._id){
                const vC = document.getElementById("videoContainer");
                if(document.getElementById(peers[1])){
                    vC.removeChild(document.getElementById(peers[1]));
                }
            }
        })
        peer.destroy(err);

        var l = myPeers.filter(p => p[1] !== peer._id);
        myPeers = l;
    })

    socketOwn.on("accepted", (data) => {
        peer.signal(data.forYou);
    })
}

const acceptOthersCall = () => {
    socketOwn.on("handshake", (payload) => {

        const peer = new Peer({
            initiator: false,
            trickle: false,
            wrtc: wrtc,
            stream: globalStream
        })

        myPeers.push([peer, peer._id, payload.sender]);
        if(screenShareIndicator){
            peer.replaceTrack(globalStream.getVideoTracks()[0], sharedStream.getVideoTracks()[0], globalStream);
        }

        peer.on("signal", data => {
            socketOwn.emit("handshakeAccepted", {acceptor: data, for: payload.sender})
        })

        peer.on("stream", (stream) => {
            videoHandler(stream, peer._id);
        })

        peer.on('error', (err) => {
            myPeers.forEach((peers) => {
                if(peers[1] === peer._id){
                    const vCo = document.getElementById("videoContainer");
                    if(document.getElementById(peers[1])){
                        vCo.removeChild(document.getElementById(peers[1]));
                    }
                }
            })
            peer.destroy(err);

            var le = myPeers.filter(p => p[1] !== peer._id);
            myPeers = le;
        })

        peer.signal(payload.mySignal);
    })
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
        yourName = name;
        globalStream = stream;
        socketOwn = socket;
        meetID = meetId;
        videoHandler = createPeerVideo;

        const ownVideo = document.getElementById("ownVideo");
        createOwnVideo(ownVideo);
        handleShareScreen(errorToast);

        toggleVideoTracks();
        toggleAudioTracks();

        acceptOthersCall();

        socket.emit("getAllUsers", meetId);
        socket.on("allUsers", users => {
            const peers = [];
            users.forEach(userID => {
                createPeer(userID[0], socket.id, stream, createPeerVideo);
            })
        })
    })
    .catch((err) => {
        errorToast("streamError");
    })
}