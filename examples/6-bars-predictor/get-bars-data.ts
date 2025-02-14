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

export const getBarsData = async (groupByDay: boolean = true): Promise<BarsData> => {
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

  // data = data.sort((a,b) => {
  //   const aDt = a.START_TIME.split(/[\.\s\:]/);
  //   const bDt = b.START_TIME.split(/[\.\s\:]/);
  //
  //   const aTime = new Date(+aDt[2], +aDt[1] - 1, +aDt[0], +aDt[3], +aDt[4], +aDt[5]).valueOf();
  //   const bTime = new Date(+bDt[2], +bDt[1] - 1, +bDt[0], +bDt[3], +bDt[4], +bDt[5]).valueOf();
  //
  //   return aTime - bTime;
  // });

  const returnValue: BarsData = {
    volumes: [],
    bars: []
  };

  let prevTime = Number.NEGATIVE_INFINITY;
  let timeOpen:number = 0,
    timeHigh:number = 0,
    timeLow:number = 0,
    timeClose:number = 0,
    timeVolume:number = 0;

  for(let row of data) {
    if (row.START_TIME.length === 10) {
      // console.warn(`passed row, ${JSON.stringify(row)}`);
      continue;
    }

    const dt = row.START_TIME.split(/[\.\s\:]/);
    let time;
    if (groupByDay) {
      time = (new Date(+dt[2], +dt[1] - 1, +dt[0]).valueOf() / 1000);
    } else {
      time = (new Date(+dt[2], +dt[1] - 1, +dt[0], +dt[3], +dt[4], +dt[5]).valueOf() / 1000);
    }

    time = Math.round(time);
    const timeChanged = time !== prevTime;

    if (timeChanged && time < prevTime) {
      console.info('Passed postponed candle', new Date(time * 1000).toISOString(), new Date(prevTime * 1000).toISOString());
      continue;
    }

    if (timeChanged) {
      returnValue.bars.push({
        time: prevTime as Time,
        open: timeOpen,
        high: timeHigh,
        low: timeLow,
        close: timeClose
      });

      returnValue.volumes.push({
        time: prevTime as Time,
        value: timeVolume
      });

      prevTime = time;
      timeOpen = +row.FIRST;

      timeHigh = Number.NEGATIVE_INFINITY;
      timeLow = Number.POSITIVE_INFINITY;
      timeVolume = 0;
    }

    timeHigh = Math.max(timeHigh, +row.HIGH);
    timeLow = Math.min(timeLow, +row.LOW);
    timeClose = +row.LAST;
    timeVolume = timeVolume + (+row.VOLUME);
  }

  returnValue.bars.push({
    time: prevTime as Time,
    open: timeOpen,
    high: timeHigh,
    low: timeLow,
    close: timeClose
  });

  returnValue.volumes.push({
    time: prevTime as Time,
    value: timeVolume
  });

  // returnValue.bars = returnValue.bars.splice(4890,10);
  returnValue.bars = returnValue.bars.sort((a, b) => <number>a.time - <number>b.time);

  // returnValue.volumes = returnValue.volumes.splice(4890,10);
  returnValue.volumes = returnValue.volumes.sort((a, b) => <number>a.time - <number>b.time);

  return returnValue
};
