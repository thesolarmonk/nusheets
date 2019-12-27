<template>
  <div class="sheet-container">
    <table class="sheet">
      <tbody>
        <tr class="sheet__row">
          <th class="cell cell--header cell--column-header cell--corner"></th>
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

<style lang="scss" scoped>
.sheet-container {
  max-width: 100%;
  max-height: 100%;

  .sheet {
    position: relative;
    border-collapse: collapse;
    overflow-x: auto;

    .cell {
      border: 1px solid #666;

      width: 120px;
      min-width: 100px;
      height: 30px;

      vertical-align: middle;
      padding: 3px;
    }

    .cell--header {
      text-align: center;

          font-size: var(--font-size-small);
          font-weight: var(--font-weight-bold);
          background-color: var(--secondary-color);
        }

        .cell--row-header {
          position: sticky;
          left: 0;
        }

        .cell--column-header {
          position: sticky;
          top: 0;
        }

        .cell--corner {
          position: sticky;
          left: 0;
          z-index: 1;
        }

        .cell:last-child {
          border-right-width: 0px;
        }

        &:last-child {
          .cell {
            border-bottom-width: 0px;
          }
        }
      }
    }
  }
}

.sheet__container {
  &::-webkit-scrollbar-track {
    background-color: var(--primary-color);
    border: 1px solid var(--primary-color-dark);
  }

  &::-webkit-scrollbar {
    width: 15px;
    height: 15px;
    background-color: var(--primary-color);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--primary-color-dark);
  }

  &::-webkit-scrollbar-corner {
    background-color: var(--primary-color-dark);
  }
}
</style>
