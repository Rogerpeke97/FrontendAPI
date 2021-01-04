import axios from 'axios';
import {useEffect, useRef, useState} from 'react'
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


const Account = ()=>{
    const input = useRef(null);
    const [userInfo, setUserInfo] = useState("")
    useEffect(()=>{
        axios.post('http://localhost:8080/account', 
        {},
        {headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json'
            `Bearer ${localStorage.getItem('user')}`
          }
        }
        )
        .then((res)=>{
            console.log(res.data)
        })
        .catch(error => {
            console.log(error.response)
        })
    },[])

    return(
        <div style={style.backgroundLogin}>
            <div style={style.insideLogin}>
                <div style={{display: "grid", justifyContent: "center", alignItems: "center"}}>Welcome back!</div>
                <input ref={input}></input>
                <div>Welcome back!</div>
                <div>Welcome back!</div>
                <div>Welcome back!</div>
            </div>
        </div>
    )
}
export default Account