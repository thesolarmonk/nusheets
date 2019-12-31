<template>
  <div class="spreadsheet fill-viewport">
    <formula-bar :theme="theme" :light_theme="light_theme"></formula-bar>
    <sheet :class="theme"></sheet>
  </div>
</template>

<script>
import FormulaBar from "../components/FormulaBar.vue";
import Sheet from "../components/Sheet.vue";

export default {
  components: {
    FormulaBar,
    Sheet
  },
  data() {
    return {
      light_theme: true
    };
  },
  computed: {
    theme: function() {
      return this.light_theme ? "theme-light" : "theme-dark";
    }
  },
  created() {
    this.$on("toggle-theme", t => {
      this.light_theme = t;
    });
  }
};
</script>

<style lang="scss" scoped>
</style>
