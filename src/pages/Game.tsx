
import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { CameraFeed } from "@/components/CameraFeed";
import { GameScoreboard } from "@/components/GameScoreboard";
import { GameSelector } from "@/components/GameSelector";
import { Play, Undo, RotateCcw, Info, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export type GameMode = "501" | "301" | "Cricket" | "Around the Clock" | "Practice";
export type GameState = "setup" | "playing" | "finished";

interface Player {
  name: string;
  score: number;
  history: number[];
  target?: number;
}

const Game = () => {
  const [gameMode, setGameMode] = useState<GameMode>("501");
  const [gameState, setGameState] = useState<GameState>("setup");
  const [players, setPlayers] = useState<Player[]>([
    { name: "Player 1", score: 501, history: [], target: 501 },
  ]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [throwsInRound, setThrowsInRound] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Reset game when mode changes
    resetGame();
  }, [gameMode]);

  // Reset scores and game state based on selected game mode
  const resetGame = () => {
    let initialScore = 0;
    let initialTarget = undefined;

    switch (gameMode) {
      case "501":
        initialScore = 501;
        initialTarget = 501;
        break;
      case "301":
        initialScore = 301;
        initialTarget = 301;
        break;
      case "Cricket":
        initialScore = 0;
        break;
      case "Around the Clock":
        initialScore = 0;
        initialTarget = 20;
        break;
      case "Practice":
        initialScore = 0;
        break;
    }

    setPlayers(players.map(player => ({
      ...player,
      score: initialScore,
      history: [],
      target: initialTarget
    })));
    
    setGameState("setup");
    setCurrentPlayerIndex(0);
    setCurrentRound(1);
    setThrowsInRound(0);
  };

  const startGame = () => {
    setGameState("playing");
    toast({
      title: "Game Started",
      description: `${gameMode} game with ${players.length} player(s)`,
    });
  };

  const addPlayer = () => {
    if (players.length < 4) {
      const newPlayer: Player = {
        name: `Player ${players.length + 1}`,
        score: gameMode === "501" ? 501 : gameMode === "301" ? 301 : 0,
        history: [],
        target: gameMode === "501" ? 501 : gameMode === "301" ? 301 : undefined
      };
      
      setPlayers([...players, newPlayer]);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 1) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    setPlayers(players.map((player, i) => 
      i === index ? { ...player, name } : player
    ));
  };

  const addScore = (points: number) => {
    if (gameState !== "playing") return;
    
    setPlayers(prevPlayers => {
      return prevPlayers.map((player, index) => {
        if (index === currentPlayerIndex) {
          const newHistory = [...player.history, points];
          let newScore;
          
          if (gameMode === "501" || gameMode === "301") {
            newScore = player.score - points;
            // Check for bust (score below zero or exactly 1)
            if (newScore < 0 || newScore === 1) {
              return { ...player, history: newHistory }; // Bust - score doesn't change
            }
          } else {
            newScore = player.score + points;
          }
          
          return {
            ...player,
            score: newScore,
            history: newHistory
          };
        }
        return player;
      });
    });
    
    // Track throws and update current player
    setThrowsInRound(prev => {
      const newThrows = prev + 1;
      
      // If player has thrown 3 darts, move to next player
      if (newThrows >= 3) {
        // Move to next player or round
        setCurrentPlayerIndex(prevIndex => {
          const nextIndex = (prevIndex + 1) % players.length;
          // If we've gone through all players, increment round
          if (nextIndex === 0) {
            setCurrentRound(prevRound => prevRound + 1);
          }
          return nextIndex;
        });
        return 0; // Reset throws counter
      }
      
      return newThrows;
    });
    
    // Check for win condition
    checkWinCondition();
  };

  const undoLastThrow = () => {
    if (gameState !== "playing") return;
    
    setPlayers(prevPlayers => {
      return prevPlayers.map((player, index) => {
        if (index === currentPlayerIndex && player.history.length > 0) {
          const newHistory = [...player.history];
          const lastScore = newHistory.pop() || 0;
          
          let newScore;
          if (gameMode === "501" || gameMode === "301") {
            newScore = player.score + lastScore;
          } else {
            newScore = player.score - lastScore;
          }
          
          return {
            ...player,
            score: newScore,
            history: newHistory
          };
        }
        return player;
      });
    });
    
    // Adjust throw counter
    setThrowsInRound(prev => {
      if (prev === 0) {
        // If we're at the beginning of a player's turn, go back to previous player
        setCurrentPlayerIndex(prevIndex => {
          let newIndex = prevIndex - 1;
          if (newIndex < 0) {
            newIndex = players.length - 1;
            // If we're going back to last player, decrement round
            if (currentRound > 1) {
              setCurrentRound(prevRound => prevRound - 1);
            }
          }
          return newIndex;
        });
        return 2; // Set throws to 2 for previous player
      }
      return prev - 1;
    });
  };

  const checkWinCondition = () => {
    // Check win conditions based on game mode
    if (gameState !== "playing") return;
    
    const currentPlayer = players[currentPlayerIndex];
    
    if ((gameMode === "501" || gameMode === "301") && currentPlayer.score === 0) {
      setGameState("finished");
      toast({
        title: "Game Over!",
        description: `${currentPlayer.name} wins!`,
        variant: "default",
      });
    }
    
    // Add other game mode win conditions as needed
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <Navbar />
      
      <main className="flex-1 pt-16">
        <div className="container-custom py-8">
          <div className="flex flex-col">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-dart-black">Dart Game</h1>
                <p className="text-neutral-500">Set up your game and track your scores</p>
              </div>
              
              <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                {gameState === "playing" && (
                  <>
                    <button 
                      onClick={undoLastThrow}
                      className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-dart-black shadow-sm hover:bg-neutral-50"
                    >
                      <Undo className="h-4 w-4 mr-2" />
                      Undo
                    </button>
                    <button 
                      onClick={resetGame}
                      className="inline-flex items-center justify-center rounded-md border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-dart-black shadow-sm hover:bg-neutral-50"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </button>
                  </>
                )}
                {gameState === "setup" && (
                  <button 
                    onClick={startGame}
                    className="btn-primary"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Start Game
                  </button>
                )}
                {gameState === "finished" && (
                  <button 
                    onClick={resetGame}
                    className="btn-primary"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Game
                  </button>
                )}
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Game Mode: {gameMode}</span> - Connect your camera to track dart throws and automatically update scores.
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  You can also manually enter scores on the chalkboard.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="col-span-1">
                <GameSelector 
                  gameMode={gameMode}
                  setGameMode={setGameMode}
                  players={players}
                  addPlayer={addPlayer}
                  removePlayer={removePlayer}
                  updatePlayerName={updatePlayerName}
                  gameState={gameState}
                />
              </div>
              
              <div className="col-span-1 lg:col-span-2">
                <GameScoreboard 
                  gameMode={gameMode}
                  players={players}
                  currentPlayerIndex={currentPlayerIndex}
                  currentRound={currentRound}
                  throwsInRound={throwsInRound}
                  gameState={gameState}
                  addScore={addScore}
                />
              </div>
            </div>
            
            {gameState === "playing" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <CameraFeed title="Camera Feed 1" id="1" />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Game;
