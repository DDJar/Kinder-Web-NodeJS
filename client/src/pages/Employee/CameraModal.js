import { Cancel01Icon } from 'hugeicons-react';
import React, { useRef, useState, useEffect } from 'react';
import Button from '~/components/Button';

const CameraModal = ({ onConfirm, onClose, isOpen }) => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState(null);
    const [isComplete, setIsComplete] = useState(false);
    const [isFileUpload, setIsFileUpload] = useState(false);
    const [facingMode, setFacingMode] = useState('user');
    const [deviceSize, setDeviceSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    useEffect(() => {
        const handleResize = () => {
            setDeviceSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play();
            }
            setStream(mediaStream);
        } catch (error) {
            setError('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.');
        }
    };

    const stopCamera = () => {
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
            setStream(null);
        }
    };
    const toggleCamera = () => {
        stopCamera();
        setFacingMode((prevMode) => (prevMode === 'user' ? 'environment' : 'user'));
    };

    const dataURLToFile = (dataURL, filename) => {
        const [header, base64] = dataURL.split(',');
        const mime = header.match(/:(.*?);/)[1];
        const binary = atob(base64);
        const array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        const blob = new Blob([new Uint8Array(array)], { type: mime });
        return new File([blob], filename, { type: mime });
    };

    const handleCapture = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const imageUrl = canvas.toDataURL('image/png');
        setCapturedImage(imageUrl);

        stopCamera();
    };

    const handleContinue = () => {
        if (capturedImage) {
            const randomName = `captured-image-${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;
            const file = dataURLToFile(capturedImage, randomName);
            setIsComplete(true);
            onConfirm(file);
        } else {
            setError('Chưa chụp ảnh. Vui lòng chụp ảnh trước khi tiếp tục.');
        }
    };
    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCapturedImage(e.target.result);
                setError(null);
                setIsFileUpload(true);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleRetry = () => {
        setCapturedImage(null);
        setError(null);
        setIsComplete(false);
        setIsFileUpload(false);

        if (!error) {
            startCamera();
        }
    };

    useEffect(() => {
        if (isOpen) {
            startCamera();
        } else {
            stopCamera();
            if (videoRef.current) {
                videoRef.current.srcObject = null;
            }
        }
    }, [isOpen, facingMode]);
    return (
        <div>
            {deviceSize.width > 425 ? (
                <div
                    id="default-modal"
                    tabIndex="-1"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
                    onClick={(e) => e.stopPropagation()}
                    inert={!isOpen}
                >
                    <div className="relative w-full max-w-2xl p-4 mt-7 bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="relative flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 rounded-t-lg">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Chụp ảnh xác nhận đón trẻ
                            </h3>
                            <Button
                                primary
                                icon={<Cancel01Icon />}
                                small
                                onClick={() => {
                                    stopCamera();
                                    onClose();
                                }}
                                className="rounded-md bg-red-500 text-white hover:bg-red-600"
                            />
                        </div>
                        <div className="p-4 space-y-4 text-gray-500 overflow-y-auto max-h-[80vh]">
                            {error ? (
                                <div className=" text-center">
                                    <span className="text-red-500"> {error}</span>
                                    <br />
                                    <span className="text-info">Hoặc</span>
                                    {error === 'Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.' && (
                                        <div className="mt-4">
                                            <label
                                                htmlFor="file-upload"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Chọn ảnh để tải lên
                                            </label>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="border rounded p-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {!capturedImage ? (
                                        <div className="flex flex-col items-center">
                                            <video
                                                ref={videoRef}
                                                className="w-full  mx-auto rounded-md border border-gray-300"
                                                autoPlay
                                                muted
                                            />
                                            <div className="flex justify-center gap-4">
                                                <Button
                                                    onClick={handleCapture}
                                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    Chụp Ảnh
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={capturedImage}
                                                alt="Captured"
                                                className="w-full  mx-auto rounded-md border border-gray-300 mb-4"
                                            />
                                            <div className="flex justify-center gap-4">
                                                <Button
                                                    onClick={handleRetry}
                                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                                    disable={isComplete}
                                                >
                                                    {isFileUpload ? 'Chọn Lại' : 'Chụp Lại'}
                                                </Button>
                                                <Button
                                                    onClick={handleContinue}
                                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                    disable={isComplete}
                                                >
                                                    Tiếp Tục
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div
                    id="default-modal"
                    tabIndex="-1"
                    className="fixed inset-0 z-50  flex items-center justify-center bg-black bg-opacity-50"
                    onClick={(e) => e.stopPropagation()}
                    inert={!isOpen}
                >
                    <div className=" relative w-full  p-2  bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className=" flex items-center justify-between p-4 bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 rounded-t-lg">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Chụp ảnh xác nhận đón trẻ
                            </h3>
                            <Button
                                primary
                                icon={<Cancel01Icon />}
                                small
                                onClick={() => {
                                    stopCamera();
                                    onClose();
                                }}
                                className="rounded-md bg-red-500 text-white hover:bg-red-600"
                            />
                        </div>
                        <div className="mt-7 text-gray-500 overflow-y-auto max-h-full">
                            {error ? (
                                <div className=" text-center">
                                    <span className="text-red-500"> {error}</span>
                                    <br />
                                    <span className="text-info">Hoặc</span>
                                    {error === 'Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập.' && (
                                        <div className="mt-4">
                                            <label
                                                htmlFor="file-upload"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Chọn ảnh để tải lên
                                            </label>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileUpload}
                                                className="border rounded p-2"
                                            />
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    {!capturedImage ? (
                                        <div className="flex  flex-col items-center">
                                            <video
                                                ref={videoRef}
                                                className="w-full  max-w-4xl  rounded-md border border-gray-300"
                                                autoPlay
                                                muted
                                            />
                                            <div className="flex justify-center gap-4">
                                                <Button
                                                    onClick={handleCapture}
                                                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                                >
                                                    Chụp Ảnh
                                                </Button>
                                                <Button
                                                    onClick={toggleCamera}
                                                    className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                                                >
                                                    Đổi Camera
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <img
                                                src={capturedImage}
                                                alt="Captured"
                                                className="w-full max-w-md mx-auto rounded-md border border-gray-300 mb-4"
                                            />
                                            <div className="flex justify-center gap-4">
                                                <Button
                                                    onClick={handleRetry}
                                                    className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                                    disable={isComplete}
                                                >
                                                    {isFileUpload ? 'Chọn Lại' : 'Chụp Lại'}
                                                </Button>
                                                <Button
                                                    onClick={handleContinue}
                                                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                                    disable={isComplete}
                                                >
                                                    Tiếp Tục
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CameraModal;
