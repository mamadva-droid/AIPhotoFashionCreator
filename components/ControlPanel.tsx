
import React, { useState } from 'react';
import { ImageModel, AspectRatio, PhotoTypes, ImageQuality, Mode, TextOverlaySettings, Language, VisualEffects, OverlayFonts, SubjectSettings, SubjectPosition, ModelPoses, CameraAngles, FocusArea, CameraModels, Lenses, Apertures, SubjectEmotions, LightingSetups } from '../types';

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

const Tooltip: React.FC<{ content: { en: string, ru: string }, language: Language }> = ({ content, language }) => {
    return (
        <div className="group relative flex items-center ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 hover:text-indigo-400 cursor-help" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-xs text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-48 text-center pointer-events-none border border-gray-700 shadow-xl z-20">
                {content[language]}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
            </div>
        </div>
    );
};

const translations = {
    mode: { en: "Switch between creating new images and editing existing ones.", ru: "Переключение между созданием новых изображений и редактированием существующих." },
    subject: { en: "Customize the subject's details, pose, and camera angle.", ru: "Настройте детали, позу и ракурс камеры." },
    gear: { en: "Select professional camera body, lens, and aperture settings.", ru: "Выберите профессиональную камеру, объектив и диафрагму." },
    references: { en: "Upload up to 3 images to guide the AI's style or composition.", ru: "Загрузите до 3 изображений для задания стиля или композиции ИИ." },
    upload: { en: "Upload the base image you want to edit.", ru: "Загрузите базовое изображение, которое вы хотите отредактировать." },
    overlay: { en: "Add text on top of your final image.", ru: "Добавьте текст поверх вашего итогового изображения." },
    prompt: { en: "Describe in detail what you want the AI to generate or how to edit.", ru: "Подробно опишите, что ИИ должен сгенерировать или как изменить изображение." },
    model: { en: "Choose the AI model. Imagen is best for quality, Gemini Flash for speed/refs.", ru: "Выберите модель ИИ. Imagen лучше для качества, Gemini Flash для скорости/референсов." },
    style: { en: "Select an artistic style for your generation.", ru: "Выберите художественный стиль для генерации." },
    effects: { en: "Apply visual effects like lighting, blurs, or filters.", ru: "Примените визуальные эффекты, такие как освещение, размытие или фильтры." },
    quality: { en: "Set the resolution and detail level (up to 4K).", ru: "Установите разрешение и уровень детализации (до 4K)." },
    aspect: { en: "Choose the dimensions/shape of your image.", ru: "Выберите пропорции/форму вашего изображения." },
    focus: { en: "Select the area of the image to apply changes to. Multiple selection allowed.", ru: "Выберите область изображения, где применить изменения. Можно выбрать несколько." },
};

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
    onApplyPreset,
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
    const isImagenModel = model === ImageModel.IMAGEN;
    
    const isButtonDisabled = isLoading || (isGenerateMode && !prompt) || (!isGenerateMode && !sourceImage);
    
    const buttonText = isGenerateMode ? (language === 'en' ? 'Generate Image' : 'Создать изображение') : (language === 'en' ? 'Apply Edit' : 'Применить редактирование');

    const handleOverlayChange = (key: keyof TextOverlaySettings, value: any) => {
        setOverlaySettings({ ...overlaySettings, [key]: value });
    };

    const handleSubjectChange = (key: keyof SubjectSettings, value: any) => {
        setSubjectSettings({ ...subjectSettings, [key]: value });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('border-indigo-500', 'bg-gray-800');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-indigo-500', 'bg-gray-800');
    };

    const handleDropSource = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-indigo-500', 'bg-gray-800');
        
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

    const handleDropReference = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-indigo-500', 'bg-gray-800');

        const addRef = (base64: string) => {
            const newRefs = [...referenceImages];
            if (index < newRefs.length) {
                newRefs[index] = base64;
            } else {
                newRefs.push(base64);
            }
            setReferenceImages(newRefs.slice(0, 3));
        };

        const data = e.dataTransfer.getData("text/plain");
        if (data && data.startsWith('data:image')) {
            addRef(data);
        } else if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                addRef(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRefUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const newRefs = [...referenceImages];
                if (index < newRefs.length) {
                    newRefs[index] = reader.result as string;
                } else {
                    newRefs.push(reader.result as string);
                }
                setReferenceImages(newRefs.slice(0, 3));
            };
            reader.readAsDataURL(file);
        }
    };

    const removeReference = (index: number) => {
        const newRefs = referenceImages.filter((_, i) => i !== index);
        setReferenceImages(newRefs);
    };

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-6 h-full flex flex-col overflow-y-auto custom-scrollbar">
            {/* Mode Switcher */}
            <div className="flex bg-gray-900 rounded-md p-1 shrink-0 relative">
                {Object.values(Mode).map((m) => (
                    <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`w-full py-2 px-4 rounded text-sm font-bold transition-colors duration-200 ${
                            mode === m
                                ? 'bg-indigo-600 text-white shadow'
                                : 'bg-transparent text-gray-400 hover:bg-gray-700/50'
                        }`}
                    >
                        {m === Mode.GENERATE 
                            ? (language === 'en' ? 'Generate' : 'Генерация') 
                            : (language === 'en' ? 'Edit' : 'Редактор')
                        }
                    </button>
                ))}
                <div className="absolute -right-6 top-2">
                    <Tooltip content={translations.mode} language={language} />
                </div>
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-white shrink-0">{isGenerateMode ? (language === 'en' ? 'Generation Settings' : 'Настройки генерации') : (language === 'en' ? 'Editing Settings' : 'Настройки редактирования')}</h2>

            {/* Subject Customization */}
            <div className="flex flex-col space-y-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center">
                    <label className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {language === 'en' ? 'Subject Customization' : 'Настройка объекта'}
                    </label>
                    <Tooltip content={translations.subject} language={language} />
                </div>
                
                {/* Description */}
                <textarea
                    value={subjectSettings.description}
                    onChange={(e) => handleSubjectChange('description', e.target.value)}
                    placeholder={language === 'en' ? "Describe the subject (e.g., 'A cyberpunk warrior with neon blue hair')." : "Опишите объект (например, 'Киберпанк воин с синими волосами')."}
                    className="bg-gray-800 border border-gray-600 text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none h-16"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Camera Angle */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400">{language === 'en' ? 'Camera Angle' : 'Ракурс камеры'}</span>
                        <select
                            value={subjectSettings.cameraAngle}
                            onChange={(e) => handleSubjectChange('cameraAngle', e.target.value)}
                            className="bg-gray-800 border border-gray-600 text-white rounded-md p-1 text-xs focus:ring-1 focus:ring-indigo-500"
                        >
                            {CameraAngles.map(angle => (
                                <option key={angle.value} value={angle.value}>{angle.label[language]}</option>
                            ))}
                        </select>
                    </div>

                    {/* Pose Selection */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400">{language === 'en' ? 'Model Pose' : 'Поза модели'}</span>
                        <select
                            value={subjectSettings.pose}
                            onChange={(e) => handleSubjectChange('pose', e.target.value)}
                            className="bg-gray-800 border border-gray-600 text-white rounded-md p-1 text-xs focus:ring-1 focus:ring-indigo-500"
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

                    {/* Emotion / Expression Selection */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <span className="text-xs text-gray-400">{language === 'en' ? 'Emotion / Expression' : 'Эмоция / Выражение лица'}</span>
                        <select
                            value={subjectSettings.emotion || 'None (Default)'}
                            onChange={(e) => handleSubjectChange('emotion', e.target.value)}
                            className="bg-gray-800 border border-gray-600 text-white rounded-md p-1 text-xs focus:ring-1 focus:ring-indigo-500"
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

                    {/* Position Control */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <span className="text-xs text-gray-400">{language === 'en' ? 'Placement' : 'Размещение'}</span>
                        <select
                            value={subjectSettings.position}
                            onChange={(e) => handleSubjectChange('position', e.target.value as SubjectPosition)}
                            className="bg-gray-800 border border-gray-600 text-white rounded-md p-1 text-xs focus:ring-1 focus:ring-indigo-500"
                        >
                            {Object.values(SubjectPosition).map(pos => (
                                <option key={pos} value={pos}>{pos}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Focus Area (Edit Mode Only) */}
                {!isGenerateMode && (
                    <div className="flex flex-col gap-2 pt-2 border-t border-gray-700">
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-300 font-semibold">{language === 'en' ? 'Focus Area (Multi-Select)' : 'Область фокуса (Мульти)'}</span>
                            <Tooltip content={translations.focus} language={language} />
                        </div>
                        <div className="flex gap-4 items-center">
                            <FocusGrid 
                                value={subjectSettings.focusAreas || []} 
                                onChange={(val) => handleSubjectChange('focusAreas', val)} 
                            />
                            <p className="text-[10px] text-gray-400 flex-1">
                                {language === 'en' 
                                    ? "Click cells to focus edits. Click again to deselect." 
                                    : "Нажмите на ячейки для фокуса. Нажмите еще раз, чтобы убрать."
                                }
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Gear & Lighting Settings */}
            <div className="flex flex-col space-y-3 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                <div className="flex items-center">
                    <label className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {language === 'en' ? 'Gear & Lighting' : 'Оборудование и Свет'}
                    </label>
                    <Tooltip content={translations.gear} language={language} />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Lighting Setup (New) */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <span className="text-xs text-orange-300 font-semibold">{language === 'en' ? 'Lighting Setup' : 'Схема освещения'}</span>
                        <select
                            value={subjectSettings.lighting || 'Default'}
                            onChange={(e) => handleSubjectChange('lighting', e.target.value)}
                            className="bg-gray-800 border border-gray-600 text-white rounded-md p-1 text-xs focus:ring-1 focus:ring-indigo-500"
                        >
                            {LightingSetups.map(category => (
                                <optgroup key={category.name.en} label={category.name[language]}>
                                    {category.poses.map(lighting => (
                                        <option key={lighting.value} value={lighting.value}>{lighting.label[language]}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Camera Body */}
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <span className="text-xs text-gray-400">{language === 'en' ? 'Camera Body' : 'Камера'}</span>
                        <select
                            value={subjectSettings.camera || 'Default'}
                            onChange={(e) => handleSubjectChange('camera', e.target.value)}
                            className="bg-gray-800 border border-gray-600 text-white rounded-md p-1 text-xs focus:ring-1 focus:ring-indigo-500"
                        >
                            {CameraModels.map(cam => (
                                <option key={cam.value} value={cam.value}>{cam.label[language]}</option>
                            ))}
                        </select>
                    </div>

                    {/* Lens */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400">{language === 'en' ? 'Lens / Focal Length' : 'Объектив'}</span>
                        <select
                            value={subjectSettings.lens || 'Default'}
                            onChange={(e) => handleSubjectChange('lens', e.target.value)}
                            className="bg-gray-800 border border-gray-600 text-white rounded-md p-1 text-xs focus:ring-1 focus:ring-indigo-500"
                        >
                            {Lenses.map(lens => (
                                <option key={lens.value} value={lens.value}>{lens.label[language]}</option>
                            ))}
                        </select>
                    </div>

                    {/* Aperture */}
                    <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400">{language === 'en' ? 'Aperture' : 'Диафрагма'}</span>
                        <select
                            value={subjectSettings.aperture || 'Default'}
                            onChange={(e) => handleSubjectChange('aperture', e.target.value)}
                            className="bg-gray-800 border border-gray-600 text-white rounded-md p-1 text-xs focus:ring-1 focus:ring-indigo-500"
                        >
                            {Apertures.map(ap => (
                                <option key={ap.value} value={ap.value}>{ap.label[language]}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

             {/* Reference Images */}
            <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <label className="text-sm font-medium text-gray-300">
                            {language === 'en' ? 'Reference Images (Max 3)' : 'Референсы (Макс 3)'}
                        </label>
                        <Tooltip content={translations.references} language={language} />
                    </div>
                    {referenceImages.length > 0 && (
                            <button onClick={() => setReferenceImages([])} className="text-xs text-red-400 hover:text-red-300">{language === 'en' ? 'Clear All' : 'Очистить'}</button>
                    )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {[0, 1, 2].map((index) => (
                        <div 
                            key={index}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={(e) => handleDropReference(e, index)}
                            className="relative aspect-square border-2 border-dashed border-gray-600 rounded-lg hover:border-indigo-500 transition-colors duration-200 bg-gray-900/50 flex items-center justify-center overflow-hidden group"
                        >
                            {referenceImages[index] ? (
                                <>
                                    <img src={referenceImages[index]} alt={`Ref ${index + 1}`} className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => removeReference(index)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                    </button>
                                </>
                            ) : (
                                <div className="text-gray-500 flex flex-col items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                                    <span className="text-[10px] text-center">{language === 'en' ? 'Drag or Click' : 'Перетяни'}</span>
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleRefUpload(e, index)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                        </div>
                    ))}
                </div>
                {referenceImages.length > 0 && isImagenModel && isGenerateMode && (
                    <p className="text-xs text-yellow-500">{language === 'en' ? 'Note: Switch to Gemini Flash for best results with reference images.' : 'Примечание: Переключитесь на Gemini Flash для работы с референсами.'}</p>
                )}
            </div>

            {/* Edit Mode: Image Upload & Presets */}
            {!isGenerateMode && (
                <>
                    <div className="flex flex-col space-y-2">
                        <div className="flex items-center">
                            <label htmlFor="image-upload" className="text-sm font-medium text-gray-300">
                                {language === 'en' ? 'Upload Image' : 'Загрузить изображение'}
                            </label>
                            <Tooltip content={translations.upload} language={language} />
                        </div>
                        <div 
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDropSource}
                            className="relative border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors duration-200"
                        >
                            <input
                                type="file"
                                id="image-upload"
                                accept="image/*"
                                onChange={onImageUpload}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {sourceImage ? (
                                <div className="relative group">
                                    <img src={sourceImage} alt="Uploaded preview" className="mx-auto max-h-32 rounded-md" />
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white font-semibold">{language === 'en' ? 'Change Image' : 'Изменить'}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    <p className="mt-2 text-sm">{language === 'en' ? 'Click or Drag & Drop' : 'Нажмите или перетащите'}</p>
                                </div>
                            )}
                        </div>
                    </div>

                     {/* Undo/Redo Controls */}
                     <div className="flex gap-2">
                         <button 
                            onClick={onUndo} 
                            disabled={!canUndo}
                            className="flex-1 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors duration-200"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                            </svg>
                            {language === 'en' ? 'Undo' : 'Назад'}
                         </button>
                         <button 
                            onClick={onRedo} 
                            disabled={!canRedo}
                            className="flex-1 bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors duration-200"
                         >
                            {language === 'en' ? 'Redo' : 'Вперед'}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
                            </svg>
                         </button>
                    </div>
                </>
            )}

            {/* Prompt Input */}
            <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                    <label htmlFor="prompt" className="text-sm font-medium text-gray-300">
                        {isGenerateMode ? (language === 'en' ? 'Scene Prompt' : 'Описание сцены') : (language === 'en' ? 'Edit Instruction' : 'Инструкция по редактированию')}
                    </label>
                    <Tooltip content={translations.prompt} language={language} />
                </div>
                <textarea
                    id="prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder={isGenerateMode ? "e.g., A majestic lion in a futuristic city" : (language === 'en' ? "Optional if applying Style/Effect..." : "Необязательно, если выбран Стиль/Эффект...")}
                    className="flex-grow bg-gray-900 border border-gray-700 text-white rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 resize-none h-24"
                />
            </div>

            {/* Text Overlay Settings - Only available in Edit Mode now */}
            {!isGenerateMode && (
                <div className="flex flex-col space-y-2 p-4 bg-gray-900/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center">
                        <label className="text-sm font-bold text-pink-300 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                            {language === 'en' ? 'Add Text Overlay' : 'Текст поверх фото'}
                        </label>
                        <Tooltip content={translations.overlay} language={language} />
                    </div>
                    <input 
                        type="text"
                        placeholder={language === 'en' ? "Enter text here..." : "Введите текст..."}
                        value={overlaySettings.text}
                        onChange={(e) => handleOverlayChange('text', e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white rounded-md p-2 text-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    />
                    {overlaySettings.text && (
                        <div className="flex flex-col gap-3 mt-2">
                            {/* Font Family */}
                            <div className="flex flex-col gap-1">
                                <span className="text-xs text-gray-400">{language === 'en' ? 'Font' : 'Шрифт'}</span>
                                <select 
                                    value={overlaySettings.fontFamily}
                                    onChange={(e) => handleOverlayChange('fontFamily', e.target.value)}
                                    className="bg-gray-800 border border-gray-600 text-white rounded-md p-1.5 text-xs"
                                >
                                    {OverlayFonts.map(font => (
                                        <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="flex gap-2">
                                {/* Font Size */}
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-400">{language === 'en' ? 'Size' : 'Размер'}</span>
                                        <span className="text-xs text-gray-500">{overlaySettings.fontSize}</span>
                                    </div>
                                    <input 
                                        type="range"
                                        min="10"
                                        max="300"
                                        value={overlaySettings.fontSize}
                                        onChange={(e) => handleOverlayChange('fontSize', parseInt(e.target.value))}
                                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                    />
                                </div>
                                
                                {/* Rotation */}
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="flex justify-between">
                                        <span className="text-xs text-gray-400">{language === 'en' ? 'Rotation' : 'Поворот'}</span>
                                        <span className="text-xs text-gray-500">{overlaySettings.rotation}°</span>
                                    </div>
                                    <input 
                                        type="range"
                                        min="-180"
                                        max="180"
                                        value={overlaySettings.rotation}
                                        onChange={(e) => handleOverlayChange('rotation', parseInt(e.target.value))}
                                        className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
                                    />
                                </div>
                            </div>
                            
                            {/* Color */}
                            <div className="flex items-center gap-2 bg-gray-800 border border-gray-600 rounded-md p-2">
                                <span className="text-xs text-gray-300">{language === 'en' ? 'Color:' : 'Цвет:'}</span>
                                <input 
                                    type="color" 
                                    value={overlaySettings.color}
                                    onChange={(e) => handleOverlayChange('color', e.target.value)}
                                    className="flex-grow h-6 bg-transparent cursor-pointer"
                                />
                            </div>
                            
                            <p className="text-[10px] text-gray-500 text-center">
                                {language === 'en' ? 'Drag text on image to position.' : 'Перетащите текст по изображению.'}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Model Selection */}
            <div className={`flex flex-col space-y-2 transition-opacity duration-300 ${isGenerateMode ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex items-center">
                    <label htmlFor="model" className="text-sm font-medium text-gray-300">
                        {language === 'en' ? 'Generation Model' : 'Модель'} { !isGenerateMode && '(Edit uses Gemini Flash)' }
                    </label>
                    <Tooltip content={translations.model} language={language} />
                </div>
                <select
                    id="model"
                    value={model}
                    onChange={(e) => setModel(e.target.value as ImageModel)}
                    disabled={!isGenerateMode}
                    className="bg-gray-900 border border-gray-700 text-white rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 disabled:cursor-not-allowed"
                >
                    <option value={ImageModel.IMAGEN}>Imagen 4 (High Quality)</option>
                    <option value={ImageModel.GEMINI_FLASH}>Gemini Flash (Fast & Multimodal)</option>
                </select>
            </div>

            {/* Photo Type Selection - Available in BOTH modes now */}
            <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                    <label htmlFor="photoType" className="text-sm font-medium text-gray-300">
                        {language === 'en' ? 'Photo Style' : 'Стиль фото'}
                    </label>
                    <Tooltip content={translations.style} language={language} />
                </div>
                <select
                    id="photoType"
                    value={photoType}
                    onChange={(e) => setPhotoType(e.target.value)}
                    className="bg-gray-900 border border-gray-700 text-white rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                >
                    {PhotoTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {/* Visual Effects Selection (Edit Mode Only, or both if desired, kept for Edit as requested) */}
            {!isGenerateMode && (
                 <div className="flex flex-col space-y-2">
                    <div className="flex items-center">
                        <label htmlFor="visualEffect" className="text-sm font-medium text-indigo-300">
                            {language === 'en' ? 'Visual Effect' : 'Эффект'}
                        </label>
                        <Tooltip content={translations.effects} language={language} />
                    </div>
                    <select
                        id="visualEffect"
                        value={visualEffect}
                        onChange={(e) => setVisualEffect(e.target.value)}
                        className="bg-gray-900 border border-gray-700 text-white rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                    >
                        {VisualEffects.map((effect) => (
                            <option key={effect} value={effect}>{effect}</option>
                        ))}
                    </select>
                </div>
            )}
            
            {/* Image Quality Selection */}
            <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                    <label htmlFor="quality" className="text-sm font-medium text-gray-300">
                        {language === 'en' ? 'Image Quality' : 'Качество'}
                    </label>
                    <Tooltip content={translations.quality} language={language} />
                </div>
                <select
                    id="quality"
                    value={quality}
                    onChange={(e) => setQuality(e.target.value as ImageQuality)}
                    className="bg-gray-900 border border-gray-700 text-white rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200"
                >
                    {Object.values(ImageQuality).map((value) => (
                        <option key={value} value={value}>{value}</option>
                    ))}
                </select>
            </div>

            {/* Aspect Ratio Selection */}
            <div className={`flex flex-col space-y-2 transition-opacity duration-300 ${isGenerateMode ? 'opacity-100' : 'opacity-50'}`}>
                <div className="flex items-center">
                    <label htmlFor="aspectRatio" className="text-sm font-medium text-gray-300">
                        {language === 'en' ? 'Aspect Ratio' : 'Пропорции'} { !isGenerateMode && '(Not available for edits)' }
                    </label>
                    <Tooltip content={translations.aspect} language={language} />
                </div>
                <select
                    id="aspectRatio"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                    disabled={!isGenerateMode}
                    className="bg-gray-900 border border-gray-700 text-white rounded-md p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 disabled:cursor-not-allowed"
                >
                    {Object.entries(AspectRatio).map(([key, value]) => (
                        <option key={key} value={value}>{value}</option>
                    ))}
                </select>
            </div>
            
            {/* Generate Button - Spacer removed to attach to last item */}
            <div className="pt-4">
                <button
                    onClick={onGenerate}
                    disabled={isButtonDisabled}
                    className="w-full bg-indigo-600 text-white font-bold py-3 px-4 rounded-md hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {isGenerateMode ? (language === 'en' ? 'Generating...' : 'Генерация...') : (language === 'en' ? 'Editing...' : 'Редактирование...')}
                        </>
                    ) : (
                        buttonText
                    )}
                </button>
            </div>
            <div className="h-4"></div> {/* Small bottom padding for scroll */}
        </div>
    );
};

export default ControlPanel;
