/* eslint-disable no-use-before-define */
import { useContext, useEffect, useRef, useState } from "react";
import axios from 'axios';
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {
    Link
  } from "react-router-dom";
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

  import { faChild, faDiagnoses, faTrophy, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
let style = {
    navbar: {
        backgroundColor: "olivedrab",
        position: "fixed",
        zIndex: "50",
        width: "100%",
        color: 'white',
        display: 'flex',
        height: '6.5rem'
    },
    grid1: {
        display: 'flex',
        flex: '1',
        alignItems: 'center',
        justifyContent: 'center'
    },
    canvas:{
        flex: "1",
        minHeight: "100px",
        minWidth: "350px",
        maxHeight: "100%", 
        maxWidth: "100%",
    },
    grid2:{
        flex: '1'
    },
    homeButton:{
        flex: '1', cursor: 'pointer', transition: "0.5s ease-in-out",
        color: "white",
        textShadow: "0 0 0 transparent, 0 0 0 transparent",
        overflow: "visible",
        fontSize: "1.3rem",
        fontWeight:"bold",
        margin: "0"
    },
    loginButton:{
        flex: '1', cursor: 'pointer', transition: "0.5s ease-in-out",
        color: "white",
        textShadow: "0 0 0 transparent, 0 0 0 transparent",
        overflow: "visible",
        fontSize: "1.3rem",
        fontWeight:"bold",
        textDecoration: "none",
        margin: "0"
    },
    hoverLogin:{
        visibility: "visible",
        backgroundColor: "lightblue",
        position: "absolute",
        color: "white", 
        top: "100%",
        minWidth: "200px",
        maxWidth: "200px",
        fontSize:"1rem",
        right: "0%",
        transition: "all 0.5s ease-out",
        zIndex: "2",
        border: "1px solid white"
    },
    dropdown:{
        display: "flex",
        height: "50px",
        fontWeight: "bold",
        alignItems: 'center',
        cursor: "pointer",
        border: "0.8px solid white",
        transition: "all 0.5s ease-out",
        color: "black",
        textDecoration: "none"
    }
}

const Navbar = ()=>{
    const canvas = useRef(null);
    const [scene, setScene] = useState("Scene not set");
    useEffect(()=>{
        if(scene === "Scene not set"){

    //DRAGON
    let obj;
    const loader = new OBJLoader();
    loader.load( 'earth.obj', ( object )=>{
        object.position.x = 0;
        object.position.y = -1.5;
        object.position.z = -4;
        console.log(object)
        obj = object;
        scene.add( obj );
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

        const scene = new THREE.Scene();
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
        scene.add(light);
        scene.background = new THREE.Color(0x6B8E23);
  
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
            renderer.render(scene, camera)
            window.requestAnimationFrame(animate);
        }
        animate()
        setScene("Scene set")
    }
    }, [scene])

    const underlineHome = useRef(0);
    const homeFont = useRef(0);
    const underlineLogin = useRef(0);
    const loginFont = useRef(0);
    const loginButton = useRef(0);
    const [hoverLogin, setHoverLogin] = useState(0);
    const [logged, setLogged] = useState(null);
    const [username, setUsername] = useState(null);
    let loggedIn = ()=>{
        return(
            <div style={{display: "flex"}}>
            <div style={{display: "grid", alignItems:"center"}} >
            <FontAwesomeIcon icon={faChild} />
            </div>
            <div style={{paddingLeft: "2%"}}>
            <h2 style={style.loginButton} ref={loginFont}>{username}</h2>
                    <div style={{height: "2px", width: "100%", background:"white",
                     transform: "scaleX(0)", transition: "all 0.3s ease-out"}} ref={underlineLogin}></div>             
            </div>
            </div>
        )
    }
    let notLogged = ()=>{
        return(
            <div style={{display: "flex"}}>
            <div style={{display: "grid", alignItems:"center"}} >
            <FontAwesomeIcon icon={faChild} />
            </div>            
            <div style={{paddingLeft: "2%"}} >
            <h2 style={style.loginButton} ref={loginFont}>LOGIN</h2>
                    <div style={{height: "2px", width: "100%", background:"white",
                     transform: "scaleX(0)", transition: "all 0.3s ease-out"}} ref={underlineLogin}></div>
            </div>
            </div>
        )
    }
    const logOut = async ()=>{
         localStorage.clear()
        .then(()=>{
            window.location.reload();
        })
        
    }

    useEffect(()=>{
        console.log(`Bearer ${localStorage.getItem('user')}`)
        axios.post('http://localhost:8080/account', 
        {authorization: localStorage.getItem('user')},
        {headers: {
            // Overwrite Axios's automatically set Content-Type
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('user')}`
          }
        }
        )
        .then(res => {
            console.log(res);
            let getUser = res.data.split(" ");
            setUsername(getUser[0]);
            setLogged(true);
          })
          .catch(error => {
            console.log(error)
            setLogged(false);
        })       
    }, [])

    return(
        <div style={style.navbar}>
            <div style={style.grid1}>
                <div style={{display: "grid", alignItems: 'center', justifyContent: 'center'}}>
                <div style={style.homeButton}
                onMouseEnter={()=>{
                    homeFont.current.style.textShadow = "0 0 10px white, 0 0 50px white"
                    homeFont.current.style.color = "white";
                    underlineHome.current.style.transform = "scaleX(1)";
                }}
                onMouseLeave={()=>{
                    homeFont.current.style.color = "white";
                    homeFont.current.style.textShadow = "0 0 0 transparent, 0 0 0 transparent";
                    underlineHome.current.style.transform = "scaleX(0)";
                }}
                >
                    <h2 style={style.homeButton} ref={homeFont}>HOME</h2>
                    <div style={{height: "2px", width: "100%", background:"white",
                     transform: "scaleX(0)", transition: "all 0.3s ease-out"}} ref={underlineHome}></div>
                </div>
                </div>
            </div>
            <div style={style.canvas} ref={canvas}></div>
            <div style={style.grid1}>
                <div style={{display: "grid", alignItems: 'center', justifyContent: 'center', position: "relative"}}>
                <Link
                    to={logged ? "/" : "/login"}
                     style={style.loginButton}
                     ref={loginButton}
                     onMouseEnter={()=>{
                        loginFont.current.style.textShadow = "0 0 10px white, 0 0 50px white"
                        loginFont.current.style.color = "white";
                        underlineLogin.current.style.transform = "scaleX(1)";
                        setHoverLogin(1);
                    }}
                    onMouseLeave={()=>{
                        loginFont.current.style.color = "white";
                        loginFont.current.style.textShadow = "0 0 0 transparent, 0 0 0 transparent";
                        underlineLogin.current.style.transform = "scaleX(0)";   
                        setHoverLogin(0);               
                    }}
                    >{logged ? loggedIn() : notLogged() }</Link>
                 <div style={hoverLogin === 1 ? style.hoverLogin : {display: "none", visibility: "hidden"}}
                  onMouseEnter={()=>setHoverLogin(1)} onMouseLeave={()=>setHoverLogin(0)}>
                  <Link to={logged ? `/${username.current}` : "/login"}
                   style={style.dropdown} onMouseEnter={(e)=>{
                       e.currentTarget.style.backgroundColor = "rgb(50, 30, 50)";
                       e.currentTarget.style.color = "white";
                    }}
                  onMouseLeave={(e)=>{
                  e.currentTarget.style.backgroundColor = "lightblue";
                  e.currentTarget.style.color = "black";
                  }}>
                <FontAwesomeIcon style={{color: "rgb(29, 146, 226)"}} icon={faDiagnoses} />
                  <div style={{paddingLeft: "2%"}}>Account</div>
                  </Link>
                  <Link to={logged ? "/leaderboard" : "/login"} style={style.dropdown}
                   onMouseEnter={(e)=>{
                       e.currentTarget.style.backgroundColor = "rgb(50, 30, 50)";
                       e.currentTarget.style.color = "white";
                    }}
                  onMouseLeave={(e)=>{ 
                  e.currentTarget.style.backgroundColor = "lightblue";
                  e.currentTarget.style.color = "black";
                  }}>
                 <FontAwesomeIcon style={{color: "rgb(125, 140, 40)"}} icon={faTrophy} />
                  <div style={{paddingLeft: "2%"}}>Leaderboard</div>
                  </Link>
                  <div onClick={logOut} style={style.dropdown}
                   onMouseEnter={(e)=>{
                       e.currentTarget.style.backgroundColor = "rgb(50, 30, 50)";
                       e.currentTarget.style.color = "white";
                    }}
                  onMouseLeave={(e)=>{ 
                  e.currentTarget.style.backgroundColor = "lightblue";
                  e.currentTarget.style.color = "black";
                  }}>
                  <FontAwesomeIcon style={{color: "rgb(125, 140, 40)"}} icon={faSignOutAlt} />
                  <div style={{paddingLeft: "2%"}}>Log out</div>
                  </div>        
                 </div>
                </div>
            </div>
        </div>
    );
}

export default Navbar;