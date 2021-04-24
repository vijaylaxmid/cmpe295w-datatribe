import React from 'react';
import { Route, useHistory } from 'react-router-dom';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import Home from './pages/Home';
// import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';

// import config from './app.config';
// import AppHeader from './components/AppHeader';


const AppWithRouterAccess = () => {
    return (
        <>
            <Route path='/' exact={true} component={Home} />
            <Route path='/profile' component={ProfilePage} />
            <Route path="/login/callback" component={LoginCallback} />
        </>
    );
};
export default AppWithRouterAccess;