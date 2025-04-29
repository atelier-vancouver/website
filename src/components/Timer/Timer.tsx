import { AutoTextSize } from "auto-text-size";
import { useCallback, useEffect, useState } from "react";
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
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (isRunning) {
      let lastTime = Date.now();

      const interval = setInterval(() => {
        const currentTime = Date.now();
        // the amount of time that has passed since the last interval
        const elapsedTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        setElapsedTime((prevElapsedTime) => prevElapsedTime + elapsedTime);
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const [screenVisible, setScreenVisible] = useState(true);

  useEffect(() => {
    function onVisibilityChange() {
      setScreenVisible(!document.hidden);
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  useEffect(() => {
    if (isRunning && screenVisible) {
      let screenLock: Promise<WakeLockSentinel>;
      try {
        screenLock = navigator.wakeLock.request("screen");
      } catch (error) {
        console.log(error);
      }

      return () => {
        screenLock.then((s) => s.release());
      };
    }
  }, [isRunning, screenVisible]);

  const secondsRemaining = Math.floor(totalSeconds - elapsedTime);
  const secondsRemainingAbs = Math.abs(secondsRemaining);
  const seconds = Math.floor(secondsRemainingAbs) % 60;
  const minutes = Math.floor(secondsRemainingAbs / 60);
  const secondsString = seconds.toString().padStart(2, "0");
  const minutesString = minutes.toString().padStart(2, "0");

  const isOutOfTime = secondsRemaining <= 0;

  useEffect(() => {
    if (isOutOfTime) {
      const audio = new Audio(dingMp3);
      audio.play();
    }
  }, [isOutOfTime]);

  const onButtonPress = useCallback(() => {
    if (isRunning) {
      setIsRunning(false);
    } else if (secondsRemaining !== totalSeconds) {
      setElapsedTime(0);
      setIsRunning(false);
    } else {
      setElapsedTime(0);
      setIsRunning(true);
    }
  }, [isRunning, secondsRemaining, totalSeconds]);

  const onResumePress = useCallback(() => {
    setIsRunning(true);
  }, [isRunning]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === " ") {
        onSpacePress();
      } else if (e.key === "d") {
        onDPress();
      } else if (e.key) {
        onFPress();
      } else if (e.key === "ArrowUp") {
        onUpPress();
      } else if (e.key === "ArrowDown") {
        onDownPress();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onButtonPress]);

  function onSpacePress() {
    onButtonPress();
  }

  function onDPress() {
    const audio = new Audio(dingMp3);
    audio.play();
  }

  function onFPress() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  function onUpPress() {
    setElapsedTime((prevElapsedTime) => prevElapsedTime - 10);
  }

  function onDownPress() {
    setElapsedTime((prevElapsedTime) => prevElapsedTime + 10);
  }

  return (
    <div
      style={{
        height: "100vh",
        alignContent: "center",

        animation: isOutOfTime ? "flash-red 1s infinite" : "none",
      }}
    >
      <div
        style={{
          boxSizing: "border-box",
          padding: "10px",

          fontFeatureSettings: "'tnum'",
        }}
      >
        <AutoTextSize
          mode="oneline"
          maxFontSizePx={window.document.body.clientHeight}
        >
          <span>{minutesString}</span>
          <span>:</span>
          <span>{secondsString}</span>
        </AutoTextSize>
      </div>
      <button
        style={{ display: "block", margin: "auto", fontSize: "1.5em" }}
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

      <button
        style={{
          display: "block",
          marginTop: "1em",
          marginLeft: "auto",
          marginRight: "auto",
          visibility:
            !isRunning && secondsRemaining !== totalSeconds
              ? "visible"
              : "hidden",
        }}
        onClick={(e) => {
          if (e.screenX === 0 && e.screenY === 0) {
            return;
          }
          onResumePress();
        }}
      >
        Resume
      </button>

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,

          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap-reverse",
        }}
      >
        <div
          style={{
            paddingLeft: "0.625em",
            paddingRight: "0.625em",
            paddingBottom: "0.625em",
            alignSelf: "flex-start",
            opacity: 0.5,
          }}
        >
          made by{" "}
          <a href="https://calvin.sh" style={{ color: "currentcolor" }}>
            calvin
          </a>
          . got a bug or feature request? let me know!
        </div>
        <div
          className="keybinds"
          style={{
            paddingLeft: "0.625em",
            paddingRight: "0.625em",
            paddingBottom: "0.625em",
          }}
        >
          <div onClick={onUpPress}>
            <kbd>↑</kbd> +10s
          </div>
          <div onClick={onDownPress}>
            <kbd>↓</kbd> −10s
          </div>
          <div onClick={onDPress}>
            <kbd>D</kbd> to ding
          </div>
          <div onClick={onFPress}>
            <kbd>F</kbd> to toggle fullscreen
          </div>
          <div onClick={onSpacePress}>
            <kbd>space</kbd> to pause and reset
          </div>
        </div>
      </div>
    </div>
  );
}
