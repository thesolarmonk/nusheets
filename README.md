# NuSHEETS

![NuSHEETS Demo](/cover.gif)

#### Project setup

```
npm install
```

#### Compiles and hot-reloads for development

```
npm run serve
```

#### Compiles and minifies for production

```
npm run build
```

#### Deployed to Netlify (with continuous deployment)

URL: https://nusheets.netlify.com/

## Frameworks + Tools

- Vue.js project (managed using Vue CLI)
- NPM for package and dependency management
- Sass as a CSS pre-processor
- Babel as a Javascript compiler
- Webpack for module bundler
- ESLint for a code linter

## Code Style and Formatting

- Javascript: Airbnb JavaScript Style Guide
- CSS: BEM (Blocks, Elements and Modifiers) naming convention
- Prettier: Basic code fomatting

## Features

#### Spreadsheet

- Spreadsheet based on HTML `<table>`
- Row and column headers are "sticky" on scroll
- Input data/formulas into cells, with formula evaluation
- Formula bar shows the formula for the selected cell
- Drag to resize rows and columns

#### Formulas and Expressions

- Input formulas into cells with "=", or directly enter them in the formula bar
- Once cell input complete (pressing enter or selecting away), the expression is evaluated
- All basic math expressions supported: +, -, /, \*, %, ^
- Nested expressions with brackets supported
- Cell references: evalute cell references in formulas
  - Example: `= 10 * A1`
- Prevent circular referencing in formulas
- Detect and throw `#ERROR!` if detected

#### Selection

- Drag to select a group of cells
- Actions on cell selection contents:
  - Cut/copy (to clipboard), paste (from clipboard), delete

#### Styling

- Hierarchical styling in Sass using BEM class naming convention
- General styling inspiration from Google Sheets
- Typography
  - Font-family: Inter UI, a great open source font made especially for UI design
- Toggle between dark and light UI modes (easy to implement using CSS variables)
- Option to set the theme according to OS prefrences
  - Example: macOS system wide dark/light mode

#### Save/Restore

- Save sheet data to browser LocalStorage
- Restore sheet data from LocalStorage on app load
- Autosave sheet data every minute
- Reset/remove sheet data from LocalStorage

#### Performance Issues

- Problem

  - Vue.js performance takes a hit when updating and painting lots of DOM elements and traversing the DOM tree.
  - The spreadsheet significantly slows down with more cells (1000 x 20 = 20,000) as there are too many cells to traverse in the DOM tree even though all of them are not displayed in the viewport.
  - This is reason for not including cell selections in the 20,000 cell spreadsheet (branch: no-selection), as it significantly reduces performace.
  - This is a drawback more specific to Vue.js which does not handle large DOM trees well. React.js on the other hand has much better performace in this case.

- Solutions
  - Using React.js would be the primary solution as it is the best production-ready alternative to Vue.js available right now.
  - Another promising alternative is a an upcoming front-end framework, Svelt which is significantly faster than both React and Vue.js due to an its extremely efficent updates. However, this framework is still premature and not production ready yet.
    - [Svelte Philosophy - Talk](https://www.youtube.com/watch?v=AdNJ3fydeao)
  - The best option would be to build the spreadsheet UI using HTML Canvas. This is the way Google Sheets is implemented and is incredibly efficient as it only renders the cells in the viewport and does not need to keep a whole table DOM tree in memory.

#### Future Improvements

- Add other common spreadsheet features
  - Sorting columns
  -
- Formula Dependency
  - As multiple cells can refer to other cells, a dependency graph of formulas must be built so that the whole sheet can be updated appropriately.
  - A depth first search (DFS) can be run recursively to get a list of all cells that depend on the modified ones. These cells can be marked as 'dirty' and their values can be evaluated in order.
- Save/Restore State
  - LocalStorage is a great way to store a small amount of data to the browser (2-10 MB), but the browser's IndexedDB can store alot more data that can be retrieved more efficiently. This could be used as a storage mechanism when the database grows beyond the scope of LocalStorage.

#### Mouse and Keyboard Actions

- Select cell: click
- Start cell input: <kbd>ENTER</kbd>
- End cell input: <kbd>ESC</kbd>
- Navigate spreadsheet
  - Up: <kbd>&uarr;</kbd>
  - Down: <kbd>&darr;</kbd>
  - Left: <kbd>&larr;</kbd> or <kbd>SHIFT</kbd> + <kbd>TAB</kbd>
  - Right: <kbd>&rarr;</kbd> or <kbd>TAB</kbd>
- Save sheet data: <kbd>CTRL</kbd>/<kbd>⌘</kbd></kbd>+<kbd>S</kbd>
- Reset sheet data: <kbd>CTRL</kbd>/<kbd>⌘</kbd></kbd>+<kbd>E</kbd>
- Selection
  - Cut: <kbd>CTRL</kbd>/<kbd>⌘</kbd></kbd>+<kbd>X</kbd>
  - Copy: <kbd>CTRL</kbd>/<kbd>⌘</kbd></kbd>+<kbd>C</kbd>
  - Paste: <kbd>CTRL</kbd>/<kbd>⌘</kbd></kbd>+<kbd>V</kbd>
  - Delete: <kbd>DELETE</kbd>
  - Deselect: <kbd>ESC</kbd>
- Toggle theme: <kbd>CTRL</kbd>/<kbd>⌘</kbd></kbd>+<kbd>D</kbd>
