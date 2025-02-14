import {BarsData} from "../common/generate-bars-data";
import Papa from "papaparse";
import {Time} from "lightweight-charts";

type CSVData = {
  "START_TIME": string,
  "FIRST": string,
  "HIGH": string,
  "LOW": string,
  "LAST": string,
  "VOLUME": string
}

export const getBarsData = async (): Promise<BarsData> => {
  const readFetchCsv = async (url: string) => {
    const result = await fetch(url);

    const text = await result.text();

    const data = Papa.parse(text.trim(), {
      header: true,
      delimiter: ";"
    }) as unknown as {
      data: CSVData[]
    };

    return data.data;
  }

  let data = await readFetchCsv('./data/bars-15mi.csv');

  const returnValue: BarsData = {
    volumes: [],
    bars: []
  };

  for(let row of data) {
    if (row.START_TIME.length === 10) {
      console.warn(`passed row, ${JSON.stringify(row)}`);
      continue;
    }

    const dt = row.START_TIME.split(/[\.\s\:]/);

    const time = new Date(+dt[2], +dt[1] - 1, +dt[0], +dt[3], +dt[4], +dt[5]).valueOf() as Time;
    const open = +row.FIRST;
    const high = +row.HIGH;
    const low = +row.LOW;
    const close = +row.LAST;
    const volume = +row.VOLUME;

    returnValue.bars.push({
      time, open, high, low, close
    });

    returnValue.volumes.push({
      time,
      value: volume
    });
  }

  // returnValue.bars = returnValue.bars.splice(4890,10);
  returnValue.bars = returnValue.bars.sort((a, b) => <number>a.time - <number>b.time);

  // returnValue.volumes = returnValue.volumes.splice(4890,10);
  returnValue.volumes = returnValue.volumes.sort((a, b) => <number>a.time - <number>b.time);

  return returnValue
};
