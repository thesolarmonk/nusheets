<template>
  <div class="sheet">
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  computed: {
    ...mapGetters(["s_rows", "s_cols", "s_data", "s_exp"]),
    col_headers: function() {
      return [...Array(this.s_cols).keys()].map(col =>
        String.fromCharCode(97 + col).toUpperCase()
      );
    }
  },
  methods: {
    ...mapMutations(["createTable"])
  },
  mounted() {
    this.createTable();
  }
};
</script>

<style lang="scss" scoped></style>
