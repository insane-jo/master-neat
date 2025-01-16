import { ChildProcess } from 'child_process';
// import MasterNeat from '../../../index';
import { ICostFunction } from '../../../methods/cost';
// const {multi, methods} = MasterNeat;

import methods from "../../../methods/methods";
import * as multi from '../../multi';

// @todo: Выкосить any
var set: any[] = [];
var cost: ICostFunction;
var F = multi.activations;

// @todo: Выкосить any
process.on('message', (e: any) => {
  if (typeof e.set === 'undefined') {
    var A = e.activations;
    var S = e.states;
    var data = e.conns;

    var result = multi.testSerializedSet(set, cost, A, S, data, F);

    (process as unknown as ChildProcess).send(result);
  } else {
    cost = methods.cost[e.cost];
    set = multi.deserializeDataSet(e.set);
  }
});
