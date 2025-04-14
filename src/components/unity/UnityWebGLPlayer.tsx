import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Card } from '@/components/ui/card';

interface UnityWebGLPlayerProps {
  unityLoaderUrl: string;
  unityDataUrl: string;
  unityFrameworkUrl: string;
  unityCodeUrl: string;
  width?: string;
  height?: string;
  onGameLoaded?: () => void;
  onGameMessage?: (message: any) => void;
}

// Export type for the ref
export type UnityWebGLPlayerRef = {
  sendMessageToUnity: (gameObject: string, method: string, parameter: any) => void;
};

declare global {
  interface Window {
    createUnityInstance: any;
    unityInstance: any;
    receiveUnityMessage: (message: any) => void; // Add this to the Window interface
  }
}

const UnityWebGLPlayer = forwardRef<UnityWebGLPlayerRef, UnityWebGLPlayerProps>(({
  unityLoaderUrl,
  unityDataUrl,
  unityFrameworkUrl,
  unityCodeUrl,
  width = '100%',
  height = '600px',
  onGameLoaded,
  onGameMessage,
}, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadingBarRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const loadingTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Unity loader script
    const script = document.createElement('script');
    script.src = unityLoaderUrl;
    script.async = true;

    script.onload = () => {
      // Once the loader is ready, load the Unity WebGL build
      if (window.createUnityInstance && canvasRef.current) {
        window.createUnityInstance(canvasRef.current, {
          dataUrl: unityDataUrl,
          frameworkUrl: unityFrameworkUrl,
          codeUrl: unityCodeUrl,
          streamingAssetsUrl: "StreamingAssets",
          companyName: "Assessment System",
          productName: "Scenario Assessment",
          productVersion: "1.0",
        }, (progress: number) => {
          // Update loading progress
          if (progressBarRef.current && loadingTextRef.current) {
            progressBarRef.current.style.width = `${progress * 100}%`;
            loadingTextRef.current.innerText = `Loading: ${Math.round(progress * 100)}%`;
          }
        }).then((unityInstance: any) => {
          // Unity instance is loaded
          window.unityInstance = unityInstance;
          
          // Hide loading bar
          if (loadingBarRef.current) {
            loadingBarRef.current.style.display = 'none';
          }
          
          // Set up message handler from Unity
          const handleUnityMessage = (message: any) => {
            if (onGameMessage) {
              onGameMessage(message);
            }
          };
          
          // Expose the handler to window for Unity to call
          window.receiveUnityMessage = handleUnityMessage;
          
          // Notify parent that the game is loaded
          if (onGameLoaded) {
            onGameLoaded();
          }
        }).catch((error: any) => {
          console.error('Unity WebGL build error:', error);
        });
      }
    };

    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      if (window.unityInstance) {
        window.unityInstance.Quit();
        window.unityInstance = null;
      }
      document.body.removeChild(script);
    };
  }, [unityLoaderUrl, unityDataUrl, unityFrameworkUrl, unityCodeUrl, onGameLoaded, onGameMessage]);

  // Function to send messages to Unity
  const sendMessageToUnity = (gameObject: string, method: string, parameter: any) => {
    if (window.unityInstance) {
      window.unityInstance.SendMessage(gameObject, method, parameter);
    }
  };

  // Expose the sendMessage function to the parent component
  useImperativeHandle(ref, () => ({
    sendMessageToUnity,
  }));

  return (
    <Card className="relative overflow-hidden rounded-lg border shadow-lg">
      <div 
        ref={loadingBarRef} 
        className="absolute top-0 left-0 w-full bg-gray-200 h-4 z-10"
      >
        <div 
          ref={progressBarRef} 
          className="h-full bg-candidate-primary transition-all duration-300"
          style={{ width: '0%' }}
        ></div>
        <div 
          ref={loadingTextRef} 
          className="absolute top-0 left-0 w-full text-center text-xs text-white font-medium"
        >
          Loading: 0%
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        style={{ width, height }}
        className="bg-black"
      />
    </Card>
  );
});

UnityWebGLPlayer.displayName = 'UnityWebGLPlayer';

export default UnityWebGLPlayer;
