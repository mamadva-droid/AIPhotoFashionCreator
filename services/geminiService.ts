
// @google/genai Service for image generation and editing
import { GoogleGenAI } from "@google/genai";
import { ImageModel, AspectRatio, ImageQuality, SubjectSettings, SubjectPosition, FocusArea } from '../types';

// Use API_KEY directly from process.env as per guidelines. Assume it is pre-configured.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const applyQualityToPrompt = (prompt: string, quality: ImageQuality): string => {
    switch (quality) {
        case ImageQuality.HIGH:
            return `${prompt}, high-resolution, photorealistic, intricate details, sharp focus`;
        case ImageQuality.TWO_K:
            return `${prompt}, 2k resolution, highly detailed, sharp focus, professional photography, crystal clear, 1440p`;
        case ImageQuality.FOUR_K:
            return `${prompt}, 4k resolution, ultra detailed, hyper-realistic, masterpiece, 8k textures, insane details, 2160p`;
        case ImageQuality.LOW:
            return `${prompt}, low quality, jpeg artifacts, blurry`;
        case ImageQuality.MEDIUM:
        default:
            return prompt;
    }
};

const getSubjectPromptPart = (settings: SubjectSettings): string => {
    let part = "";
    
    if (settings.description?.trim()) {
        part += `Subject details: ${settings.description.trim()}. `;
    }
    if (settings.position !== SubjectPosition.CENTER) {
        part += `Subject placement: ${settings.position.toLowerCase()} part of the frame. `;
    }
    if (settings.pose && settings.pose !== 'None (Default)') {
        part += `Pose: ${settings.pose}. `;
    }
    if (settings.emotion && settings.emotion !== 'None (Default)') {
        part += `Emotion/Expression: ${settings.emotion}. `;
    }
    if (settings.lighting && settings.lighting !== 'Default') {
        part += `Lighting: ${settings.lighting}. `;
    }
    if (settings.background && settings.background !== 'None (Default)') {
        part += `Background: ${settings.background}. `;
    }
    if (settings.cameraAngle && settings.cameraAngle !== 'Default') {
        part += `Camera Angle: ${settings.cameraAngle}. `;
    }

    let gear = [];
    if (settings.camera && settings.camera !== 'Default') gear.push(`Shot on ${settings.camera}`);
    if (settings.lens && settings.lens !== 'Default') gear.push(`Lens: ${settings.lens}`);
    if (settings.aperture && settings.aperture !== 'Default') gear.push(`Aperture: ${settings.aperture}`);
    if (gear.length > 0) part += `Photography Gear: ${gear.join(', ')}. `;

    const areas = settings.focusAreas || [];
    if (areas.length > 0) {
        part += `Focus edits on: ${areas.join(", ")} areas. `;
    }

    return part;
};

const generateFullPrompt = (prompt: string, photoType: string, quality: ImageQuality, effect: string, subjectSettings?: SubjectSettings): string => {
    const qualityAdjustedPrompt = applyQualityToPrompt(prompt, quality);
    let subjectPart = subjectSettings ? getSubjectPromptPart(subjectSettings) : '';
    let effectPart = effect !== 'None' ? `Apply visual effect: ${effect}. ` : '';

    return `${photoType} style: ${subjectPart}${effectPart}${qualityAdjustedPrompt}`;
};

export const generateImage = async (
    prompt: string,
    photoType: string,
    model: ImageModel,
    aspectRatio: AspectRatio,
    quality: ImageQuality,
    visualEffect: string,
    subjectSettings?: SubjectSettings,
    referenceImages: string[] = []
): Promise<string> => {
    
    const fullPrompt = generateFullPrompt(prompt, photoType, quality, visualEffect, subjectSettings);

    try {
        if (model === ImageModel.IMAGEN) {
            const response = await ai.models.generateImages({
                model: model,
                prompt: fullPrompt,
                config: {
                    numberOfImages: 1,
                    aspectRatio: aspectRatio,
                    outputMimeType: 'image/jpeg',
                }
            });
            const base64Image = response.generatedImages?.[0]?.image?.imageBytes;
            if (!base64Image) throw new Error("No image generated");
            return `data:image/jpeg;base64,${base64Image}`;
        } else {
            const parts: any[] = [{ text: fullPrompt }];
            if (referenceImages && referenceImages.length > 0) {
                 referenceImages.forEach(ref => {
                     const match = ref.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
                     if (match) parts.push({ inlineData: { mimeType: match[1], data: match[2] } });
                 });
            }
            const response = await ai.models.generateContent({
                model: model,
                contents: { parts },
                config: { imageConfig: { aspectRatio } }
            });
            let base64Image: string | undefined;
            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) { base64Image = part.inlineData.data; break; }
            }
            if (!base64Image) throw new Error("No image generated");
            return `data:image/png;base64,${base64Image}`;
        }
    } catch (error) { throw error; }
};

export const editImage = async (
    instruction: string,
    sourceImage: string,
    quality: ImageQuality,
    visualEffect: string,
    subjectSettings?: SubjectSettings,
    referenceImages: string[] = []
): Promise<string> => {
    const match = sourceImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!match) throw new Error("Invalid format");
    const mimeType = match[1];
    const data = match[2];
    
    let subjectPart = subjectSettings ? getSubjectPromptPart(subjectSettings) : '';
    let effectPart = visualEffect !== 'None' ? `Apply ${visualEffect} effect. ` : '';
    const finalPrompt = applyQualityToPrompt(`${instruction}. ${subjectPart}${effectPart}`, quality);

    const parts: any[] = [
        { inlineData: { mimeType, data } },
        { text: finalPrompt }
    ];

    if (referenceImages && referenceImages.length > 0) {
        referenceImages.forEach(ref => {
            const refMatch = ref.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
            if (refMatch) parts.push({ inlineData: { mimeType: refMatch[1], data: refMatch[2] } });
        });
    }

    try {
        const response = await ai.models.generateContent({
            model: ImageModel.GEMINI_FLASH,
            contents: { parts }
        });
        let base64Image: string | undefined;
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) { base64Image = part.inlineData.data; break; }
        }
        if (!base64Image) throw new Error("No image generated");
        return `data:image/png;base64,${base64Image}`;
    } catch (error) { throw error; }
};

export const upscaleImage = async (sourceImage: string): Promise<string> => {
    const prompt = "Upscale this image to high fidelity 4k resolution, enhancing clarity and texture while preserving original elements.";
    const match = sourceImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!match) throw new Error("Invalid source");
    const parts = [{ inlineData: { mimeType: match[1], data: match[2] } }, { text: prompt }];
    try {
        const response = await ai.models.generateContent({
            model: ImageModel.GEMINI_FLASH,
            contents: { parts }
        });
        let base64Image: string | undefined;
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) { base64Image = part.inlineData.data; break; }
        }
        return `data:image/png;base64,${base64Image}`;
    } catch (error) { throw error; }
};
