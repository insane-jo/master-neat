import './config';

import {createChart, CandlestickSeries, HistogramSeries, LineData, LineSeries} from 'lightweight-charts';
import {getBarsData} from "./get-bars-data";
import {stddev} from "./stddev";
import {getPointsSet} from "./get-points-set";

const setupExample = async () => {
  const chart = ((window as unknown as any).chart = createChart('chart', {
    autoSize: true,
  }));

  const barsData = await getBarsData();

  let candlesData = barsData.bars;
  let volumesData = barsData.volumes;


  let stddevSrcData = barsData.bars.map((v) => v.close).reverse();
  const stddevData = stddev(stddevSrcData, 5);

  stddevSrcData = stddevSrcData.reverse();

  while (!stddevData[0] && stddevData.length) {
    stddevSrcData.shift();
    stddevData.shift();
    candlesData.shift();
    volumesData.shift();
  }

  const lowerBandData: LineData[] = [];
  const upperBandData: LineData[] = [];
  const middleBandData: LineData[] = [];

  for (let i = 0, l = stddevData.length - 1; i <= l; i++) {
    // we get current upper and lower band and apply it to the next candle (using timestamp)
    const middleValue = stddevSrcData[i];
    const stdDevValue = stddevData[i];

    const time = candlesData[i].time;

    lowerBandData.push({
      value: middleValue - 2 * stdDevValue,
      time
    });

    upperBandData.push({
      value: middleValue + 2 * stdDevValue,
      time
    });

    middleBandData.push({
      value: middleValue,
      time
    });
  }

  // // Because we shifted arr of stddev to the right - we're removing blank data
  // candlesData.shift();
  // volumesData.shift();

  console.log(candlesData.length, candlesData);
  console.log(volumesData.length, volumesData);
  console.log(stddevData.length, stddevData);
  console.log(lowerBandData.length, lowerBandData);
  console.log(upperBandData.length, upperBandData);

  // Settingup chart series
  (() => {
    // Adding bbands
    const upperBandSeries = chart.addSeries(LineSeries, {
      lineWidth: 1
    });
    upperBandSeries.setData(upperBandData);
    const lowerBandSeries = chart.addSeries(LineSeries, {
      lineWidth: 1
    });
    lowerBandSeries.setData(lowerBandData);
    const middleBandSeries = chart.addSeries(LineSeries, {
      lineWidth: 1
    });
    middleBandSeries.setData(middleBandData);

    // setup candles
    const candleSeries = chart.addSeries(CandlestickSeries);
    candleSeries.setData(candlesData);
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
    volumeSeries.setData(volumesData);
  })();

  const pointsSet = getPointsSet({
    candles: candlesData,
    volumes: volumesData,
    lowerBand: lowerBandData,
    upperBand: upperBandData,
    middleBand: middleBandData
  });

  console.log(pointsSet.length, pointsSet);

  (window as any).NETWORK_INPUT_AMOUNT = pointsSet[0].input.length;

  const delimiterIdx = Math.round(pointsSet.length * 0.75);
  (window as any).TRAINING_SET = pointsSet.slice(0, delimiterIdx);
  (window as any).TEST_SET = pointsSet.slice(delimiterIdx);

  // return new Promise(() => {
  // });
};

export const readyPromise = setupExample();
