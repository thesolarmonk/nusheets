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
            :class="{ 'cell--selected': cell.state, 'cell--active': cell.state == 2}"
            v-for="(cell, n_col) in row"
            :id="n_row + '_' + n_col"
            :key="n_row + '_' + n_col"
            :data-row="n_row"
            :data-column="n_col"
            @mousedown="c_selectStart(n_row, n_col)"
            @mouseover="c_selecting(n_row, n_col)"
            @mouseup="c_selectEnd()"
            @dblclick="c_inputStart(n_row, n_col)"
          >
            <input
              v-if="cell.state"
              class="cell__input"
              type="text"
              v-model="c_exp"
              autocomplete="off"
              @focus="c_inputStart(n_row, n_col)"
              @blur="c_inputEnd()"
              @click.stop
            />
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
      s_rows: 500,
      s_cols: 10,
      s_data: null,
      s_state: null,
      s_state_null: null,
      c_pos: {
        row: 0,
        col: 0
      },
      c_exp: null,
      mouseDown: false
    };
  },
  computed: {
    c_data: function() {
      return this.s_data[this.c_pos.row][this.c_pos.col];
    },
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
            exp: null,
            eval: null,
            state: 0
          };
        })
      );
      this.s_state = Array.from({ length: this.s_rows }, () =>
        Array.from({ length: this.s_cols }, () => 0)
      );
      this.s_state_null = this.s_state;
    },
    c_selectStart(n_row, n_col) {
      this.mouseDown = true;
      this.s_state = this.s_state_null;

      this.s_data[this.c_pos.row][this.c_pos.col].state = 0;
      this.c_pos = { row: n_row, col: n_col };
      this.c_exp = this.s_data[n_row][n_col].eval;
      this.s_data[n_row][n_col].state = 1;
    },
    c_selecting(n_row, n_col) {
      if (this.mouseDown) {
        this.s_state = this.s_state_null;

        let min_row = Math.min(n_row, this.c_pos.row);
        let min_col = Math.min(n_col, this.c_pos.col);
        let max_row = Math.max(n_row, this.c_pos.row);
        let max_col = Math.max(n_col, this.c_pos.col);

        for (let i = min_row; i <= max_row; i++) {
          for (let j = min_col; j <= max_col; j++) {
            this.s_state[i][j] = 1;
          }
        }
      }
    },
    c_selectEnd() {
      this.mouseDown = false;
      this.s_state = this.s_state_null;
    },
    c_inputStart(n_row, n_col) {
      this.c_selectStart(n_row, n_col);
      this.s_data[n_row][n_col].state = 2;
      this.c_exp = this.s_data[n_row][n_col].exp;

      let input = document.getElementsByClassName("c_input")[0];
      input.focus();
      input.selectionStart = input.selectionEnd;
      input.scrollLeft = input.scrollWidth;
    },
    c_inputEnd() {
      let input = document.getElementsByClassName("c_input")[0];
      input.blur();

      let result = this.evaluateExp(this.c_exp);

      this.s_data[this.c_pos.row][this.c_pos.col].state = 1;
      this.s_data[this.c_pos.row][this.c_pos.col].exp = this.c_exp;
      this.s_data[this.c_pos.row][this.c_pos.col].eval = result;

      // this.c_exp = result;
    },
    evaluateExp: function(exp) {
      let result;

      if (this.c_exp[0] === "=") {
        let exp_var;

        try {
          exp_var = this.evaluateVariables(exp);
        } catch (error) {
          result = "#ERROR!";
        }

        try {
          result = eval(exp_var.substring(1));
        } catch (error) {
          result = "#ERROR!";
        }
      } else {
        result = exp;
      }

      return result;
    },
    evaluateVariables: function(exp) {
      exp = exp.toUpperCase();

      let re_rows = /(?<=[A-Z]{1})[0-9]{1,}/g;
      let cell_row_nums = exp.match(re_rows);

      console.log(cell_row_nums);

      if (cell_row_nums === null) {
        return exp;
      }

      let re_cols = /[A-Z]{1}(?=[0-9]{1,})/g;
      let cell_col_letters = exp.match(re_cols);
      let cell_col_nums = cell_col_letters.map(
        col => col.toUpperCase().charCodeAt(0) - 65
      );

      let cells = cell_row_nums.length;
      let exp_new = exp;
      let exp_prev;
      let exp_temp;

      for (let i = 0; i < cells; i++) {
        let value = this.s_data[cell_row_nums[i] - 1][cell_col_nums[i]].eval;
        if (value === null) value = 0;
        let re = new RegExp(cell_col_letters[i] + cell_row_nums[i]);

        exp_prev = exp_new;
        exp_new = exp_prev.replace(re, value);
        exp_temp = "";
        while (exp_prev != exp_new) {
          exp_temp = exp_new;
          exp_new = exp_prev.replace(re, value);
          exp_prev = exp_temp;
        }
      }

      return exp_new;
    }
    // updateTableData: state => {}
  },
  mounted() {
    this.createTable();
    document.addEventListener("keydown", this.handleKeyEvent, false);
    this.c_selectStart(0, 0);
    this.mouseDown = false;
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

        &:hover {
          background-color: #ddd;
        }

        .cell__input {
          width: 100%;

          border: none;
          display: inline;
          font-family: inherit;
          font-size: inherit;
          padding: none;
          background-color: transparent;

          &:focus {
            outline: none;
          }
        }
      }

      .cell--selected {
        background-color: rgb(172, 238, 255) !important;
      }

      .cell--active {
        box-shadow: 1px 1px 4px 1px rgb(0, 68, 255);
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
