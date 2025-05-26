import {LineData} from 'lightweight-charts';
import {getBarsData} from "./get-bars-data";
import {stddev} from "./stddev";
import {getPointsSet} from "./get-points-set";
import {GROUP_DATA_BY_DAYS, TRAIN_TEST_SPLIT_RATIO} from "./config";
import {BarsData} from "../common/generate-bars-data";

const setupExample = async () => {
  const barsData = await getBarsData(GROUP_DATA_BY_DAYS);

  const processBarsData = (data: BarsData) => {
    let candlesData = data.bars;
    let volumesData = data.volumes;

    let stddevSrcData = data.bars.map((v) => v.close).reverse();
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

    const delimiterIdx = Math.round(data.bars.length * TRAIN_TEST_SPLIT_RATIO);
    // const trainSet = pointsSet.slice(0, delimiterIdx);
    // const testSet = pointsSet.slice(delimiterIdx);

    const trainSet = getPointsSet({
      candles: candlesData.slice(0, delimiterIdx),
      volumes: volumesData.slice(0, delimiterIdx),
      lowerBand: lowerBandData.slice(0, delimiterIdx),
      upperBand: upperBandData.slice(0, delimiterIdx),
      middleBand: middleBandData.slice(0, delimiterIdx)
    });

    const testSet = getPointsSet({
      candles: candlesData.slice(delimiterIdx),
      volumes: volumesData.slice(delimiterIdx),
      lowerBand: lowerBandData.slice(delimiterIdx),
      upperBand: upperBandData.slice(delimiterIdx),
      middleBand: middleBandData.slice(delimiterIdx)
    });

    // (window as any).NETWORK_INPUT_AMOUNT = pointsSet[0].input.length;

    return {
      trainSet, testSet
    }
  };

  const processedData = barsData
    .map((collection) => processBarsData(collection));

  const result = processedData
    .reduce((res, curr) => {
      res.trainSet = res.trainSet.concat(curr.trainSet);
      res.testSet = res.testSet.concat(curr.testSet);

      return res;
    }, {
      trainSet: [],
      testSet: []
    });

  return result;
};

export const readyPromise = setupExample();
