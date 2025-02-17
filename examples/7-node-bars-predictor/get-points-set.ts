import {CandleData, LineData} from "../common/generate-bars-data";

const POINTS_PER_ITERATION = 20;
const PRICE_STEP = .01;

export type PointData = {
  input: number[];
  output: number[];
}

type PointDataSource = {
  candles: CandleData[];
  volumes: LineData[];
  upperBand: LineData[];
  lowerBand: LineData[];
  middleBand: LineData[];
}

const baseToArray = (base: number, value: number) => {
  const result = new Array(base);
  result.fill(0);
  result[value] = 1;

  return result;
};

const dayToArray = (day: number) => {
  return baseToArray(31, day);
};

const monthToArray = (month: number) => {
  return baseToArray(12, month);
};

const dowToArray = (dow: number) => {
  return baseToArray(7, dow);
}

export const getPointsSet = (data: PointDataSource): PointData[] => {
  const result: PointData[] = [];

  const priceMaxValue = Math.max(...data.upperBand.map(v => v.value)) * 1.1;
  const volumeMaxValue = Math.max(...data.volumes.map(v => v.value)) * 1.1;

  for(let i = 0, l = data.candles.length - 1; i < l; i++) {
    const currBand = data.middleBand[i];
    const nextBand = data.middleBand[i + 1];
    const currCandle = data.candles[i];
    const currVolume = data.volumes[i];

    const lowBandValue = data.lowerBand[i].value;
    const upBandValue = data.upperBand[i].value;
    const nextBandValue = nextBand.value;

    const ts = currBand.time;
    const dt = new Date(<number>ts * 1000);

    const dow = dowToArray(dt.getDay());
    const day = dayToArray(dt.getDate());
    const month = monthToArray(dt.getMonth());

    const inputTradeData = [
      currCandle.open / priceMaxValue,
      currCandle.high / priceMaxValue,
      currCandle.low / priceMaxValue,
      currCandle.close / priceMaxValue,
      currVolume.value / volumeMaxValue
    ];

    const localStep = (upBandValue - lowBandValue) / POINTS_PER_ITERATION;

    const priceCollection = new Array(POINTS_PER_ITERATION).fill(0)
      .map((_, idx) => Math.round(lowBandValue + idx * localStep));

    for(let currPrice of priceCollection) {
      const output = [+(currPrice < nextBandValue)];
      const input: number[] = [
        ...dow,
        ...day,
        ...month,
        ...inputTradeData,
        currPrice / priceMaxValue
      ];

      result.push({input, output});
    }
  }

  return result;
}
