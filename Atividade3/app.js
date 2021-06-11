//Miriane Cardoso Stefanelli
//RA: 760933
//ATIVIDADE 3

//RODANDO O SERVIDOR COM O COMANDO python -m http.server 8000

"use strict";

var canvas;
var gl;

var extra;

//ECS
var e = vec3(0, 0, 5); //CAMERA
var g = vec3(0.0, 0.0, -1.0); //LOOK AT
var t = vec3(0.0, 1.0, 5.0); //VIEW-UP

//CALCULO DE MATRIZ
var n = normalize(negate(g));
var u = normalize(cross(t, n));
var v = cross(n, u);

//PONTOS PARA PROJECAO
var fov = 100;
var near = 0.5;
var far = 100.0;

var aspectRatio = 500/500;

var projectionMatrix = new Float32Array(
    [ 
        1/(aspectRatio*Math.tan(radians(fov)/2)),         0,              0,                              0,
        0,                  1/Math.tan(radians(fov)/2),          0,                              0,
        0,                  0,      -((far+near)/(far-near)),    -((2*far*near)/(far-near)),
        0,                  0,              -1,                             0
    ]
);


window.onload = async function init_egea(){

    canvas = document.getElementById( "gl-canvas" );

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    gl_view_clear();
    
    var program = initShaders(gl, "./vshader21.glsl", "./fshader21.glsl");
    gl.useProgram(program);
    
    //-----------------------------------------------------------
    
    //LOAD OBJ
    var obj = await loadObj('./coarseTri.egea1.obj');  
    
    var color = [];
    for(var i = 0 ; i < (obj[0].length / 2) ; i++)
    color.push(vec4(Math.random(), Math.random(), Math.random(), 1));
    color = flatten(color);
    
    // translation(program, -1.0, 0.0, 0.0);    
    // var x = 1.5, y = 1.5, z = 1.5;
    
    // var matrix = new Float32Array([
    //     x,   0.0,  0.0,  0.0,
    //     0.0,  y,   0.0,  0.0,
    //     0.0,  0.0,  z,   0.0,
    //     0.0,  0.0,  0.0,  1.0
    // ]);

    var extraCenter = center(obj[0]);
    translation(program, -extraCenter[0], -extraCenter[1], -extraCenter[2]);
    
    var extraNormal = normal(obj[0]);
    var matrix = new Float32Array([
            extraNormal[0],   0.0,  0.0,  0.0,
            0.0,  extraNormal[1],   0.0,  0.0,
            0.0,  0.0,  extraNormal[2],   0.0,
            0.0,  0.0,  0.0,  1.0
        ]);
    
    var matrixGL = gl.getUniformLocation(program, 'matrixGL');
    gl.uniformMatrix4fv(matrixGL, false, matrix);
    
    bufferId(obj);
    buffer_faces(obj);
    
    aPosition(program);
    
    colorId(color);    
    aColor(program);
    
    render_faces(obj, program);
    
    document.getElementById("botaoMenos").onclick = function() { t[2] += 1; init_egea()}
    document.getElementById("botaoMais").onclick = function() { t[2] -= 1; init_egea()}
    
    init_rocket();
}

async function init_rocket(){ //antes recebia program

    var canvas2 = document.getElementById( "gl-canvas2" );
    // var canvas2 = document.getElementById( "gl-canvas" ); //PISCANDO UM OBJETO DEPOIS O OUTRO

    gl = canvas2.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    var program = initShaders(gl, "./vshader21.glsl", "./fshader21.glsl");
    gl.useProgram(program);

    var obj2 = await loadObj('./coarseTri.rockerArm.obj');  

    var color = [];
    for(var i = 0 ; i < (obj2[0].length / 2) ; i++)
        color.push(vec4(Math.random(), Math.random(), Math.random(), 1));
    color = flatten(color);

    var extraCenter = center(obj2[0]);
    translation(program, -extraCenter[0], -extraCenter[1], -extraCenter[2]);
    
    var extraNormal = normal(obj2[0]);
    var matrix = new Float32Array([
            extraNormal[0],   0.0,  0.0,  0.0,
            0.0,  extraNormal[1],   0.0,  0.0,
            0.0,  0.0,  extraNormal[2],   0.0,
            0.0,  0.0,  0.0,  1.0
        ]);
    
    // translation(program, -0.2, 0.2, 0.0);
    
    // var x = 1.5, y = 1.5, z = 1.5;
    // var matrix = new Float32Array([
    //     x,   0.0,  0.0,  0.0,
    //     0.0,  y,   0.0,  0.0,
    //     0.0,  0.0,  z,   0.0,
    //     0.0,  0.0,  0.0,  1.0
    // ]);

    var matrixGL = gl.getUniformLocation(program, 'matrixGL');
    gl.uniformMatrix4fv(matrixGL, false, matrix);

    bufferId(obj2);
    buffer_faces(obj2);
    
    aPosition(program);    
    
    colorId(color);    
    aColor(program);

    render_faces(obj2, program);
}

//----------------------------------------------------------------------------------//
//-------------------------------------FUNÇÕES-------------------------------------//
//--------------------------------------------------------------------------------//

function camera(program){

    var r;
    var t2;

    var viewMatrix = new mat4(
        u[0], u[1], u[2], 0,
        v[0], v[1], v[2], 0,
        n[0], n[1], n[2], 0,
        0,    0,    0,    1
    );

    t2 = new mat4(
        1, 0, 0, -t[0],
        0, 1, 0, -t[1],
        0, 0, 1, -t[2],
        0, 0, 0, 1 
    );

    r = mult(viewMatrix, t2);

    var u_cameraMatrix = gl.getUniformLocation(program, 'u_cameraMatrix');
    gl.uniformMatrix4fv(u_cameraMatrix, false, r);

    var projMatrix = gl.getUniformLocation(program, 'projMatrix');
    gl.uniformMatrix4fv(projMatrix, false, projectionMatrix);
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

function buffer_faces(obj){
    var wireframeId = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wireframeId);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(obj[2]), gl.STATIC_DRAW);
}

