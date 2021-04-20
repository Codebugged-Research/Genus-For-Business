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

function CreateScreen(){

    const classes = useStyles();
    const [formState, setFormState] = useState("");

    const handleCreate = (e) => {
        e.preventDefault();

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
                        onClick={() => setFormState("create")}
                    >
                        Create Meeting
                    </Button>
                    <div className={classes.createForm} style={{display: formState === "create" ? 'flex' : 'none'}}>
                        <form style={{width: '100%'}}>
                            <TextField 
                                required
                                fullWidth
                                label="Name"
                                placeholder="Please enter your name"
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
                        onClick={() => setFormState("join")}
                    >
                        Join Meeting
                    </Button>
                    <div className={classes.createForm} style={{display: formState === "join" ? 'flex' : 'none'}}>
                        <form style={{width: '100%'}}>
                            <TextField 
                                required
                                fullWidth
                                label="Meeting Code"
                                placeholder="Please enter the meeting code"
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