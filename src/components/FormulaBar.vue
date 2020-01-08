<template>
  <div class="spreadsheet__bar" :class="theme">
    <img class="bar__formula-icon" src="../assets/fx.svg" />
    <input
      class="bar__formula-bar"
      :class="theme"
      type="text"
      :value="c_exp"
      @input="forumulaChange"
    />
    <button class="bar__toggle-theme" :class="theme" @click="toggleTheme">
      <i class="fas fa-adjust"></i>
    </button>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapMutations } from "vuex";

export default {
  props: ["theme"],
  computed: {
    ...mapGetters(["c_exp"])
  },
  methods: {
    ...mapMutations(["update_c_exp", "toggleTheme"]),
    forumulaChange: function(event) {
      this.update_c_exp(event.target.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.spreadsheet__bar {
  width: 100%;
  height: 50px;
  padding: 10px 10px 10px 5px;

  background-color: var(--primary-color);
  border: 1px solid var(--primary-color-invert);

  display: flex;
  flex-flow: row nowrap;

  .bar__formula-icon {
    flex-basis: 60px;
    width: 20px;
    padding: 5px;

    filter: var(--icon-color);
  }

  .bar__formula-bar {
    flex-grow: 1;
    border-radius: 6px;

    font-size: var(--font-size-default);
    color: var(--font-color);

    outline: none;
    border: 1px solid var(--primary-color-invert);
    background-color: var(--secondary-color);

    padding-left: 10px;
    margin-right: 10px;
  }

  .bar__toggle-theme {
    flex-basis: 60px;

    background-color: var(--secondary-color);
    border-radius: 6px;
    border: 1px solid var(--primary-color-invert);

    &:focus {
      outline: 0;
    }

    i {
      color: var(--font-color);
      font-size: var(--font-size-default);
      width: 100%;
    }
  }
}
</style>
