import { useState, useEffect } from 'react';
import { TimeSlot, Salesperson } from '../types/acuity';
import { fetchAvailability } from '../services/acuity';
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
          fetchAvailability(person.calendarId, today)
        );

        const results = await Promise.all(availabilityPromises);
        
        const mergedSlots = results[0].filter(slot =>
          results.every(personSlots =>
            personSlots.some(ps => ps.datetime === slot.datetime)
          )
        );

        Logger.debug('useAvailability', 'Merged slots:', mergedSlots);
        setSlots(mergedSlots);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch availability';
        Logger.error('useAvailability', 'Error:', err);
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchSlots();
  }, [selectedPeople]);

  return { slots, loading, error };
}