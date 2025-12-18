
export enum ImageModel {
    IMAGEN = 'imagen-4.0-generate-001',
    GEMINI_FLASH = 'gemini-2.5-flash-image',
}

export enum AspectRatio {
    SQUARE = '1:1',
    PORTRAIT_3_4 = '3:4',
    LANDSCAPE_4_3 = '4:3',
    PORTRAIT_9_16 = '9:16',
    LANDSCAPE_16_9 = '16:9',
}

export enum ImageQuality {
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High',
    TWO_K = '2K (Ultra High)',
    FOUR_K = '4K (Masterpiece)',
}

export enum Mode {
    GENERATE = 'Generate',
    EDIT = 'Edit',
}

export type Language = 'en' | 'ru';

export enum SubjectPosition {
    CENTER = 'Center',
    LEFT = 'Left',
    RIGHT = 'Right',
    TOP = 'Top',
    BOTTOM = 'Bottom',
}

export enum FocusArea {
    NONE = 'None',
    TOP_LEFT = 'Top-Left',
    TOP_CENTER = 'Top-Center',
    TOP_RIGHT = 'Top-Right',
    MIDDLE_LEFT = 'Middle-Left',
    CENTER = 'Center',
    MIDDLE_RIGHT = 'Middle-Right',
    BOTTOM_LEFT = 'Bottom-Left',
    BOTTOM_CENTER = 'Bottom-Center',
    BOTTOM_RIGHT = 'Bottom-Right',
}

export interface TranslatedItem {
    value: string;
    label: {
        en: string;
        ru: string;
    };
}

export interface PoseCategory {
    name: { en: string; ru: string };
    poses: TranslatedItem[]; // Used for Poses, Emotions, and Lighting
}

// --- New Camera & Gear Data ---

export const CameraModels: TranslatedItem[] = [
    { value: 'Default', label: { en: 'Default', ru: 'По умолчанию' } },
    { value: 'Sony A7R V', label: { en: 'Sony A7R V (High Res)', ru: 'Sony A7R V (Высокое разрешение)' } },
    { value: 'Canon EOS R5', label: { en: 'Canon EOS R5 (Warm Tones)', ru: 'Canon EOS R5 (Теплые тона)' } },
    { value: 'Hasselblad X2D 100C', label: { en: 'Hasselblad X2D (Medium Format)', ru: 'Hasselblad X2D (Средний формат)' } },
    { value: 'Fujifilm GFX 100S', label: { en: 'Fujifilm GFX 100S', ru: 'Fujifilm GFX 100S' } },
    { value: 'Leica SL2', label: { en: 'Leica SL2', ru: 'Leica SL2' } },
    { value: 'Phase One XF IQ4', label: { en: 'Phase One IQ4 (Studio Master)', ru: 'Phase One IQ4 (Студийный мастер)' } },
    { value: 'Analog 35mm Film Camera', label: { en: 'Analog 35mm Film', ru: 'Пленочная камера 35мм' } },
    { value: 'Polaroid Camera', label: { en: 'Polaroid / Instant', ru: 'Полароид / Моментальное фото' } },
];

export const Lenses: TranslatedItem[] = [
    { value: 'Default', label: { en: 'Default', ru: 'По умолчанию' } },
    { value: '85mm f/1.2', label: { en: '85mm f/1.2 (Classic Portrait)', ru: '85mm f/1.2 (Классический портрет)' } },
    { value: '50mm f/1.2', label: { en: '50mm f/1.2 (Standard Prime)', ru: '50mm f/1.2 (Полтинник)' } },
    { value: '35mm f/1.4', label: { en: '35mm f/1.4 (Environmental)', ru: '35mm f/1.4 (Ростовой портрет)' } },
    { value: '105mm Macro', label: { en: '105mm Macro (Beauty/Detail)', ru: '105mm Macro (Бьюти/Детали)' } },
    { value: '135mm f/1.8', label: { en: '135mm f/1.8 (Telephoto Compression)', ru: '135mm f/1.8 (Телефото)' } },
    { value: '24-70mm f/2.8', label: { en: '24-70mm f/2.8 (Studio Zoom)', ru: '24-70mm f/2.8 (Студийный зум)' } },
    { value: '70-200mm f/2.8', label: { en: '70-200mm f/2.8 (Fashion Zoom)', ru: '70-200mm f/2.8 (Фэшн зум)' } },
];

