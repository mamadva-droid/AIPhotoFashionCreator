
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
    poses: TranslatedItem[];
}

// --- Backgrounds ---
export const Backgrounds: PoseCategory[] = [
    {
        name: { en: 'Studio Backdrops', ru: 'Студийные фоны' },
        poses: [
            { value: 'None (Default)', label: { en: 'None (Default)', ru: 'Нет (По умолчанию)' } },
            { value: 'Clean White Cyclorama', label: { en: 'White Cyclorama', ru: 'Белая циклорама' } },
            { value: 'Solid Black Backdrop', label: { en: 'Solid Black', ru: 'Черный фон' } },
            { value: 'Neutral Gray Paper', label: { en: 'Neutral Gray', ru: 'Серый бумажный' } },
            { value: 'Beige Textured Canvas', label: { en: 'Beige Textured', ru: 'Бежевый холст' } },
            { value: 'Fashion Color Paper (Pink)', label: { en: 'Color Paper (Pink)', ru: 'Цветная бумага (Розовый)' } },
            { value: 'Industrial Concrete Wall', label: { en: 'Concrete Wall', ru: 'Бетонная стена' } },
            { value: 'Green Screen', label: { en: 'Green Screen', ru: 'Хромакей' } },
        ]
    },
    {
        name: { en: 'General Locations', ru: 'Общий план / Локации' },
        poses: [
            { value: 'Blurred City Street', label: { en: 'Blurred City Street', ru: 'Размытая улица города' } },
            { value: 'Luxury Hotel Interior', label: { en: 'Luxury Interior', ru: 'Интерьер отеля (Люкс)' } },
            { value: 'Modern Minimalist Living Room', label: { en: 'Modern Living Room', ru: 'Минимализм (Гостиная)' } },
            { value: 'Lush Green Forest', label: { en: 'Lush Forest', ru: 'Густой лес' } },
            { value: 'Tropical Beach Sunset', label: { en: 'Beach Sunset', ru: 'Пляж (Закат)' } },
            { value: 'Futuristic Cyberpunk Alley', label: { en: 'Cyberpunk Alley', ru: 'Киберпанк-переулок' } },
            { value: 'Mountain Peak Vista', label: { en: 'Mountain Peak', ru: 'Горная вершина' } },
            { value: 'High-End Office Space', label: { en: 'Office Space', ru: 'Офисное пространство' } },
        ]
    }
];

// --- Camera Angles (Fashion Editorial & Specialized) ---
export const CameraAngles: PoseCategory[] = [
    {
        name: { en: 'High-End Fashion & Editorial', ru: 'Fashion-студия (Мировые бренды)' },
        poses: [
            { value: 'Full Length Catalogue', label: { en: 'Full Length (Catalogue Style)', ru: 'В полный рост (Каталог)' } },
            { value: 'Three-Quarter Fashion', label: { en: 'Three-Quarter View', ru: 'Три четверти (Коммерция)' } },
            { value: 'Beauty Headshot', label: { en: 'Beauty Headshot (Tight)', ru: 'Бьюти-портрет (Крупно)' } },
            { value: 'Editorial Low Angle', label: { en: 'Editorial Low Angle (Hero)', ru: 'Нижний ракурс (Editorial)' } },
            { value: 'Overhead Fashion', label: { en: 'High Angle (Dynamic)', ru: 'Верхний ракурс (Динамика)' } },
            { value: 'Back Profile Fashion', label: { en: 'Back View (Couture Focus)', ru: 'Вид со спины (Акцент на крое)' } },
            { value: 'Sidewalk Motion', label: { en: 'Street Motion (Walk-by)', ru: 'В движении (Street Style)' } },
        ]
    },
    {
        name: { en: 'Portrait & General', ru: 'Портретные и Общие' },
        poses: [
            { value: 'Default', label: { en: 'Default', ru: 'По умолчанию' } },
            { value: 'Eye Level', label: { en: 'Eye Level (Natural)', ru: 'На уровне глаз' } },
            { value: 'Low Angle', label: { en: 'Low Angle (Heroic)', ru: 'Снизу (Героический)' } },
            { value: 'High Angle', label: { en: 'High Angle', ru: 'Сверху' } },
            { value: 'Dutch Angle', label: { en: 'Dutch Angle (Tilted)', ru: 'Голландский угол' } },
            { value: 'Over-the-Shoulder', label: { en: 'Over-the-Shoulder', ru: 'Из-за плеча' } },
        ]
    },
    {
        name: { en: 'Product & Still Life', ru: 'Предметная съемка' },
        poses: [
            { value: 'Flat Lay', label: { en: 'Flat Lay (90° Top-Down)', ru: 'Строго сверху (Flat Lay)' } },
            { value: '45-Degree Angle', label: { en: '45-Degree Angle', ru: 'Угол 45 градусов' } },
            { value: 'Macro Detail', label: { en: 'Macro (Texture)', ru: 'Макро (Детали)' } },
            { value: 'Front View', label: { en: 'Front View', ru: 'Вид спереди' } },
        ]
    }
];

