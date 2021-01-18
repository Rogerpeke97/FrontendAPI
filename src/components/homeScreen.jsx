import {useRef, useState, useEffect} from 'react'
import '../App.css';
import * as THREE from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Link} from "react-router-dom";

const OrbitControls = require('three-orbit-controls')(THREE);

let style = {
    container: {
        backgroundColor: 'transparent',
        position: 'absolute',
        top: "6.5rem",
        minHeight: '100vh',
        maxHeight: '100vh',
        minWidth: '100%',
        maxWidth: '100%'
    },
    title: {
        display: 'flex',
        color: 'white',
        fontSize: '6rem',
        justifyContent: 'center'
    },
    howToPlay: {
        display: 'flex',
        position: 'relative',
        color: 'white',
        fontSize: '4rem',
        left: '10%',
        width: '90%'
    },
    canvas: {
        display: 'grid',
        position: 'fixed',
        minHeight: '100vh',
        minWidth: '1920px',
        maxWidth: '1920px',
        maxHeight: "100vh"
    },
    explanationBox: {
        display: "none",
        backgroundColor: "rgb(80, 100, 40)",
        width: "70%",
        height: "100vh",
        left: "15%",
        position: "relative",
        boxShadow: "0 10px 20px gray, 0 6px 6px gray"
    },
    footer: {
        backgroundColor: "rgb(32, 30, 29)",
        color: 'white',
        display: 'flex',
        height: '10rem',
        position: "relative",
        width: "100%",
        top: "250vh"
    },
    playButton: {
        textDecoration: "none",
        color: "white",
        backgroundColor: "red",
        width: "20%",
        height: "10%",
        position: "relative",
        top: "80%",
        display: "flex",
        left: "40%"
    }
}

