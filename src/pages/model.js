// Modal.js
import React, { useRef, useEffect, useState } from "react";
import { X, Volume2, Mic, Play, Pause, RotateCw, Repeat } from "lucide-react";
import audioFile from '../videos/a.mp3'; 
import kannada1 from '../images/aa.jpg'


const Modal = ({ onClose }) => {
    const modalRef = useRef();
    const audioRef = useRef(null); 

    const [isPlaying, setIsPlaying] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);

    // Close modal when clicking outside the content
    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

    // Close modal on pressing the 'Escape' key
    const handleEsc = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', handleEsc, false);
        return () => {
            document.removeEventListener('keydown', handleEsc, false);
        };
    }, []);

    // Play the audio
    const playAudio = () => {
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
            }).catch((error) => {
                console.error("Error playing audio:", error);
            });
        }
    };

    // Pause the audio
    const pauseAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    };

    // Toggle play/pause
    const togglePlayPause = () => {
        if (isPlaying) {
            pauseAudio();
        } else {
            playAudio();
        }
    };

    // Restart the audio
    const restartAudio = () => {
        if (audioRef.current) {
            audioRef.current.currentTime = 0;
            playAudio();
        }
    };

    //  repeat loop functionality
    const toggleRepeat = () => {
        if (audioRef.current) {
            audioRef.current.loop = !isRepeating;
            setIsRepeating(!isRepeating);
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    return (
        <div 
            ref={modalRef} 
            onClick={closeModal} 
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50"
        >
            <div className="relative bg-white rounded-lg shadow-lg w-11/12 max-w-md mx-4">
                <button 
                    onClick={onClose} 
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    aria-label="Close Modal"
                >
                    <X size={24} />
                </button>

                <div className="p-6 flex flex-col items-center gap-4">
                    <img 
                        src={kannada1}
                        alt="Descriptive Alt Text" 
                        className="w-32 h-32 object-cover rounded-full"
                    />

                    <p className="text-gray-800 text-center">
                        This is a description of the image. It provides context and information about what is depicted above.
                    </p>

                    <button 
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        onClick={togglePlayPause}
                        aria-label={isPlaying ? "Pause Pronunciation" : "Listen Pronunciation"}
                    >
                        <Volume2 size={20} />
                        {isPlaying ? 'Pause Pronunciation' : 'Listen Pronunciation'}
                    </button>

                    <audio 
                        ref={audioRef} 
                        src={audioFile} 
                        onEnded={handleAudioEnded} 
                    />

                    <div className="flex gap-4 mt-4">
                        <button 
                            className="flex items-center justify-center p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
                            onClick={togglePlayPause}
                            aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
                        >
                            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                        </button>

                        <button 
                            className="flex items-center justify-center p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                            onClick={restartAudio}
                            aria-label="Restart Audio"
                        >
                            <RotateCw size={20} />
                        </button>

                        <button 
                            className={`flex items-center justify-center p-2 rounded-full transition ${isRepeating ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
                            onClick={toggleRepeat}
                            aria-label="Toggle Repeat"
                        >
                            <Repeat size={20} />
                        </button>
                    </div>

                    <p className="text-gray-700 mt-2">
                        Children, now you can speak!
                    </p>

                    {/* Voice Record Button */}
                    <button 
                        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
                        onClick={() => {
                            // we need to write pyhon logic to record the voice from children
                        }}
                        aria-label="Record Voice"
                    >
                        <Mic size={20} />
                        Record Your Voice
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
