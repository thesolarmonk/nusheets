<template>
  <div class="app">
    <router-view />
  </div>
</template>

<style lang="scss">
/* CSS Reset */
@import "./styles/_reset.scss";

/* Font Imports */
@import url("https://rsms.me/inter/inter.css");
html {
  font-family: "Inter", sans-serif;
}

/* Font Settings */

* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Layout Settings */

* {
  box-sizing: border-box;
  -webkit-overflow-scrolling: touch;
}

/* CSS Global Style Variables */

:root {
  --background-color-default: #fff;
  --primary-color: #fff;
  --primary-color-dark: rgb(230, 230, 230);
  --accent-color: rgb(41, 111, 252);

  --font-color-default: #000;

  --font-family: "Inter", sans-serif;
  --font-style-default: normal;
  --font-size-default: 14px;
  --font-size-small: 12px;
  --font-weight-normal: 400;
  --font-weight-bold: 600;

  --font-line-height-default: 1;
  --font-letter-spacing-default: -0.003rem;
  --font-word-spacing-default: -0.2rem;
  --font-variant-ligatures: none;
}

/* App Layout */

html,
body,
.app {
  background-color: var(--background-color-default);
  z-index: 0;

  font-size: var(--font-size-default);
  overflow: scroll;
}

.app {
  width: 100vw;
  height: 100vh;
}
</style>