// --- Lighting Setups (Expanded and Categorized) ---
export const LightingSetups: PoseCategory[] = [
    {
        name: { en: 'Professional Studio', ru: 'Профессиональная студия' },
        poses: [
            { value: 'Default', label: { en: 'Default', ru: 'По умолчанию' } },
            { value: 'Softbox Lighting', label: { en: 'Softbox (Even & Soft)', ru: 'Мягкий свет (Софтбокс)' } },
            { value: 'Fashion Editorial Setup', label: { en: 'Fashion (Garment Focus)', ru: 'Съемка одежды (Fashion)' } },
            { value: 'Rembrandt Lighting', label: { en: 'Rembrandt (Dramatic)', ru: 'Рембрандтовский свет' } },
            { value: 'Butterfly Lighting', label: { en: 'Butterfly (Glamour)', ru: 'Свет "Бабочка" (Гламур)' } },
            { value: 'Product Studio Setup', label: { en: 'Product (Sharp Details)', ru: 'Предметная съемка' } },
            { value: 'High Key', label: { en: 'High Key (Bright)', ru: 'Высокий ключ' } },
            { value: 'Low Key', label: { en: 'Low Key (Moody)', ru: 'Низкий ключ' } },
        ]
    },
    {
        name: { en: 'Specialized & Artistic', ru: 'Спецэффекты и Арт' },
        poses: [
            { value: 'Narrow Beam Spotlight', label: { en: 'Narrow Beam Spot', ru: 'Узконаправленный луч' } },
            { value: 'Rim Backlighting', label: { en: 'Rim / Backlight', ru: 'Контровой свет' } },
            { value: 'Cinematic Contour', label: { en: 'Cinematic Contour', ru: 'Кино-контур' } },
            { value: 'Silhouette Lighting', label: { en: 'Silhouette (Backlit)', ru: 'Силуэт' } },
            { value: 'Stage Gels', label: { en: 'Stage Gels (Colored)', ru: 'Сценический (Цветной)' } },
        ]
    },
    {
        name: { en: 'Natural & Outdoor', ru: 'Естественный и Уличный' },
        poses: [
            { value: 'Golden Hour', label: { en: 'Golden Hour', ru: 'Золотой час' } },
            { value: 'Direct Hard Sunlight', label: { en: 'Direct Hard Sun', ru: 'Прямое жесткое солнце' } },
            { value: 'Overcast Soft Light', label: { en: 'Overcast (Soft)', ru: 'Пасмурно (Рассеянный)' } },
            { value: 'Street Lamps Night', label: { en: 'Street Night Lamps', ru: 'Уличные фонари (Ночь)' } },
            { value: 'Blue Hour', label: { en: 'Blue Hour (Twilight)', ru: 'Сумерки' } },
        ]
    },
    {
        name: { en: 'Indoor & Domestic', ru: 'Интерьерный и Бытовой' },
        poses: [
            { value: 'Cozy Warm Lamp', label: { en: 'Cozy Home Lamp', ru: 'Теплый домашний свет' } },
            { value: 'Window Soft Light', label: { en: 'Window Light', ru: 'Свет из окна' } },
            { value: 'Office Fluorescent', label: { en: 'Office (Cool White)', ru: 'Офисный холодный' } },
            { value: 'Candlelight Intimate', label: { en: 'Candlelight', ru: 'Свет свечи' } },
            { value: 'Cyberpunk Neon', label: { en: 'Neon / Cyberpunk', ru: 'Неон (Киберпанк)' } },
        ]
    }
];

