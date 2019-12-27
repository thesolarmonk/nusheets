<template>
  <div class="sheet-container">
    <table class="sheet">
      <tbody>
        <tr class="sheet__row">
          <th class="cell cell--corner"></th>
          <th
            class="cell cell--header cell--column-header"
            v-for="(col, n_col) in col_headers"
            :key="n_col"
          >{{ col }}</th>
        </tr>
        <tr class="sheet__row" v-for="(row, n_row) in s_data" :key="n_row">
          <th class="cell cell--header cell--row-header">{{ n_row + 1 }}</th>
          <td
            class="cell cell--data"
            v-for="(cell, n_col) in row"
            :key="n_row + '_' + n_col"
            :data-row="n_row"
            :data-column="n_col"
          >{{ s_data[n_row][n_col] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
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
