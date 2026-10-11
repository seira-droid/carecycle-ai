import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface SpeechButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export const SpeechButton: React.FC<SpeechButtonProps> = ({ text, label = 'Read aloud', className = '' }) => {
  const { speak, stopSpeaking, isSpeaking, activeSpeechText } = useAccessibility();

  const isCurrentTextSpeaking = isSpeaking && activeSpeechText === text.replace(/[#*_`]/g, '');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentTextSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-400 ${
        isCurrentTextSpeaking
          ? 'bg-purple-600 text-white animate-pulse'
          : 'bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300'
      } ${className}`}
      title={isCurrentTextSpeaking ? 'Stop reading' : label}
      aria-label={isCurrentTextSpeaking ? 'Stop reading aloud' : label}
    >
      {isCurrentTextSpeaking ? (
        <>
          <VolumeX className="w-3.5 h-3.5" />
          <span>Stop</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
};
