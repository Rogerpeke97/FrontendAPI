import * as THREE from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import {useEffect, useRef, useState} from 'react';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';


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

const BackgroundAccount = ({dummy_polygons, polygons_states})=>{
    const canvas = useRef(null);
    useEffect(()=>{ 
        //Background
        const scene = new THREE.Scene();
        let height = canvas.current.clientHeight;
        let width = canvas.current.clientWidth;
        //const helper = new THREE.PlaneHelper( plane, 10, 0xffff00 ); DEBUGGING TO SEE THE PLANE

        //scene.add(helper) ONLY FOR DEBUGGING
        const camera = new THREE.PerspectiveCamera(40, width / height, 1, 1500);
        const renderer = new THREE.WebGLRenderer({antialias: true});
        camera
            .position
            .set(0, 0, 4);

        let controls = new OrbitControls(camera, renderer.domElement);
        controls
            .target
            .set(0, 0, 0);
        const color_scene = 'white';
        const intensity = 0.5;
        const light = new THREE.DirectionalLight(color_scene, intensity);
        light.position.set(0, 10, 25);
        light.target.position.set(0, 0, 0);
        scene.add(light);

        //CREATE AND TRANSLATE MORE POLYGONS
        // const increase_vertex_count = (arr)=>{//I reduce the size of the vertex points and increase them along the x axis progressively
        //     // until i reach x = 0.8 and y = 0.8
        //     let new_arr = [
        //         //Front
        //         0.0,0.0,0.0,//0
        //         0.1,0.0,0.0,//1
        //         0.1,0.1,0.0//2
        //     ];
        //     let count = 0;
        //     let increase_y = 0;
        //     for(let j = 0; j < 63; j++){
        //         if(count >= 0.7){
        //             increase_y+=0.1;
        //             count = -0.1;
        //         }
        //         for(let i = 0; i < arr.length; i+=3){
        //             new_arr.push(
        //                 arr[i] + 0.1 + count, arr[i+1] + increase_y, arr[i+2] 
        //             )
        //         }
        //         count += 0.1;
        //     }
        //     return new_arr;
        // }

        //ROTATE POLYGONS
        let angle = 30 * Math.PI/180;
        let dummy, rotation;
        // const rotate_polygon = (dummy /*size*/, dummy_number, angle)=>{
        //     // let instanced_mesh_to_modify;
        //     let rotation;
        //     if(dummy_number >= 1350){
        //         instanced_mesh_to_modify = polygon_2_instanced_mesh;
        //         dummy_number_minus = 1350;
        //     }
        //     if(dummy_number <= 1350){
        //         instanced_mesh_to_modify = polygon_instanced_mesh;
        //     }
        //     dummy = dummy[dummy_number];
        //     angle = angle * Math.PI/180;
        //     if(dummy.rotation.y <= -angle){
        //         polygons_states.current[dummy_number] = 'rotate_back';
        //     }
        //     if(dummy.rotation.y >= 0){
        //         polygons_states.current[dummy_number] = 'rotate';
        //     }
        //     if(polygons_states.current[dummy_number] === 'rotate_back'){
        //         rotation = 0.01;
        //     }
        //     if(polygons_states.current[dummy_number] === 'rotate'){
        //         rotation = -0.01;
        //     }
        //     //FRONT TO LEFT 
        //     dummy.rotation.y = dummy.rotation.y + rotation;  
        //     dummy.updateMatrix();
        //     instanced_mesh_to_modify.setMatrixAt( dummy_number - dummy_number_minus, dummy.matrix ); // EL PROBLEMA ES EL DUMMY NUMBER, SON 1350 POR instanced mesh, POR LO TanTO USAR 2700 NO MODIFICA NADA
        // }
 
        const render = () => {
            // rotate_polygon(dummy_polygons.current, 2, 45);
            for(let i = 0; i < dummy_polygons.current.length / 2; i++){
                dummy = dummy_polygons.current[i];
                if(dummy.rotation.x <= 0){
                    polygons_states.current[i] = 'rotate_back';
                }
                if(dummy.rotation.x >= angle){
                    polygons_states.current[i] = 'rotate';
                }
                if(polygons_states.current[i] === 'rotate_back'){
                    rotation = 0.005;
                }
                if(polygons_states.current[i] === 'rotate'){
                    rotation = -0.005;
                }
                //FRONT TO LEFT 
                // dummy.rotation.y = dummy.rotation.y + rotation;  
                dummy.rotation.x = dummy.rotation.x + rotation;  
                dummy.updateMatrix();
                polygon_instanced_mesh.setMatrixAt( i, dummy.matrix ); // EL PROBLEMA ES EL DUMMY NUMBER, SON 1350 POR instanced mesh, POR LO TanTO USAR 2700 NO MODIFICA NADA
            }
            for(let j = dummy_polygons.current.length / 2; j < dummy_polygons.current.length; j++){
                dummy = dummy_polygons.current[j];
                if(dummy.rotation.y <= -angle){
                    polygons_states.current[j] = 'rotate_back';
                }
                if(dummy.rotation.y >= 0){
                    polygons_states.current[j] = 'rotate';
                }
                if(polygons_states.current[j] === 'rotate_back'){
                    rotation = 0.005;
                }
                if(polygons_states.current[j] === 'rotate'){
                    rotation = -0.005;
                }
                //FRONT TO LEFT 
                dummy.rotation.y = dummy.rotation.y + rotation;  
                dummy.updateMatrix();
                polygon_2_instanced_mesh.setMatrixAt( j - dummy_polygons.current.length / 2, dummy.matrix ); // EL PROBLEMA ES EL DUMMY NUMBER, SON 1350 POR instanced mesh, POR LO TanTO USAR 2700 NO MODIFICA NADA
            }
            polygon_instanced_mesh.instanceMatrix.needsUpdate = true;
            polygon_2_instanced_mesh.instanceMatrix.needsUpdate = true;
            renderer.render(scene, camera)
        };
        //polygons
        const geometry = new THREE.BufferGeometry();

        const positions = new Float32Array([
                //Front
                0.0,0.0,0.0,//0
                0.1,0.0,0.0,//1
                0.1,0.1,0.0//2
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
        const material = new THREE.MeshPhongMaterial( { 
            color: 'blue', side: THREE.DoubleSide,
            specular: 0x050505,
            shininess: 100
        } );
        // const polygon = new THREE.Mesh( geometry, material );

        // scene.add(polygon);

        //GRASS USED BLENDER TO CREATE LITTLE BLOCKS OF GRASS AND WIND ANIMATION
        let polygon_instanced_mesh = new THREE.InstancedMesh(geometry, material, 1350);
        scene.add(polygon_instanced_mesh);
        let count = 0;
        for(let i = -27; i < 27; i++){
            for(let j = -10; j < 15; j++){
                let dummy = new THREE.Object3D();
                dummy.position.set(i / 10, j / 10, 0);
                dummy.updateMatrix();
                polygon_instanced_mesh.setMatrixAt( count, dummy.matrix );
                dummy_polygons.current.push(dummy);
                polygons_states.current.push('rotate');
                count++;
            }
        }
        polygon_instanced_mesh.instanceMatrix.needsUpdate = true;



        const geometry_polygon_2 = new THREE.BufferGeometry();

        const positions_2 = new Float32Array([
                //Front
                0.1,0.1,0.0,
                0.0,0.1,0.0,
                0.0,0.0,0.0,
        ]);

        geometry_polygon_2.setAttribute( 'position', new THREE.BufferAttribute( positions_2, 3 ) );
        geometry_polygon_2.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry_polygon_2.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
        geometry_polygon_2.setIndex(indices);
        const material_2 = new THREE.MeshPhongMaterial( {
             color: 'lightblue', side: THREE.DoubleSide,
             specular: 0x050505,
             shininess: 500
            } );
        // const polygon_2 = new THREE.Mesh( geometry_polygon_2, material_2 );

        // scene.add(polygon_2);
        let polygon_2_instanced_mesh = new THREE.InstancedMesh(geometry_polygon_2, material_2, 1350);
        scene.add(polygon_2_instanced_mesh);
        count = 0;
        for(let i = -27; i < 27; i++){
            for(let j = -10; j < 15; j++){
                let dummy_2 = new THREE.Object3D();
                dummy_2.position.set(i / 10, j / 10, 0);
                dummy_2.updateMatrix();
                polygon_2_instanced_mesh.setMatrixAt( count, dummy_2.matrix );
                dummy_polygons.current.push(dummy_2);
                // console.log(dummy_polygons.current.length);
                polygons_states.current.push('rotate');
                count++;
            }
        }
        polygon_2_instanced_mesh.instanceMatrix.needsUpdate = true;


        console.log(dummy_polygons.current);

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
            requestAnimationFrame(animate);
            render();
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