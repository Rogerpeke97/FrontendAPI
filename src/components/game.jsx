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
    let xValueMovement = useRef(0);
    let yRotationMovement = useRef(0);
    let animationStopOrStart = useRef(false)
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
                /*  mixer
                    .clipAction(object.animations[5])// WALKING ANIMATION
                    .play();*/
                scene.add(object.scene);
                switcher.current = 1
                animationCheck()
            },);

            //SETTING THE ARROW EVENTS
            window.addEventListener('keydown', (e) => {
                if (e.key === "ArrowDown") {
                    animationStopOrStart.current = true
                    characterGoBack();
                }
            })
            window.addEventListener('keyup', (e) => {
                if (e.key === "ArrowDown") {
                    animationStopOrStart.current = false
                    characterGoBack();
                }
            })

            //ARROW DOWN
            let characterGoBack = () => {
                //DISPLAY ANIMATION
                let action = mixer
                .current
                .clipAction(obj.current.animations[5])
                console.log(obj.current.scene.rotation.y)
                if (obj.current.scene.rotation.y === 2) {
                    switch(animationStopOrStart.current) {
                        case true:
                          action.play();
                          action.clampWhenFinished = true;
                          break;
                        case false:
                          action.stop();
                          break;
                        default:
                      }
                    xValueMovement.current = xValueMovement.current + 0.01;
                    let tween = new TWEEN
                    .Tween(obj.current.scene.position)
                    .to({
                        x: xValueMovement.current,
                        y: 0,
                        z: 4
                    })
                    .start()
                let animateTween = (time) => {
                    TWEEN.update(time)
                    requestAnimationFrame(animateTween)
                }
                requestAnimationFrame(animateTween)
                } 
                else if(obj.current.scene.rotation.y <= 2){
                    console.log(yRotationMovement.current)
                    let tween = new TWEEN
                        .Tween(obj.current.scene.rotation)
                        .to({
                            x: 0,
                            y: 2,
                            z: 0
                        }, 200)
                        .onComplete(()=>{
                            if(obj.current.scene.rotation.y === 2){
                                action.stop();
                            }
                        })
                        .start()
                    let animateTween = (time) => {
                        TWEEN.update(time)
                        requestAnimationFrame(animateTween)
                    }
                    requestAnimationFrame(animateTween)
                }
            }

            //PLANE
            for (let i = 4; i > -1; i -= 0.5) {
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
    }, [scene])
    return (
        <div>
            <div style={style.canvas} ref={canvas}></div>
        </div>
    )
}

export default Game;