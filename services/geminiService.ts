
import { GoogleGenAI, Modality } from "@google/genai";
import { ImageModel, AspectRatio, ImageQuality, SubjectSettings, SubjectPosition, FocusArea } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

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
    
    // Description
    if (settings.description && settings.description.trim()) {
        part += `Subject details: ${settings.description.trim()}. `;
    }

    // Position
    if (settings.position !== SubjectPosition.CENTER) {
        part += `Subject placement: ${settings.position.toLowerCase()} part of the frame. `;
    }

    // Pose
    if (settings.pose && settings.pose !== 'None (Default)') {
        part += `Pose: ${settings.pose}. `;
    }

    // Emotion
    if (settings.emotion && settings.emotion !== 'None (Default)') {
        part += `Emotion/Expression: ${settings.emotion}. `;
    }

    // Lighting
    if (settings.lighting && settings.lighting !== 'Default') {
        part += `Lighting: ${settings.lighting}. `;
    }

    // Camera Angle / Shot Type
    if (settings.cameraAngle && settings.cameraAngle !== 'Default') {
        part += `Camera Angle/Shot Type: ${settings.cameraAngle}. `;
    }

    // Camera Gear (Camera, Lens, Aperture)
    let gearParts = [];
    if (settings.camera && settings.camera !== 'Default') {
        gearParts.push(`Shot on ${settings.camera}`);
    }
    if (settings.lens && settings.lens !== 'Default') {
        gearParts.push(`Lens: ${settings.lens}`);
    }
    if (settings.aperture && settings.aperture !== 'Default') {
        gearParts.push(`Aperture: ${settings.aperture}`);
    }

    if (gearParts.length > 0) {
        part += `Photography Gear: ${gearParts.join(', ')}. `;
    }
    
    // Focus Area for Editing - Handle Legacy Multiple selection
    const areas = settings.focusAreas && settings.focusAreas.length > 0 
        ? settings.focusAreas 
        : (settings.focusArea && settings.focusArea !== FocusArea.NONE ? [settings.focusArea] : []);

    if (areas.length > 0) {
        const areaMap: Record<string, string> = {
            [FocusArea.TOP_LEFT]: "top-left quadrant",
            [FocusArea.TOP_CENTER]: "top-center area",
            [FocusArea.TOP_RIGHT]: "top-right quadrant",
            [FocusArea.MIDDLE_LEFT]: "middle-left area",
            [FocusArea.CENTER]: "center area",
            [FocusArea.MIDDLE_RIGHT]: "middle-right area",
            [FocusArea.BOTTOM_LEFT]: "bottom-left quadrant",
            [FocusArea.BOTTOM_CENTER]: "bottom-center area",
            [FocusArea.BOTTOM_RIGHT]: "bottom-right quadrant",
        };
        
        const descriptions = areas.map(a => areaMap[a] || a);
        // Remove duplicates and join
        const uniqueDescriptions = Array.from(new Set(descriptions));
        const areaDesc = uniqueDescriptions.join(", ");

        part += `IMPORTANT: Focus all changes and edits specifically on these areas: ${areaDesc} of the image. Leave other areas mostly unchanged unless necessary for consistency. `;
    }

    return part;
};

const generateFullPrompt = (prompt: string, photoType: string, quality: ImageQuality, subjectSettings?: SubjectSettings): string => {
    const qualityAdjustedPrompt = applyQualityToPrompt(prompt, quality);
    
    // Character/Subject details part
    let subjectPart = '';
    if (subjectSettings) {
        subjectPart = getSubjectPromptPart(subjectSettings);
    }

    if (photoType === 'Jigsaw Cutting Stencil') {
        return `A black and white, single-piece stencil for jigsaw cutting from a sheet of plywood. The design of "${subjectPart}${qualityAdjustedPrompt}" must have all elements interconnected with bridges, ensuring no parts become loose or fall out after cutting. The final image should be a clean, clear silhouette pattern.`;
    }

    return `${photoType} style: ${subjectPart}${qualityAdjustedPrompt}`;
};

