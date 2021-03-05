import { IAssetStats } from "./App";

export const getStockChartTitle = (
  assetStats: IAssetStats[],
  investment: number
) => {
  const minDateStat = assetStats.reduce((a, b) => (a.date < b.date ? a : b));
  const maxDateStat = assetStats.reduce((a, b) => (a.date > b.date ? a : b));
  if (!investment) return;
  const profit =
    Math.round(((maxDateStat.close * investment) / minDateStat.close) * 100) /
    100;

  return `If you invested ${investment}$ in stocks that are closed ${minDateStat.date} with a value of ${minDateStat.close}$ and ${maxDateStat.date} close value is ${maxDateStat.close} - this means that you would have ${profit}$.`;
};
