import './App.css';
import HomeScreen from './components/homeScreen';
import Navbar from './components/navbar';
import Login from './components/login';
import Game from './components/game'
import axios from 'axios'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter
} from "react-router-dom";
import { PageContext } from './pageContext'
import { useEffect, useState } from 'react';
import Account from './components/account';



function App() {

const [value, setValue] = useState({accountInfo: 0, logged: false, username: ""});

  return (
    <BrowserRouter>
    <Switch>
    <PageContext.Provider value={value}>  
    <Route exact path="/" render = {props =>
      <div className="App">
      <Navbar/>
      <HomeScreen/>
      </div>
    } />
    <Route exact path="/login" render= { props =>
    <div> 
    <Login/>
    </div>
    } />
     <Route exact path="/game" render= {props =>
     <div className="App">
     <Navbar/>
     <Game/>
     </div>
    } />
    <Route exact path="/account" render= {props =>
      <div className="App">
      <Navbar/>
      <Account/>
      </div>
    } />
    </PageContext.Provider>
    </Switch>
    </BrowserRouter>
  )
}

export default App;
