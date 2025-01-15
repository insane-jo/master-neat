import Network from "../../architecture/network";
import addNode from "./add-node";
import subNode from "./sub-node";
import addConn from "./add-conn";
import subConn from "./sub-conn";
import modWeight from "./mod-weight";
import modBias from "./mod-bias";
import modActivation from "./mod-activation";
import addGate from "./add-gate";
import subGate from "./sub-gate";
import addSelfConn from "./add-self-conn";
import subSelfConn from "./sub-self-conn";
import addBackConn from "./add-back-conn";
import subBackConn from "./sub-back-conn";
import swapNodes from "./swap-nodes";

export interface IMutation {
  name: string;
  callback: (network: Network) => void;
}

type IMutationCollection = {[key: string]: IMutation[]};

const mutations: IMutationCollection = {
  ALL: [
    addNode,
    subNode,
    addConn,
    subConn,
    modWeight,
    modBias,
    modActivation,
    addGate,
    subGate,
    addSelfConn,
    subSelfConn,
    addBackConn,
    subBackConn,
    swapNodes
  ],
  FFW: [
    addNode,
    subNode,
    addConn,
    subConn,
    modWeight,
    modBias,
    modActivation,
    swapNodes
  ]
}

export default mutations;
