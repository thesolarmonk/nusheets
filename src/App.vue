<template>
  <div class="app fill-viewport">
    <router-view />
  </div>
</template>

<script>
import { mapMutations } from "vuex";

export default {
  methods: {
    ...mapMutations(["restore"])
  },
  mounted() {
    this.restore();
  }
};
</script>

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

@mixin theme-light() {
  --primary-color: #fff;
  --secondary-color: rgb(230, 230, 230);
  --accent-color: rgb(172, 238, 255);
  --accent-color-light: rgb(227, 249, 255);
  --primary-color-invert: #666;

  --font-color: #000;
  --icon-color: invert(0%) sepia(98%) saturate(21%) hue-rotate(62deg)
    brightness(90%) contrast(100%);
}

@mixin theme-dark() {
  --primary-color: #000;
  --secondary-color: #444;
  --accent-color: rgb(57, 166, 255);
  --accent-color-light: rgb(124, 194, 252);
  --primary-color-invert: #666;

  --font-color: #fff;
  --icon-color: invert(99%) sepia(87%) saturate(0%) hue-rotate(321deg)
    brightness(117%) contrast(101%);
}

/* App Layout */

html,
body,
.app {
  background-color: var(--primary-color);
  z-index: 0;

  font: var(--font-style-default) var(--font-weight-normal)
    var(--font-size-default) var(--font-family);
}

.app {
  overflow: hidden;
}

.fill-viewport {
  width: 100vw;
  height: 100vh;
}

/* App Theme Preference */

:root {
  .theme-light {
    @include theme-light();
  }

  .theme-dark {
    @include theme-dark();
  }
}

// @media (prefers-color-scheme: light) {
//   :root {
//     @include theme-light();
//   }
// }

// @media (prefers-color-scheme: dark) {
//   :root {
//     @include theme-dark();
//   }
// }
</style>
