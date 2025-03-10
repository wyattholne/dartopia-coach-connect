
import React from "react";
import { RefreshCw, Video } from "lucide-react";

interface CameraFeedProps {
  title: string;
  id: string;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ title, id }) => {
  return (
    <div className="feed-card animate-scale-in" style={{ animationDelay: `${parseInt(id) * 100}ms` }}>
      <div className="p-3 border-b border-neutral-200 flex items-center justify-between">
        <h3 className="font-medium text-sm">{title}</h3>
        <button className="text-neutral-500 hover:text-dart-green transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      <div className="aspect-video bg-neutral-100 flex items-center justify-center p-4">
        <div className="h-full w-full flex flex-col items-center justify-center bg-dart-black/5 rounded-lg border border-dart-black/10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-neutral-200/30 flex items-center justify-center">
            {/* Red recording indicator */}
            <div className="absolute top-3 right-3 bg-red-500 h-2.5 w-2.5 rounded-full animate-pulse"></div>
            
            {/* Replace grid of circles with subtle noise pattern */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10">
              <div className="w-full h-full" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat',
                backgroundSize: '100px 100px',
              }}></div>
            </div>
          </div>
          
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-dart-black/10 mb-4 flex items-center justify-center">
              <Video
                className="w-10 h-10 text-dart-green animate-pulse-subtle"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-sm text-dart-black/70 font-medium">Camera feed not connected</p>
            <p className="text-xs text-dart-black/50 mt-1">Connect your camera to start analysis</p>
            <button className="mt-4 btn-primary text-xs py-1 px-3">
              Connect Camera
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
