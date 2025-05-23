import {ICostFunction} from '../../../methods/cost';
import {EWokerMessageType, IWorkerInitMessage, IWorkerIterationMessage, IWorkerMessage} from "../workers";
import Network, {INetworkTrainingSetItem} from "../../../architecture/network";
import methods from "../../../methods/methods";
import {ChildProcess} from "node:child_process";

var set: INetworkTrainingSetItem[] = [];
var cost: ICostFunction;

process.on('message', (e: IWorkerMessage) => {
  if (e.type === EWokerMessageType.init) {
    const initMessage = e as IWorkerInitMessage;

    set = initMessage.dataSet;
    cost = methods.cost[initMessage.cost];
  } else if (e.type === EWokerMessageType.iteration) {
    const iterationMessage = e as IWorkerIterationMessage;

    const network = Network.fromJSON(iterationMessage.network);

    const error = network.test(set, cost).error;

    (process as unknown as ChildProcess).send(error);
  }
});
