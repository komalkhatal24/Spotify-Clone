import React from 'react';

function Tabs({ currentTab, setCurrentTab }) {
  return (
    <div className="tabs">
      <button onClick={() => setCurrentTab('For You')} className={currentTab === 'For You' ? 'active' : ''}>For You</button>
      <button onClick={() => setCurrentTab('Top Tracks')} className={currentTab === 'Top Tracks' ? 'active' : ''}>Top Tracks</button>
    </div>
  );
}
export default Tabs;
