import { createContext, useReducer } from "react";
import assetsStatsReducer, {
  IAssetsStatsState,
  RequestStatus,
} from "../store/assets-stats/assets-stats-reducer";
import * as actions from "../store/assets-stats/assets-stats-action-types";

import ky from "ky";
import { IAssetsStatsByName } from "../App";

export interface IAssetStatsContext extends IAssetsStatsState {
  queryAssetsStats: (date: string, symbols: string[]) => void;
  resetAssetsStats: () => void;
}

const AssetsStatsContext = createContext<IAssetStatsContext>(
  {} as IAssetStatsContext
);

const assetsStatsEndpoint = "http://localhost:3000/eod";

const AssetsStatsProvider = ({ children }: any) => {
  const [{ assetsStats, status, error }, dispatch] = useReducer<
    React.Reducer<IAssetsStatsState, any>
  >(assetsStatsReducer, {
    status: RequestStatus.Init,
    assetsStats: null,
    error: null,
  });

  const state = {
    assetsStats,
    status,
    error,
    queryAssetsStats: async (date: string, symbols: string[]) => {
      try {
        dispatch(actions.SetAssetsStatsLoading());
        const response = (await ky
          .post(assetsStatsEndpoint, {
            json: {
              dateFrom: date,
              symbols: symbols,
            },
          })
          .json()) as { data: IAssetsStatsByName };
        dispatch(actions.SetAssetsStatsSuccess(response.data));
      } catch (e) {
        dispatch(actions.SetAssetsStatsFailure(e));
      }
    },
    resetAssetsStats: () => dispatch(actions.ResetAssetsStats()),
  };

  return (
    <AssetsStatsContext.Provider value={state}>
      {children}
    </AssetsStatsContext.Provider>
  );
};

export { AssetsStatsProvider, AssetsStatsContext };
