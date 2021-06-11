#version 300 es

in vec4 aPosition;

in vec4 aColor;
out vec4 vColor;

uniform mat4 matrixGL;
uniform vec4 translation;

uniform mat4 u_cameraMatrix;
uniform mat4 projMatrix;

void main()
{
  gl_Position = ((aPosition + translation) * matrixGL)* u_cameraMatrix * projMatrix;
  vColor = aColor;
}