// Associate out shader variables with our data buffer
function aPosition(program){
    var aPosition = gl.getAttribLocation( program, "aPosition" );
    gl.vertexAttribPointer( aPosition, 3, gl.FLOAT, true, 0, 0 );
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

function render_faces(obj, program){
    camera(program)
    gl.drawElements(gl.TRIANGLES, Float32Array.from(obj[2]).length, gl.UNSIGNED_SHORT, 0);
}

function translation(program, x, y, z){
    var translation = gl.getUniformLocation(program, 'translation');
    gl.uniform4f(translation, x, y, z, 0.0);
    
}

//ENCONTRA A NORMAL PARA ESCALAR O OBJETO
function normal(vertices){

    var menorX = vertices[0];  
    var maiorX = vertices[0];  
    
    var menorY = vertices[1];
    var maiorY = vertices[1];

    var menorZ = vertices[2];
    var maiorZ = vertices[2];

    var normalX; 
    var normalY;
    var normalZ;

    var normal;

    for(let i = 0 ; i < vertices.length ; i += 3){

        if(vertices[i] < menorX)
            menorX = vertices[i];
        if(vertices[i] > maiorX)
            maiorX = vertices[i];

        if((vertices[i + 1]) < menorY)
            menorY = vertices[i + 1];
        if((vertices[i + 1]) > maiorY)
            maiorY = vertices[i + 1];

        if((vertices[i + 2]) < menorZ)
            menorZ = vertices[i + 2];
        if((vertices[i + 2]) > maiorZ)
            maiorZ = vertices[i + 2];
    }

    normalX = (2/(maiorX - menorX)); 
    normalY = (2/(maiorY - menorY));
    normalZ = (2/(maiorZ - menorZ));

    normal = [
        normalX, 
        normalY, 
        normalZ
    ];

    return normal;
}

//ENCONTRA CENTRO DO OBJETO PARA TRANSLAÇÃO
function center(vertices){

    var menorX = vertices[0];  
    var maiorX = vertices[0];  
    
    var menorY = vertices[1];
    var maiorY = vertices[1];

    var menorZ = vertices[2];
    var maiorZ = vertices[2];

    var mediaX; 
    var mediaY;
    var mediaZ;

    var center;

    for(let i = 0 ; i < vertices.length ; i += 3){

        if(vertices[i] < menorX)
            menorX = vertices[i];
        if(vertices[i] > maiorX)
            maiorX = vertices[i];

        if((vertices[i + 1]) < menorY)
            menorY = vertices[i + 1];
        if((vertices[i + 1]) > maiorY)
            maiorY = vertices[i + 1];

        if((vertices[i + 2]) < menorZ)
            menorZ = vertices[i + 2];
        if((vertices[i + 2]) > maiorZ)
            maiorZ = vertices[i + 2];
    }

    mediaX = ((maiorX + menorX) / 2); 
    mediaY = ((maiorY + menorY) / 2);
    mediaZ = ((maiorZ + menorZ) / 2);

    center = [
        mediaX, 
        mediaY, 
        mediaZ
    ];

    return center;
}

//ENVIADO POR BRUNO PERES
async function loadObj(path)
{
    const response = await fetch(path);
    const obj_text = await response.text();
 
    // OBJ Parser
 
    // Gets only the lines as showed below:
    // v -0.703621 0.033242 0.000000
    // And captures each vertex point when matched
    const obj_vertex_regex = /^v +(.*) +(.*) +(.*)$/;
    const obj_face_regex = /^f +(\d+) +(\d+) +(\d+)$/;
    const obj_full_face_regex = /^f +(\d+\/\d+\/\d+) +(\d+\/\d+\/\d+) +(\d+\/\d+\/\d+) +(\d+\/\d+\/\d+)/;
 
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
            vertices.push(parseFloat(match[3]));
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
        else if (obj_full_face_regex.test(element))
        {
            let match = obj_full_face_regex.exec(element);
            
            // Quad's first triangle
            triangleIndices.push(parseInt(match[1].split('/')[0] - 1));
            triangleIndices.push(parseInt(match[2].split('/')[0] - 1));
            triangleIndices.push(parseInt(match[4].split('/')[0] - 1));
 
            // Quad's second triangle
            triangleIndices.push(parseInt(match[2].split('/')[0] - 1));
            triangleIndices.push(parseInt(match[3].split('/')[0] - 1));
            triangleIndices.push(parseInt(match[4].split('/')[0] - 1));
 
 
            wireframeIndices.push(parseInt(match[1].split('/')[0] - 1));
            wireframeIndices.push(parseInt(match[2].split('/')[0] - 1));
 
            wireframeIndices.push(parseInt(match[1].split('/')[0] - 1));
            wireframeIndices.push(parseInt(match[4].split('/')[0] - 1));
 
            wireframeIndices.push(parseInt(match[2].split('/')[0] - 1));
            wireframeIndices.push(parseInt(match[3].split('/')[0] - 1));
 
            wireframeIndices.push(parseInt(match[3].split('/')[0] - 1));
            wireframeIndices.push(parseInt(match[4].split('/')[0] - 1));
        }
    });
 
    return [Float32Array.from(vertices), Uint16Array.from(wireframeIndices), Uint16Array.from(triangleIndices)];
}   