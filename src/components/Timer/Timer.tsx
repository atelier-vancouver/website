import { AutoTextSize } from "auto-text-size";
import { useCallback, useEffect, useRef, useState } from "react";
import "./Timer.scss";
// import wrapUpWav from "./wrap-up.wav";
import dingMp3 from "./ding.mp3";

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has("m")) {
  searchParams.set("m", "2");
  window.location.search = searchParams.toString();
}
const totalSeconds = Number(searchParams.get("m")) * 60;

export function Timer() {
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);

  const [fontSize, setFontSize] = useState(100);
  const timerTextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isRunning) {
      let startTime = Date.now();

      const interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = Math.floor((currentTime - startTime) / 1000);

        setSecondsRemaining((prev) => {
          const next = Math.floor(totalSeconds - elapsedTime);
          return next;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const secondsRemainingAbs = Math.abs(secondsRemaining);
  const seconds = Math.floor(secondsRemainingAbs) % 60;
  const minutes = Math.floor(secondsRemainingAbs / 60);
  const secondsString = seconds.toString().padStart(2, "0");
  const minutesString = minutes.toString().padStart(2, "0");

  useEffect(() => {
    if (secondsRemaining === 0) {
      const audio = new Audio(dingMp3);
      audio.play();
    }
  }, [secondsRemaining]);

  const onButtonPress = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
    } else if (secondsRemaining !== totalSeconds) {
      setSecondsRemaining(totalSeconds);
      setIsRunning(false);
    } else {
      setSecondsRemaining(totalSeconds);
      setIsRunning(true);
    }
  }, [isRunning, secondsRemaining, totalSeconds]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === " ") {
        onButtonPress();
      }

      if (e.key === "d") {
        const audio = new Audio(dingMp3);
        audio.play();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onButtonPress]);

  return (
    <div
      style={{
        height: "100vh",
        alignContent: "center",

        animation: secondsRemaining <= 0 ? "flash-red 1s infinite" : "none",
      }}
    >
      <div
        ref={timerTextRef}
        style={{
          fontSize: `${fontSize}px`,
          boxSizing: "border-box",
          padding: "10px",

          fontFeatureSettings: "'tnum'",
        }}
      >
        <AutoTextSize maxFontSizePx={window.document.body.clientHeight}>
          <span>{minutesString}</span>
          <span>:</span>
          <span>{secondsString}</span>
        </AutoTextSize>
      </div>
      <button
        style={{ display: "block", margin: "auto", fontSize: "100px" }}
        onClick={(e) => {
          if (e.screenX === 0 && e.screenY === 0) {
            return;
          }
          onButtonPress();
        }}
      >
        {isRunning
          ? "Stop"
          : secondsRemaining !== totalSeconds
            ? "Reset"
            : "Start"}
      </button>
    </div>
  );
}
