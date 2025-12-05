import React, { useState } from 'react';
import { Music, X, CheckCircle, Play } from 'lucide-react';

/**
 * Self-contained Music/Ambience Integration with floating player
 */
export const MusicIntegration = () => {
    const [musicUrl, setMusicUrl] = useState('');
    const [showPlayer, setShowPlayer] = useState(null);

    const handleSaveUrl = () => {
        if (!musicUrl.trim()) {
            setShowPlayer(null);
            return;
        }

        let embedUrl = musicUrl.trim();
        
        // Handle different YouTube URL formats
        if (embedUrl.includes('youtube.com/watch')) {
            // Standard: https://www.youtube.com/watch?v=VIDEO_ID
            const videoId = embedUrl.split('v=')[1]?.split('&')[0];
            if (videoId) {
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
        } else if (embedUrl.includes('youtu.be/')) {
            // Short: https://youtu.be/VIDEO_ID
            const videoId = embedUrl.split('youtu.be/')[1]?.split('?')[0];
            if (videoId) {
                embedUrl = `https://www.youtube.com/embed/${videoId}`;
            }
        } else if (embedUrl.includes('youtube.com/embed/')) {
            // Already in embed format - use as is
        } else {
            // Not a recognized YouTube URL
            alert('Please enter a valid YouTube URL');
            return;
        }
        
        setShowPlayer(embedUrl);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSaveUrl();
        }
    };

    return (
        <>
            {/* Main Control Panel */}
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
                            className="flex-1 p-3 border border-gray-300 rounded-xl focus:ring-pink-500 focus:border-pink-500 transition duration-150 shadow-sm"
                        />
                        <button
                            onClick={handleSaveUrl}
                            className="p-3 text-white bg-pink-600 rounded-xl hover:bg-pink-700 transition duration-150 flex-shrink-0 shadow-lg"
                            aria-label="Load Music Player"
                        >
                            <Play size={20} />
                        </button>
                    </div>

                    {showPlayer && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                            <p className="text-sm text-green-700 flex items-center">
                                <CheckCircle size={16} className="mr-2" />
                                Music player is now floating at the bottom-right corner. It will play across all tabs!
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
                    <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
                        💡 Tips & Examples
                    </h3>
                    <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
                        <li>Use lo-fi beats, nature sounds, or focus music for productivity</li>
                        <li>The player stays visible across all tabs</li>
                        <li>You can close it anytime by clicking the X button</li>
                    </ul>
                    
                    <div className="mt-4 pt-4 border-t border-blue-200">
                        <p className="text-xs font-semibold text-blue-800 mb-2">Try these popular focus playlists:</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setMusicUrl('https://www.youtube.com/watch?v=jfKfPfyJRdk');
                                    setTimeout(handleSaveUrl, 100);
                                }}
                                className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition"
                            >
                                🎵 Lofi Hip Hop
                            </button>
                            <button
                                onClick={() => {
                                    setMusicUrl('https://www.youtube.com/watch?v=5qap5aO4i9A');
                                    setTimeout(handleSaveUrl, 100);
                                }}
                                className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-full transition"
                            >
                                🌧️ Rain Sounds
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating Global Player */}
            {showPlayer && (
                <div className="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slide-up">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-600 p-3 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Music size={18} className="text-white" />
                            <span className="text-white font-semibold text-sm">Now Playing</span>
                        </div>
                        <button
                            onClick={() => setShowPlayer(null)}
                            className="p-1 bg-white/20 hover:bg-white/30 text-white rounded-full transition"
                            aria-label="Close Player"
                        >
                            <X size={16} />
                        </button>
                    </div>
                    <div className="relative pt-[56.25%]">
                        <iframe
                            className="absolute top-0 left-0 w-full h-full"
                            src={showPlayer}
                            title="Embedded Ambience"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </>
    );
};