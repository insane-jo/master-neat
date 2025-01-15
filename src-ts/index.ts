import methods from './methods/methods';
import Connection from './architecture/connection';
import architect from './architecture/architect';
import Network from './architecture/network';
import config from './config';
import Group from './architecture/group';
import Layer from './architecture/layer';
import NodeElement from './architecture/node';
import Neat from './neat';

const MasterNeat = {
    methods,
    Connection,
    architect,
    Network,
    config,
    Group,
    Layer,
    NodeElement,
    Neat,
    multi: require('./multithreading/multi')
};

export default MasterNeat;