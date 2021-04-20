import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import {
    Container,
    Section
} from './JoinComponents';

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

function JoinScreen(){

    const classes = useStyles();

    const [username, setUsername] = useState("");

    return(
        <Container>
            <Paper elevation={3} className = {classes.rootPaper}> 
                <Typography variant="h4" className={classes.heading}>User Detail</Typography>
                <Section>
                    <form>
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
        </Container>
    )
}

export default JoinScreen;