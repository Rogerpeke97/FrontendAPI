import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {useEffect, useRef, useState} from 'react'

let style = {
    canvas:{
        minHeight: "1080px",
        maxHeight: "1080px", 
        minWidth: "100%",
        maxWidth: "100%",
        position: "absolute",
        zIndex: "0"
    }
}

const BackgroundAccount = ()=>{
    const canvas = useRef(null);
    useEffect(()=>{ 
        //Background
        let obj;
        const scene = new THREE.Scene();
        const loader = new OBJLoader();
        loader.load( 'earth.obj', ( object )=>{
            object.position.x = 0;
            object.position.y = -1.5;
            object.position.z = -4;
            obj = object;
            scene.current.add( obj );
        } );
        let height = canvas.current.clientHeight
        let width = canvas.current.clientWidth
        //const helper = new THREE.PlaneHelper( plane, 10, 0xffff00 ); DEBUGGING TO SEE THE PLANE

        //scene.add(helper) ONLY FOR DEBUGGING
        const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1500);
        const renderer = new THREE.WebGLRenderer({antialias: true});
        camera
            .position
            .set(0, 0, 4);
        const color_scene = 'white';
        const intensity = 1;
        const light = new THREE.DirectionalLight(color_scene, intensity);
        light
            .position
            .set(0, 0, 3);
        scene.add(light);
        scene.background = new THREE.Color(0xFFFF00);  

        //PARTICLES
        let particleCount = 2600; // There is one more due to the float being slightly above 0 
        let particles = new THREE.BufferGeometry();

        let pMaterial = new THREE.PointsMaterial({
            color: 'white', size: 0.1, alphaTest: 0.1, // removes black squares
            blending: THREE.CustomBlending,
            transparent: false
        });

        let positions = [];

        for (let i = 3; i > -3; i-= 0.2) {
            let count = -5;
            for(let j = 0; j < 10; j+=0.2){
                let posX = count;
                let posY = i;
                let posZ = 0;
                positions.push(posX, posY, posZ);
                count+=0.2;   
            }
        }


        particles.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        // create the particle system
        let particleSys = new THREE.Points(particles, pMaterial);
        particleSys.receiveShadow = true;
        particleSys.castShadow = true;
        particleSys.name = 'particleSys';

        console.log(particleSys);

        scene.add(particleSys);


        window.addEventListener('resize', ()=>{
            if(canvas.current !== null){
            width = canvas.current.clientWidth
            height = canvas.current.clientHeight
            renderer.setSize(width, height);
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
        }
        });
        renderer.setSize(width, height)
        canvas.current.appendChild(renderer.domElement)

        const animate = ()=>{
            renderer.render(scene, camera)
            window.requestAnimationFrame(animate);
        }
        animate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return(
        <div style={style.canvas} ref={canvas}>
        </div>
    )
}

export default BackgroundAccount;