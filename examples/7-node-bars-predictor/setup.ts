import {LineData} from 'lightweight-charts';
import {getBarsData} from "./get-bars-data";
import {stddev} from "./stddev";
import {getPointsSet} from "./get-points-set";
import {GROUP_DATA_BY_DAYS, TRAIN_TEST_SPLIT_RATIO} from "./config";

const setupExample = async () => {
  const barsData = await getBarsData(GROUP_DATA_BY_DAYS);

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

  const pointsSet = getPointsSet({
    candles: candlesData,
    volumes: volumesData,
    lowerBand: lowerBandData,
    upperBand: upperBandData,
    middleBand: middleBandData
  });

  // (window as any).NETWORK_INPUT_AMOUNT = pointsSet[0].input.length;

  const delimiterIdx = Math.round(pointsSet.length * TRAIN_TEST_SPLIT_RATIO);
  const trainingSet = pointsSet.slice(0, delimiterIdx);
  const testSet = pointsSet.slice(delimiterIdx);

  return {
    trainingSet, testSet
  }
};

export const readyPromise = setupExample();
