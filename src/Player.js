import React, { useRef, useEffect, useState } from 'react';
import { FaEllipsisH, FaVolumeUp } from 'react-icons/fa';
import './App.css';

function Player({ songs, currentSong, setCurrentSong }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Default volume level (max)

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.error('Error attempting to play:', error);
      });
    }
  }, [currentSong, isPlaying]);

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
        }).catch(error => {
          console.error('Error attempting to play:', error);
        });
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleNext = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[previousIndex]);
  };

  const handleSeek = (e) => {
    if (audioRef.current) {
      const seekTo = (e.target.value / 100) * audioRef.current.duration;
      audioRef.current.currentTime = seekTo;
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = e.target.value;
    }
  };

  const coverUrl = `https://cms.samespace.com/assets/${currentSong.cover_id}`;

  return (
    <div className="player">
      <div className="cover">
        <img src={coverUrl} alt={currentSong.title} />
      </div>
      <div className="info">
        <h2>{currentSong.title}</h2>
        <h3>{currentSong.artist}</h3>
      </div>
      <div className="controls">
        <button className="menu-icon"><FaEllipsisH className="icon" /></button> {/* Three-dot menu icon */}
        <button onClick={handlePrevious}>Previous</button>
        <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={handleNext}>Next</button>
        <input type="range" min="0" max="100" onChange={handleSeek} className="seeker" />
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.1" 
          value={volume} 
          onChange={handleVolumeChange} 
          className="volume-control" 
        />
        <button className="volume-icon"><FaVolumeUp className="icon" /></button> {/* Sound icon */}
      </div>
      <audio ref={audioRef} src={currentSong.url} />
    </div>
  );
}

export default Player;
