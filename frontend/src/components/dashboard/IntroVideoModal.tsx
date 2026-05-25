import { useEffect, useRef, useState } from "react";

interface IntroVideoModalProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly videoSrc?: string;
}

const IntroVideoModal = ({
  open,
  onClose,
  videoSrc = "/orbital.mp4",
}: IntroVideoModalProps) => {
  const TRANSITION_MS = 900;
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [playBlocked, setPlayBlocked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  // Handle mount/unmount with smooth fade in/out
  useEffect(() => {
    let cleanupTimeout: number | undefined;
    const rafIds: number[] = [];

    const video = videoRef.current;
    const queueStateUpdate = (fn: () => void) => {
      const id = window.requestAnimationFrame(fn);
      rafIds.push(id);
    };

    const handlePlaying = () => {
      setIsPlaying(true);
      // show video with smooth transition
      requestAnimationFrame(() => setVisible(true));
    };

    if (open) {
      // Mount/reset asynchronously to avoid synchronous setState inside effect
      queueStateUpdate(() => setMounted(true));
      queueStateUpdate(() => {
        setVisible(false);
        setPlayBlocked(false);
        setIsPlaying(false);
      });

      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      // Ensure video is muted so autoplay is allowed in most browsers
      if (video) {
        try {
          video.muted = true;
        } catch {}
      }

      const tryPlay = async () => {
        try {
          const p = video?.play();
          if (p) {
            await p;
            // success — `playing` event will fire and show the video
          }
        } catch (e) {
          // autoplay blocked — show a play button so user can trigger playback
          setPlayBlocked(true);
        }
      };

      if (video) {
        video.addEventListener("playing", handlePlaying);
      }

      void tryPlay();

      return () => {
        document.body.style.overflow = previousOverflow;
        if (video) {
          video.removeEventListener("playing", handlePlaying);
        }
        rafIds.forEach((id) => window.cancelAnimationFrame(id));
      };
    }

    // If open becomes false while mounted, fade out then unmount
    if (mounted && !open) {
      queueStateUpdate(() => setVisible(false));
      cleanupTimeout = window.setTimeout(() => {
        setMounted(false);
        setPlayBlocked(false);
        setIsPlaying(false);
      }, TRANSITION_MS); // match transition duration
    }

    return () => {
      if (cleanupTimeout) {
        clearTimeout(cleanupTimeout);
      }
      if (video) {
        video.removeEventListener("playing", handlePlaying);
      }
      rafIds.forEach((id) => window.cancelAnimationFrame(id));
    };
  }, [open, mounted, TRANSITION_MS]);

  if (!mounted) {
    return null;
  }

  const handleEnded = () => {
    // Fade out then notify parent
    setVisible(false);
    window.setTimeout(() => {
      onClose();
      setMounted(false);
      setPlayBlocked(false);
      setIsPlaying(false);
    }, TRANSITION_MS);
  };

  const handleManualPlay = async (unmute = false) => {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (unmute) {
        video.muted = false;
      }
      await video.play();
      setPlayBlocked(false);
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="fixed inset-0 z-[140] bg-black">
      <video
        ref={videoRef}
        src={videoSrc}
        // Video fades/scales in once `visible` is true (after 'playing')
        className={`absolute inset-0 h-full w-full object-cover transform transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        controls={false}
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={handleEnded}
        // Disable PiP and other controls overlays where supported
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        // For remote playback API
        disableRemotePlayback
      />

      {/* Cinematic blackout layer to smooth the transition in/out */}
      <div
        className={`pointer-events-none absolute inset-0 bg-black transition-opacity duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          visible ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* If autoplay was blocked, show a centered play button so user can start playback */}
      {playBlocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={() => handleManualPlay(true)}
            className="bg-white/10 backdrop-blur-sm text-white rounded-full px-6 py-3 hover:bg-white/20 focus:outline-none"
          >
            Reproduzir vídeo
          </button>
        </div>
      )}

      {/* Small unmute hint when autoplay started muted */}
      {!playBlocked && isPlaying && (
        <button
          onClick={() => handleManualPlay(true)}
          className="absolute bottom-6 right-6 bg-black/40 text-white px-3 py-1 rounded-md backdrop-blur-sm"
        >
          Ativar som
        </button>
      )}
    </div>
  );
};

export default IntroVideoModal;
