
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ImageDisplay from './components/ImageDisplay';
import HistoryDisplay from './components/HistoryDisplay';
import HelpModal from './components/HelpModal';
import { ImageModel, AspectRatio, PhotoTypes, HistoryItem, ImageQuality, Mode, TextOverlaySettings, HistoryFolder, Language, VisualEffects, OverlayFonts, SubjectSettings, SubjectPosition, ModelPoses, CameraAngles, FocusArea, CameraModels, Lenses, Apertures, SubjectEmotions, LightingSetups } from './types';
import { generateImage, editImage, upscaleImage } from './services/geminiService';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [model, setModel] = useState<ImageModel>(ImageModel.IMAGEN);
    const [photoType, setPhotoType] = useState<string>(PhotoTypes[0]);
    const [visualEffect, setVisualEffect] = useState<string>(VisualEffects[0]);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
    const [quality, setQuality] = useState<ImageQuality>(ImageQuality.MEDIUM);
    
    // Subject Customization State
    const [subjectSettings, setSubjectSettings] = useState<SubjectSettings>({
        description: '',
        position: SubjectPosition.CENTER,
        pose: ModelPoses[0].poses[0].value, 
        emotion: SubjectEmotions[0].poses[0].value, // Default emotion
        lighting: LightingSetups[0].poses[0].value, // Default lighting
        cameraAngle: CameraAngles[0].value, 
        focusArea: FocusArea.NONE,
        focusAreas: [],
        camera: CameraModels[0].value,
        lens: Lenses[0].value,
        aperture: Apertures[0].value
    });

    // State for Text Overlay
    const [overlaySettings, setOverlaySettings] = useState<TextOverlaySettings>({
        text: '',
        color: '#ffffff',
        fontFamily: OverlayFonts[0],
        fontSize: 50,
        x: 50,
        y: 50,
        rotation: 0
    });
    
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // History & Folders State
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [folders, setFolders] = useState<HistoryFolder[]>([]);
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    
    // File System State
    const [rootHandle, setRootHandle] = useState<any>(null);
    const [folderHandles, setFolderHandles] = useState<Record<string, any>>({});

    const [mode, setMode] = useState<Mode>(Mode.GENERATE);
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    
    // New state for Undo/Redo
    const [editStack, setEditStack] = useState<string[]>([]);
    const [currentEditIndex, setCurrentEditIndex] = useState<number>(-1);

    // State for Reference Images (Generate Mode)
    const [referenceImages, setReferenceImages] = useState<string[]>([]);

    // Language and Help
    const [language, setLanguage] = useState<Language>('en');
    const [showHelp, setShowHelp] = useState(false);

    // Effect to handle mode changes
    useEffect(() => {
        // When switching to Edit mode, force the model to Gemini Flash
        if (mode === Mode.EDIT) {
            setModel(ImageModel.GEMINI_FLASH);
        } else {
            // When switching back to Generate, reset stack and model
            setSourceImage(null);
            setEditStack([]);
            setCurrentEditIndex(-1);
            setModel(ImageModel.IMAGEN);
        }
        // Clear previous results when mode changes
        setGeneratedImage(null);
        setError(null);

    }, [mode]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setSourceImage(result); // Persist as "original"
                if (mode === Mode.EDIT) {
                    setEditStack([result]);
                    setCurrentEditIndex(0);
                }
                setGeneratedImage(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSourceImageDrop = (base64: string) => {
        setSourceImage(base64);
        if (mode === Mode.EDIT) {
            setEditStack([base64]);
            setCurrentEditIndex(0);
        }
        setGeneratedImage(null);
        setError(null);
    };

    // Derived values for display
    const activeInputImage = mode === Mode.EDIT && editStack.length > 0
        ? editStack[currentEditIndex]
        : sourceImage;

    const displaySourceImage = mode === Mode.EDIT && editStack.length > 0
        ? (currentEditIndex === 0 ? editStack[0] : editStack[currentEditIndex - 1])
        : sourceImage;

    const displayGeneratedImage = mode === Mode.EDIT && editStack.length > 0
        ? (currentEditIndex === 0 ? null : editStack[currentEditIndex])
        : generatedImage;

    // --- File System Logic ---

    const handleSetRootFolder = async () => {
        // 1. Check for Secure Context (HTTPS)
        if (!window.isSecureContext) {
            alert(language === 'en' 
                ? "Security Restriction: Folder access requires a secure context (HTTPS or localhost)." 
                : "Ограничение безопасности: Доступ к папкам требует защищенного соединения (HTTPS или localhost).");
            return;
        }

        // 2. Check browser support
        if (!('showDirectoryPicker' in window)) {
            alert(language === 'en' 
                ? "Your browser does not support the File System Access API. Please use Chrome, Edge, or Opera on a desktop computer." 
                : "Ваш браузер не поддерживает File System Access API. Пожалуйста, используйте Chrome, Edge или Opera на компьютере.");
            return;
        }

        // 3. Check for Iframe/Preview Environment
        if (window.self !== window.top) {
            alert(language === 'en'
                ? "Security Restriction: Disk access is blocked inside this preview/iframe. Please open the app in a new tab or standalone window to use this feature."
                : "Ограничение безопасности: Доступ к диску заблокирован в окне предпросмотра. Откройте приложение в новой вкладке, чтобы использовать эту функцию.");
            return;
        }

        try {
            // Request handle
            const handle = await (window as any).showDirectoryPicker({
                mode: 'readwrite'
            });
            
            setRootHandle(handle);
            
            // Scan for existing folders to populate UI
            const newFolders: HistoryFolder[] = [];
            const newHandles: Record<string, any> = {};

            try {
                // @ts-ignore 
                for await (const entry of handle.values()) {
                    if (entry.kind === 'directory') {
                        const id = crypto.randomUUID();
                        newFolders.push({ id, name: entry.name });
                        newHandles[id] = entry;
                    }
                }
            } catch (scanError) {
                console.warn("Error scanning directory, starting empty", scanError);
            }

            setFolders(newFolders);
            setFolderHandles(newHandles);
            setActiveFolderId(null); // Reset selection to Root

        } catch (e: any) {
            if (e.name === 'AbortError') return;
            
            if (e.message && e.message.includes('Cross origin sub frames')) {
                 alert(language === 'en' 
                    ? "Security Restriction: Disk access is blocked inside this preview frame. Please open the app in a new tab." 
                    : "Ограничение: Доступ к диску заблокирован в окне предпросмотра. Откройте приложение в новой вкладке.");
                 return;
            }

            console.error("Folder selection failed", e);
            alert(language === 'en' ? `Error selecting folder: ${e.message}` : `Ошибка выбора папки: ${e.message}`);
        }
    };

    const saveToDisk = async (base64: string, promptSlug: string, currentActiveFolderId: string | null) => {
        if (!rootHandle) return;

        try {
            let targetHandle = rootHandle;

            if (currentActiveFolderId) {
                if (folderHandles[currentActiveFolderId]) {
                    targetHandle = folderHandles[currentActiveFolderId];
                } else {
                    const folderDef = folders.find(f => f.id === currentActiveFolderId);
                    if (folderDef) {
                        try {
                            targetHandle = await rootHandle.getDirectoryHandle(folderDef.name, { create: true });
                            setFolderHandles(prev => ({ ...prev, [currentActiveFolderId]: targetHandle }));
                        } catch (e) {
                            console.warn("Could not get subfolder handle, saving to root", e);
                        }
                    }
                }
            }

            const safePrompt = promptSlug ? promptSlug.slice(0, 30).replace(/[^a-z0-9]/gi, '_') : 'image';
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `${timestamp}_${safePrompt}.png`;

            const fileHandle = await targetHandle.getFileHandle(fileName, { create: true });
            const writable = await fileHandle.createWritable();
            
            const response = await fetch(base64);
            const blob = await response.blob();
            
            await writable.write(blob);
            await writable.close();

        } catch (error) {
            console.error("Failed to auto-save to disk", error);
        }
    };

    // --- Generation Logic ---

    const executeGeneration = useCallback(async (promptToExecute: string) => {
        if (isLoading) return;
        
        // Check prompt requirements depending on mode
        if (mode === Mode.GENERATE && !promptToExecute) return;
        
        if (mode === Mode.EDIT && !activeInputImage) {
            setError(language === 'en' ? "Please upload an image to edit." : "Пожалуйста, загрузите изображение для редактирования.");
            return;
        }

        setIsLoading(true);
        setError(null);
        if (mode === Mode.GENERATE) {
            setGeneratedImage(null);
        }

        try {
            let image: string;
            
            if (mode === Mode.EDIT && activeInputImage) {
                // Construct instruction for Edit Mode
                let fullInstruction = promptToExecute.trim();
                
                // If no text instruction is provided, use a default base
                if (!fullInstruction) {
                    fullInstruction = "Modify this image";
                }

                if (photoType && photoType !== 'Photorealistic') { 
                     fullInstruction += `. Change style to: ${photoType}`;
                }
                if (visualEffect && visualEffect !== 'None') {
                    fullInstruction += `. Apply visual effect: ${visualEffect}`;
                }
                
                image = await editImage(fullInstruction, activeInputImage, quality, subjectSettings, referenceImages);
            } else {
                image = await generateImage(
                    promptToExecute, 
                    photoType, 
                    model, 
                    aspectRatio, 
                    quality, 
                    subjectSettings,
                    referenceImages
                );
            }

            await saveToDisk(image, promptToExecute || "edit", activeFolderId);

            if (mode === Mode.EDIT) {
                const newStack = editStack.slice(0, currentEditIndex + 1);
                newStack.push(image);
                setEditStack(newStack);
                setCurrentEditIndex(newStack.length - 1);
            } else {
                setGeneratedImage(image);
            }

            const newHistoryItem: HistoryItem = {
                id: crypto.randomUUID(),
                image,
                prompt: promptToExecute || (language === 'en' ? "Applied Effect/Style" : "Эффект/Стиль"),
                photoType,
                model,
                aspectRatio,
                quality,
                mode,
                sourceImage: mode === Mode.EDIT ? activeInputImage || undefined : undefined,
                subjectSettings: subjectSettings,
                referenceImages: referenceImages,
                folderId: activeFolderId || undefined 
            };
            setHistory(prev => [newHistoryItem, ...prev]);

        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [photoType, visualEffect, model, aspectRatio, quality, isLoading, mode, activeInputImage, editStack, currentEditIndex, subjectSettings, referenceImages, activeFolderId, rootHandle, folderHandles, folders, language]);

    const handleGenerateClick = useCallback(() => {
        executeGeneration(prompt);
    }, [prompt, executeGeneration]);

    const handleApplyPreset = useCallback((presetPrompt: string) => {
        setPrompt(presetPrompt);
        executeGeneration(presetPrompt);
    }, [executeGeneration]);

    // Upscale Logic
    const handleUpscale = useCallback(async () => {
        const targetImage = mode === Mode.EDIT && activeInputImage ? activeInputImage : generatedImage;
        if (!targetImage) return;

        setIsLoading(true);
        setError(null);
        
        try {
            const upscaled = await upscaleImage(targetImage);
            
            // Auto save
            await saveToDisk(upscaled, "upscale", activeFolderId);
            
            if (mode === Mode.EDIT) {
                 const newStack = editStack.slice(0, currentEditIndex + 1);
                 newStack.push(upscaled);
                 setEditStack(newStack);
                 setCurrentEditIndex(newStack.length - 1);
            } else {
                // In generate mode, just update result
                setGeneratedImage(upscaled);
            }

            // Add to history
            const newHistoryItem: HistoryItem = {
                id: crypto.randomUUID(),
                image: upscaled,
                prompt: "Upscaled Image",
                model: ImageModel.GEMINI_FLASH,
                photoType: "Upscaled",
                aspectRatio: aspectRatio,
                quality: ImageQuality.HIGH,
                mode: mode,
                sourceImage: targetImage,
                folderId: activeFolderId || undefined
            };
            setHistory(prev => [newHistoryItem, ...prev]);

        } catch (err) {
             if (err instanceof Error) setError(err.message);
             else setError("Upscale failed");
        } finally {
            setIsLoading(false);
        }
    }, [mode, activeInputImage, generatedImage, activeFolderId, editStack, currentEditIndex, aspectRatio, saveToDisk]);

    const handleSelectHistoryItem = useCallback((item: HistoryItem) => {
        setMode(item.mode);
        setPrompt(item.prompt);
        setModel(item.model);
        setPhotoType(item.photoType);
        setAspectRatio(item.aspectRatio);
        setQuality(item.quality);
        setError(null);
        
        setVisualEffect(VisualEffects[0]); 

        if (item.subjectSettings) {
             // Handle migration if 'pose' or 'cameraAngle' are missing from old history items
            const newSettings: SubjectSettings = {
                ...item.subjectSettings,
                pose: (item.subjectSettings as any).pose || ModelPoses[0].poses[0].value,
                emotion: (item.subjectSettings as any).emotion || SubjectEmotions[0].poses[0].value, // Fallback for legacy
                lighting: (item.subjectSettings as any).lighting || LightingSetups[0].poses[0].value, // Fallback for legacy
                cameraAngle: (item.subjectSettings as any).cameraAngle || CameraAngles[0].value,
                
                // Fallback for new properties
                focusArea: (item.subjectSettings as any).focusArea || FocusArea.NONE,
                focusAreas: (item.subjectSettings as any).focusAreas || [], // Initialize array

                camera: (item.subjectSettings as any).camera || CameraModels[0].value,
                lens: (item.subjectSettings as any).lens || Lenses[0].value,
                aperture: (item.subjectSettings as any).aperture || Apertures[0].value
            };
            
            // Migration logic: if only legacy focusArea exists, push it to array
            if (newSettings.focusAreas && newSettings.focusAreas.length === 0 && newSettings.focusArea && newSettings.focusArea !== FocusArea.NONE) {
                 newSettings.focusAreas.push(newSettings.focusArea);
            }
            
            setSubjectSettings(newSettings);
        } else if (item.characterDescription) {
            // Migration for old history items
            setSubjectSettings({
                description: item.characterDescription,
                position: SubjectPosition.CENTER,
                pose: ModelPoses[0].poses[0].value,
                emotion: SubjectEmotions[0].poses[0].value,
                lighting: LightingSetups[0].poses[0].value,
                cameraAngle: CameraAngles[0].value,
                focusArea: FocusArea.NONE,
                focusAreas: [],
                camera: CameraModels[0].value,
                lens: Lenses[0].value,
                aperture: Apertures[0].value
            });
        } else {
            setSubjectSettings({
                description: '',
                position: SubjectPosition.CENTER,
                pose: ModelPoses[0].poses[0].value,
                emotion: SubjectEmotions[0].poses[0].value,
                lighting: LightingSetups[0].poses[0].value,
                cameraAngle: CameraAngles[0].value,
                focusArea: FocusArea.NONE,
                focusAreas: [],
                camera: CameraModels[0].value,
                lens: Lenses[0].value,
                aperture: Apertures[0].value
            });
        }
        
        if (item.referenceImages) {
            setReferenceImages(item.referenceImages);
        } else {
            setReferenceImages([]);
        }

        if (item.mode === Mode.EDIT && item.sourceImage) {
            setEditStack([item.sourceImage, item.image]);
            setCurrentEditIndex(1);
            setSourceImage(item.sourceImage);
        } else {
            setSourceImage(null);
            setEditStack([]);
            setCurrentEditIndex(-1);
            setGeneratedImage(item.image);
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleUndo = () => {
        if (currentEditIndex > 0) {
            setCurrentEditIndex(prev => prev - 1);
        }
    };

    const handleRedo = () => {
        if (currentEditIndex < editStack.length - 1) {
            setCurrentEditIndex(prev => prev + 1);
        }
    };

    const updateHistoryOrder = (newHistory: HistoryItem[]) => {
        setHistory(newHistory);
    };

    const deleteHistoryItem = (id: string) => {
        setHistory(prev => prev.filter(item => item.id !== id));
    };

    const createFolder = async (name: string) => {
        const newId = crypto.randomUUID();
        
        if (rootHandle) {
            try {
                const subHandle = await rootHandle.getDirectoryHandle(name, { create: true });
                setFolderHandles(prev => ({ ...prev, [newId]: subHandle }));
            } catch (e) {
                console.error("Could not create folder on disk", e);
            }
        }

        const newFolder: HistoryFolder = { id: newId, name };
        setFolders(prev => [...prev, newFolder]);
        setActiveFolderId(newId);
    };

    const moveItemToFolder = (itemId: string, folderId: string | undefined) => {
        setHistory(prev => prev.map(item => 
            item.id === itemId ? { ...item, folderId } : item
        ));
    };

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <Header 
                language={language} 
                setLanguage={setLanguage} 
                onOpenHelp={() => setShowHelp(true)} 
            />
            
            <HelpModal 
                isOpen={showHelp} 
                onClose={() => setShowHelp(false)} 
                language={language} 
            />

            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 h-[calc(100vh-100px)] sticky top-20">
                        <ControlPanel
                            prompt={prompt}
                            setPrompt={setPrompt}
                            model={model}
                            setModel={setModel}
                            photoType={photoType}
                            setPhotoType={setPhotoType}
                            visualEffect={visualEffect}
                            setVisualEffect={setVisualEffect}
                            aspectRatio={aspectRatio}
                            setAspectRatio={setAspectRatio}
                            quality={quality}
                            setQuality={setQuality}
                            isLoading={isLoading}
                            onGenerate={handleGenerateClick}
                            onApplyPreset={handleApplyPreset}
                            mode={mode}
                            setMode={setMode}
                            sourceImage={activeInputImage}
                            onImageUpload={handleImageUpload}
                            onSourceImageDrop={handleSourceImageDrop}
                            onUndo={handleUndo}
                            onRedo={handleRedo}
                            canUndo={mode === Mode.EDIT && currentEditIndex > 0}
                            canRedo={mode === Mode.EDIT && currentEditIndex < editStack.length - 1}
                            subjectSettings={subjectSettings}
                            setSubjectSettings={setSubjectSettings}
                            overlaySettings={overlaySettings}
                            setOverlaySettings={setOverlaySettings}
                            referenceImages={referenceImages}
                            setReferenceImages={setReferenceImages}
                            language={language}
                        />
                    </div>
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <ImageDisplay
                            image={displayGeneratedImage}
                            sourceImage={displaySourceImage}
                            mode={mode}
                            isLoading={isLoading}
                            error={error}
                            overlaySettings={overlaySettings}
                            onUpdateOverlay={setOverlaySettings}
                            onUpscale={handleUpscale}
                        />
                         <HistoryDisplay 
                            history={history} 
                            folders={folders}
                            onSelect={handleSelectHistoryItem} 
                            onUpdateOrder={updateHistoryOrder}
                            onDelete={deleteHistoryItem}
                            onCreateFolder={createFolder}
                            onMoveToFolder={moveItemToFolder}
                            language={language}
                            activeFolderId={activeFolderId}
                            setActiveFolderId={setActiveFolderId}
                            onSetRootFolder={handleSetRootFolder}
                            rootFolderName={rootHandle ? rootHandle.name : null}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
