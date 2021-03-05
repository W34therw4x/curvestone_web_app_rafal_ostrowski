import React, { useEffect, useState } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Indicators from "highcharts/indicators/indicators-all.js";
import DragPanes from "highcharts/modules/drag-panes.js";
import AnnotationsAdvanced from "highcharts/modules/annotations-advanced.js";
import PriceIndicator from "highcharts/modules/price-indicator.js";
import FullScreen from "highcharts/modules/full-screen.js";
import StockTools from "highcharts/modules/stock-tools.js";
import { IAssetStats } from "./App";
import "./stockchart.css";
import { getStockChartTitle } from "./stock-helpers";

Indicators(Highcharts);
DragPanes(Highcharts);
AnnotationsAdvanced(Highcharts);
PriceIndicator(Highcharts);
FullScreen(Highcharts);
StockTools(Highcharts);

export interface Props {
  assetStats: IAssetStats[];
  assetName: string;
  investment?: number;
}

export const StockChart: React.FC<Props> = ({
  assetStats,
  assetName,
  investment,
}: Props) => {
  const [options, setOptions] = useState<Highcharts.Options>();

  useEffect(() => {
    const series: Highcharts.SeriesOptionsType = {
      type: "ohlc",
      id: `${assetName}-ohlc`,
      name: assetName,
      data: [],
    };

    for (const stat of assetStats) {
      series.data!.push([
        stat.date,
        stat.open,
        stat.high,
        stat.low,
        stat.close,
      ]);
    }

    const options: Highcharts.Options = {
      title: {
        text: investment
          ? getStockChartTitle(assetStats, investment)
          : assetName,
      },
      chart: { height: 700 },
      yAxis: [
        {
          labels: {
            align: "left",
          },
          height: "80%",
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: "left",
          },
          top: "80%",
          height: "20%",
          offset: 0,
        },
      ],
      tooltip: {
        shape: "square",
        headerShape: "callout",
        borderWidth: 0,
        shadow: false,
      },
      series: [series],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 800,
            },
            chartOptions: {
              rangeSelector: {
                inputEnabled: false,
              },
            },
          },
        ],
      },
    };
    setOptions(options);
  }, []);
  return (
    <>
      {options ? (
        <HighchartsReact highcharts={Highcharts} options={options} />
      ) : (
        <div />
      )}
    </>
  );
};
