import * as THREE from "three";
import {useEffect, useRef, useState} from 'react';


let style = {
    canvas:{
        minHeight: "1080px",
        maxHeight: "1080px", 
        minWidth: "100vw",
        maxWidth: "100vw",
        position: "absolute",
    },
    canvas_after_load:{
        minHeight: "1080px",
        maxHeight: "1080px", 
        minWidth: "100vw",
        maxWidth: "100vw",
        position: "absolute",
        zIndex: "0"
    },
    progress_bar: {
        display: "grid",
        transition: "all 0.5s ease-out",
        width: "0%",
        height: "30px",
        background: "darkblue"
    },
    loading_bar : {
        width: "300px",
        marginTop: "2%",
        zIndex: "2",
        height: "30px",
        background: "black",
        boxShadow: "5px 5px 15px 5px black"
    },
}

const BackgroundAccount = ({loading_screen})=>{
    const canvas = useRef(null);
    const percentage = useRef(0);
    const progress_bar = useRef(0);
    const fadeScreen = useRef(0);
    const dummy_polygons = useRef([]);
    const polygons_states = useRef([]);
    const [componentLoaded,
        setComponentLoaded] = useState(false);
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
            .set(0, 0.25, 2.8);

        // let controls = new OrbitControls(camera, renderer.domElement);
        // controls
        //     .target
        //     .set(0, 0, 0);
        const color_scene = 'white';
        const intensity = 0.2;
        const light = new THREE.DirectionalLight(color_scene, intensity);
        light.position.set(-10, 10, 45);
        light.target.position.set(0, 0, 0);
        scene.add(light);
        const hemiLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 2 );
        scene.add( hemiLight );

        // scene.background = new THREE.Color('white');

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
                    rotation = 0.001;
                }
                if(polygons_states.current[i] === 'rotate'){
                    rotation = -0.001;
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
                    rotation = 0.001;
                }
                if(polygons_states.current[j] === 'rotate'){
                    rotation = -0.001;
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
        const polygons_texture = new THREE
        .TextureLoader()
        .load('./textures/polygons_texture.jpg', () => {

            polygons_texture.anisotropy = 4;
            polygons_texture.encoding = THREE.sRGBEncoding;
        });
        
        // textureLoader.wrapS = THREE.RepeatWrapping;
        // textureLoader.wrapT = THREE.RepeatWrapping;
        // textureLoader.anisotropy = 4;
        // textureLoader.repeat.set( 10, 24 );
        // textureLoader.encoding = THREE.sRGBEncoding;

        geometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3));
        geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
        geometry.setIndex(indices);
        const material = new THREE.MeshPhongMaterial( { 
            color: 'brown', side: THREE.DoubleSide,
            specular: 0x050505, map: polygons_texture,
            shininess: 500
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
            specular: 0x050505, map: polygons_texture,
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
        percentage.current.innerText = "0 %";
        if(loading_screen.current === true){
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
            }//comment
        }
        if(loading_screen.current === false){
            setComponentLoaded(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return(
        <div style={componentLoaded ? style.canvas_after_load : style.canvas} ref={canvas}>
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

export default BackgroundAccount;