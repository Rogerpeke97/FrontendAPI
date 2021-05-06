import axios from 'axios';
import {useEffect, useRef, useState} from 'react'
import * as THREE from "three";
import Avatar from './three_scenes/avatar.js'
import BackgroundAccount from './three_scenes/background_account.js'

let style = {
    backgroundAccount: {
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '1080px',
        maxHeight: "1080px",
        marginTop: "6.5rem",
        backgroundColor: 'darkred',
        display: 'grid',
        color: 'black',
        alignItems: 'center',
        justifyContent: "center"
    },
    insideAccount: {
        minHeight: "550px",
        maxHeight: "100%",
        minWidth: "700px",
        maxWidth: "700px",
        backgroundColor: "lightgray",
        display: "grid",
        zIndex: "-2" // ATTENTION: SET TO 2 AFTER FINISHING BACKGROUND_ACCOUNT SCENE
    },
    canvas:{
        minHeight: "200px",
        maxHeight: "200px", 
        minWidth: "200px",
        maxWidth: "200px",
        border: "2px solid black"
    },
    color_palette_container: {
        display: "flex",
        justifyContent: "center", 
        height: "100%", 
        width: "100%", 
        marginTop: "5%"
    },
    color_set_container: {
        display: "grid", 
        justifyContent: "center", 
        padding: "5px", 
        border: "2px solid black", 
        height: "232px"
    },
    color: { 
        height: "100%",
        flex: "1",
        boxShadow: "3px 3px 16px 0px rgba(50, 50, 50, 0.75)",
        transition: "0.5s ease-out",
        cursor: "pointer", 
        border: "1px solid black"
    },
    color_set: {
        display: "grid",
        textAlign: "center", 
        height: "50px", 
        width: "70%", 
        marginTop: "10%",
        background: "black", 
        color: "white", 
        zIndex: "2", 
        position: "relative", 
        left: "15%",
        boxShadow: "inset 0px 0px 0px #2F3B47", 
        alignContent: "center", 
        transition: "all 0.5s ease-out", 
        fontWeight: "bold",
        cursor: "pointer"
    },
    account_data_container: {
        display: "grid", 
        flex: "1", 
        justifyContent: "center", 
        alignItems: "center", 
        textAlign: "center", 
        fontWeight: "bold", 
        border: "2px solid black"
    },
    account_data_row: {
        marginBottom: "2%", 
        border: "1px solid black", 
        boxShadow: "3px 3px 16px 0px rgba(50, 50, 50, 0.75)"
    }
}

