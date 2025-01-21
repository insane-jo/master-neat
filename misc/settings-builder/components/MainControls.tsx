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
    <div className="grid grid-cols-subgrid gap-4 col-span-1 md:col-span-2 lg:col-span-3">
      <div className="divider "></div>

      <button className="btn btn-neutral"
              onClick={() => dispatch(startEvolve())}
      >Start Evolve</button>
      <button className="btn btn-error"
              onClick={dispatchStopEvolving}
      >Stop Evolve</button>
    </div>
  )
};

export default MainControls;
