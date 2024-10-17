import React, { useEffect, useRef, useState } from 'react';
import { initializeGame } from './GameLogic';
import Modal from './Modal'; 

const GameCanvas = ({ playerPosition, treasureArray }) => {
  const canvasRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const gameControlsRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (gameControlsRef.current && gameControlsRef.current.resize) {
        gameControlsRef.current.resize(canvas.width, canvas.height);
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
    <div className="fixed inset-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full"></canvas>
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