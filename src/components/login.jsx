import axios from 'axios';
import {useRef, useState, useEffect} from 'react'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from "three";

const OrbitControls = require('three-orbit-controls')(THREE);
let style = {
    backgroundLogin: {
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100vh',
        maxHeight: '100vh',
        display: 'grid',
        color: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    },
    loginForm: {
        borderRadius: "6px",
        minHeight: "500px",
        maxHeight: "500px",
        minWidth: "360px",
        maxWidth: "500px",
        //boxShadow: "2px 2px 2px 0px rgb(70, 70, 70), 5px 5px 6px 0px #000000",
        backgroundColor: "transparent",
        textShadow: "6px 5px 4px #000000",
        //opacity: "0.8",
        display: "grid",
        zIndex: "1"
    },
    button: {
        flex: '1',
        cursor: 'pointer',
        boxShadow: "2px 2px 2px 0px rgb(70, 70, 70), 5px 5px 6px 0px #000000",
        transition: "0.5s ease-in-out",
        width: "25%",
        height: "30px",
        display: "grid",
        position: "relative",
        alignContent: "center",
        left: "37.5%",
        overflow: "visible",
        background: "darkorange",
        fontSize: "80%",
        fontWeight: "bold",
        margin: "0"
    },
    loadingAnimation: {
        display: "none",
        height: "50px",
        width: "50px",
        position: "absolute",
        top: "50%",
        left: "50%",
        marginLeft: "-27px",
        marginTop: "-29px", //Centers div
        zIndex: "2",
        borderRadius: "50%",
    },
    canvas:{
        flex: "1",
        zIndex: "0",
        position: "absolute",
        minHeight: "100vh",
        minWidth: "100vw",
        maxHeight: "100vh", 
        maxWidth: "100vw",
    },
}

