//Miriane Cardoso Stefanelli
//RA: 760933
//USANDO A BIBLIOTECA THREE.JS
//CARREGAR UMA IMAGEM EM FORMATO OBJ PRIMEIRO COM OS TRIÂNGULOS INTERNOS PINTADOS E DEPOIS ALTERNAR, USANDO CLIQUE DO MOUSE, ENTRE ELA E SUA FORMA APENAS MOSTRANDO AS ARESTAS (WIREFRAME)
//RODANDO O SERVIDOR COM O COMANDO python -m http.server 8000

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/build/three.module.js';
import { OBJLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/OBJLoader.js';

let container;
let camera;
let pointLight;
let scene;
let renderer;
let loader, object, manager;
let geometry, material, mesh;
let wireframeGeometry, wireframeMaterial, wireframe;

let extra; //ALTERNAR

window.onload = init_normal();
document.addEventListener("click", alternar);

function alternar(){
    if(extra == 1){
        document.documentElement.innerHTML = '';
        init_wireframe();
    }
    else{
        document.documentElement.innerHTML = '';
        init_color();
    }
}

function init_normal(){

    //ADICIONANDO CONTAINER
    add_container();

    //ADICIONANDO CAMERA
    add_camera();
    
    //ADICIONANDO CENA
    add_scene();
    
    //ADICIONAR PONTOS DE LUZ, PRECISA SENÃO NÃO FUNCIONA
    pointlight();

    //ADICIONAR OBJETO
    object_normal();

    //RENDERIZAR
    webglrenderer();
    render();
}

function init_color(){

    //ADICIONANDO CONTAINER
    add_container();

    //ADICIONANDO CAMERA
    add_camera();
    
    //ADICIONANDO CENA
    add_scene();
    
    //ADICIONAR PONTOS DE LUZ, PRECISA SENÃO NÃO FUNCIONA
    pointlight();

    //ADICIONAR OBJETO
    object_color();

    //RENDERIZAR
    webglrenderer();
    render();

    //ALTERNAR
    extra = 1;
}

function init_wireframe(){

    //ADICIONANDO CONTAINER
    add_container();
    
    //ADICIONANDO CAMERA
    add_camera();
    
    //ADICIONANDO CENA
    add_scene();
    
    //ADICIONAR PONTOS DE LUZ, PRECISA SENÃO NÃO FUNCIONA
    pointlight();
    
    //ADICIONAR OBJETO
    object_wireframe();
    
    //RENDERIZAR 
    webglrenderer();    
    render();
    
    //ALTERNAR
    extra = 0;
}

//----------------------------------------------------------------------------------//
//-------------------------------------FUNÇÕES-------------------------------------//
//--------------------------------------------------------------------------------//

function add_container(){

    container = document.createElement('div');
    document.body.appendChild(container);
}

function add_camera(){

    camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 20;
}

function add_scene(){

    //ADICIONAR CENA
    scene = new THREE.Scene();
}

function pointlight(){

    pointLight = new THREE.PointLight(0xffffff, 0.8);
    camera.add(pointLight);
    scene.add(camera);
}

function webglrenderer(){

    renderer = new THREE.WebGLRenderer();
    //MELHORAR QUALIDADE
    renderer.setPixelRatio(window.devicePixelRatio); 
    //TAMANHO DA JANELA DA IMAGEM
    renderer.setSize(window.innerWidth, window.innerHeight); 
    container.appendChild(renderer.domElement);
}

function render() {

    requestAnimationFrame( render );
    renderer.render( scene, camera );
    
}

function object_normal(){

    const manager = new THREE.LoadingManager(() => {
        scene.add(object);
    });

    loader = new OBJLoader(manager);
    loader.load( 'airfoil.obj', function (obj){
        object = obj;
    });

}

function object_color(){   
    
    //CARREGAR OBJETO
    loader = new OBJLoader(manager);
    loader.load( 'airfoil.obj', function (obj){
        
        obj.traverse(function(child){
            if (child instanceof THREE.Mesh){
                
                //DEFININDO AS FACES PARA COLOCAR COR 
                geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                geometry.faces.forEach(face => {
                    face.color.setRGB(Math.random(), Math.random(), Math.random())
                });
                
                material = new THREE.MeshLambertMaterial({vertexColors:THREE.FaceColors});
                mesh = new THREE.Mesh(geometry, material);
                
                scene.add(mesh);
            }
        });
        
        object = obj;
    });
}

function object_wireframe(){
    
    //CARREGAR OBJETO
    loader = new OBJLoader(manager);
    loader.load( 'airfoil.obj', function (obj){
        
        obj.traverse(function(child){
            if (child instanceof THREE.Mesh){
                
                geometry = new THREE.Geometry().fromBufferGeometry(child.geometry);
                material = new THREE.MeshLambertMaterial({vertexColors:THREE.FaceColors});
                mesh = new THREE.Mesh(geometry, material);

                scene.add(mesh);
                
                //WIREFRAME
                wireframeGeometry = new THREE.WireframeGeometry(geometry);
                wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
                wireframe = new THREE.LineSegments(wireframeGeometry, wireframeMaterial);

                mesh.add(wireframe);
            }
        });

        object = obj;
    });
}