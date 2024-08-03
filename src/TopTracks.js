import React from 'react';

function TopTracks({ topTracks, handleSongClick, currentSong }) {
  return (
    <div className="top-tracks">
    
      {topTracks.map(song => (
        <div
          key={song.id}
          className={`song ${song.id === currentSong?.id ? 'active' : ''}`}
          onClick={() => handleSongClick(song)}
        >
          <div className="song-info">
            <p>{song.name}</p>
            <p>{song.artist}</p>
          </div>
          <p className="song-duration">{song.duration}</p>
        </div>
      ))}
    </div>
  );
}

export default TopTracks;
