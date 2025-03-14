import { CandleData, LineData } from "../common/generate-bars-data";
type PointData = {
    input: number[];
    output: number[];
};
type PointDataSource = {
    candles: CandleData[];
    volumes: LineData[];
    upperBand: LineData[];
    lowerBand: LineData[];
    middleBand: LineData[];
};
export declare const getPointsSet: (data: PointDataSource) => PointData[];
export {};
