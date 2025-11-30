import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Workbox } from 'workbox-window';

export const useLiveUpdate = () => {
  const { toast } = useToast();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const wb = new Workbox('/sw.js');

      wb.addEventListener('waiting', () => {
        toast({
          title: "تحديث متاح",
          description: "سيتم تحديث التطبيق الآن...",
          duration: 2000,
        });

        // Auto-update after 2 seconds
        setTimeout(() => {
          wb.messageSkipWaiting();
        }, 2000);
      });

      wb.addEventListener('controlling', () => {
        window.location.reload();
      });

      wb.register().catch((err) => {
        console.error('Service worker registration failed:', err);
      });

      // Check for updates every hour
      setInterval(() => {
        wb.update();
      }, 60 * 60 * 1000);
    }
  }, [toast]);
};
