import {useEffect, useRef, useState} from 'react'
import axios from 'axios';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from "three";
let style = {
    container: {
        display: "grid",
        height: "100vh",
        minWidth: "100vw",
        maxWidth: "100vw",
        fontWeigth: "bold"
    },
    leaderboard: {
        width: "600px",
        height: "600px",
        position: "relative",
        top: "50%",
        left: "50%",
        color: "white",
        overflow: "scroll",
        overflowX: "hidden",
        marginLeft: "-300px",
        background: "black",
        opacity: "0.8",
        marginTop: "-300px",
        boxShadow: "7px 7px 10px 0px rgba(50, 50, 50, 0.75)"
    },
    row: {
        display: "flex",
        width: "100%",
        height: "50px",
        textAlign: "center"
    },
    pages: {
        display: "flex",
        height: "50px",
        textAlign: "center"
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
    loading_bar : {
        width: "300px",
        marginTop: "2%",
        zIndex: "2",
        height: "30px",
        background: "black",
        boxShadow: "5px 5px 15px 5px black"
    },
    progress_bar: {
        display: "grid",
        transition: "all 0.5s ease-out",
        width: "0%",
        height: "30px",
        background: "darkblue"
    }
}

let Leaderboard = () => {
    const [fetchedData,
        setFetched] = useState(false);
    const [dataReady,
        setDataReady] = useState(false);
    let arrayData = useRef(0);
    let canvas = useRef(0);
    let shield = useRef(0);
    let camera = useRef(0);
    const [componentLoaded,
        setComponentLoaded] = useState(null);
    let loadingScreenMessages = useRef(0);
    let percentage = useRef(0);
    let fadeScreen = useRef(0);        
    let leaderboard = useRef(0);
    let progress_bar = useRef(0);
    useEffect(() => {
        if (fetchedData === false) {
            axios.post('https://xentaserver.herokuapp.com/leaderboard', { // GETS SCORE
                authorization: `Bearer ${localStorage.getItem('user')}`
            }, {
                headers: {
                    // Overwrite Axios's automatically set Content-Type
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('user')}`
                }
            }).then(res => {
                arrayData.current = res
                    .data
                    .slice(1, -1)
                    .split(",");
                addRows();
                setFetched(true);
            }).catch(error => {
                setFetched(true);
            })
        }
    })
    useEffect(()=>{
        if (componentLoaded === null) {
        setComponentLoaded(false);
        let height = canvas.current.clientHeight;
        let width = canvas.current.clientWidth;
        const manager = new THREE.LoadingManager();// WHEN MODELS ARE LOADED .onLoad will be called
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
        const loader = new GLTFLoader(manager);
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
                //CHECK IF MODELS ARE LOADED
        percentage.current.innerText = "0 %";
        manager.onProgress = ()=>{
                if(parseInt(percentage.current.innerText.slice(0, -2)) < 100){
                loadingScreenMessages.current.innerText = "Loading your experience...";
                percentage.current.innerText = parseInt(percentage.current.innerText.slice(0, -2)) + 1 + " %";
                progress_bar.current.style.width = (percentage.current.innerText).replace(' ', '');
                }
                else{
                    percentage.current.innerText = "100%";
                    progress_bar.current.style.width = percentage.current.innerText;
                }
        }
            manager.onLoad = ()=>{
                percentage.current.innerText = "100%";
                progress_bar.current.style.width = percentage.current.innerText;
                fadeScreen.current.style.animation = "loadingDone 1s normal forwards ease-out";
                fadeScreen.current.onanimationend = ()=>setComponentLoaded(true);
            }
    }
    },[componentLoaded]);

    const addRows = () => {
        let newArr = [];
        for (let i = 0; i < arrayData.current.length; i += 2) {
            newArr.push([
                arrayData.current[i],
                arrayData.current[i + 1]
            ]);
        }
        sortRow(newArr);
    }
    const sortRow = (newArr) => {
        for (let i = 0; i < newArr.length; i++) {
            for (let j = 0; j < newArr.length - 1; j++) {
                if (parseInt(newArr[j][1]) > parseInt(newArr[j + 1][1])) {
                    let tempElement = newArr[j];
                    newArr.splice(j, 1, newArr[j + 1]);
                    newArr.splice(j + 1, 1, tempElement);
                }
            }
        }
        arrayData.current = newArr;
        setDataReady(true);
    }
    const rowComponents = () => {
        let arrayComponents = [];
        let component = (number, user, score) => {
            return (
                <div style={style.row}>
                    <div
                        style={{
                        flex: "1",
                        border: "1px solid gray",
                        display: "grid",
                        alignItems: "center", transition: "all 0.5s ease-out"
                    }}>{number}</div>
                    <div
                        style={{
                        flex: "1",
                        border: "1px solid gray",
                        display: "grid",
                        alignItems: "center", transition: "all 0.5s ease-out"
                    }}
                        onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "inset 200px 0px 0px #2F3B47"
                    }}
                        onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = ""
                    }}>{user}</div>
                    <div
                        style={{
                        flex: "1",
                        border: "1px solid gray",
                        display: "grid",
                        alignItems: "center", transition: "all 0.5s ease-out"
                    }}
                        onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "inset 200px 0px 0px #2F3B47"
                    }}
                        onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = ""
                    }}>{score}</div>
                </div>
            )
        }
        if (arrayData.current.length > 30) {
            for (let i = 30; i >= 0; i--) {
                arrayComponents.push(component(arrayData.current[i][0], arrayData.current[i][1]));
            }
        } else {
            let num = 0;
            for (let i = arrayData.current.length - 1; i >= 0; i--) {
                arrayComponents.push(component(num += 1, arrayData.current[i][0], arrayData.current[i][1]));
            }
        }
        return arrayComponents;
    }

    /*const browsePages = ()=>{ WILL BE ADDED SOON
        let pages = Math.ceil(arrayData.current.length / 10);
        let arrayComponents = [];
        let component = (pageNumber)=>{
        return(
        <div style={style.pages} onClick={}>
            <div style={{width: "50px", border: "2px solid black", display: "grid", alignItems: "center"}}>{pageNumber}</div>
        </div>)
        }
        for(let i = 0; i < pages; i++){
            arrayComponents.push(component(i));
        }
        return arrayComponents;
    }*/
        //TRACK MOUSE MOVEMENT AND ROTATE FORM AND SHIELD
    let mouseMove = (e)=>{
        let mousex = (e.clientX   - ( canvas.current.getBoundingClientRect().left / 2)) ;
        let mousey = (e.clientY  - ( canvas.current.getBoundingClientRect().top / 2)) ;
        let x = mousex - canvas.current.getBoundingClientRect().width / 2 ;
        let y = canvas.current.getBoundingClientRect().height / 2 - mousey ;
        leaderboard.current.style.transform = `perspective(700px) rotateY(${x / 100}deg) rotateX(${ y / 100}deg)`;
        camera.current.rotation.y = (x / 1000) * (Math.PI / 180);
        camera.current.rotation.x = -(y / 1000) * (Math.PI / 180);
        shield.current.scene.rotation.y = (x / 100) * (Math.PI / 180);
        shield.current.scene.rotation.x = -(y / 100) * (Math.PI / 180);
    }


    return (
        <div style={style.container}>
            <div style={style.canvas} onMouseMove={(e)=>mouseMove(e)} ref={canvas}></div>            
            <div ref={leaderboard} onMouseMove={(e)=>mouseMove(e)} style={style.leaderboard}>
                <div style={style.row}>
                    <div
                        style={{
                        flex: "1",
                        border: "1px solid gray",
                        display: "grid",
                        alignItems: "center", transition: "all 0.5s ease-out"
                    }}>Nº</div>
                    <div
                        style={{
                        flex: "1",
                        border: "1px solid gray",
                        display: "grid",
                        alignItems: "center", transition: "all 0.5s ease-out"
                    }}
                        onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "inset 200px 0px 0px #2F3B47"
                    }}
                        onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = ""
                    }}>User name</div>
                    <div
                        style={{
                        flex: "1",
                        border: "1px solid gray",
                        display: "grid",
                        alignItems: "center", transition: "all 0.5s ease-out"
                    }}
                        onMouseEnter={(e) => {
                        e.currentTarget.style.boxShadow = "inset 200px 0px 0px #2F3B47"
                    }}
                        onMouseLeave={(e) => {
                        e.currentTarget.style.boxShadow = ""
                    }}>Score</div>
                </div>
                <div>
                    {dataReady
                        ? rowComponents()
                        : ""}
                </div>
            </div>
        </div>
    )
}

export default Leaderboard;