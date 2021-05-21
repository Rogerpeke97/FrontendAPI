import {useRef, useState, useEffect} from 'react'
import '../App.css';
import * as THREE from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {Link} from "react-router-dom";
import {Lensflare, LensflareElement} from 'three/examples/jsm/objects/Lensflare.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons'
import { faWindowClose, faQuestionCircle, faMapMarked } from '@fortawesome/free-solid-svg-icons'
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils';




let style = {
    container: {
        backgroundColor: 'transparent',
        position: 'relative',
        top: "6.5rem",
        minWidth: '100vw',
        maxWidth: '100vw'
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
        minWidth: '100vw',
        zIndex: "2",
        maxWidth: '100vw',
    },
    explanationBox: {
        display: "grid",
        backgroundColor: "black",
        width: "70%",
        opacity: "0.8",
        zIndex: "2",
        minHeight: "2350px",
        maxHeight: "2350px",
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
        minWidth: "100vw",
        maxWidth: "100vw"
    },
    playButton: {
        textDecoration: "none",
        color: "white",
        background: "black",
        fontWeight: "bold",
        width: "30%",
        bottom: "1%",
        height: "4rem",
        zIndex: "2",
        left:"35%",
        boxShadow: "0px 7px 11px 0px rgba(50, 50, 50, 0.75)",
        position: "relative",
        display: "flex",
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
    let progress_bar = useRef(0);
    let grass_geometry = useRef(0);
    useEffect(() => {
        let height = canvas.current.clientHeight;
        let width =  canvas.current.clientWidth;
        const scene = new THREE.Scene();
        //scene.add(helper) ONLY FOR DEBUGGING

        camera.current = new THREE.PerspectiveCamera(40, width / height, 1, 1500);
        const renderer = new THREE.WebGLRenderer({ antialias: true } );
        /*let controls = new OrbitControls(camera.current, renderer.domElement);
        controls
            .target
            .set(0, 0, 0);*/
        camera
            .current.position
            .set(9, -0.5, -7);
        camera
        .current.rotation.y = 2.3;
        camera
        .current.rotation.x = -0.1;



        //

        const textureFlare = new THREE.TextureLoader();
        const textureFlare0 = textureFlare.load( 'lensflare0.png' );
        const textureFlare3 = textureFlare.load( 'lensflare3.png' );

        const addLight = ( h, s, l, x, y, z ) => {

            const light = new THREE.PointLight( 0xffffff, 1.5, 7500 );
            light.color.setHSL( h, s, l );
            light.position.set( x, y, z );
            scene.add( light );

            const lensflare = new Lensflare();
            lensflare.addElement( new LensflareElement( textureFlare0, 700, 0, light.color ) );
            lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
            lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
            lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
            lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
            light.add( lensflare );
            
        }

        addLight( 0.55, 1.5, 0.5, 5000, 0, 1000 );
        addLight( 0.08, 1.4, 0.5, -1000, 100, 1005 );
        addLight( 0.995, 1.2, 0.9, 5000, 5000, 1000 );

        let clock = new THREE.Clock();
        window.addEventListener('resize', () => {
            if (canvas.current !== null) {
                width = canvas.current.clientWidth
                height = canvas.current.clientHeight
                renderer.setSize(width, height);
                camera.current.aspect = width / height;
                camera.current.updateProjectionMatrix();
            }
        });

        //// PARTICLES
        const particleCount = 750;
        const particleDistance = 53;
        let particles = new THREE.BufferGeometry();
        const texture = new THREE
            .TextureLoader()
            .load('leaftexture.png');
        const pMaterial = new THREE.PointsMaterial({
            color: 'green', size: 0.3, map: texture, alphaTest: 0.1, // removes black squares,
            blending: THREE.CustomBlending,
            transparent: true
        });

        let positions = [];
        let posX, posY, posZ;
        for (let i = 0; i < 750; i++) {
            posX = (Math.random() - 0.5) * particleDistance;
            posY = (Math.random() - 0.5) * particleDistance;;
            posZ = (Math.random() - 0.5) * particleDistance;;
            positions.push(posX, posY, posZ);
        }
        particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        // create the particle system
        let particleSys = new THREE.Points(particles, pMaterial);
        particleSys.name = 'particleSys';
        let star = particleSys.geometry.attributes.position.array;
        renderer.setAnimationLoop(() => {
            for(let i = 1; i < particleCount * 3; i+=3){
                star[i] -= 0.01;
                if(star[i] < -10){
                    star[i] = 20;
                }
                particleSys.geometry.attributes.position.needsUpdate = true;
            }
        })
        scene.add(particleSys)
        // CHARACTER ADDON FOR MAIN MENU
        const loader = new GLTFLoader()
        let action;
        loader.load("knight.gltf", function (object) {
            object.scene.position.x = 0;
            object.scene.position.y = -2;
            object.scene.position.z = -2;
            mixer.current = new THREE.AnimationMixer(object.scene);
            action = mixer.current.clipAction(object.animations[15]);
            action.play();
            scene.add(object.scene);
            switcher.current = 1;
        },);
        // setTimeout(()=>mixer.clipAction(obj.animations[1]).play(), 8000)// WORKS
        // TRYING A SPHERE
        const floorTexture = new THREE
            .TextureLoader()
            .load('homescreenGrass.jpg', () => {
                floorTexture.wrapS = THREE.RepeatWrapping;
                floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture
                    .repeat
                    .set(2, 2);
            });
        /*let floorBump = new THREE
            .TextureLoader(manager)
            .load('sunbump.png', () => {
                floorTexture.wrapS = THREE.RepeatWrapping;
                floorTexture.wrapT = THREE.RepeatWrapping;
                floorTexture
                    .repeat
                    .set(2, 2);
            });*/
        const geometrySphere = new THREE.SphereGeometry(7, 25, 25);
        const materialSphere = new THREE.MeshLambertMaterial({map: floorTexture, alphaTest: 0.1});
        const sphere = new THREE.Mesh(geometrySphere, materialSphere);
        sphere.rotation.x = 1;
        sphere.position.set(0, -9, -2);
        scene.add(sphere);
        const textu = new THREE
            .TextureLoader()
            .load("/textures/skyBackgroundCropped.jpeg");
        textu.minFilter = THREE.LinearFilter;
        scene.background = textu;
        //TREE
        const treeLoader = new GLTFLoader();
        let trees_instanced_mesh;
        let treeRotationX, treePositionY;
        let newX = -5;
        let angleSphereForTrees = 0;
        let geometry_merged = new THREE.BufferGeometry();
        let geometry_array = [];
        let material_tree;
        treeLoader.load('new_tree.glb', (tree) => {
            tree.scene.traverse((child)=>{
                if (child.isMesh) {
                    geometry_array.push(child.geometry.clone().applyMatrix4(child.matrixWorld));
                    material_tree =  child.material;
                }
            });
            geometry_merged = BufferGeometryUtils.mergeBufferGeometries(geometry_array);
            //geometry_merged.merge(child.geometry, child.matrix);
            //const mesh_material = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
            trees_instanced_mesh = new THREE.InstancedMesh(geometry_merged, material_tree, 2);
            trees_instanced_mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame
               //trees_instanced_mesh.instanceMatrix.needsUpdate = true;
                //dummy_tree.add(tree_children[i]);
            for (let j = 0; j < 2; j++) {
                let dummy_tree = new THREE.Object3D();
                dummy_tree.scale.set(0.3,0.3,0.3);
                newX+=3; //RANDOM NUMBER BETWEEN -7 AND 7
                zRotationNewRadius = Math.sqrt(49 - (newX * newX)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED
                z = Math.sin(angleSphereForTrees * (180 / Math.PI)) * zRotationNewRadius;
                // I HAVE TO USE THE SAME FORMULA AS THE KNIGHT TO POSITION THE TREE WITH THE
                // RIGHT ROTATION AND Y POSITION AROUND THE SPHERE TREE ROTATION SIN ANGLE =
                // OPOSSITE OVER HYPOTHENUSE
                treeRotationZ = Math.asin(newX / 7); //SPHERE RADIUS = 7

                treeRotationX = -angleSphereForTrees * (180 / Math.PI); //The tree rotation ON X AXIS (FORWARDS)

                //FIND Y OPOSSITE = SQUARE ROOT OF RADIUS SQUARED - ADYACER = Z SQUARED
                treePositionY = Math.cos(angleSphereForTrees * (180 / Math.PI)) * zRotationNewRadius;

                dummy_tree.position.set(newX, treePositionY -9.3, -z-3.2);
                dummy_tree.rotation.set(treeRotationX, 0, -treeRotationZ);
                dummy_tree.updateMatrix();
                trees_instanced_mesh.setMatrixAt( j, dummy_tree.matrix );
                //angleSphereForTrees += 0.00813333333; //keep it at 0 because trees are on a fixed x value
            }
            trees_instanced_mesh.instanceMatrix.needsUpdate = true;
            scene.add(trees_instanced_mesh);
            /*tree.scene.position.set(0, -2.1, -3.2);
            tree.scene.rotation.x = -0.2;
            tree.scene.rotation.y = -0.4;

            scene.add(tree.scene);*/
        })

        //GRASS

        const dummy = new THREE.Object3D();
        let zRotationNewRadius,treeRotationZ,grassRotationX, z, grassPositionY;
        //GRASS USED BLENDER TO CREATE LITTLE BLOCKS OF GRASS AND WIND ANIMATION
        const grassLoader = new GLTFLoader();                // eslint-disable-next-line no-loop-func
            grassLoader.load('grassColor.glb', (grass) => {
                grass.scene.traverse((child)=>{
                    if (child.isMesh) {
                        grass_geometry.current = child;
                    }
                });
            const mesh_material = new THREE.MeshStandardMaterial({color: 0xff0000});
            const grass_instanced_mesh = new THREE.InstancedMesh(grass_geometry.current.geometry, mesh_material, 12);
            scene.add(grass_instanced_mesh); 
            for(let i = 0; i < 12; i++){
                dummy.position.x = Math.floor(Math.random() * 3) + 1;
                zRotationNewRadius = Math.sqrt(49 - (dummy.position.x * dummy.position.x)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED
                treeRotationZ = Math.asin(dummy.position.x / 7); //SPHERE RADIUS = 7
                z = Math.sin(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
                dummy.rotation.z = -treeRotationZ;
                dummy.position.z = -z -2;
    
                grassRotationX = grassRotationAngle.current * (180 / Math.PI); //The grass rotation ON X AXIS (FORWARDS)
                dummy.rotation.x = grassRotationX;
    
                grassPositionY = Math.cos(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
                dummy.position.y = grassPositionY - 9.3;
                angleSphereForgrass.current+=0.001;
                grassRotationAngle.current-=0.001;
                dummy.updateMatrix();
                grass_instanced_mesh.setMatrixAt( i, dummy.matrix );
                
            }
            grass_instanced_mesh.instanceMatrix.needsUpdate = true;
        })

        //USED BLENDER TO CREATE LITTLE BLOCKS OF GRASS AND WIND ANIMATION
        /*const grassLoader = new GLTFLoader(manager);
        let zRotationNewRadius;
        let treeRotationZ;
        let grassRotationX;
        let z;
        let grassPositionY;
        for(let i = 0; i < 4; i++){
        // eslint-disable-next-line no-loop-func
        grassLoader.load('grassColor.glb', (grass) => {
            grass.scene.position.x = Math.floor(Math.random() * 3) -0.5 ;
            grass.scene.scale.set(0.14, 0.14, 0.14)
            zRotationNewRadius = Math.sqrt(49 - (grass.scene.position.x * grass.scene.position.x)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED
            treeRotationZ = Math.asin(grass.scene.position.x / 7); //SPHERE RADIUS = 7
            z = Math.sin(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
            grass.scene.rotation.z = -treeRotationZ;
            grass.scene.position.z = -z - 2;

            grassRotationX = grassRotationAngle.current * (180 / Math.PI); //The grass rotation ON X AXIS (FORWARDS)
            grass.scene.rotation.x = grassRotationX;

            grassPositionY = Math.cos(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
            grass.scene.position.y = grassPositionY - 9;
            scene.add(grass.scene);
            angleSphereForgrass.current+=0.001;
            grassRotationAngle.current-=0.001;
        })
        }*/

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


        renderer.setSize(width, height)
        canvas
            .current
            .appendChild(renderer.domElement)
        let delta;
        const animate = () => {
            delta = clock.getDelta();
            if (switcher.current === 1) {
                mixer
                    .current
                    .update(delta)
            }
            renderer.render(scene, camera.current)
            requestAnimationFrame(animate);
        }
        animate()
        //CHECK IF MODELS ARE LOADED
        percentage.current.innerText = "0 %";
        THREE.DefaultLoadingManager.onProgress = ()=>{
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
        THREE.DefaultLoadingManager.onLoad = ()=>{
            percentage.current.innerText = "100%";
            progress_bar.current.style.width = percentage.current.innerText;
            fadeScreen.current.style.animation = "loadingDone 1s normal forwards ease-out";
            fadeScreen.current.onanimationend = ()=>setComponentLoaded(true);
        }
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
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
            </div>
            <div style={style.playButton}>
                        <Link
                            to="/game"
                            onClick={()=>window.location.assign("/game")}
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
                    <div>Portfolio: <a href="https://ignaciodiaz.netlify.app/" style={{color: "white"}} rel="noopener noreferrer" target="_blank">https://ignaciodiaz.netlify.app/</a></div>
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
                <div style={style.loading_bar} >
                    <div style={style.progress_bar} ref={progress_bar}></div>
                </div>
            </div>
        </div>
    );
}
export default HomeScreen