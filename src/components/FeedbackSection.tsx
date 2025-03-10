
import React from "react";
import { Target, AlertCircle } from "lucide-react";

export const FeedbackSection: React.FC = () => {
  return (
    <div className="feed-card animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="p-3 border-b border-neutral-200">
        <h3 className="font-medium text-sm">Real-time Feedback and Analysis</h3>
      </div>
      <div className="p-6 bg-white h-80">
        <div className="flex h-full flex-col items-center justify-center text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-dart-black/5 flex items-center justify-center">
            <Target className="h-8 w-8 text-dart-green/70" />
          </div>
          <h3 className="text-lg font-medium text-dart-black mb-2">No Active Analysis</h3>
          <p className="text-neutral-500 max-w-md">
            Connect your cameras and start a practice session to receive real-time feedback and analysis on your throwing technique.
          </p>
          <div className="mt-6 bg-dart-black/5 p-4 rounded-lg max-w-md text-left">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-dart-accent mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-dart-black">Tips for optimal analysis:</h4>
                <ul className="mt-2 text-sm text-neutral-600 space-y-1 list-disc pl-4">
                  <li>Ensure good lighting in your practice area</li>
                  <li>Position cameras to capture different angles</li>
                  <li>Wear contrasting colors to your background</li>
                  <li>Keep the dartboard clearly visible in at least one camera</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
