Descarga de página
Implementa la utilidad de línea de comandos page-loader, que descarga una página de la red y la guarda en el directorio especificado (por defecto en el directorio de ejecución del programa). El programa debe devolver la ruta completa al archivo descargado.

En esta etapa no se realizan manipulaciones con el contenido, solo se guarda.

# por defecto el output es process.cwd()
page-loader --output /var/tmp https://codica.la/cursos
/var/tmp/codica-la-cursos.html # ruta al archivo descargado

open /var/tmp/codica-la-cursos.html
El nombre del archivo debe formarse de la siguiente manera:

Se toma la dirección de la página sin el protocolo.
Todos los caracteres, excepto letras y números, se reemplazan por un guion -.
Al final se agrega .html.
Ejemplo:

https://codica.la/cursos
codica-la-cursos.html
Enlaces
axios - una biblioteca para realizar solicitudes HTTP.
nock - biblioteca para hacer mocking de solicitudes HTTP.
Test Async Code - reglas para probar código asincrónico en jest.
Tareas
⚠️ Nota: El proyecto debe utilizar promesas. Async/await solo se permite en las pruebas, ya que oculta la naturaleza asincrónica de JS y dificulta la comprensión del tema.

Clona el repositorio creado del proyecto localmente e inicializa tu paquete npm dentro del directorio raíz del proyecto, usando el comando npm init. Al inicializar, asigna el nombre del paquete - @hexlet/code.
Realiza todos los preparativos necesarios (Github Actions, Code Climate, Eslint, agrega los badges en el readme).
Escribe las pruebas (¡mejor antes del código!).
Implementa la descarga de la página indicada.
Instala el paquete usando npm link, asegúrate de que funciona.
Agrega en el README una animación del ejemplo de uso del paquete.
Restricciones
Todas las operaciones asincrónicas dentro de la biblioteca deben estar basadas en promesas. Es decir, no puedes usar funciones con callbacks ni funciones sincrónicas para realizar operaciones de archivos, como readFileSync().
En las pruebas, utiliza async/await para testear. También es importante no usar funciones sincrónicas, ya que jest ejecuta las pruebas en paralelo.
Consejos
Para trabajar con archivos, usa https://nodejs.org/api/fs.html#fs_fs_promises_api
Las pruebas deben estar aisladas entre sí. Para esto, cada descarga debe realizarse en su propio directorio temporal: await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-')); (en el hook beforeEach()).
Para el código común en las pruebas (especialmente con efectos secundarios) se usan las funciones beforeAll() y beforeEach().
Si al descargar obtienes el error AxiosError: unexpected end of file, usa la versión 1.1.3 de axios.