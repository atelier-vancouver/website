import { useEffect, useState } from "react";

export function TimeText() {
  const [time, setTime] = useState<string>("00:00 PM");

  useEffect(() => {
    function updateTime() {
      const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      setTime(formatter.format(new Date()));
    }

    // Update immediately
    updateTime();

    // Update every minute
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <>{time}</>;
}
