import React, { useState, useEffect } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import Snackbar from '@material-ui/core/Snackbar';
import {
    Container,
    Section
} from './JoinComponents';
import { setSessionStorage } from '../../helpers/auth.helpers';

const io = require('socket.io-client');
const socket = io('http://localhost:3001');

const useStyles = makeStyles((theme) => ({
    rootPaper:{
        minHeight: '200px',
        minWidth: '350px',
        padding: theme.spacing(2),
        backgroundColor: 'white'
    },
    heading:{
        fontFamily: 'Nunito, sans-serif',
        textAlign: 'center',
        fontWeight: '600'
    },
    btnStyle:{
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#202950',
        color: 'white',
        width: '100%',
        marginTop: theme.spacing(2)
    }
}))

function JoinScreen({match, history}){

    const classes = useStyles();

    const [username, setUsername] = useState("");
    const [open, setOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        title: "",
        error: ""
    })

    const handleErrorType = (type) => {
        setOpen(true);
        switch (type) {
            case "streamAccessError":
                setErrorMessage({
                    title: "Stream Access Error",
                    error: "Error ocurred while accessing your media devices!"
                })
                break;
            case "WrongMeetingCode":
                setErrorMessage({
                    title: "Wrong Meeting Code",
                    error: "A meeting with this code does not exist!"
                })
            default:
                break;
        }
    }

    const handleClose = () => {
        setUsername("");
        setOpen(false);
    }

    const handleJoinLink = (status) => {
        if(status === "joined"){
            setSessionStorage('status', true);
            history.push(`/meet/${match.params.meetId}`)
        } else {
            handleErrorType("WrongMeetingCode")
        }
    }

    const handleJoinWithLink = (e) => {
        e.preventDefault();
        const data = {
            name: username,
            meetId: match.params.meetId
        }

        socket.emit('joinMeet', data, handleJoinLink);
    }

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        })
        .then((stream) => {

        })
        .catch((err) => {
            handleErrorType("streamAccessError");
        })
    },[])

    return(
        <Container>
            <Paper elevation={3} className = {classes.rootPaper}> 
                <Typography variant="h4" className={classes.heading}>User Detail</Typography>
                <Section>
                    <form onSubmit={handleJoinWithLink}>
                        <TextField 
                            required
                            fullWidth
                            value={username}
                            onChange={e=>setUsername(e.target.value)}
                            label="Name"
                            type="text"
                            placeholder="Please enter your name"
                        />
                        <Button 
                            className = {classes.btnStyle}
                            type="submit"
                            variant="contained"
                            style={{backgroundColor: '#202950'}}
                        >
                            Join Meeting
                        </Button>
                    </form>
                </Section>
            </Paper>
            <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'right'}} open={open} autoHideDuration={3000} onClose={handleClose}>
                <Alert severity="info" variant="filled" onClose={() => {
                    setOpen(false)
                    setUsername("")
                }}>
                    <AlertTitle>{errorMessage.title}</AlertTitle>
                    {errorMessage.error}
                </Alert>
            </Snackbar>
        </Container>
    )
}

export default JoinScreen;