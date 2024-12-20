import React, { useRef, useState, useEffect } from "react";
import { X, Volume2, Mic, Play, Pause, RotateCw, Repeat, Loader } from "lucide-react";
import Confetti from 'react-confetti';

const Modal = ({ onClose, data }) => {
  const modalRef = useRef();
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiOutput, setApiOutput] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const [showConfetti, setShowConfetti] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackType, setFeedbackType] = useState('');
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

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
    // Create and set up audio element when modal opens
    const audio = new Audio(data.audioRef); // Assuming audioRef is a URL
    audioRef.current = audio;
    
    // Clean up audio when modal closes
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [data.audioRef]);

  useEffect(() => {
    document.addEventListener('keydown', handleEsc, false);
    return () => {
      document.removeEventListener('keydown', handleEsc, false);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      playAudio();
    }
  };

  const toggleRepeat = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isRepeating;
      setIsRepeating(!isRepeating);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Improved Voice Recording Functions
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

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const processedBlob = await convertToMonoAndCorrectSampleRate(blob);
        const url = URL.createObjectURL(processedBlob);
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

  const convertToMonoAndCorrectSampleRate = async (blob) => {
    const audioContext = new AudioContext({ sampleRate: 44100 });
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const offlineContext = new OfflineAudioContext(1, audioBuffer.length, 44100);
    const soundSource = offlineContext.createBufferSource();
    soundSource.buffer = audioBuffer;

    soundSource.connect(offlineContext.destination);
    soundSource.start();

    const renderedBuffer = await offlineContext.startRendering();
    return bufferToWave(renderedBuffer, renderedBuffer.length);
  };

  const bufferToWave = (abuffer, len) => {
    const numOfChan = abuffer.numberOfChannels;
    const length = len * numOfChan * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);

    const channels = [];
    let i;
    let sample;
    let offset = 0;
    let pos = 0;

    setUint32(0x46464952);
    setUint32(length - 8);
    setUint32(0x45564157);
    setUint32(0x20746d66);
    setUint32(16);
    setUint16(1);
    setUint16(numOfChan);
    setUint32(abuffer.sampleRate);
    setUint32(abuffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2);
    setUint16(16);

    setUint32(0x61746164);
    setUint32(length - pos - 4);

    for (i = 0; i < abuffer.numberOfChannels; i++) {
      channels.push(abuffer.getChannelData(i));
    }

    while (pos < length) {
      for (i = 0; i < numOfChan; i++) {
        sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
        sample = (sample < 0 ? sample * 0x8000 : sample * 0x7fff) | 0; // scale to 16-bit signed int
        view.setInt16(pos, sample, true); // write 16-bit sample
        pos += 2;
      }
      offset++; // next source sample
    }

    function setUint16(data) {
      view.setUint16(pos, data, true);
      pos += 2;
    }

    function setUint32(data) {
      view.setUint32(pos, data, true);
      pos += 4;
    }

    return new Blob([buffer], { type: "audio/wav" });
  };

  const submitAudio = async () => {
    if (!audioURL) {
      setFeedbackMessage('No audio recorded to submit.');
      setFeedbackType('error');
      return;
    }

    setIsLoading(true);
    setFeedbackMessage('');
    setApiOutput('');

    console.log("♨️treasure Contents: ♨️", data);
    const formData = new FormData();
    const response = await fetch(audioURL);
    const blob = await response.blob();
    formData.append('file', blob, 'recording.wav');

    try {
      const res = await fetch('http://127.0.0.1:5000/transcribe', {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });
      if (res.ok) {
        const apiRes = await res.json();
        console.log("♨️RESULT LETTER: ♨️", apiRes.message);
        setApiOutput(apiRes.message);

        if (apiRes.message.toLowerCase() === data.letter.toLowerCase()) {
          console.log("♨️♨️", "ITS CORRECT");
          setFeedbackMessage('Correct! Well done!');
          setFeedbackType('success');

          await updateScore();
          await collectTreasure(data.ttIDX);
          await updateCoordinates(data.x, data.y);

          setShowConfetti(true);

          setTimeout(() => {
            setShowConfetti(false);
          }, 3000);

          setTimeout(() => {
            window.location.reload();
          }, 4000);
        } else {
          setFeedbackMessage('Incorrect. Try again!');
          setFeedbackType('error');
        }
      } else {
        setFeedbackMessage('Failed to upload audio. Please try again.');
        setFeedbackType('error');
      }
    } catch (error) {
      console.error('Error submitting the audio file:', error);
      setFeedbackMessage('Error submitting audio. Please try again.');
      setFeedbackType('error');
    } finally {
      setIsLoading(false);
    }
  };


  const updateScore = async () => {
    try {
      const res = await fetch('http://localhost:8080/player/addScore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        mode: 'cors',
        body: JSON.stringify({ level: 1 })
      });

      if (res.ok) {
        const result = await res.json();
        console.log(`Updated Score: ${result.score}`);
      } else {
        console.error('Error updating score.');
      }
    } catch (err) {
      console.error('Failed to update score:', err);
    }
  };


  const updateCoordinates = async (newX, newY) => {
    try {
      const res = await fetch('http://localhost:8080/player/updateCoordinates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        mode: 'cors',
        body: JSON.stringify({ newX, newY })
      });

      if (res.ok) {
        const result = await res.json();
        console.log(`Updated Coordinates: X=${result.curr_x}, Y=${result.curr_y}`);
      } else {
        console.error('Error updating coordinates.');
      }
    } catch (err) {
      console.error('Failed to update coordinates:', err);
    }
  };


  const collectTreasure = async (treasureIndex) => {
    try {
      const res = await fetch('http://localhost:8080/player/addTreasureBox', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        mode: 'cors',
        body: JSON.stringify({ treasureIndex }),
      });

      if (res.ok) {
        const result = await res.json();
        console.log('Treasure Collected');
      } else {
        console.error('Error collecting treasure.');
      }
    } catch (err) {
      console.error('Failed to collect treasure:', err);
    }
  };


  return (
    <div
      ref={modalRef}
      onClick={closeModal}
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center z-50"
    >
      {showConfetti && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={true}
            numberOfPieces={500}
            gravity={0.3}
            initialVelocityY={20}
            tweenDuration={100}
            wind={0.05}
            origin={{ x: 0.5, y: 0 }}
          />
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-gray-700">Processing your recording...</p>
          </div>
        </div>
      )}

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
            src={data.letterImage}
            alt="Descriptive Alt Text"
            className="w-32 h-32 object-cover rounded-full"
          />

          <p className="text-gray-800 text-center">
            {data ? data.taskDescription : "This is a description of the image. It provides context and information about what is depicted above."}
          </p>

          {/* Feedback and API Output Display */}
          {(feedbackMessage || apiOutput) && (
            <div className="w-full space-y-2">
              {feedbackMessage && (
                <div className={`w-full p-3 rounded-md text-center ${feedbackType === 'success'
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                  {feedbackMessage}
                </div>
              )}
              {apiOutput && (
                <div className="w-full p-3 bg-gray-100 rounded-md text-center">
                  <span className="text-gray-600">We heard you say: </span>
                  <span className="font-semibold text-gray-800">{apiOutput}</span>
                </div>
              )}
            </div>
          )}

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
            onEnded={handleAudioEnded}
          />

          {/* <div className="flex gap-4 mt-4"> */}
            {/* <button
              className="flex items-center justify-center p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause Audio" : "Play Audio"}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button> */}

            {/* <button
              className="flex items-center justify-center p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
              onClick={restartAudio}
              aria-label="Restart Audio"
            >
              <RotateCw size={20} />
            </button> */}

            {/* <button
              className={`flex items-center justify-center p-2 rounded-full transition ${isRepeating ? 'bg-purple-500 text-white' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}`}
              onClick={toggleRepeat}
              aria-label="Toggle Repeat"
            >
              <Repeat size={20} />
            </button> */}
          {/* </div> */}

          <p className="text-gray-700 mt-2">
            Child, now you can speak!
          </p>

          <div className="mt-4 w-full">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition w-full"
              onClick={recording ? stopRecording : startRecording}
              aria-label={recording ? "Stop Recording" : "Record Voice"}
              disabled={isLoading}
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

          <div className="mt-4 w-full">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition w-full"
              onClick={submitAudio}
              aria-label="Submit Recording"
              disabled={isLoading}
            >
              Submit Recording
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;