//Miriane Cardoso Stefanelli
//RA: 760933
//ATIVIDADE 2
//CARREGAR UMA IMAGEM COLORIDA E DEPOIS ALTERNAR ENTRE OUTRA IMAGEM, SEMPRE MUDANDO DE COR
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
    obj = await loadObj('./coarseTri.egea1.obj');  
    // console.log(obj);

    var color = [];
    for(var i = 0 ; i < (obj[0].length / 2) ; i++)
        color.push(vec4(Math.random(), Math.random(), Math.random(), 1));
    color = flatten(color);

    //
    //  Configure WebGL
    //
    
    gl_view_clear();

    //  Load shaders and initialize attribute buffers
    var program = initShaders(gl, "./vshader21.glsl", "./fshader21.glsl");
    gl.useProgram(program);

    //ATIVIDADE 2
    var extraCenter = center(obj[0]);
    translation(program, -extraCenter[0], -extraCenter[1], -extraCenter[2]);

    //SCALE

    var extraNormal = normal(obj[0]);

    // var x = 0.5, y = 0.5, z = 1.0;

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

    render_faces(obj);

    extra = 1;
}

async function init_color(image){
    var canvas = document.getElementById( "gl-canvas" );
    console.log(image);

    gl = canvas.getContext('webgl2');
    if (!gl) { alert( "WebGL 2.0 isn't available" ); }

    //LOAD OBJ
    obj = await loadObj(image);  

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

    //ATIVIDADE 2
    var extraCenter = center(obj[0]);
    translation(program, -extraCenter[0], -extraCenter[1], -extraCenter[2]);

    //SCALE

    var extraNormal = normal(obj[0]);

    // var x = 0.5, y = 0.5, z = 1.0;

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

    render_faces(obj);
}

//----------------------------------------------------------------------------------//
//-------------------------------------FUNÇÕES-------------------------------------//
//--------------------------------------------------------------------------------//

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

function alternar(){
    if(extra == 1){
        var image = './coarseTri.rockerArm.obj';
        init_color(image);
        extra = 0;
    }
    else{
        var image = './coarseTri.egea1.obj';
        init_color(image);
        extra = 1;
    }
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

function render_faces(obj){
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawElements(gl.TRIANGLES, Float32Array.from(obj[2]).length, gl.UNSIGNED_SHORT, 0);
}

function translation(program, x, y, z){

    var translation = gl.getUniformLocation(program, 'translation');
    gl.uniform4f(translation, x, y, z, 0.0);
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