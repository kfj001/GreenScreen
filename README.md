# GreenScreen

Simulates a unix-like terminal using HTML, CSS, and JavaScript.

## Critical files
- `src/index.html` — application root and markup. See [src/index.html](src/index.html)
- `src/scripts/script.js` — application entrypoint. See [src/scripts/script.js](src/scripts/script.js)
- `src/css/styles.css` — styles and animations. See [src/css/styles.css](src/css/styles.css)

## Frameworks
- [`Foundation`](src/scripts/Foundation.js) — low-level DOM and animation utilities. See [src/scripts/Foundation.js](src/scripts/Foundation.js)
- [`Terminus`](src/scripts/Terminus.js) — terminal simulation and REPL logic. See [src/scripts/Terminus.js](src/scripts/Terminus.js)

## Notes
- When running inside a Devcontainer, on the successful launch of the container, a small web server will be launched with the contents of `src/` at http://localhost:8080. 
- Otherwise Open `src/index.html` in a browser to run the app.
