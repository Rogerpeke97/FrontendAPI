import {useRef, useEffect, useState} from 'react'
import * as THREE from "three";



const Game = () =>{
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
            <canvas ref={canvas}></canvas>
        </div>
    )
}

export default Game;