// --- Comprehensive Model Poses ---
export const ModelPoses: PoseCategory[] = [
    {
        name: { en: 'Fashion & Alternative', ru: 'Fashion и Альтернатива' },
        poses: [
            { value: 'None (Default)', label: { en: 'None (Default)', ru: 'Нет (По умолчанию)' } },
            { value: 'Hands on hips confident', label: { en: 'Confident Hands on Hips', ru: 'Руки на бедрах (Уверенная)' } },
            { value: 'Dramatic Editorial Lean', label: { en: 'Dramatic Editorial Lean', ru: 'Драматичный наклон (Editorial)' } },
            { value: 'Looking over shoulder', label: { en: 'Looking Over Shoulder', ru: 'Взгляд через плечо' } },
            { value: 'Crossed legs standing', label: { en: 'Crossed Legs Standing', ru: 'Скрестив ноги стоя' } },
            { value: 'Asymmetric artistic pose', label: { en: 'Asymmetric Artistic', ru: 'Асимметричная арт-поза' } },
            { value: 'Crouching fashion pose', label: { en: 'Crouching Fashion', ru: 'Поза на кортах (Fashion)' } },
            { value: 'Hand touching hair', label: { en: 'Hand Touching Hair', ru: 'Рука трогает прическу' } },
            { value: 'Holding hem of garment', label: { en: 'Holding Hem of Garment', ru: 'Рука держит подол одежды' } },
            { value: 'Hands folded at waist', label: { en: 'Hands Folded at Waist', ru: 'Руки сложены на уровне живота' } },
        ]
    },
    {
        name: { en: 'Action & Motion', ru: 'Движение и Динамика' },
        poses: [
            { value: 'Sprinting motion', label: { en: 'Sprinting', ru: 'Бег (Спринт)' } },
            { value: 'Mid-air jump', label: { en: 'Mid-air Jump', ru: 'Прыжок в воздухе' } },
            { value: 'Spinning dress motion', label: { en: 'Spinning (Dress Motion)', ru: 'Вращение (Движение платья)' } },
            { value: 'Walking briskly', label: { en: 'Walking Briskly', ru: 'Быстрая походка' } },
            { value: 'Dynamic dance move', label: { en: 'Dance Move', ru: 'Танцевальное движение' } },
        ]
    },
    {
        name: { en: 'Street & Outdoor', ru: 'Улица и Город' },
        poses: [
            { value: 'Leaning against wall', label: { en: 'Leaning Against Wall', ru: 'Опираясь на стену' } },
            { value: 'Crossing the street', label: { en: 'Crossing Street', ru: 'Переходит дорогу' } },
            { value: 'Sitting on park bench', label: { en: 'Sitting on Bench', ru: 'Сидит на скамейке' } },
            { value: 'Adjusting sunglasses', label: { en: 'Adjusting Sunglasses', ru: 'Поправляет очки' } },
            { value: 'Hailing a taxi', label: { en: 'Hailing Taxi', ru: 'Ловит такси' } },
        ]
    },
    {
        name: { en: 'Office & Work', ru: 'Офис и Работа' },
        poses: [
            { value: 'Typing on laptop', label: { en: 'Typing on Laptop', ru: 'Работает за ноутбуком' } },
            { value: 'Presenting at whiteboard', label: { en: 'Presenting', ru: 'Презентация у доски' } },
            { value: 'Talking on office phone', label: { en: 'On Phone Call', ru: 'Разговор по телефону' } },
            { value: 'Holding coffee folder', label: { en: 'Holding Folder/Coffee', ru: 'С папкой и кофе' } },
            { value: 'Thinking at desk', label: { en: 'Thinking at Desk', ru: 'Задумчивость за столом' } },
        ]
    },
    {
        name: { en: 'Social & Communication', ru: 'Общение и Люди' },
        poses: [
            { value: 'Laughing with friends', label: { en: 'Laughing with Others', ru: 'Смеется с друзьями' } },
            { value: 'Animated hand gestures', label: { en: 'Hand Gesturing', ru: 'Активная жестикуляция' } },
            { value: 'Whispering secret', label: { en: 'Whispering', ru: 'Шепчет секрет' } },
            { value: 'Greeting/Waving', label: { en: 'Greeting/Waving', ru: 'Приветствие/Машет рукой' } },
            { value: 'Pointing at distance', label: { en: 'Pointing', ru: 'Указывает вдаль' } },
        ]
    },
    {
        name: { en: 'Home & Lifestyle', ru: 'Дом и Лайфстайл' },
        poses: [
            { value: 'Curled up on sofa', label: { en: 'Curled on Sofa', ru: 'Уютно на диване' } },
            { value: 'Reading a book', label: { en: 'Reading Book', ru: 'Читает книгу' } },
            { value: 'Cooking in kitchen', label: { en: 'Cooking', ru: 'Готовит на кухне' } },
            { value: 'Watering plants', label: { en: 'Watering Plants', ru: 'Поливает цветы' } },
            { value: 'Looking out window', label: { en: 'Looking Out Window', ru: 'Смотрит в окно' } },
        ]
    },
    {
        name: { en: 'Rest & Bed', ru: 'Постель и Отдых' },
        poses: [
            { value: 'Sleeping peacefully', label: { en: 'Sleeping', ru: 'Спит спокойно' } },
            { value: 'Stretching after wake up', label: { en: 'Stretching (Morning)', ru: 'Потягивается утром' } },
            { value: 'Propped up on pillows', label: { en: 'Propped on Pillows', ru: 'Опираясь на подушки' } },
            { value: 'Lying on stomach browsing phone', label: { en: 'Lying on Stomach', ru: 'Лежит на животе с телефоном' } },
            { value: 'Hugged by duvet', label: { en: 'Wrapped in Duvet', ru: 'Завернувшись в одеяло' } },
        ]
    }
];

