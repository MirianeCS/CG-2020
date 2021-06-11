# Atividades Práticas de Computação Gráfica
## Atividade 01

Explore os seguintes métodos do [WebGLRenderingContext](https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext):

* gl.viewport
* gl.clearColor
* gl.createBuffer
* gl.bindBuffer
* gl.bufferData
* gl.vertexAttribPointer
* gl.getAttribLocation
* gl.drawArrays

Dentro do diretório *HelloWorld* estão dois exemplos de uso destes métodos. Em *triangle.html* apenas um triângulo é exibido, com uma única cor e os *shaders* estão em arquivos. Em *gasket4.html* os *shaders* estão dentro do próprio *html* e cada vértice recebe um atributo adicional, no caso, a sua cor. Nestes exemplos, todas as coordenadas já estão no espaço de visualização [-1 1] em *x* e *y*.

Nesta atividade você deve:
* Carregar um objeto no formato [OBJ](https://en.wikipedia.org/wiki/Wavefront_.obj_file#File_format). Você pode usar o exemplo que está no repositório, ou outro similar que preferir;
* Visualizar este objeto na tela. Veja que o exemplo do repositório não precisará de qualquer transformação;
* Encontre modos de visualizar a malha do objeto: alternando as cores dos triângulos e também visualizando apenas o *wireframe*. Use o teclado ou o mouse para alternar os modos de visualização.