const Login = () => {
    let input = useRef(null);
    let password = useRef(null);
    let [displayMessage,
        setMessage] = useState("");
    let [signIn,
        setSignIn] = useState(false);
    const [scene, setScene] = useState("Scene not set");
    let signInButton = useRef(0);
    let underlineSignIn = useRef(0);
    let signUpButton = useRef(0);
    let underlineSignUp = useRef(0);
    let switchButton = useRef(0);
    let underlineSwitch = useRef(0);
    let loadingAnimation = useRef(0);
    let loginForm = useRef(0);
    let canvas = useRef(0);
    let shield = useRef(0);
    let camera = useRef(0);
    useEffect(() => { // CHECKS IF USER IS LOGGED IN
        axios.post('http://localhost:8080/account', {
            authorization: localStorage.getItem('user')
        }, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('user')}`
            }
        }).then(res => {
            window
                .location
                .replace("http://localhost:3000");
        }).catch(error => {
            console.log(error)
        })
    }, []);
    async function signUp() {
        loadingAnimation.current.style.display = "grid";
        loginForm.current.style.filter = "blur(2px)";
        axios.post('http://localhost:8080/signup', {
            username: input.current.value,
            password: password.current.value
        }, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        }).then(res => {
            setTimeout(()=>{
            loadingAnimation.current.style.display = "none";
            loginForm.current.style.filter = "blur(0px)";
            setMessage(res.data);
            setSignIn(true);
            }, 2000)
        }).catch(error => {
            setTimeout(()=>{
            loadingAnimation.current.style.display = "none";
            loginForm.current.style.filter = "blur(0px)";
            setMessage(error.response.data.message);
            }, 2000);
        })
    }
    async function login() {
        loadingAnimation.current.style.display = "grid";
        loginForm.current.style.filter = "blur(2px)";
        axios.post('http://localhost:8080/signin', {
            username: input.current.value,
            password: password.current.value
        }, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json'
            }
        }).then(res => {
            console.log(res);
            //GET USERNAME AND TOKEN, USERNAME IN ONE AND TOKEN IN SECOND
            setTimeout(()=>{
            loadingAnimation.current.style.display = "none";
            loginForm.current.style.filter = "blur(0px)";
            let [user,
                token] = JSON
                .stringify(res.data)
                .split("/n");
            localStorage.setItem('user', token.slice(0, -1));
            setMessage("Login succesful!");
            window
                .location
                .replace("http://localhost:3000");
            }, 2000);
        }).catch(error => {
            setTimeout(()=>{
            loadingAnimation.current.style.display = "none";
            loginForm.current.style.filter = "blur(0px)";
            console.log(error)
            }, 2000);
            //setMessage(error.response.data.message);
        })
    }
    // THREEJS BACKGROUND 
    useEffect(()=>{
        if(scene === "Scene not set"){
        let height = canvas.current.clientHeight
        let width = canvas.current.clientWidth
        const scene = new THREE.Scene();
        //scene.add(helper) ONLY FOR DEBUGGING
        camera.current = new THREE.PerspectiveCamera(40, width / height, 1, 1500);
        const renderer = new THREE.WebGLRenderer();
        camera.current
            .position
            .set(0, 0, 2);
        camera.current
            .rotation
            .set(0, 0, 0);
        /*let controls = new OrbitControls(camera, renderer.domElement);
            controls
                .target
                .set(0, 0, -2)*/
        const color = 'white';
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light
            .position
            .set(0, 0, 3);
        scene.add(light);
        //scene.background = new THREE.Color(0x6B8E23);
        //SKYBOX CUBE 
        //https://opengameart.org/content/cloudy-skyboxes 
        //TEXTURE OF THE CUBE
        let materialArray = [];
        let texture_ft = new THREE.TextureLoader().load( '/skyboxImage/ft.jpg');
        let texture_bk = new THREE.TextureLoader().load( '/skyboxImage/bk.jpg');
        let texture_up = new THREE.TextureLoader().load( '/skyboxImage/up.jpg');
        let texture_dn = new THREE.TextureLoader().load( '/skyboxImage/dn.jpg');
        let texture_rt = new THREE.TextureLoader().load( '/skyboxImage/rt.jpg');
        let texture_lf = new THREE.TextureLoader().load( '/skyboxImage/Lf.jpg');
          
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_ft }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_bk }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_up }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_dn }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_rt }));
        materialArray.push(new THREE.MeshBasicMaterial( { map: texture_lf }));
           
        for (let i = 0; i < 6; i++)
          materialArray[i].side = THREE.BackSide;



        let geometry = new THREE.BoxGeometry( 25, 25, 25 );
        //let material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
        let cube = new THREE.Mesh( geometry, materialArray );
        cube.position.x = 0; cube.position.y = 0; cube.position.z = 0; cube.rotation.x = Math.PI / 2;
        scene.add( cube );


        //IMPORT SHIELD EXPORTED FROM BLENDER AS GLB
        const loader = new GLTFLoader();
        loader.load("shield.glb", function (object) {
            object.scene.position.x = 0.15;
            object.scene.position.y = -0.96489601753;
            object.scene.position.z = -4;
            object.scene.rotation.set(0, 0, 0);
            /*object
                .scene
                .scale
                .set(0.3, 0.3, 0.3)*/
            shield.current = object;
            scene.add(object.scene);
            let box = new THREE
            .Box3()
            .setFromObject(shield.current.scene);
            console.log(box.getSize());//GET SHIELD SIZE = 3.85958407013199    
        });


        window.addEventListener('resize', ()=>{
            if(canvas.current !== null){
            width = canvas.current.clientWidth
            height = canvas.current.clientHeight
            renderer.setSize(width, height);
            camera.current.aspect = width / height;
            camera.current.updateProjectionMatrix();
        }
        });
        renderer.setSize(width, height)
        canvas.current.appendChild(renderer.domElement)

        const animate = ()=>{
            renderer.render(scene, camera.current)
            window.requestAnimationFrame(animate);
        }
        animate()
        setScene("Scene set")
    }
    },[scene]);

    //TRACK MOUSE MOVEMENT AND ROTATE FORM AND SHIELD
    let mouseMove = (e)=>{
        let mousex = (e.clientX   - ( canvas.current.getBoundingClientRect().left / 2)) ;
        let mousey = (e.clientY  - ( canvas.current.getBoundingClientRect().top / 2)) ;
        let x = mousex - canvas.current.getBoundingClientRect().width / 2 ;
        let y = canvas.current.getBoundingClientRect().height / 2 - mousey ;
        loginForm.current.style.transform = `perspective(700px) rotateY(${x / 100}deg) rotateX(${ y / 100}deg)`;
        console.log(camera.current.position.x);
        camera.current.rotation.y = (x / 1000) * (Math.PI / 180);
        camera.current.rotation.x = -(y / 1000) * (Math.PI / 180);
        shield.current.scene.rotation.y = (x / 100) * (Math.PI / 180);
        shield.current.scene.rotation.x = -(y / 100) * (Math.PI / 180);
    }

    return (
        <div style={style.backgroundLogin}>
            <div style={style.canvas} onMouseMove={(e)=>mouseMove(e)} ref={canvas}></div>
            <div className= "spinner" style={style.loadingAnimation} ref={loadingAnimation}></div>
            <div style={style.loginForm} onMouseMove={(e)=>mouseMove(e)} ref={loginForm}>
                <div
                    style={{
                    display: "grid",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: "bold",
                }}>Welcome back!</div>
                <div>
                    <div style={{
                        fontWeight: "bold"
                    }}>Email</div>
                    <input
                        ref={input}
                        type="email"
                        autoComplete="email"
                        spellCheck="false"
                        autoCapitalize="none"
                        style={{
                        paddingLeft: "2%",
                        paddingRight: "2%",
                        height: "50%",
                        width: "94%",
                        border: "none",
                        margin: "1%",
                        boxShadow: "2px 2px 2px 0px rgb(70, 70, 70), 5px 5px 6px 0px #000000"
                    }}></input>
                </div>
                <div>
                    <div style={{
                        fontWeight: "bold"
                    }}>Password</div>
                    <input
                        ref={password}
                        type="password"
                        autoComplete="current-password"
                        spellCheck="false"
                        autoCapitalize="none"
                        style={{
                        paddingLeft: "2%",
                        paddingRight: "2%",
                        height: "50%",
                        width: "94%",
                        border: "none",
                        margin: "1%",
                        boxShadow: "2px 2px 2px 0px rgb(70, 70, 70), 5px 5px 6px 0px #000000"
                    }}></input>
                </div>
                <div
                    style={{
                    display: "grid",
                    alignItems: "center"
                }}>
                    {signIn
                        ? <div
                                style={style.button}
                                onClick={() => login()}
                                onMouseEnter={() => {
                                underlineSignIn.current.style.transform = "scaleX(1)";
                            }}
                                onMouseLeave={() => {
                                underlineSignIn.current.style.transform = "scaleX(0)";
                            }}>
                                <h2
                                    style={{
                                    flex: '1',
                                    cursor: 'pointer',
                                    transition: "0.5s ease-in-out",
                                    textShadow: "6px 5px 4px #000000",
                                    overflow: "visible",
                                    textAlign: "center",
                                    margin: "0"
                                }}
                                    ref={signInButton}>Sign in</h2>
                                <div
                                    style={{
                                    height: "2px",
                                    position: "relative",
                                    width: "80%",
                                    left: "10%",
                                    background: "black",
                                    transform: "scaleX(0)",
                                    transition: "all 0.3s ease-out"
                                }}
                                    ref={underlineSignIn}></div>
                            </div>
                        : <div
                            style={style.button}
                            onClick={() => signUp()}
                            onMouseEnter={() => {
                            underlineSignUp.current.style.transform = "scaleX(1)";
                        }}
                            onMouseLeave={() => {
                            underlineSignUp.current.style.transform = "scaleX(0)";
                        }}>
                            <h2
                                style={{
                                flex: '1',
                                cursor: 'pointer',
                                transition: "0.5s ease-in-out",
                                textShadow: "6px 5px 4px #000000",
                                overflow: "visible",
                                textAlign: "center",
                                margin: "0"
                            }}
                                ref={signUpButton}>Sign up</h2>
                            <div
                                style={{
                                height: "2px",
                                position: "relative",
                                width: "80%",
                                left: "10%",
                                background: "black",
                                transform: "scaleX(0)",
                                transition: "all 0.3s ease-out"
                            }}
                                ref={underlineSignUp}></div>
                        </div>}
                </div>
                <div
                    style={{
                    height: "20px",
                    margin: "2%",
                    textAlign: "center"
                }}>{displayMessage}</div>
                <div
                    style={{
                    margin: "2%",
                    fontWeight: "bold"
                }}>{signIn
                        ? "If you don't have an account sign up here:"
                        : "If you already have an account login here:"}</div>
                <div
                    style={style.button}
                    onClick={() => signIn
                    ? setSignIn(false)
                    : setSignIn(true)}
                    onMouseEnter={() => {
                    underlineSwitch.current.style.transform = "scaleX(1)";
                }}
                    onMouseLeave={() => {
                    underlineSwitch.current.style.transform = "scaleX(0)";
                }}>
                    <h2
                        style={{
                        flex: '1',
                        cursor: 'pointer',
                        transition: "0.5s ease-in-out",
                        textShadow: "6px 5px 4px #000000",
                        overflow: "visible",
                        textAlign: "center",
                        margin: "0"
                    }}
                        ref={switchButton}>{signIn
                            ? "Sign up"
                            : "Sign in"}</h2>
                    <div
                        style={{
                        height: "2px",
                        position: "relative",
                        width: "80%",
                        left: "10%",
                        background: "black",
                        transform: "scaleX(0)",
                        transition: "all 0.3s ease-out"
                    }}
                        ref={underlineSwitch}></div>
                </div>
            </div>
        </div>
    )
}
export default Login