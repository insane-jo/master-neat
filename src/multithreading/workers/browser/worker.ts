import {ICostFunction} from '../../../methods/cost';
import {EWokerMessageType, IWorkerInitMessage, IWorkerIterationMessage, IWorkerMessage} from "../workers";
import Network, {INetworkTrainingSetItem} from "../../../architecture/network";
import methods from "../../../methods/methods";

var set: INetworkTrainingSetItem[] = [];
var cost: ICostFunction;

interface IDefaultWorkerMessage<T> {
  data: T
}

(globalThis as any).onmessage = (e: IDefaultWorkerMessage<IWorkerMessage>) => {
  const msg = e.data;

  if (msg.type === EWokerMessageType.init) {
    const initMessage = msg as IWorkerInitMessage;

    set = initMessage.dataSet;
    cost = methods.cost[initMessage.cost];
  } else if (msg.type === EWokerMessageType.iteration) {
    const iterationMessage = msg as IWorkerIterationMessage;

    const network = Network.fromJSON(iterationMessage.network);

    const error = network.test(set, cost).error;

    const answer = { buffer: new Float64Array([error ]).buffer };

    //@ts-ignore
    postMessage(answer, [answer.buffer]);
  }
};
