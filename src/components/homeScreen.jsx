import {useRef, useState, useEffect} from 'react'
import '../App.css';
import * as THREE from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Link} from "react-router-dom";
import {Lensflare, LensflareElement} from 'three/examples/jsm/objects/Lensflare.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faGithub} from '@fortawesome/free-brands-svg-icons'



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
    const [componentLoaded,
        setComponentLoaded] = useState(false);
    let knight = useRef(0);
    let loadingScreenMessages = useRef(0);
    let percentage = useRef(0);
    let fadeScreen = useRef(0);
    useEffect(() => {
        if(componentLoaded === false){
        let height = canvas.current.clientHeight
        let width = canvas.current.clientWidth
        let manager = new THREE.LoadingManager();// WHEN MODELS ARE LOADED .onLoad will be called
        const scene = new THREE.Scene();
        //scene.add(helper) ONLY FOR DEBUGGING
        const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1500);
        const renderer = new THREE.WebGLRenderer();
        camera
            .position
            .set(9, -0.5, -7);
        camera
            .rotation.y = 2.3;
        camera
            .rotation.x = -0.1;
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

        const textureFlare = new THREE.TextureLoader(manager);
        const textureFlare0 = textureFlare.load( 'lensflare0.png' );
        const textureFlare3 = textureFlare.load( 'lensflare3.png' );
        addLight( 0.55, 0.9, 0.5, 5000, 0, 1000 );
        addLight( 0.08, 0.8, 0.5, -1000, 100, 1005 );
        addLight( 0.995, 0.5, 0.9, 5000, 5000, 1000 );

        function addLight( h, s, l, x, y, z ) {

            const light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
            light.color.setHSL( h, s, l );
            light.position.set( x, y, z );
            light.castShadow = true;
            scene.add( light );

            const lensflare = new Lensflare();
            lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, light.color ) );
            lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
            lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
            lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
            lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
            light.add( lensflare );
        }

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
        const loader = new GLTFLoader(manager)
        loader.load("knight.gltf", function (object) {
            object.scene.position.x = 0;
            object.scene.position.y = -2;
            object.scene.position.z = -2;
            object
                .scene
                .scale
                .set(1.2, 1.2, 1.2)
            knight.current = object;
            mixer.current = new THREE.AnimationMixer(knight.current.scene);
            let action = mixer.current.clipAction(knight.current.animations[15]);
            action.play();
            action.loop = THREE.LoopRepeat;
            action.clampWhenFinished = true;
            scene.add(knight.current.scene);
            console.log(knight.current.scene)
            switcher.current = 1;
        },);
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
        let geometrySphere = new THREE.SphereGeometry(7, 25, 25);
        let materialSphere = new THREE.MeshPhongMaterial({map: floorTexture, alphaTest: 0.1, bumpMap: floorBump, bumpScale: 0.01});
        let sphere = new THREE.Mesh(geometrySphere, materialSphere);
        sphere.position.x = 0;
        sphere.position.y = -9;
        sphere.position.z = -2;
        sphere.rotation.x = 1;
        scene.add(sphere);
        const textu = new THREE
            .TextureLoader()
            .load("/textures/skyBackgroundCropped.jpeg");
        textu.minFilter = THREE.LinearFilter;
        scene.background = textu;
        //TREE
        const treeLoader = new GLTFLoader(manager);
        treeLoader.load('mytree.glb', (tree) => {

            tree.scene.position.x = 0;
            tree.scene.position.y = -2.1;
            tree.scene.position.z = -3.2;
            tree.scene.rotation.x = -0.2;
            tree
                .scene
                .scale
                .set(0.8, 0.8, 0.8);
            scene.add(tree.scene);
        })

        //GRASS
        //USED BLENDER TO CREATE LITTLE BLOCKS OF GRASS AND WIND ANIMATION
        const grassLoader = new GLTFLoader(manager);
        for(let i = 0; i < 18; i++){
        grassLoader.load('grassColor.glb', (grass) => {
            grass.scene.position.x = Math.floor(Math.random() * 8) -3.5 ; //RANDOM NUMBER BETWEEN -7 AND 7

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
            }
            renderer.render(scene, camera)
            window.requestAnimationFrame(animate);
        }
        animate()
        //CHECK IF MODELS ARE LOADED
        percentage.current.innerText = "0 %";
        let array = [
            "Loading Existential Buffer", "Setting Universal Physical Constants",
            "Modeling Object Components", "Generating Jobs Kappa", "Installing ransomware: Complete >:)",
            "Stealing your girlfriend", "Gathering Particle Sources", "I'm testing your patience",
            "Reconfoobling energymotron...", "Your left thumb points to the right and your right thumb points to the left.",
            "I'm sorry for being so slow", "Downloading furry porn", "Too fair to worship, too divine to love",
            "An idea is always a generalization, and generalization is a property of thinking. To generalize means to think",
            "UwU", "hey there buddy chum pal friend buddy pal chum bud friend fella bruther amigo pal buddy friend chummy chum chum pal"
             ]
        manager.onProgress = ()=>{
                if(parseInt(percentage.current.innerText.slice(0, -2)) < 80){
                loadingScreenMessages.current.innerText =  array[Math.floor(Math.random() * array.length)];
                percentage.current.innerText = parseInt(percentage.current.innerText.slice(0, -2)) + 1 + " %";
                }
        }
            manager.onLoad = ()=>{
                setInterval(()=>{
                    if(parseInt(percentage.current.innerText.slice(0, -2)) < 100){
                        percentage.current.innerText = parseInt(percentage.current.innerText.slice(0, -2)) + 1 + " %";
                        loadingScreenMessages.current.innerText =  array[Math.floor(Math.random() * array.length)];
                    }
                    else if(parseInt(percentage.current.innerText.slice(0, -2)) === 100){
                        percentage.current.innerText = "100%";
                        fadeScreen.current.style.animation = "loadingDone 1s normal forwards ease-out";
                        setTimeout(()=>setComponentLoaded(true),200);
                    }
                }, 200);
            }
    }
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
                    <div>
                        <div
                            style={{
                            textAlign: "left",
                            margin: "5%",
                            color: "white"
                        }}>
                            This project was made using three.js, along with blender, and react. You can use
                            the models i made by going to the repository down here:
                            <br></br>
                            <div style={{display: "grid", height: "50px"}}>
                                <a
                                    href="https://github.com/Rogerpeke97/FrontendAPI"
                                    rel="noopener noreferrer"
                                    target="_blank"
                                    style={{
                                    justifyContent: "center",
                                    display: "grid",
                                    textDecoration: "none",
                                    alignContent: "center",
                                    color: "white",
                                    cursor: "default",
                                }}>
                                <FontAwesomeIcon icon={faGithub} style={{cursor: "pointer", fontSize: "200%"}} />
                                </a>
                            </div> <br></br>
                            <div style={{maxHeight: "100%", maxWidth: "100%", display: "grid", alignContent: "center", marginBottom: "5%"}}>
                                <img src="/explanationImages/tree.jpg" alt="blendertree" style={{maxHeight: "90%", maxWidth: "100%", boxShadow: "5px 5px 11px 0px rgba(50, 50, 50, 0.75)"}}></img>
                                <div style={{textAlign: "left"}}>
                                    Tree model exported from blender.
                                </div>
                            </div>
                            The knight model was downloaded from cg trader, which i will replace soon by a
                            model i am working on.<br></br> If you want to export your files from blender to
                            three.js, you have to be aware that particles systems cannot be exported from
                            blender, therefore you should convert them to mesh and then export the file.<br></br> I'm
                            saying this in case you want to work on top of the models that i left on my
                            repo. The game is pretty basic, had to implement a bit of math for the
                            character's movement around the radius of the sphere and how depending at which
                            value along the X axis the character is the Y position of the character varies.
                            The way the collision system works if you could call it that is it checks the
                            position values of the tree and the character. If you get too close to the tree
                            then, a collision is detected and you lose one life.
                        </div>
                    </div>
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
            <div
                className="loadingScreen"
                ref={fadeScreen}
                style={/*componentLoaded ? */
            {display: "none"}/*: {display: "grid"}*/}>
                <div>
                    <span>L</span>
                    <span>O</span>
                    <span>A</span>
                    <span>D</span>
                    <span>I</span>
                    <span>N</span>
                    <span>G</span>
                    <span>{" "}</span>
                    <span ref={percentage}></span>
                </div>
                <div className="messages" ref={loadingScreenMessages}></div>
            </div>
        </div>
    );
}
export default HomeScreen