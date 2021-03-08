import { IAssetsStatsByName } from "../../App";

export const actionTypes = {
  SET_ASSETS_STATS_LOADING: "ASSETS:SET_ASSETS_STATS_LOADING",
  SET_ASSETS_STATS_SUCCESS: "ASSETS:SET_ASSETS_STATS_SUCCESS",
  SET_ASSETS_STATS_FAILURE: "ASSETS:SET_ASSETS_STATS_FAILURE",
  RESET_ASSETS_STATS: "ASSETS:RESETS_ASSETS_STATS",
};

export const SetAssetsStatsLoading = () => ({
  type: actionTypes.SET_ASSETS_STATS_LOADING,
});

export const SetAssetsStatsSuccess = (assetsStats: IAssetsStatsByName) => ({
  type: actionTypes.SET_ASSETS_STATS_SUCCESS,
  assetsStats,
});

export const SetAssetsStatsFailure = (error: Error) => ({
  type: actionTypes.SET_ASSETS_STATS_FAILURE,
  error,
});

export const ResetAssetsStats = () => ({
  type: actionTypes.RESET_ASSETS_STATS,
});
