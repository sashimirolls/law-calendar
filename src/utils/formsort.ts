import { Logger } from './logger';

export function parseFormsortData(searchParams: URLSearchParams) {
  Logger.debug('Formsort', 'Parsing URL parameters');

  const rawSalespeople = searchParams.get('salespeople') || '';
  const firstName = searchParams.get('first-name') || '';
  const lastName = searchParams.get('last-name') || '';
  const email = searchParams.get('email') || '';

  Logger.debug('Formsort', 'Raw salespeople:', rawSalespeople);

  let salespeople: string[] = [];
  
  try {
    if (rawSalespeople) {
      // First decode the URI component
      const decoded = decodeURIComponent(rawSalespeople);
      Logger.debug('Formsort', 'Decoded salespeople:', decoded);
      
      // Split by comma or 'and'
      salespeople = decoded
        .split(/,|\s+and\s+/)
        .map(s => s.trim())
        .filter(Boolean);
      
      Logger.debug('Formsort', 'Parsed salespeople:', salespeople);
    }
  } catch (err) {
    Logger.error('Formsort', 'Error parsing salespeople:', err);
    salespeople = [];
  }

  return {
    salespeople,
    firstName: decodeURIComponent(firstName || ''),
    lastName: decodeURIComponent(lastName || ''),
    email: decodeURIComponent(email || '')
  };
}