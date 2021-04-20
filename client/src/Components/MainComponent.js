import React from 'react';
import { Switch, Route } from 'react-router-dom';
import JoinScreen from '../Components/EntryComponent';

function Main(){

    return(
        <Switch>
            <Route exact path="/" component={(props) => <JoinScreen {...props} /> } />
        </Switch>
    )
}

export default Main;