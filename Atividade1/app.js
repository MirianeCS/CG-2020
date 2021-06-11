//Miriane Cardoso Stefanelli
//RA: 760933
//CARREGAR UMA IMAGEM EM FORMATO OBJ PRIMEIRO COM OS TRIÂNGULOS INTERNOS PINTADOS E DEPOIS ALTERNAR, USANDO CLIQUE DO MOUSE, ENTRE ELA E SUA FORMA APENAS MOSTRANDO AS ARESTAS (WIREFRAME)
//RODANDO O SERVIDOR COM O COMANDO python -m http.server 8000

"use strict";

var canvas;
var gl;
var obj;

var extra;

document.addEventListener("click", alternar);

window.onload = async function init_figure(){
    
    canvas();

    //LOAD OBJ
    obj = await loadObj();  
    console.log(obj);

    //
    //  Configure WebGL
    //
    
    gl_view_clear();

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "./vshader21.glsl", "./fshader21.glsl");
    gl.useProgram(program);


    bufferId(obj);
    buffer_faces(obj);

    aPosition(program);

    render_faces(obj);

    extra = 1;
}

async function init_wireframe()
{
    var canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    //LOAD OBJ
    obj = await loadObj();  
    console.log(obj);

    var color = [];
    for(var i = 0 ; i < (obj[0].length / 2) ; i++)
            color.push(vec4(0.0, 0.0, 0.0, 1));
    color = flatten(color);

    //
    //  Configure WebGL
    //
    
    gl_view_clear();

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "./vshader21.glsl", "./fshader21.glsl");
    gl.useProgram(program);

    bufferId(obj);
    buffer_wireframe(obj);
    
    aPosition(program);

    colorId(color);
    aColor(program);

    render_wireframe(obj);
    
    extra = 0;
}

async function init_color(){
    var canvas = document.getElementById( "gl-canvas" );
    console.log(canvas);

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    //LOAD OBJ
    obj = await loadObj();  

    var color = [];
    for(var i = 0 ; i < (obj[0].length / 2) ; i++)
        color.push(vec4(Math.random(), Math.random(), Math.random(), 1));
    color = flatten(color);
    // console.log(color)

    //
    //  Configure WebGL
    //
    
    gl_view_clear();

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "./vshader21.glsl", "./fshader21.glsl");
    gl.useProgram(program);

    bufferId(obj);
    buffer_faces(obj);

    aPosition(program);    
    
    colorId(color);    
    aColor(program);

    render_faces(obj);
    extra = 1;
}

//----------------------------------------------------------------------------------//
//-------------------------------------FUNÇÕES-------------------------------------//
//--------------------------------------------------------------------------------//

function alternar(){
    if(extra == 1)
        init_wireframe();
    else
        init_color();
}

function canvas(){
    canvas = document.getElementById( "gl-canvas" );
    console.log(canvas);
    
    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }
}

function gl_view_clear(){
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
}

// Load the data into the GPU
function bufferId(obj){
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(obj[0]), gl.STATIC_DRAW); 
}
function buffer_wireframe(obj){
    var wireframeId = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireframeId);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(obj[1]), gl.STATIC_DRAW);
}
function buffer_faces(obj){
    var wireframeId = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireframeId);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(obj[2]), gl.STATIC_DRAW);
}

// Associate out shader variables with our data buffer
function aPosition(program){
    var aPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( aPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( aPosition );
}

//Load color
function colorId(color){
    var colorId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorId);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(color), gl.STATIC_DRAW);
}

//Associate color
function aColor(program){
    var aColor = gl.getAttribLocation(program, "aColor");
    gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aColor);
}

function render_wireframe(obj){
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawElements(gl.LINES, Float32Array.from(obj[1]).length, gl.UNSIGNED_SHORT, 0);
}

function render_faces(obj){
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawElements(gl.TRIANGLES, Float32Array.from(obj[2]).length, gl.UNSIGNED_SHORT, 0);
}

async function loadObj() {
    const response = await fetch('./airfoil.obj');
    const obj_text = await response.text();
 
    const obj_vertex_regex = /^v +([\d-]\d*\.\d+) +([\d-]\d*\.\d+) +([\d-]\d*\.\d+)$/;
    const obj_face_regex = /^f +(\d+) +(\d+) +(\d+)$/;
 
    const lines = obj_text.split('\n');
 
    let vertices = new Array;
    let wireframeIndices = new Array;
    let triangleIndices = new Array;
    
    lines.forEach(element => {
        element = element.trim();
        if (obj_vertex_regex.test(element)) {
            let match = obj_vertex_regex.exec(element);
            vertices.push(parseFloat(match[1]));
            vertices.push(parseFloat(match[2]));
        }
        else if (obj_face_regex.test(element))
        {
            let match = obj_face_regex.exec(element);
 
            // OBJ indices start at 1
            // Subtracting 1 from every index since JavaScript indices start at 0
            wireframeIndices.push(parseInt(match[1]) - 1);
            wireframeIndices.push(parseInt(match[2]) - 1);
 
            wireframeIndices.push(parseInt(match[1]) - 1);
            wireframeIndices.push(parseInt(match[3]) - 1);
 
            wireframeIndices.push(parseInt(match[2]) - 1);
            wireframeIndices.push(parseInt(match[3]) - 1);
 
            triangleIndices.push(parseInt(match[1]) - 1);
            triangleIndices.push(parseInt(match[2]) - 1);
            triangleIndices.push(parseInt(match[3]) - 1);
        }
    });
 
    return [vertices, wireframeIndices, triangleIndices];
}