import {createChart, CandlestickSeries, HistogramSeries} from 'lightweight-charts';
import {getBarsData} from "./get-bars-data";

const setupExample = async () => {
  const chart = ((window as unknown as any).chart = createChart('chart', {
    autoSize: true,
  }));

  const barsData = await getBarsData();

  // setup candles
  const candleSeries = chart.addSeries(CandlestickSeries);
  const data = barsData.bars;
  candleSeries.setData(data);

  // setup volumes
  const volumeSeries = chart.addSeries(HistogramSeries, {
    priceFormat: {
      type: 'volume',
    },
    priceScaleId: '', // set as an overlay by setting a blank priceScaleId
  });
  volumeSeries.priceScale().applyOptions({
    // set the positioning of the volume series
    scaleMargins: {
      top: 0.7, // highest point of the series will be 70% away from the top
      bottom: 0,
    },
  });
  volumeSeries.setData(
    barsData.volumes
  );

  return new Promise(() => {});
};

export const readyPromise = setupExample();
