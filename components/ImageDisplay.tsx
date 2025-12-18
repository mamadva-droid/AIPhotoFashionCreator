
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { Mode, TextOverlaySettings } from '../types';

interface ImageDisplayProps {
    image: string | null; // The generated/edited "after" image
    sourceImage: string | null; // The "before" image for edits
    mode: Mode;
    isLoading: boolean;
    error: string | null;
    overlaySettings: TextOverlaySettings;
    onUpdateOverlay?: (settings: TextOverlaySettings) => void;
    onUpscale?: () => void;
}

const LoadingSpinner: React.FC<{mode: Mode}> = ({mode}) => (
    <div className="flex flex-col items-center justify-center gap-4 text-gray-400">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
        <p className="text-lg">{mode === Mode.GENERATE ? 'Generating your masterpiece...' : 'Applying your edit...'}</p>
    </div>
);

const EmptyState: React.FC<{mode: Mode}> = ({mode}) => (
    <div className="flex flex-col items-center justify-center text-center text-gray-500 gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-semibold">
            {mode === Mode.GENERATE ? "Your Generated Image Will Appear Here" : "Your Edited Image Will Appear Here"}
        </h3>
        <p>
            {mode === Mode.GENERATE 
                ? "Fill out the settings on the left and click \"Generate Image\" to begin."
                : "Upload an image and provide an edit instruction to get started."
            }
        </p>
    </div>
);

const ErrorDisplay: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center text-center text-red-400 gap-4 p-4 border-2 border-dashed border-red-400/50 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold">An Error Occurred</h3>
        <p className="text-red-300">{message}</p>
    </div>
);

interface SingleImageViewProps {
    src: string;
    title?: string;
    isResult?: boolean;
    overlaySettings?: TextOverlaySettings;
    onUpdateOverlay?: (settings: TextOverlaySettings) => void;
    onUpscale?: () => void;
}

const SingleImageView: React.FC<SingleImageViewProps> = ({src, title, isResult = false, overlaySettings, onUpdateOverlay, onUpscale}) => {
    const imgRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const getOverlayStyle = () => {
        if (!overlaySettings) return {};
        
        return {
            color: overlaySettings.color,
            position: 'absolute' as 'absolute',
            left: `${overlaySettings.x}%`,
            top: `${overlaySettings.y}%`,
            transform: `translate(-50%, -50%) rotate(${overlaySettings.rotation}deg)`,
            fontFamily: overlaySettings.fontFamily,
            fontSize: `${overlaySettings.fontSize}px`, // This is visual size on screen
            whiteSpace: 'nowrap' as 'nowrap',
            cursor: onUpdateOverlay ? 'move' : 'default',
            userSelect: 'none' as 'none',
            textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
            fontWeight: 'bold',
            border: onUpdateOverlay ? '1px dashed rgba(255,255,255,0.5)' : 'none',
            padding: '4px'
        };
    };

    // Dragging Logic
    const handleMouseDown = (e: React.MouseEvent) => {
        if (onUpdateOverlay && overlaySettings?.text) {
            setIsDragging(true);
            e.stopPropagation();
            e.preventDefault();
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current || !onUpdateOverlay || !overlaySettings) return;

            const rect = containerRef.current.getBoundingClientRect();
            
            // Calculate percentage
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            // Clamp to 0-100? Optional, let's allow slight out of bounds
            onUpdateOverlay({
                ...overlaySettings,
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y))
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, onUpdateOverlay, overlaySettings]);


    const handleDownload = useCallback(() => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = src;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            // Draw Image
            ctx.drawImage(img, 0, 0);

            // Draw Overlay if exists
            if (overlaySettings && overlaySettings.text) {
                const { text, color, fontFamily, fontSize, x, y, rotation } = overlaySettings;
                
                ctx.save();
                
                // Position center
                const canvasX = canvas.width * (x / 100);
                const canvasY = canvas.height * (y / 100);
                
                ctx.translate(canvasX, canvasY);
                ctx.rotate((rotation * Math.PI) / 180);
                
                // Scale font relative to image height. 
                const scaleFactor = canvas.height / 600; // Base reference height
                const finalFontSize = fontSize * scaleFactor;

                ctx.font = `bold ${finalFontSize}px "${fontFamily}", sans-serif`;
                ctx.fillStyle = color;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                // Shadow
                ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
                ctx.shadowBlur = 4 * scaleFactor;
                ctx.shadowOffsetX = 2 * scaleFactor;
                ctx.shadowOffsetY = 2 * scaleFactor;

                ctx.fillText(text, 0, 0);
                ctx.restore();
            }

            const link = document.createElement('a');
            link.download = 'ai-generated-image.jpg';
            link.href = canvas.toDataURL('image/jpeg');
            link.click();
        };
    }, [src, overlaySettings]);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 relative">
            {title && <h3 className="text-lg font-bold text-white tracking-wider uppercase mb-2">{title}</h3>}
            
            <div className="flex items-center justify-center w-full h-full max-h-[60vh]">
                <div className="relative inline-block" ref={containerRef}>
                    <img
                        ref={imgRef}
                        src={src}
                        alt={title || "Image"}
                        className="max-w-full max-h-[60vh] object-contain rounded-md shadow-2xl block"
                        draggable={false}
                    />
                    {isResult && overlaySettings && overlaySettings.text && (
                        <div 
                            style={getOverlayStyle()}
                            onMouseDown={handleMouseDown}
                            className="select-none hover:border-white transition-colors"
                            title="Drag to move"
                        >
                            {overlaySettings.text}
                        </div>
                    )}
                </div>
            </div>
            
             {isResult && (
                <div className="flex gap-2 mt-4">
                     {onUpscale && (
                        <button
                            onClick={onUpscale}
                            className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 flex items-center gap-2 border border-indigo-500 shadow-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            AI Upscale
                        </button>
                     )}
                    <button 
                        onClick={handleDownload}
                        className="bg-gray-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors duration-200 flex items-center gap-2 border border-gray-600 shadow-md"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Download
                    </button>
                </div>
             )}
        </div>
    );
};


const ImageDisplay: React.FC<ImageDisplayProps> = ({ image, sourceImage, mode, isLoading, error, overlaySettings, onUpdateOverlay, onUpscale }) => {
    const renderContent = () => {
        if (isLoading) return <LoadingSpinner mode={mode} />;
        if (error) return <ErrorDisplay message={error} />;

        // Side-by-side view for completed edits
        if (mode === Mode.EDIT && sourceImage && image) {
            return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full">
                   <SingleImageView src={sourceImage} title="Before" />
                   <SingleImageView src={image} title="After" isResult overlaySettings={overlaySettings} onUpdateOverlay={onUpdateOverlay} onUpscale={onUpscale} />
                </div>
            )
        }
        
        // Show only the source image if it's uploaded but not yet edited
        if (mode === Mode.EDIT && sourceImage) {
            return <SingleImageView src={sourceImage} title="Ready to Edit" />;
        }

        // Show the generated image for generate mode (No overlay update here as per request)
        if (image) {
            return <SingleImageView src={image} isResult overlaySettings={overlaySettings} onUpscale={onUpscale} />;
        }

        return <EmptyState mode={mode} />;
    };

    return (
        <div className="bg-gray-900/50 border border-gray-700 rounded-lg shadow-lg flex items-center justify-center w-full min-h-[400px] lg:min-h-[600px] p-4">
            {renderContent()}
        </div>
    );
};

export default ImageDisplay;
