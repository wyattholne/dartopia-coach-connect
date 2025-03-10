
import React from "react";
import { RefreshCw } from "lucide-react";

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
        <div className="h-full w-full flex flex-col items-center justify-center bg-dart-black/5 rounded-lg border border-dart-black/10">
          <div className="w-16 h-16 rounded-full bg-dart-black/10 mb-4 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-dart-green animate-pulse-subtle"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              ></path>
            </svg>
          </div>
          <p className="text-sm text-dart-black/70">Camera feed not connected</p>
          <p className="text-xs text-dart-black/50 mt-1">Connect your camera to start analysis</p>
          <button className="mt-4 btn-primary text-xs py-1 px-3">
            Connect Camera
          </button>
        </div>
      </div>
    </div>
  );
};
