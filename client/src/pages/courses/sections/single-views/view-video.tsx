import React, { useRef, useState, useEffect } from 'react';
import { updateProgress } from '@/api/course.api';
import { SectionTypes } from '@/helpers/types';
import { useAuth } from '@/stores/AuthContext';
import { Play, Pause, Maximize, Minimize } from 'lucide-react';
import { registerTimeline } from '@/api/get.info.api';
import { createTimelineData } from '@/helpers/createTimelineData';

interface PDFViewProps {
  currentId: SectionTypes;
}

const VideoView: React.FC<PDFViewProps> = ({ currentId }) => {
  const { user, dispatch } = useAuth();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      const videoElement = videoRef.current;

      const handleLoadedMetadata = () => {
        setDuration(videoElement.duration);
      };

      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      return () => {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  const handleVideoEnd = async () => {
    if (videoRef.current) {
      const res = await updateProgress(user._id, currentId._id);
      dispatch({ type: 'UPDATE_PROGRESS', payload: res });
      dispatch(
        registerTimeline(
          createTimelineData({
            user: user._id,
            section: currentId._id,
            activityType: 'completed',
            text: `Completed ${currentId.title}`,
          })
        )
      );
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  };

  const handleVideoSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const seekTime = (videoRef.current.duration * parseFloat(e.target.value)) / 100;
      videoRef.current.currentTime = seekTime;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (isFullscreen) {
        document.exitFullscreen();
      } else {
        videoRef.current.parentElement?.requestFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  return (
    <div
      className={`mt-16 flex flex-col items-center justify-center w-full h-full mx-auto ${
        isFullscreen ? 'absolute top-0 left-0 right-0 bottom-0' : 'w-2/3 h-80'
      }`}
    >
      <p className='text-xs mb-2 text-start w-full mt-3'>{currentId?.description}</p>
      {currentId?.resource && (
        <div className='relative h-96 '>
          <video
            ref={videoRef}
            onEnded={handleVideoEnd}
            onTimeUpdate={handleTimeUpdate}
            controls={false}
            onContextMenu={(e) => e.preventDefault()}
            className='w-full h-full  object-cover'
          >
            <source
              src={currentId.resource}
              type='video/mp4'
            />
          </video>

          {/* Custom Controls */}
          <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-transparent to-transparent p-2 flex justify-between items-center'>
            <button
              onClick={handlePlayPause}
              className='bg-gray-800 text-white px-3 py-2 rounded-full text-sm'
            >
              {videoRef.current && videoRef.current.paused ? (
                <Play
                  size={20}
                  className='h-4'
                />
              ) : (
                <Pause
                  size={20}
                  className='h-4'
                />
              )}
            </button>

            <div className='flex items-center space-x-3 w-full px-3'>
              <span className='text-white text-sm'>{formatTime(currentTime)}</span>
              <input
                type='range'
                min='0'
                max='100'
                value={duration > 0 ? (currentTime / duration) * 100 : 0}
                className='w-64 h-1 bg-gray-400 rounded-full flex-1'
                onChange={handleVideoSeek}
              />
              <span className='text-white text-sm'>{formatTime(duration)}</span>
            </div>

            <button
              onClick={toggleFullscreen}
              className='bg-gray-800 text-white px-4 py-2 rounded-full text-sm'
            >
              {isFullscreen ? (
                <Minimize
                  size={20}
                  className='h-4'
                />
              ) : (
                <Maximize
                  size={20}
                  className='h-4'
                />
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoView;
