import React, {useState} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import {Alert, AlertTitle} from '@material-ui/lab/Alert';
import {
    Container
} from './CreateComponent';

const useStyles = makeStyles((theme) => ({
    paperStyle: {
        minHeight: '200px',
        minWidth: '350px',
        padding: theme.spacing(2),
        backgroundColor: 'white',
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
    },
    content: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        marginTop: theme.spacing(2),
        height: '100%'
    },
    createForm:{
        display: 'flex',
        width: '100%',
        margin: theme.spacing(1)
    }
}))

const io = require('socket.io-client');
const socket = io('http://localhost:3001');

function CreateScreen(){

    const classes = useStyles();
    const [formState, setFormState] = useState("");

    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [username, setUsername] = useState("");

    const handleFormState = (set) => {
        setFormState(set);
        setName("");
        setCode("");
        setUsername("");
    }

    const handleCreate = (e) => {
        e.preventDefault();

        socket.emit('connectUser', name);
    }

    const handleJoin = (e) => {
        e.preventDefault();

        // check whether the meeting exists or not. If yes, then connect otherwise alert.
    }

    return(
        <Container>
            <Paper elevation={3} className={classes.paperStyle}>
                <Typography className={classes.heading} variant="h4">User Actions</Typography>
                <div className={classes.content}>
                    <Button 
                        className={classes.btnStyle} 
                        style={{backgroundColor: '#202950'}} 
                        variant="contained"
                        onClick={() => handleFormState("create")}
                    >
                        Create Meeting
                    </Button>
                    <div className={classes.createForm} style={{display: formState === "create" ? 'flex' : 'none'}}>
                        <form style={{width: '100%'}} onSubmit={handleCreate}>
                            <TextField 
                                required
                                fullWidth
                                label="Name"
                                placeholder="Please enter your name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                            <Button 
                                className={classes.btnStyle}
                                style={{backgroundColor: '#202950'}}
                                variant="contained"
                                type="submit"
                            >
                                Create
                            </Button>
                        </form>
                    </div>
                    <Button 
                        className={classes.btnStyle} 
                        style={{backgroundColor: '#202950'}} 
                        variant="contained"
                        onClick={() => handleFormState("join")}
                    >
                        Join Meeting
                    </Button>
                    <div className={classes.createForm} style={{display: formState === "join" ? 'flex' : 'none'}}>
                        <form style={{width: '100%'}} onSubmit={handleJoin}>
                            <TextField 
                                required
                                fullWidth
                                label="Meeting Code"
                                placeholder="Please enter the meeting code"
                                value={code}
                                onChange={e=>setCode(e.target.value)}
                                style={{marginBottom: '7px', fontFamily: 'Nunito', fontWeight: '600'}}
                            />
                            <TextField 
                                required
                                fullWidth
                                label="Name"
                                placeholder="Please enter your name"
                                value={username}
                                onChange={e=>setUsername(e.target.value)}
                                style={{fontFamily: 'Nunito', fontWeight: '600'}}
                            />
                            <Button 
                                className={classes.btnStyle}
                                style={{backgroundColor: '#202950'}}
                                variant="contained"
                                type="submit"
                            >
                                Join
                            </Button>
                        </form>
                    </div>
                </div>
            </Paper>
        </Container>
    )
}

export default CreateScreen;