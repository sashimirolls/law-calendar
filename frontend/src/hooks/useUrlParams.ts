import { useState, useEffect, useCallback } from 'react';
import { ParsedUrlParams, parseUrlParameters } from '../utils/urlParams';
import { Logger } from '../utils/logger';

export function useUrlParams() {
  const [params, setParams] = useState(() => parseUrlParameters());

  const handleUrlChange = useCallback(() => {
    const newParams = parseUrlParameters();
    if (JSON.stringify(newParams) !== JSON.stringify(params)) {
      Logger.debug('useUrlParams', 'URL changed, updating params');
      setParams(newParams);
    }
  }, [params]);

  // useEffect(() => {
  //   window.addEventListener('popstate', handleUrlChange);
  //   return () => window.removeEventListener('popstate', handleUrlChange);
  // }, [handleUrlChange]);

  const updateParams = (newParams: ParsedUrlParams) => {
    if (JSON.stringify(params) !== JSON.stringify(newParams)) {
      const newQuery = new URLSearchParams();
      newParams.selectedPeople.forEach(person => {
        newQuery.append('salespeople', person.name);
      });
      window.history.pushState(null, '', `?${newQuery.toString()}`);
      setParams(newParams);
    }
  };

  return { ...params, updateParams };
}
