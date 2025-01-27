import React from 'react';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store/store";
import {startEvolve, stopEvolve} from "../store/settingsSlice";

const MainControls: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const dispatchStopEvolving = () => {
    dispatch(stopEvolve());
  };

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3">
      <div className="divider "></div>

      <div className="fixed left-0 bottom-0 w-full text-center p-2 bg-neutral shadow shadow-xl">
        <button className="btn btn-active mr-4" onClick={() => dispatch(startEvolve())}>Start Evolve</button>
        <button className="btn btn-error" onClick={dispatchStopEvolving}>Stop Evolve</button>
      </div>
    </div>
  )
};

export default MainControls;
