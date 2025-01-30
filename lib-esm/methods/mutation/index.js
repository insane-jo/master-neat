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
var mutations = {
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
};
export default mutations;
//# sourceMappingURL=index.js.map