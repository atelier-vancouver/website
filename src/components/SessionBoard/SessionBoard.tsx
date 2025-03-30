import { useEffect, useState, type ReactNode } from "react";
import showdown from "showdown";
import {
  createEnumParam,
  NumberParam,
  QueryParamProvider,
  StringParam,
  useQueryParam,
  withDefault,
} from "use-query-params";
import { WindowHistoryAdapter } from "use-query-params/adapters/window";
import logo from "../../assets/images/session-board/logo.svg?url";
import { useSize } from "../../hooks/useSize.ts";
import { QotdGenerator } from "./QotdGenerator.tsx";
import "./SessionBoard.scss";
import { TimeText } from "./TimeText.tsx";

export function SessionBoard(props: Parameters<typeof SessionBoardContent>[0]) {
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
    if (screenVisible) {
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
  }, [screenVisible]);

  return (
    <QueryParamProvider
      adapter={WindowHistoryAdapter}
      options={{ removeDefaultsFromUrl: true }}
    >
      <SessionBoardContent {...props} />
    </QueryParamProvider>
  );
}

function SessionBoardContent({
  grain,
  light,
}: {
  grain?: ReactNode;
  light?: ReactNode;
}) {
  const [topLeftText, setTopLeftText] = useQueryParam(
    "topLeft",
    withDefault(StringParam, ":time:")
  );
  const [topRightText, setTopRightText] = useQueryParam(
    "topRight",
    withDefault(StringParam, "")
  );
  const [bottomLeftText, setBottomLeftText] = useQueryParam(
    "bottomLeft",
    withDefault(StringParam, "")
  );
  const [bottomRightText, setBottomRightText] = useQueryParam(
    "bottomRight",
    withDefault(StringParam, "")
  );

  const [mainContentState, setMainContentState] = useQueryParam(
    "mainContent",
    withDefault(createEnumParam(["QOTD", "timer"]), "QOTD")
  );
  const [qotd, setQotd] = useQueryParam("qotd", withDefault(StringParam, ""));

  const [countdownTitle, setCountdownTitle] = useQueryParam(
    "countdownTitle",
    withDefault(StringParam, "Break Starts")
  );
  const [countdownToTime, setCountdownToTime] = useQueryParam(
    "countdownToTime",
    withDefault(StringParam, "13:20")
  );

  const [leftNotes, setLeftNotes] = useQueryParam(
    "leftNotes",
    withDefault(StringParam, "")
  );
  const [leftNotesSize, setLeftNotesSize] = useQueryParam(
    "leftNotesSize",
    withDefault(NumberParam, 3)
  );
  const [rightNotes, setRightNotes] = useQueryParam(
    "rightNotes",
    withDefault(StringParam, "")
  );
  const [rightNotesSize, setRightNotesSize] = useQueryParam(
    "rightNotesSize",
    withDefault(NumberParam, 3)
  );

  const converter = new showdown.Converter();
  const leftNotesHtml = converter.makeHtml(leftNotes);
  const rightNotesHtml = converter.makeHtml(rightNotes);

  return (
    <div className="session-board">
      <div className="session-board-content">
        <Lines />

        <Pill position="top-left" text={topLeftText} />
        <Pill position="top-right" text={topRightText} />
        <Pill position="bottom-left" text={bottomLeftText} />
        <Pill position="bottom-right" text={bottomRightText} />

        <div className="logo-container">
          <div className="logo-wrapper">
            <img className="logo" src={logo} alt="Atelier" />
          </div>
        </div>

        <div className="grain-container">{grain}</div>
        <div className="light-container">{light}</div>

        <div className="main-content">
          {mainContentState === "QOTD" ? (
            <div className="qotd">
              <h1>QUESTION OF THE DAY</h1>
              <p>{qotd}</p>
            </div>
          ) : (
            <div className="timer">
              <h1>{countdownTitle}</h1>
              <div className="countdown">
                <span className="tnum">
                  {Number(countdownToTime.split(":")[0]) % 12}
                  <span>:</span>
                  {countdownToTime.split(":")[1]}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="notes">
          <div
            className={`left size-${leftNotesSize}`}
            dangerouslySetInnerHTML={{ __html: leftNotesHtml }}
          />
          <div
            className={`right size-${rightNotesSize}`}
            dangerouslySetInnerHTML={{ __html: rightNotesHtml }}
          />
        </div>
      </div>
      <div className="session-board-config gaps">
        <details>
          <summary>content:</summary>
          <div className="content-config gaps">
            <div>
              type:
              <select
                value={mainContentState}
                onChange={(e) => {
                  setMainContentState(e.target.value);
                }}
              >
                <option value="QOTD">QOTD</option>
                <option value="timer">timer</option>
              </select>
            </div>
            <details>
              <summary>QOTD:</summary>
              <div className="gaps">
                <div>
                  QOTD:
                  <div>
                    <textarea
                      value={qotd}
                      onChange={(e) => setQotd(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  QOTD suggestions:
                  <QotdGenerator
                    onQuestionSelect={(question) => {
                      setQotd(question);
                    }}
                  />
                </div>
              </div>
            </details>
            <details>
              <summary>Timer:</summary>
              <div className="gaps">
                <div>
                  title:
                  <div>
                    <textarea
                      value={countdownTitle}
                      onChange={(e) => setCountdownTitle(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  countdown to:
                  <input
                    type="time"
                    value={countdownToTime}
                    onChange={(e) => setCountdownToTime(e.target.value)}
                  />
                </div>
              </div>
            </details>
          </div>
        </details>
        <details>
          <summary>notes:</summary>
          <div className="notes-config">
            <div>
              left:
              <div>
                <textarea
                  value={leftNotes}
                  onChange={(e) => setLeftNotes(e.target.value)}
                />
              </div>
              <div>
                size:
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={leftNotesSize}
                  onChange={(e) => {
                    setLeftNotesSize(parseInt(e.target.value));
                  }}
                />
              </div>
            </div>
            <div>
              right:
              <div>
                <textarea
                  value={rightNotes}
                  onChange={(e) => setRightNotes(e.target.value)}
                />
              </div>
              <div>
                size:
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={rightNotesSize}
                  onChange={(e) => {
                    setRightNotesSize(parseInt(e.target.value));
                  }}
                />
              </div>
            </div>
          </div>
        </details>
        <details>
          <summary>pills:</summary>
          <div className="pill-config">
            <input
              className="top left"
              value={topLeftText}
              onChange={(e) => setTopLeftText(e.target.value)}
            />
            <input
              className="top right"
              value={topRightText}
              onChange={(e) => setTopRightText(e.target.value)}
            />
            <input
              className="bottom left"
              value={bottomLeftText}
              onChange={(e) => setBottomLeftText(e.target.value)}
            />
            <input
              className="bottom right"
              value={bottomRightText}
              onChange={(e) => setBottomRightText(e.target.value)}
            />
          </div>
        </details>
      </div>
    </div>
  );
}

// function CountDownText({ countdownTo }: { countdownTo: string }) {
//   const [time, setTime] = useState<string>("00:00");

//   useEffect(() => {
//     function updateTime() {
//       const countdownToHour = parseInt(countdownTo.split(":")[0]);
//       const countdownToMinute = parseInt(countdownTo.split(":")[1]);

//       const countdownToDate = new Date();
//       countdownToDate.setHours(countdownToHour);
//       countdownToDate.setMinutes(countdownToMinute);
//       countdownToDate.setSeconds(0);
//       countdownToDate.setMilliseconds(0);

//       const now = new Date();
//       const diff = countdownToDate.getTime() - now.getTime();
//       const absDiff = Math.abs(diff);

//       const hours = Math.floor(absDiff / (1000 * 60 * 60));
//       const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
//       const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

//       let timeString = diff < 0 ? "-" : "";
//       setTime(
//         new Intl.DurationFormat("en", { style: "short" }).format({
//           hours,
//           minutes,
//         })
//       );
//       // if (hours > 0) {
//       //   timeString += hours.toString().padStart(2, "0") + ":";
//       // }
//       // timeString += minutes.toString().padStart(2, "0") + ":";
//       // timeString += seconds.toString().padStart(2, "0");
//       // setTime(timeString);
//     }

//     // Update immediately
//     updateTime();

//     // Update every minute
//     const intervalId = setInterval(updateTime, 1000);

//     return () => clearInterval(intervalId);
//   }, [countdownTo]);

//   return <>{time}</>;
// }

function Pill({
  position,
  text,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  text: string;
}) {
  if (!text) return null;

  return (
    <div className={`pill ${position.split("-").join(" ")}`}>
      {text === ":time:" ? (
        <span className="tnum">
          <TimeText />
        </span>
      ) : (
        text
      )}
    </div>
  );
}

function Lines() {
  const { ref, size } = useSize();

  return (
    <div ref={ref} className="lines-container">
      {size && (
        <svg
          viewBox={`0 0 ${size.width} ${size.height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x={0}
            y={0}
            width={size.width}
            height={size.height}
            fill="none"
            stroke="#262626"
            strokeOpacity="0.5"
            strokeWidth={3}
            strokeDasharray={size.width / 500}
          />
        </svg>
      )}
    </div>
  );
}
