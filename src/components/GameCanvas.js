import React, { useEffect, useRef, useState } from 'react';
import { initializeGame } from './GameLogic';
import Modal from './Modal'; 

const GameCanvas = ({ playerPosition, treasureArray }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const gameControlsRef = useRef(null);

  // playerPosition.curr_x = 11040
  // playerPosition.curr_y = 319.00 

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      if (gameControlsRef.current && gameControlsRef.current.resize) {
        gameControlsRef.current.resize(width, height);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleTreasureOpen = (treasure) => {
      setModalData({
        x: treasure.x,
        y: treasure.y,
        ttIDX: treasure.tIDX,
        taskDescription: treasure.taskDescription,
        letterImage: treasure.letterImage,
        letter: treasure.letter,
        audio: treasure.audio,
      });
      setShowModal(true);
      if (gameControlsRef.current && gameControlsRef.current.pause) {
        gameControlsRef.current.pause();
      }
    };

    gameControlsRef.current = initializeGame(canvas, playerPosition, treasureArray, handleTreasureOpen);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [playerPosition, treasureArray]);

  const handleCloseModal = () => {
    setShowModal(false);
    if (gameControlsRef.current && gameControlsRef.current.resume) {
      gameControlsRef.current.resume();
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full"></canvas>
      {showModal && (
        <Modal 
          onClose={handleCloseModal} 
          data={modalData} 
        />
      )}
    </div>
  );
};

export default GameCanvas;