/**
 * Game Page Component
 * Main game canvas and UI overlay
 */

import { useEffect, useRef, useState } from 'react';
import { loadSpriteSheets } from '@/lib/sprites';
import { Renderer, SpriteSheets } from '@/lib/renderer';
import { GameController } from '@/lib/gameController';
import { createInitialGameState, GameState } from '@/lib/gameEngine';

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [spriteSheets, setSpriteSheets] = useState<SpriteSheets | null>(null);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [dialogue, setDialogue] = useState<{ speaker: string; text: string } | null>(null);
  const [showInventory, setShowInventory] = useState(false);

  const gameControllerRef = useRef<GameController | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize game
  useEffect(() => {
    const initGame = async () => {
      try {
        // Load sprites
        const sheets = await loadSpriteSheets();
        setSpriteSheets(sheets);

        // Initialize game state
        const initialState = createInitialGameState();
        setGameState(initialState);

        // Setup canvas
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create renderer
        const renderer = new Renderer(canvas, sheets);
        rendererRef.current = renderer;

        // Create controller
        const controller = new GameController(initialState);
        gameControllerRef.current = controller;

        controller.onStateChange = (newState) => {
          setGameState({ ...newState });
        };

        controller.onNotification = (msg) => {
          setNotifications((prev) => [...prev, msg].slice(-5));
          setTimeout(() => {
            setNotifications((prev) => prev.slice(1));
          }, 3000);
        };

        controller.onDialogue = (speaker, text) => {
          setDialogue({ speaker, text });
        };

        // Game loop
        const gameLoop = () => {
          if (gameControllerRef.current && rendererRef.current && gameState) {
            gameControllerRef.current.update();
            rendererRef.current.render(gameControllerRef.current.state);
          }
          animationFrameRef.current = requestAnimationFrame(gameLoop);
        };

        animationFrameRef.current = requestAnimationFrame(gameLoop);
      } catch (error) {
        console.error('Failed to initialize game:', error);
      }
    };

    initGame();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!gameState || !spriteSheets) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">The Endless Elevator</h1>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: 'pixelated' }}
      />

      {/* HUD Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none font-mono text-sm text-gray-300">
        {/* Top Left - Stats */}
        <div className="absolute top-4 left-4 bg-black/70 border border-gray-600 p-3 pointer-events-auto">
          <div className="mb-2">
            <span className="text-yellow-400">HP</span>: {gameState.hp}/{gameState.maxHp}
          </div>
          <div className="w-32 h-2 bg-gray-800 border border-gray-600 mb-2">
            <div
              className="h-full bg-red-600 transition-all"
              style={{ width: `${(gameState.hp / gameState.maxHp) * 100}%` }}
            />
          </div>
          <div className="mb-2">
            <span className="text-blue-400">SAN</span>: {Math.round(gameState.sanity)}/{gameState.maxSanity}
          </div>
          <div className="w-32 h-2 bg-gray-800 border border-gray-600">
            <div
              className="h-full bg-blue-600 transition-all"
              style={{ width: `${(gameState.sanity / gameState.maxSanity) * 100}%` }}
            />
          </div>
        </div>

        {/* Top Center - Floor */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-center pointer-events-auto">
          <div className="text-2xl font-bold text-yellow-400 drop-shadow-lg">FLOOR {gameState.floor}</div>
          <div className="text-xs text-gray-500">{gameState.theme.name}</div>
        </div>

        {/* Bottom Left - Controls */}
        <div className="absolute bottom-4 left-4 text-xs text-gray-600 pointer-events-auto">
          <div>[WASD/Arrows]: Move</div>
          <div>[E]: Interact</div>
          <div>[I]: Inventory</div>
        </div>

        {/* Bottom Right - Interaction Prompt */}
        {gameState.interactables.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-black border-2 border-white p-2 text-white font-bold pointer-events-auto">
            [E] INTERACT
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="absolute top-20 right-4 space-y-2 pointer-events-none">
        {notifications.map((notif, i) => (
          <div
            key={i}
            className="bg-gray-900 border-l-4 border-yellow-400 px-4 py-2 text-sm text-white animate-in fade-in slide-in-from-right"
          >
            {notif}
          </div>
        ))}
      </div>

      {/* Dialogue Box */}
      {dialogue && (
        <div
          className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-96 bg-black border-4 border-white p-6 pointer-events-auto cursor-pointer"
          onClick={() => setDialogue(null)}
        >
          <div className="text-yellow-400 font-bold mb-3 uppercase tracking-wider">{dialogue.speaker}</div>
          <div className="text-white text-sm leading-relaxed">{dialogue.text}</div>
          <div className="text-gray-500 text-xs mt-4">[Click to continue]</div>
        </div>
      )}

      {/* Inventory Screen */}
      {showInventory && (
        <div className="absolute inset-0 bg-black/90 flex items-center justify-center pointer-events-auto">
          <div className="w-full max-w-2xl bg-gray-900 border-2 border-gray-600 p-6">
            <h2 className="text-2xl font-bold text-yellow-400 mb-4">INVENTORY</h2>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-black p-4 border border-gray-600 max-h-96 overflow-y-auto">
                {gameState.inventory.length === 0 ? (
                  <div className="text-gray-500">Empty</div>
                ) : (
                  gameState.inventory.map((item, i) => (
                    <div key={i} className="text-white text-sm py-1 border-b border-gray-700">
                      {item}
                    </div>
                  ))
                )}
              </div>
              <div className="bg-black p-4 border border-gray-600">
                <div className="text-gray-400 text-sm">Select an item to view details</div>
              </div>
            </div>
            <button
              onClick={() => setShowInventory(false)}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 border border-gray-500"
            >
              Close [I]
            </button>
          </div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState.gameOver && (
        <div className="absolute inset-0 bg-black/95 flex items-center justify-center pointer-events-auto">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-red-600 mb-4">SIGNAL LOST</h1>
            <p className="text-xl text-gray-400 mb-8">You succumbed to the building.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white border border-gray-500"
            >
              RESTART
            </button>
          </div>
        </div>
      )}

      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
          backgroundSize: '100% 4px, 3px 100%',
        }}
      />
    </div>
  );
}
