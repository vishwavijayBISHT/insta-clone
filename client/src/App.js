import React, { useEffect, createContext, useReducer, useContext } from "react";
import Navbar from "./components/Navbar";
import { Route, BrowserRouter, Switch, useHistory } from "react-router-dom";
import Home from "./components/screens/Home";
import Login from "./components/screens/Login";
import Profile from "./components/screens/Profile";
import Signup from "./components/screens/Signup";
import Createpost from "./components/screens/Createpost";
import Loading from "./components/screens/Loading";

import { reducer, intialState } from "./reducers/userReducer";

import "./App.css";
import UserProfile from "./components/screens/UserProfile";
import Reset from "./components/screens/Reset";
import NewPass from "./components/screens/NewPass";
import Sus from "./components/screens/SubscribesUserPosts";
export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "USER", payload: user });
      // history.push("/")
    } else {
      if (!history.location.pathname.startsWith("/reset")) {
        history.push("/login");
      }
    }
  }, []);
  return (
    // <Loading></Loading>
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile" exact>
        <Profile />
      </Route>
      <Route path="/createpost">
        <Createpost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/reset">
        <Reset />
      </Route>
      <Route exact path="/reset/:token">
        <NewPass />
      </Route>
      <Route exact path="/myfollowerspost">
        <Sus />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, intialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
