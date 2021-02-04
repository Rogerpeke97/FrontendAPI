import {useRef, useState, useEffect} from 'react'
import '../App.css';
import * as THREE from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Link} from "react-router-dom";
import {Lensflare, LensflareElement} from 'three/examples/jsm/objects/Lensflare.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons'
import { faWindowClose, faQuestionCircle, faMapMarked } from '@fortawesome/free-solid-svg-icons'




let style = {
    container: {
        backgroundColor: 'transparent',
        position: 'relative',
        top: "6.5rem",
        minHeight: '100%',
        maxHeight: '100%',
        minWidth: '100%',
        maxWidth: '100%'
    },
    title: {
        display: 'flex',
        color: 'brown',
        cursor: "default",
        fontSize: '6rem',
        justifyContent: 'center'
    },
    canvas: {
        display: 'grid',
        position: 'fixed',
        minHeight: '100vh',
        minWidth: '1920px',
        zIndex: "2",
        maxWidth: '1920px',
    },
    explanationBox: {
        display: "grid",
        backgroundColor: "black",
        width: "70%",
        opacity: "0.8",
        zIndex: "2",
        minHeight: "100vh",
        left: "15%",
        position: "relative",
        boxShadow: "0 10px 20px gray, 0 6px 6px gray",
        transition: "all 0.5s ease-out"
    },
    footer: {
        backgroundColor: "rgb(32, 30, 29)",
        color: 'white',
        zIndex: "2",
        display: 'flex',
        fontSize: "80%",
        justifyContent: "center",
        height: '10rem',
        position: "relative",
        width: "100%",
    },
    playButton: {
        textDecoration: "none",
        color: "white",
        background: "black",
        fontWeight: "bold",
        width: "20%",
        height: "4rem",
        zIndex: "2",
        marginBottom: "5%",
        marginTop: "5%",
        left:"40%",
        boxShadow: "0px 7px 11px 0px rgba(50, 50, 50, 0.75)",
        position: "relative",
        display: "flex",
    }
}

