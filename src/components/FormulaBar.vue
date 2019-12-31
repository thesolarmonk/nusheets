<template>
  <div class="spreadsheet__bar" :class="theme">
    <img class="bar__formula-icon" src="../assets/fx.svg" />
    <input class="bar__formula-bar" :class="theme" type="text" v-model="c_exp" />
    <button class="bar__toggle-theme" :class="theme" @click="toggleTheme()">
      <i class="fas fa-adjust"></i>
    </button>
  </div>
</template>

<script>
export default {
  props: ["theme", "light_theme", "c_exp"],
  methods: {
    toggleTheme() {
      this.$parent.$emit("toggle-theme", !this.light_theme);
    }
  }
};
</script>

<style lang="scss" scoped>
.spreadsheet__bar {
  width: 100%;
  height: 50px;
  background-color: var(--primary-color);
  padding: 10px 10px 10px 5px;

  display: flex;
  flex-flow: row nowrap;

  .bar__formula-icon {
    flex-basis: 60px;
    width: 20px;
    padding: 5px;

    filter: var(--icon-color);
  }

  .bar__formula-bar {
    flex-grow: 1;
    border-radius: 10px;

    font-size: var(--font-size-default);

    outline: none;
    border: 1px solid var(--primary-color-invert);
    background-color: var(--secondary-color);

    margin-right: 10px;
  }
  .bar__toggle-theme {
    flex-basis: 60px;

    background-color: var(--secondary-color);
    border-radius: 10px;
    border: 1px solid var(--primary-color-invert);

    &:focus {
      outline: 0;
    }

    i {
      color: var(--font-color);
      font-size: var(--font-size-default);
      width: 100%;
    }
  }
}
</style>
