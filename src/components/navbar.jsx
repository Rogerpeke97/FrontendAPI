/* eslint-disable no-use-before-define */
import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {
    Link
  } from "react-router-dom";
  import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

  import { faChild, faDiagnoses, faTrophy, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
let style = {
    navbar: {
        backgroundColor: "rgb(32, 30, 29)",
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
        color: "gray",
        textShadow: "0 0 0 transparent, 0 0 0 transparent",
        overflow: "visible"
    },
    loginButton:{
        flex: '1', cursor: 'pointer', transition: "0.5s ease-in-out",
        color: "gray",
        textShadow: "0 0 0 transparent, 0 0 0 transparent",
        overflow: "visible",
        textDecoration: 'none'
    },
    hoverLogin:{
        visibility: "visible",
        backgroundColor: "rgb(70, 75, 68)",
        position: "absolute",
        color: "white", 
        top: "100%",
        width: "150%",
        right: "0%",
        transition: "all 0.5s ease-out",
        zIndex: "2",
        border: "1px solid white"
    },
    dropdown:{
        display: "flex",
        height: "50px",
        alignItems: 'center',
        cursor: "pointer",
        border: "0.8px solid white",
        transition: "all 0.5s ease-out",
        color: "white",
        textDecoration: "none"
    }
}

const Navbar = ()=>{
    const canvas = useRef(null);
    const [scene, setScene] = useState("Scene not set");
    useEffect(()=>{
        if(scene === "Scene not set"){

    let manager = new THREE.LoadingManager();
    manager.onProgress = ( item, loaded, total )=>{

        console.log( item, loaded, total );

    };
    let obj;
    const loader = new OBJLoader(manager);
    loader.load( 'earth.obj', function ( object ) {
        object.position.x = 0;
        object.position.y = -1.5;
        object.position.z = -4;
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
        const renderer = new THREE.WebGLRenderer({antialias: true});
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
        scene.background = new THREE.Color(0x201E1D);
  
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

    const homeButton = useRef(0);
    const loginButton = useRef(0);
    const [hoverLogin, setHoverLogin] = useState(0)
    let logged = ()=>{
        return(
            <div style={{display: "flex"}}>
            <div style={{display: "grid", alignItems:"center"}} >
            <FontAwesomeIcon icon={faChild} />
            </div>
            <div style={{paddingLeft: "2%"}}>{localStorage.getItem('loginUser')}</div>
            </div>
        )
    }
    let notLogged = ()=>{
        return(
            <div>
            <div style={{display: "grid", alignItems:"center"}} >
            <FontAwesomeIcon icon={faChild} />
            </div>            
            <div style={{paddingLeft: "2%"}}>LOGIN</div>
            </div>
        )
    }
    const logOut = async ()=>{
         localStorage.clear()
        .then(()=>{
            window.location.reload();
        })
        
    }

    return(
        <div style={style.navbar}>
            <div style={style.grid1}>
                <div style={{display: "grid", alignItems: 'center', justifyContent: 'center'}}>
                <div style={style.homeButton} ref={homeButton}
                onMouseEnter={()=>{
                    homeButton.current.style.textShadow = "0 0 10px white, 0 0 50px white"
                    homeButton.current.style.color = "white";
                }}
                onMouseLeave={()=>{
                    homeButton.current.style.color = "gray";
                    homeButton.current.style.textShadow = "0 0 0 transparent, 0 0 0 transparent"                    
                }}
                >HOME</div>
                </div>
            </div>
            <div style={style.canvas} ref={canvas}></div>
            <div style={style.grid1}>
                <div style={{display: "grid", alignItems: 'center', justifyContent: 'center', position: "relative"}}>
                <Link
                    to={localStorage.getItem('loginUser') ? "/" : "/login"}
                     style={style.loginButton}
                     ref={loginButton}
                     onMouseEnter={()=>{
                        loginButton.current.style.textShadow = "0 0 10px white, 0 0 50px white"
                        loginButton.current.style.color = "white";
                        setHoverLogin(1);
                    }}
                    onMouseLeave={()=>{
                        loginButton.current.style.color = "gray";
                        loginButton.current.style.textShadow = "0 0 0 transparent, 0 0 0 transparent"     
                        setHoverLogin(0);               
                    }}
                    >{localStorage.getItem('loginUser') ? logged() : notLogged() }</Link>
                 <div style={hoverLogin === 1 ? style.hoverLogin : {display: "none", visibility: "hidden"}}
                  onMouseEnter={()=>setHoverLogin(1)} onMouseLeave={()=>setHoverLogin(0)}>
                  <Link to={localStorage.getItem('loginUser') ? `/${localStorage.getItem('loginUser')}` : "/login"} style={style.dropdown} onMouseEnter={(e)=>e.currentTarget.style.backgroundColor = "rgb(50, 30, 50)"}
                  onMouseLeave={(e)=>e.currentTarget.style.backgroundColor = "rgb(70, 75, 68)"}>
                <FontAwesomeIcon style={{color: "rgb(29, 146, 226)"}} icon={faDiagnoses} />
                  <div style={{paddingLeft: "2%"}}>Account</div>
                  </Link>
                  <Link to={localStorage.getItem('loginUser') ? "/leaderboard" : "/login"} style={style.dropdown} onMouseEnter={(e)=>e.currentTarget.style.backgroundColor = "rgb(50, 30, 50)"}
                  onMouseLeave={(e)=>e.currentTarget.style.backgroundColor = "rgb(70, 75, 68)"}>
                 <FontAwesomeIcon style={{color: "rgb(125, 140, 40)"}} icon={faTrophy} />
                  <div style={{paddingLeft: "2%"}}>Leaderboard</div>
                  </Link>
                  <div onClick={logOut} style={style.dropdown} onMouseEnter={(e)=>e.currentTarget.style.backgroundColor = "rgb(50, 30, 50)"}
                  onMouseLeave={(e)=>e.currentTarget.style.backgroundColor = "rgb(70, 75, 68)"}>
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