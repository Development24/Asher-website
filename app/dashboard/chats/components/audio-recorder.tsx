import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isDisabled?: boolean;
}

export function AudioRecorder({ onRecordingComplete, isDisabled }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/mpeg' });
        onRecordingComplete(audioBlob);
        setIsRecording(false);
        setRecordingTime(0);
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error accessing microphone:', error);
      }
      // You might want to show a toast notification here
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      {isRecording ? (
        <>
          <span className="text-xs text-red-600 animate-pulse">
            {formatTime(recordingTime)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100"
            onClick={stopRecording}
          >
            <Square className="h-4 w-4 text-red-600" />
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-gray-100"
          onClick={startRecording}
          disabled={isDisabled}
        >
          <Mic className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
} 