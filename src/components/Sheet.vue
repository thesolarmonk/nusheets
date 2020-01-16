<template>
  <div class="sheet__container">
    <table class="sheet__table">
      <tbody>
        <!-- Column Headers -->
        <tr class="sheet__row">
          <th class="cell cell--header cell--column-header cell--corner"></th>
          <th
            class="cell cell--header cell--column-header"
            v-for="(col, n_col) in col_headers"
            :key="n_col"
          >
            <div>{{ col }}</div>
          </th>
        </tr>
        <tr class="sheet__row" v-for="(row, n_row) in s_data" :key="n_row">
          <!-- Row Headers -->
          <th class="cell cell--header cell--row-header">{{ n_row + 1 }}</th>
          <!-- Cells -->
          <td
            class="cell cell--data"
            :class="{ 'cell--selected': cell.state, 'cell--active': cell.state == 2, 'cell-selection': s_selected[n_row][n_col]}"
            v-for="(cell, n_col) in row"
            :key="'index_'+ n_row + '_' + n_col"
            :data-row="n_row"
            :data-column="n_col"
            @mousedown="c_selectStart(n_row, n_col)"
            @mouseover="c_selecting(n_row, n_col)"
            @mouseup="c_selectEnd()"
          >
            <!-- Cells Input -->
            <input
              v-if="cell.state"
              class="cell__input"
              type="text"
              :value="c_input"
              autocomplete="off"
              disabled
              @click.stop
              @input="c_inputChange"
            />
            <div v-else>{{ cell.eval }}</div>
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
  // Local State variables for Sheet component
  data() {
    return {
      // Sheet dimensions
      s_rows: 50,
      s_cols: 20,

      // Sheet cell data
      s_data: null,

      // Sheet cell selection
      s_selected: null,
      s_selected_empty: null,

      // Co-ordinates of currently seleted cell
      c_pos: {
        row: 0,
        col: 0
      },
      c_selection: {
        row: 0,
        col: 0
      },

      // Check for mouse-drag
      mouseDown: false
    };
  },
  computed: {
    // Getters for global State data
    ...mapGetters(["c_data", "c_exp", "c_eval", "saved_data"]),

    // Getters for the data and state of the currently selected cell
    c_input: function() {
      if (this.c_state === 1) {
        return this.c_eval;
      } else {
        return this.c_exp;
      }
    },
    c_state() {
      return this.s_data[this.c_pos.row][this.c_pos.col].state;
    },

    // Generate alphabet column header labels
    col_headers: function() {
      return [...Array(this.s_cols).keys()].map(col =>
        String.fromCharCode(97 + col).toUpperCase()
      );
    },

    // Calculate the  boundary of the cell selection
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
    }
  },
  watch: {
    //  Update component State when new cell selected
    c_pos: function(new_pos) {
      this.update_c(this.s_data[new_pos.row][new_pos.col]);
    }
  },
  methods: {
    //  Methods to modify global App State
    ...mapMutations([
      "save",
      "restore",
      "reset",
      "update_c",
      "update_c_eval",
      "update_c_exp",
      "toggleTheme"
    ]),

    // Keypress event handler
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

      // Tab Right (Shift + Tab)
      else if (keys[9] && !e.shiftKey) {
        this.c_selectStart(
          this.c_pos.row,
          Math.min(this.c_pos.col + 1, this.s_cols - 1)
        );
        e.preventDefault();
      }

      // These shortcuts only work if the current cell input is not active
      if (this.c_state !== 2) {
        // Delete selected cells
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
          // console.log("Sheet data saved.");
        }

        // Reset (Ctrl or Cmd + E)
        else if ((e.ctrlKey || e.metaKey) && keys[69]) {
          this.reset();
          e.preventDefault();
          // console.log("Sheet data reset.");
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

    // Cell Selection
    c_selectStart(n_row, n_col) {
      // Start selection on mousedown on a cell
      if (this.c_state == 2) {
        this.c_inputEnd(this.c_exp);
      }
      this.mouseDown = true;
      this.c_clear_selection();

      if (!this.s_data[n_row][n_col].state) {
        this.s_data[this.c_pos.row][this.c_pos.col].state = 0;
        this.c_pos = { row: n_row, col: n_col };
        // this.c_exp = this.c_data.exp; //CHECK
        // this.c_eval = this.c_data.eval;
        this.s_data[n_row][n_col].state = 1;
      }
    },
    c_selecting(n_row, n_col) {
      // If mouse-drag detected, update cell selection boundary
      if (
        this.mouseDown ||
        (n_row == this.c_pos.row && n_col == this.c_pos.col)
      ) {
        this.c_clear_selection();

        this.c_selection = { row: n_row, col: n_col };

        for (let i = this.sel_min_row; i <= this.sel_max_row; i++) {
          for (let j = this.sel_min_col; j <= this.sel_max_col; j++) {
            this.s_selected[i][j] = true;
          }
        }
      } else {
        this.s_selected[this.c_pos.row][this.c_pos.col] = true;
      }
    },
    c_selectEnd() {
      // Clear selection on mouse-drag end
      this.mouseDown = false;
    },
    c_clear_selection() {
      // Re-initialize selected state to clear selection (deep copy)
      this.s_selected = _.cloneDeep(this.s_selected_empty);
    },

    // Cell Selection Actions
    c_copy_selection(cut) {
      let selection = [];

      // Copy data from all cells in selection boundary
      for (let i = this.sel_min_row; i <= this.sel_max_row; i++) {
        selection[i - this.sel_min_row] = [];
        for (let j = this.sel_min_col; j <= this.sel_max_col; j++) {
          // eslint-disable-next-line prettier/prettier
          selection[i - this.sel_min_row][j - this.sel_min_col] = this.s_data[
            i
          ][j];
        }
      }

      // Copy data to OS clipboard
      navigator.clipboard.writeText(JSON.stringify(selection));

      // If cut selection, delete the data in selected cells after copy
      if (cut) {
        this.c_delete_selection();
      }

      // this.c_selectStart(this.c_pos.row, this.c_pos.col);
    },
    c_paste_selection() {
      // Read data from OS clipboard
      navigator.clipboard.readText().then(selectionText => {
        // Parse the copied data
        let selection = JSON.parse(selectionText);
        let n_rows = selection.length;
        let n_cols = selection[0].length;

        // Paste the data to all cells in selection boundary relative to currently selected cell
        for (let i = 0; i < n_rows; i++) {
          for (let j = 0; j < n_cols; j++) {
            selection[i][j].state = 0;
            this.s_data[this.c_pos.row + i][this.c_pos.col + j] =
              selection[i][j];
          }
        }
        this.c_selectStart(this.c_pos.row, this.c_pos.col);
      });
    },
    c_delete_selection() {
      // Clear the data of cells in the selection boundary
      for (let i = this.sel_min_row; i <= this.sel_max_row; i++) {
        for (let j = this.sel_min_col; j <= this.sel_max_col; j++) {
          this.s_data[i][j].eval = null;
          this.s_data[i][j].exp = null;
          this.s_data[i][j].state = 0;
        }
      }
      this.c_selectStart(this.c_pos.row, this.c_pos.col);
    },

    // Cell Input
    c_inputStart(n_row, n_col) {
      // Update cell formula on input start

      if (!this.c_state) {
        this.c_selectStart(n_row, n_col);
      }
      this.s_data[n_row][n_col].state = 2;

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

      // Evaluate cell formula on input end
      let result = null;
      if (exp) {
        result = this.evaluateExp(exp);
      }

      this.s_data[this.c_pos.row][this.c_pos.col].state = 1;
      this.s_data[this.c_pos.row][this.c_pos.col].exp = exp;
      this.s_data[this.c_pos.row][this.c_pos.col].eval = result;

      this.update_c_eval(result); //CHECK
    },
    c_inputChange: function(event) {
      // Update the value of the current cell formula in the formula bar
      this.update_c_exp(event.target.value);
    },

    // Evaluate Cell Expressions/Formulas
    evaluateExp: function(exp) {
      let result;

      // Attempt to evaluate cell exp if it starts with "="
      if (this.c_exp[0] === "=") {
        let exp_var;

        // Try to resolve any referenced cells in the formula
        try {
          exp_var = this.evaluateVariables(exp);
        } catch (error) {
          result = "#ERROR!";
        }

        // Try to evaluate the final expression
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

      // Get all cell rows in formula
      let re_rows = /(?<=[A-Z]{1})[0-9]{1,}/g;
      let cell_row_nums = exp.match(re_rows);

      if (cell_row_nums === null) {
        return exp;
      }

      // Get all cell columns in formula
      let re_cols = /[A-Z]{1}(?=[0-9]{1,})/g;
      let cell_col_letters = exp.match(re_cols);
      let cell_col_nums = cell_col_letters.map(
        col => col.toUpperCase().charCodeAt(0) - 65
      );

      // Replace all instances of cell co-ordinates with their evaluated values
      let cells = cell_row_nums.length;
      let exp_new = exp;
      let exp_prev;
      let exp_temp;

      for (let i = 0; i < cells; i++) {
        let value = this.s_data[cell_row_nums[i] - 1][cell_col_nums[i]].eval;
        if (value === null) value = 0;

        // Prevent circular referencing (cell's formula can't refer to itself)
        if (
          cell_row_nums[i] - 1 == this.c_pos.row &&
          cell_col_nums[i] == this.c_pos.col
        ) {
          value = "-/*";
        }

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

    // Manage Cell Save State
    createTable() {
      // Initlialize Sheet data
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
      // Save Sheet data to global State (and browser LocalStorage)
      this.save({
        s_rows: this.s_rows,
        s_cols: this.s_cols,
        s_data: this.s_data,
        c_pos: this.c_pos
      });

      this.c_selectStart(this.c_pos.row, this.c_pos.col);
    },
    restoreState(restoredData) {
      // Restore Sheet data from global State (and browser LocalStorage)

      this.s_rows = restoredData.s_rows;
      this.s_cols = restoredData.s_cols;
      this.s_data = restoredData.s_data;

      this.s_selected_empty = Array(this.s_rows)
        .fill()
        .map(() => Array(this.s_cols).fill(false));
      this.c_clear_selection();
    }
  },

  // Run before Sheet component is rendered
  mounted() {
    // Attempt to restore saved sheet data, else initialize a new Sheet
    this.restore();
    if (this.saved_data) {
      this.restoreState(this.saved_data);
    } else {
      this.createTable();
    }

    // Listen for keydown events
    document.addEventListener("keydown", this.handleKeyEvent, false);
    this.c_selectStart(0, 0);
    this.mouseDown = false;

    // Autosave Sheet data every 60 seconds
    window.setInterval(() => {
      this.saveState();
      // console.log("Sheet data autosaved.");
    }, 60000);
  }
};
</script>

<style lang="scss" scoped>
/* Font Imports */
@import url("https://rsms.me/inter/inter.css");
html {
  font-family: "Inter", sans-serif;
}

.sheet__container {
  // Inital cell sizes
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

    font-family: "Inter", sans-serif;

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

        font-family: "Inter", sans-serif;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

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

      // Cell States

      .cell--selected {
        input {
          color: var(--font-color);
        }
        background-color: var(--accent-color) !important;
      }

      .cell-selection {
        background-color: var(--accent-color-light);
      }

      .cell--active {
        box-shadow: 1px 1px 4px 1px rgb(0, 68, 255);
      }

      // Cell Types

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

// Custom scroll-bar styling
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
