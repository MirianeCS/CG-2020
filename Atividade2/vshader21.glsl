#version 300 es

in vec4 aPosition;

in vec4 aColor;
out vec4 vColor;

uniform mat4 matrixGL;
uniform vec4 translation;

void main()
{
  gl_Position = (aPosition + translation) * matrixGL;
  vColor = aColor;
}