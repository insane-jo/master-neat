import NodeTestWorker from './node/testworker';
import BrowserTestWorker from './browser/testworker';

var workers = {
  node: {
    TestWorker: NodeTestWorker
  },
  browser: {
    TestWorker: BrowserTestWorker
  }
};

export default workers;
