import React, {useState, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Slide from '@material-ui/core/Slide';
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
        color: '#202960'
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

    const [videoStatus, setVideoStatus] = useState(false);
    const [audioStatus, setAudioStatus] = useState(false);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        
    }, [])

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
                            <BiCamera className={classes.iconStyle} />
                            <BiCameraOff className={classes.iconStyle} style={{display: 'none'}} />
                        </div>
                        <div className={classes.iconHolder}>
                            <BiMicrophone className={classes.iconStyle} />
                            <BiMicrophoneOff className={classes.iconStyle} style={{display: 'none'}} />
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
            <Dialog open={open} fullWidth TransitionComponent={Transition} onClose={() => setOpen(false)}>
                <DialogTitle>
                    <span className={classes.heading}>Meeting Information</span>
                </DialogTitle>
                <DialogContent>
                    <p className={classes.content}>
                        Please share the meeting link displayed below or the meeting id to allow other participants to join the meeting.
                    </p>
                    <p className={classes.linkId}>
                        {"Meeting Link - "}{window.location.href}
                    </p>
                    <p className={classes.linkId}>
                        {"Meeting Id - "}{match.params.meetId}
                    </p>
                </DialogContent>
            </Dialog>
        </Container>
    )
}

export default Conference;