# FOSSGIS 2022 OpenLayers Slides

## Developing

    npm install
    npm run dev

To edit the slides, modify `index.html`. Each example has its separate `.html` file in the project root. The JavaScript sources are in the `src/` folder. Static assets are expected to be found in the `public/` folder. Example data resides in the `public/data/` folder.

## Publishing

1. Run `npm run build`
1. Run `npm run preview`
1. Browse to http://localhost:5000/?print-pdf
1. Print using the browser's Print dialog and save to PDF, using `dist/openlayers.pdf` as file location
1. Run `npm run publish`