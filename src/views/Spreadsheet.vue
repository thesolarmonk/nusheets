<template>
  <div class="spreadsheet fill-viewport">
    <formula-bar></formula-bar>
    <sheet></sheet>
  </div>
</template>

<script>
import FormulaBar from "../components/FormulaBar.vue";
import Sheet from "../components/Sheet.vue";

export default {
  components: {
    FormulaBar,
    Sheet
  }
};
</script>

<style lang="scss" scoped>
</style>
