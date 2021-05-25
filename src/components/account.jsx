import axios from 'axios';
import {useEffect, useRef, useState} from 'react'
import * as THREE from "three";
import Avatar from './three_scenes/avatar.js'
import BackgroundAccount from './three_scenes/background_account.js'

let style = {
    backgroundAccount: {
        minWidth: '100vw',
        maxWidth: '100vw',
        minHeight: '1080px',
        maxHeight: "1080px",
        marginTop: "6.5rem",
        backgroundColor: 'darkred',
        display: 'grid',
        color: 'white',
    },
    insideAccount: {
        minHeight: "1080px",
        maxHeight: "1080px",
        minWidth: "100vw",
        maxWidth: "100vw",
        backgroundColor: "transparent",
        display: "grid",
        zIndex: "0" // ATTENTION: SET TO 2 AFTER FINISHING BACKGROUND_ACCOUNT SCENE
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
        width: "350px",
        height: "232px"
    },
    color: { 
        height: "100%",
        flex: "30%",
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
        display: "flex", 
        textShadow: "2px 0px 3px #000000",
        flex: "1", 
        fontSize: "1.5rem",
        height: "200px",
        alignItems: "center", 
        textAlign: "center", 
        fontWeight: "bold", 
    },
    account_data_container_phone: {
        display: "grid", 
        textShadow: "2px 0px 3px #000000",
        gridTemplateRows: "20% 20% 20% 20% 20%",
        fontSize: "1.5rem",
        height: "500px",
        alignItems: "center", 
        textAlign: "left", 
        fontWeight: "bold", 
    },
    account_data: {
        display: "grid", 
        width: "100%", 
        height: "100%", 
        gridTemplateRows: "50% 50%"
    },
    account_data_column: {
        display: "grid",
        textDecoration: "underline",
        alignContent: "center",
    },
    account_data_row: {
        display: "grid",
        alignContent: "center",
    },
    container:{
        display: "flex",
        overflow: "hidden", 
        height: "100%"
    },
    container_phone: {
        display: "grid",
        gridTemplateRows: "50% 50%",
        overflow: "hidden", 
        height: "100%"      
    }
}

const Account = () => {
    const canvas = useRef(0);
    const scene = useRef(0);
    const color = useRef(0);
    const loading_screen = useRef(true);
    const [colorSet, setColorSet] = useState("");
    const [userInfo, setUserInfo] = useState({user: "", joined_date: "", max_score: "", game_tag: ""});
    const [smartphoneView, setSmartphoneView] = useState(false);
    const checkIfYouAreLogged = () => { // CHECKS IF USER IS LOGGED IN
        axios.post('https://xentaserver.herokuapp.com/accountdetails', {
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
        window.location.assign('https://xentaserver.herokuapp.com/login')
        })
    };
    useEffect(()=>{
        checkIfYouAreLogged();
        phoneViewCheck(window.matchMedia("(max-width: 1300px)"));
        window.matchMedia("(max-width: 1300px)").addEventListener('change', phoneViewCheck);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    const set_avatar_color = ()=>{
        axios.post('https://xentaserver.herokuapp.com/setcolor', { // UPLOADS SCORE
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
    //media queries
    const phoneViewCheck = (e)=>{
        if(e.matches === true){
            setSmartphoneView(true);
        }
        else{
            setSmartphoneView(false);
        }
    }


    const DataContainer = ()=>{
        return(
            <div style={smartphoneView ? style.account_data_container_phone : style.account_data_container}>
                <div style={style.account_data}>
                    <div style={style.account_data_column}>
                        Account:
                    </div>
                    <div style={style.account_data_row}>
                    {userInfo.user}
                    </div>
                </div>
                <div style={style.account_data}>
                    <div style={style.account_data_column}>
                        Username:
                    </div>
                    <div style={style.account_data_row}>
                    {userInfo.game_tag}
                    </div>
                </div>
                <div style={style.account_data}>
                <div style={style.account_data_column}>
                        Join date:
                    </div>
                    <div style={style.account_data_row}>
                    {userInfo.joined_date}
                    </div>
                </div>
                <div style={style.account_data}>
                <div style={style.account_data_column}>
                    Max score:
                    </div>
                    <div style={style.account_data_row}>
                    {userInfo.max_score}
                    </div>
                </div>
            </div>
        )
    }
    const AvatarInfo = ()=>{
        return(
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
        )
    }


    return (
        <div style={style.backgroundAccount}>
            <BackgroundAccount loading_screen = {loading_screen} />
            <div style={style.insideAccount}>
                <div style={smartphoneView ? style.container_phone : style.container}>
                    {AvatarInfo()}
                    {DataContainer()}                    
                </div>
            </div>
        </div>
    )
}
export default Account;