import { useState, useEffect } from 'react';
import { TimeSlot, Salesperson } from '../types/acuity';
import { getAvailability } from '../services/acuityApi';
import { Logger } from '../utils/logger';
import { API_CONFIG } from '../services/config';

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

        // 30 days from current date
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + API_CONFIG.startDate);

        // 180 days from current date
        let endDate = new Date();
        endDate.setDate(startDate.getDate() + API_CONFIG.endDate);

        // Get availability from 30 to 180 days from current date
        let availabilityPromises: Promise<TimeSlot[]>[] = [];
        while (startDate <= endDate) {
          const today = startDate.toISOString().split('T')[0];
          availabilityPromises.push(
            ...selectedPeople.map(person => getAvailability(person.calendarID, today))
          );
          startDate.setDate(startDate.getDate() + 30); // move to next month
        }

        // Fetch all availability in parallel
        const results = await Promise.all(availabilityPromises);
        console.log('results sds:', results);

        const allSlots = results.reduce((acc, current) => acc.concat(current), []); // Merge arrays in `results`

        // Filter out invalid or empty results
        const validSlots = allSlots.filter(slot => slot != null);

        // If no valid slots, return early
        if (validSlots.length === 0) {
          setSlots([]);
          return;
        }

        // If you're looking for overlapping slots for all selected salespeople:
        const mergedSlots = validSlots.filter(slot =>
          selectedPeople.every(person =>
            validSlots.some(ps => ps.datetime === slot.datetime)
          )
        );

        Logger.debug('useAvailability', 'Merged slots:', mergedSlots);

        // Set the merged slots to the state
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
