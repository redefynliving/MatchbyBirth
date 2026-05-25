
import React, { useEffect } from 'react';

function AdUnit({ adSlot, adFormat = 'auto' }) {
  useEffect(() => {
    try {
      if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
        window.adsbygoogle.push({});
      }
    } catch (e) {
      console.error('AdSense error:', e);
    }
  }, []);

  return (
    <div className="ad-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-7210866068673514"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
}

export default AdUnit;