export const Apertures: TranslatedItem[] = [
    { value: 'Default', label: { en: 'Default', ru: 'По умолчанию' } },
    { value: 'f/1.2', label: { en: 'f/1.2 (Dreamy Bokeh)', ru: 'f/1.2 (Сильное боке)' } },
    { value: 'f/1.8', label: { en: 'f/1.8 (Soft Background)', ru: 'f/1.8 (Мягкий фон)' } },
    { value: 'f/2.8', label: { en: 'f/2.8 (Subject Isolation)', ru: 'f/2.8 (Изоляция объекта)' } },
    { value: 'f/5.6', label: { en: 'f/5.6 (Balanced)', ru: 'f/5.6 (Сбалансировано)' } },
    { value: 'f/8', label: { en: 'f/8 (Studio Sharpness)', ru: 'f/8 (Студийная резкость)' } },
    { value: 'f/11', label: { en: 'f/11 (Deep Depth of Field)', ru: 'f/11 (Глубина резкости)' } },
];

export const CameraAngles: TranslatedItem[] = [
    { value: 'Default', label: { en: 'Default', ru: 'По умолчанию' } },
    { value: 'Eye Level', label: { en: 'Eye Level', ru: 'На уровне глаз' } },
    { value: 'Low Angle', label: { en: 'Low Angle', ru: 'Нижний ракурс' } },
    { value: 'High Angle', label: { en: 'High Angle', ru: 'Верхний ракурс' } },
    { value: 'Bird\'s Eye View', label: { en: 'Bird\'s Eye View', ru: 'С высоты птичьего полета' } },
    { value: 'Worm\'s Eye View', label: { en: 'Worm\'s Eye View', ru: 'С уровня земли' } },
    { value: 'Dutch Angle', label: { en: 'Dutch Angle', ru: 'Голландский угол' } },
    { value: 'Close-Up', label: { en: 'Close-Up', ru: 'Крупный план' } },
    { value: 'Wide Shot', label: { en: 'Wide Shot', ru: 'Широкий план' } },
    { value: 'Over-the-Shoulder', label: { en: 'Over-the-Shoulder', ru: 'Из-за плеча' } },
    { value: 'Selfie', label: { en: 'Selfie Style', ru: 'Селфи' } },
    { value: 'Macro', label: { en: 'Macro', ru: 'Макро' } },
];

// --- LIGHTING SCHEMES ---
export const LightingSetups: PoseCategory[] = [
    {
        name: { en: 'Studio & Professional', ru: 'Студия и Профи' },
        poses: [
            { value: 'Default', label: { en: 'Default', ru: 'По умолчанию' } },
            { value: 'Softbox Lighting', label: { en: 'Softbox (Soft & Even)', ru: 'Софтбокс (Мягкий свет)' } },
            { value: 'Rembrandt Lighting', label: { en: 'Rembrandt (Dramatic Triangle)', ru: 'Рембрандтовский свет' } },
            { value: 'Butterfly Lighting', label: { en: 'Butterfly (Glamour)', ru: 'Свет "Бабочка" (Гламур)' } },
            { value: 'High Key', label: { en: 'High Key (Bright & White)', ru: 'High Key (Светлый ключ)' } },
            { value: 'Low Key', label: { en: 'Low Key (Dark & Moody)', ru: 'Low Key (Темный ключ)' } },
            { value: 'Rim Light', label: { en: 'Rim / Backlight (Halo Effect)', ru: 'Контровый свет (Ореол)' } },
            { value: 'Split Lighting', label: { en: 'Split (Half Shadow)', ru: 'Боковой жесткий свет' } },
            { value: 'Ring Light', label: { en: 'Ring Light (Vlogger/Eyes)', ru: 'Кольцевой свет' } },
        ]
    },
    {
        name: { en: 'Natural & Outdoor', ru: 'Естественный и Улица' },
        poses: [
            { value: 'Golden Hour', label: { en: 'Golden Hour (Warm/Sunset)', ru: 'Золотой час (Закат)' } },
            { value: 'Blue Hour', label: { en: 'Blue Hour (Twilight)', ru: 'Синий час (Сумерки)' } },
            { value: 'Overcast Soft', label: { en: 'Overcast (Diffused)', ru: 'Облачная погода (Рассеянный)' } },
            { value: 'Direct Sunlight', label: { en: 'Direct Hard Sun', ru: 'Прямое солнце (Жесткий)' } },
            { value: 'Dappled Light', label: { en: 'Dappled (Through trees)', ru: 'Пятнистый свет (Сквозь листву)' } },
            { value: 'Moonlight', label: { en: 'Moonlight', ru: 'Лунный свет' } },
        ]
    },
    {
        name: { en: 'Indoor & Domestic', ru: 'Интерьер и Быт' },
        poses: [
            { value: 'Window Light', label: { en: 'Window Light (Natural side)', ru: 'Свет от окна' } },
            { value: 'Candlelight', label: { en: 'Candlelight / Fireplace', ru: 'Свечи / Камин' } },
            { value: 'Lamp / Tungsten', label: { en: 'Warm Lamp / Tungsten', ru: 'Лампа накаливания (Теплый)' } },
            { value: 'Fluorescent', label: { en: 'Office Fluorescent (Cool)', ru: 'Офисный (Флуоресцентный)' } },
            { value: 'Screen Glow', label: { en: 'Screen Glow (Face lit by phone/PC)', ru: 'Свет от экрана' } },
        ]
    },
    {
        name: { en: 'Creative & Cinematic', ru: 'Креатив и Кино' },
        poses: [
            { value: 'Neon / Cyberpunk', label: { en: 'Neon Lights (Pink/Blue)', ru: 'Неон / Киберпанк' } },
            { value: 'Cinematic Teal & Orange', label: { en: 'Cinematic Teal & Orange', ru: 'Киношный Teal & Orange' } },
            { value: 'Volumetric', label: { en: 'Volumetric / God Rays', ru: 'Объемный свет (Лучи)' } },
            { value: 'Silhouette', label: { en: 'Silhouette (Dark Subject)', ru: 'Силуэт' } },
            { value: 'Double Exposure', label: { en: 'Double Exposure Light', ru: 'Двойная экспозиция' } },
        ]
    }
];

