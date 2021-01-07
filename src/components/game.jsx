import {useRef, useEffect, useState} from 'react'
import * as THREE from "three";
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from '@tweenjs/tween.js'

const OrbitControls = require('three-orbit-controls')(THREE);

let style = {
    canvas: {
        display: 'grid',
        position: 'absolute',
        minHeight: '100vh',
        minWidth: '100%',
        maxWidth: '100%',
        maxHeight: "100vh"
    }
}

const Game = () => {
    const canvas = useRef(0);
    const [scene,
        setScene] = useState("Scene not set");
    let obj = useRef(0);
    let switcher = useRef(0);
    let mixer = useRef(0);
    let isRotating = useRef(0)
    let trackedKeys = useRef(0);
    let centerChar = useRef(false);
    let jumpChar = useRef(false);
    useEffect(() => {
        if (scene === "Scene not set") {
            let height = canvas.current.clientHeight
            let width = canvas.current.clientWidth
            const scene = new THREE.Scene();
            //scene.add(helper) ONLY FOR DEBUGGING
            const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1500);
            const renderer = new THREE.WebGLRenderer();
            camera
                .position
                .set(0, 0.5, 6);
            const color = 'yellow';
            let clock = new THREE.Clock();
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light
                .position
                .set(0, 4, 3);
            scene.add(light);
            window.addEventListener('resize', () => {
                if (canvas.current !== null) {
                    width = canvas.current.clientWidth
                    height = canvas.current.clientHeight
                    renderer.setSize(width, height);
                    camera.aspect = width / height;
                    camera.updateProjectionMatrix();
                }
            });

            renderer.setSize(width, height)
            canvas
                .current
                .appendChild(renderer.domElement)
            scene.background = new THREE.Color('black')

            //ALIEN
            /* let manager = new THREE.LoadingManager();
        manager.onProgress = ( item, loaded, total )=>{

            console.log( item, loaded, total );

        };*/

            /*const loader = new OBJLoader(manager);
        loader.load( 'alien.obj', function ( object ) {
        object.position.x = 0;
        object.position.y = 0;
        object.position.z = 4;
        object.rotation.y = - Math.PI ;
        object.scale.set(0.01, 0.01, 0.01)
        obj = object;
        scene.add( obj );
        animationCheck()
        });*/
            const loader = new GLTFLoader()
            loader.load("knight.gltf", function (object) {
                object.scene.position.x = 0;
                object.scene.position.y = 0;
                object.scene.position.z = 4;
                object.scene.rotation.y = -Math.PI;
                object
                    .scene
                    .scale
                    .set(0.3, 0.3, 0.3)
                obj.current = object;
                mixer.current = new THREE.AnimationMixer(obj.current.scene);

                let action = mixer
                    .current
                    .clipAction(obj.current.animations[15]) // IDLE ANIMATION
                action.play()
                action.clampWhenFinished = true;

                scene.add(object.scene);
                switcher.current = 1
                setTimeout(()=>{
                    let action = mixer
                       .current
                       .clipAction(obj.current.animations[14]) // RUN ANIMATION
                    action.play()
                    action.clampWhenFinished = true; 
                    console.log(scene.children);
                },10000)
                mixer
                .current
                .clipAction(obj.current.animations[0]); // JUMP ANIMATION
            //EVENT LISTENER FOR FINISHED ANIMATION
            mixer.current.addEventListener('loop', (e)=>{
                if(e.action._clip.name === "knight_jump_up_root"){
                    let action = mixer.current._actions[2];
                    action.stop();
                    jumpChar.current = false;
                }
            })
            },);


            //SETTING THE ARROW EVENTS ARROW RIGHT MOVE RIGHT
            // STORING THE KEY VALUES IN TRACKEDKEYS DUE TO DELAY
            //KEYDOWN EVENT AND LOOPING THROUGH CHARROTATEANDMOVE
            //TO CHECK WHERE TO MOVE THE CHARACTER BASED ON TRUE OR FALSE
            //SEE https://yojimbo87.github.io/2012/08/23/repeated-and-multiple-key-press-events-without-stuttering-in-javascript.html for full understanding of delay.
            //Repeated or multiple key press events in JavaScript can cause a little pause or delay which leads to stuttering behavior, 
            //for example, in games which are using keyboard based navigation. This delay is probably caused by internal browser timeout between key press changes.
            //TRACKING KEYS
            trackedKeys.current = {
                arrowLeft: false, // left arrow
                arrowRight: false, // right arrow
                rightMove: function(){ // ()=>{} THIS DOESNT WORK INSIDE OBJECTS :/
                    this.arrowLeft = false;
                    this.arrowRight = true;
                },
                leftMove: function(){
                    this.arrowLeft = true;
                    this.arrowRight = false;         
                }
            }
            //IS ROTATING TRACKER 
            isRotating.current = {
                isRotatingRight : "stop",
                isRotatingLeft : "stop",
                rotateRight: function(){
                    this.isRotatingRight = "start";
                    this.isRotatingLeft = "stop";
                },
                rotateLeft: function(){
                    this.isRotatingRight = "stop";
                    this.isRotatingLeft = "start";
                },
            }


            window.addEventListener('keydown', (e) => {
                if (e.key === "ArrowRight" && trackedKeys.current["arrowRight"] === false) {
                    trackedKeys.current.rightMove();
                    isRotating.current.rotateRight();
                }
                else if (e.key === "ArrowLeft" && trackedKeys.current["arrowLeft"] === false){
                    trackedKeys.current.leftMove();
                    isRotating.current.rotateLeft();
                }
                else if (e.key === " " && jumpChar.current === false){
                    console.log("spacebar pressed")
                    jumpChar.current = true;
                }

            })
            window.addEventListener('keyup', (e) => {
                if (e.key === "ArrowRight") {
                    trackedKeys.current.arrowRight = false;
                }
                else if (e.key === "ArrowLeft") {
                    trackedKeys.current.arrowLeft = false;
                }
            })


            //MOVING 
            let charRotateAndMove = () => {
                    switch (JSON.stringify(trackedKeys.current)) {
                    case `{"arrowLeft":true,"arrowRight":false}`: //MOVE LEFT
                        centerChar.current = false;
                        console.log("MOVING LEFT")
                        let tween2 = new TWEEN
                            .Tween(obj.current.scene.position)
                            .to({
                                x: obj.current.scene.position.x - 0.7,
                                y: 0,
                                z: 4
                            })
                            .start()
                            let animateTween2 = (time) => {
                            if (trackedKeys.current.arrowLeft === false) {     
                                TWEEN.remove(tween2);
                            } else {
                                TWEEN.update(time)
                                requestAnimationFrame(animateTween2)
                            }
                        }
                        requestAnimationFrame(animateTween2);
                        //ROTATION
                        if(isRotating.current.isRotatingLeft === "start"){
                        let tweenRotateLeft = new TWEEN
                        .Tween(obj.current.scene.rotation)
                        .to({
                            x: 0,
                            y: -2.5, // FROM -3 TO -2.5
                            z: 0
                        }, 50)
                        .onComplete(()=>{
                                TWEEN.remove(tweenRotateLeft);
                                isRotating.current.rotateRight();
                                centerChar.current = true;
                        })
                        .start()
                        let animateTweenRotateLeft = (time) => {
                        if (trackedKeys.current.arrowLeft === false){     
                            TWEEN.remove(tweenRotateLeft);
                            centerChar.current = true;
                        } else {
                            TWEEN.update(time)
                            requestAnimationFrame(animateTweenRotateLeft)
                        }
                    }
                    requestAnimationFrame(animateTweenRotateLeft);
                }
                        break;
                    case `{"arrowLeft":false,"arrowRight":true}`: // MOVE RIGHT
                        console.log("MOVING RIGHT");
                        centerChar.current = false;
                        let tween4 = new TWEEN
                            .Tween(obj.current.scene.position)
                            .to({
                                x: obj.current.scene.position.x + 0.7,
                                y: 0,
                                z: 4
                            })
                            .start()
                            let animateTween4 = (time) => {
                            if (trackedKeys.current.arrowRight === false) {
                                TWEEN.remove(tween4);
                            } else {
                                TWEEN.update(time)
                                requestAnimationFrame(animateTween4)
                            }
                        }
                        requestAnimationFrame(animateTween4)
                        //ROTATION
                        if(isRotating.current.isRotatingRight === "start"){
                        let tweenRotateRight = new TWEEN
                        .Tween(obj.current.scene.rotation)
                        .to({
                            x: 0,
                            y: -3.5, // FROM -3 TO -3.5
                            z: 0
                        }, 50)
                        .onComplete(()=>{
                                TWEEN.remove(tweenRotateRight);
                                isRotating.current.rotateLeft();
                                centerChar.current = true;
                        })
                        .start()
                        let animateTweenRotateRight = (time) => {
                        if (trackedKeys.current.arrowRight === false) {     
                            TWEEN.remove(tweenRotateRight);
                            centerChar.current = true;
                        } else {
                            TWEEN.update(time)
                            requestAnimationFrame(animateTweenRotateRight)
                        }
                    }
                    requestAnimationFrame(animateTweenRotateRight);        
                }            
                        break;
                    default:
                }
            }
            setInterval(()=>charRotateAndMove(), 50);
            //ROTATIOn CENTER CHARACTER
            let centerCharFunction = ()=>{
                if(centerChar.current === true){
                let tweenRotateCenter = new TWEEN
                        .Tween(obj.current.scene.rotation)
                        .to({
                            x: 0,
                            y: -3, // FROM -3 TO -3
                            z: 0
                        }, 50)
                        .onComplete(()=>{
                            TWEEN.remove(tweenRotateCenter)
                            centerChar.current = false;
                            })
                        .start()
                        let animateTweenRotateCenter = (time) => {
                            TWEEN.update(time)
                            requestAnimationFrame(animateTweenRotateCenter)
                    }
                    requestAnimationFrame(animateTweenRotateCenter);
                }        
            }
            setInterval(()=>centerCharFunction(), 50);

            //JUMP ANIMATION

            let jump = ()=>{
                if(jumpChar.current === true && mixer.current._actions[2] !== undefined){
                    let action = mixer.current._actions[2] // JUMP ANIMATION
                    action.play();
                }      
            }
            setInterval(()=>jump(), 50);


                //PLANE
                for (let i = 6; i > -1; i -= 0.5) {
                    for (let j = -2; j < 2; j += 0.5) {
                        let floorTexture = new THREE
                            .TextureLoader()
                            .load('frozengrass.jpg');
                        let floorBump = new THREE
                            .TextureLoader()
                            .load('sunbump.png');
                        const geometry = new THREE.PlaneBufferGeometry(0.5, 0.5, 8);
                        const planeMaterial = new THREE.MeshPhongMaterial({map: floorTexture, alphaTest: 0.1, bumpMap: floorBump, bumpScale: 0.005});;
                        const plane = new THREE.Mesh(geometry, planeMaterial);
                        scene.add(plane)
                        plane.position.x = j;
                        plane.position.y = 0;
                        plane.position.z = i;
                        plane.rotation.x = -Math.PI / 2;
                    }
                }
                const animate = () => {

                    let delta = clock.getDelta();
                    if (switcher.current === 1) {
                        mixer
                            .current
                            .update(delta)
                        renderer.render(scene, camera)
                    }
                    renderer.render(scene, camera)
                    window.requestAnimationFrame(animate);
                }
                animate()
                setScene("Scene set")
            }
        },
        [scene]) 
        return (
            <div>
                <div style={style.canvas} ref={canvas}></div>
            </div>
        )}

    export default Game;