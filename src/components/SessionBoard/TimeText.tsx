import { useEffect, useState } from "react";

export function TimeText() {
  const [time, setTime] = useState<string>("00:00 PM");

  useEffect(() => {
    function updateTime() {
      const dateFormatter = new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      const timeFormatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      const dateTimeString = `${dateFormatter.format(new Date())} ${timeFormatter.format(
        new Date()
      )}`;

      setTime(dateTimeString);
    }

    // Update immediately
    updateTime();

    // Update every minute
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return <>{time}</>;
}