export const ModelPoses: PoseCategory[] = [
    {
        name: { en: 'Basics & Studio', ru: 'Базовые и Студия' },
        poses: [
            { value: 'None (Default)', label: { en: 'None (Default)', ru: 'Нет (По умолчанию)' } },
            { value: 'Standing Still', label: { en: 'Standing Still', ru: 'Стоит прямо' } },
            { value: 'Sitting Relaxed on Stool', label: { en: 'Sitting on Stool', ru: 'Сидит на стуле' } },
            { value: 'Looking over shoulder', label: { en: 'Looking over shoulder', ru: 'Оглядывается через плечо' } },
            { value: 'Crossed Arms', label: { en: 'Crossed Arms', ru: 'Скрестив руки' } },
            { value: 'Hand on Hip', label: { en: 'Hand on Hip', ru: 'Рука на бедре' } },
            { value: 'Hands in pockets', label: { en: 'Hands in pockets', ru: 'Руки в карманах' } },
        ]
    },
    {
        name: { en: 'Home & Bed (Lifestyle)', ru: 'Дом и Постель (Лайфстайл)' },
        poses: [
            { value: 'Waking up stretching', label: { en: 'Waking up / Stretching in bed', ru: 'Просыпается / Потягивается в кровати' } },
            { value: 'Lying on stomach reading', label: { en: 'Lying on stomach reading', ru: 'Лежит на животе, читает' } },
            { value: 'Sitting on bed with coffee', label: { en: 'Sitting on bed with coffee', ru: 'Сидит на кровати с кофе' } },
            { value: 'Curled up in blanket', label: { en: 'Curled up in blanket', ru: 'Укутавшись в одеяло' } },
            { value: 'Cooking in kitchen', label: { en: 'Cooking in kitchen', ru: 'Готовит на кухне' } },
            { value: 'Lounging on sofa', label: { en: 'Lounging on sofa', ru: 'Отдыхает на диване' } },
            { value: 'Brushing teeth', label: { en: 'Brushing teeth', ru: 'Чистит зубы' } },
        ]
    },
    {
        name: { en: 'Office & Work', ru: 'Офис и Работа' },
        poses: [
            { value: 'Typing at desk', label: { en: 'Typing at desk', ru: 'Печатает за столом' } },
            { value: 'Writing on whiteboard', label: { en: 'Writing on whiteboard', ru: 'Пишет на доске' } },
            { value: 'Talking on phone angry', label: { en: 'Talking on phone (Intense)', ru: 'Говорит по телефону (Напряженно)' } },
            { value: 'Handshake', label: { en: 'Handshake', ru: 'Рукопожатие' } },
            { value: 'Presentation gesture', label: { en: 'Presentation gesture', ru: 'Жест презентации' } },
            { value: 'Thinking with pen in mouth', label: { en: 'Thinking / Pen in mouth', ru: 'Задумался / Ручка во рту' } },
        ]
    },
    {
        name: { en: 'Street & Urban', ru: 'Улица и Город' },
        poses: [
            { value: 'Walking fast', label: { en: 'Walking fast / Commuting', ru: 'Быстро идет / Спешит' } },
            { value: 'Hailing a taxi', label: { en: 'Hailing a taxi', ru: 'Ловит такси' } },
            { value: 'Leaning against wall', label: { en: 'Leaning against brick wall', ru: 'Опирается на стену' } },
            { value: 'Checking smartphone', label: { en: 'Checking smartphone', ru: 'Смотрит в телефон' } },
            { value: 'Drinking coffee to go', label: { en: 'Drinking coffee to go', ru: 'Пьет кофе на ходу' } },
            { value: 'Sitting on bench', label: { en: 'Sitting on park bench', ru: 'Сидит на скамейке' } },
        ]
    },
    {
        name: { en: 'Social & Interaction', ru: 'Общение' },
        poses: [
            { value: 'Toasting with glass', label: { en: 'Toasting with glass', ru: 'Тост с бокалом' } },
            { value: 'Waving hello', label: { en: 'Waving hello', ru: 'Машет привет' } },
            { value: 'Whispering', label: { en: 'Whispering', ru: 'Шепчет' } },
            { value: 'Laughing holding stomach', label: { en: 'Laughing / Holding stomach', ru: 'Смеется держась за живот' } },
            { value: 'Pointing finger', label: { en: 'Pointing finger', ru: 'Указывает пальцем' } },
        ]
    },
    {
        name: { en: 'Action & Sport', ru: 'Спорт и Движение' },
        poses: [
            { value: 'Running sprint', label: { en: 'Sprinting', ru: 'Спринт / Бег' } },
            { value: 'Mid-air jump', label: { en: 'Mid-air jump', ru: 'Прыжок в воздухе' } },
            { value: 'Yoga pose', label: { en: 'Yoga / Meditating', ru: 'Йога / Медитация' } },
            { value: 'Fighting Stance', label: { en: 'Fighting Stance', ru: 'Боевая стойка' } },
            { value: 'Tieing shoelaces', label: { en: 'Tieing shoelaces', ru: 'Завязывает шнурки' } },
            { value: 'Lifting weights', label: { en: 'Lifting weights', ru: 'Поднимает веса' } },
        ]
    }
];

