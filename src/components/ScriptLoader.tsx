import React, { useEffect, useState } from 'react';

interface ScriptLoaderProps {
  scripts: Array<{
    src: string;
    id?: string;
    type?: string;
  }>;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  children: React.ReactNode;
}

const ScriptLoader: React.FC<ScriptLoaderProps> = ({ scripts, onLoad, onError, children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadScript = (index: number): Promise<void> => {
      if (index >= scripts.length) {
        return Promise.resolve();
      }

      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = scripts[index].src;
        script.async = false;
        script.crossOrigin = 'anonymous';
        script.type = scripts[index].type || 'application/javascript';
        
        if (scripts[index].id) {
          script.id = scripts[index].id;
        }

        script.onload = () => {
          console.log(`Script loaded: ${scripts[index].src}`);
          resolve();
        };
        
        script.onerror = (error) => {
          console.error(`Failed to load script: ${scripts[index].src}`, error);
          reject(new Error(`Failed to load script: ${scripts[index].src}`));
        };

        document.head.appendChild(script);
      });
    };

    const loadAllScripts = async () => {
      try {
        for (let i = 0; i < scripts.length; i++) {
          await loadScript(i);
        }
        setIsLoaded(true);
        if (onLoad) onLoad();
      } catch (error) {
        console.error('Error loading scripts:', error);
        if (onError) onError(error instanceof Error ? error : new Error('Failed to load scripts'));
      }
    };

    loadAllScripts();

    return () => {
      scripts.forEach(script => {
        const existingScript = document.getElementById(script.id || '');
        if (existingScript) {
          existingScript.remove();
        }
      });
    };
  }, [scripts, onLoad, onError]);

  if (!isLoaded) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        Loading required scripts...
      </div>
    );
  }

  return <>{children}</>;
};

export default ScriptLoader; 