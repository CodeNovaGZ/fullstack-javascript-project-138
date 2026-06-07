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
        await expect(downloader('https://example.com', tempdir)).rejects.toThrow('Network error');
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
});
