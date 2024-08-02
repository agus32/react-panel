import React from 'react';

export const Scraper = () => {
  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <iframe
        src="scraper/index.html"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="Scraper"
      />
    </div>
  );
};