export const SubjectEmotions: PoseCategory[] = [
    {
        name: { en: 'Happiness & Joy', ru: 'Счастье и Радость' },
        poses: [
            { value: 'None (Default)', label: { en: 'None (Default)', ru: 'Нет (По умолчанию)' } },
            { value: 'Gentle Smile', label: { en: 'Gentle Smile', ru: 'Легкая улыбка' } },
            { value: 'Laughing Out Loud', label: { en: 'Laughing Out Loud', ru: 'Громкий смех' } },
            { value: 'Grinning', label: { en: 'Grinning', ru: 'Широкая улыбка' } },
            { value: 'Ecstatic / Overjoyed', label: { en: 'Ecstatic', ru: 'Восторг / Ликование' } },
        ]
    },
    {
        name: { en: 'Sadness & Melancholy', ru: 'Грусть и Меланхолия' },
        poses: [
            { value: 'Teary-eyed', label: { en: 'Teary-eyed', ru: 'Слезы на глазах' } },
            { value: 'Crying', label: { en: 'Crying', ru: 'Плач' } },
            { value: 'Grief-stricken', label: { en: 'Grief-stricken', ru: 'Убитый горем' } },
            { value: 'Melancholic Stare', label: { en: 'Melancholic Stare', ru: 'Меланхоличный взгляд' } },
            { value: 'Pouty / Upset', label: { en: 'Pouty', ru: 'Надутый / Расстроенный' } },
        ]
    },
    {
        name: { en: 'Anger & Intensity', ru: 'Гнев и Интенсивность' },
        poses: [
            { value: 'Frowning', label: { en: 'Frowning', ru: 'Нахмуренный' } },
            { value: 'Screaming / Yelling', label: { en: 'Screaming', ru: 'Крик' } },
            { value: 'Furious Glare', label: { en: 'Furious Glare', ru: 'Яростный взгляд' } },
            { value: 'Clenched Teeth', label: { en: 'Clenched Teeth', ru: 'Сжатые зубы' } },
            { value: 'Annoyed / Irritated', label: { en: 'Annoyed', ru: 'Раздражение' } },
        ]
    },
    {
        name: { en: 'Fear & Surprise', ru: 'Страх и Удивление' },
        poses: [
            { value: 'Wide-eyed Surprise', label: { en: 'Wide-eyed Surprise', ru: 'Широко раскрытые глаза' } },
            { value: 'Gasping in Shock', label: { en: 'Gasping', ru: 'Вздох ужаса/шока' } },
            { value: 'Terrified / Screaming', label: { en: 'Terrified', ru: 'Ужас' } },
            { value: 'Nervous / Anxious', label: { en: 'Nervous', ru: 'Нервозность' } },
        ]
    },
    {
        name: { en: 'Cool & Confident', ru: 'Крутость и Уверенность' },
        poses: [
            { value: 'Smirking', label: { en: 'Smirking', ru: 'Ухмылка' } },
            { value: 'Confident / Proud', label: { en: 'Confident', ru: 'Уверенность / Гордость' } },
            { value: 'Seductive / Sultry', label: { en: 'Seductive', ru: 'Соблазнительность' } },
            { value: 'Winking', label: { en: 'Winking', ru: 'Подмигивание' } },
            { value: 'Stoic / Poker Face', label: { en: 'Stoic', ru: 'Спокойствие / Покерфейс' } },
        ]
    },
    {
        name: { en: 'Other States', ru: 'Другие состояния' },
        poses: [
            { value: 'Tired / Yawning', label: { en: 'Tired / Yawning', ru: 'Усталость / Зевок' } },
            { value: 'Sleeping', label: { en: 'Sleeping', ru: 'Сон' } },
            { value: 'Thoughtful / Pensive', label: { en: 'Thoughtful', ru: 'Задумчивость' } },
            { value: 'Confused / Puzzled', label: { en: 'Confused', ru: 'Замешательство' } },
            { value: 'Disgusted', label: { en: 'Disgusted', ru: 'Отвращение' } },
        ]
    }
];

