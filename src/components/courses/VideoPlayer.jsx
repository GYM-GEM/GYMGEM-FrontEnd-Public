import { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Video, Loader2 } from "lucide-react";

const VideoPlayer = ({ url }) => {
    const [videoError, setVideoError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setVideoError(false);
        setIsLoading(true);
        console.log("VideoPlayer received URL:", url);

        // Timeout to prevent infinite loading
        const loadTimeout = setTimeout(() => {
            console.log("Video loading timeout - hiding spinner");
            setIsLoading(false);
        }, 10000); // 10 seconds timeout

        return () => clearTimeout(loadTimeout);
    }, [url]);

    // simple URL validation
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    if (!url || !isValidUrl(url)) {
        console.warn("Invalid video URL:", url);
        return (
            <div className="w-full aspect-video bg-gray-900 flex flex-col items-center justify-center text-white gap-2">
                <Video className="w-12 h-12 text-gray-500" />
                <p className="text-sm text-gray-400">Invalid Video URL</p>
            </div>
        );
    }

    // Determine if URL is a direct file (MP4, WebM, etc.) vs streaming platform
    const isDirectFile = url && (
        url.includes('.mp4') ||
        url.includes('.webm') ||
        url.includes('.ogg') ||
        url.includes('cloudinary.com/video') ||
        url.includes('vimeo.com') ||
        url.includes('youtube.com') ||
        url.includes('youtu.be') ||
        url.includes('drive.google.com')
    );

    console.log("Video URL Analysis:", { url, isDirectFile, isValidUrl: isValidUrl(url) });

    return (
        <div className="w-full aspect-video bg-black flex items-center justify-center relative rounded-xl overflow-hidden group">
            {isLoading && !videoError && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-gray-900/50 backdrop-blur-sm">
                    <Loader2 className="w-8 h-8 text-[#FF8211] animate-spin" />
                </div>
            )}

            {!videoError ? (
                isDirectFile ? (
                    // Use native HTML5 video for direct file URLs
                    <video
                        key={url}
                        className="w-full h-full"
                        controls
                        preload="metadata"
                        onLoadedMetadata={() => {
                            console.log("Video metadata loaded");
                            setIsLoading(false);
                        }}
                        onCanPlay={() => {
                            console.log("Video can play");
                            setIsLoading(false);
                        }}
                        onError={(e) => {
                            console.error("Video Error:", e);
                            setVideoError(true);
                            setIsLoading(false);
                        }}
                    >
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    // Use ReactPlayer for YouTube and other platforms
                    <ReactPlayer
                        key={url}
                        url={url}
                        controls={true}
                        width="100%"
                        height="100%"
                        className="react-player"
                        playing={false}
                        onReady={() => {
                            console.log("Video Ready");
                            setIsLoading(false);
                        }}
                        onStart={() => {
                            console.log("Video Started");
                            setIsLoading(false);
                        }}
                        onProgress={() => {
                            if (isLoading) {
                                setIsLoading(false);
                            }
                        }}
                        onError={(e) => {
                            console.error("ReactPlayer Error:", e);
                            setVideoError(true);
                            setIsLoading(false);
                        }}
                        config={{
                            youtube: {
                                playerVars: {
                                    origin: window.location.origin,
                                    modestbranding: 1,
                                    rel: 0
                                },
                            },
                        }}
                    />
                )
            ) : (
                <div className="text-white flex flex-col items-center gap-3 p-6 text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
                        <Video className="w-8 h-8 opacity-50" />
                    </div>
                    <div>
                        <p className="font-medium text-red-400 mb-1">Unable to play video</p>
                        <p className="text-xs text-gray-400 max-w-md">
                            The video source might be restricted or unavailable.
                            <br />
                            <span className="opacity-50 select-all block mt-1 truncate max-w-[200px] mx-auto">{url}</span>
                        </p>
                    </div>
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 text-xs text-[#FF8211] hover:underline"
                    >
                        Open in new tab
                    </a>
                </div>
            )}
        </div>
    );
};

export default VideoPlayer;
