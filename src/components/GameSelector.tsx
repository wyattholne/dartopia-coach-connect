
import React from "react";
import { X, Plus, ArrowRight } from "lucide-react";
import { GameMode, GameState } from "@/pages/Game";

interface Player {
  name: string;
  score: number;
  history: number[];
}

interface GameSelectorProps {
  gameMode: GameMode;
  setGameMode: (mode: GameMode) => void;
  players: Player[];
  addPlayer: () => void;
  removePlayer: (index: number) => void;
  updatePlayerName: (index: number, name: string) => void;
  gameState: GameState;
}

export const GameSelector: React.FC<GameSelectorProps> = ({
  gameMode,
  setGameMode,
  players,
  addPlayer,
  removePlayer,
  updatePlayerName,
  gameState
}) => {
  const gameModes: GameMode[] = ["501", "301", "Cricket", "Around the Clock", "Practice"];
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-neutral-200">
      <div className="p-3 border-b border-neutral-200">
        <h3 className="font-medium text-sm">Game Setup</h3>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Game Mode
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
            {gameModes.map((mode) => (
              <button
                key={mode}
                onClick={() => gameState === "setup" && setGameMode(mode)}
                className={`px-4 py-2 text-sm rounded-md flex items-center justify-between ${
                  gameMode === mode 
                    ? "bg-dart-green-light border-dart-green text-dart-green font-medium" 
                    : "bg-neutral-100 border-neutral-200 text-neutral-700"
                } border ${gameState !== "setup" ? "opacity-70 cursor-not-allowed" : "hover:bg-neutral-200"}`}
                disabled={gameState !== "setup"}
              >
                {mode}
                {gameMode === mode && <ArrowRight className="h-4 w-4 ml-2" />}
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-neutral-700">
              Players
            </label>
            {players.length < 4 && gameState === "setup" && (
              <button
                onClick={addPlayer}
                className="text-xs flex items-center text-dart-green hover:text-dart-green-dark"
              >
                <Plus className="h-3 w-3 mr-1" />
                Add Player
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {players.map((player, index) => (
              <div 
                key={index}
                className="flex items-center"
              >
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => gameState === "setup" && updatePlayerName(index, e.target.value)}
                  className={`flex-1 px-3 py-2 border border-neutral-300 rounded-md text-sm ${
                    gameState !== "setup" ? "bg-neutral-100" : "bg-white"
                  }`}
                  placeholder={`Player ${index + 1}`}
                  disabled={gameState !== "setup"}
                />
                {players.length > 1 && gameState === "setup" && (
                  <button
                    onClick={() => removePlayer(index)}
                    className="ml-2 p-1 rounded-md text-neutral-500 hover:text-red-500 hover:bg-neutral-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
