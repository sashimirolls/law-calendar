import { useState, useEffect } from 'react';
import { TimeSlot, Salesperson } from '../types/acuity';
import { getAvailability } from '../services/acuityApi';
import { Logger } from '../utils/logger';

export function useAvailability(selectedPeople: Salesperson[]) {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSlots() {
      if (selectedPeople.length === 0) return;
      
      setLoading(true);
      setError(null);
      
      try {
        Logger.debug('useAvailability', 'Fetching for:', selectedPeople);
        
        const today = new Date().toISOString().split('T')[0];
        const availabilityPromises = selectedPeople.map(person =>
          getAvailability(person.calendarID, today)
        );

        const results = await Promise.all(availabilityPromises);
        
        // Filter out any null or undefined results
        const validResults = results.filter(result => Array.isArray(result));
        
        if (validResults.length === 0) {
          setSlots([]);
          return;
        }
        
        // Find overlapping time slots
        const mergedSlots = validResults[0].filter(slot =>
          validResults.every(personSlots =>
            personSlots.some(ps => ps.datetime === slot.datetime)));

        Logger.debug('useAvailability', 'Merged slots:', mergedSlots);
        setSlots(mergedSlots);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch availability';
        Logger.error('useAvailability', 'Error:', err);
        setError(message);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSlots();
  }, [selectedPeople]);

  return { slots, loading, error };
}
