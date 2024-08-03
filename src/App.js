import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Search from './Search';
import Tabs from './Tabs';
import './App.css';
import { FaPlay, FaPause, FaEllipsisH, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const API_URL = 'https://cms.samespace.com/items/songs';
const COVER_IMAGE_URL = 'https://cms.samespace.com/assets/';

function App() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio());
  const [backgroundColor, setBackgroundColor] = useState('#121212');
  const [currentTab, setCurrentTab] = useState('For You');
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isVolumeControlActive, setIsVolumeControlActive] = useState(false);
  const volumeRef = useRef(null);

  const fetchSongs = useCallback(async () => {
    try {
      const response = await axios.get(API_URL);
      const allSongs = response.data.data;

      const songsWithDuration = await Promise.all(allSongs.map(async (song) => {
        const duration = await fetchSongDuration(song.url);
        return { ...song, duration };
      }));

      const filtered = currentTab === 'Top Tracks' ? songsWithDuration.filter(song => song.top_track) : songsWithDuration;

      setSongs(songsWithDuration);
      setFilteredSongs(filtered);

    } catch (error) {
      console.error('Error fetching songs:', error);
    }
  }, [currentTab]);

  useEffect(() => {
    fetchSongs();
  }, [currentTab, fetchSongs]);

  useEffect(() => {
    if (currentSong) {
      audio.src = currentSong.url;
      audio.currentTime = 0; // Reset currentTime to 0 for the new song
      audio.play().catch(error => console.error('Playback error:', error));
      setIsPlaying(true);
      setBackgroundColor(currentSong.accent);
      setCurrentTime(0); // Reset currentTime state to 0 for the new song
      audio.volume = volume;

      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
      };
    } else {
      // If no current song, pause the audio
      audio.pause();
    }
  }, [currentSong, audio, volume]);

  const fetchSongDuration = (url) => {
    return new Promise((resolve, reject) => {
      const tempAudio = new Audio(url);
      tempAudio.onloadedmetadata = () => {
        resolve(tempAudio.duration);
      };
      tempAudio.onerror = () => {
        reject('Error fetching duration');
      };
    });
  };

  const playPause = () => {
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => console.error('Playback error:', error));
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  };

  const prevSong = () => {
    const currentIndex = songs.findIndex(song => song.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[prevIndex]);
  };

  const handleSongClick = song => {
    setCurrentSong(song);
  };

  const handleSearch = (query) => {
    const filtered = songs.filter(song =>
      song.name.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSongs(filtered);
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const toggleMute = () => {
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  };

  useEffect(() => {
    const handleScroll = (e) => {
      if (isVolumeControlActive) {
        const volumeChange = -e.deltaY / 1000;
        setVolume(prevVolume => {
          const newVolume = Math.max(0, Math.min(prevVolume + volumeChange, 1));
          audio.volume = newVolume;
          setIsMuted(newVolume === 0);
          return newVolume;
        });
      }
    };

    window.addEventListener('wheel', handleScroll);
    return () => {
      window.removeEventListener('wheel', handleScroll);
    };
  }, [isVolumeControlActive, audio]);

  return (
    <div className="app-container" style={{ background: `linear-gradient(135deg, ${backgroundColor} 0%, rgba(0, 0, 0, 0.9) 100%)` }}>
      <div className="app-inner-container">
        <div className="app-column app-column-1">
          <div className="app-logo-container">
            <img src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png" alt="Spotify" />
          </div>
          <div className="app-login-container">
            <button className="app-login-button"></button>
          </div>
        </div>
        <div className="app-column app-column-2">
          <div className="app-tabs-container">
            <Tabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
            <Search onSearch={handleSearch} backgroundColor={backgroundColor} />
          </div>
          <div className="app-songs-container">
            <div className="app-songs">
              {filteredSongs.map(song => (
                <div
                  key={song.id}
                  className={`app-song ${song.id === currentSong?.id ? 'active' : ''}`}
                  onClick={() => handleSongClick(song)}
                >
                  <img src={`${COVER_IMAGE_URL}${song.cover}`} alt={song.name} className="app-cover-image-info" />
                  <div className="app-song-details">
                    <p className="app-song-name">{song.name}</p>
                    <p className="app-song-artist">{song.artist}</p>
                  </div>
                  <p className="app-song-duration">{formatTime(song.duration)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="app-column app-column-3">
          {currentSong && (
            <>
              <h1 className="app-song-title">{currentSong.name}</h1>
              <h2 className="app-song-artist1">{currentSong.artist}</h2>
              <img src={`${COVER_IMAGE_URL}${currentSong.cover}`} alt={currentSong.name} className="app-cover-image" />
              <div className="app-duration-container">
  <div className="app-seeker-container">
    <input
      type="range"
      className="app-seeker"
      min="0"
      max={duration || 100}
      value={currentTime}
      onChange={handleSeek}
    />
    
  </div>
</div>
  <div className="app-controls">
                <button className="app-control app-clo1"><FaEllipsisH /></button>
                <button className="app-control" onClick={prevSong}>&laquo;</button>
                <button className="app-control app-clo2" onClick={playPause}>
                  {isPlaying ? <FaPause /> : <FaPlay />}
                </button>
                <button className="app-control" onClick={nextSong}>&raquo;</button>
                <button
                  className="app-control app-clo3"
                  onClick={toggleMute}
                  onMouseEnter={() => setIsVolumeControlActive(true)}
                  onMouseLeave={() => setIsVolumeControlActive(false)}
                >
                  {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
