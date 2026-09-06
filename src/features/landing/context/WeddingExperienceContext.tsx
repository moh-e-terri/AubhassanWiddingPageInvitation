import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { weddingConfig } from '@/config/wedding.config';
import {
  isBackgroundAudioPlaying,
  pauseBackgroundAudio,
  playBackgroundAudioFromGesture,
  registerBackgroundAudio,
} from '@/lib/audio/backgroundAudio';

interface WeddingExperienceContextValue {
  showSplash: boolean;
  isPlaying: boolean;
  openInvitationFromGesture: () => void;
  toggleMusicFromGesture: () => void;
}

const WeddingExperienceContext = createContext<WeddingExperienceContextValue | null>(null);

export function WeddingExperienceProvider({ children }: { children: ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    registerBackgroundAudio(audio);

    const sync = () => setIsPlaying(!audio.paused);
    audio.addEventListener('play', sync);
    audio.addEventListener('pause', sync);
    audio.addEventListener('ended', sync);

    return () => {
      audio.removeEventListener('play', sync);
      audio.removeEventListener('pause', sync);
      audio.removeEventListener('ended', sync);
    };
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    if (window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }

    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', showSplash);
    return () => document.body.classList.remove('no-scroll');
  }, [showSplash]);

  const openInvitationFromGesture = useCallback(() => {
    queueMicrotask(() => setIsPlaying(isBackgroundAudioPlaying()));
    setShowSplash(false);

    if (window.location.hash) {
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      });
    });
  }, []);

  const toggleMusicFromGesture = useCallback(() => {
    if (isBackgroundAudioPlaying()) {
      pauseBackgroundAudio();
      setIsPlaying(false);
      return;
    }

    playBackgroundAudioFromGesture();
    // sync بعد microtask — بدون انتظار async يقطع gesture
    queueMicrotask(() => setIsPlaying(isBackgroundAudioPlaying()));
  }, []);

  return (
    <WeddingExperienceContext.Provider
      value={{ showSplash, isPlaying, openInvitationFromGesture, toggleMusicFromGesture }}
    >
      <audio
        ref={audioRef}
        id="wedding-bg-audio"
        loop
        preload="auto"
        playsInline
        src={weddingConfig.media.backgroundMusic}
      />
      {children}
    </WeddingExperienceContext.Provider>
  );
}

export function useWeddingExperience() {
  const ctx = useContext(WeddingExperienceContext);
  if (!ctx) {
    throw new Error('useWeddingExperience must be used within WeddingExperienceProvider');
  }
  return ctx;
}
