import './App.css';
import HomeScreen from './components/homeScreen';
import Navbar from './components/navbar';
import Login from './components/login';
import Game from './components/game'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter
} from "react-router-dom";
import { PageContext } from './pageContext'
import { useState } from 'react';

function App() {

const [value, setValue] = useState("HomePage")
  
  return (
    <BrowserRouter>
    <Switch>
    <PageContext.Provider value={{value, setValue}}>  
    <Route exact path="/" render = {props =>
      <div className="App">
      <Navbar/>
      <HomeScreen/>
      </div>
    }></Route>
    <Route exact path="/login" render= {props =>
    <div>
      <Login/>
    </div>
    }></Route>
     <Route exact path="/game" render= {props =>
    <div className="App">
      <Navbar/>
      <Game/>
    </div>
    }></Route>
    </PageContext.Provider>
    </Switch>
    </BrowserRouter>
  );
}

export default App;
