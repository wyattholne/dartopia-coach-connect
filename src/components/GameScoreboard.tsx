import React, { useState } from "react";
import { BarChart3, X, Check, Plus, Minus } from "lucide-react";
import { GameMode, GameState } from "@/pages/Game";

interface Player {
  name: string;
  score: number;
  history: number[];
  target?: number;
}

interface GameScoreboardProps {
  gameMode: GameMode;
  players: Player[];
  currentPlayerIndex: number;
  currentRound: number;
  throwsInRound: number;
  gameState: GameState;
  addScore: (score: number) => void;
}

export const GameScoreboard: React.FC<GameScoreboardProps> = ({
  gameMode,
  players,
  currentPlayerIndex,
  currentRound,
  throwsInRound,
  gameState,
  addScore
}) => {
  const [manualScore, setManualScore] = useState<string>("");
  
  const handleQuickScore = (score: number) => {
    if (gameState === "playing") {
      addScore(score);
    }
  };
  
  const handleManualScoreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameState === "playing" && manualScore.trim()) {
      const score = parseInt(manualScore);
      if (!isNaN(score) && score >= 0 && score <= 180) {
        addScore(score);
        setManualScore("");
      }
    }
  };

  const getScoreColor = (player: Player, index: number) => {
    if (gameState !== "playing") return "text-neutral-800";
    if (index === currentPlayerIndex) return "text-dart-green font-bold";
    return "text-neutral-800";
  };
  
  const quickScores = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25, 50];
  
  const doubleScores = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 50];
  const tripleScores = [3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60];
  
  return (
    <div className="bg-dart-black rounded-lg shadow-sm overflow-hidden">
      <div className="p-3 border-b border-neutral-700 bg-dart-black flex items-center justify-between">
        <div className="flex items-center">
          <BarChart3 className="h-4 w-4 text-neutral-300 mr-2" />
          <h3 className="font-medium text-sm text-white">Dart Scoreboard</h3>
        </div>
        
        {gameState === "playing" && (
          <div className="flex items-center space-x-4">
            <div className="text-xs text-neutral-300">
              Round {currentRound}
            </div>
            <div className="text-xs text-neutral-300">
              Throw {throwsInRound + 1}/3
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6 bg-dart-black relative">
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise' x='0' y='0'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeBlend mode='screen'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.3'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
          }}
        ></div>
        
        <div className="relative z-10 text-white">
          <div className="grid grid-cols-6 gap-2 py-2 border-b border-neutral-700 text-neutral-400 text-sm">
            <div className="col-span-2">Player</div>
            <div className="text-center">Starting</div>
            <div className="text-center">Current</div>
            <div className="text-center">Last 3</div>
            <div className="text-center">Avg/Dart</div>
          </div>
          
          {players.map((player, index) => {
            const starting = player.target || 0;
            const totalPointsScored = player.history.reduce((sum, score) => sum + score, 0);
            const last3 = player.history.slice(-3).join(", ") || "-";
            const avgPerDart = player.history.length ? (totalPointsScored / player.history.length).toFixed(1) : "-";
            
            return (
              <div 
                key={index}
                className={`grid grid-cols-6 gap-2 py-3 ${
                  index === currentPlayerIndex && gameState === "playing" 
                    ? "bg-white/5 rounded" 
                    : ""
                } ${
                  index < players.length - 1 ? "border-b border-neutral-700/50" : ""
                }`}
              >
                <div className={`col-span-2 font-chalk ${getScoreColor(player, index)}`}>
                  {player.name}
                  {index === currentPlayerIndex && gameState === "playing" && (
                    <span className="ml-2 inline-block h-2 w-2 bg-dart-green rounded-full animate-pulse"></span>
                  )}
                </div>
                <div className="text-center text-neutral-300">{starting}</div>
                <div className={`text-center text-2xl font-bold ${getScoreColor(player, index)}`}>
                  {player.score}
                </div>
                <div className="text-center text-neutral-300 font-mono">{last3}</div>
                <div className="text-center text-neutral-300">{avgPerDart}</div>
              </div>
            );
          })}
          
          {gameState === "playing" && (
            <div className="mt-6 border-t border-neutral-700 pt-4">
              <h4 className="text-sm font-medium text-neutral-300 mb-3">Quick Score Entry</h4>
              
              <form onSubmit={handleManualScoreSubmit} className="mb-4">
                <div className="flex">
                  <input
                    type="number"
                    value={manualScore}
                    onChange={(e) => setManualScore(e.target.value)}
                    className="flex-1 bg-neutral-800 border border-neutral-700 rounded-l-md px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-dart-green"
                    placeholder="Enter score"
                    min="0"
                    max="180"
                  />
                  <button
                    type="submit"
                    className="bg-dart-green text-white px-4 py-2 rounded-r-md hover:bg-dart-green-dark"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </form>
              
              <div className="grid grid-cols-8 gap-2 mb-4">
                {gameMode === "501" || gameMode === "301" ? (
                  quickScores.map(score => (
                    <button
                      key={score}
                      onClick={() => handleQuickScore(score)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded text-sm"
                    >
                      {score}
                    </button>
                  ))
                ) : (
                  [...Array(20)].map((_, i) => (
                    <button
                      key={i+1}
                      onClick={() => handleQuickScore(i+1)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded text-sm"
                    >
                      {i+1}
                    </button>
                  ))
                )}
                
                {(gameMode !== "501" && gameMode !== "301") && (
                  <>
                    <button
                      onClick={() => handleQuickScore(25)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded text-sm"
                    >
                      25
                    </button>
                    <button
                      onClick={() => handleQuickScore(50)}
                      className="bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded text-sm"
                    >
                      50
                    </button>
                  </>
                )}
              </div>
              
              {(gameMode === "501" || gameMode === "301") && (
                <div className="mb-4">
                  <h5 className="text-xs font-medium text-neutral-400 mb-2">Doubles</h5>
                  <div className="grid grid-cols-7 gap-2">
                    {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 40, 50].map(score => (
                      <button
                        key={`d${score}`}
                        onClick={() => handleQuickScore(score)}
                        className="bg-red-900/60 hover:bg-red-800/80 text-white py-2 rounded text-sm"
                      >
                        D{score/2}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {(gameMode === "501" || gameMode === "301") && (
                <div>
                  <h5 className="text-xs font-medium text-neutral-400 mb-2">Triples</h5>
                  <div className="grid grid-cols-7 gap-2">
                    {[3, 6, 9, 12, 15, 18, 21, 24, 27, 30, 45, 60].map(score => (
                      <button
                        key={`t${score}`}
                        onClick={() => handleQuickScore(score)}
                        className="bg-green-900/60 hover:bg-green-800/80 text-white py-2 rounded text-sm"
                      >
                        T{score/3}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {gameState === "setup" && (
            <div className="mt-4 text-center text-neutral-400">
              Configure your game and press "Start Game" to begin
            </div>
          )}
          
          {gameState === "finished" && (
            <div className="mt-6 text-center">
              <div className="text-2xl font-bold text-dart-green mb-2">
                Game Over!
              </div>
              <div className="text-xl text-white">
                {players.find(p => p.score === 0)?.name || players[0].name} Wins!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
