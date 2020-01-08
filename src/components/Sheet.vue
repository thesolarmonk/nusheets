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
            :class="{ 'cell--selected': cell.state, 'cell--active': cell.state == 2, 'cell-selection': s_selected[n_row][n_col]}"
            v-for="(cell, n_col) in row"
            :key="n_row + '_' + n_col"
            :data-row="n_row"
            :data-column="n_col"
            @mousedown="c_selectStart(n_row, n_col)"
            @mouseover="c_selecting(n_row, n_col)"
            @mouseup="c_selectEnd()"
          >
            <!-- @dblclick="c_inputStart(n_row, n_col)"
            -->
            <input
              v-if="cell.state"
              class="cell__input"
              type="text"
              v-model="c_exp"
              autocomplete="off"
              disabled
              @click.stop
            />
            <!-- @blur="c_inputEnd()"
            @focus="c_inputStart(n_row, n_col)"-->
            <span v-else>{{ cell.eval }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { mapGetters } from "vuex";
import _ from "../../node_modules/lodash";

export default {
  data() {
    return {
      s_rows: 50,
      s_cols: 10,
      s_data: null,
      s_selected: null,
      s_selected_empty: null,
      c_pos: {
        row: 0,
        col: 0
      },
      c_selection: {
        row: 0,
        col: 0
      },
      // c_exp: null,
      // c_eval: null,
      mouseDown: false,
      sheetKey: 0
    };
  },
  computed: {
    ...mapGetters(["c_data", "c_exp", "c_eval", "saved_data"]),
    c_input: function() {
      if (this.c_state === 1) {
        return this.c_eval;
      } else {
        return this.c_exp;
      }
    },
    sel_min_row: function() {
      return Math.min(this.c_selection.row, this.c_pos.row);
    },
    sel_min_col: function() {
      return Math.min(this.c_selection.col, this.c_pos.col);
    },
    sel_max_row: function() {
      return Math.max(this.c_selection.row, this.c_pos.row);
    },
    sel_max_col: function() {
      return Math.max(this.c_selection.col, this.c_pos.col);
    },
    // c_data: function() {
    //   return this.s_data[this.c_pos.row][this.c_pos.col];
    // },
    c_state() {
      return this.s_data[this.c_pos.row][this.c_pos.col].state;
    },
    col_headers: function() {
      return [...Array(this.s_cols).keys()].map(col =>
        String.fromCharCode(97 + col).toUpperCase()
      );
    }
  },
  methods: {
    ...mapMutations(["save", "restore"]),
    handleKeyEvent(e) {
      let keys = [];
      keys[e.keyCode] = true;

      // Enter
      if (keys[13]) {
        if (this.c_state == 1) {
          this.c_inputStart(this.c_pos.row, this.c_pos.col);
        } else {
          this.c_inputEnd(this.c_exp);
        }
        e.preventDefault();
      }

      // Escape
      else if (keys[27]) {
        this.c_inputEnd(this.c_exp);
        this.c_clear_selection();
        e.preventDefault();
      }

      // Tab Left
      else if (keys[9] && e.shiftKey) {
        this.c_selectStart(this.c_pos.row, Math.max(this.c_pos.col - 1, 0));
        e.preventDefault();
      }

      // Tab Left
      else if (keys[9] && !e.shiftKey) {
        this.c_selectStart(
          this.c_pos.row,
          Math.min(this.c_pos.col + 1, this.s_cols - 1)
        );
        e.preventDefault();
      }

      if (this.c_state !== 2) {
        // Delete
        if (keys[8]) {
          this.c_delete_selection();
          this.update_c_exp(null);
          this.update_c_eval(null);
          e.preventDefault();
        }

        // Cut (Ctrl or Cmd + X)
        else if ((e.ctrlKey || e.metaKey) && keys[88]) {
          this.c_copy_selection(true);
          e.preventDefault();
        }

        // Copy (Ctrl or Cmd + C)
        else if ((e.ctrlKey || e.metaKey) && keys[67]) {
          this.c_copy_selection(false);
          e.preventDefault();
        }

        // Paste (Ctrl or Cmd + V)
        else if ((e.ctrlKey || e.metaKey) && keys[86]) {
          this.c_paste_selection();
          e.preventDefault();
        }

        // Arrow Left
        else if (keys[37]) {
          this.c_selectStart(this.c_pos.row, Math.max(this.c_pos.col - 1, 0));
          e.preventDefault();
        }

        // Arrow Up
        else if (keys[38]) {
          this.c_selectStart(Math.max(this.c_pos.row - 1, 0), this.c_pos.col);
          e.preventDefault();
        }

        // Arrow Right
        else if (keys[39]) {
          this.c_selectStart(
            this.c_pos.row,
            Math.min(this.c_pos.col + 1, this.s_cols - 1)
          );
          e.preventDefault();
        }

        // Arrow Down
        else if (keys[40]) {
          this.c_selectStart(
            Math.min(this.c_pos.row + 1, this.s_rows - 1),
            this.c_pos.col
          );
          e.preventDefault();
        }

        // Save (Ctrl or Cmd + S)
        else if ((e.ctrlKey || e.metaKey) && keys[83]) {
          this.saveState();
          e.preventDefault();
        }

        // Toggle Theme (Ctrl or Cmd + D)
        else if ((e.ctrlKey || e.metaKey) && keys[68]) {
          this.toggleTheme();
          e.preventDefault();
        }

        // Alphanumeric
        else if (
          ((event.keyCode >= 48 && event.keyCode <= 57) ||
            (event.keyCode >= 65 && event.keyCode <= 90)) &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          this.c_inputStart(this.c_pos.row, this.c_pos.col);
        }

        // Special Characters
        else {
          let chars = "=`~!@#$%^&*()_-+{}[]|:;'\"<>,.?/\\".split("");
          let check_pressed = chars.reduce(
            (pressed, key) => pressed + (e.key == key ? 1 : 0),
            0
          );

          if (check_pressed) {
            this.c_inputStart(this.c_pos.row, this.c_pos.col);
          }
        }
      }
    },
    c_selectStart(n_row, n_col) {
      if (this.c_data.state == 2) {
        this.c_inputEnd(this.c_exp);
      }
      this.mouseDown = true;
      this.c_clear_selection();

      if (!this.s_data[n_row][n_col].state) {
        this.s_data[this.c_pos.row][this.c_pos.col].state = 0;
        this.c_pos = { row: n_row, col: n_col };
        this.c_exp = this.c_data.eval;
        this.s_data[n_row][n_col].state = 1;
      }
    },
    c_selecting(n_row, n_col) {
      if (
        this.mouseDown ||
        (n_row == this.c_pos.row && n_col == this.c_pos.col)
      ) {
        this.c_clear_selection();

        let min_row = Math.min(n_row, this.c_pos.row);
        let min_col = Math.min(n_col, this.c_pos.col);
        let max_row = Math.max(n_row, this.c_pos.row);
        let max_col = Math.max(n_col, this.c_pos.col);

        for (let i = min_row; i <= max_row; i++) {
          for (let j = min_col; j <= max_col; j++) {
            this.s_selected[i][j] = true;
          }
        }
      }
    },
    c_selectEnd() {
      this.mouseDown = false;
    },
    c_clear_selection() {
      this.s_selected = _.cloneDeep(this.s_selected_empty);
    },
    c_inputStart(n_row, n_col) {
      if (!this.c_data.state) {
        this.c_selectStart(n_row, n_col);
      }
      this.s_data[n_row][n_col].state = 2;
      this.c_exp = this.c_data.exp;

      let input = document.getElementsByClassName("cell__input")[0];
      input.disabled = false;
      input.focus();
      input.selectionStart = input.selectionEnd;
      input.scrollLeft = input.scrollWidth;
    },
    c_inputEnd(exp) {
      let input = document.getElementsByClassName("cell__input")[0];
      input.disabled = true;
      input.blur();

      let result = null;
      if (exp) {
        result = this.evaluateExp(exp);
      }

      this.s_data[this.c_pos.row][this.c_pos.col].state = 1;
      this.s_data[this.c_pos.row][this.c_pos.col].exp = exp;
      this.s_data[this.c_pos.row][this.c_pos.col].eval = result;

      this.c_exp = result;
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

      if (typeof result == "number") {
        if (!Number.isInteger(result)) {
          result = result.toFixed(2);
        }
      }
      return result;
    },
    evaluateVariables: function(exp) {
      exp = exp.toUpperCase();

      let re_rows = /(?<=[A-Z]{1})[0-9]{1,}/g;
      let cell_row_nums = exp.match(re_rows);

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
    },
    c_copy_selection(cut) {
      let selection = [];

      for (let i = this.sel_min_row; i <= this.sel_max_row; i++) {
        selection[i - this.sel_min_row] = [];
        for (let j = this.sel_min_col; j <= this.sel_max_col; j++) {
          // eslint-disable-next-line prettier/prettier
          selection[i - this.sel_min_row][j - this.sel_min_col] = this.s_data[
            i
          ][j];
        }
      }

      navigator.clipboard.writeText(JSON.stringify(selection));

      if (cut) {
        this.c_delete_selection();
      }

      // this.c_selectStart(this.c_pos.row, this.c_pos.col);
    },
    c_paste_selection() {
      navigator.clipboard.readText().then(selectionText => {
        let selection = JSON.parse(selectionText);
        let n_rows = selection.length;
        let n_cols = selection[0].length;
        for (let i = 0; i < n_rows; i++) {
          for (let j = 0; j < n_cols; j++) {
            selection[i][j].state = 0;
            this.s_data[this.c_pos.row + i][this.c_pos.col + j] =
              selection[i][j];
          }
        }
      });

      // this.c_selectStart(this.c_pos.row, this.c_pos.col);
      this.sheetKey++;
    },
    c_delete_selection() {
      for (let i = this.sel_min_row; i <= this.sel_max_row; i++) {
        for (let j = this.sel_min_col; j <= this.sel_max_col; j++) {
          this.s_data[i][j].eval = null;
          this.s_data[i][j].exp = null;
          this.s_data[i][j].state = 0;
        }
      }
      this.c_selectStart(this.c_pos.row, this.c_pos.col);
    },
    createTable() {
      this.s_rows = 50;
      this.s_cols = 20;
      this.s_data = Array.from({ length: this.s_rows }, () =>
        Array.from({ length: this.s_cols }, () => {
          return {
            exp: null,
            eval: null,
            state: 0
          };
        })
      );
      this.s_selected_empty = Array(this.s_rows)
        .fill()
        .map(() => Array(this.s_cols).fill(false));
      this.c_clear_selection();
    },
    saveState() {
      this.save({
        s_rows: this.s_rows,
        s_cols: this.s_cols,
        s_data: this.s_data
      });

      console.log("Sheet data autosaved.");
    },
    restoreState(restoredData) {
      this.s_rows = restoredData.s_rows;
      this.s_cols = restoredData.s_cols;
      this.s_data = restoredData.s_data;

      this.s_selected_empty = Array(this.s_rows)
        .fill()
        .map(() => Array(this.s_cols).fill(false));
      this.c_clear_selection();
    }
    // updateTableData: state => {}
  },
  mounted() {
    this.restore();
    if (this.saved_data) {
      this.restoreState(this.saved_data);
    } else {
      this.createTable();
    }

    document.addEventListener("keydown", this.handleKeyEvent, false);
    this.c_selectStart(0, 0);
    this.mouseDown = false;

    window.setInterval(() => {
      this.saveState();
    }, 60000);
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
  overflow-x: auto;

  .sheet__table {
    width: 100%;
    // table-layout: fixed;

    position: relative;
    border-collapse: collapse;
    word-wrap: break-all;

    .sheet__row {
      width: 100%;

      .cell {
        user-select: none;

        box-sizing: border-box;
        border: 1px solid #666;
        min-width: var(--column-width-default);
        width: var(--column-width-default);
        height: var(--row-height-default);

        vertical-align: middle;
        padding: 3px 3px 3px 7px;

        color: var(--font-color);
        background-color: var(--primary-color);

        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
          // background-color: var(--secondary-color);
        }

        div {
          width: var(--column-width-default);
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .cell__input {
          width: 100%;
          // height: 100%;

          border: none;
          display: block;
          font-family: inherit;
          font-size: inherit;
          padding: none;
          margin: none;
          background-color: transparent;

          &:focus {
            outline: none;
          }
        }
      }

      .cell--selected {
        background-color: var(--accent-color) !important;
      }

      .cell-selection {
        background-color: var(--accent-color-light);
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
        min-width: var(--row-header-width-default) !important;
        width: var(--row-header-width-default) !important;
        position: sticky;
        left: 0;

        resize: vertical;
      }

      .cell--column-header {
        min-width: var(--column-width-default);
        padding: 0;
        position: sticky;
        top: 0;

        div {
          resize: horizontal;
          overflow: auto;
          min-width: var(--column-width-default);
          display: block;
          margin: 0;
          padding: 0;

          width: auto;
          height: auto;
        }
      }

      .cell--corner {
        width: var(--row-header-width-default);
        position: sticky;
        left: 0;
        z-index: 1;

        resize: none;
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
    border: 1px solid var(--primary-color-invert);
  }

  &::-webkit-scrollbar {
    width: 15px;
    height: 15px;
    background-color: var(--primary-color);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--primary-color-invert);
  }

  &::-webkit-scrollbar-corner {
    background-color: var(--font-color);
  }
}
</style>
