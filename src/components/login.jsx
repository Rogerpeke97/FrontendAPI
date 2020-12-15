import axios from 'axios';
import {useRef} from 'react'
import { Redirect } from 'react-router';



let style = {
    backgroundLogin: {
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100vh',
        maxHeight: '100vh',
        backgroundColor: 'red',
        display: 'grid',
        color: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    insideLogin: {
        minHeight: "500px",
        maxHeight: "500px",
        minWidth: "500px",
        maxWidth: "500px",
        backgroundColor: "white",
        display: "grid"
    }
}


const Login = ()=>{
    const input = useRef(null);
    async function logIn(){
        axios.post('http://localhost:8080/signin', 
        {username: input.current.value, password: "Son123"},
        {headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json'
          }
        }
        )
        .then(res => {
            localStorage.setItem('loginUser', input.current.value)
            localStorage.setItem('user', JSON.stringify(res.data))
            console.log(res.data);
            <Redirect to={{pathname: '/'}}/>
          })
          .catch(error => {
            console.log(error.response)
        })
    }


    return(
        <div style={style.backgroundLogin}>
            <div style={style.insideLogin}>
                <div style={{display: "grid", justifyContent: "center", alignItems: "center"}}>Welcome back!</div>
                <input ref={input}></input>
                <div onClick={()=>{logIn()}}>Welcome back!</div>
                <div>Welcome back!</div>
                <div>Welcome back!</div>
            </div>
        </div>
    )
}
export default Login