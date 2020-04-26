import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Search from './pages/Search';
import Login from './pages/Login';
import SingUp from './pages/SingUp';
// import { Login } from './pages/Login/Login';
// import Register from './pages/Register/Register';
// import Profile from './pages/Profile/Profile';
// import RegisterItem from './pages/RegisterItem/Item';

const Routes: React.FC = () => {
  return (
    <Switch>
      {/* <Route exact path="/" component={Login} /> */}
      <Route path="/login" component={Login} />
      <Route path="/singup" component={SingUp} />
      <Route path="/search" component={Search} />
    </Switch>
  );
};

export default Routes;
