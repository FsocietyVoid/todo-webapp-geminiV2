import React from 'react';
import { Music, CheckCircle, Play } from 'lucide-react';

export const MusicIntegration = ({ musicUrl, setMusicUrl, showPlayer, handleSaveUrl }) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSaveUrl();
        }
    };

    return (
        <div className="p-8 space-y-6">
            <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
                <Music size={28} className="mr-3 text-pink-600" />
                Ambience Player
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 space-y-4">
                <div className="flex items-center space-x-3">
                    <input
                        type="url"
                        value={musicUrl}
                        onChange={(e) => setMusicUrl(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Paste any YouTube URL (watch, youtu.be, or embed)"
                        className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-pink-500 focus:border-pink-500 transition shadow-sm"
                    />
                    <button
                        onClick={handleSaveUrl}
                        className="p-3 text-white bg-pink-600 rounded-xl hover:bg-pink-700 transition flex-shrink-0 shadow-lg"
                        aria-label="Load Music Player"
                    >
                        <Play size={20} />
                    </button>
                </div>

                {showPlayer && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                        <p className="text-sm text-green-700 flex items-center">
                            <CheckCircle size={16} className="mr-2" />
                            Music player is now floating at the bottom-right corner. Navigate to any tab - it will keep playing!
                        </p>
                    </div>
                )}

                {!showPlayer && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                        <p className="text-sm text-gray-600">
                            Enter a YouTube URL above and click play to start background ambience.
                        </p>
                    </div>
                )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
                <h3 className="font-semibold text-blue-900 mb-3">💡 Tips</h3>
                <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
                    <li>Use lo-fi beats, nature sounds, or focus music for productivity</li>
                    <li>The player stays visible across all tabs</li>
                    <li>You can close it anytime by clicking the X button</li>
                    <li>Press Enter after pasting URL to load quickly</li>
                </ul>
            </div>
        </div>
    );
};