import axios from 'axios';
import * as fs  from 'fs/promises';
import path from 'path';
import {URL} from 'url';

export default function downloader(url, outputDir) {
    const fileName = getFileName(url);
    const filePath = path.join(outputDir, `${fileName}`);
    return axios.get(url)
        .then(({data}) => {
            return fs.writeFile(filePath, data);
        }).then(() => {
            return filePath;
        });
}

function getFileName(url) {
    const {hostname, pathname} = new URL(url);
    const name = `${hostname}${pathname}`;
    return name.replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') + '.html'; 
}