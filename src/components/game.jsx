import {useRef, useEffect, useState} from 'react'
import * as THREE from "three";
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Lensflare, LensflareElement } from 'three/examples/jsm/objects/Lensflare.js';
import '../App.css';
import TWEEN from '@tweenjs/tween.js';
import axios from 'axios';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {BufferGeometryUtils} from 'three/examples/jsm/utils/BufferGeometryUtils';



let style = {
    canvas: {
        display: 'grid',
        position: 'absolute',
        minHeight: '100vh',
        minWidth: '100vw',
        maxWidth: '100vw',
        maxHeight: "100vh"
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
    },
    technologies_holder: {
        display: "flex",
        maxWidth: "100%",
        maxHeight: "100%",
        height: "50px",
        width: "50px",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
    },
    technologies_images: {
        flex: "25%",
        maxHeight: "100%",
        width: "25%",
        objectFit: "contain",
        zIndex: "0",
        transform: "rotateY(180deg)"
    }
}

const Game = () => {
    const canvas = useRef(0);
    let obj = useRef(0); //KNIGHT
    let switcher = useRef(0);
    let mixer = useRef(0);
    let isRotating = useRef(0)
    let trackedKeys = useRef(0);
    let centerChar = useRef(false);
    let jumpChar = useRef(false);
    let animationsAdded = useRef(0);
    let circleAngle = useRef(0);
    let cameraAngle = useRef(-0.005);
    let camera = useRef(0);
    let knightMovementXAxis = useRef(0);
    let knightRotationZ = useRef(0);
    let trees = useRef(0);
    let angleSphereForTrees = useRef(0);
    let angleSphereForgrass = useRef(0);
    let isHeartDead = useRef(4); // each number corresponds to each heart
    let health = useRef(0);
    let scorePoints = useRef(0);
    let scoreChecker = useRef(0);
    const [componentLoaded,
        setComponentLoaded] = useState(false);
    let percentage = useRef(0);
    let fadeScreen = useRef(0);
    let hitWait = useRef(false);
    let playButton = useRef(0);
    let musicExplain = useRef(0);
    let audio = useRef(0);
    let bar1 = useRef(0);
    let bar2 = useRef(0);
    let bar3 = useRef(0);
    let progress_bar = useRef(0);
    let grass_geometry = useRef(0);
    useEffect(() => {
        if (componentLoaded === false) {
            health.current.innerText = `x${isHeartDead.current}`;
            animationsAdded.current = null;
            let height = canvas.current.clientHeight
            let width = canvas.current.clientWidth
            const scene = new THREE.Scene();
            //scene.fog = new THREE.FogExp2(0xDCDBDF, 0.10);
            //scene.add(helper) //ONLY FOR DEBUGGING
            camera.current = new THREE.PerspectiveCamera(40, width / height, 1, 1500);
            const renderer = new THREE.WebGLRenderer({antialias: true});
            let controls = new OrbitControls(camera.current, renderer.domElement);
            controls
                .target
                .set(0, 0, 0);
            camera
                .current
                .position
                .set(0, 8, 2.1);
            camera
                .current
                .rotation
                .set(-0.0057 - 0.1, 0, 0);
            let clock = new THREE.Clock();
            //BACKGROUND LIGHT
            const textureFlare = new THREE.TextureLoader();
            const textureFlare0 = textureFlare.load( 'lensflare0.png' );
			const textureFlare3 = textureFlare.load( 'lensflare3.png' );
            const addLight = (h, s, l, x, y, z)=> {
                const light = new THREE.PointLight( 0xffffff, 1.5, 2000 );
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
            addLight( 0.55, 0.9, 0.5, 5000, 0, - 1000 );
            addLight( 0.08, 0.8, 0.5, 0, 0, - 1000 );
            addLight( 0.995, 0.5, 0.9, 5000, 5000, - 1000 );
            //MOON
            /*const moonLoader = new GLTFLoader(manager)
            moonLoader.load("moon.glb", function (object) {
                object.scene.position.x = 0;
                object.scene.position.y = -90; // CIRCLE RADIUS
                object.scene.position.z = 6;
                scene.add(object.scene)
                addLight2( 176, 100, 99, 5000, 0, - 1000 );
                addLight2( 176, 100, 99, 0, -1000, 150 );
                addLight2( 176, 100, 99, 5000, 5000, - 1000 );
    
                function addLight2( h, s, l, x, y, z ) {
    
                    const light2 = new THREE.PointLight( 0xffffff, 1.5, 2000 );
                    light2.color.setHSL( h, s, l );
                    light2.position.set( x, y, z );
                    scene.add( light2 );
    
                    const lensflare = new Lensflare();
                    lensflare.addElement( new LensflareElement( textureFlareMoon, 200, 0, light2.color ) );
                    lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
                    lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
                    lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
                    lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
                    light2.add( lensflare );
                }
    
            })*/
            window.addEventListener('resize', () => {
                if (canvas.current !== null) {
                    width = canvas.current.clientWidth;
                    height = canvas.current.clientHeight;
                    renderer.setSize(width, height);
                    camera.current.aspect = width / height;
                    camera
                        .current
                        .updateProjectionMatrix();
                }
            });

            renderer.setSize(width, height)
            canvas
                .current
                .appendChild(renderer.domElement)
            const textu = new THREE
                .TextureLoader()
                .load("/textures/skyBackground.jpeg");
            textu.minFilter = THREE.LinearFilter;
            scene.background = textu;

            //TREES
            trees.current = []
            let treeRotationX;
            const treeLoader = new GLTFLoader();
            let trees_instanced_mesh;
            let geometry_merged = new THREE.BufferGeometry();
            let geometry_array = [];
            let material_tree, z_tree;
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
                    trees_instanced_mesh = new THREE.InstancedMesh(geometry_merged, material_tree, 15);
                    trees_instanced_mesh.instanceMatrix.setUsage( THREE.DynamicDrawUsage ); // will be updated every frame
                       //trees_instanced_mesh.instanceMatrix.needsUpdate = true;
                        //dummy_tree.add(tree_children[i]);
                    scene.add(trees_instanced_mesh);

                    for (let j = 0; j < 15; j++) {
                        let dummy_tree = new THREE.Object3D();
                        dummy_tree.scale.set(0.1,0.1,0.1)
                        newX = Math.floor(Math.random() * 3) - 1; //RANDOM NUMBER BETWEEN -7 AND 7 THIS CORRESPONDS TO THE x VALUE FROM THE CENTER OF THE SPHERE AND THE VALUE y IS THE RADIUS
                        zRotationNewRadius = Math.sqrt(6.9 * 6.9 - (newX * newX)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED
                        //The hypothenuse of zRotationNewRadius is the radius, newX is the adyacent and the new radius the opposite. Using trigonometry we get the new radius looking at the 
                        //sphere from the side
                        z_tree = Math.sin(angleSphereForTrees.current * (180 / Math.PI)) * zRotationNewRadius;
                        // I HAVE TO USE THE SAME FORMULA AS THE KNIGHT TO POSITION THE TREE WITH THE
                        // RIGHT ROTATION AND Y POSITION AROUND THE SPHERE TREE ROTATION SIN ANGLE =
                        // OPOSSITE OVER HYPOTHENUSE AND SIN OF angleSphereForTrees(radians) TO angle
                        treeRotationZ = Math.asin(newX / 7); //SPHERE RADIUS = 7

                        treeRotationX = -angleSphereForTrees.current * (180 / Math.PI); //The tree rotation ON X AXIS (FORWARDS)

                        //FIND Y OPOSSITE = SQUARE ROOT OF RADIUS SQUARED - ADYACER = Z SQUARED
                        treePositionY = Math.cos(angleSphereForTrees.current * (180 / Math.PI)) * zRotationNewRadius;

                        dummy_tree.position.set(newX, treePositionY, -z_tree);
                        dummy_tree.rotation.set(treeRotationX, 5, -treeRotationZ);
                        dummy_tree.updateMatrix();
                        trees_instanced_mesh.setMatrixAt( j, dummy_tree.matrix );
                        trees.current.push(dummy_tree);
                        angleSphereForTrees.current = angleSphereForTrees.current + 0.00813333333;
                }
                trees_instanced_mesh.instanceMatrix.needsUpdate = true;
                angleSphereForTrees.current = 0;
            })
            const dummy = new THREE.Object3D();
            //GRASS USED BLENDER TO CREATE LITTLE BLOCKS OF GRASS AND WIND ANIMATION
            const grassLoader = new GLTFLoader();                // eslint-disable-next-line no-loop-func
                grassLoader.load('grassColor.glb', (grass) => {
                    grass
                    .scene
                    .scale
                    .set(0.7, 0.7, 0.7);
                    grass.scene.traverse((child)=>{
                        if (child.isMesh) {
                            grass_geometry.current = child;
                        }
                    });
                    const mesh_material = new THREE.MeshStandardMaterial({color: 'green'});
                    let grass_instanced_mesh = new THREE.InstancedMesh(grass_geometry.current.geometry, mesh_material, 15);
                    scene.add(grass_instanced_mesh); 
                    let zRotationNewRadius, treeRotationZ, z, grassRotationX, grassPositionY;
                    for(let i = 0; i < 15; i++){
                        dummy.position.x = Math.floor(Math.random() * 3) - 1; 
                        zRotationNewRadius = Math.sqrt(47.61 - (dummy.position.x * dummy.position.x)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED
                        treeRotationZ = Math.asin(dummy.position.x / 6.9); //SPHERE RADIUS = 7 **I added 6.9 because I wanted the grass to be a bit inside the sphere
                        z = Math.sin(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
                        dummy.rotation.z = -treeRotationZ;
                        dummy.position.z = -z;
    
                        grassRotationX = -angleSphereForgrass.current * (180 / Math.PI); //The grass rotation ON X AXIS (FORWARDS)
                        dummy.rotation.x = grassRotationX;
    
                        grassPositionY = Math.cos(angleSphereForgrass.current * (180 / Math.PI)) * zRotationNewRadius;
                        dummy.position.y = grassPositionY;
                        angleSphereForgrass.current = angleSphereForgrass.current + 0.00813333333;
                        dummy.updateMatrix();
                        grass_instanced_mesh.setMatrixAt( i, dummy.matrix );
                    }
                    grass_instanced_mesh.instanceMatrix.needsUpdate = true;
                })


            const loader = new GLTFLoader()
            loader.load("knight.gltf", function (object) {
                object.scene.position.x = 0;
                object.scene.position.y = 7; // CIRCLE RADIUS
                object.scene.position.z = 0;
                object.scene.rotation.y = -Math.PI;
                object
                    .scene
                    .scale
                    .set(0.2, 0.2, 0.2)
                obj.current = object;
                mixer.current = new THREE.AnimationMixer(obj.current.scene);

                let action = mixer
                    .current
                    .clipAction(obj.current.animations[15]) // IDLE ANIMATION
                action.play()
                action.clampWhenFinished = true;

                scene.add(object.scene);

                switcher.current = 1;


                //EVENT LISTENER FOR FINISHED ANIMATION
                mixer
                    .current
                    .addEventListener('loop', (e) => {
                        if (e.action._clip.name === "knight_jump_up_root") {
                            let action = mixer.current._actions[2];
                            action.stop();
                            jumpChar.current = false;
                        }
                    })
                mixer
                .current
                .clipAction(obj.current.animations[0]); // JUMP ANIMATION
            },);

            // RUNNING ANIMATION AND MOVEMENT IMPLEMENTING EQUATION IN PARAMETRIC FORM TO
            // FIND THE COORDINATES OF THE CIRCLE SO THAT THE CHARACTER MOVES ALONG THE
            // SURFACE OF IT WHILE ALSO GOING UP OR DOWN DEPENDING ON WHICH PART OF THE
            // CIRCLE HE IS LOCATED AT CIRCLE VELOCITY AND ANGULAR SPEED CALCULATE ROTATION
            // ON X AXIS OF CHARACTER AND Y POSITION MOVES X QUANTITY ON X AXIS; RADIUS IS
            // NOT THE SAME FROM THE SIDES PERSPECTIVES AND WILL INFLUENCE THE RADIUS FROM
            // RUNANIMATION IT IS ALWAYS THE SAME BUT OPTICALLY IT ISNT DUE TO PERSPECTIVE
            let armorMan, xChar, zRotationNewRadius_armor, y_armor, z_armor, cameraY, cameraZ;
            let runAndAnimation = () => {
                    armorMan = obj.current.scene;

                    circleAngle.current = circleAngle.current + 0.0003;
                    cameraAngle.current = cameraAngle.current + 0.0003;

                    xChar = -circleAngle.current * (180 / Math.PI); //The character rotation ON X AXIS (FORWARDS)

                    zRotationNewRadius_armor = Math.sqrt(49 - (knightMovementXAxis.current * knightMovementXAxis.current)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED

                    knightRotationZ.current = Math.asin(knightMovementXAxis.current / 7); //ROTATION ON THE KNIGHT Z AXIS WHILE MOVING LEFT OR RIGHT () ROTATION TO THE SIDES

                    y_armor = Math.cos(circleAngle.current * (180 / Math.PI)) * zRotationNewRadius_armor;
                    z_armor = Math.sin(circleAngle.current * (180 / Math.PI)) * zRotationNewRadius_armor;
                    //KNIGHT MOVEMENTS
                    armorMan.position.set(knightMovementXAxis.current, y_armor, -z_armor);
                    armorMan.rotation.set(xChar, armorMan.rotation.y, knightRotationZ.current);
                    //CAMERA MOVEMENTS
                    cameraY = Math.cos(cameraAngle.current * (180 / Math.PI)) * 8;
                    cameraZ = Math.sin(cameraAngle.current * (180 / Math.PI)) * 8;
                    camera
                        .current
                        .position
                        .set(0, cameraY, -cameraZ);
                    camera
                        .current
                        .lookAt(armorMan.position);
                    camera
                        .current
                        .rotation
                        .set(xChar - 0.1, 0, 0);
            }

            setInterval(()=>animationsAdded.current === true ? runAndAnimation() : "", 20);

            let x, y, z, knightPosX, knightPosY, knightPosZ, object_positions;
            let characterHitByTree = (armorMan)=>{
                trees.current.forEach((tree)=>{
                    tree.updateMatrix();
                    x = tree.position.x;
                    knightPosX = armorMan.position.x;
                    y = tree.position.y
                    knightPosY = armorMan.position.y;
                    z = tree.position.z;
                    knightPosZ = armorMan.position.z;
                    object_positions = {
                        position_x: [
                            knightPosX,
                            x - 0.1,
                            x + 0.1
                        ],
                        position_y: [
                            knightPosY,
                            y - 0.5,
                            y + 0.5
                        ],
                        position_z: [
                            knightPosZ,
                            z - 0.2,
                            z + 0.2
                        ]
                    }
                    if(between(object_positions) && hitWait.current === false){
                        hitCount();
                    }
                })
            
            }
            setInterval(()=>animationsAdded.current === true ? characterHitByTree(obj.current.scene) : "", 20);

            let is_true; 
            const between = (object)=>{//check if between range, close enough to the tree
                is_true = 0;
                for(let i in object){
                    if(object[i][0] >= object[i][1] && object[i][0] <= object[i][2]){
                        is_true += 1
                    }
                }
                if(is_true === 3){
                    return true
                }
                else{
                    return false;
                }
                //return position >= min && position <= max;
            }

            let hitCount = ()=>{
                if(hitWait.current === false && isHeartDead.current > 0){
                    hitWait.current = true;
                    hitAwait();
                }
            }
            let hitAwait = ()=>{
                isHeartDead.current = isHeartDead.current - 1;
                health.current.innerText = `x${isHeartDead.current}`;
                setTimeout(()=>{
                    hitWait.current = false
                }, 1000)
            }


            let calculateTreeAngle;
            let newX;
            let zRotationNewRadius;
            let treeRotationZ;
            let treePositionY;
            let moveTrees = ()=>{
                for(let i = 0; i < 15; i++){
                    if(i === angleSphereForTrees.current){
                        calculateTreeAngle = -(trees.current[angleSphereForTrees.current].rotation.x / (180 / Math.PI));// Z POSITIONING STAYS THE SAME
                        newX = (Math.random() * (1 - (-1)) + (-1));
                        trees.current[angleSphereForTrees.current].position.x = newX;
                        zRotationNewRadius = Math.sqrt(49 - (newX * newX));
                        treeRotationZ = Math.asin(newX / 7); //SPHERE RADIUS = 7
                        trees.current[angleSphereForTrees.current].rotation.z = -treeRotationZ;
                        treePositionY = Math.cos(calculateTreeAngle * (180 / Math.PI)) * zRotationNewRadius;
                        trees.current[angleSphereForTrees.current].position.y = treePositionY;  
                        //angleSphereForTrees.current[1] += 0.01626666666;//TREE NUMBER 
                        trees.current[angleSphereForTrees.current].updateMatrix();
                        trees_instanced_mesh.setMatrixAt( angleSphereForTrees.current, trees.current[angleSphereForTrees.current].matrix );
                    }  
                    else{
                        trees.current[i].updateMatrix();
                        trees_instanced_mesh.setMatrixAt( i, trees.current[i].matrix );
                    }         
                }
                trees_instanced_mesh.instanceMatrix.needsUpdate = true;
                angleSphereForTrees.current += 1;//TREE NUMBER
                if(trees.current[angleSphereForTrees.current + 1] === undefined){
                    angleSphereForTrees.current = 0;
                }     
            }
            setInterval(()=>animationsAdded.current === true ? moveTrees() : "", 10000);

            let checkMovements = (armorMan)=>{   
                //CHARACTER MOVEMENTS KEY EVENTS
                if(JSON.stringify(trackedKeys.current) === `{"arrowLeft":true,"arrowRight":false}` && knightMovementXAxis.current > -1){
                    centerChar.current = false;
                    knightMovementXAxis.current = armorMan.position.x - 0.04;
                    armorMan.position.x = knightMovementXAxis.current;
                    //ROTATION
                    if (isRotating.current.isRotatingLeft === "start") { // y = -2.5
                        obj.current.scene.rotation.y = obj.current.scene.rotation.y += 0.01;
                        if (trackedKeys.current.arrowLeft === false) {
                            centerChar.current = true;
                        }
                        if (obj.current.scene.rotation.y >= -2.5) {
                            obj.current.scene.rotation.y = -2.5;
                            isRotating
                                .current
                                .rotateRight();
                            centerChar.current = true;
                        }
                    }
                }
                else if(JSON.stringify(trackedKeys.current) === `{"arrowLeft":false,"arrowRight":true}` && knightMovementXAxis.current < 1){
                    centerChar.current = false;
                    knightMovementXAxis.current = armorMan.position.x + 0.04;
                    armorMan.position.x = knightMovementXAxis.current;
                    //ROTATION
                    if (isRotating.current.isRotatingRight === "start") { // y = -3.5
                        obj.current.scene.rotation.y = obj.current.scene.rotation.y -= 0.01;
                        if (trackedKeys.current.arrowRight === false) {
                            centerChar.current = true;
                        }
                        if (obj.current.scene.rotation.y <= -3.5) {
                            obj.current.scene.rotation.y = -3.5;
                            isRotating
                                .current
                                .rotateLeft();
                            centerChar.current = true;
                        }
                    }
                }
            }

            setInterval(()=>animationsAdded.current === true ? checkMovements(obj.current.scene) : "", 20);

            setInterval(() => {
                if (animationsAdded.current === true) {
                    scorePoints.current = scorePoints.current + 1;
                    scoreChecker.current.innerText = scorePoints.current;
                } 
                if(isHeartDead.current === 0 && animationsAdded.current === true){
                    youLost();
                }
            }, 50); //ADDS SCORE POINTS

            let youLost = () => {
                    isHeartDead.current = 4;
                    health.current.innerText = `x${isHeartDead.current}`;
                    circleAngle.current = 0.0001;
                    cameraAngle.current = -0.005;
                    animationsAdded.current = null;
                    obj.current.scene.position.set(0, 7, 0);
                    obj.current.scene.rotation.set(0, -Math.PI, 0);
                    camera
                        .current
                        .position
                        .set(0, 8, 2.1);
                    camera
                        .current
                        .rotation
                        .set(-0.0057 - 0.1, 0, 0);
                    angleSphereForTrees.current = 0
                    axios.post('https://xentaserver.herokuapp.com/uploadscore', { // UPLOADS SCORE
                        authorization: localStorage.getItem('user'),
                        score: `${scorePoints.current}`
                    }, {
                        headers: {
                            // Overwrite Axios's automatically set Content-Type
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('user')}`
                        }
                    }).then(res => {
                        playButton.current.style.visibility = "visible";
                        playButton.current.style.animation = "popExplainBox 1s normal forwards ease-out";
                        playButton.current.onanimationend = ()=>{
                            scorePoints.current = 0;
                            scoreChecker.current.innerText = scorePoints.current;
                            playButton.current.style.animation = "";
                        }
                    }).catch(error => {
                        playButton.current.style.visibility = "visible";
                        playButton.current.style.animation = "popExplainBox 1s normal forwards ease-out";
                        playButton.current.onanimationend = ()=>{
                            scorePoints.current = 0;
                            scoreChecker.current.innerText = scorePoints.current;
                            playButton.current.style.animation = "";
                        }
                    })
            }
            // USING INTERVAL SINCE TWEENING WOULD MAKE PERFORMANCE DROP, WILL MOVE
            // CHARACTER SLIGHTLY EACH 50ms ANIMATION TO THE OTHER SIDE OF THE CIRCLE
            // SETTING THE ARROW EVENTS ARROW RIGHT MOVE RIGHT STORING THE KEY VALUES IN
            // TRACKEDKEYS DUE TO DELAY KEYDOWN EVENT AND LOOPING THROUGH CHARROTATEANDMOVE
            // TO CHECK WHERE TO MOVE THE CHARACTER BASED ON TRUE OR FALSE SEE
            // https://yojimbo87.github.io/2012/08/23/repeated-and-multiple-key-press-events
            // - without-stuttering-in-javascript.html for full understanding of delay.
            // Repeated or multiple key press events in JavaScript can cause a little pause
            // or delay which leads to stuttering behavior, for example, in games which are
            // using keyboard based navigation. This delay is probably caused by internal
            // browser timeout between key press changes. TRACKING KEYS

            trackedKeys.current = {
                arrowLeft: false, // left arrow
                arrowRight: false, // right arrow
                rightMove: function () { // ()=>{} THIS DOESNT WORK INSIDE OBJECTS :/
                    this.arrowLeft = false;
                    this.arrowRight = true;
                },
                leftMove: function () {
                    this.arrowLeft = true;
                    this.arrowRight = false;
                }
            }
            //IS ROTATING TRACKER
            isRotating.current = {
                isRotatingRight: "stop",
                isRotatingLeft: "stop",
                rotateRight: function () {
                    this.isRotatingRight = "start";
                    this.isRotatingLeft = "stop";
                },
                rotateLeft: function () {
                    this.isRotatingRight = "stop";
                    this.isRotatingLeft = "start";
                }
            }

            window.addEventListener('keydown', (e) => {
                if (e.key === "ArrowRight" && trackedKeys.current["arrowRight"] === false) {
                    trackedKeys
                        .current
                        .rightMove();
                    isRotating
                        .current
                        .rotateRight();
                } else if (e.key === "ArrowLeft" && trackedKeys.current["arrowLeft"] === false) {
                    trackedKeys
                        .current
                        .leftMove();
                    isRotating
                        .current
                        .rotateLeft();
                } else if (e.key === " " && jumpChar.current === false) {
                    jumpChar.current = true;
                }

            })
            window.addEventListener('keyup', (e) => {
                if (e.key === "ArrowRight") {
                    trackedKeys.current.arrowRight = false;
                    centerChar.current = true;
                } else if (e.key === "ArrowLeft") {
                    trackedKeys.current.arrowLeft = false;
                    centerChar.current = true;
                }
            })

            //ROTATIOn CENTER CHARACTER
            let centerCharFunction = () => {
                if (centerChar.current === true) {
                    let tweenRotateCenter = new TWEEN
                        .Tween(obj.current.scene.rotation)
                        .to({
                            y: -3, // FROM -3 TO -3
                        }, 50)
                        .onComplete(() => {
                            TWEEN.remove(tweenRotateCenter);
                            cancelAnimationFrame(animateTweenRotateCenter);
                            centerChar.current = false;
                        })
                        .start()
                    let animateTweenRotateCenter = (time) => {
                        TWEEN.update(time)
                        requestAnimationFrame(animateTweenRotateCenter)
                    }
                    animateTweenRotateCenter();
                }
            }
            setInterval(() => centerCharFunction(), 50);

            //JUMP ANIMATION
            let jump = () => {
                if (jumpChar.current === true && mixer.current._actions[2] !== undefined) {
                    let action = mixer.current._actions[2] // JUMP ANIMATION
                    action.play();
                }
            }
            setInterval(() => jump(), 20);

            //TRYING A SPHERE
            let floorTexture = new THREE
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
            const geometrySphere = new THREE.SphereBufferGeometry(7, 50, 50);
            const materialSphere = new THREE.MeshPhongMaterial({map: floorTexture});
            const sphere = new THREE.Mesh(geometrySphere, materialSphere);
            sphere.position.set(0, 0, 0);
            sphere.rotation.z = 1;
            scene.add(sphere);
            
            //const geometry = new THREE.BufferGeometry();
            // create a simple square shape. We duplicate the top left and bottom right
            // vertices because each vertex needs to appear once per triangle.
            /*const array_to_transform = [
                0.0,0.0,0.0,//Front
                0.1,0.0,0.0,
                0.1,0.1,0.0,
                0.1,0.1,0.0,
                0.0,0.1,0.0,
                0.0,0.0,0.0
            ]
            const increase_vertex_count = (arr)=>{//I reduce the size of the vertex points and increase them along the x axis progressively
                // until i reach x = 0.8 and y = 0.8
                let new_arr = [
                    0.0,0.0,0.0,//Front
                    0.1,0.0,0.0,
                    0.1,0.1,0.0,
                    0.1,0.1,0.0,
                    0.0,0.1,0.0,
                    0.0,0.0,0.0
                ];
                let count = 0;
                let increase_y = 0;
                for(let j = 0; j < 63; j++){
                    if(count >= 0.7){
                        increase_y+=0.1;
                        count = -0.1;
                    }
                    for(let i = 0; i < arr.length; i+=3){
                            console.log(count);
                            new_arr.push(
                                arr[i] + 0.1 + count, arr[i+1] + increase_y, arr[i+2] 
                            )
                    }
                    count += 0.1;
                }
                return new_arr;
            }
            //To rotate the face by 90 degrees, we need to multiply:
            // [
            //      x*cos(angle) - y*sin(angle) ==> x
            //      x*sin(angle) + y*cos(angle) ==> y
            // ] when I want to rotate the front face to bottom I use the z value instead of x
            const transform_matrix = (arr, size, angle)=>{
                let new_arr = [];
                angle = angle * Math.PI/180;
                //FRONT TO LEFT 
                for(let j = 0; j < 2; j++){
                    for(let i = 2; i < arr.length; i+=3){
                        if(j === 0){
                            new_arr.push(
                                arr[i-2] * Math.cos(angle) - arr[i] * Math.sin(angle), arr[i-1],
                                arr[i-2] * Math.sin(angle) + arr[i] * Math.cos(angle)
                            )
                        }
                        else{
                            new_arr.push(
                                arr[i-2] * Math.cos(angle) - arr[i] * Math.sin(angle) + size, arr[i-1],
                                arr[i-2] * Math.sin(angle) + arr[i] * Math.cos(angle)
                            )
                        }
                    }
                }
                for(let j = 0; j < 2; j++){//arr[i] = z; arr[i-2] = x
                    for(let i = 2; i < arr.length; i+=3){
                        if(j === 0){
                            new_arr.push(
                                arr[i-2], arr[i-1] * Math.cos(angle) - arr[i] * Math.sin(angle) + size,
                                arr[i-1] * Math.sin(angle) + arr[i] * Math.cos(angle)
                            ); 
                        }
                        else{
                            new_arr.push(
                                arr[i-2], arr[i-1] * Math.cos(angle) - arr[i] * Math.sin(angle),
                                arr[i-1] * Math.sin(angle) + arr[i] * Math.cos(angle)
                            );  
                        }
                    }
                }//BOTTOM
                for(let j = 0; j < 2; j++){
                    for(let i = 2; i < arr.length; i+=3){
                        if(j === 0){
                            new_arr.push(
                                arr[i-2], arr[i-1],
                                arr[i] + size
                            ); 
                        }
                        else{
                            new_arr.push(
                                arr[i-2], arr[i-1],
                                arr[i]
                            );  
                        }
                    }
                }//BACK
                return new_arr;
            }


            /*const vertices= new Float32Array([
                0.0,0.0,0.0,//Front
                1.0,0.0,0.0,
                1.0,1.0,0.0,
                1.0,1.0,0.0,
                0.0,1.0,0.0,
                0.0,0.0,0.0,

                0.0,0.0,0.0,//Left
                0.0,0.0,1.0,
                0.0,1.0,1.0,
                0.0,1.0,1.0,
                0.0,1.0,0.0,
                0.0,0.0,0.0,
                
                0.0,0.0,1.0,//Back
                1.0,0.0,1.0,
                1.0,1.0,1.0,
                1.0,1.0,1.0,
                0.0,1.0,1.0,
                0.0,0.0,1.0,

                1.0,0.0,0.0,//Right
                1.0,0.0,1.0,
                1.0,1.0,1.0,
                1.0,1.0,1.0,
                1.0,1.0,0.0,
                1.0,0.0,0.0,

                0.0,1.0,0.0,//Top
                1.0,1.0,0.0,
                1.0,1.0,1.0,
                1.0,1.0,1.0,
                0.0,1.0,1.0,
                0.0,1.0,0.0,

                0.0,0.0,0.0,//Bottom
                1.0,0.0,0.0,
                1.0,0.0,1.0,
                1.0,0.0,1.0,
                0.0,0.0,1.0,
                0.0,0.0,0.0

            ]);*/ 

            //const vertices= new Float32Array(transform_matrix(increase_vertex_count(array_to_transform), 0.8, 90));
            
            // itemSize = 3 because there are 3 values (components) per vertex
            /*geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
            //geometry.setAttribute( 'normals', new THREE.BufferAttribute( new Uint32Array( vertexNormals ), 1 ) );
            const material = new THREE.MeshStandardMaterial( { color: 'blue',  side: THREE.DoubleSide} );
            const mesh = new THREE.Mesh( geometry, material );
            console.log(geometry.attributes.position);
            /*for (let i = 0; i < geometry.attributes.position.array.length; i += 3) {
                const v = new THREE.Vector3(geometry.attributes.position.array[i], geometry.attributes.position.array[i + 1], geometry.attributes.position.array[i + 2]).normalize();
                geometry.attributes.position.array[i] = v.x
                geometry.attributes.position.array[i + 1] = v.y
                geometry.attributes.position.array[i + 2] = v.z
            }
            scene.add(mesh);*/
  

            const animate = () => {
                let delta = clock.getDelta();
                if (switcher.current === 1) {
                    mixer
                        .current
                        .update(delta)
                }
                renderer.render(scene, camera.current);
                requestAnimationFrame(animate);
            }
            animate()
            //CHECK IF MODELS ARE LOADED
            percentage.current.innerText = "0 %";
        THREE.DefaultLoadingManager.onProgress = ()=>{
                if(parseInt(percentage.current.innerText.slice(0, -2)) < 100){
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
    }
    })
    
    let addMusicAnimation = ()=>{
        if(bar1.current.style.animation === ""){
            bar1.current.style.animation = "increaseHeightBar1 1.5s linear infinite";
            bar2.current.style.animation = "increaseHeightBar1 1s linear infinite";
            bar3.current.style.animation = "increaseHeightBar1 0.75s linear infinite";
        }
        else{
            bar1.current.style.animation = "";
            bar2.current.style.animation = "";
            bar3.current.style.animation = "";                  
        }
    }
    return (
        <div>
            <div>
                <div style={{
                    position: "absolute", minHeight: "10%", maxHeight: "10%",
                     minWidth: "200px", maxWidth: "200px", display: "flex",
                     top: "6.5rem", zIndex: "5"
                     }}>
                         <div style={style.technologies_holder}>
                            <img src="/heart.svg" alt="Threejs" style={style.technologies_images}></img>
                         </div>
                         <div ref={health} style={{width: "50px", height: "50px", display: "grid", fontSize: "120%", color: "white", textAlign: "center", alignItems: "center"}}></div>
                     </div>
                <div style={{
                    position: "absolute", minHeight: "10%", maxHeight: "10%",
                     minWidth: "200px", maxWidth: "20%", right: "0%",
                     top: "6.5rem",  zIndex: "5", display: "flex", color: "white",
                     alignItems: "center", textAlign: "center", fontSize: "200%", textShadow: "11px 11px 6px rgba(150, 150, 150, 1)"
                     }}>
                    <div style={{flex: "1"}}>Score:</div>
                    <div ref={scoreChecker}style={{flex: "1"}}></div>
                </div>
            </div>
            <div style={style.canvas} ref={canvas}></div>
            <div style={{position: "absolute", display: "grid", textAlign: "center", height: "125px", width: "200px",
            left: "50%", top: "50%", marginLeft: "-100px", marginTop: "-67.5px", background: "brown", color: "white", zIndex: "2",
            borderRadius: "7px",
            boxShadow: "0px 10px 21px 0px rgba(50, 50, 50, 0.75)", alignContent: "center", transition: "all 0.5s ease-out", fontWeight: "bold",
            cursor: "pointer"
            }}
            onMouseEnter = {(e)=>{
                e.currentTarget.style.transform = 'scale(1.05, 1.05)';
                e.currentTarget.style.boxShadow = '0px 3px 27px 0px rgba(50, 50, 50, 1)';
            }} 
            onMouseLeave={(e)=>{
                e.currentTarget.style.transform = 'scale(1, 1)';
                e.currentTarget.style.boxShadow = '0px 10px 21px 0px rgba(50, 50, 50, 0.75)';
            }}
            ref={playButton} onClick={()=> {
                if(animationsAdded.current === false || animationsAdded.current === null){
                playButton.current.style.animation = "loadingDone 1s normal forwards ease-out";
                playButton.current.onanimationend = ()=>{
                    playButton.current.style.visibility = "hidden";
                    animationsAdded.current = true/*SETS RUNANDANIMATION*/
                    let action = mixer
                            .current
                            .clipAction(obj.current.animations[14]) // RUN ANIMATION
                    action.play()
                    action.clampWhenFinished = true;
                }
                }
                }}>PLAY!</div>
                <div className= "musicPlayer" style={{display:"flex", position: "fixed", height: "50px", width:"4%", left: "95%", top:"75%", zIndex: "4", background: "transparent", borderRadius: "50%", transform: "rotate3d(0, 0, 1, 180deg)"}} onClick={()=>{
                    let audio1 = audio.current;
                    addMusicAnimation();
                    if (audio1.duration > 0 && !audio1.paused) {
                        audio1.pause();
                        //Its playing...do your job
                    } else {
                        audio1.play();
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
                <audio src="kujaTheme.mp3" ref={audio} loop></audio>            
            <div className= "loadingScreen" ref={fadeScreen} style={componentLoaded ? {display: "none"} : {display: "grid"}}>
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
                <div className= "messages">{"Loading your experience..."}</div>
                <div style={style.loading_bar} >
                    <div style={style.progress_bar} ref={progress_bar}></div>
                </div>
            </div>
        </div>
    )
}

export default Game;