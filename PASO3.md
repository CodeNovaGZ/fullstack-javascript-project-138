Descarga de otros recursos
Implementa la descarga de todos los recursos locales desde las etiquetas link y script. Los recursos locales son aquellos que se encuentran en el mismo dominio (incluidos los subdominios) que la página.

Por ejemplo, en el enlace https://codica.la/cursos (no necesitas hacer la solicitud allí, usa las fijaciones a continuación) se proporciona la siguiente página:

<!-- Usa este código como una fijación para las pruebas -->

<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Cursos de programación Codica</title>
    <link rel="stylesheet" media="all" href="https://cdn2.codica.la/assets/menu.css">
    <link rel="stylesheet" media="all" href="/assets/application.css">
    <link href="/cursos" rel="canonical">
  </head>
  <body>
    <img src="/assets/professions/nodejs.png" alt="Icono de la profesión de programador Node.js">
    <h3>
      <a href="/professions/nodejs">Programador Node.js</a>
    </h3>
    <script src="https://js.stripe.com/v3/"></script>
    <script src="/packs/js/runtime.js"></script>
  </body>
</html>
Entonces, la página descargada con los enlaces procesados se verá así:

<!-- Usa este código como una fijación para las pruebas -->
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Cursos de programación Codica</title>
    <link rel="stylesheet" media="all" href="https://cdn2.codica.la/assets/menu.css">
    <link rel="stylesheet" media="all" href="codica-la-cursos_files/codica-la-assets-application.css">
    <link href="codica-la-cursos_files/codica-la-cursos.html" rel="canonical">
  </head>
  <body>
    <img src="codica-la-cursos_files/codica-la-assets-professions-nodejs.png" alt="Icono de la profesión de programador Node.js">
    <h3>
      <a href="/professions/nodejs">Programador Node.js</a>
    </h3>
    <script src="https://js.stripe.com/v3/"></script>
    <script src="codica-la-cursos_files/codica-la-packs-js-runtime.js"></script>
  </body>
</html>
Tareas
Añade en las pruebas la verificación de la descarga de recursos y la modificación del HTML.
Implementa la descarga de todos los recursos locales desde la página.
Modifica el HTML para que todos los enlaces a recursos locales apunten a los archivos descargados.
Añade en el README un asciinema con un ejemplo de cómo funciona el paquete.
Consejos
URL manejo correcto de direcciones web. Presta atención al segundo parámetro, puede ayudarte mucho a determinar la localización de los enlaces.
El recurso en cdn2.codica.la es ignorado porque está en otro host.