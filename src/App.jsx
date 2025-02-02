import GameTitle from "./pages/GameTitle.jsx";
import { useContext, useEffect, useState } from "react";
import {
  pgChooseOpponentType,
  pgGameOver,
  pgGamePage,
  pgGameTitle,
  pgMySavedGame,
  pgRemotePlayerWentOffline,
  pgWaitingInQueue,
} from "./lib/PageSymbol.js";
import ChooseOpponentType from "./pages/ChooseOpponentType.jsx";
import { NavBar } from "./components/NavBar.jsx";
import { EventBusContext } from "./lib/GlobalVariable.js";
import {
  evStartLocalComputerGame,
  evMySavedGame,
  evStartMatching,
  evStartNewGame,
  evResumeSavedGame,
  evBackToGameTitle,
  evRemotePlayerWentOffline,
  evGameOver,
  evLocalQuit,
  evLocalSaveThenQuit,
  evMatchIsMade,
  evStartPollingMatchStatus,
} from "./lib/Events.js";
import debug from "debug";
import GamePage from "./pages/GamePage.jsx";
import WaitingInQueue from "./pages/WaitingInQueue.jsx";
import MySavedGame from "./pages/MySavedGame.jsx";
import RemotePlayerWentOffline from "./pages/RemotePlayerWentOffline.jsx";
import GameOver from "./pages/GameOver.jsx";
import { poll } from "./lib/GameHttpClient";

const note = debug("App.jsx");

function App() {
  const [page, setPage] = useState(pgGameTitle);
  const eb = useContext(EventBusContext);
  useEffect(() => {
    eb.subscribe(evStartNewGame(), () => {
      setPage(pgChooseOpponentType);
    });
    eb.subscribe(evResumeSavedGame(), () => {
      setPage(pgChooseOpponentType);
    });
    eb.subscribe(evStartPollingMatchStatus(), () => {
      poll(eb);
    });
    eb.subscribe(evMatchIsMade(), () => {
      setPage(pgGamePage);
    });
    eb.subscribe(evStartMatching(), () => {
      setPage(pgWaitingInQueue);
    });
    eb.subscribe(evStartLocalComputerGame(), () => {
      setPage(pgGamePage);
    });
    eb.subscribe(evMySavedGame(), () => {
      setPage(pgMySavedGame);
    });
    eb.subscribe(evBackToGameTitle(), () => {
      setPage(pgGameTitle);
    });
    eb.subscribe(evRemotePlayerWentOffline(), () => {
      setPage(pgRemotePlayerWentOffline);
    });
    eb.subscribe(evGameOver(), () => {
      setPage(pgGameOver);
    });
    eb.subscribe(evLocalQuit(), () => {
      setPage(pgGameTitle);
    });
    eb.subscribe(evLocalSaveThenQuit(), () => {
      setPage(pgGameTitle);
    });
    note("set up subscribers");
  }, []);

  return (
    <>
      <NavBar>
        {page === pgGameTitle && <GameTitle />}
        {page === pgMySavedGame && <MySavedGame />}
        {page === pgChooseOpponentType && <ChooseOpponentType />}
        {page === pgGamePage && <GamePage />}
        {page === pgWaitingInQueue && <WaitingInQueue />}
        {page === pgRemotePlayerWentOffline && <RemotePlayerWentOffline />}
        {page === pgGameOver && <GameOver />}
      </NavBar>
    </>
  );
}

export default App;