const HomeScreen = () => {
    const canvas = useRef(0);
    let switcher = useRef(0);
    let mixer = useRef(0);
    let angleSphereForgrass = useRef(0);
    let grassRotationAngle = useRef(0);
    let grassStorage = useRef(0);
    useEffect(() => {
        let height = canvas.current.clientHeight
        let width = canvas.current.clientWidth

        const scene = new THREE.Scene();
        //scene.add(helper) ONLY FOR DEBUGGING
        const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1500);
        const renderer = new THREE.WebGLRenderer();
        camera
            .position
            .set(0, 0, 4);
        let controls = new OrbitControls(camera, renderer.domElement);
        console.log(controls);

        controls
            .target
            .set(0, 0, -2);

        //DIRECTIONAL LIGHT
        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
        hemiLight.color.setHSL( 0.6, 1, 0.6 );
        hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
        hemiLight.position.set( 0, 50, 0 );
        scene.add( hemiLight );

        const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
        scene.add( hemiLightHelper );

        //

        const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
        dirLight.color.setHSL( 0.1, 1, 0.95 );
        dirLight.position.set( - 1, 1.75, 1 );
        dirLight.position.multiplyScalar( 30 );
        scene.add( dirLight );

        dirLight.castShadow = true;

        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;

        const d = 50;

        dirLight.shadow.camera.left = - d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = - d;

        dirLight.shadow.camera.far = 3500;
        dirLight.shadow.bias = - 0.0001;

        const dirLightHelper = new THREE.DirectionalLightHelper( dirLight, 10 );
        scene.add( dirLightHelper );


        let clock = new THREE.Clock();
        window.addEventListener('resize', () => {
            if (canvas.current !== null) {
                width = canvas.current.clientWidth
                height = canvas.current.clientHeight
                renderer.setSize(width, height);
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
        });

        //// PARTICLES
        let particleCount = 2000
        let particleDistance = 53;
        let particles = new THREE.Geometry();
        let texture = new THREE
            .TextureLoader()
            .load('leaftexture.png');
        let pMaterial = new THREE.PointsMaterial({
            color: 'green', size: 0.3, map: texture, alphaTest: 0.1, // removes black squares
            blending: THREE.NormalBlending,
            transparent: true
        });
        for (let i = 0; i < particleCount; i++) {
            let posX = (Math.random() - 0.5) * particleDistance;
            let posY = (Math.random() - 0.5) * particleDistance;
            let posZ = (Math.random() - 0.5) * particleDistance;
            let particle = new THREE.Vector3(posX, posY, posZ);
            particles
                .vertices
                .push(particle);
        }

        // create the particle system
        let particleSys = new THREE.Points(particles, pMaterial);
        particleSys.name = 'particleSys';
        renderer.setAnimationLoop(() => {
            let particleSys = scene.getObjectByName('particleSys');
            particleSys
                .geometry
                .vertices
                .forEach(particle => {
                    particle.y -= 0.01;
                    if (particle.y < -10) {
                        particle.y = 20
                    }
                    particleSys.geometry.verticesNeedUpdate = true;
                })
            renderer.render(scene, camera)
        })
        scene.add(particleSys)
        // CHARACTER ADDON FOR MAIN MENU
        /*const loader = new GLTFLoader()
        loader.load("knight.gltf", function (object) {
            object.scene.traverse( ( node )=>{

                if ( node.isMesh ) {
                    node.castShadow = true;
                    node.receiveShadow = true; 
                }
        
            } );
            object.scene.position.x = 0;
            object.scene.position.y = -2;
            object.scene.position.z = -2;
            object
                .scene
                .scale
                .set(1.2, 1.2, 1.2)
            obj.current = object;
            mixer.current = new THREE.AnimationMixer(obj.current.scene);
            let action = mixer.current.clipAction(obj.current.animations[15]);
            action.play()
            action.clampWhenFinished = true;
            scene.add(obj.current.scene);
            switcher.current = 1
        },);*/
        // setTimeout(()=>mixer.clipAction(obj.animations[1]).play(), 8000)// WORKS
        // TRYING A SPHERE
        let floorTexture = new THREE
            .TextureLoader()
            .load('homescreenGrass.jpg', () => {
                floorTexture.wrapS = THREE.RepeatWrapping;
                floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture
                    .repeat
                    .set(2, 2);
            });
        let floorBump = new THREE
            .TextureLoader()
            .load('sunbump.png', () => {
                floorTexture.wrapS = THREE.RepeatWrapping;
                floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture
                    .repeat
                    .set(2, 2);
            });
        let geometrySphere = new THREE.SphereGeometry(7, 100, 100);
        let materialSphere = new THREE.MeshLambertMaterial({map: floorTexture, alphaTest: 0.1, bumpMap: floorBump, bumpScale: 0.01});
        let sphere = new THREE.Mesh(geometrySphere, materialSphere);
        sphere.position.x = 0;
        sphere.position.y = -9;
        sphere.position.z = -2;
        sphere.rotation.x = 1;
        sphere.receiveShadow = true;
        scene.add(sphere);
        const textu = new THREE
            .TextureLoader()
            .load("/textures/skyBackgroundCropped.jpeg");
        textu.minFilter = THREE.LinearFilter;
        scene.background = textu;
        //TREE
        const treeLoader = new GLTFLoader();
        treeLoader.load('/textures/tree.gltf', (tree) => {

            tree.scene.position.x = 0;
            tree.scene.position.y = -2.1;
            tree.scene.position.z = -3.2;
            tree.scene.rotation.x = -0.2;
            tree
                .scene
                .scale
                .set(0.2, 0.2, 0.2);
            scene.add(tree.scene);
        })

        //GRASS 
        //USED BLENDER TO CREATE LITTLE BLOCKS OF GRASS AND WIND ANIMATION
        grassStorage.current = [];
        const grassLoader = new GLTFLoader();
        for(let i = 0; i < 18; i++){
        grassLoader.load('grassColor.glb', (grass) => {
            grass.scene.position.x = Math.floor(Math.random() * 9) - 4; //RANDOM NUMBER BETWEEN -7 AND 7
            
            let zRotationNewRadius = Math.sqrt(49 - (grass.scene.position.x * grass.scene.position.x)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED
            let treeRotationZ = Math.asin(grass.scene.position.x / 7); //SPHERE RADIUS = 7
            let z = Math.sin(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
            grass.scene.rotation.z = -treeRotationZ;
            grass.scene.position.z = -z - 2;

            let grassRotationX = grassRotationAngle.current * (180 / Math.PI); //The grass rotation ON X AXIS (FORWARDS)
            grass.scene.rotation.x = grassRotationX;

            let grassPositionY = Math.cos(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
            grass.scene.position.y = grassPositionY - 9;

            //mixer.current = new THREE.AnimationMixer(obj.current.scene);
            console.log(grass.scene);
            /*let action = mixer.current.clipAction(obj.current.animations[15]);
            action.play()
            action.clampWhenFinished = true;*/
            grassStorage.current.push(grass);
            scene.add(grass.scene);
            angleSphereForgrass.current+=0.001;
            grassRotationAngle.current-=0.001;
        })
    }

        renderer.setSize(width, height)
        canvas
            .current
            .appendChild(renderer.domElement)

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
        

    })

    return (
        <div>
            <div ref={canvas} style={style.canvas}></div>
            <div style={style.container}>
                <div className="title" style={style.title}>
                    <span
                        style={{
                        transition: 'all 1s ease-out'
                    }}
                        onMouseEnter={(t) => {
                        t.currentTarget.style.animation = 'loading 1s normal forwards ease-in-out';
                        t.currentTarget.style.color = "rgb(29, 146, 226)"
                    }}
                        onAnimationEnd={(t) => {
                        t.currentTarget.style.animation = 'none';
                        t.currentTarget.style.color = "white"
                    }}>G</span>
                    <span
                        style={{
                        transition: 'all 1s ease-out'
                    }}
                        onMouseEnter={(t) => {
                        t.currentTarget.style.animation = 'loading 1s normal forwards ease-in-out';
                        t.currentTarget.style.color = "rgb(125, 140, 40)"
                    }}
                        onAnimationEnd={(t) => {
                        t.currentTarget.style.animation = 'none';
                        t.currentTarget.style.color = "white"
                    }}>a</span>
                    <span
                        style={{
                        transition: 'all 1s ease-out'
                    }}
                        onMouseEnter={(t) => {
                        t.currentTarget.style.animation = 'loading 1s normal forwards ease-in-out';
                        t.currentTarget.style.color = "rgb(70, 75, 68)"
                    }}
                        onAnimationEnd={(t) => {
                        t.currentTarget.style.animation = 'none';
                        t.currentTarget.style.color = "white"
                    }}>m</span>
                    <span
                        style={{
                        transition: 'all 1s ease-out'
                    }}
                        onMouseEnter={(t) => {
                        t.currentTarget.style.animation = 'loading 1s normal forwards ease-in-out';
                        t.currentTarget.style.color = "rgb(29, 146, 226)"
                    }}
                        onAnimationEnd={(t) => {
                        t.currentTarget.style.animation = 'none';
                        t.currentTarget.style.color = "white"
                    }}>e</span>
                </div>
                <div style={style.howToPlay}>How to play:</div>
                <div style={style.explanationBox}>
                    <div>HERE GOES GRAPHIC STUFF DISPLAYING INSTRUCTIONS</div>
                    <div style={style.playButton}>
                        <Link
                            to="/game"
                            style={{
                            textDecoration: "none",
                            display: "grid",
                            color: "white",
                            width: "100%",
                            heigth: "100%",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>Play</Link>
                    </div>
                </div>
            </div>
            <div style={style.footer}>
                <div></div>
            </div>
        </div>
    );
}
export default HomeScreen