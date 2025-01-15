import {IMutation} from "./index";
import Network from "../../architecture/network";
import config from "../../config";

const subSelfConn: IMutation = {
  name: 'SUB_SELF_CONN',
  callback(network: Network) {
    if (network.selfconns.length === 0) {
      if (config.warnings) console.warn('No more self-connections to remove!');
      return
    }
    const conn = network.selfconns[Math.floor(Math.random() * network.selfconns.length)];
    network.disconnect(conn.from, conn.to);
  }
};

export default subSelfConn;
