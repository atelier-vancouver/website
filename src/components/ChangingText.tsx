import { useEffect, useState } from "react";

export interface ChangingTextProps {
  texts: string[];
  interval: number;
}

export function ChangingText({ texts, interval }: ChangingTextProps) {
  const [text, setText] = useState(texts[0]);

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      index = index + 1 === texts.length ? 0 : index + 1;
      setText(texts[index]);
    }, interval);

    return () => clearInterval(intervalId);
  }, []);

  return <>{text}</>;
}
