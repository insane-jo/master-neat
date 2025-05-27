import {INetworkTrainingSetItem, ITestResult} from "../../src/architecture/network";
import Network from "../../src/architecture/network";
import {CandleData, LineData} from "../common/generate-bars-data";

const TestFunctionBuilder = (
  pointsPerIteration: number,
  networkOutputAmount: number,
  bars: CandleData[]
) => {
  return function testFunction(this: Network, set: INetworkTrainingSetItem[]): ITestResult {
    // let totalError = 0;
    const barsLength = bars.length;

    const startTime = Date.now();

    let portfolioValue = 1;
    let currentPosition = 0;

    const SPREAD_PERCENT = 0.05 / 100;
    const COMISSION_PERCENT = 0.05 / 100;

    // Если переход из 0 в 1 в сигналах происходит внутри этих значений - не торгуем
    // Не торгуем если изменение цены произошло в пивотах между 30 и 70% - только большие колебания ловим
    const NON_TRADE_CORRIDOR_START = Math.round(.5 * pointsPerIteration),
      NON_TRADE_CORRIDOR_END = Math.round(.5 * pointsPerIteration) - 1;

    const getTradePrice = (price: number, getBuyPrice: boolean) => {
      if (getBuyPrice) {
        return price * (1 + (SPREAD_PERCENT + COMISSION_PERCENT));
      } else {
        return price * (1 - (SPREAD_PERCENT + COMISSION_PERCENT));
      }
    }

    // Compute error in a single loop
    for (let i = 0; i < barsLength - 2 /*Последнюю свечу проверить не можем*/; i++) {

      const localDecisionMaker = [];
      // Плохим выбором считаем если нули и единицы идут вперемешку
      let isBadDecision = false;
      let lastDecision = -1;

      for (let j = 0; j < pointsPerIteration; j++) {
        const {input/*, output: target*/} = set[i * pointsPerIteration + j];
        const output = this.noTraceActivate(input);

        const currDecision = Math.round(output[0]);
        if (currDecision < lastDecision) {
          isBadDecision = true;
          break;
        } else {
          lastDecision = currDecision;
        }

        localDecisionMaker.push(currDecision);
      }

      if (currentPosition) {
        const firstValue = localDecisionMaker[0],
          lastValue = localDecisionMaker[NON_TRADE_CORRIDOR_START];

        const needToTrade = lastValue > firstValue;

        if (needToTrade) {
          const tradePrice = getTradePrice(bars[i + 1].open, false);

          portfolioValue = currentPosition * tradePrice;
          currentPosition = 0;
        }
      } else {
        if (isBadDecision) {
          // Если плохой вариант для принятия решения - пропускаем
          continue;
        }

        const firstValue = localDecisionMaker[NON_TRADE_CORRIDOR_END],
          lastValue = localDecisionMaker[localDecisionMaker.length - 1];

        const needToTrade = lastValue > firstValue;

        if (needToTrade) {
          const tradePrice = getTradePrice(bars[i + 1].open, true);
          currentPosition = portfolioValue / tradePrice;
        }
      }
    }

    return {
      error: portfolioValue,
      time: Date.now() - startTime
    };
  };
};


export default TestFunctionBuilder;
