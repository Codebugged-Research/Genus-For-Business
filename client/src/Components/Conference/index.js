import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    Holder,
    Utils,
    VideoContainer,
    ActionHolder,
    Actions
} from './ConferenceComponent';
import { MdError } from 'react-icons/md';
import { BiCamera, BiCameraOff, BiMicrophoneOff, BiMicrophone } from 'react-icons/bi';

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
        height: '4vh'
    }
}))

function Conference(){

    const classes = useStyles();

    return (
        <Container>
            <Holder>
                <VideoContainer id="videoContainer">

                </VideoContainer>
                <ActionHolder>
                    <Actions>
                        <div className={classes.iconHolder}>
                            <MdError className={classes.iconStyle} />
                        </div>
                        <div className={classes.iconHolder}>
                            <BiCamera className={classes.iconStyle} />
                        </div>
                        <div className={classes.iconHolder}>
                            <BiCameraOff className={classes.iconStyle} />
                        </div>
                        <div className={classes.iconHolder}>
                            <BiMicrophone className={classes.iconStyle} />
                        </div>
                        <div className={classes.iconHolder}>
                            <BiMicrophoneOff className={classes.iconStyle} />
                        </div>
                    </Actions>
                </ActionHolder>
            </Holder>
            <Utils></Utils>
        </Container>
    )
}

export default Conference;