import React, { useState } from "react";
import ky from "ky";
import {
  Button,
  Container,
  TextField,
  makeStyles,
  FormControl,
  Input,
  InputAdornment,
  InputLabel,
} from "@material-ui/core";
import ProgressBar from "./ProgressBar";
import { StockChart } from "./StockChart";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    marginTop: theme.spacing(6),
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
  chartWrapper: {
    marginBottom: theme.spacing(10),
  },
}));

interface IAssets {
  symbol1: string;
  allocation1: string;
  symbol2: string;
  allocation2: string;
  symbol3: string;
  allocation3: string;
  [key: string]: string;
}

interface IAssetsStatsByName {
  [key: string]: IAssetStats[];
}

export interface IAssetStats {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const App = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<string>();
  const [balance, setBalance] = useState<string>("");
  const [assets, setAssets] = useState<IAssets>({
    symbol1: "",
    allocation1: "",
    symbol2: "",
    allocation2: "",
    symbol3: "",
    allocation3: "",
  });
  const [stats, setStats] = useState<IAssetsStatsByName>();

  const getAssetsStats = async () => {
    const response = (await ky
      .post("http://localhost:3000/eod", {
        json: {
          dateFrom: date,
          symbols: [assets.symbol1, assets.symbol2, assets.symbol3],
        },
      })
      .json()) as { data: IAssetsStatsByName };

    return response.data;
  };

  const handleAssetsChange = (prop: keyof IAssets) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setAssets({ ...assets, [prop]: event.target.value });
  };

  const handleForm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const assetsStats = await getAssetsStats();
    setStats(assetsStats);
    setLoading(false);
  };

  //bare minimum validation
  const isInvalid =
    !date ||
    balance.length === 0 ||
    Object.values(assets).some((assetPropVal) => assetPropVal === "");

  const classes = useStyles();
  return (
    <>
      {loading && <ProgressBar />}
      {!loading && !stats && (
        <Container component="main" maxWidth="lg">
          <div className={classes.paper}>
            <form className={classes.form} onSubmit={handleForm}>
              <FormControl fullWidth>
                <InputLabel htmlFor="balance-amount">Balance</InputLabel>
                <Input
                  id="balance-amount"
                  type="number"
                  value={balance}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setBalance(event.target.value)
                  }
                  startAdornment={
                    <InputAdornment position="start">$</InputAdornment>
                  }
                />
              </FormControl>
              <br />
              <TextField
                fullWidth
                id="date"
                label="Date"
                type="date"
                defaultValue={date}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setDate(event.target.value)
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <br />
              <br />
              <h3>Portfolio Allocation:</h3>
              <TextField
                fullWidth
                label="Asset 1 symbol"
                value={assets.symbol1}
                onChange={handleAssetsChange("symbol1")}
              />
              <br />
              <FormControl fullWidth>
                <InputLabel htmlFor="asset-1-allocated">
                  Asset 1 allocated
                </InputLabel>
                <Input
                  id="asset-1-allocated"
                  value={assets.allocation1}
                  type="number"
                  onChange={handleAssetsChange("allocation1")}
                  startAdornment={
                    <InputAdornment position="start">%</InputAdornment>
                  }
                />
              </FormControl>
              <br />
              <br />
              <TextField
                fullWidth
                label="Asset 2 symbol"
                value={assets.symbol2}
                onChange={handleAssetsChange("symbol2")}
              />
              <br />
              <FormControl fullWidth>
                <InputLabel htmlFor="asset-2-allocated">
                  Asset 2 allocated
                </InputLabel>
                <Input
                  id="asset-2-allocated"
                  value={assets.allocation2}
                  type="number"
                  onChange={handleAssetsChange("allocation2")}
                  startAdornment={
                    <InputAdornment position="start">%</InputAdornment>
                  }
                />
              </FormControl>
              <br />
              <br />
              <TextField
                fullWidth
                label="Asset 3 symbol"
                value={assets.symbol3}
                onChange={handleAssetsChange("symbol3")}
              />
              <br />
              <FormControl fullWidth>
                <InputLabel htmlFor="asset-3-allocated">
                  Asset 3 allocated
                </InputLabel>
                <Input
                  id="asset-3-allocated"
                  value={assets.allocation3}
                  type="number"
                  onChange={handleAssetsChange("allocation3")}
                  startAdornment={
                    <InputAdornment position="start">%</InputAdornment>
                  }
                />
              </FormControl>
              <br />
              <br />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                disabled={isInvalid}
              >
                Submit
              </Button>
            </form>
          </div>
        </Container>
      )}
      {!loading && stats && (
        <>
          <Button
            size="large"
            variant="contained"
            color="secondary"
            onClick={() => setStats(undefined)}
          >
            BACK
          </Button>
          {Object.entries(stats).map(([name, stats]) => {
            // this logic here is particulary ugly...
            // the way I keep 'assets' state with hardcoded keys force me to dig allocation key this way
            // so finding relation between symbol1 and allocation1
            const assetSymbolEntry = Object.entries(assets).find(
              ([key, value]) => value === name
            );
            let investment;
            if (assetSymbolEntry) {
              const allocationKey = `allocation${assetSymbolEntry[0].slice(
                -1
              )}`;
              const allocation = Number(assets[allocationKey]);
              investment =
                Math.round(Number(balance) * (allocation / 100) * 100) / 100;
            }

            return (
              <Container key={name} className={classes.chartWrapper}>
                <StockChart
                  assetName={name}
                  assetStats={stats}
                  investment={investment}
                />
              </Container>
            );
          })}
        </>
      )}
    </>
  );
};

export default App;