// --- Subject Emotions & States ---
export const SubjectEmotions: PoseCategory[] = [
    {
        name: { en: 'Positive & Bright', ru: 'Позитив и Свет' },
        poses: [
            { value: 'None (Default)', label: { en: 'None (Default)', ru: 'Нет (По умолчанию)' } },
            { value: 'Gentle Smile', label: { en: 'Gentle Smile', ru: 'Легкая улыбка' } },
            { value: 'Radiant Laughing', label: { en: 'Radiant Laughing', ru: 'Лучезарный смех' } },
            { value: 'Childlike Wonder', label: { en: 'Childlike Wonder', ru: 'Детский восторг' } },
            { value: 'Serene Tranquility', label: { en: 'Serene & Calm', ru: 'Безмятежное спокойствие' } },
            { value: 'Triumphant Success', label: { en: 'Triumphant Pose', ru: 'Триумф и успех' } },
            { value: 'Playful Winking', label: { en: 'Playful Winking', ru: 'Игривое подмигивание' } },
        ]
    },
    {
        name: { en: 'Fashion & High-End', ru: 'Fashion и Стиль' },
        poses: [
            { value: 'Haughty Superiority', label: { en: 'Superior/Haughty', ru: 'Высокомерие и превосходство' } },
            { value: 'Sultry Seductive', label: { en: 'Sultry/Seductive', ru: 'Томный и соблазнительный' } },
            { value: 'Distant Nonchalance', label: { en: 'Nonchalant/Bored', ru: 'Холодная отрешенность' } },
            { value: 'Fierce Determination', label: { en: 'Fierce Determination', ru: 'Яростная решимость' } },
            { value: 'Mysterious Enigma', label: { en: 'Mysterious/Veiled', ru: 'Загадочность' } },
            { value: 'Confident Smirk', label: { en: 'Confident Smirk', ru: 'Уверенная ухмылка' } },
        ]
    },
    {
        name: { en: 'Intense & Dramatic', ru: 'Драма и Эмоции' },
        poses: [
            { value: 'Melancholic Pensive', label: { en: 'Melancholic/Pensive', ru: 'Меланхоличное раздумье' } },
            { value: 'Vulnerable Fragility', label: { en: 'Vulnerable/Fragile', ru: 'Уязвимость и хрупкость' } },
            { value: 'Intense Stare', label: { en: 'Intense Piercing Stare', ru: 'Пронзительный взгляд' } },
            { value: 'Profound Loneliness', label: { en: 'Lonely/Solitary', ru: 'Глубокое одиночество' } },
            { value: 'Shocked Surprised', label: { en: 'Shocked/Surprised', ru: 'Шок и удивление' } },
            { value: 'Angry Confrontational', label: { en: 'Angry/Confrontational', ru: 'Гнев и вызов' } },
            { value: 'Despair/Grief', label: { en: 'Despair/Grief', ru: 'Отчаяние' } },
        ]
    },
    {
        name: { en: 'Physical States', ru: 'Физические состояния' },
        poses: [
            { value: 'Exhausted Fatigue', label: { en: 'Exhausted/Fatigue', ru: 'Предельная усталость' } },
            { value: 'High Energy/Vibrant', label: { en: 'Energetic/Vibrant', ru: 'Энергичность и драйв' } },
            { value: 'Coy Shyness', label: { en: 'Coy/Shy', ru: 'Застенчивость' } },
            { value: 'Relaxed/Drowsy', label: { en: 'Relaxed/Drowsy', ru: 'Сонная расслабленность' } },
            { value: 'Alert/Watchful', label: { en: 'Alert/Watchful', ru: 'Настороженность' } },
        ]
    }
];

