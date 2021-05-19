import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {useEffect} from 'react'

let style = {
    canvas:{
        minHeight: "250px",
        maxHeight: "250px", 
        minWidth: "350px",
        maxWidth: "350px",
        zIndex: "2"
    }
}

const Avatar = ({canvas, scene, color})=>{
    useEffect(()=>{ 
            //AVATAR
            let obj;
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
            let raycaster = new THREE.Raycaster();
            let mouse = new THREE.Vector2();
            let pointOfIntersection = new THREE.Vector3();
            let plane = new THREE.Plane(new THREE.Vector3(0, 0, 0.5), 0.5);
            //const helper = new THREE.PlaneHelper( plane, 10, 0xffff00 ); DEBUGGING TO SEE THE PLANE

            canvas.current.onmousemove = (e)=>{
                mouse.x = ((e.clientX - canvas.current.offsetLeft) / width) *2 -1;
                mouse.y = - ( (e.clientY - canvas.current.offsetTop) / height) * 2 + 1;
                raycaster.setFromCamera(mouse, camera);
                raycaster.ray.intersectPlane(plane, pointOfIntersection);
                obj.lookAt(pointOfIntersection);       
            }

            scene.current = new THREE.Scene();
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
            scene.current.add(light);

            scene.current.background = new THREE.Color(color.current);
                    
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
                renderer.render(scene.current, camera)
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

export default Avatar;