const Account = () => {
    const canvas = useRef(0);
    const scene = useRef(0);
    const color = useRef(0);
    const [colorSet, setColorSet] = useState("");
    const [userInfo, setUserInfo] = useState({user: "", joined_date: "", max_score: "", game_tag: ""});
    const dummy_polygons = useRef([]);
    const checkIfYouAreLogged = () => { // CHECKS IF USER IS LOGGED IN
        axios.post('http://localhost:8080/accountdetails', {
            authorization: localStorage.getItem('user')
        }, {
        headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('user')}`
            }
        })
        .then(res => {
            if(res.data.newToken){
                localStorage.setItem('user', res.data.newToken);
                checkIfYouAreLogged();
            }
            else{
            let [user, date, score, avatar, gametag] = JSON.stringify(res.data).split(",");
            setUserInfo({user: user.slice(1, user.length), joined_date: date, max_score: score, game_tag: gametag.slice(0, -1)});
            if(avatar.length < 1){
                scene.current.background = new THREE.Color(0xFF0000);
            }
            else{
                switch(avatar){
                    case "red":
                        scene.current.background = new THREE.Color(0xFF0000);
                        break;
                    case "yellow":
                        scene.current.background = new THREE.Color(0xFFFF00);
                        break;
                    case "blue":
                        scene.current.background = new THREE.Color(0x0000ff);
                        break;
                    default:        
                }
            }
            }
        })
        .catch(error => {
        //window.location.assign('https://xentaserver.herokuapp.com/login')
        })
    };
    useEffect(()=>{
        checkIfYouAreLogged();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const set_avatar_color = ()=>{
        axios.post('http://localhost:8080/setcolor', { // UPLOADS SCORE
        authorization: localStorage.getItem('user'),
        avatar: `${color.current}`
        }, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('user')}`
            }
        }).then(res => {
            setColorSet("Color set!");
        }).catch(error => {
            setColorSet("Could not update color");
        })
    }



    return (
        <div style={style.backgroundAccount}>
            <BackgroundAccount dummy_polygons = {dummy_polygons} />
            <div style={style.insideAccount}>
                <div style={{display: "flex", overflow: "hidden", height: "500px"}}>
                    <div style={{flex: "0.5", height: "100%"}}>
                        <Avatar canvas = {canvas} scene = {scene} color = {color} />
                        <div style={style.color_set_container}>
                            <div style={{textDecoration: "underline", fontWeight: "bold"}}>Set avatar's background color:</div>
                            <div style={style.color_palette_container}>
                                <div style={style.color}
                                    onMouseEnter={(e)=>{e.currentTarget.style.transform = "scale(1.05, 1.05)"}}
                                    onMouseLeave={(e)=>{e.currentTarget.style.transform = "scale(1, 1)"}}   
                                    onClick={()=>{
                                        scene.current.background = new THREE.Color(0xFF0000);
                                        color.current = "red";
                                    }}  
                                >
                                    <div style={{background:"red", width: "100%", height: "100%"}}></div>
                                </div>
                                <div style={style.color}
                                    onMouseEnter={(e)=>{e.currentTarget.style.transform = "scale(1.05, 1.05)"}}
                                    onMouseLeave={(e)=>{e.currentTarget.style.transform = "scale(1, 1)"}}   
                                    onClick={()=>{
                                        scene.current.background = new THREE.Color(0xFFFF00);
                                        color.current = "yellow";
                                    }}  
                                >
                                    <div style={{background:"yellow", width: "100%", height: "100%"}}></div>                                    
                                </div>
                                <div style={style.color}
                                    onMouseEnter={(e)=>{e.currentTarget.style.transform = "scale(1.05, 1.05)"}}
                                    onMouseLeave={(e)=>{e.currentTarget.style.transform = "scale(1, 1)"}}   
                                    onClick={()=>{
                                        scene.current.background = new THREE.Color(0x0000ff);
                                        color.current = "blue";
                                    }}  
                                >
                                    <div style={{background:"blue", width: "100%", height: "100%"}}></div>                                    
                                </div>
                            </div>
                            <div style={style.color_set}
                           onClick={()=>set_avatar_color()}
                           onMouseEnter={(e)=>{e.currentTarget.style.boxShadow = "inset 0px -80px 0px #2F3B47"}}
                           onMouseLeave={(e)=>{e.currentTarget.style.boxShadow = "inset 0px 0px 0px #2F3B47"}}>Set</div>
                           <div style={{display: "grid", justifyContent: "center", alignItems: "center", marginTop: "5%"}}>{colorSet}</div>
                        </div>
                    </div>
                    <div style={style.account_data_container}>
                        <div>
                            <div style={style.account_data_row}>
                                Account
                            </div>
                            <div>
                            {userInfo.user}
                            </div>
                        </div>
                        <div>
                            <div style={style.account_data_row}>
                                Username
                            </div>
                            <div>
                            {userInfo.game_tag}
                            </div>
                        </div>
                        <div>
                        <div style={style.account_data_row}>
                                Join date
                            </div>
                            <div>
                            {userInfo.joined_date}
                            </div>
                        </div>
                        <div>
                        <div style={style.account_data_row}>
                            Max score
                            </div>
                            <div>
                            {userInfo.max_score}
                            </div>
                        </div>
                    </div>
                </div>
                <div style={{display: "grid", alignItems: "center"}}>
                    <div style={{fontWeight: "bold", textAlign: "center", color: "gray"}}>
                        This part aswell as other parts of the website are not finished, my idea was to include more avatars and more interactivity.<br></br>
                        However due to time constraints and perhaps the desire to start my new project, this will be delayed undefinitely.
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Account;