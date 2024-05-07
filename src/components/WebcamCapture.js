import React, { useState } from 'react';
import Webcam from "react-webcam";

const WebcamCapture = ({ onCapture }) => {
  const webcamRef = React.useRef(null);
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleCapture = (imageSrc) => {
    const blob = fetch(imageSrc).then(res => res.blob());
    blob.then(blob => {
      console.log(blob.size);
      let formData = new FormData();
      formData.append('file', blob, 'user-image.jpg'); // The backend expects a file with the key 'file'
      
      fetch('http://localhost:5000/verify', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        const verificationResult = data.verified ? "Verified" : "Not Verified"; // Adjust based on actual response
        alert(`Verification result: ${verificationResult}`);
      })
      .catch(err => {
        console.error("Error verifying the image:", err);
      });
    });
  };

  const handleAnalyse = (imageSrc) => {
    const blob = fetch(imageSrc).then(res => res.blob());
    blob.then(blob => {
      console.log(blob.size);
      let formData = new FormData();
      formData.append('file', blob, 'user-image.jpg'); // The backend expects a file with the key 'file'
      
      fetch('http://localhost:5000/analyze', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        setAnalysisResult(data);
      })
      .catch(err => {
        console.error("Error Analyzing the image:", err);
      });
    });
  };

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      handleCapture(imageSrc);
    },
    [webcamRef]
  );
  
  const capture2 = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      handleAnalyse(imageSrc);
    },
    [webcamRef]
  );

  return (
    <>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width="40%"
        height="30%"
      />
      <button onClick={capture}>Verify</button>
      <button onClick={capture2}>analyse</button>
      {analysisResult && (
        <div>
          <p>Age: {analysisResult.age}</p>
          <p>Gender: {analysisResult.gender}</p>
          <p>Race: {analysisResult.race}</p>
          <p>Emotion: {analysisResult.emotion}</p>
        </div>
      )}
    </>
  );
};

export default WebcamCapture;
