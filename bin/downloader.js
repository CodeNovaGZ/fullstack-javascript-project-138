#!/usr/bin/env node

import { Command } from 'commander';
import downloader from '../src/downloader.js';

const program = new Command();

program
    .name('downloader')
    .description('Cargador de paginas web')
    .argument('<url>', 'URL de la página web a descargar')
    .option('-o, --output <path>', 'Ruta de salida para el archivo descargado', process.cwd())
    .version('1.0.0')
    .action((url, options) => {
        downloader(url, options.output)
        .then((filePath) => {
            console.log(`Archivo descargado en: ${filePath}`);
        })
        .catch((error) => {
            console.error(`Error al descargar la página: ${error.message}`);
        });
    });

program.parse();

