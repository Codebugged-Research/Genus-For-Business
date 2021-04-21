import React, {useState, useEffect, useRef} from 'react';
import Peer from 'simple-peer';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import AlertTitle from '@material-ui/lab/AlertTitle';
import {
    Container,
    Holder,
    Utils,
    VideoContainer,
    ActionHolder,
    Actions
} from './ConferenceComponent';
import { MdTv, MdCallEnd } from 'react-icons/md';
import { BiCamera, BiCameraOff, BiMicrophoneOff, BiMicrophone, BiErrorCircle } from 'react-icons/bi';

const io = require('socket.io-client');
const socket = io('http://localhost:3001/');
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

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Conference({match}){

    const classes = useStyles();
    const userName = sessionStorage.getItem('userName');

    const [videoStatus, setVideoStatus] = useState(true);
    const [audioStatus, setAudioStatus] = useState(true);

    const [peers, setPeers] = useState([]);
    const socketRef = useRef();
    const ownVideo = useRef();
    const peersRef = useRef([]);
    const meetId = match.params.meetId;

    const [open, setOpen] = useState(false);
    const [openSnack, setOpenSnack] = useState(false);

    const [errorMessage, setErrorMessage] = useState({
        title: "",
        error: ""
    })
    
    const handleError = (status) => {
        setOpenSnack(true);
        switch (status) {
            case "streamError":
                setErrorMessage({
                    title: "Stream Fetch Error",
                    error: "There was an error while accessing your stream"
                })
                break;
            case "wrong":
                setErrorMessage({
                    title: "Meeting Code Invalid",
                    error: "A meeting with the mentioned code was not found!"
                })
                break;
            default:
                break;
        }
    } 

    const handleConnectResponse = (status) => {
        if(status === "connected"){
            generateStream();
        } else {
            handleError("wrong");
        }
    }

    const handleClick = (type) => {
        switch (type) {
            case "cam":
                if(videoStatus){
                    setVideoStatus(false);
                } else {
                    setVideoStatus(true);
                }
                break;
            case "mic":
                if(audioStatus){
                    setAudioStatus(false);
                } else {
                    setAudioStatus(true);
                }
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
            socketRef.current.emit("sendingSignal", (userToSignal, callerID, signal))
        })
    }

    const addPeer = (incomingSignal, callerID, stream) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            wrtc: wrtc,
            stream
        })

        peer.on("signal", signal => {
            socketRef.current.emit("returningSignal", {signal, callerID})
        })
    }

    const generateStream = () => {
        navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        }).then((stream) => {
            ownVideo.current.srcObject = stream;
            socketRef.current.emit("getAllUsers");
            socketRef.current.on("allUsers", users => {
                const peers = [];
                users.forEach(userID => {
                    const peer = createPeer(userID, socketRef.current.id, stream);
                    peersRef.current.push({
                        peerID: userID,
                        peer
                    })
                    peers.push(peer);
                    setPeers(peers);
                })
            })

            socketRef.current.on("userJoined", payload => {
                const peer = addPeer(payload.signal, payload.callerID, stream);
                peersRef.current.push({
                    peerID: payload.callerID,
                    peer
                })

                setPeers(users => [...users, peer]);
            })
        })
        .catch((err) => {
            handleError("streamError");
        })
    }

    useEffect(() => {
        const data = {
            username: userName,
            meetId: match.params.meetId
        }
        socket.emit('joinViaLink', data, handleConnectResponse);
    }, [match.params.meetId, userName])

    return (
        <Container>
            <Holder>
                <VideoContainer id="videoContainer">

                </VideoContainer>
                <ActionHolder>
                    <Actions>
                        <div className={classes.iconHolder}>
                            <BiErrorCircle className={classes.iconStyle} onClick = {() => setOpen(true)} />
                        </div>
                        <div className={classes.iconHolder}>
                            <BiCamera 
                                className={classes.iconStyle} 
                                style={{display: videoStatus === false ? 'none' : 'flex'}}
                                onClick={() => handleClick("cam")}
                            />
                            <BiCameraOff 
                                className={classes.iconStyle} 
                                style={{display: videoStatus === false ? 'flex' : 'none'}} 
                                onClick={() => handleClick("cam")}
                            />
                        </div>
                        <div className={classes.iconHolder}>
                            <BiMicrophone 
                                className={classes.iconStyle} 
                                style={{display: audioStatus === false ? 'none' : 'flex'}}
                                onClick={() => handleClick("mic")}
                            />
                            <BiMicrophoneOff 
                                className={classes.iconStyle} 
                                style={{display: audioStatus === false ? 'flex': 'none'}} 
                                onClick={() => handleClick("mic")}
                            />
                        </div>
                        <div className={classes.iconHolder}>
                            <MdTv className={classes.iconStyle} />
                        </div>
                        <div className={classes.iconHolder}>
                            <MdCallEnd className={classes.iconStyle} />
                        </div>
                    </Actions>
                </ActionHolder>
            </Holder>
            <Utils></Utils>
            <Dialog open={open} fullWidth TransitionComponent={Transition} onClose={() => setOpen(false)} >
                <DialogTitle style={{backgroundColor: '#3E5771', color: 'white'}}>
                    <span className={classes.heading}>Meeting Information</span>
                </DialogTitle>
                <DialogContent style={{backgroundColor: '#3E5771', color: 'white'}}>
                    <p className={classes.content}>
                        Please share the meeting link displayed below or the meeting id to allow other participants to join the meeting.
                    </p>
                    <p className={classes.linkId}>
                        {"Meeting Link - "}{`${window.location.origin}/join/${match.params.meetId}`}
                    </p>
                    <p className={classes.linkId}>
                        {"Meeting Id - "}{match.params.meetId}
                    </p>
                </DialogContent>
            </Dialog>
            <Snackbar 
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                open={openSnack} 
                autoHideDuration={3000} 
                onClose={() => {
                    setOpenSnack(false)
                    setErrorMessage({
                        title:"",
                        error: ""
                    })
                }}
            >
                <Alert severity="info" variant="filled">
                    <AlertTitle>{errorMessage.title}</AlertTitle>
                    {errorMessage.error}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default Conference;