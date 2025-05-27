import {EWokerMessageType, IWorkerIterationMessage, IWorkerMessage} from "../../src/multithreading/workers/workers";
import {INetworkTrainingSetItem} from '../../src/architecture/network';
import {ChildProcess} from "node:child_process";
import {CandleData} from "../common/generate-bars-data";
import {IWorkerInitMessage} from "./custom-testworker";
import CustomNetwork from "./custom-network-test";

var set: INetworkTrainingSetItem[] = [];
let pointsPerIteration: number;
let bars: CandleData[];

process.on('message', (e: IWorkerMessage) => {
  if (e.type === EWokerMessageType.init) {
    const initMessage = e as IWorkerInitMessage;

    set = initMessage.dataSet;
    pointsPerIteration = initMessage.pointsPerIteration;
    bars = initMessage.bars;
  } else if (e.type === EWokerMessageType.iteration) {
    const iterationMessage = e as IWorkerIterationMessage;

    const network = CustomNetwork.fromJSON(iterationMessage.network);
    network.bars = bars;
    network.pointsPerIteration = pointsPerIteration;

    const error = network.test(set).error;

    (process as unknown as ChildProcess).send(error);
  }
});
