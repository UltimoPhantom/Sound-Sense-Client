// src/components/Modal.js
import React, { useRef, useEffect, useState } from "react";
import { X, Volume2, Mic, Play, Pause, RotateCw, Repeat } from "lucide-react";
import image1 from '../images/l1_img1.jpg';
import image2 from '../images/l1_img2.png';
import image3 from '../images/l1_img3.jpg';

import audio1 from '../videos/a.wav';


const Modal = ({ onClose, data }) => { 
    const modalRef = useRef();
    const audioRef = useRef(null); 

    const [isPlaying, setIsPlaying] = useState(false);
    const [isRepeating, setIsRepeating] = useState(false);
    const [recording, setRecording] = useState(false);
    const [audioURL, setAudioURL] = useState(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

    const closeModal = (e) => {
        if (modalRef.current === e.target) {
            onClose();
        }
    };

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

    // Repeat loop functionality
    const toggleRepeat = () => {
        if (audioRef.current) {
            audioRef.current.loop = !isRepeating;
            setIsRepeating(!isRepeating);
        }
    };

    const handleAudioEnded = () => {
        setIsPlaying(false);
    };

    // Voice Recording Functions
    const startRecording = async () => {
        if (!navigator.mediaDevices) {
            alert('Your browser does not support audio recording.');
            return;
        }
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();
            setRecording(true);
            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                setAudioURL(url);
            };
        } catch (error) {
            console.error("Error accessing microphone:", error);
            alert('Could not access your microphone.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setRecording(false);
        }
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
                        src={image1} 
                        alt="Descriptive Alt Text" 
                        className="w-32 h-32 object-cover rounded-full"
                    />

                    <p className="text-gray-800 text-center">
                        {data ? data.taskDescription : "This is a description of the image. It provides context and information about what is depicted above."}
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
                        src={audio1}
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
                    <div className="mt-4 w-full">
                        <button 
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition w-full"
                            onClick={recording ? stopRecording : startRecording}
                            aria-label={recording ? "Stop Recording" : "Record Voice"}
                        >
                            <Mic size={20} />
                            {recording ? 'Stop Recording' : 'Record Your Voice'}
                        </button>

                        {audioURL && (
                            <div className="mt-2 w-full flex flex-col items-center">
                                <audio src={audioURL} controls className="w-full" />
                                <a href={audioURL} download="recording.wav" className="text-blue-500 underline mt-2">
                                    Download Recording
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
