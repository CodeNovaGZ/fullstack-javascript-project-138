#!/usr/bin/env node

import { Command } from 'commander';
import downloader from '../src/downloader.js';

const program = new Command();

program
    .name('downloader')
    .description('Cargador de paginas web')
    .argument('<url>', 'URL de la página web a descargar')
    .option('-o, --output <path>', 'Ruta de salida para el archivo descargado', process.cwd())
    .option('-c, --concurrent <number>', 'Número de descargas concurrentes', '3')
    .version('1.0.0')
    .action((url, options) => {
        downloader(url, options.output, { concurrent: parseInt(options.concurrent) })
        .then((filePath) => {
            console.log(`Archivo descargado en: ${filePath}`);
        })
        .catch((error) => {
            console.error(error.message);
            process.exit(1);
        });
    });

program.parse();

