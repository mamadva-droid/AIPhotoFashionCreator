
import React from 'react';
import { ImageModel, AspectRatio, PhotoTypes, ImageQuality, Mode, TextOverlaySettings, Language, VisualEffects, OverlayFonts, SubjectSettings, SubjectPosition, ModelPoses, CameraAngles, FocusArea, CameraModels, Lenses, Apertures, SubjectEmotions, LightingSetups, Backgrounds } from '../types';

interface ControlPanelProps {
    prompt: string;
    setPrompt: (value: string) => void;
    model: ImageModel;
    setModel: (value: ImageModel) => void;
    photoType: string;
    setPhotoType: (value: string) => void;
    visualEffect: string;
    setVisualEffect: (value: string) => void;
    aspectRatio: AspectRatio;
    setAspectRatio: (value: AspectRatio) => void;
    quality: ImageQuality;
    setQuality: (value: ImageQuality) => void;
    isLoading: boolean;
    onGenerate: () => void;
    onApplyPreset: (prompt: string) => void;
    mode: Mode;
    setMode: (mode: Mode) => void;
    sourceImage: string | null;
    onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSourceImageDrop?: (base64: string) => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    subjectSettings: SubjectSettings;
    setSubjectSettings: (settings: SubjectSettings) => void;
    overlaySettings: TextOverlaySettings;
    setOverlaySettings: (settings: TextOverlaySettings) => void;
    referenceImages: string[];
    setReferenceImages: (images: string[]) => void;
    language: Language;
}

const FocusGrid: React.FC<{ value: FocusArea[], onChange: (val: FocusArea[]) => void }> = ({ value, onChange }) => {
    const cells = [
        { area: FocusArea.TOP_LEFT, label: 'TL' },
        { area: FocusArea.TOP_CENTER, label: 'TC' },
        { area: FocusArea.TOP_RIGHT, label: 'TR' },
        { area: FocusArea.MIDDLE_LEFT, label: 'ML' },
        { area: FocusArea.CENTER, label: 'C' },
        { area: FocusArea.MIDDLE_RIGHT, label: 'MR' },
        { area: FocusArea.BOTTOM_LEFT, label: 'BL' },
        { area: FocusArea.BOTTOM_CENTER, label: 'BC' },
        { area: FocusArea.BOTTOM_RIGHT, label: 'BR' },
    ];

    const toggleArea = (area: FocusArea) => {
        if (value.includes(area)) {
            onChange(value.filter(v => v !== area));
        } else {
            onChange([...value, area]);
        }
    };

    return (
        <div className="grid grid-cols-3 gap-1 w-24 h-24">
            {cells.map((cell) => {
                const isSelected = value.includes(cell.area);
                return (
                    <button
                        key={cell.area}
                        type="button"
                        onClick={() => toggleArea(cell.area)}
                        className={`rounded border text-[10px] flex items-center justify-center transition-colors ${
                            isSelected 
                            ? 'bg-indigo-500 border-indigo-400 text-white font-bold' 
                            : 'bg-gray-800 border-gray-600 text-gray-500 hover:bg-gray-700'
                        }`}
                        title={cell.area}
                    >
                        {isSelected ? '●' : ''}
                    </button>
                );
            })}
        </div>
    );
};

