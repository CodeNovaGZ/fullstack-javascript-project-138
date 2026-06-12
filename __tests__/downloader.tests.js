import nock from 'nock';
import * as fs from 'fs/promises';
import downloader from '../src/downloader.js';
import path from 'path';
import os from 'os';

describe('downloader', () => {
    let tempdir;

    beforeEach(async () => {
        tempdir = await fs.mkdtemp(path.join(os.tmpdir(), 'downloader-test-'));
    });
    afterEach(async () => {
        await fs.rm(tempdir, { recursive: true, force: true });
        nock.cleanAll();
    });

    test('descarga pagina correctamente', async () => {
        nock('https://example.com')
            .get('/')
            .reply(200, 'Hello, world!');
        const filePath = await downloader('https://example.com', tempdir);
        const content = await fs.readFile(filePath, 'utf-8');
        expect(content).toContain('Hello, world!');
    });

    test('nombre de archivo generado correctamente', async () => {
        nock('https://example.com')
            .get('/test/page')
            .reply(200, 'Test page content');
        const filePath = await downloader('https://example.com/test/page', tempdir);
        const expectedFileName = 'example-com-test-page.html';
        expect(path.basename(filePath)).toBe(expectedFileName);
    });

    test('maneja errores de descarga', async () => {
        nock('https://example.com')
            .get('/')
            .replyWithError('Network error');
        await expect(downloader('https://example.com', tempdir)).rejects.toThrow('No se recibió respuesta del servidor');
    });

    test('error 404 al descargar la pagina', async () => {
        nock('https://example.com')
            .get('/')
            .reply(404, 'Not Found');
        await expect(downloader('https://example.com', tempdir)).rejects.toThrow('Error al descargar la página: 404 Not Found');
    });

    test('error 404 al descargar recurso', async () => {
        const fixtureHtml = `<html><head></head><body><img src="/assets/image.png"></body></html>`;
        nock('https://example.com')
            .get('/')
            .reply(200, fixtureHtml);
        nock('https://example.com')
            .get('/assets/image.png')
            .reply(404, 'Not Found');
        const filePath = await downloader('https://example.com', tempdir);
        const htmlContent = await fs.readFile(filePath, 'utf-8');
        expect(htmlContent).toContain('src="example-com_files/example-com-assets-image.png"');
    });

    test('error 500 al descargar la pagina', async () => {
        nock('https://example.com')
            .get('/')
            .reply(500, 'Internal Server Error');
        await expect(downloader('https://example.com', tempdir)).rejects.toThrow('Error al descargar la página: 500 Internal Server Error');
    });


     test('error de archivo, ruta es un archivo', async () => {
        const badPath = path.join(tempdir, 'example-com.html');
        await fs.writeFile(badPath, '');
        nock('https://example.com')
            .get('/')
            .reply(200, 'Hello, world!');
        await expect(downloader('https://example.com', badPath)).rejects.toThrow(`Error al crear el directorio de recursos`);
    });

    test('descarga imagen y modifica src en HTML', async () => {
        const fixtureHtml = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Test</title>
  </head>
  <body>
    <img src="/assets/nodejs.png" alt="Node.js" />
  </body>
</html>`;

        nock('https://example.com')
            .get('/')
            .reply(200, fixtureHtml);

        nock('https://example.com')
            .get('/assets/nodejs.png')
            .reply(200, Buffer.from('fake-png-data'), { 'Content-Type': 'image/png' });

        const filePath = await downloader('https://example.com', tempdir);
        const htmlContent = await fs.readFile(filePath, 'utf-8');

        expect(htmlContent).toContain('src="example-com_files/example-com-assets-nodejs.png"');
        await expect(fs.access(path.join(tempdir, 'example-com_files', 'example-com-assets-nodejs.png'))).resolves.toBeUndefined();
    });

    test('imagen falla y pagina se guarda igual', async () => {
        const fixtureHtml = `<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <title>Test</title>
  </head>
  <body>
    <img src="/assets/nodejs.png" alt="Node.js" />
  </body>
</html>`;

        nock('https://example.com')
            .get('/')
            .reply(200, fixtureHtml);

        nock('https://example.com')
            .get('/assets/nodejs.png')
            .replyWithError('Network error');

        const filePath = await downloader('https://example.com', tempdir);
        const htmlContent = await fs.readFile(filePath, 'utf-8');

        expect(htmlContent).toContain('src="example-com_files/example-com-assets-nodejs.png"');
    });
    
    test('descarga recursos adicionales', async () => {
        const fixtureHtml = `<!DOCTYPE html>
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
</html>`;

        nock('https://example.com')
            .get('/')
            .reply(200, fixtureHtml);
        nock('https://example.com')
            .get('/assets/application.css')
            .reply(200, 'fake-css-content', { 'Content-Type': 'text/css' });
        nock('https://example.com')
            .get('/cursos')
            .reply(200, 'fake-canonical-content');
        nock('https://example.com')
            .get('/assets/professions/nodejs.png')
            .reply(200, Buffer.from('fake-png-data'), { 'Content-Type': 'image/png' });
        nock('https://example.com')
            .get('/packs/js/runtime.js')
            .reply(200, Buffer.from('fake-js-data'), { 'Content-Type': 'application/javascript' });

        const filePath = await downloader('https://example.com', tempdir);
        const htmlContent = await fs.readFile(filePath, 'utf-8');

        expect(htmlContent).toContain('href="example-com_files/example-com-assets-application.css"');
        expect(htmlContent).toContain('src="example-com_files/example-com-packs-js-runtime.js"');
        await expect(fs.access(path.join(tempdir, 'example-com_files', 'example-com-assets-application.css'))).resolves.toBeUndefined();
        await expect(fs.access(path.join(tempdir, 'example-com_files', 'example-com-packs-js-runtime.js'))).resolves.toBeUndefined();
    });
});  
