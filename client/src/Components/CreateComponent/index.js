import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import {
    Container
} from './CreateComponent';

const useStyles = makeStyles((theme) => ({
    paperStyle: {
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

function CreateScreen(){

    const classes = useStyles();

    return(
        <Container>
            <Paper elevation={3} className={classes.paperStyle}>

            </Paper>
        </Container>
    )
}

export default CreateScreen;