
import React from 'react';
import { Language } from '../types';

const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({ className, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${className || ''}`.trim()} fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

interface HeaderProps {
    language: Language;
    setLanguage: (lang: Language) => void;
    onOpenHelp: () => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage, onOpenHelp }) => {
    return (
        <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 sticky top-0 z-10">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <CameraIcon className="text-indigo-400" />
                    <h1 className="text-2xl font-bold text-white tracking-wider hidden sm:block">
                        AI Photo Content Creator
                    </h1>
                    <h1 className="text-xl font-bold text-white tracking-wider block sm:hidden">
                        AI Creator
                    </h1>
                </div>
                
                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    <div className="flex bg-gray-700 rounded-lg p-1">
                        <button 
                            onClick={() => setLanguage('en')}
                            className={`px-2 py-1 text-xs font-bold rounded ${language === 'en' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            EN
                        </button>
                        <button 
                            onClick={() => setLanguage('ru')}
                            className={`px-2 py-1 text-xs font-bold rounded ${language === 'ru' ? 'bg-gray-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            RU
                        </button>
                    </div>

                    {/* Help Button */}
                    <button 
                        onClick={onOpenHelp}
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        title="Help / Помощь"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
