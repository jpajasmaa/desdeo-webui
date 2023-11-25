<script lang="ts">
  import GDMNautilusBar from "$lib/components/visual/preference-interaction/GDMNautilusBar.svelte";
  // import HorizontalBar from "$lib/components/visual/preference-interaction/HorizontalBar.svelte";
  import HorizontalBarWithInputs from "$lib/components/visual/preference-interaction/HorizontalBarWithInputs.svelte";

  // import { onMount } from "svelte";
  // let aspirationValue: number;
  // $: aspirationValue = -2;
  // $: selectedValue = 2;
  // let bar: HorizontalBar;
  // $: selectedValue2 = 2;
  // let bar2: HorizontalBar;
  // let chartDiv: HTMLDivElement
</script>

<!-- Horizontal bars with inputs -->
<div class="container">
  <div
    id="hori"
    style="width: 60vh; height: 2vh; min-height: 70px; margin-top: 2m; margin-bottom: 5em; margin-left: 5em;"
  >
    <GDMNautilusBar
      reachableRanges={[-10, 10]}
      higherBound={10}
      lowerBound={-10}
      aspirationValue={8}
      currentValue={9.21398}
      objIndex={0}
      iteration={0}
      arrowMode={false}
    />
  </div>
  <div
    id="hori"
    style="width: 60vh; height: 2vh; min-height: 70px; margin-top: 2m; margin-bottom: 5em; margin-left: 5em;"
  >
    <GDMNautilusBar
      reachableRanges={[-9, 7]}
      higherBound={10}
      lowerBound={-10}
      aspirationValue={4}
      currentValue={5.21398}
      objIndex={0}
      iteration={1}
      arrowMode={false}
    />
  </div>
  <div
  id="hori"
  style="width: 60vh; height: 2vh; min-height: 70px; margin-top: 2m; margin-bottom: 5em; margin-left: 5em;"
>
  <GDMNautilusBar
    reachableRanges={[3, 6]}
    higherBound={10}
    lowerBound={1}
    aspirationValue={1}
    currentValue={2.21398}
    objIndex={0}
    iteration={2}
    arrowMode={false}
  />
</div>
</div>

<!-- <div>
  <Example></Example>
</div> -->
<style>
  /* A scrollable div where height is the height of the screen*/

  .container {
    height: 100vh;
    min-width: max-content;
    overflow: scroll;
  }
</style>
