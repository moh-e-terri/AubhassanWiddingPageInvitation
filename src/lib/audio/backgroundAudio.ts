let audioElement: HTMLAudioElement | null = null;

export function registerBackgroundAudio(el: HTMLAudioElement) {
  audioElement = el;
  el.load();
}

export function getBackgroundAudio() {
  return audioElement;
}

/** تشغيل مباشر داخل حدث اللمس/الضغط — لا async قبل play() */
export function playBackgroundAudioFromGesture(): boolean {
  const audio = audioElement;
  if (!audio) return false;

  audio.volume = 1;

  try {
    const result = audio.play();
    if (result && typeof result.catch === 'function') {
      result.catch(() => {});
    }
    return true;
  } catch {
    return false;
  }
}

export function pauseBackgroundAudio() {
  audioElement?.pause();
}

export function resumeBackgroundAudio() {
  const audio = audioElement;
  if (!audio || !audio.paused) return false;

  try {
    const result = audio.play();
    if (result && typeof result.catch === 'function') {
      result.catch(() => {});
    }
    return true;
  } catch {
    return false;
  }
}

export function isBackgroundAudioPlaying() {
  return Boolean(audioElement && !audioElement.paused);
}

/** iOS/Safari: أول تفاعل يفتح قفل الصوت */
export function unlockBackgroundAudioFromGesture() {
  const audio = audioElement;
  if (!audio) return;

  const wasPaused = audio.paused;
  const time = audio.currentTime;

  try {
    const result = audio.play();
    if (result && typeof result.then === 'function') {
      result
        .then(() => {
          if (wasPaused) {
            audio.pause();
            audio.currentTime = time;
          }
        })
        .catch(() => {});
    }
  } catch {
    // ignore
  }
}
