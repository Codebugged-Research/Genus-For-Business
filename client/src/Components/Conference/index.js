import React, {useState, useEffect, useRef} from 'react';
import Peer from 'simple-peer';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    Holder,
    Utils,
    VideoContainer,
    ContainerVideo,
    VideoHolder,
    ActionHolder,
    Actions,
    OwnVideo
} from './ConferenceComponent';
import { MdTv, MdCallEnd } from 'react-icons/md';
import { BiCamera, BiCameraOff, BiMicrophoneOff, BiMicrophone, BiErrorCircle } from 'react-icons/bi';
import { useToast } from '@chakra-ui/react';

const io = require('socket.io-client');
const wrtc = require('wrtc');

const useStyles = makeStyles((theme) => ({
    iconHolder: {
        display: 'grid',
        placeItems: 'center',
        width: '100%',
        height: '100%'
    },
    iconStyle:{
        color: 'white',
        width: '100%',
        height: '4vh',
        cursor: 'pointer'
    },
    heading: {
        fontFamily: 'Nunito',
        fontWeight: '600',
        fontSize: '25px',
        color: 'white'
    },
    content:{
        fontFamily: 'Nunito',
        fontSize: '20px'
    },
    linkId:{
        fontFamily: 'Nunito',
        fontWeight: '600',
        fontSize: '20px'
    }
}));

function Conference({match, history}){

    const classes = useStyles();
    const userName = sessionStorage.getItem('userName');
    const toast = useToast();
    const toast_id = "toast-id";
 
    var screenShareIndicator = false;
    var sharedStream;

    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const ownVideo = useRef();
    const peersRef = useRef([]);
    const meetID = match.params.meetId;

    const toggleVideoTracks = () => {
        if(ownVideo.current.srcObject.getVideoTracks()[0].enabled){
            ownVideo.current.srcObject.getVideoTracks()[0].enabled = false;

            document.getElementById("videoOn").style.display = "none";
            document.getElementById("videoOff").style.display = "flex";
        } else {
            ownVideo.current.srcObject.getVideoTracks()[0].enabled = true;

            document.getElementById("videoOff").style.display = "none";
            document.getElementById("videoOn").style.display = "flex";
        }
    }

    const toggleAudioTracks = () => {
        if(ownVideo.current.srcObject.getAudioTracks()[0].enabled){
            ownVideo.current.srcObject.getAudioTracks()[0].enabled = false;

            document.getElementById("audioOn").style.display = "none";
            document.getElementById("audioOff").style.display = "flex";
        } else {
            ownVideo.current.srcObject.getAudioTracks()[0].enabled = true;

            document.getElementById("audioOff").style.display = "none";
            document.getElementById("audioOn").style.display = "flex";
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
                console.log(err);
                if(!toast.isActive(toast_id)){
                    toast({
                        title: "Screen Share Error",
                        description: "An error ocurred while trying to share your screen!",
                        duration: 3000,
                        position: "top-right"
                    })
                }
            })
        }
    }

    const handleConnectLink = () => {
        if(!toast.isActive(toast_id)){
            toast({
                title: "Share Meeting Link",
                description: `http://localhost:3000/join/${match.params.meetId}`,
                duration: 3000,
                position: "top-right"
            })
        }
    }

    const handleClick = (type) => {
        switch (type) {
            case "cam":
                toggleVideoTracks();
                break;
            case "mic":
                toggleAudioTracks();
                break;
            default:
                break;
        }
    }

    const createPeer = (userToSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            wrtc: wrtc,
            stream
        })

        peer.on("signal", signal => {
            socketRef.current.emit("sendingSignal", userToSignal, callerID, signal)
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
            socketRef.current.emit("returningSignal", signal, callerID)
        })

        peer.signal(incomingSignal);
        return peer;
    }

    const PeerVideo = (props) => {
        const ref = useRef();

        console.log("Peer", props.peer);
        useEffect(() => {
            props.peer[0].on("stream", stream => {
                ref.current.srcObject = stream;
                console.log("Stream", stream);
            })
        }, []);

        return (
            <VideoHolder>
                <OwnVideo id={`${props.peer[1]}`} playsInline autoPlay ref={ref} />
            </VideoHolder>
        )
    }

    useEffect(() => {
        socketRef.current = io("http://localhost:3001/");

        const generateStream = () => {
            navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: { ideal: 300},
                    height: {ideal: 300}
                }
            }).then((stream) => {
                ownVideo.current.srcObject = stream;
                socketRef.current.emit("getAllUsers", meetID);
                socketRef.current.on("allUsers", users => {
                    const peers = [];
                    users.forEach(userID => {
                        const peer = createPeer(userID[0], socketRef.current.id, stream);
                        peersRef.current.push({
                            peerID: userID[0],
                            peer
                        })
                        peers.push([peer, userID[0]]);
                    })
                    setPeers(peers);
                })
    
                socketRef.current.on("userJoined", payload => {
                    const peer = addPeer(payload.signal, payload.callerID, stream);
                    peersRef.current.push({
                        peerID: payload.callerID,
                        peer
                    })
                    
                    peers.push([peer, payload.callerID]);
                    setPeers(peers);
                })
    
                socketRef.current.on("receivingReturnSignal", payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                }) 
            })
            .catch((err) => {
                if(!toast.isActive(toast_id)){
                    toast({
                        title: "Stream Fetch Error",
                        description: "An error ocurred while trying to fetch your stream",
                        duration: 3000,
                        position: "top-right"
                    })
                }
            })
        }

        if(userName){
            const data = {
                name: userName,
                meetId: match.params.meetId
            }
            socketRef.current.emit('joinMeet', data, generateStream);
        } else {
            history.push(`/join/${match.params.meetId}`);
        }
    }, [match.params.meetId, userName, history]);

    return (
        <Container>
            <Holder>
                <ContainerVideo>
                    <VideoContainer id="videoContainer">
                        <VideoHolder>
                            <OwnVideo id="ownVideo" muted ref={ownVideo} autoPlay playsInline />
                        </VideoHolder>
                        {peers.map((peer, index) => {
                            return <PeerVideo key={index} peer={peer} />
                        })}
                    </VideoContainer>
                </ContainerVideo>
                <ActionHolder>
                    <Actions>
                        <div className={classes.iconHolder}>
                            <BiErrorCircle className={classes.iconStyle} onClick = {handleConnectLink} />
                        </div>
                        <div className={classes.iconHolder}>
                            <BiCamera 
                                className={classes.iconStyle} 
                                id="videoOn"
                                onClick={() => handleClick("cam")}
                            />
                            <BiCameraOff 
                                className={classes.iconStyle} 
                                id="videoOff"
                                style={{display: "none"}}
                                onClick={() => handleClick("cam")}
                            />
                        </div>
                        <div className={classes.iconHolder}>
                            <BiMicrophone 
                                className={classes.iconStyle} 
                                id="audioOn"
                                onClick={() => handleClick("mic")}
                            />
                            <BiMicrophoneOff 
                                className={classes.iconStyle} 
                                style={{display: "none"}} 
                                id="audioOff"
                                onClick={() => handleClick("mic")}
                            />
                        </div>
                        <div className={classes.iconHolder}>
                            <MdTv className={classes.iconStyle} onClick={handleShareScreen} id="shareBtn" />
                        </div>
                        <div className={classes.iconHolder}>
                            <MdCallEnd className={classes.iconStyle} />
                        </div>
                    </Actions>
                </ActionHolder>
            </Holder>
            <Utils></Utils>
        </Container>
    )
}

export default Conference;