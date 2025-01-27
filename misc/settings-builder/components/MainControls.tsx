import React from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {EEvolveRunningState, startEvolve, stopEvolve} from "../store/settingsSlice";

const MainControls: React.FC = () => {
  const evolveRunningState = useSelector((state: RootState) => state.settings.evolveRunningState);
  const changedSettings = useSelector((state: RootState) => state.settings.changedSettings);

  const dispatch = useDispatch<AppDispatch>();

  const dispatchStopEvolving = () => {
    dispatch(stopEvolve());
  };

  const hasChangedSettings = (changedSettings.length && evolveRunningState === EEvolveRunningState.Running);

  const evolveRunningStateElement = (
    <span className="flex flex-wrap self-center items-center h-full gap-1">
          <div>Running state: </div>
          <div className="relative flex">
            {evolveRunningState === EEvolveRunningState.Running ? <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span> : null}
            <span
              className={`relative inline-flex rounded-full px-2 py-1 text-white ${evolveRunningState === EEvolveRunningState.Running ? 'bg-green-500' : 'bg-amber-500'} ${hasChangedSettings ? 'indicator' : ''}`}
            >
              {evolveRunningState}
              {hasChangedSettings ? <span className="indicator-item badge badge-error tooltip absolute"
                                          data-tip="You have some settings changed. You need to restart evolve process to apply them."></span> : null}
            </span>
          </div>
      </span>
  )

  return (
    <div
      className="fixed left-0 bottom-0 w-full text-center p-2 bg-neutral shadow shadow-xl border-t border-current flex flex-center justify-center gap-4">
      <div className="flex">
        {evolveRunningStateElement}
      </div>
      <button className="btn btn-active" onClick={() => dispatch(startEvolve())}>Start Evolve</button>
      <button className="btn btn-error" onClick={dispatchStopEvolving}>Stop Evolve</button>
    </div>
  )
};

export default MainControls;
