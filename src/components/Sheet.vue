<template>
  <div class="sheet__container">
    <table class="sheet__table">
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
            :class="{ 'cell--active': cell.state }"
            v-for="(cell, n_col) in row"
            :id="n_row + '_' + n_col"
            :key="n_row + '_' + n_col"
            :data-row="n_row"
            :data-column="n_col"
            @click="clickCell(n_row, n_col)"
          >
            <input v-if="cell.state" class="cell__input" type="text" v-model="c_active" />
            <span v-else>{{ cell.eval }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      s_rows: 2000,
      s_cols: 10,
      s_data: null,
      c_active: {
        row: 0,
        col: 0
      }
    };
  },
  computed: {
    col_headers: function() {
      return [...Array(this.s_cols).keys()].map(col =>
        String.fromCharCode(97 + col).toUpperCase()
      );
    }
  },
  methods: {
    handleKeyEvent(e) {
      let keys = [];
      keys[e.keyCode] = true;

      switch (e.keyCode) {
        //Delete
        case 8:
          this.s_data[this.c_pos.row][this.c_pos.col].exp = null;
          this.s_data[this.c_pos.row][this.c_pos.col].eval = null;
          this.c_exp = null;
          e.preventDefault();
          break;

        // Tab
        case 9:
          if (keys[16]) {
            this.c_selectStart(this.c_pos.row, Math.max(this.c_pos.col - 1, 0));
          } else {
            this.c_selectStart(
              this.c_pos.row,
              Math.min(this.c_pos.col + 1, this.s_cols - 1)
            );
          }
          e.preventDefault();
          break;

        // Enter
        case 13:
          if (this.c_data.state == 1) {
            this.c_inputStart(this.c_pos.row, this.c_pos.col);
          } else {
            this.c_inputEnd();
          }
          break;

        // Escape
        case 27:
          this.c_inputEnd();
          break;

        // Left Arrow
        case 37:
          this.c_selectStart(this.c_pos.row, Math.max(this.c_pos.col - 1, 0));
          e.preventDefault();
          break;

        // Up Arrow
        case 38:
          this.c_selectStart(Math.max(this.c_pos.row - 1, 0), this.c_pos.col);
          e.preventDefault();
          break;

        // Right Arrow
        case 39:
          this.c_selectStart(
            this.c_pos.row,
            Math.min(this.c_pos.col + 1, this.s_cols - 1)
          );
          e.preventDefault();
          break;

        // Down Arrow
        case 40:
          this.c_selectStart(
            Math.min(this.c_pos.row + 1, this.s_rows - 1),
            this.c_pos.col
          );
          e.preventDefault();
          break;
      }
    },
    createTable() {
      this.s_data = Array.from({ length: this.s_rows }, () =>
        Array.from({ length: this.s_cols }, () => {
          return {
            exp: 4895,
            eval: 4895,
            state: 0
          };
        })
      );
    },
    clickCell(n_row, n_col) {
      this.s_data[this.c_active.row][this.c_active.col].state = 0;
      this.c_active = { row: n_row, col: n_col };
      this.c_exp;
      this.s_data[n_row][n_col].state = 1;
    }
    // updateCellExp: (state, payload) => {
    //   state.s_exp[payload.row][payload.column] = payload.value;
    // }
    // updateTableData: state => {}
  },
  mounted() {
    this.createTable();
    document.addEventListener("keydown", this.handleKeyEvent, false);
    this.clickCell(0, 0);
  }
};
</script>

<style lang="scss" scoped>
.sheet__container {
  --column-width-default: 120px;
  --row-height-default: 30px;
  --row-header-width-default: 50px;

  width: 100%;
  height: 100%;
  overflow: scroll;

  .sheet__table {
    width: 100%;

    position: relative;
    border-collapse: collapse;

    .sheet__row {
      .cell {
        user-select: none;

        box-sizing: border-box;
        border: 1px solid #666;
        width: var(--column-width-default);
        height: var(--row-height-default);

        vertical-align: middle;
        padding: 3px 3px 3px 7px;

        .cell__input {
          width: 100%;
        }
      }

      .cell--active {
        background-color: rgb(172, 238, 255);
      }

      .cell--header {
        text-align: center;

        font-size: var(--font-size-small);
        font-weight: var(--font-weight-bold);
        background-color: var(--secondary-color);
      }

      .cell--row-header {
        width: var(--row-header-width-default);
        position: sticky;
        left: 0;
      }

      .cell--column-header {
        position: sticky;
        top: 0;
      }

      .cell--corner {
        width: var(--row-header-width-default);
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
