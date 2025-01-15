import { useState, useEffect } from 'react';
import { parseUrlParameters } from '../utils/urlParams';
import { Logger } from '../utils/logger';

export function useUrlParams() {
  const [params, setParams] = useState(() => parseUrlParameters());

  useEffect(() => {
    function handleUrlChange() {
      console.log("UR:");
      Logger.debug('useUrlParams', 'URL changed, updating params');
      setParams(parseUrlParameters());
    }

    window.addEventListener('popstate', handleUrlChange);
    return () => window.removeEventListener('popstate', handleUrlChange);
  }, []);

  return params;
}