import React from 'react';
import { Switch, Route } from 'react-router-dom';
import JoinScreen from '../Components/EntryComponent';
import CreateScreen from '../Components/CreateComponent';

function Main(){

    return(
        <Switch>
            <Route exact path="/" component={(props) => <CreateScreen {...props} />} />
            <Route exact path="/meet/:meetId" component={(props) => <JoinScreen {...props} /> } />
        </Switch>
    )
}

export default Main;