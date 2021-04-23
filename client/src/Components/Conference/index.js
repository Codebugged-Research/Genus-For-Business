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
import { actions } from './actions';

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
 
    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const ownVideo = useRef();
    const peersRef = useRef([]);
    const meetID = match.params.meetId;

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

    const createPeerVideo = (stream, id) => {

        return (
            <VideoHolder id={id}>
                <OwnVideo playsInline autoPlay srcObject={stream} />
            </VideoHolder>
        )
    }

    const errorToast = (type) => {
        switch (type) {
            case "streamError":
                if(!toast.isActive(toast_id)){
                    toast({
                        title: "Stream Fetch Error",
                        description: "An error ocurred while trying to fetch your stream",
                        duration: 3000,
                        position: "top-right"
                    })
                }
                break;
            case "shareError":
                if(!toast.isActive(toast_id)){
                    toast({
                        title: "Screen Share Error",
                        description: "An error ocurred while trying to share your screen!",
                        duration: 3000,
                        position: "top-right"
                    })
                }
                break;
            default:
                break;
        }
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

                    setPeers(p => [...p, [peer, payload.callerID]]);
                })
    
                socketRef.current.on("receivingReturnSignal", payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id);
                    item.peer.signal(payload.signal);
                }) 
            })
            .catch((err) => {

            })
        }

        socketRef.current.on("intializeStream", () => {
            actions(userName, match.params.meetId, socketRef.current, errorToast, createPeerVideo);
        })

        if(userName){
            const data = {
                name: userName,
                meetId: match.params.meetId
            }
            socketRef.current.emit('joinMeet', data);
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
                            <OwnVideo id="ownVideo" />
                        </VideoHolder>
                        {createPeerVideo}
                    </VideoContainer>
                </ContainerVideo>
                <ActionHolder>
                    <Actions>
                        <div className={classes.iconHolder}>
                            <BiErrorCircle className={classes.iconStyle} onClick = {handleConnectLink} />
                        </div>
                        <div className={classes.iconHolder} id="stopVideo">
                            <BiCamera 
                                className={classes.iconStyle} 
                                id="videoOn"
                                
                            />
                            <BiCameraOff 
                                className={classes.iconStyle} 
                                id="videoOff"
                                style={{display: "none"}}
                                
                            />
                        </div>
                        <div className={classes.iconHolder} id="stopAudio">
                            <BiMicrophone 
                                className={classes.iconStyle} 
                                id="audioOn"
                                
                            />
                            <BiMicrophoneOff 
                                className={classes.iconStyle} 
                                style={{display: "none"}} 
                                id="audioOff"
                                
                            />
                        </div>
                        <div className={classes.iconHolder}>
                            <MdTv className={classes.iconStyle} id="shareBtn" />
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