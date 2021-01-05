import {useRef, useState, useEffect} from 'react'
import '../App.css';
import * as THREE from "three";
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import TWEEN from '@tweenjs/tween.js'

import {Link} from "react-router-dom";
import {text} from '@fortawesome/fontawesome-svg-core';
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
    const [scene,
        setScene] = useState("Scene not set");
    let obj = useRef(0);
    let switcher = useRef(0)
    let mixer = useRef(0)
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
        const color = 'white';
        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light
            .position
            .set(0, 0, 3);
        scene.add(light);
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
        const loader = new GLTFLoader()
        loader.load("knight.gltf", function (object) {
            object.scene.position.x = 0;
            object.scene.position.y = -2;
            object.scene.position.z = -2;
            object
                .scene
                .scale
                .set(1.2, 1.2, 1.2)
            obj.current = object;
            mixer.current = new THREE.AnimationMixer(obj.current.scene);
            scene.add(obj.current.scene);
            animationOne();
            switcher.current = 1
        },);
        // setTimeout(()=>mixer.clipAction(obj.animations[1]).play(), 8000)// WORKS

        renderer.setSize(width, height)
        canvas
            .current
            .appendChild(renderer.domElement)
        const textu = new THREE
            .TextureLoader()
            .load("/textures/background.jpg");
        textu.minFilter = THREE.LinearFilter;
        scene.background = textu;
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
        const animationOne = () => {
            let action = mixer
                .current
                .clipAction(obj.current.animations[15])
            action.play()
            action.clampWhenFinished = true;
            setTimeout(() => {
                let action = mixer
                    .current
                    .clipAction(obj.current.animations[5])
                action.play();
                action.clampWhenFinished = true;
                let tween = new TWEEN
                    .Tween(obj.current.scene.rotation)
                    .to({
                        x: 0,
                        y: 2,
                        z: 0
                    }, 1000)
                    .onComplete(() => {
                        let tween = new TWEEN
                            .Tween(obj.current.scene.position)
                            .to({
                                x: 1,
                                y: -2,
                                z: -2
                            }, 1000)
                            .onComplete(() => {
                                action.stop();
                                animationTwo();
                            })
                            .start()
                        let animateTween = (time) => {
                            TWEEN.update(time)
                            requestAnimationFrame(animateTween)
                        }
                        requestAnimationFrame(animateTween)
                    })
                    .start()
                let animateTween = (time) => {
                    TWEEN.update(time)
                    requestAnimationFrame(animateTween)
                }
                requestAnimationFrame(animateTween)
            }, 5000)
        }
        const animationTwo = () => {
            setTimeout(() => {
                let action = mixer
                    .current
                    .clipAction(obj.current.animations[5])
                action.play();
                action.clampWhenFinished = true;
                let tween = new TWEEN
                    .Tween(obj.current.scene.rotation)
                    .to({
                        x: 0,
                        y: -1,
                        z: 0
                    }, 1000)
                    .onComplete(() => {
                        let tween = new TWEEN
                            .Tween(obj.current.scene.position)
                            .to({
                                x: -1,
                                y: -2,
                                z: -2
                            }, 2000)
                            .onComplete(() => {
                                action.stop();
                                animationThree();
                            })
                            .start()
                        let animateTween = (time) => {
                            TWEEN.update(time)
                            requestAnimationFrame(animateTween)
                        }
                        requestAnimationFrame(animateTween)
                    })
                    .start()
                let animateTween = (time) => {
                    TWEEN.update(time)
                    requestAnimationFrame(animateTween)
                }
                requestAnimationFrame(animateTween)
            }, 5000)
        }

        const animationThree = () => {
            setTimeout(() => {
                let action = mixer
                    .current
                    .clipAction(obj.current.animations[5])
                action.play();
                action.clampWhenFinished = true;
                let tween = new TWEEN
                    .Tween(obj.current.scene.rotation)
                    .to({
                        x: 0,
                        y: 2,
                        z: 0
                    }, 1000)
                    .onComplete(() => {
                        let tween = new TWEEN
                            .Tween(obj.current.scene.position)
                            .to({
                                x: 1,
                                y: -2,
                                z: -2
                            }, 2000)
                            .onComplete(() => {
                                action.stop();
                                animationTwo();
                            })
                            .start()
                        let animateTween = (time) => {
                            TWEEN.update(time)
                            requestAnimationFrame(animateTween)
                        }
                        requestAnimationFrame(animateTween)
                    })
                    .start()
                let animateTween = (time) => {
                    TWEEN.update(time)
                    requestAnimationFrame(animateTween)
                }
                requestAnimationFrame(animateTween)
            }, 5000)
        }

    }, [])

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