export interface SubjectSettings {
    description: string;
    position: SubjectPosition;
    pose: string;
    emotion?: string;
    lighting?: string; // New field
    cameraAngle: string;
    focusArea?: FocusArea; // Legacy: Single selection
    focusAreas?: FocusArea[]; // Legacy: Multiple selection 3x3
    camera?: string;
    lens?: string;
    aperture?: string;
}

export interface TextOverlaySettings {
    text: string;
    color: string;
    fontFamily: string;
    fontSize: number;
    x: number; // Percentage 0-100
    y: number; // Percentage 0-100
    rotation: number; // Degrees -180 to 180
}

export const PhotoTypes = [
    'Photorealistic', 'Oil painting', 'Watercolor', 'Sketch', 'Abstract',
    'Conceptual art', 'Minimalist', 'Retro', 'Sci-fi', 'Fantasy',
    'Cyberpunk', 'Steampunk', 'Anime', 'Cartoon', '3D render', 'Impressionist',
    'Vector Art', 'Stencil Art', 'Bas-relief', 'Jigsaw Cutting Stencil'
];

export const VisualEffects = [
    'None',
    'Cinematic Lighting',
    'Bokeh (Background Blur)',
    'HDR (High Dynamic Range)',
    'Glitch Effect',
    'Vignette',
    'Double Exposure',
    'Lens Flare',
    'Motion Blur',
    'Film Grain',
    'Sepia Tone',
    'Black & White High Contrast',
    'Duotone',
    'VHS Tape Artifacts',
    'Holographic',
    'Neon Glow',
    'Chromatic Aberration',
    'Fish-eye Lens',
    'Polaroid Style',
    'Tilt-Shift',
    'Soft Focus',
    'Matte Finish',
    'Color Splash',
    'Infrared',
    'Thermal Vision'
];

export const OverlayFonts = [
    'Arial',
    'Verdana',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Impact',
    'Comic Sans MS',
    'Trebuchet MS',
    'Lucida Console',
    'Brush Script MT',
    'Garamond'
];

export interface HistoryFolder {
    id: string;
    name: string;
}

export interface HistoryItem {
  id: string; // Unique identifier
  folderId?: string; // Optional folder association
  image: string; // Result image
  prompt: string; // Generation or edit prompt
  model: ImageModel;
  photoType: string;
  aspectRatio: AspectRatio;
  quality: ImageQuality;
  mode: Mode;
  sourceImage?: string;
  characterDescription?: string; // Deprecated, keep for backward compat
  subjectSettings?: SubjectSettings;
  referenceImages?: string[];
}

export interface Preset {
    name: string;
    prompt: string;
}