export const CameraModels: TranslatedItem[] = [
    { value: 'Default', label: { en: 'Default', ru: 'По умолчанию' } },
    { value: 'Sony A7R V', label: { en: 'Sony A7R V', ru: 'Sony A7R V' } },
    { value: 'Canon EOS R5', label: { en: 'Canon EOS R5', ru: 'Canon EOS R5' } },
    { value: 'Hasselblad X2D', label: { en: 'Hasselblad X2D', ru: 'Hasselblad' } },
];

export const Lenses: TranslatedItem[] = [
    { value: 'Default', label: { en: 'Default', ru: 'По умолчанию' } },
    { value: '85mm f/1.2', label: { en: '85mm f/1.2 (Portrait)', ru: '85mm f/1.2' } },
    { value: '35mm f/1.4', label: { en: '35mm f/1.4 (Street)', ru: '35mm f/1.4' } },
    { value: '50mm Prime', label: { en: '50mm f/1.4 Prime', ru: '50mm Prime' } },
];

export const Apertures: TranslatedItem[] = [
    { value: 'Default', label: { en: 'Default', ru: 'По умолчанию' } },
    { value: 'f/1.2', label: { en: 'f/1.2 (Soft Bokeh)', ru: 'f/1.2' } },
    { value: 'f/2.8', label: { en: 'f/2.8 (Sharp Subject)', ru: 'f/2.8' } },
    { value: 'f/8.0', label: { en: 'f/8.0 (Everything Sharp)', ru: 'f/8.0' } },
];

export interface SubjectSettings {
    description: string;
    position: SubjectPosition;
    pose: string;
    emotion?: string;
    lighting?: string;
    background?: string;
    cameraAngle: string;
    focusArea?: FocusArea;
    focusAreas?: FocusArea[];
    camera?: string;
    lens?: string;
    aperture?: string;
}

export interface TextOverlaySettings {
    text: string;
    color: string;
    fontFamily: string;
    fontSize: number;
    x: number;
    y: number;
    rotation: number;
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
    'Arial', 'Verdana', 'Helvetica', 'Times New Roman', 'Georgia', 'Courier New', 'Impact', 'Garamond'
];

export interface HistoryFolder {
    id: string;
    name: string;
}

export interface HistoryItem {
  id: string;
  folderId?: string;
  image: string;
  prompt: string;
  model: ImageModel;
  photoType: string;
  aspectRatio: AspectRatio;
  quality: ImageQuality;
  mode: Mode;
  sourceImage?: string;
  subjectSettings?: SubjectSettings;
  referenceImages?: string[];
}
