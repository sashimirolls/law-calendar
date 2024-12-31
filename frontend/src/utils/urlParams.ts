import { Logger } from './logger';
import { salespeople } from '../config/salespeople';
import { Salesperson } from '../types/acuity';
import { parseFormsortData } from './formsort';

export interface ParsedUrlParams {
  selectedPeople: Salesperson[];
  firstName: string;
  lastName: string;
  email: string;
  error?: string;
}

export function parseUrlParameters(): ParsedUrlParams {
  Logger.debug('URLParser', 'Starting parameter parsing');
  
  const params = new URLSearchParams(window.location.search);
  const formsortData = parseFormsortData(params);

  if (!formsortData.salespeople.length) {
    Logger.warn('URLParser', 'No salespeople found in parameters');
    return {
      selectedPeople: [],
      firstName: formsortData.firstName,
      lastName: formsortData.lastName,
      email: formsortData.email,
      error: 'No salespeople parameter found'
    };
  }

  // Match salespeople names to our config
  const selected = formsortData.salespeople.reduce((acc, name) => {
    const match = salespeople.find(
      person => person.name.toLowerCase() === name.toLowerCase()
    );
    if (match) {
      acc.push(match);
    } else {
      Logger.warn('URLParser', `No match found for: ${name}`);
    }
    return acc;
  }, [] as Salesperson[]);

  Logger.debug('URLParser', 'Matched salespeople', selected);

  if (selected.length === 0) {
    return {
      selectedPeople: [],
      firstName: formsortData.firstName,
      lastName: formsortData.lastName,
      email: formsortData.email,
      error: 'No valid salespeople found'
    };
  }

  if (selected.length > 2) {
    Logger.warn('URLParser', 'Too many salespeople selected');
    return {
      selectedPeople: selected.slice(0, 2),
      firstName: formsortData.firstName,
      lastName: formsortData.lastName,
      email: formsortData.email,
      error: 'Maximum 2 salespeople allowed'
    };
  }

  return {
    selectedPeople: selected,
    firstName: formsortData.firstName,
    lastName: formsortData.lastName,
    email: formsortData.email
  };
}