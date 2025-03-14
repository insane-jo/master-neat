import { Time } from "lightweight-charts";
export type LineData = {
    time: Time;
    value: number;
};
export type CandleData = {
    time: Time;
    high: number;
    low: number;
    close: number;
    open: number;
};
export type BarsData = {
    bars: CandleData[];
    volumes: LineData[];
};
export declare const generateBarsData: () => Promise<BarsData>;
