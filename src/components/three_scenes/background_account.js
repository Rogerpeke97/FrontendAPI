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
        const scene = new THREE.Scene();
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
            .set(-1, 2, 4);
        scene.add(light);
        scene.background = new THREE.Color(0xFFFF00);  

        //polygons
        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array([
                //Front
                0.0,0.0,0.0,//0
                0.1,0.0,0.0,//1
                0.1,0.1,0.0,//2
        ]);

        const normals = new Float32Array([
            0, 0, 1,
            0, 0, 1,
            0, 0, 1
        ]);

        const uv = new Float32Array([
            0, 0,
            1, 0,
            0, 1
        ])

        const indices = [
            0, 1, 2
        ];


        geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
        geometry.setIndex(indices);
        const material = new THREE.MeshPhongMaterial( { color: 'blue'} );
        const polygon = new THREE.Mesh( geometry, material );

        scene.add(polygon);

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