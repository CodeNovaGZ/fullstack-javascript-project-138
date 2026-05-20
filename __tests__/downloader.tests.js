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
        expect(content).toBe('Hello, world!');
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
});