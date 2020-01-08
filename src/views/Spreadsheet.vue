<template>
  <div class="spreadsheet fill-viewport">
    <!-- <formula-bar :theme="theme"></formula-bar> -->
    <sheet :class="theme"></sheet>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

// import FormulaBar from "../components/FormulaBar.vue";
import Sheet from "../components/Sheet.vue";

export default {
  components: {
    // FormulaBar,
    Sheet
  },
  computed: {
    ...mapGetters(["theme"])
  }
};
</script>

<style lang="scss" scoped>
</style>
