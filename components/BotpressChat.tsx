'use client';

import { useEffect, useState } from 'react';

export default function BotpressChat() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.log('BotpressChat component mounted');
    
    // Load Botpress scripts
    const script1 = document.createElement('script');
    script1.src = 'https://cdn.botpress.cloud/webchat/v2.5/inject.js';
    script1.async = true;
    script1.onerror = (error) => {
      console.error('Failed to load Botpress main script:', error);
    };
    script1.onload = () => {
      console.log('Botpress main script loaded successfully');
      setIsLoaded(true);
    };
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://files.bpcontent.cloud/2025/05/24/18/20250524184616-ZQNRICSW.js';
    script2.async = true;
    script2.onerror = (error) => {
      console.error('Failed to load Botpress config script:', error);
    };
    script2.onload = () => {
      console.log('Botpress config script loaded successfully');
    };
    document.body.appendChild(script2);

    // Cleanup function to remove scripts when component unmounts
    return () => {
      console.log('BotpressChat component unmounting');
      if (document.body.contains(script1)) {
        document.body.removeChild(script1);
      }
      if (document.body.contains(script2)) {
        document.body.removeChild(script2);
      }
    };
  }, []);

  // Add a small indicator to show the component is mounted
  return (
    <div 
      style={{ 
        position: 'fixed', 
        bottom: '20px', 
        right: '20px', 
        zIndex: 9999,
        display: isLoaded ? 'none' : 'block'
      }}
    >
      Loading chat...
    </div>
  );
} 