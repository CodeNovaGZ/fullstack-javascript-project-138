Descarga de imágenes
Para que la página funcione correctamente cuando se ejecute desde tu máquina, necesitas descargar también sus recursos. En este paso, comenzaremos con la descarga de imágenes.

Los recursos deben colocarse en un directorio cuyo nombre se forma de la misma manera que el nombre del archivo principal, pero al final, en lugar de .html, se añade _files. Los nombres de los archivos deben formarse de manera similar a la página, indicando la extensión del archivo. Dentro de la página principal, todos los enlaces deben reemplazarse para que apunten a los archivos en el directorio.

Por ejemplo, la página disponible en https://codica.la/cursos (no necesitas hacer la solicitud, usa las fixtures abajo) entrega esta página:

<!-- Usa este código como fixture para las pruebas -->
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Cursos de Programación de Codica</title>
  </head>
  <body>
    <img src="/assets/professions/nodejs.png" alt="Ícono de la profesión de programador Node.js" />
    <h3>
      <a href="/professions/nodejs">Programador Node.js</a>
    </h3>
  </body>
</html>
Después de descargar la página, se debe crear el directorio codica-la-cursos_files, que contiene el archivo codica-la-assets-professions-nodejs.png, y el enlace en el HTML debe ser reemplazado con el recurso descargado:

<!-- Usa este código como fixture para las pruebas -->
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Cursos de Programación de Codica</title>
  </head>
  <body>
    <img src="codica-la-cursos_files/codica-la-assets-professions-nodejs.png" alt="Ícono de la profesión de programador Node.js">
    <h3>
      <a href="/professions/nodejs">Programador Node.js</a>
    </h3>
  </body>
</html>
Usa imágenes en formato png o jpg y asegúrate de que se muestren correctamente después de la descarga, por ejemplo:

Node.js logo

Enlaces
cheerio - una biblioteca similar a jQuery para trabajar con DOM en Node.js.
Tareas
Añade pruebas para verificar la descarga de imágenes y la modificación del HTML.
Modifica el HTML para que todos los enlaces apunten a los archivos descargados.
Añade en el README una animación del ejemplo de uso del paquete.
Consejos
Al trabajar con datos binarios, debes especificarlo explícitamente en axios. Esto se hace usando el parámetro responseType (descrito en el README de GitHub).
Cheerio puede romper los espacios y la codificación después de modificar el archivo HTML, tenlo en cuenta en las fixtures.
Intenta no anidar promesas. Haz todo lo más plano posible.
Ejemplo de uso de la biblioteca Cheerio:
import * as cheerio from 'cheerio';

const html = '<h2 class="title">Hello, world!</h2><input name="email" value="test@example.com">';

// Cargar el html para el análisis
const $ = cheerio.load(html);

// Obtener el texto (lo que está entre las etiquetas de apertura y cierre)
console.log($('h2.title').text()); // => Hello, World!

// Obtener un atributo del elemento - por ejemplo, la clase
console.log($('h2').attr('class')); // => title

// Si necesitas encontrar un elemento con un valor específico de un atributo, usa el selector con atributo y valor
// El método attr() devuelve el valor del atributo:
console.log($('input[name=email]').attr('name')); // => email
Comentarios

Todavía no hay comentarios

Compañía
Inicio
Acerca de nosotros
Contactos
Términos y condiciones
Política de privacidad
© 2012 - 2026 Códica

Cursos y carreras