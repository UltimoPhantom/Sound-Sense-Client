// src/components/GameCanvas.js
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
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Define the callback to be triggered when a treasure is opened
    const handleTreasureOpen = (treasure) => {
      setModalData({
        taskDescription: treasure.taskDescription,
        image: treasure.image,
        audio: treasure.audio,
      });
      setShowModal(true);
      
      // Pause the game
      if (gameControlsRef.current && gameControlsRef.current.pause) {
        gameControlsRef.current.pause();
      }
    };

    gameControlsRef.current = initializeGame(canvas, playerPosition, treasureArray, handleTreasureOpen);
  }, [playerPosition, treasureArray]);

  // Function to handle closing the modal and resuming the game
  const handleCloseModal = () => {
    setShowModal(false);
    
    // Resume the game
    if (gameControlsRef.current && gameControlsRef.current.resume) {
      gameControlsRef.current.resume();
    }
  };

  return (
    <div className='relative'>
      <canvas ref={canvasRef}></canvas>
      
      {/* Render the Modal when showModal is true */}
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
