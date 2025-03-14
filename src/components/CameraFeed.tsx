
import React, { useState, useEffect, useRef } from "react";
import { RefreshCw, Video, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Prediction {
  label: string;
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
}

interface CameraFeedProps {
  title: string;
  id: string;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ title, id }) => {
  const [connectionState, setConnectionState] = useState<"disconnected" | "connecting" | "connected">("disconnected");
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [score, setScore] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch predictions and scores when connected
  useEffect(() => {
    let intervalId: number | undefined;
    
    if (connectionState === "connected") {
      // Start fetching predictions and scores
      intervalId = window.setInterval(() => {
        fetchPredictions();
        fetchScore();
      }, 1000);
    }
    
    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [connectionState]);

  // Draw predictions on canvas when they update
  useEffect(() => {
    if (connectionState === "connected" && predictions.length > 0 && canvasRef.current && videoContainerRef.current) {
      drawPredictions();
    }
  }, [predictions, connectionState]);

  const fetchPredictions = async () => {
    try {
      // For demo purposes, we'll simulate predictions
      // In a real implementation, you would fetch from an actual endpoint:
      // const response = await fetch(`http://<your_server_ip>:5000/predict`);
      // const data = await response.json();
      
      // Simulate random predictions for demo
      const simulatedPredictions: Prediction[] = [
        {
          label: "dartboard",
          confidence: 0.92,
          bbox: [Math.random() * 50 + 25, Math.random() * 50 + 25, 150, 150]
        }
      ];
      
      // Randomly add a bullseye detection
      if (Math.random() > 0.5) {
        simulatedPredictions.push({
          label: "bullseye",
          confidence: 0.85,
          bbox: [simulatedPredictions[0].bbox[0] + 60, simulatedPredictions[0].bbox[1] + 60, 30, 30]
        });
      }
      
      setPredictions(simulatedPredictions);
    } catch (error) {
      console.error("Error fetching predictions:", error);
    }
  };

  const fetchScore = async () => {
    try {
      // For demo purposes, we'll simulate a score
      // In a real implementation, you would fetch from an actual endpoint:
      // const response = await fetch(`http://<your_server_ip>:5000/score`);
      // const data = await response.json();
      
      // Simulate a random score for demo
      const simulatedScore = Math.floor(Math.random() * 60) + 1;
      setScore(simulatedScore);
    } catch (error) {
      console.error("Error fetching score:", error);
    }
  };

  const drawPredictions = () => {
    const canvas = canvasRef.current;
    const container = videoContainerRef.current;
    
    if (!canvas || !container) return;
    
    // Match canvas dimensions to container
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear previous drawings
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw each prediction
    predictions.forEach(pred => {
      const { bbox, label, confidence } = pred;
      const [x, y, width, height] = bbox;
      
      // Draw bounding box
      ctx.strokeStyle = label === 'bullseye' ? '#f43f5e' : '#4ADE80';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(x, y - 20, label.length * 8 + 30, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(`${label} ${(confidence * 100).toFixed(0)}%`, x + 5, y - 5);
    });
  };

  const handleConnectClick = () => {
    // Update state to "connecting"
    setConnectionState("connecting");
    
    // Show toast for connecting
    toast({
      title: `${title}`,
      description: "Attempting to connect to camera...",
      duration: 2000,
    });
    
    // Simulate connection delay (2.5 seconds)
    setTimeout(() => {
      setConnectionState("connected");
      
      // Show toast for connected
      toast({
        title: `${title}`,
        description: "Camera connected successfully!",
        duration: 3000,
      });
      
      // Initial prediction fetch
      fetchPredictions();
      fetchScore();
    }, 2500);
  };

  return (
    <div className="feed-card animate-scale-in" style={{ animationDelay: `${parseInt(id) * 100}ms` }}>
      <div className="p-3 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="font-medium text-sm">{title}</h3>
        <button className="text-neutral-500 hover:text-dart-green transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      <div className="aspect-video bg-neutral-100 flex items-center justify-center p-4">
        <div 
          ref={videoContainerRef}
          className="h-full w-full flex flex-col items-center justify-center bg-dart-black/5 rounded-lg border border-dart-black/10 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-neutral-200/30 flex items-center justify-center">
            {/* Red recording indicator */}
            {connectionState === "connected" && (
              <div className="absolute top-3 right-3 bg-red-500 h-2.5 w-2.5 rounded-full animate-pulse"></div>
            )}
            
            {/* Refined noise texture with adjusted parameters */}
            <div className="absolute top-0 left-0 w-full h-full opacity-15">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.3 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' fill='%23F1F0FB'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
                backgroundSize: '150px 150px',
              }}></div>
            </div>
          </div>
          
          {/* Canvas overlay for drawing predictions */}
          {connectionState === "connected" && (
            <canvas 
              ref={canvasRef} 
              className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
            />
          )}
          
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-dart-black/10 mb-4 flex items-center justify-center">
              <Video
                className="w-10 h-10 text-dart-green animate-pulse-subtle"
                strokeWidth={1.5}
              />
            </div>
            
            {connectionState === "disconnected" && (
              <p className="text-sm text-dart-black/70 font-medium">Camera feed not connected</p>
            )}
            
            {connectionState === "connecting" && (
              <p className="text-sm text-dart-black/70 font-medium flex items-center">
                <span className="mr-2">Connecting to camera</span>
                <span className="inline-block h-2 w-2 bg-dart-green rounded-full animate-pulse"></span>
                <span className="inline-block h-2 w-2 bg-dart-green rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></span>
                <span className="inline-block h-2 w-2 bg-dart-green rounded-full animate-pulse" style={{ animationDelay: "600ms" }}></span>
              </p>
            )}
            
            {connectionState === "connected" && (
              <p className="text-sm text-dart-green font-medium flex items-center">
                <Check className="w-4 h-4 mr-1.5" />
                Live Feed Preview Ready
              </p>
            )}
            
            {connectionState === "disconnected" && (
              <p className="text-xs text-dart-black/50 mt-1">Connect your camera to start analysis</p>
            )}
            
            {/* Score display */}
            {connectionState === "connected" && score !== null && (
              <div className="bg-dart-black/80 px-3 py-1 rounded-full mt-2">
                <p className="text-sm text-white font-medium">Score: {score}</p>
              </div>
            )}
            
            <button 
              onClick={handleConnectClick}
              disabled={connectionState === "connecting" || connectionState === "connected"}
              className={`mt-4 text-xs py-1.5 px-3 rounded flex items-center justify-center transition-all duration-200 ${
                connectionState === "disconnected" ? 
                  "bg-dart-green text-white hover:bg-dart-green-dark" :
                connectionState === "connecting" ? 
                  "bg-dart-green/70 text-white cursor-wait" :
                  "bg-dart-accent text-white"
              }`}
              style={{ minWidth: "120px" }}
            >
              {connectionState === "disconnected" && "Connect Camera"}
              {connectionState === "connecting" && (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              )}
              {connectionState === "connected" && (
                <>
                  <Check className="h-4 w-4 mr-1.5" />
                  Connected
                </>
              )}
            </button>
          </div>
          
          <div className="absolute bottom-2 left-2 flex items-center space-x-1 opacity-30">
            <div className="w-1.5 h-1.5 rounded-full bg-dart-black"></div>
            <div className="text-[10px] text-dart-black/70">Dartopia Cam {id}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
