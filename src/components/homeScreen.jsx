import {useRef, useState, useEffect} from 'react'
import '../App.css';
import * as THREE from "three";

import {
    Link
  } from "react-router-dom";
let style = {
    container: {
        backgroundColor: 'transparent',
        position: 'absolute',
        minHeight: '90vh',
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
        position: 'absolute',
        minHeight: '250vh',
        minWidth: '100%',
        maxWidth: '100%',
        maxHeight: "250vh"
    },
    explanationBox:{
        backgroundColor:"rgb(80, 100, 40)",
        width: "70%",
        height: "100vh",
        left: "15%",
        position: "relative",
        boxShadow: "0 10px 20px gray, 0 6px 6px gray"
    },
    footer:{
        backgroundColor: "rgb(32, 30, 29)",
        color: 'white',
        display: 'flex',
        height: '10rem',
        position: "relative",
        width: "100%",
        top:"250vh"
    },
    playButton:{
        textDecoration: "none",
        color: "white",
        backgroundColor: "red", 
        width: "20%",
        height: "10%",
        position: "relative", 
        top: "80%",
        display:"flex",
        left:"40%"
    }
}

const HomeScreen = ()=>{
const canvas = useRef(0);
    const [scene, setScene] = useState("Scene not set");
    useEffect(()=>{
        if(scene === "Scene not set"){
        let height = canvas.current.clientHeight
        let width = canvas.current.clientWidth

        const scene = new THREE.Scene();
        //scene.add(helper) ONLY FOR DEBUGGING
        const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1500);
        const renderer = new THREE.WebGLRenderer({antialias: true});
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
        window.addEventListener('resize', ()=>{
            if(canvas.current !== null){
            width = canvas.current.clientWidth
            height = canvas.current.clientHeight
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            }
        });


        ////

        //PARTICLES
        let particleCount = 2000
        let particleDistance = 53;
        let particles = new THREE.Geometry();
        let texture = new THREE
            .TextureLoader()
            .load('snow.png');
        let pMaterial = new THREE.PointsMaterial({
            color: 'white', size: 0.3, map: texture, alphaTest: 0.1, // removes black squares
            blending: THREE.AdditiveBlending,
            transparent: false
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
                    particle.y += 0.05;
                    if (particle.y > 10) {
                        particle.y = -20
                    }
                    particleSys.geometry.verticesNeedUpdate = true;
                })
            renderer.render(scene, camera)
        })
        scene.add(particleSys)


        renderer.setSize(width, height)
        canvas.current.appendChild(renderer.domElement)
        scene.background = new THREE.Color('black')

        const animate = ()=>{
            renderer.render(scene, camera)
            window.requestAnimationFrame(animate);
        }
        animate()
        setScene("Scene set")
    }
    }, [scene])


    return(
    <div>
       <div ref={canvas} style={style.canvas}></div>
       <div style={style.container}>
           <div className="title" style={style.title}>
               <span style={{transition: 'all 1s ease-out'}} onMouseEnter={(t)=> {t.currentTarget.style.animation = 'loading 1s normal forwards ease-in-out'; t.currentTarget.style.color = "rgb(29, 146, 226)"}} onAnimationEnd={(t)=> {t.currentTarget.style.animation = 'none';  t.currentTarget.style.color = "white"}}>G</span>
               <span style={{transition: 'all 1s ease-out'}} onMouseEnter={(t)=> {t.currentTarget.style.animation = 'loading 1s normal forwards ease-in-out'; t.currentTarget.style.color = "rgb(125, 140, 40)"}} onAnimationEnd={(t)=> {t.currentTarget.style.animation = 'none';  t.currentTarget.style.color = "white"}}>a</span>
               <span style={{transition: 'all 1s ease-out'}} onMouseEnter={(t)=> {t.currentTarget.style.animation = 'loading 1s normal forwards ease-in-out'; t.currentTarget.style.color = "rgb(70, 75, 68)"}} onAnimationEnd={(t)=> {t.currentTarget.style.animation = 'none';  t.currentTarget.style.color = "white"}}>m</span>
               <span style={{transition: 'all 1s ease-out'}} onMouseEnter={(t)=> {t.currentTarget.style.animation = 'loading 1s normal forwards ease-in-out'; t.currentTarget.style.color = "rgb(29, 146, 226)"}} onAnimationEnd={(t)=> {t.currentTarget.style.animation = 'none';  t.currentTarget.style.color = "white"}}>e</span>
           </div>
           <div style={style.howToPlay}>How to play:</div>
           <div style={style.explanationBox}>
               <div>HERE GOES GRAPHIC STUFF DISPLAYING INSTRUCTIONS</div>
               <div style={style.playButton}>
                   <Link to= "/game" style={{textDecoration: "none", display: "grid", color: "white", width: "100%", heigth: "100%", justifyContent: "center", alignItems: "center"}}>Play</Link>
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