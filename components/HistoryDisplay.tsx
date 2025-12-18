
import React, { useState, useEffect, useRef } from 'react';
import { HistoryItem, HistoryFolder, Language } from '../types';

interface HistoryDisplayProps {
    history: HistoryItem[];
    folders: HistoryFolder[];
    onSelect: (item: HistoryItem) => void;
    onUpdateOrder: (items: HistoryItem[]) => void;
    onDelete: (id: string) => void;
    onCreateFolder: (name: string) => void;
    onMoveToFolder: (itemId: string, folderId: string | undefined) => void;
    language: Language;
    activeFolderId: string | null;
    setActiveFolderId: (id: string | null) => void;
    onSetRootFolder: () => void;
    rootFolderName: string | null;
}

interface ContextMenuState {
    visible: boolean;
    x: number;
    y: number;
    item: HistoryItem | null;
}

const HistoryDisplay: React.FC<HistoryDisplayProps> = ({ 
    history, 
    folders,
    onSelect, 
    onUpdateOrder,
    onDelete,
    onCreateFolder,
    onMoveToFolder,
    language,
    activeFolderId,
    setActiveFolderId,
    onSetRootFolder,
    rootFolderName
}) => {
    const [iconSize, setIconSize] = useState<number>(3); // 1 to 5
    const [contextMenu, setContextMenu] = useState<ContextMenuState>({ visible: false, x: 0, y: 0, item: null });
    const [isDraggingInternal, setIsDraggingInternal] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    const [showFolderInput, setShowFolderInput] = useState(false);

    const contextMenuRef = useRef<HTMLDivElement>(null);

    // Filter history based on folder
    const displayedHistory = activeFolderId 
        ? history.filter(h => h.folderId === activeFolderId)
        : history; 

    // Handle Click Outside Context Menu
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
                setContextMenu({ ...contextMenu, visible: false });
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [contextMenu]);

    // -- Context Menu Actions --

    const handleContextMenu = (e: React.MouseEvent, item: HistoryItem) => {
        e.preventDefault();
        setContextMenu({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            item
        });
    };

    const handleSaveAs = () => {
        if (!contextMenu.item) return;
        const link = document.createElement('a');
        link.href = contextMenu.item.image;
        link.download = `ai-image-${contextMenu.item.id.slice(0, 8)}.png`;
        link.click();
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleEdit = () => {
        if (contextMenu.item) onSelect(contextMenu.item);
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleDelete = () => {
        if (contextMenu.item) onDelete(contextMenu.item.id);
        setContextMenu({ ...contextMenu, visible: false });
    };

    const handleMoveToFolder = (folderId: string | undefined) => {
        if (contextMenu.item) onMoveToFolder(contextMenu.item.id, folderId);
        setContextMenu({ ...contextMenu, visible: false });
    };

    // -- Drag and Drop for Reordering --

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: HistoryItem) => {
        setIsDraggingInternal(true);
        e.dataTransfer.setData("text/plain", item.image); // For dragging to external ControlPanel
        e.dataTransfer.setData("application/history-id", item.id); // For internal reordering
        e.dataTransfer.effectAllowed = "copyMove";
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Allow drop
        if (isDraggingInternal) {
            e.dataTransfer.dropEffect = "move";
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetItem: HistoryItem) => {
        setIsDraggingInternal(false);
        const draggedId = e.dataTransfer.getData("application/history-id");
        
        if (draggedId && draggedId !== targetItem.id) {
            e.preventDefault();
            // Perform Reorder
            const draggedIndex = history.findIndex(h => h.id === draggedId);
            const targetIndex = history.findIndex(h => h.id === targetItem.id);

            if (draggedIndex > -1 && targetIndex > -1) {
                const newHistory = [...history];
                const [movedItem] = newHistory.splice(draggedIndex, 1);
                newHistory.splice(targetIndex, 0, movedItem);
                onUpdateOrder(newHistory);
            }
        }
    };

    // -- Grid sizing class --
    const getGridClass = () => {
        switch(iconSize) {
            case 1: return "grid-cols-6 md:grid-cols-8 lg:grid-cols-10";
            case 2: return "grid-cols-4 md:grid-cols-6 lg:grid-cols-8";
            case 3: return "grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
            case 4: return "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
            case 5: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-2";
            default: return "grid-cols-3 md:grid-cols-4 lg:grid-cols-5";
        }
    };

    const handleAddFolder = () => {
        if (newFolderName.trim()) {
            onCreateFolder(newFolderName);
            setNewFolderName("");
            setShowFolderInput(false);
        }
    };

    return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex flex-col gap-4">
            
            {/* Top Bar: Title, Folder Tabs, Tools */}
            <div className="flex flex-col gap-4 border-b border-gray-700 pb-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-semibold text-white">{language === 'en' ? 'History' : 'История'}</h2>
                        
                        {/* Set Root Folder Button */}
                        <button 
                            onClick={onSetRootFolder}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold border transition-all shadow-sm hover:shadow-md ${
                                rootFolderName 
                                    ? 'bg-green-900/80 border-green-500 text-green-300 hover:bg-green-900' 
                                    : 'bg-gray-700 border-gray-500 text-gray-200 hover:bg-gray-600 hover:border-gray-400'
                            }`}
                            title={language === 'en' ? "Select local folder for auto-save" : "Выбрать папку на диске для автосохранения"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>
                            {rootFolderName 
                                ? (language === 'en' ? `Disk: ${rootFolderName}` : `Диск: ${rootFolderName}`) 
                                : (language === 'en' ? 'Set Disk Folder' : 'Задать папку диска')
                            }
                        </button>
                    </div>
                    
                    {/* Icon Size Slider */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{language === 'en' ? 'Size' : 'Размер'}</span>
                        <input 
                            type="range" 
                            min="1" 
                            max="5" 
                            value={iconSize} 
                            onChange={(e) => setIconSize(parseInt(e.target.value))}
                            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                    </div>
                </div>

                {/* Folders List */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    <button 
                        onClick={() => setActiveFolderId(null)}
                        className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${activeFolderId === null ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    >
                        {language === 'en' ? 'All Items' : 'Все фото'}
                    </button>
                    {folders.map(folder => (
                        <button 
                            key={folder.id}
                            onClick={() => setActiveFolderId(folder.id)}
                            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition-colors ${activeFolderId === folder.id ? 'bg-indigo-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                        >
                            {folder.name}
                        </button>
                    ))}
                    
                    {/* Add Folder Button */}
                    {!showFolderInput ? (
                         <button 
                            onClick={() => setShowFolderInput(true)}
                            className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white flex items-center gap-1 text-sm"
                            title={language === 'en' ? "Create New Folder" : "Создать папку"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            {language === 'en' ? 'New' : 'Новая'}
                        </button>
                    ) : (
                        <div className="flex items-center bg-gray-700 rounded-full px-2 py-0.5 border border-indigo-500">
                            <input 
                                autoFocus
                                type="text" 
                                className="bg-transparent border-none text-white text-sm w-24 focus:ring-0 px-1 outline-none"
                                placeholder={language === 'en' ? "Name..." : "Имя..."}
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddFolder()}
                            />
                            <button onClick={handleAddFolder} className="text-green-400 hover:text-green-300 px-1">✓</button>
                            <button onClick={() => setShowFolderInput(false)} className="text-red-400 hover:text-red-300 px-1">✕</button>
                        </div>
                    )}
                </div>
            </div>

            {/* Grid */}
            {displayedHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                    <p>{language === 'en' ? 'No images in this view.' : 'В этой папке нет изображений.'}</p>
                    <p className="text-sm mt-2">{language === 'en' ? 'Generate content or change folders.' : 'Создайте контент или смените папку.'}</p>
                </div>
            ) : (
                <div className={`grid gap-3 ${getGridClass()} transition-all duration-300`}>
                    {displayedHistory.map((item) => (
                        <div
                            key={item.id}
                            className="relative aspect-square cursor-pointer group rounded-lg overflow-hidden shadow-md bg-gray-900 border border-gray-800 hover:border-indigo-500/50"
                            onClick={() => onSelect(item)}
                            onContextMenu={(e) => handleContextMenu(e, item)}
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, item)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, item)}
                            role="button"
                            tabIndex={0}
                        >
                            <img
                                src={item.image}
                                alt={item.prompt}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                            
                            {/* Prompt Overlay (Only visible on hover) */}
                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-end p-2 pointer-events-none">
                                <p className="text-white text-[10px] text-center line-clamp-2">
                                    {item.prompt}
                                </p>
                            </div>

                            {/* Folder indicator tag if not in 'All' view, or if in 'All' view show which folder */}
                            {item.folderId && !activeFolderId && (
                                <div className="absolute top-1 right-1 w-3 h-3 bg-indigo-500 rounded-full border border-gray-800" title="In Folder"></div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Context Menu */}
            {contextMenu.visible && contextMenu.item && (
                <div 
                    ref={contextMenuRef}
                    className="fixed bg-gray-800 border border-gray-700 rounded-md shadow-xl py-1 z-50 w-48"
                    style={{ top: Math.min(contextMenu.y, window.innerHeight - 200), left: Math.min(contextMenu.x, window.innerWidth - 200) }}
                >
                    <div className="px-3 py-2 border-b border-gray-700 text-xs text-gray-400 font-semibold truncate">
                        {language === 'en' ? 'Action Menu' : 'Меню действий'}
                    </div>
                    <button 
                        onClick={handleEdit} 
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        {language === 'en' ? 'Use/Edit' : 'Изменить'}
                    </button>
                    <button 
                        onClick={handleSaveAs} 
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                        {language === 'en' ? 'Save Image' : 'Скачать'}
                    </button>
                    
                    <div className="border-t border-gray-700 my-1"></div>
                    <div className="px-3 py-1 text-xs text-gray-500">{language === 'en' ? 'Move to...' : 'Переместить в...'}</div>
                    
                    <button 
                         onClick={() => handleMoveToFolder(undefined)}
                         className="w-full text-left px-4 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white pl-8 relative"
                    >
                        {/* Dot indicator for 'No Folder' */}
                        {contextMenu.item.folderId === undefined && <span className="absolute left-3 text-indigo-500">•</span>}
                        {language === 'en' ? 'Unsorted (Root)' : 'Без папки'}
                    </button>
                    
                    {folders.map(f => (
                         <button 
                            key={f.id}
                            onClick={() => handleMoveToFolder(f.id)}
                            className="w-full text-left px-4 py-1.5 text-sm text-gray-300 hover:bg-gray-700 hover:text-white pl-8 relative truncate"
                        >
                            {contextMenu.item?.folderId === f.id && <span className="absolute left-3 text-indigo-500">•</span>}
                            {f.name}
                        </button>
                    ))}

                    <div className="border-t border-gray-700 my-1"></div>
                    <button 
                        onClick={handleDelete} 
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        {language === 'en' ? 'Delete' : 'Удалить'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default HistoryDisplay;
