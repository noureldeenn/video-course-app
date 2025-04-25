import { useEffect, useState } from "react";

export type WatchStatus = {
  [videoId: string]: {
    progress: number;
    status: "Unwatched" | "Watched";
  };
};

const LOCAL_STORAGE_KEY = "videoWatchStatus";

export function useVideoProgress() {
  const [watchStatus, setWatchStatus] = useState<WatchStatus>({});
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        setWatchStatus(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved video progress", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watchStatus));
    }
  }, [watchStatus, isLoaded]);

  const updateProgress = (videoId: string, played: number) => {
    const percentage = Math.round(played * 100);
    setWatchStatus((prev) => {
      const current = prev[videoId] || { progress: 0, status: "Unwatched" };
      const newStatus = percentage >= 80 ? "Watched" : current.status;
      return {
        ...prev,
        [videoId]: { progress: percentage, status: newStatus },
      };
    });
  };

  return { watchStatus, updateProgress, isLoaded };
}
