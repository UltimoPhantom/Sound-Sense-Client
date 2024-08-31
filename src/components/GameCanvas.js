// src/components/GameCanvas.js
import React, { useEffect, useRef } from 'react';
import { initializeGame } from './GameLogic';

const GameCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    initializeGame(canvas);
  }, []);

  return <canvas ref={canvasRef}></canvas>;
};

export default GameCanvas;
