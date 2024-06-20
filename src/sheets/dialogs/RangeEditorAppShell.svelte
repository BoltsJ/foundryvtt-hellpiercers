<svelte:options accessors={true} />

<script>
  import { TJSApplicationShell } from "#runtime/svelte/component/core";
  // import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
  import { getContext } from "svelte";
  import { localize } from "#runtime/svelte/helper";

  export let elementRoot;

  let external = getContext("#external");

  let range = [["@"]];
  function resetGrid() {
    const i = external.application.range_index;
    range = external.application.weapon.system.range[i].rangeGrid;
  }
  resetGrid();

  /**
   * @param {string[][]} grid
   * @returns {{ row: number; col: number }[]}
   */
  function gridToArray(grid) {
    let origin = {};
    origin.i = grid.findIndex(r => r.includes("@"));
    origin.j = grid[origin.i].indexOf("@");
    let res = grid
      .flatMap((r, i) =>
        r.map((s, j) => (s === "O" ? { i: i - origin.i, j: j - origin.j } : undefined))
      )
      .filter(s => s !== undefined);
    return res;
  }
</script>

<TJSApplicationShell bind:elementRoot>
  <main>
    <div class="top">
      <button
        type="button"
        on:click={() => (range = [Array(range[0].length).fill(".")].concat(range))}
      >
        <i class="fas fa-plus"></i>
      </button>
      <button
        type="button"
        on:click={() => {
          if (!range[0].includes("@")) range = range.slice(1);
        }}
      >
        <i class="fas fa-minus"></i>
      </button>
    </div>
    <div class="center">
      <div class="left">
        <button type="button" on:click={() => (range = range.map(r => ["."].concat(r)))}>
          <i class="fas fa-plus"></i>
        </button>
        <button
          type="button"
          on:click={() => {
            if (!range.map(r => r[0]).includes("@")) range = range.map(r => r.slice(1));
          }}
        >
          <i class="fas fa-minus"></i>
        </button>
      </div>
      <div class="grid">
        {#each range as row, i}
          {#each row as space, j}
            <button
              type="button"
              on:click={() => {
                if (space === "O") range[i][j] = ".";
                if (space === ".") range[i][j] = "O";
                range = range;
              }}
              disabled={space === "@"}
            >
              {space}
            </button>
          {/each}
          <br />
        {/each}
      </div>
      <div class="right">
        <button type="button" on:click={() => (range = range.map(r => r.concat(["."])))}>
          <i class="fas fa-plus"></i>
        </button>
        <button
          type="button"
          on:click={() => {
            if (!range.map(r => r.at(-1)).includes("@")) range = range.map(r => r.slice(0, -1));
          }}
        >
          <i class="fas fa-minus"></i>
        </button>
      </div>
    </div>
    <div class="bottom">
      <button
        type="button"
        on:click={() => (range = range.concat([Array(range[0].length).fill(".")]))}
      >
        <i class="fas fa-plus"></i>
      </button>
      <button
        type="button"
        on:click={() => {
          if (!range.at(-1).includes("@")) range = range.slice(0, -1);
        }}
      >
        <i class="fas fa-minus"></i>
      </button>
    </div>
    <footer>
      <button
        type="button"
        on:click={() => {
          const i = external.application.range_index;
          const wr = external.application.weapon.system.range.map(r => r.toObject());
          wr[i].spaces = gridToArray(range);
          external.application.weapon.update({ "system.range": wr });
          external.application.close();
        }}
      >
        <i class="fas fa-save"></i>{localize("Save")}
      </button>
      <button type="button" on:click={resetGrid}>
        <i class="fas fa-undo"></i>{localize("Reset")}
      </button>
    </footer>
  </main>
</TJSApplicationShell>

<style lang="scss">
  main {
    display: flex;
    flex-direction: column;
    flex: 1 0 auto;

    div.center {
      display: flex;
      flex-direction: row;
      flex: 1 0 auto;

      div.grid {
        flex: 1 1 auto;
        button {
          width: 2rem;
          height: 2rem;
        }
      }
    }

    div.top,
    div.bottom {
      flex: 0 1 auto;
      display: flex;
      flex-direction: row;
    }
    footer {
      display: flex;
      flex-direction: row;
    }
  }
</style>
