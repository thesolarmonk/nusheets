<template>
  <div class="sheet">
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["s_rows", "s_cols", "s_data", "s_exp"])
  }
};
</script>

<style lang="scss" scoped></style>
