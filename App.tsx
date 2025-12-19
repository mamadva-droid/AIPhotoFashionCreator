
import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import ImageDisplay from './components/ImageDisplay';
import HistoryDisplay from './components/HistoryDisplay';
import HelpModal from './components/HelpModal';
import { ImageModel, AspectRatio, PhotoTypes, HistoryItem, ImageQuality, Mode, TextOverlaySettings, HistoryFolder, Language, VisualEffects, OverlayFonts, SubjectSettings, SubjectPosition, ModelPoses, CameraAngles, FocusArea, CameraModels, Lenses, Apertures, SubjectEmotions, LightingSetups, Backgrounds } from './types';
import { generateImage, editImage, upscaleImage } from './services/geminiService';

const App: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [model, setModel] = useState<ImageModel>(ImageModel.GEMINI_FLASH);
    const [photoType, setPhotoType] = useState<string>(PhotoTypes[0]);
    const [visualEffect, setVisualEffect] = useState<string>(VisualEffects[0]);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SQUARE);
    const [quality, setQuality] = useState<ImageQuality>(ImageQuality.MEDIUM);
    
    const [subjectSettings, setSubjectSettings] = useState<SubjectSettings>({
        description: '',
        position: SubjectPosition.CENTER,
        pose: ModelPoses[0].poses[0].value, 
        emotion: SubjectEmotions[0].poses[0].value,
        lighting: LightingSetups[0].poses[0].value,
        background: Backgrounds[0].poses[0].value,
        cameraAngle: CameraAngles[0].poses[0].value, 
        focusArea: FocusArea.NONE,
        focusAreas: [],
        camera: CameraModels[0].value,
        lens: Lenses[0].value,
        aperture: Apertures[0].value
    });

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
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [folders, setFolders] = useState<HistoryFolder[]>([]);
    const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
    const [rootHandle, setRootHandle] = useState<any>(null);
    const [folderHandles, setFolderHandles] = useState<Record<string, any>>({});
    const [mode, setMode] = useState<Mode>(Mode.GENERATE);
    const [sourceImage, setSourceImage] = useState<string | null>(null);
    const [editStack, setEditStack] = useState<string[]>([]);
    const [currentEditIndex, setCurrentEditIndex] = useState<number>(-1);
    const [referenceImages, setReferenceImages] = useState<string[]>([]);
    const [language, setLanguage] = useState<Language>('en');
    const [showHelp, setShowHelp] = useState(false);

    useEffect(() => {
        if (mode === Mode.EDIT) { setModel(ImageModel.GEMINI_FLASH); } 
        else { setSourceImage(null); setEditStack([]); setCurrentEditIndex(-1); setModel(ImageModel.GEMINI_FLASH); }
        setGeneratedImage(null); setError(null);
    }, [mode]);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setSourceImage(result);
                if (mode === Mode.EDIT) { setEditStack([result]); setCurrentEditIndex(0); }
                setGeneratedImage(null); setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSourceImageDrop = (base64: string) => {
        setSourceImage(base64);
        if (mode === Mode.EDIT) { setEditStack([base64]); setCurrentEditIndex(0); }
        setGeneratedImage(null); setError(null);
    };

    const activeInputImage = mode === Mode.EDIT && editStack.length > 0 ? editStack[currentEditIndex] : sourceImage;
    const displaySourceImage = mode === Mode.EDIT && editStack.length > 0 ? (currentEditIndex === 0 ? editStack[0] : editStack[currentEditIndex - 1]) : sourceImage;
    const displayGeneratedImage = mode === Mode.EDIT && editStack.length > 0 ? (currentEditIndex === 0 ? null : editStack[currentEditIndex]) : generatedImage;

    const saveToDisk = async (base64: string, promptSlug: string, currentActiveFolderId: string | null) => {
        if (!rootHandle) return;
        try {
            let targetHandle = rootHandle;
            if (currentActiveFolderId && folderHandles[currentActiveFolderId]) { targetHandle = folderHandles[currentActiveFolderId]; }
            const safePrompt = promptSlug ? promptSlug.slice(0, 30).replace(/[^a-z0-9]/gi, '_') : 'image';
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileHandle = await targetHandle.getFileHandle(`${timestamp}_${safePrompt}.png`, { create: true });
            const writable = await fileHandle.createWritable();
            const blob = await (await fetch(base64)).blob();
            await writable.write(blob); await writable.close();
        } catch (e) { console.error(e); }
    };

    const executeGeneration = useCallback(async (p: string) => {
        if (isLoading) return;
        if (mode === Mode.GENERATE && !p) return;
        if (mode === Mode.EDIT && !activeInputImage) { setError(language === 'en' ? "Upload an image" : "Загрузите фото"); return; }
        setIsLoading(true); setError(null);
        try {
            let img: string;
            if (mode === Mode.EDIT && activeInputImage) {
                img = await editImage(p || "Edit", activeInputImage, quality, visualEffect, subjectSettings, referenceImages);
            } else {
                img = await generateImage(p, photoType, model, aspectRatio, quality, visualEffect, subjectSettings, referenceImages);
            }
            await saveToDisk(img, p || "edit", activeFolderId);
            if (mode === Mode.EDIT) {
                const newStack = editStack.slice(0, currentEditIndex + 1); newStack.push(img);
                setEditStack(newStack); setCurrentEditIndex(newStack.length - 1);
            } else { setGeneratedImage(img); }
            setHistory(prev => [{ id: crypto.randomUUID(), image: img, prompt: p || "Image", photoType, model, aspectRatio, quality, mode, subjectSettings: {...subjectSettings}, folderId: activeFolderId || undefined }, ...prev]);
        } catch (err: any) { setError(err.message); } finally { setIsLoading(false); }
    }, [photoType, visualEffect, model, aspectRatio, quality, isLoading, mode, activeInputImage, editStack, currentEditIndex, subjectSettings, referenceImages, activeFolderId, rootHandle]);

    const handleGenerateClick = useCallback(() => executeGeneration(prompt), [prompt, executeGeneration]);
    const handleUpscale = useCallback(async () => {
        const target = mode === Mode.EDIT && activeInputImage ? activeInputImage : generatedImage;
        if (!target) return; setIsLoading(true);
        try {
            const upscaled = await upscaleImage(target);
            if (mode === Mode.EDIT) { setEditStack(prev => [...prev, upscaled]); setCurrentEditIndex(editStack.length); }
            else { setGeneratedImage(upscaled); }
        } catch (e: any) { setError(e.message); } finally { setIsLoading(false); }
    }, [mode, activeInputImage, generatedImage, editStack]);

    const handleSelectHistoryItem = useCallback((item: HistoryItem) => {
        setMode(item.mode); setPrompt(item.prompt); setModel(item.model); setPhotoType(item.photoType);
        setAspectRatio(item.aspectRatio); setQuality(item.quality);
        if (item.subjectSettings) setSubjectSettings({ ...item.subjectSettings });
        if (item.mode === Mode.EDIT && item.sourceImage) { setEditStack([item.sourceImage, item.image]); setCurrentEditIndex(1); setSourceImage(item.sourceImage); }
        else { setSourceImage(null); setEditStack([]); setCurrentEditIndex(-1); setGeneratedImage(item.image); }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
            <Header language={language} setLanguage={setLanguage} onOpenHelp={() => setShowHelp(true)} />
            <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} language={language} />
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 h-[calc(100vh-120px)] sticky top-24">
                        <ControlPanel
                            prompt={prompt} setPrompt={setPrompt}
                            model={model} setModel={setModel}
                            photoType={photoType} setPhotoType={setPhotoType}
                            visualEffect={visualEffect} setVisualEffect={setVisualEffect}
                            aspectRatio={aspectRatio} setAspectRatio={setAspectRatio}
                            quality={quality} setQuality={setQuality}
                            isLoading={isLoading} onGenerate={handleGenerateClick}
                            onApplyPreset={(p) => { setPrompt(p); executeGeneration(p); }}
                            mode={mode} setMode={setMode}
                            sourceImage={activeInputImage} onImageUpload={handleImageUpload}
                            onSourceImageDrop={handleSourceImageDrop}
                            onUndo={() => setCurrentEditIndex(prev => Math.max(0, prev - 1))}
                            onRedo={() => setCurrentEditIndex(prev => Math.min(editStack.length - 1, prev + 1))}
                            canUndo={mode === Mode.EDIT && currentEditIndex > 0}
                            canRedo={mode === Mode.EDIT && currentEditIndex < editStack.length - 1}
                            subjectSettings={subjectSettings} setSubjectSettings={setSubjectSettings}
                            overlaySettings={overlaySettings} setOverlaySettings={setOverlaySettings}
                            referenceImages={referenceImages} setReferenceImages={setReferenceImages}
                            language={language}
                        />
                    </div>
                    <div className="lg:col-span-2 space-y-8">
                        <ImageDisplay
                            image={displayGeneratedImage} sourceImage={displaySourceImage}
                            mode={mode} isLoading={isLoading} error={error}
                            overlaySettings={overlaySettings} onUpdateOverlay={setOverlaySettings}
                            onUpscale={handleUpscale}
                        />
                        <HistoryDisplay 
                            history={history} folders={folders} onSelect={handleSelectHistoryItem} 
                            onUpdateOrder={setHistory} onDelete={(id) => setHistory(prev => prev.filter(i => i.id !== id))}
                            onCreateFolder={(n) => setFolders(prev => [...prev, { id: crypto.randomUUID(), name: n }])}
                            onMoveToFolder={(itemId, fId) => setHistory(prev => prev.map(i => i.id === itemId ? { ...i, folderId: fId } : i))}
                            language={language} activeFolderId={activeFolderId} setActiveFolderId={setActiveFolderId}
                            onSetRootFolder={async () => {
                                const h = await (window as any).showDirectoryPicker({ mode: 'readwrite' });
                                setRootHandle(h);
                            }}
                            rootFolderName={rootHandle?.name}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default App;
