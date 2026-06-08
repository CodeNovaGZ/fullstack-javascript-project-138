import axios from 'axios';
import * as fs  from 'fs/promises';
import path from 'path';
import {URL} from 'url';
import * as cheerio from 'cheerio';


export default function downloader(url, outputDir) {
    const fileName = getFileName(url);
    const filePath = path.join(outputDir, `${fileName}`);
    return axios.get(url)
        .then(({data}) => {
            return cheerio.load(data);
        })
        .then(($)=>{
            return fs.mkdir(path.join(outputDir, getPrefixPage(url)+'_files'), {recursive: true})
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
                return {$, resources}; 
            })  
        })
        .then(({$, resources})=>{
            return Promise.all(resources.map((resource)=>{
                return axios.get(resource.urlComplete, {responseType: 'arraybuffer'})
                .then(({data})=>{
                    return fs.writeFile(path.join(outputDir, getPrefixPage(url)+'_files', resource.nameFile), data)
                })
                .catch((error)=>{
                    console.error(`Error al descargar recurso ${resource.urlComplete}: ${error.message}`);
                })
                .then(()=>{
                    $(resource.elemento).attr(resource.attr, path.join(getPrefixPage(url)+'_files', resource.nameFile));
                })
            }))
            .then(()=>{
                return fs.writeFile(filePath, $.html());
            })
        })
        .then(()=>{
            return filePath;
        })
        .catch((error)=>{
            throw new Error(`Error al descargar la página: ${error.message}`);
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