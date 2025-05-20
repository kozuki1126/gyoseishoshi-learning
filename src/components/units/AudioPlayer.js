import { useState, useRef, useEffect } from 'react';

export default function AudioPlayer({ audioUrl }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [speed, setSpeed] = useState(1.0);
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);

  // 再生時間の表示形式を変換する関数
  const formatTime = (time) => {
    if (isNaN(time)) return '00:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // 再生/一時停止を切り替える
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // 進行バーをクリックして再生位置を変更
  const handleProgressChange = (e) => {
    const width = progressBarRef.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const progressPercentage = (clickX / width);
    const newTime = progressPercentage * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // 音量変更ハンドラ
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
  };

  // 再生速度変更ハンドラ
  const handleSpeedChange = (newSpeed) => {
    audioRef.current.playbackRate = newSpeed;
    setSpeed(newSpeed);
  };

  // 10秒戻るボタンのハンドラ
  const handleBackward = () => {
    audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
  };

  // 10秒進むボタンのハンドラ
  const handleForward = () => {
    audioRef.current.currentTime = Math.min(duration, audioRef.current.currentTime + 10);
  };

  useEffect(() => {
    // オーディオの読み込みが完了したら、総再生時間を設定
    const handleLoadedMetadata = () => {
      setDuration(audioRef.current.duration);
    };

    // 再生位置が変更されたら、現在の再生時間を更新
    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
    };

    // 再生が終了したら、再生状態をリセット
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audioRef.current.currentTime = 0;
    };

    // イベントリスナーを登録
    const audio = audioRef.current;
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    // 初期設定
    audio.volume = volume;
    audio.playbackRate = speed;

    // クリーンアップ関数
    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [volume, speed]);

  // 進行度を計算
  const progressPercentage = (currentTime / duration) * 100 || 0;

  return (
    <div className="audio-player bg-gray-50 rounded-lg p-4">
      {/* 非表示のオーディオ要素 */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      {/* 再生コントロール */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          {/* 10秒戻るボタン */}
          <button 
            onClick={handleBackward}
            className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
            </svg>
          </button>
          
          {/* 再生/一時停止ボタン */}
          <button 
            onClick={togglePlay}
            className="p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 focus:outline-none mx-2"
          >
            {isPlaying ? (
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          
          {/* 10秒進むボタン */}
          <button 
            onClick={handleForward}
            className="p-2 text-gray-600 hover:text-indigo-600 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
            </svg>
          </button>
        </div>
        
        {/* 再生速度選択 */}
        <div className="hidden sm:flex items-center space-x-2">
          <span className="text-sm text-gray-700">速度:</span>
          {[0.75, 1.0, 1.25, 1.5, 2.0].map((rate) => (
            <button
              key={rate}
              onClick={() => handleSpeedChange(rate)}
              className={`text-xs px-2 py-1 rounded ${
                speed === rate 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </div>
      
      {/* 進行バー */}
      <div className="mb-4">
        <div 
          ref={progressBarRef}
          className="h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
          onClick={handleProgressChange}
        >
          <div 
            className="h-full bg-indigo-600 transition-all duration-100"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm text-gray-500 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      
      {/* 音量コントロール */}
      <div className="flex items-center">
        <svg className="h-5 w-5 text-gray-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {volume === 0 ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          ) : volume < 0.5 ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m-4.95-9.779a1 1 0 10-1.414 1.414l10.607 10.607a1 1 0 101.414-1.414l-8.607-8.607M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          )}
        </svg>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    </div>
  );
}