export const generateImage = async (
    prompt: string,
    photoType: string,
    model: ImageModel,
    aspectRatio: AspectRatio,
    quality: ImageQuality,
    subjectSettings?: SubjectSettings,
    referenceImages: string[] = []
): Promise<string> => {
    
    const fullPrompt = generateFullPrompt(prompt, photoType, quality, subjectSettings);

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
            // Gemini Flash Image (Multimodal)
            const parts: any[] = [
                { text: fullPrompt }
            ];

            // Add referenceImages if present
            if (referenceImages && referenceImages.length > 0) {
                 referenceImages.forEach(ref => {
                     const match = ref.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
                     if (match) {
                         parts.push({
                             inlineData: {
                                 mimeType: match[1],
                                 data: match[2]
                             }
                         });
                     }
                 });
                 parts[0].text += " Use the attached images as style or composition references.";
            }

            const response = await ai.models.generateContent({
                model: model,
                contents: { parts },
                config: {
                    responseModalities: [Modality.IMAGE],
                    // Gemini 2.5 Flash Image supports aspectRatio in config
                    imageConfig: {
                        aspectRatio: aspectRatio
                    }
                }
            });

            const base64Image = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (!base64Image) throw new Error("No image generated");
            return `data:image/png;base64,${base64Image}`;
        }
    } catch (error) {
        console.error("Generation Error:", error);
        throw error;
    }
};

export const editImage = async (
    instruction: string,
    sourceImage: string,
    quality: ImageQuality,
    subjectSettings?: SubjectSettings,
    referenceImages: string[] = []
): Promise<string> => {
    // Extract base64 data
    const match = sourceImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!match) throw new Error("Invalid source image format");

    const mimeType = match[1];
    const data = match[2];
    
    // Incorporate subject settings into instruction
    let fullPromptText = instruction;
    if (subjectSettings) {
        fullPromptText += ". " + getSubjectPromptPart(subjectSettings);
    }
    
    const finalPrompt = applyQualityToPrompt(fullPromptText, quality);

    // Prepare content parts with source image and prompt
    const parts: any[] = [
        {
            inlineData: {
                mimeType,
                data
            }
        },
        { text: finalPrompt }
    ];

    // Add reference images if present
    if (referenceImages && referenceImages.length > 0) {
        referenceImages.forEach(ref => {
            const refMatch = ref.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
            if (refMatch) {
                parts.push({
                    inlineData: {
                        mimeType: refMatch[1],
                        data: refMatch[2]
                    }
                });
            }
        });
        parts[1].text += " Use the provided additional images as style or visual references.";
    }

    try {
        const response = await ai.models.generateContent({
            model: ImageModel.GEMINI_FLASH,
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE],
            }
        });

        const base64Image = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Image) throw new Error("No image generated");
        return `data:image/png;base64,${base64Image}`;

    } catch (error) {
        console.error("Edit Error:", error);
        throw error;
    }
};

export const upscaleImage = async (
    sourceImage: string
): Promise<string> => {
    const prompt = "Upscale this image. Generate a high-fidelity, high-resolution version of this image, enhancing clarity, texture details, and sharpness while preserving the original composition and elements perfectly. Remove noise and artifacts.";
    
    const match = sourceImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (!match) throw new Error("Invalid source image format");

    const mimeType = match[1];
    const data = match[2];

    const parts = [
        {
            inlineData: {
                mimeType,
                data
            }
        },
        { text: prompt }
    ];

    try {
        const response = await ai.models.generateContent({
            model: ImageModel.GEMINI_FLASH,
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE],
            }
        });

        const base64Image = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Image) throw new Error("No image generated");
        return `data:image/png;base64,${base64Image}`;
    } catch (error) {
        console.error("Upscale Error:", error);
        throw error;
    }
};
