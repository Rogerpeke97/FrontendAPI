import {useRef, useEffect, useState} from 'react'
import * as THREE from "three";
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
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
            let controls = new OrbitControls(camera, renderer.domElement);
            controls
                .target
                .set(0, 0, 0);
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

            let obj;
            let mixer;
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
                obj = object;
                mixer = new THREE.AnimationMixer(obj.scene);
                mixer
                    .clipAction(object.animations[5])
                    .play();
                scene.add(object.scene);
                animationCheck()
            },);
            let animationCheck = () => {
                console.log(obj)
                console.log(obj.animations[0])
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
                if(mixer){
                    mixer.update(delta)
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