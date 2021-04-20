import React, {useState} from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
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
    contentForm:{
        display: 'flex'
    }
}))

function CreateScreen(){

    const classes = useStyles();
    const [formState, setFormState] = useState("");

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
                            hwodufwiui
                    </div>
                    <Button 
                        className={classes.btnStyle} 
                        style={{backgroundColor: '#202950'}} 
                        variant="contained"
                        onClick={() => setFormState("join")}
                    >
                        Join Meeting
                    </Button>
                    <div className={classes.joinForm} style={{display: formState === "join" ? 'flex' : 'none'}}>
                    uwhefhefuuwiu
                    </div>
                </div>
            </Paper>
        </Container>
    )
}

export default CreateScreen;