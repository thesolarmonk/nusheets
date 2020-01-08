<template>
  <div class="spreadsheet fill-viewport">
    <formula-bar :theme="theme"></formula-bar>
    <sheet :class="theme"></sheet>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import FormulaBar from "../components/FormulaBar.vue";
import Sheet from "../components/Sheet.vue";

export default {
  components: {
    FormulaBar,
    Sheet
  },
  computed: {
    ...mapGetters(["theme"])
  }
};
</script>

<style lang="scss" scoped>
.spreadsheet {
  display: flex;
  flex-flow: column nowrap;

  .spreadsheet__bar {
    flex-grow: 1;
  }

  .sheet__container {
    flex-basis: 95%;
  }
}
</style>
