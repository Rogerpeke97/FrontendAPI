import axios from 'axios';
import {useEffect, useRef, useState} from 'react'
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

let style = {
    backgroundAccount: {
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100vh',
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
        display: "grid"
    },
    canvas:{
        flex: "1",
        minHeight: "200px",
        maxHeight: "200px", 
        minWidth: "200px",
        maxWidth: "200px",
        border: "2px solid black"
    },
    chartBakcground: {
        background: "gray"
    }
}

const Account = () => {
    const [userInfo,
        setUserInfo] = useState("");
    const [joinedDate, setJoinedDate] = useState("");
    const [maxScore, setMaxScore] = useState("");
    const [gameTag, setGameTag] = useState("");
    let canvas = useRef(0);
    let scene = useRef(0);
    let color = useRef(0);
    const [colorSet, setColorSet] = useState("");

    let checkIfYouAreLogged = () => { // CHECKS IF USER IS LOGGED IN
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
                setUserInfo(user.slice(1, user.length));
                setJoinedDate(date);
                setMaxScore(score);
                setGameTag(gametag.slice(0, -1));
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
    })

        useEffect(()=>{    
        //AVATAR
        let obj;
        const loader = new OBJLoader();
        loader.load( 'earth.obj', ( object )=>{
            object.position.x = 0;
            object.position.y = -1.5;
            object.position.z = -4;
            obj = object;
            scene.current.add( obj );
        } );
            let height = canvas.current.clientHeight
            let width = canvas.current.clientWidth
            let raycaster = new THREE.Raycaster();
            let mouse = new THREE.Vector2();
            let pointOfIntersection = new THREE.Vector3();
            let plane = new THREE.Plane(new THREE.Vector3(0, 0, 0.5), 0.5);
            //const helper = new THREE.PlaneHelper( plane, 10, 0xffff00 ); DEBUGGING TO SEE THE PLANE
    
            canvas.current.onmousemove = (e)=>{
                mouse.x = ((e.clientX - canvas.current.offsetLeft) / width) *2 -1;
                mouse.y = - ( (e.clientY - canvas.current.offsetTop) / height) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);
                raycaster.ray.intersectPlane(plane, pointOfIntersection);
                obj.lookAt(pointOfIntersection);       
            }
    
            scene.current = new THREE.Scene();
            //scene.add(helper) ONLY FOR DEBUGGING
            const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1500);
            const renderer = new THREE.WebGLRenderer();
            camera
                .position
                .set(0, 0, 4);
            const color = 'white';
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light
                .position
                .set(0, 0, 3);
            scene.current.add(light);
            scene.current.background = new THREE.Color(color.current);
      
            window.addEventListener('resize', ()=>{
                if(canvas.current !== null){
                width = canvas.current.clientWidth
                height = canvas.current.clientHeight
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
            });
            renderer.setSize(width, height)
            canvas.current.appendChild(renderer.domElement)
    
            const animate = ()=>{
                renderer.render(scene.current, camera)
                window.requestAnimationFrame(animate);
            }
            animate()
        },[])

        let setAvatarColor = ()=>{
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
    return (
        <div style={style.backgroundAccount}>
            <div style={style.insideAccount}>
                <div style={{display: "flex", overflow: "hidden"}}>
                    <div style={style.canvas} ref={canvas}>
                    </div>
                    <div style={{flex: "1", display: "grid", justifyContent: "center", paddingTop: "5%", border: "2px solid black"}}>
                        <div>
                            <div style={{textDecoration: "underline", fontWeight: "bold"}}>Set avatar's background color:</div>
                            <div style={{display: "flex", justifyContent: "center", height: "10%", width: "100%", marginTop: "5%"}}>
                                <div style={{flex: "1", display: "flex", justifyContent: "center"}}>
                                    <div style={{background:"red", height: "30px", width:"30px", boxShadow: "3px 3px 16px 0px rgba(50, 50, 50, 0.75)",
                                    transition: "0.5s ease-out", cursor: "pointer", border: "1px solid black"
                                    }}
                                     onMouseEnter={(e)=>{e.currentTarget.style.transform = "scale(1.05, 1.05)"}}
                                     onMouseLeave={(e)=>{e.currentTarget.style.transform = "scale(1, 1)"}}   
                                     onClick={()=>{
                                         scene.current.background = new THREE.Color(0xFF0000);
                                         color.current = "red";
                                    }}                                 
                                    ></div>
                                </div>
                                <div style={{flex: "1", display: "flex", justifyContent: "center"}}>
                                    <div
                                     style={{background:"yellow", height: "30px", width:"30px", boxShadow: "3px 3px 16px 0px rgba(50, 50, 50, 0.75)",
                                     transition: "0.5s ease-out", cursor: "pointer", border: "1px solid black"
                                    }}
                                     onMouseEnter={(e)=>{e.currentTarget.style.transform = "scale(1.05, 1.05)"}}
                                     onMouseLeave={(e)=>{e.currentTarget.style.transform = "scale(1, 1)"}}
                                     onClick={()=>{
                                         scene.current.background = new THREE.Color(0xFFFF00);
                                         color.current = "yellow";
                                        }}
                                     ></div>                                    
                                </div>
                                <div style={{flex: "1", display: "flex", justifyContent: "center"}}>
                                    <div style={{background:"blue", height: "30px", width:"30px", boxShadow: "3px 3px 16px 0px rgba(50, 50, 50, 0.75)",
                                    transition: "0.5s ease-out", cursor: "pointer", border: "1px solid black"                                    
                                    }}
                                     onMouseEnter={(e)=>{e.currentTarget.style.transform = "scale(1.05, 1.05)"}}
                                     onMouseLeave={(e)=>{e.currentTarget.style.transform = "scale(1, 1)"}}  
                                     onClick={()=>{
                                         scene.current.background = new THREE.Color(0x0000ff);
                                         color.current = "blue";
                                        }}                                  
                                    ></div>                                    
                                </div>
                            </div>
                            <div style={{display: "grid", textAlign: "center", height: "50px", width: "70%", marginTop: "10%",
                            background: "black", color: "white", zIndex: "2", position: "relative", left: "15%",
                            boxShadow: "inset 0px 0px 0px #2F3B47", alignContent: "center", transition: "all 0.5s ease-out", fontWeight: "bold",
                            cursor: "pointer"
                           }}
                           onClick={()=>setAvatarColor()}
                           onMouseEnter={(e)=>{e.currentTarget.style.boxShadow = "inset 0px -80px 0px #2F3B47"}}
                           onMouseLeave={(e)=>{e.currentTarget.style.boxShadow = "inset 0px 0px 0px #2F3B47"}}>Set</div>
                           <div style={{display: "grid", justifyContent: "center", alignItems: "center", marginTop: "5%"}}>{colorSet}</div>
                        </div>
                    </div>
                    <div style={{display: "grid", flex: "1", justifyContent: "center", alignItems: "center", textAlign: "center", fontWeight: "bold", border: "2px solid black"}}>
                        <div>
                            <div style={{marginBottom: "2%", border: "1px solid black", boxShadow: "3px 3px 16px 0px rgba(50, 50, 50, 0.75)"}}>
                                Account
                            </div>
                            <div>
                            {userInfo}
                            </div>
                        </div>
                        <div>
                            <div style={{marginBottom: "2%", border: "1px solid black", boxShadow: "3px 3px 16px 0px rgba(50, 50, 50, 0.75)"}}>
                                Username
                            </div>
                            <div>
                            {gameTag}
                            </div>
                        </div>
                        <div>
                        <div style={{marginBottom: "2%", border: "1px solid black", boxShadow: "3px 3px 16px 0px rgba(50, 50, 50, 0.75)"}}>
                                Join date
                            </div>
                            <div>
                            {joinedDate}
                            </div>
                        </div>
                        <div>
                        <div style={{marginBottom: "2%", border: "1px solid black", boxShadow: "3px 3px 16px 0px rgba(50, 50, 50, 0.75)"}}>
                            Max score
                            </div>
                            <div>
                            {maxScore}
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
export default Account