'use client';
// components/Attendance.tsx
import React, { useRef, useState, useEffect } from 'react';

const Attendance: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [videoWidth, setVideoWidth] = useState(50); // Default width as 50%

  useEffect(() => {
    const startCamera = async () => {
      try {
        console.log("Requesting camera access...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraOn(true);
      } catch (err) {
        console.error("Error accessing the camera: ", err);
        if (err instanceof DOMException) {
          if (err.name === 'NotAllowedError') {
            console.error("Camera access was denied by the user or the system");
          } else if (err.name === 'NotFoundError') {
            console.error("No camera found on the device");
          } else if (err.name === 'NotReadableError') {
            console.error("Camera is already in use by another application");
          } else if (err.name === 'OverconstrainedError') {
            console.error("Camera doesn't satisfy the constraints");
          } else if (err.name === 'SecurityError') {
            console.error("Media support is disabled in this browser");
          }
        }
        // You might want to set an error state here to display to the user
      }
    };

    startCamera();

    // Cleanup: Stop the camera when the component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  // Capture the current frame from the video
  const captureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (canvas && video) {
      const context = canvas.getContext('2d');
      if (context) {
        // Set canvas size equal to video size
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas content to a base64 image and store it
        const image = canvas.toDataURL('image/png');
        console.log('Captured image:', image);
        setCapturedImage(image);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-center text-2xl font-semibold mb-6">Attendance Camera Capture</h1>
      
      <div className="flex flex-col items-center">
        {isCameraOn ? (
          <>
            <video
              ref={videoRef}
              className="rounded-md shadow-lg "
              style={{ width: `${videoWidth}%`, height: 'auto' }}
              autoPlay
              playsInline
              muted
            />
            <button
              onClick={captureImage}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Take Picture
            </button>

            {/* Slider to adjust video size */}
            <div className="mt-4 flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Adjust Size:</label>
              <input
                type="range"
                min="10"
                max="100"
                value={videoWidth}
                onChange={(e) => setVideoWidth(Number(e.target.value))}
                className="slider w-40"
              />
            </div>
          </>
        ) : (
          <p className="text-gray-500">Loading camera...</p>
        )}
      </div>
  
      {/* Hidden canvas for capturing the video frame */}
      <canvas ref={canvasRef} className="hidden" />
  
      {/* Display the captured image */}
      {capturedImage && (
        <div className="mt-8 text-center">
          <h2 className="text-xl font-semibold">Captured Image:</h2>
          <img
            src={capturedImage}
            alt="Captured"
            className="mt-4 w-auto h-64 object-cover rounded shadow-lg scale-x-[-1]"
          />
        </div>
      )}
    </div>
  );
};

export default Attendance;
