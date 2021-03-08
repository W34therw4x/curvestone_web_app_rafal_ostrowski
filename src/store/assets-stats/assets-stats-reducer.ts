import { actionTypes } from "./assets-stats-action-types";
import * as actions from "./assets-stats-action-types";
import { IAssetsStatsByName } from "../../App";

// @todo
export enum RequestStatus {
  Init = "INIT",
  Loading = "LOADING",
  Success = "SUCCESS",
  Error = "ERROR",
}

export interface IAssetsStatsState {
  status: RequestStatus;
  assetsStats: IAssetsStatsByName | null;
  error: Error | null;
}

const assetsStatsReducer = (state: IAssetsStatsState, action: any) => {
  switch (action.type) {
    case actionTypes.SET_ASSETS_STATS_LOADING:
      return {
        ...state,
        status: RequestStatus.Loading,
      };
    case actionTypes.SET_ASSETS_STATS_SUCCESS: {
      const _action = action as ReturnType<
        typeof actions.SetAssetsStatsSuccess
      >;

      return {
        status: RequestStatus.Success,
        assetsStats: _action.assetsStats,
        error: null,
      };
    }
    case actionTypes.SET_ASSETS_STATS_FAILURE:
      return {
        ...state,
        status: RequestStatus.Error,
        error: action.error,
      };
    case actionTypes.RESET_ASSETS_STATS:
      return {
        status: RequestStatus.Init,
        assetsStats: null,
        error: null,
      };
    default:
      return state;
  }
};
export default assetsStatsReducer;
