import axios from 'axios';
import {useEffect, useRef, useState} from 'react'
import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {Redirect} from 'react-router';

let style = {
    backgroundAccount: {
        minWidth: '100%',
        maxWidth: '100%',
        minHeight: '100vh',
        maxHeight: '100vh',
        marginTop: "6.5rem",
        backgroundColor: 'red',
        display: 'grid',
        color: 'black',
        justifyContent: 'center',
        alignItems: 'center'
    },
    insideAccount: {
        minHeight: "550px",
        maxHeight: "100%",
        minWidth: "360px",
        maxWidth: "100%",
        backgroundColor: "white",
        display: "grid"
    },
    canvas:{
        flex: "1",
        minHeight: "100px",
        minWidth: "350px",
        maxHeight: "100%", 
        maxWidth: "100%",
    },
}

const Account = () => {
    const input = useRef(null);
    const [userInfo,
        setUserInfo] = useState("");
    const [joinedDate, setJoinedDate] = useState("");
    const [maxScore, setMaxScore] = useState("");
    let canvas = useRef(0);
    const[logChecker, setLogChecker] = useState(false); //SENDS POST REQUEST ONCE 

    let checkIfYouAreLogged = () => { // CHECKS IF USER IS LOGGED IN
        if(logChecker === false){
        axios.post('http://localhost:8080/accountdetails', {
            authorization: localStorage.getItem('user')
        }, {
            headers: {
                // Overwrite Axios's automatically set Content-Type
                'Content-Type': 'application/json',
                'authorization': `Bearer ${localStorage.getItem('user')}`
                }
            })
            .then(res => {
                let [user, date, score] = JSON.stringify(res.data).split(",");
                setUserInfo(user.slice(1, user.length));
                setJoinedDate(date);
                setMaxScore(score.slice(0, -1));
                setLogChecker(true);
            })
            .catch(error => {
             window.location.assign('http://localhost:3000/login')
            })
        }
    };
    checkIfYouAreLogged();

        /*useEffect(()=>{    
        //AVATAR
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
            scene.background = new THREE.Color(0x006400);
      
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
        },[])*/

    return (
        <div style={style.backgroundAccount}>
            <div style={style.insideAccount}>
                <div style={{display: "flex", overflow: "hidden"}}>
                    <div style={style.canvas} ref={canvas}></div>
                    <div style={{display: "grid", flex: "1"}}>
                        <div>{userInfo}</div>
                        <div>{joinedDate}</div>
                        <div>{maxScore}</div>
                    </div>
                </div>
                <div>Stop</div>
            </div>
        </div>
    )
}
export default Account