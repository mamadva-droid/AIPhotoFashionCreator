
import React from 'react';
import { Language } from '../types';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    language: Language;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, language }) => {
    if (!isOpen) return null;

    const content = {
        en: {
            title: "How to Use AI Photo Content Creator",
            sections: [
                {
                    title: "1. Getting Started",
                    text: "Choose between 'Generate' mode to create new images from scratch, or 'Edit' mode to modify existing images. Use the tabs at the top of the settings panel."
                },
                {
                    title: "2. Generation Settings",
                    text: "Describe what you want to see in the 'Scene Prompt'. Select a model (Imagen for high quality, Gemini Flash for speed and reference inputs), a style, and the image resolution (up to 4K)."
                },
                {
                    title: "3. Using Reference Images",
                    text: "In Generate mode, you can drag and drop up to 3 images into the reference slots. The AI will use these as inspiration for style or composition. (Best used with Gemini Flash)."
                },
                {
                    title: "4. Editing Images",
                    text: "Upload an image or drag one from your history. Type an instruction (e.g., 'Make it night time', 'Add a hat') and click 'Apply Edit'."
                },
                {
                    title: "5. History & Folders",
                    text: "Your generated images are saved in the History panel. You can drag and drop them to reorder, right-click to save or delete, and organize them into custom folders."
                }
            ],
            close: "Close"
        },
        ru: {
            title: "Как использовать AI Photo Content Creator",
            sections: [
                {
                    title: "1. Начало работы",
                    text: "Выберите режим «Generate» (Генерация) для создания новых изображений или «Edit» (Редактирование) для изменения существующих. Используйте переключатели в верхней части панели настроек."
                },
                {
                    title: "2. Настройки генерации",
                    text: "Опишите, что вы хотите увидеть, в поле «Scene Prompt». Выберите модель (Imagen для высокого качества, Gemini Flash для скорости и работы с референсами), стиль и разрешение (до 4K)."
                },
                {
                    title: "3. Использование референсов",
                    text: "В режиме генерации вы можете перетащить до 3 изображений в слоты для образцов. ИИ будет использовать их как вдохновение для стиля или композиции (лучше всего работает с Gemini Flash)."
                },
                {
                    title: "4. Редактирование",
                    text: "Загрузите изображение или перетащите его из истории. Введите инструкцию (например, «Сделай ночь», «Добавь шляпу») и нажмите «Apply Edit»."
                },
                {
                    title: "5. История и папки",
                    text: "Ваши изображения сохраняются в панели Истории. Вы можете перетаскивать их, кликать правой кнопкой мыши для сохранения или удаления, а также организовывать их в папки."
                }
            ],
            close: "Закрыть"
        }
    };

    const t = content[language];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div className="bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-gray-700">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h2 className="text-2xl font-bold text-white">{t.title}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 overflow-y-auto custom-scrollbar space-y-6 text-gray-300">
                    {t.sections.map((section, idx) => (
                        <div key={idx}>
                            <h3 className="text-lg font-semibold text-indigo-400 mb-2">{section.title}</h3>
                            <p className="leading-relaxed">{section.text}</p>
                        </div>
                    ))}
                </div>
                <div className="p-4 border-t border-gray-700 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition-colors"
                    >
                        {t.close}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HelpModal;