const HomeScreen = () => {
    const canvas = useRef(0);
    let switcher = useRef(0);
    let camera = useRef(0);
    let mixer = useRef(0);
    let angleSphereForgrass = useRef(0);
    let grassRotationAngle = useRef(0);
    const [componentLoaded,
        setComponentLoaded] = useState(false);
    let loadingScreenMessages = useRef(0);
    let percentage = useRef(0);
    let fadeScreen = useRef(0);
    const [showExplainBox, setShowExplainBox] = useState(true);
    let explainBox = useRef(0);
    let youtubeVideo = useRef(0);
    let bar1 = useRef(0);
    let bar2 = useRef(0);
    let bar3 = useRef(0);
    let audio1 = useRef(0);
    let musicExplain = useRef(0);
    const [smartphoneView, setSmartphoneView] = useState(false);
    useEffect(() => {
        if(componentLoaded === false){
        let height = canvas.current.clientHeight;
        let width =  document.documentElement.clientWidth;
        let manager = new THREE.LoadingManager();// WHEN MODELS ARE LOADED .onLoad will be called
        const scene = new THREE.Scene();
        //scene.add(helper) ONLY FOR DEBUGGING
        camera.current = new THREE.PerspectiveCamera(40, width / height, 1, 1500);
        const renderer = new THREE.WebGLRenderer();
        camera
            .current.position
            .set(9, -0.5, -7);
        camera
        .current.rotation.y = 2.3;
        camera
        .current.rotation.x = -0.1;

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
                width = document.documentElement.clientWidth
                height = document.documentElement.clientHeight
                renderer.setSize(width, height);
                camera.current.aspect = width / height;
                camera.current.updateProjectionMatrix();
            }
        });

        //// PARTICLES
        let particleCount = 1000
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
            renderer.render(scene, camera.current)
        })
        scene.add(particleSys)
        // CHARACTER ADDON FOR MAIN MENU
        const loader = new GLTFLoader(manager)
        loader.load("knight.gltf", function (object) {
            object.scene.position.x = 0;
            object.scene.position.y = -2;
            object.scene.position.z = -2;
            mixer.current = new THREE.AnimationMixer(object.scene);
            let action = mixer.current.clipAction(object.animations[15]);
            action.play();
            scene.add(object.scene);
            switcher.current = 1;
        },);
        // setTimeout(()=>mixer.clipAction(obj.animations[1]).play(), 8000)// WORKS
        // TRYING A SPHERE
        let floorTexture = new THREE
            .TextureLoader()
            .load('homescreenGrass.jpg', (manager) => {
                floorTexture.wrapS = THREE.RepeatWrapping;
                floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture
                    .repeat
                    .set(2, 2);
            });
        let floorBump = new THREE
            .TextureLoader(manager)
            .load('sunbump.png', () => {
                floorTexture.wrapS = THREE.RepeatWrapping;
                floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture
                    .repeat
                    .set(2, 2);
            });
        let geometrySphere = new THREE.SphereGeometry(7, 25, 25);
        let materialSphere = new THREE.MeshLambertMaterial({map: floorTexture, alphaTest: 0.1, bumpMap: floorBump, bumpScale: 0.01});
        let sphere = new THREE.Mesh(geometrySphere, materialSphere);
        sphere.position.x = 0;
        sphere.position.y = -9;
        sphere.position.z = -2;
        sphere.rotation.x = 1;
        scene.add(sphere);
        const textu = new THREE
            .TextureLoader(manager)
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
            tree.scene
            .scale.set(0.5, 0.5, 0.5);
            scene.add(tree.scene);
        })

        //GRASS
        //USED BLENDER TO CREATE LITTLE BLOCKS OF GRASS AND WIND ANIMATION
        const grassLoader = new GLTFLoader(manager);
        for(let i = 0; i < 10; i++){
        grassLoader.load('grassColor.glb', (grass) => {
            grass.scene.position.x = Math.floor(Math.random() * 3) -0.5 ; //RANDOM NUMBER BETWEEN -7 AND 7
            grass.scene.scale.set(0.14, 0.14, 0.14)
            let zRotationNewRadius = Math.sqrt(49 - (grass.scene.position.x * grass.scene.position.x)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED
            let treeRotationZ = Math.asin(grass.scene.position.x / 7); //SPHERE RADIUS = 7
            let z = Math.sin(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
            grass.scene.rotation.z = -treeRotationZ;
            grass.scene.position.z = -z - 2;

            let grassRotationX = grassRotationAngle.current * (180 / Math.PI); //The grass rotation ON X AXIS (FORWARDS)
            grass.scene.rotation.x = grassRotationX;

            let grassPositionY = Math.cos(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
            grass.scene.position.y = grassPositionY - 9;
            scene.add(grass.scene);
            angleSphereForgrass.current+=0.001;
            grassRotationAngle.current-=0.001;
        })

        //media queries
        let phoneViewCheck = (e)=>{
            if(e.matches === true){
                setSmartphoneView(true);
                explainBox.current.style.width = "100%";
                explainBox.current.style.left = "0%";
            }
            else{
                explainBox.current.style.width = "70%";
                explainBox.current.style.left = "15%";
                setSmartphoneView(false);
            }
        }
        phoneViewCheck(window.matchMedia("(max-width: 700px)"));
        window.matchMedia("(max-width: 700px)").addEventListener('change', phoneViewCheck);

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
            renderer.render(scene, camera.current)
            window.requestAnimationFrame(animate);
        }
        animate()
        //CHECK IF MODELS ARE LOADED
        percentage.current.innerText = "0 %";
        let array = [
            "Loading Existential Buffer", "Setting Universal Physical Constants",
            "Modeling Object Components",
             "Gathering Particle Sources", "I'm testing your patience",
            "Reconfoobling energymotron...",
            "I'm sorry for being so slow",
            "UwU", "hey there buddy chum pal friend buddy pal chum bud friend fella bruther amigo pal buddy friend chummy chum chum pal"
             ]
        manager.onProgress = ()=>{
                if(parseInt(percentage.current.innerText.slice(0, -2)) < 100){
                loadingScreenMessages.current.innerText =  array[Math.floor(Math.random() * array.length)];
                percentage.current.innerText = parseInt(percentage.current.innerText.slice(0, -2)) + 1 + " %";
                }
                else{
                    percentage.current.innerText = "100%";
                }
        }
            manager.onLoad = ()=>{
                percentage.current.innerText = "100%";
                        fadeScreen.current.style.animation = "loadingDone 1s normal forwards ease-out";
                        fadeScreen.current.onanimationend = ()=>setComponentLoaded(true);
            }
    }
})
     //TRACK MOUSE MOVEMENT AND ROTATE camera
            let mouseMove = (e)=>{
                let mousex = (e.clientX   - ( canvas.current.getBoundingClientRect().left / 2)) ;
                let mousey = (e.clientY  - ( canvas.current.getBoundingClientRect().top / 2)) ;
                let x = mousex - canvas.current.getBoundingClientRect().width / 2 ;
                let y = canvas.current.getBoundingClientRect().height / 2 - mousey ;
                camera.current.rotation.y = (x / 1000) * (Math.PI / 180) + 2.3;
                camera.current.rotation.x = -(y / 1000) * (Math.PI / 180) - 0.1;
            }

            let addMusicAnimation = ()=>{
                if(bar1.current.style.animation === ""){
                bar1.current.style.animation = "increaseHeightBar1 1.5s linear infinite"
                bar2.current.style.animation = "increaseHeightBar1 1s linear infinite"
                bar3.current.style.animation = "increaseHeightBar1 0.75s linear infinite"
                }
                else{
                bar1.current.style.animation = ""
                bar2.current.style.animation = ""
                bar3.current.style.animation = ""                   
                }
            }

    return (
        <div>
            <div ref={canvas} style={style.canvas} onMouseMove={(e)=>mouseMove(e)}></div>
            <div style={style.container} onMouseMove={(e)=>mouseMove(e)}>
                <div style={style.title}>
                    <span
                        style={{
                        transition: 'all 1s ease-out', zIndex: "3", textShadow: "4px 4px 3px rgba(150, 150, 150, 1)"
                    }}
                        onMouseEnter={(t) => {
                        t.currentTarget.style.animation = 'loading 1s normal forwards';
                        t.currentTarget.style.color = "rgb(29, 146, 226)";
                        t.currentTarget.style.textShadow = "11px 11px 6px rgba(150, 150, 150, 1)";
                    }}
                        onAnimationEnd={(t) => {
                        t.currentTarget.style.animation = 'none';
                        t.currentTarget.style.color = "brown";
                        t.currentTarget.style.textShadow = "4px 4px 3px rgba(150, 150, 150, 1)";
                    }}>X</span>
                    <span
                        style={{
                        transition: 'all 1s ease-out', zIndex: "3", textShadow: "4px 4px 3px rgba(150, 150, 150, 1)"
                    }}
                        onMouseEnter={(t) => {
                        t.currentTarget.style.animation = 'loading 1s normal forwards';
                        t.currentTarget.style.color = "rgb(125, 140, 40)";
                        t.currentTarget.style.textShadow = "11px 11px 6px rgba(150, 150, 150, 1)";
                    }}
                        onAnimationEnd={(t) => {
                        t.currentTarget.style.animation = 'none';
                        t.currentTarget.style.color = "brown";
                        t.currentTarget.style.textShadow = "4px 4px 3px rgba(150, 150, 150, 1)";
                    }}>E</span>
                    <span
                        style={{
                        transition: 'all 1s ease-out', zIndex: "3", textShadow: "4px 4px 3px rgba(150, 150, 150, 1)"
                    }}
                        onMouseEnter={(t) => {
                        t.currentTarget.style.animation = 'loading 1s normal forwards';
                        t.currentTarget.style.color = "rgb(70, 75, 68)";
                        t.currentTarget.style.textShadow = "11px 11px 6px rgba(150, 150, 150, 1)";
                    }}
                        onAnimationEnd={(t) => {
                        t.currentTarget.style.animation = 'none';
                        t.currentTarget.style.color = "brown";
                        t.currentTarget.style.textShadow = "4px 4px 3px rgba(150, 150, 150, 1)";
                    }}>N</span>
                    <span
                        style={{
                        transition: 'all 1s ease-out', zIndex: "3", textShadow: "4px 4px 3px rgba(150, 150, 150, 1)"
                    }}
                        onMouseEnter={(t) => {
                        t.currentTarget.style.animation = 'loading 1s normal forwards';
                        t.currentTarget.style.color = "rgb(29, 146, 226)";
                        t.currentTarget.style.textShadow = "11px 11px 6px rgba(150, 150, 150, 1)";
                    }}
                        onAnimationEnd={(t) => {
                        t.currentTarget.style.animation = 'none';
                        t.currentTarget.style.color = "brown";
                        t.currentTarget.style.textShadow = "4px 4px 3px rgba(150, 150, 150, 1)";
                    }}>T</span>
                    <span
                        style={{
                        transition: 'all 1s ease-out', zIndex: "3", textShadow: "4px 4px 3px rgba(150, 150, 150, 1)"
                    }}
                        onMouseEnter={(t) => {
                        t.currentTarget.style.animation = 'loading 1s normal forwards';
                        t.currentTarget.style.color = "rgb(29, 146, 226)";
                        t.currentTarget.style.textShadow = "11px 11px 6px rgba(150, 150, 150, 1)";
                    }}
                        onAnimationEnd={(t) => {
                        t.currentTarget.style.animation = 'none';
                        t.currentTarget.style.color = "brown";
                        t.currentTarget.style.textShadow = "4px 4px 3px rgba(150, 150, 150, 1)";
                    }}>A</span>
                </div>
                <div className= "helpToExplainBox" style={{display:"grid", position: "fixed", height: "5%", width:"5%", left: "95%", top:"95%", zIndex: "4"}}>
                    <FontAwesomeIcon className= "help" icon={faQuestionCircle} style={{cursor: "pointer", width:"100%",fontSize: "200%", transition: "all 0.5s ease-out", color: "white"}} 
                    onClick={()=>{
                    if(showExplainBox === false && smartphoneView === false){
                        setShowExplainBox(true);
                        explainBox.current.style.animation = "popExplainBox 1s normal forwards ease-out"; 
                        explainBox.current.onanimationend = ()=>{
                            explainBox.current.style.animation = "none";
                        };
                    }
                    else if(showExplainBox === false && smartphoneView === true){
                            setShowExplainBox(true);
                            explainBox.current.style.animation = "popExplainBox 1s normal forwards ease-out"; 
                            explainBox.current.onanimationend = ()=>{
                                explainBox.current.style.animation = "none";
                                explainBox.current.style.width = "100%"; 
                                explainBox.current.style.left = "0%"; 
                        };                    
                    }
                    }}/>
                </div>
                <div className= "musicPlayer" style={{display:"flex", position: "fixed", height: "50px", width:"4%", left: "95%", top:"75%", zIndex: "4", background: "transparent", borderRadius: "50%", transform: "rotate3d(0, 0, 1, 180deg)"}} onClick={()=>{
                    let audio = audio1.current;
                    addMusicAnimation();
                    if (audio.duration > 0 && !audio.paused) {
                        audio.pause();
                        //Its playing...do your job
                    } else {
                        audio.play();
                        //Not playing...maybe paused, stopped or never played.   
                    }
                }}
                onMouseEnter={()=>{
                    musicExplain.current.style.display = "flex";
                    }}
                onMouseLeave = {()=>{
                    musicExplain.current.style.display = "none";
                }}
                >
                    <div ref={bar1} style={{height: "5%", width: "100%", marginLeft: "2%", marginRight: "2%", background: "white", flex: "1", position: "relative", bottom: "0", transition: "all 0.5 ease-out"}}></div>
                    <div ref={bar2}style={{height: "5%", width: "100%", marginLeft: "2%", marginRight: "2%", background: "white", flex: "1", position: "relative", bottom: "0", transition: "all 0.5 ease-out"}}></div>
                    <div ref={bar3}style={{height: "5%", width: "100%", marginLeft: "2%", marginRight: "2%", background: "white", flex: "1", position: "relative", bottom: "0", transition: "all 0.5 ease-out"}}></div> 
                </div>
                <div ref={musicExplain} style={{display:"none", textAlign: "center", position: "fixed", justifyContent: "center", alignItems: "center", height: "25px", width:"75px", left: "89%", top:"75%"
                , zIndex: "4", background: "black", opacity: "0.7", fontSize: "50%", color: "white", transition: "all 0.5s ease-out"}}>Play some FFIX music!</div>
                <audio src="finalFantasy.mp3" ref={audio1} loop></audio>
                <div ref={explainBox} style={showExplainBox ? style.explanationBox : {visibility: "hidden"}}>
                    <div>
                        <div style={{display: "grid", justifyContent: "right", alignContent: "center"}}>
                        <FontAwesomeIcon className="windowClose" icon={faWindowClose} style={{cursor: "pointer", fontSize: "250%", color: "white", transition: "all 0.5s ease-out", minWidth: "100%", maxWidth: "100%", textShadow: "0px 7px 10px rgba(150, 150, 150, 1)"}}
                        onClick={()=>{
                            explainBox.current.style.animation = "fadeExplainBox 1s normal forwards ease-out";
                            explainBox.current.onanimationend = ()=>{
                                explainBox.current.style.animation = "none";
                                setShowExplainBox(false)
                            };
                            }}/>
                        </div>
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
                                <FontAwesomeIcon className= "github" icon={faGithub} style={{cursor: "pointer", fontSize: "200%", transition: "all 0.5s ease-out"}} />
                                </a>
                            </div> <br></br>
                            <div style={{maxHeight: "100%", maxWidth: "100%", display: "grid", alignContent: "center", marginBottom: "5%", justifyContent: "center"}}>
                                <img src="/explanationImages/tree.jpg" alt="blendertree" style={{maxHeight: "100%", maxWidth: "100%", boxShadow: "5px 5px 11px 0px rgba(50, 50, 50, 0.75)"}}></img>
                                <div style={{textAlign: "left", marginTop: "1%", color: "darkgray", fontWeight: "100"}}>
                                    Tree model exported from blender where hair particles were turned into tree branch meshes.
                                </div>
                            </div>
                            The knight model was downloaded from cg trader, which i will replace soon by a
                            model i am working on.<br></br> If you want to export your files from blender to
                            three.js, you have to be aware that particles systems cannot be exported from
                            blender, therefore you should convert them to mesh and then export the file.<br></br> I'm
                            saying this in case you want to work on top of the models that i left on my
                            repo. <br></br> The game is pretty basic, i had to implement a bit of math for the
                            character's movement around the radius of the sphere and how, depending at which
                            value along the X axis the character is, the Y position of the character varies.
                            The way the collision system works, if you could call it that, is, it checks the
                            position values of the tree and the character. If you get too close to the tree
                            then, a collision is detected and you lose one life.<br></br>
                            In case you are browsing on mobile, you can check this video showing the gameplay, i would like to port it in
                            the future to mobile with react native as a fun project, in the meantime you can watch it or grab your computer
                            and play around!.
                            <div style={{maxHeight: "400px", minHeight: "400px", maxWidth: "100%", minWidth: "100%", display: "grid", alignContent: "center", marginBottom: "5%",  marginTop: "5%"}}>
                            <iframe ref={youtubeVideo} style={{maxHeight: "400px", minHeight: "400px", maxWidth: "100%", minWidth: "100%", boxShadow: "5px 5px 11px 0px rgba(50, 50, 50, 0.75)"}} title= "game video" src="https://www.youtube.com/embed/pQOFoHOMXvw" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                            </div>
                            <div style={{maxHeight: "100%", maxWidth: "100%", display: "grid", alignContent: "center", marginBottom: "5%"}}>
                                <img src="gameGif.gif" alt="game gif" style={{maxHeight: "100%", maxWidth: "100%", objectFit: "cover", boxShadow: "5px 5px 11px 0px rgba(50, 50, 50, 0.75)"}}></img>
                                <div style={{textAlign: "left", marginTop: "1%", color: "darkgray", fontWeight: "100"}}>
                                    View from the distance of the scene.
                                </div>
                            </div>
                            <div>
                                My wish was to fill the entire sphere full of trees and grass but performance was being heavily affected. <br></br>
                                I'm currently learning more about what goes on behind the three.js framework in order to create better scenes and i'm
                                also improving my blender models focusing on performance when importing them to the web. 
                            </div>
                        </div>
                    </div>
                </div>
                <div style={style.playButton}>
                        <Link
                            to="/game"
                            onMouseEnter={(e)=>{
                                e.currentTarget.style.boxShadow = "inset 0px -80px 0px #2F3B47"
                            }}
                            onMouseLeave={(e)=>{
                                e.currentTarget.style.boxShadow = ""
                            }}
                            style={{
                            textDecoration: "none",
                            display: "grid",
                            color: "white",
                            width: "100%",
                            heigth: "100%",
                            justifyContent: "center",
                            alignItems: "center",
                            transition: "all 0.5s ease-out"
                        }}>Play</Link>
                </div>
            <div style={style.footer}>
                <div style={{flex: "1", display: "grid", alignItems: "center", margin: "2%"}}>
                    <div>Ignacio Martin Diaz</div>     
                    <div>Portfolio: <a href="https://rogerpeke97.github.io/portfolio" style={{color: "white"}} rel="noopener noreferrer" target="_blank">https://rogerpeke97.github.io/portfolio</a></div>
                    <div style={{display: "flex"}}>
                    <FontAwesomeIcon icon={faMapMarked} style={{marginRight: "1%"}}/> 
                    <div>Buenos Aires, Argentina</div>
                    </div>
                    <div>&copy; Copyright 2021, Ignacio Martin Diaz. All rights reserved</div>
                </div>
                <div style={{flex: "1", display: "grid", alignItems: "center", paddingLeft: "1%", borderLeft: "2px solid white"}}>
                    <div style={{display: "flex"}}>
                        <a href="https://github.com/Rogerpeke97/" rel="noopener noreferrer" target="_blank"
                        style={{justifyContent: "center", display: "grid", textDecoration: "none", alignContent: "center", cursor: "default", color: "white", marginRight: "1%"}}>
                        <FontAwesomeIcon icon={faGithub} style={{cursor: "pointer", fontSize: "100%", transition: "all 0.5s ease-out"}} />
                        </a>
                    <div>Github</div> 
                    </div>
                    <div style={{display: "flex"}}>
                    <a href="https://www.linkedin.com/in/ignacio-martin-diaz-2a30251b7/" rel="noopener noreferrer" target="_blank"
                        style={{justifyContent: "center", display: "grid", textDecoration: "none", alignContent: "center", cursor: "default", color: "white", marginRight: "1%"}}>
                        <FontAwesomeIcon icon={faLinkedin} style={{cursor: "pointer", fontSize: "100%", transition: "all 0.5s ease-out"}} />
                    </a>
                    <div>LinkedIn</div> 
                    </div>
                </div>
            </div>
            </div>
            <div
                className="loadingScreen"
                ref={fadeScreen}
                style={componentLoaded ? {display: "none"} : {display: "grid"}}>
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