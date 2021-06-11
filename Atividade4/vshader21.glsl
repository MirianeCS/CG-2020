#version 300 es

in vec4 vNormal;

uniform vec4 ambientProduct, diffuseProduct, specularProduct;
uniform vec4 lightPosition;
uniform float shininess;
uniform mat3 normalMatrix;

uniform mat4 modelViewMatrix;

in vec4 aPosition;

in vec4 aColor;
out vec4 vColor;

uniform mat4 matrixGL;
uniform vec4 translation;

uniform mat4 u_cameraMatrix;
uniform mat4 projMatrix;

void main()
{
    vec3 pos = (modelViewMatrix * aPosition).xyz;
    vec3 light = lightPosition.xyz;
    vec3 L;
    
    // check for directional light
    
    if(lightPosition.w == 0.0) L = normalize(lightPosition.xyz);
    else L = normalize( lightPosition.xyz - pos );


	
    vec3 E = -normalize( pos );
    vec3 H = normalize( L + E );

    // Transform vertex normal into eye coordinates
    
       
    vec3 N = normalize( normalMatrix*vNormal.xyz);

    // Compute terms in the illumination equation
    vec4 ambient = ambientProduct;

    float Kd = max( dot(L, N), 0.0 );
    vec4  diffuse = Kd*diffuseProduct;

    float Ks = pow( max(dot(N, H), 0.0), shininess );
    vec4  specular = Ks * specularProduct;
    
    if( dot(L, N) < 0.0 ) {
	specular = vec4(0.0, 0.0, 0.0, 1.0);
    } 
    
    vColor = ambient + diffuse + specular;

    vColor.a = 1.0;



  gl_Position = ((aPosition + translation) * matrixGL)* u_cameraMatrix * projMatrix;

}