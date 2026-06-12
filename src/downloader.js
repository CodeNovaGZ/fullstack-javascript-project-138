import axios from 'axios';
import * as fs  from 'fs/promises';
import path from 'path';
import {URL} from 'url';
import * as cheerio from 'cheerio';
import debug from 'debug';
import Listr from 'listr';

const log = debug('page-loader');

export default function downloader(url, outputDir, options = {}) {
    const concurrent = options.concurrent ? Number(options.concurrent) : 3;
    const fileName = getFileName(url);
    const filePath = path.join(outputDir, `${fileName}`);
    log('Descargando página: %s', url);
    return axios.get(url, {validateStatus: (status) => status === 200})
        .catch((error) => {
            if(error.response) {
                throw new Error(`Error al descargar la página: ${error.response.status} ${error.response.statusText}`);
            }
            if(error.request) {
                throw new Error(`Error al descargar la página: No se recibió respuesta del servidor`);
            }
            throw new Error(`Error al descargar la página: ${error.message}`);
        })
        .then(({data}) => {
            return cheerio.load(data);
        })
        .then(($)=>{
            return fs.access(outputDir)
            .catch(()=>{
                throw new Error(`Error con el directorio de recursos: ${outputDir}`);
            })
            .then(()=>{
            return fs.mkdir(path.join(outputDir, getPrefixPage(url)+'_files'), {recursive: true})
            .catch((error)=>{
                throw new Error(`Error al crear el directorio de recursos: ${error.message}`);
            })
            .then(()=>{
                const resources = [];
                const tags = [
                    {tag: 'img[src]', attr: 'src'},
                    {tag: 'link[href]', attr: 'href'},
                    {tag: 'script[src]', attr: 'src'},
                ]
                const pageHostName = new URL(url).hostname;
                tags.forEach(({tag, attr}) => {
                    $(tag).each((i, el) => {
                        const src = $(el).attr(attr);
                        const urlObj = new URL(src, url);
                        if (urlObj.hostname !== pageHostName) {
                            return;
                        }
                        resources.push({
                            srcOriginal: src,
                            urlComplete: urlObj.href,
                            nameFile: getResourceFileName(urlObj.href),
                            elemento: el, 
                            attr,
                        })
                    })
                })
                log('Recursos encontrados: %d', resources.length);
                return {$, resources}; 
            }) 
        })}
        )
        .then(({$, resources})=>{
            const tasks = resources.map((resource) => ({
                title: resource.nameFile,
                task: () => axios.get(resource.urlComplete, {responseType: 'arraybuffer', validateStatus: (status) => status === 200})
                    .then(({data})=>{
                        log('Recurso descargado: %s', resource.urlComplete);
                        return fs.writeFile(path.join(outputDir, getPrefixPage(url)+'_files', resource.nameFile), data);
                    })
                    .catch((error)=>{
                        if(error.response) {
                            log(`Error al descargar recurso ${resource.urlComplete}: ${error.response.status} ${error.response.statusText}`);
                            console.error(`Error al descargar recurso ${resource.urlComplete}: ${error.response.status} ${error.response.statusText}`);
                        } else if(error.request) {
                            log(`Error al descargar recurso ${resource.urlComplete}: No se recibió respuesta del servidor`);
                            console.error(`Error al descargar recurso ${resource.urlComplete}: No se recibió respuesta del servidor`);
                        } else {
                            log(`Error al descargar recurso ${resource.urlComplete}: ${error.message}`);
                            console.error(`Error al descargar recurso ${resource.urlComplete}: ${error.message}`);
                        }
                    })
                    .then(()=>{
                        $(resource.elemento).attr(resource.attr, path.join(getPrefixPage(url)+'_files', resource.nameFile));
                    }),
            }));
            const listr = new Listr(tasks, {concurrent});
            return listr.run().then(()=>{
                log('Todos los recursos han sido procesados, escribiendo archivo HTML...');
                return fs.writeFile(filePath, $.html());
            });
        })
        .then(()=>{
            return filePath;
        })    
}


function getPrefixPage(url) {
    const {hostname, pathname} = new URL(url);
    const name = `${hostname}${pathname}`;
    return name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''); 
}

function getFileName(url) {
    const prefixName = getPrefixPage(url);
    return `${prefixName}.html`;
}

function getResourceFileName(resourceSrc) {
    const parsed = new URL(resourceSrc);
    const ext = path.extname(parsed.pathname); // ".png"
    const urlWithoutExt = resourceSrc.replace(ext, '');
    const transformed = getPrefixPage(urlWithoutExt);
    return `${transformed}${ext}`;
}