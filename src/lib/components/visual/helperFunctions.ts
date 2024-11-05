import type { EChartOption, EChartsType } from "echarts";

export function handleClickSelection(
  chart: EChartsType,
  params: {
    dataIndex: number;
    componentType: string;
    seriesIndex: number;
    data: { value: number[] };
  },
  selectedIndices: number[],
  maxSelections: number | undefined
) {
  // Check if selectedIndices already contains the index of the clicked solution
  if (selectedIndices.includes(params.dataIndex)) {
    // If it does, remove it from the array (to unselect it)
    selectedIndices.splice(selectedIndices.indexOf(params.dataIndex), 1);
  } else {
    // If it doesn't, add it to the array
    selectedIndices = [...selectedIndices, params.dataIndex];
  }
  if (maxSelections == undefined) {
    // TODO: #32 This evaluates to the number of objectives. This is clearly not what we want. FIX THIS!
    maxSelections = params.data.value.length;
  }
  if (maxSelections == 1) {
    // If only one index can be selected, any click should be interpreted as selecting that index.
    selectedIndices = [params.dataIndex];
  }
  if (selectedIndices.length > maxSelections) {
    selectedIndices.splice(selectedIndices.indexOf(params.dataIndex), 1);
    // let chart = params.
    chart.setOption({
      tooltip: {
        show: true,
        trigger: "item",
        formatter: () => {
          return "Maximum number of selections are selected.";
        },
        borderColor: "red",
        textStyle: {
          color: "red",
        },
      },
    });
    // chart.dispatchAction({
    //   type: "showTip",
    //   // seriesIndex: 0,
    //   // dataIndex: params.dataIndex,
    //   x:0,
    //   y:0,
    // });
    setTimeout(function () {
      chart.dispatchAction({
        type: "hideTip",
        // seriesIndex: 0,
        // dataIndex: params.dataIndex,
      });
      chart.setOption({
        tooltip: {
          formatter: tooltipFormatter,
          borderColor: "",
          textStyle: {
            color: "",
          },
        },
      });
    }, 2000);
  } else {
    chart.setOption({
      tooltip: {
        formatter: tooltipFormatter,
      },
    });
  }
  return selectedIndices;
}

export function handleHighlightChange(
  chart: EChartsType,
  highlightedIndex: number | undefined
) {
  if (highlightedIndex === undefined) {
    // highlightedIndex = -1;
    chart.dispatchAction({
      type: "downplay",
      seriesIndex: 0,
    });
  } else {
    chart.dispatchAction({
      type: "highlight",
      seriesIndex: 0,
      dataIndex: highlightedIndex,
    });
  }
  chart.setOption({
    tooltip: {
      formatter: tooltipFormatter,
      borderColor: "",
      textStyle: {
        color: "",
      },
    },
  });
  return chart;
}

export function handleSelectionChange(
  chart: EChartsType,
  selectedIndices: number[],
  maxSelections: number | undefined
) {
  if (maxSelections == undefined) {
    maxSelections = selectedIndices.length;
  }
  if (selectedIndices.length <= maxSelections) {
    chart.dispatchAction({
      type: "unselect",
      seriesIndex: 0,
      dataIndex: getChartModel(chart).getSeries()[0].getSelectedDataIndices(),
    });
    chart.dispatchAction({
      type: "select",
      seriesIndex: 0,
      dataIndex: selectedIndices,
    });
    if (selectedIndices.length < maxSelections) {
      // Downplay all after selection, for selection to show
      chart.dispatchAction({
        type: "downplay",
        seriesIndex: 0,
      });
    }
  }

  return chart;
}

/**
 * Returns the model of a chart. This function exists so that ts-ignore doesn't
 * have to be mentioned in every file where getModel() is used.
 *
 * @param chart Chart instance to get the model from
 * @returns
 */
export function getChartModel(chart: EChartsType) {
  /* Explanation of the code line below:
                // Gets the model of parallelAxis component, which has all the axes as an array.
                const model = getChartModel(chart).getComponent("parallelAxis");
                // Gets the axesLayot which has the position info of every parallel axes
                const axes = model.coordinateSystem._axesLayout
                // Gets the x-coordinate of the i:th axis 
                const xCoord = Object.values(axes)[index].position[0] 
                */
  // TODO: How to get info needed without getModel. This is a private method and it can break in the future!!https://github.com/apache/echarts/issues/16479
  //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore -- getModel is a private method

  return chart.getModel();
}

/**
 * A helper function that returns the y coordinate of the axis at the given
 * index.
 *
 * @param minimize - A boolean value that indicates if the indicator is for
 *   representing minimization.
 * @param index - The index of the axis.
 */
export function getAxisY(
  minimize: boolean,
  index: number,
  chart: echarts.EChartsType
): number {
  const parallelAxisComponent = getChartModel(
    chart as echarts.EChartsType
  ).getComponent("parallelAxis");
  if (minimize) {
    const axesLayout = parallelAxisComponent.coordinateSystem._axesLayout;
    const singleAxisObject = Object.values(axesLayout)[index] as {
      position: [number, number];
    };
    return singleAxisObject.position[1];
  } else {
    return parallelAxisComponent.coordinateSystem.getRect().y;
  }
}

/**
 * A helper function that returns the x-coordinate of the axis at the given
 * index.
 *
 * @param minimize - A boolean value that indicates if the indicator is for
 *   representing minimization.
 * @param index - The index of the axis.
 */
export function getAxisX(index: number, chart: echarts.EChartsType): number {
  const parallelAxisComponent = getChartModel(
    chart as echarts.EChartsType
  ).getComponent("parallelAxis");
  const axesLayout = parallelAxisComponent.coordinateSystem._axesLayout;
  const singleAxisObject = Object.values(axesLayout)[index] as {
    position: [number, number];
  };
  return singleAxisObject.position[0];
}

export function tooltipFormatter(
  params:
    | EChartOption.Tooltip.Format
    | EChartOption.Tooltip.Format[]
    | undefined
) {
  const newParams: EChartOption.Tooltip.Format =
    params as EChartOption.Tooltip.Format;
  let result = newParams.name + "<br>";
  if (newParams.data.value) {
    for (let i = 0; i < newParams.data.value.length; i++) {
      result += newParams.data.value[i] + "<br>";
      //"Objective: " + i +" " +
    }
  } else {
    result = "";
    for (let i = 0; i < newParams.data.length; i++) {
      result += newParams.data[i] + "<br>";
    }
  }
  return result;
}

/**
 * Rounds a number to the given number of decimals. If no precision is given, it
 * gets the number of decimals from the original number.
 *
 * @param num - The number to round
 * @param precicion - The number of decimals to round to
 * @returns The rounded number
 */
export function roundToDecimal(num: number, precicion: number | undefined) {
  if (precicion === undefined) {
    precicion = getDecimalCount(num);
  }
  return Number.parseFloat(num.toFixed(precicion));
}

/**
 * Gets the number of decimals in a number
 *
 * @param num - The number to get the number of decimals from
 * @returns The number of decimals in the number
 */
function getDecimalCount(num: number) {
  if (Math.floor(num) === num) return 0;
  return num.toString().split(".")[1].length || 0;
}
