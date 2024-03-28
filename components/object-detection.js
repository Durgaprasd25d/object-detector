"use client"
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { load as cocoSsdLoad } from "@tensorflow-models/coco-ssd";
import * as tf from "@tensorflow/tfjs";

const ObjectDetection = () => {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [net, setNet] = useState(null);
    let detectInterval = null;
    let audioTimeout = null;
    const [audioPlayer, setAudioPlayer] = useState(null); // State to hold the audio player reference

    const runCoco = async () => {
        setIsLoading(true);
        try {
            const loadedNet = await cocoSsdLoad();
            setNet(loadedNet);
            setIsLoading(false);
        } catch (error) {
            console.error("Error loading COCO-SSD model:", error);
            setIsLoading(false);
        }
    };

    const renderDetection = (ctx, detections) => {
        const isPersonDetected = detections.some(detection => detection.class === 'person');
        console.log('Is person detected:', isPersonDetected);
    
        if (isPersonDetected) {
            if (!audioPlayer || audioPlayer.paused) {
                console.log('Playing audio');
                playAudio();
            }
        } else {
            if (audioPlayer && !audioPlayer.paused) {
                console.log('Stopping audio');
                stopAudio();
            }
        }
    
        detections.forEach(detection => {
            const [x, y, width, height] = detection.bbox;
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            ctx.fillStyle = "#ffffff";
            ctx.font = "16px Arial";
            ctx.fillText(`Class: ${detection.class}`, x, y - 10);
            ctx.fillText(`Score: ${detection.score.toFixed(2)}`, x, y - 30);
        });
    };

    const playAudio = () => {
        const audio = new Audio('/person_audio.mp3');
        audio.play();
        setAudioPlayer(audio);
    };
    
    const stopAudio = () => {
        if (audioPlayer) {
            console.log('Stopping audio');
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            setAudioPlayer(null); // Reset audio player reference
        }
    };

    const runObjectDetection = async () => {
        if (canvasRef.current && webcamRef.current !== null && webcamRef.current.video?.readyState === 4) {
            const video = webcamRef.current.video;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const detectedObjects = await net.detect(canvas);
            renderDetection(ctx, detectedObjects);
        }
    };

    const showMyVideo = () => {
        if (webcamRef.current !== null && webcamRef.current.video?.readyState === 4) {
            const myVideoWidth = webcamRef.current.video.videoWidth;
            const myVideoHeight = webcamRef.current.video.videoHeight;
            webcamRef.current.video.width = myVideoWidth;
            webcamRef.current.video.height = myVideoHeight;
        }
    };

    useEffect(() => {
        runCoco();
    }, []);

    useEffect(() => {
        showMyVideo();
        return () => {
            clearInterval(detectInterval);
            stopAudio(); // Ensure audio is stopped when component unmounts
        };
    }, [webcamRef.current]);

    useEffect(() => {
        if (net) {
            detectInterval = setInterval(() => {
                runObjectDetection();
            }, 10);
        }
    }, [net]);

    return (
        <div className="mt-8">
            {isLoading ? (
                <div className="gradient-text">Loading ...</div>
            ) : (
                <div className="relative flex justify-center items-center p-1.5 rounded-md">
                    <Webcam className="rounded-md w-full lg:h-[720px]" muted ref={webcamRef} />
                    <canvas ref={canvasRef} className="absolute top-0 left-0 z-99999 w-full lg:h-[720px]"></canvas>
                </div>
            )}
        </div>
    );
};

export default ObjectDetection;
