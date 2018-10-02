# un-diver

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Generate HTML2Canvas screenshots
This task will generate screenshots of HTML elements for canvas, it launches 2 servers:
* the regular webpack dev server with a special option for website adaptations for screenshots (remove 3D experience)
* a node server with [Puppeteer](https://github.com/GoogleChrome/puppeteer) to generate the screenshots of HTML elements

It will ouput the screenshots to `public/images/screenshots` folder.
```
npm run screenshot
```