const ControlPanel: React.FC<ControlPanelProps> = ({
    prompt,
    setPrompt,
    model,
    setModel,
    photoType,
    setPhotoType,
    visualEffect,
    setVisualEffect,
    aspectRatio,
    setAspectRatio,
    quality,
    setQuality,
    isLoading,
    onGenerate,
    mode,
    setMode,
    sourceImage,
    onImageUpload,
    onSourceImageDrop,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    subjectSettings,
    setSubjectSettings,
    overlaySettings,
    setOverlaySettings,
    referenceImages,
    setReferenceImages,
    language
}) => {
    const isGenerateMode = mode === Mode.GENERATE;
    const isButtonDisabled = isLoading || (isGenerateMode && !prompt) || (!isGenerateMode && !sourceImage);
    const buttonText = isGenerateMode ? (language === 'en' ? 'Generate Image' : 'Создать изображение') : (language === 'en' ? 'Apply Edit' : 'Применить изменения');

    const handleSubjectChange = (key: keyof SubjectSettings, value: any) => {
        setSubjectSettings({ ...subjectSettings, [key]: value });
    };

    const handleOverlayChange = (key: keyof TextOverlaySettings, value: any) => {
        setOverlaySettings({ ...overlaySettings, [key]: value });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('border-indigo-500', 'bg-indigo-900/20');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-900/20');
    };

    const handleDropSource = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-900/20');
        const data = e.dataTransfer.getData("text/plain"); 
        if (data && data.startsWith('data:image') && onSourceImageDrop) {
            onSourceImageDrop(data);
        } else if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                if (onSourceImageDrop) onSourceImageDrop(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleReferenceUpload = (index: number, base64: string) => {
        const newRefs = [...referenceImages];
        newRefs[index] = base64;
        setReferenceImages(newRefs.filter(r => r)); // filter to keep it clean
    };

    const handleDropRef = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-indigo-500', 'bg-indigo-900/20');
        const data = e.dataTransfer.getData("text/plain");
        if (data && data.startsWith('data:image')) {
            handleReferenceUpload(index, data);
        } else if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const reader = new FileReader();
            reader.onloadend = () => handleReferenceUpload(index, reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const renderReferenceSlots = () => (
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase flex items-center gap-2">
                {language === 'en' ? 'Reference Images (Max 3)' : 'Референсы (макс. 3)'}
                <span className="text-[10px] lowercase font-normal text-indigo-400 opacity-70">
                    {language === 'en' ? '(Works best with Nano Banana)' : '(Лучше с Nano Banana)'}
                </span>
            </label>
            <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((index) => (
                    <div 
                        key={index}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDropRef(e, index)}
                        className={`relative aspect-square border-2 border-dashed rounded-lg transition-all flex items-center justify-center overflow-hidden ${
                            referenceImages[index] ? 'border-indigo-500' : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'
                        }`}
                    >
                        {referenceImages[index] ? (
                            <>
                                <img src={referenceImages[index]} alt="Ref" className="w-full h-full object-cover" />
                                <button 
                                    onClick={() => {
                                        const next = [...referenceImages];
                                        next[index] = "";
                                        setReferenceImages(next.filter(Boolean));
                                    }}
                                    className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl hover:bg-red-600"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                </button>
                            </>
                        ) : (
                            <div className="text-[10px] text-gray-600 text-center p-1">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onloadend = () => handleReferenceUpload(index, reader.result as string);
                                            reader.readAsDataURL(file);
                                        }
                                    }}
                                />
                                {language === 'en' ? 'Drop Image' : 'Фото'}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg h-full flex flex-col overflow-hidden">
            {/* Mode Switcher - Fixed at the top */}
            <div className="p-6 pb-2 shrink-0 z-20 bg-gray-800 rounded-t-lg shadow-md border-b border-gray-700/50">
                <div className="flex bg-gray-900 rounded-md p-1 relative">
                    {Object.values(Mode).map((m) => (
                        <button
                            key={m}
                            onClick={() => setMode(m)}
                            className={`w-full py-2 px-4 rounded text-sm font-bold transition-colors duration-200 ${
                                mode === m ? 'bg-indigo-600 text-white shadow' : 'bg-transparent text-gray-400 hover:bg-gray-700/50'
                            }`}
                        >
                            {m === Mode.GENERATE ? (language === 'en' ? 'Generate' : 'Генерация') : (language === 'en' ? 'Edit' : 'Редактор')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Scrollable Content Container */}
            <div className="p-6 pt-4 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
                {/* Subject Customization Section */}
                <div className="flex flex-col space-y-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                    <label className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                        {language === 'en' ? 'Subject & Poses' : 'Объект и Позы'}
                    </label>
                    
                    <textarea
                        value={subjectSettings.description}
                        onChange={(e) => handleSubjectChange('description', e.target.value)}
                        placeholder={language === 'en' ? "Describe subject details..." : "Опишите детали объекта..."}
                        className="bg-gray-800 border border-gray-600 text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 h-16 resize-none"
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400">{language === 'en' ? 'Camera Angle' : 'Ракурс'}</span>
                            <select
                                value={subjectSettings.cameraAngle}
                                onChange={(e) => handleSubjectChange('cameraAngle', e.target.value)}
                                className="bg-gray-800 border border-gray-600 text-white rounded-md p-2 text-xs"
                            >
                                {CameraAngles.map(cat => (
                                    <optgroup key={cat.name.en} label={cat.name[language]}>
                                        {cat.poses.map(angle => (
                                            <option key={angle.value} value={angle.value}>{angle.label[language]}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400">{language === 'en' ? 'Model Pose' : 'Поза'}</span>
                            <select
                                value={subjectSettings.pose}
                                onChange={(e) => handleSubjectChange('pose', e.target.value)}
                                className="bg-gray-800 border border-gray-600 text-white rounded-md p-2 text-xs"
                            >
                                 {ModelPoses.map(category => (
                                    <optgroup key={category.name.en} label={category.name[language]}>
                                        {category.poses.map(pose => (
                                            <option key={pose.value} value={pose.value}>{pose.label[language]}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400">{language === 'en' ? 'Emotion & State' : 'Эмоция и состояние'}</span>
                            <select
                                value={subjectSettings.emotion || 'None (Default)'}
                                onChange={(e) => handleSubjectChange('emotion', e.target.value)}
                                className="bg-gray-800 border border-gray-600 text-white rounded-md p-2 text-xs"
                            >
                                 {SubjectEmotions.map(category => (
                                    <optgroup key={category.name.en} label={category.name[language]}>
                                        {category.poses.map(emotion => (
                                            <option key={emotion.value} value={emotion.value}>{emotion.label[language]}</option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400">{language === 'en' ? 'Placement' : 'Расположение'}</span>
                            <select
                                value={subjectSettings.position}
                                onChange={(e) => handleSubjectChange('position', e.target.value as SubjectPosition)}
                                className="bg-gray-800 border border-gray-600 text-white rounded-md p-2 text-xs"
                            >
                                {Object.values(SubjectPosition).map(pos => <option key={pos} value={pos}>{pos}</option>)}
                            </select>
                        </div>
                    </div>

                    {!isGenerateMode && (
                        <div className="border-t border-gray-700 pt-3">
                            <span className="text-xs font-bold text-gray-300">{language === 'en' ? 'Focus Areas' : 'Области фокуса'}</span>
                            <FocusGrid value={subjectSettings.focusAreas || []} onChange={(val) => handleSubjectChange('focusAreas', val)} />
                        </div>
                    )}
                </div>

                {/* Gear & Lighting Section */}
                <div className="flex flex-col space-y-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
                    <label className="text-sm font-bold text-orange-400">{language === 'en' ? 'Lighting & Gear' : 'Свет и Оборудование'}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400">{language === 'en' ? 'Lighting' : 'Освещение'}</span>
                            <select value={subjectSettings.lighting || 'Default'} onChange={(e) => handleSubjectChange('lighting', e.target.value)} className="bg-gray-800 border border-gray-600 text-white rounded-md p-2 text-xs">
                                 {LightingSetups.map(cat => (
                                    <optgroup key={cat.name.en} label={cat.name[language]}>
                                        {cat.poses.map(l => <option key={l.value} value={l.value}>{l.label[language]}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400">{language === 'en' ? 'Background' : 'Фон'}</span>
                            <select value={subjectSettings.background || 'None (Default)'} onChange={(e) => handleSubjectChange('background', e.target.value)} className="bg-gray-800 border border-gray-600 text-white rounded-md p-2 text-xs">
                                 {Backgrounds.map(cat => (
                                    <optgroup key={cat.name.en} label={cat.name[language]}>
                                        {cat.poses.map(b => <option key={b.value} value={b.value}>{b.label[language]}</option>)}
                                    </optgroup>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400">{language === 'en' ? 'Body' : 'Камера'}</span>
                            <select value={subjectSettings.camera || 'Default'} onChange={(e) => handleSubjectChange('camera', e.target.value)} className="bg-gray-800 border border-gray-600 text-white rounded-md p-2 text-xs">
                                {CameraModels.map(c => <option key={c.value} value={c.value}>{c.label[language]}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400">{language === 'en' ? 'Lens' : 'Объектив'}</span>
                            <select value={subjectSettings.lens || 'Default'} onChange={(e) => handleSubjectChange('lens', e.target.value)} className="bg-gray-800 border border-gray-600 text-white rounded-md p-2 text-xs">
                                {Lenses.map(l => <option key={l.value} value={l.value}>{l.label[language]}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Reference Images + Base Image Upload (Placement based on mode) */}
                {isGenerateMode ? (
                    <>
                        {renderReferenceSlots()}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">{language === 'en' ? 'Prompt' : 'Запрос'}</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Atmosphere, details..."
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {renderReferenceSlots()}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-400 uppercase">{language === 'en' ? 'Base Image' : 'Исходное фото'}</label>
                                {/* History controls (Undo/Redo) */}
                                <div className="flex gap-2">
                                    <button 
                                        onClick={onUndo} 
                                        disabled={!canUndo} 
                                        title={language === 'en' ? "Undo" : "Отменить"}
                                        className="p-1 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                                        </svg>
                                    </button>
                                    <button 
                                        onClick={onRedo} 
                                        disabled={!canRedo} 
                                        title={language === 'en' ? "Redo" : "Вернуть"}
                                        className="p-1 rounded bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div 
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDropSource}
                                className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-indigo-500 transition-all bg-gray-900/50"
                            >
                                <input type="file" accept="image/*" onChange={onImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                {sourceImage ? (
                                    <img src={sourceImage} alt="Preview" className="mx-auto max-h-32 rounded" />
                                ) : (
                                    <div className="text-gray-400 text-xs py-4">
                                        {language === 'en' ? 'Click or drop base image' : 'Кликните или перетащите фото'}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase">{language === 'en' ? 'Edit Prompt' : 'Что изменить'}</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Edit instructions..."
                                className="w-full bg-gray-900 border border-gray-700 text-white rounded-md p-3 text-sm focus:ring-2 focus:ring-indigo-500 h-20 resize-none"
                            />
                        </div>
                    </>
                )}

                {/* Text Overlay Section (Only in Edit Mode) */}
                {!isGenerateMode && (
                    <div className="flex flex-col space-y-3 p-4 bg-gray-900/50 rounded-xl border border-pink-500/30">
                        <label className="text-sm font-bold text-pink-400 flex items-center gap-2">
                            {language === 'en' ? 'Text Overlay' : 'Текст на фото'}
                        </label>
                        <input 
                            type="text"
                            value={overlaySettings.text}
                            onChange={(e) => handleOverlayChange('text', e.target.value)}
                            placeholder={language === 'en' ? "Enter text..." : "Введите текст..."}
                            className="bg-gray-800 border border-gray-600 text-white rounded-md p-2 text-sm"
                        />
                        {overlaySettings.text && (
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-gray-400">Font</span>
                                    <select value={overlaySettings.fontFamily} onChange={(e) => handleOverlayChange('fontFamily', e.target.value)} className="bg-gray-800 border border-gray-600 text-white rounded p-1 text-xs">
                                        {OverlayFonts.map(f => <option key={f} value={f}>{f}</option>)}
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-gray-400">Color</span>
                                    <input type="color" value={overlaySettings.color} onChange={(e) => handleOverlayChange('color', e.target.value)} className="w-full h-6 bg-transparent border-none cursor-pointer" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-gray-400">Size</span>
                                    <input type="range" min="10" max="200" value={overlaySettings.fontSize} onChange={(e) => handleOverlayChange('fontSize', parseInt(e.target.value))} />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] text-gray-400">Rotate</span>
                                    <input type="range" min="-180" max="180" value={overlaySettings.rotation} onChange={(e) => handleOverlayChange('rotation', parseInt(e.target.value))} />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Final Settings Section */}
                <div className="space-y-4 pt-4 border-t border-gray-700">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400">{language === 'en' ? 'Model' : 'Модель'}</span>
                            <select value={model} onChange={(e) => setModel(e.target.value as ImageModel)} className="bg-gray-900 border border-gray-700 text-white rounded p-2 text-xs">
                                <option value={ImageModel.GEMINI_FLASH}>Nano Banana (Flash)</option>
                                <option value={ImageModel.IMAGEN}>Imagen 4.0 (HQ)</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400">{language === 'en' ? 'Style' : 'Стиль'}</span>
                            <select value={photoType} onChange={(e) => setPhotoType(e.target.value)} className="bg-gray-900 border border-gray-700 text-white rounded p-2 text-xs">
                                {PhotoTypes.map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400">{language === 'en' ? 'Effect' : 'Эффект'}</span>
                            <select value={visualEffect} onChange={(e) => setVisualEffect(e.target.value)} className="bg-gray-900 border border-gray-700 text-white rounded p-2 text-xs">
                                {VisualEffects.map(e => <option key={e} value={e}>{e}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-xs text-gray-400">{language === 'en' ? 'Format' : 'Формат'}</span>
                            <select value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as AspectRatio)} className="bg-gray-900 border border-gray-700 text-white rounded p-2 text-xs">
                                {Object.entries(AspectRatio).map(([k,v]) => <option key={k} value={v}>{v}</option>)}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1 col-span-2">
                            <span className="text-xs text-gray-400">{language === 'en' ? 'Quality' : 'Качество'}</span>
                            <select value={quality} onChange={(e) => setQuality(e.target.value as ImageQuality)} className="bg-gray-900 border border-gray-700 text-white rounded p-2 text-xs">
                                {Object.entries(ImageQuality).map(([k, v]) => (
                                    <option key={k} value={v}>{v}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={onGenerate}
                        disabled={isButtonDisabled}
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 disabled:bg-indigo-900/50 shadow-xl transition-all"
                    >
                        {isLoading ? <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mx-auto" /> : buttonText}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ControlPanel;
