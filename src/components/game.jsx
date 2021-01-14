import {useRef, useEffect, useState} from 'react'
import * as THREE from "three";
//import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';


import TWEEN from '@tweenjs/tween.js';


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
    let animationsAdded = useRef(0);
    let circleAngle = useRef(0);
    let charAngle = useRef(0);
    let cameraAngle = useRef(-0.005);
    let knightMovementXAxis = useRef(0);
    let knightRotationX = useRef(0);
    let knightRotationZ = useRef(0);
    let trees = useRef(0);
    let angleSphereForTrees = useRef(0);
    let treeRotationAngle = useRef(0);
    let bushes = useRef(0);
    useEffect(() => {
        if (scene === "Scene not set") {
            let height = canvas.current.clientHeight
            let width = canvas.current.clientWidth
            const scene = new THREE.Scene();
            //scene.add(helper) ONLY FOR DEBUGGING
            const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1500);
            const renderer = new THREE.WebGLRenderer();
            /*let controls = new OrbitControls(camera, renderer.domElement);
            controls
                .target
                .set(0, 0, 0)*/
            camera
                .position
                .set(0, 8, 2);
            const color = 'yellow';
            const colorMoon = 'white';
            let clock = new THREE.Clock();
            const intensity = 0.4;
            //BACKGROUND LIGHT
            const hemiLight = new THREE.HemisphereLight(0x0000ff, 0x00ff00, 0.6);
            hemiLight
                .position
                .set(0, 500, -2);
            scene.add(hemiLight);

            const light = new THREE.DirectionalLight(color, intensity);
            light
                .position
                .set(0, 4, -1);
            scene.add(light);
            const light2 = new THREE.DirectionalLight(colorMoon, intensity);
            light2
                .position
                .set(0, -5, -1);
            scene.add(light2);
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
            const textu = new THREE
                .TextureLoader()
                .load("/textures/skyBackground.jpeg");
            textu.minFilter = THREE.LinearFilter;
            scene.background = textu;


            //TREES
            //FOR DEBUGGING DEACTIVATED
            trees.current = []
            const treeLoader = new GLTFLoader();
            for(let i = 0; i < 1; i++){
                for(let j = 0; j < 25; j++){
                treeLoader.load( '/textures/tree.gltf', ( tree )=>{
                    tree.scene.position.x = Math.floor(Math.random() * 15) - 7; //RANDOM NUMBER BETWEEN -10 AND 10
                    tree.scene.scale.set(0.04, 0.04, 0.04);
                    let zRotationNewRadius = Math.sqrt(49 - (tree.scene.position.x * tree.scene.position.x)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED
                    let z = Math.sin(angleSphereForTrees.current * (180 / Math.PI)) * zRotationNewRadius;
                    tree.scene.position.z = -z
                    // I HAVE TO USE THE SAME FORMULA AS THE KNIGHT TO POSITION THE TREE WITH THE RIGHT ROTATION AND Y POSITION
                    // AROUND THE SPHERE
                    // TREE ROTATION SIN ANGLE = OPOSSITE OVER HYPOTHENUSE
                    let treeRotationZ = Math.asin(tree.scene.position.x / 7); //SPHERE RADIUS = 7
                    tree.scene.rotation.z = -treeRotationZ;
                    let treeRotationX = treeRotationAngle.current * (180 / Math.PI); //The tree rotation ON X AXIS (FORWARDS)
                    tree.scene.rotation.x = treeRotationX;

                    //FIND Y OPOSSITE = SQUARE ROOT OF RADIUS SQUARED - ADYACER = Z SQUARED
                    let treePositionY = Math.cos(angleSphereForTrees.current * (180 / Math.PI)) * zRotationNewRadius;
                    tree.scene.position.y = treePositionY;
                    trees.current.push(tree);
                    scene.add(tree.scene);
                    angleSphereForTrees.current+=0.28;
                    treeRotationAngle.current-=0.28;
                })
            }
            }

            //BUSHES
            //CREDITS TO ELITEMASTER from cgtrader.com
            bushes.current = []
            const bushLoader = new GLTFLoader();
            for(let i = 0; i < 1; i++){
                for(let j = 0; j < 100; j++){
                    let bushTexture = new THREE
                    .TextureLoader()
                    .load('leaftexture.png');
                    let geometrySphere = new THREE.SphereGeometry(0.05, 10, 10);
                    let materialSphere = new THREE.MeshPhongMaterial({map: bushTexture, alphaTest: 0.1,
                        color: 'green', // removes black squares
                        blending: THREE.NormalBlending,
                        transparent: true});
                    let bush = new THREE.Mesh(geometrySphere, materialSphere);
                    bush.position.x = Math.floor(Math.random() * 15) - 7; //RANDOM NUMBER BETWEEN -10 AND 10
                    let zRotationNewRadius = Math.sqrt(49 - (bush.position.x * bush.position.x)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED
                    let z = Math.sin(angleSphereForTrees.current * (180 / Math.PI)) * zRotationNewRadius;
                    bush.position.z = -z
                    // I HAVE TO USE THE SAME FORMULA AS THE KNIGHT TO POSITION THE TREE WITH THE RIGHT ROTATION AND Y POSITION
                    // AROUND THE SPHERE
                    // TREE ROTATION SIN ANGLE = OPOSSITE OVER HYPOTHENUSE
                    let bushRotationZ = Math.asin(bush.position.x / 7); //SPHERE RADIUS = 7
                    bush.rotation.z = -bushRotationZ - 1.57; // PI / 2
                    let bushRotationX = treeRotationAngle.current * (180 / Math.PI); //The bush rotation ON X AXIS (FORWARDS), REUSING TREE ROTATION SINCE IT ROTATES THE SAME AMOUNT ON X
                    bush.rotation.x = bushRotationX;

                    //FIND Y OPOSSITE = SQUARE ROOT OF RADIUS SQUARED - ADYACER = Z SQUARED
                    let bushPositionY = Math.cos(angleSphereForTrees.current * (180 / Math.PI)) * zRotationNewRadius;
                    bush.position.y = bushPositionY + 0.05;
                    bushes.current.push(bush);
                    scene.add(bush);
                    angleSphereForTrees.current+=0.07;
                    treeRotationAngle.current-=0.07;
                /*bushLoader.load( 'bush.glb', ( bush )=>{
                    bush.scene.position.x = Math.floor(Math.random() * 15) - 7; //RANDOM NUMBER BETWEEN -10 AND 10
                    //bush.scene.scale.set(0.02, 0.02, 0.02);
                    let zRotationNewRadius = Math.sqrt(49 - (bush.scene.position.x * bush.scene.position.x)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED
                    let z = Math.sin(angleSphereForTrees.current * (180 / Math.PI)) * zRotationNewRadius;
                    bush.scene.position.z = -z
                    // I HAVE TO USE THE SAME FORMULA AS THE KNIGHT TO POSITION THE TREE WITH THE RIGHT ROTATION AND Y POSITION
                    // AROUND THE SPHERE
                    // TREE ROTATION SIN ANGLE = OPOSSITE OVER HYPOTHENUSE
                    let bushRotationZ = Math.asin(bush.scene.position.x / 7); //SPHERE RADIUS = 7
                    bush.scene.rotation.z = -bushRotationZ;
                    let bushRotationX = treeRotationAngle.current * (180 / Math.PI); //The bush rotation ON X AXIS (FORWARDS), REUSING TREE ROTATION SINCE IT ROTATES THE SAME AMOUNT ON X
                    bush.scene.rotation.x = bushRotationX;

                    //FIND Y OPOSSITE = SQUARE ROOT OF RADIUS SQUARED - ADYACER = Z SQUARED
                    let bushPositionY = Math.cos(angleSphereForTrees.current * (180 / Math.PI)) * zRotationNewRadius;
                    bush.scene.position.y = bushPositionY;
                    bushes.current.push(bush.scene);
                    scene.add(bush.scene);
                })*/
            }
            }








            const loader = new GLTFLoader()
            loader.load("knight.gltf", function (object) {
                object.scene.position.x = 0;
                object.scene.position.y = 7; // CIRCLE RADIUS
                object.scene.position.z = 0;
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
                //CHECK CHARACTER SIZE
                let box = new THREE
                    .Box3()
                    .setFromObject(obj.current.scene);
                console.log(box.min, box.max, box.getSize());

                switcher.current = 1

                setTimeout(() => {
                    let action = mixer
                        .current
                        .clipAction(obj.current.animations[14]) // RUN ANIMATION
                    action.play()
                    action.clampWhenFinished = true;
                    animationsAdded.current = true; // SETS RUNANDANIMATION
                }, 10000)
                mixer
                    .current
                    .clipAction(obj.current.animations[0]); // JUMP ANIMATION

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
            },);

            // RUNNING ANIMATION AND MOVEMENT IMPLEMENTING EQUATION IN PARAMETRIC FORM TO
            // FIND THE COORDINATES OF THE CIRCLE SO THAT THE CHARACTER MOVES ALONG THE
            // SURFACE OF IT WHILE ALSO GOING UP OR DOWN DEPENDING ON WHICH PART OF THE
            // CIRCLE HE IS LOCATED AT CIRCLE VELOCITY AND ANGULAR SPEED CALCULATE ROTATION
            // ON X AXIS OF CHARACTER AND Y POSITION MOVES X QUANTITY ON X AXIS; RADIUS IS
            // NOT THE SAME FROM THE SIDES PERSPECTIVES AND WILL INFLUENCE THE RADIUS FROM
            // RUNANIMATION IT IS ALWAYS THE SAME BUT OPTICALLY IT ISNT DUE TO PERSPECTIVE

            let runAndAnimation = () => {
                switch (animationsAdded.current) {
                    case true:
                        let armorMan = obj.current.scene;
                        // console.log(armorMan.scene.position); // x:0, y:0, z:4; CALCULATE POSITION IN
                        // SPHERE/GOTTA ADJUST THE RADIUS OF THE CIRCLE AS HE MOVES LEFT OR RIGHT SPHERE
                        // ARMOR MAN WHEN z GETS TO 7 IT BREAKS THE SQRT FUNCTION
                        circleAngle.current = circleAngle.current + 0.0001;
                        charAngle.current = charAngle.current - 0.0001;
                        cameraAngle.current = cameraAngle.current + 0.0001;
                        if (circleAngle.current > 6.999) {
                            circleAngle.current = 0.0001;
                            charAngle.current = -0.0001;
                        }

                        //Y ROTATION FROM CHARACTER CHAR SIZE Y = 0.5805655952 = R = 0.2902827976
                        let xChar = charAngle.current * (180 / Math.PI); //The character rotation ON X AXIS (FORWARDS)

                        let zRotationNewRadius = Math.sqrt(49 - (knightMovementXAxis.current * knightMovementXAxis.current)); // NEW RADIUS IF LOOKED FROM THE SIDE, LOOKS AS IF THE RADIUS DECREASED

                        knightRotationZ.current = Math.asin(knightMovementXAxis.current / 7); //ROTATION ON THE KNIGHT Z AXIS WHILE MOVING LEFT OR RIGHT () ROTATION TO THE SIDES

                        let y = Math.cos(circleAngle.current * (180 / Math.PI)) * zRotationNewRadius;
                        let z = Math.sin(circleAngle.current * (180 / Math.PI)) * zRotationNewRadius;
                        //KNIGHT MOVEMENTS
                        knightRotationX.current = xChar;
                        armorMan.position.y = y;
                        armorMan.rotation.x = xChar;
                        armorMan.rotation.z = knightRotationZ.current;
                        armorMan.position.z = -z;
                        //CAMERA MOVEMENTS
                        let cameraY = Math.cos(cameraAngle.current * (180 / Math.PI)) * 8;
                        let cameraZ = Math.sin(cameraAngle.current * (180 / Math.PI)) * 8;
                        camera
                            .position
                            .set(0, cameraY, -cameraZ);
                        camera.lookAt(armorMan.position);
                        camera
                            .rotation
                            .set(xChar - 0.1, 0, 0);

                        //CHARACTER MOVEMENTS KEY EVENTS
                        switch (JSON.stringify(trackedKeys.current)) {
                            case `{"arrowLeft":true,"arrowRight":false}`: //MOVE LEFT
                                centerChar.current = false;
                                console.log("MOVING LEFT");
                                knightMovementXAxis.current = armorMan.position.x - 0.01;
                                armorMan.position.x = knightMovementXAxis.current;
                                //ROTATION
                                if (isRotating.current.isRotatingLeft === "start") {
                                    let tweenRotateLeft = new TWEEN
                                        .Tween(obj.current.scene.rotation)
                                        .to({
                                            y: -2.5, // FROM -3 TO -2.5
                                        }, 50)
                                        .onComplete(() => {
                                            TWEEN.remove(tweenRotateLeft);
                                            isRotating
                                                .current
                                                .rotateRight();
                                            centerChar.current = true;
                                        })
                                        .start()
                                    let animateTweenRotateLeft = (time) => {
                                        if (trackedKeys.current.arrowLeft === false) {
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
                                knightMovementXAxis.current = armorMan.position.x + 0.01;
                                armorMan.position.x = knightMovementXAxis.current;
                                //ROTATION
                                if (isRotating.current.isRotatingRight === "start") {
                                    let tweenRotateRight = new TWEEN
                                        .Tween(obj.current.scene.rotation)
                                        .to({
                                            y: -3.5, // FROM -3 TO -3.5
                                        }, 50)
                                        .onComplete(() => {
                                            TWEEN.remove(tweenRotateRight);
                                            isRotating
                                                .current
                                                .rotateLeft();
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
                        break;
                    default:
                }
            }
            setInterval(() => runAndAnimation(), 5); // USING INTERVAL SINCE TWEENING WOULD MAKE PERFORMANCE DROP, WILL MOVE CHARACTER SLIGHTLY EACH 50ms
            // ANIMATION TO THE OTHER SIDE OF THE CIRCLE SETTING THE ARROW EVENTS ARROW
            // RIGHT MOVE RIGHT STORING THE KEY VALUES IN TRACKEDKEYS DUE TO DELAY KEYDOWN
            // EVENT AND LOOPING THROUGH CHARROTATEANDMOVE TO CHECK WHERE TO MOVE THE
            // CHARACTER BASED ON TRUE OR FALSE SEE
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
                    console.log("spacebar pressed")
                    jumpChar.current = true;
                }

            })
            window.addEventListener('keyup', (e) => {
                if (e.key === "ArrowRight") {
                    trackedKeys.current.arrowRight = false;
                } else if (e.key === "ArrowLeft") {
                    trackedKeys.current.arrowLeft = false;
                }
            })

            /*MOVING
            let charRotateAndMove = () => {

            }
            setInterval(() => charRotateAndMove(), 5);*/

            //ROTATIOn CENTER CHARACTER
            let centerCharFunction = () => {
                if (centerChar.current === true) {
                    let tweenRotateCenter = new TWEEN
                        .Tween(obj.current.scene.rotation)
                        .to({
                            y: -3, // FROM -3 TO -3
                        }, 50)
                        .onComplete(() => {
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
                .load('frozengrass.jpg', () => {
                    floorTexture.wrapS = THREE.RepeatWrapping;
                    floorTexture.wrapT = THREE.RepeatWrapping;
                    floorTexture
                        .repeat
                        .set(50, 50);
                });
            let floorBump = new THREE
                .TextureLoader()
                .load('sunbump.png', () => {
                    floorTexture.wrapS = THREE.RepeatWrapping;
                    floorTexture.wrapT = THREE.RepeatWrapping;
                    floorTexture
                        .repeat
                        .set(50, 50);
                });
            let geometrySphere = new THREE.SphereGeometry(7, 50, 50);
            let materialSphere = new THREE.MeshPhongMaterial({map: floorTexture, alphaTest: 0.1, bumpMap: floorBump, bumpScale: 0.01});
            let sphere = new THREE.Mesh(geometrySphere, materialSphere);
            sphere.position.x = 0;
            sphere.position.y = 0;
            sphere.position.z = 0;
            scene.add(sphere);

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