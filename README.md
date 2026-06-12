### Hexlet tests and linter status:
[![Actions Status](https://github.com/CodeNovaGZ/fullstack-javascript-project-138/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/CodeNovaGZ/fullstack-javascript-project-138/actions)[![Node.js CI](https://github.com/CodeNovaGZ/fullstack-javascript-project-138/actions/workflows/node.js.yml/badge.svg)](https://github.com/CodeNovaGZ/fullstack-javascript-project-138/actions/workflows/node.js.yml)[![Maintainability](https://qlty.sh/gh/CodeNovaGZ/projects/fullstack-javascript-project-138/maintainability.svg)](https://qlty.sh/gh/CodeNovaGZ/projects/fullstack-javascript-project-138)[![Code Coverage](https://qlty.sh/gh/CodeNovaGZ/projects/fullstack-javascript-project-138/coverage.svg)](https://qlty.sh/gh/CodeNovaGZ/projects/fullstack-javascript-project-138)

# page-loader

Cargador de páginas web. Descarga una página y sus recursos locales (imágenes, CSS, JS) y reescribe los enlaces para que apunten a los archivos descargados.

## Instalación

```bash
npm install -g @hexlet/code
```

## Uso

```bash
page-loader [options] <url>
```

### Opciones

- `-o, --output <path>` — Directorio de salida (default: directorio actual)
- `-c, --concurrent <number>` — Descargas concurrentes (default: 3)
- `-V, --version` — Muestra la versión

### Ejemplo

```bash
page-loader --output /tmp https://example.com
Archivo descargado en: /tmp/example-com.html
```

[![asciicast](https://asciinema.org/a/El0TBXBUiadKcEfH.svg)](https://asciinema.org/a/El0TBXBUiadKcEfH)

[![asciicast](https://asciinema.org/a/4Ctmcah8A9ajBFwf.svg)](https://asciinema.org/a/4Ctmcah8A9ajBFwf)

[![asciicast](https://asciinema.org/a/aKk3saX1dhRza2Gs.svg)](https://asciinema.org/a/aKk3saX1dhRza2Gs)

[![asciicast](https://asciinema.org/a/oYu03woPzA4FgBfP.svg)](https://asciinema.org/a/oYu03woPzA4FgBfP)

[![asciicast](https://asciinema.org/a/p2pUAKWac3Lq9hdm.svg)](https://asciinema.org/a/p2pUAKWac3Lq9hdm)

[![asciicast](https://asciinema.org/a/W0vqKsN8gLTC4yd9.svg)](https://asciinema.org/a/W0vqKsN8gLTC4yd9)