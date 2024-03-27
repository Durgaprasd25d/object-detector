"use client";
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

    const renderDetection = (ctx, detection) => {
        // Get bounding box coordinates
        const [x, y, width, height] = detection.bbox;
    
        // Draw bounding box
        ctx.strokeStyle = "#ff0000"; // Red color
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, width, height);
    
        // Display class and score
        ctx.fillStyle = "#ffffff"; // White color
        ctx.font = "16px Arial";
        ctx.fillText(`Class: ${detection.class}`, x, y - 10);
        ctx.fillText(`Score: ${detection.score.toFixed(2)}`, x, y - 30);
    };
    
    const runObjectDetection = async () => {
        if (canvasRef.current && webcamRef.current !== null && webcamRef.current.video?.readyState === 4) {
            const video = webcamRef.current.video;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            
            const ctx = canvas.getContext("2d");
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Find all detections
            const detectedObjects = await net.detect(canvas);
            
            // Render each detection
            detectedObjects.forEach(detection => {
                renderDetection(ctx, detection);
            });
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
        // Clear interval on component unmount
        return () => {
            clearInterval(detectInterval);
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
                    {/* Add the canvas component here */}
                    <canvas ref={canvasRef} className="absolute top-0 left-0 z-99999 w-full lg:h-[720px]"></canvas>
                </div>
            )}
        </div>
    );
};

export default ObjectDetection;
 