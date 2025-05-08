import { useEffect, useRef, useState, type ReactNode } from "react";
import showdown from "showdown";
import {
  BooleanParam,
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
  useEffect(() => {
    let screenLock: WakeLockSentinel | undefined;
    let retryInterval: ReturnType<typeof setInterval>;

    (async () => {
      try {
        retryInterval = setInterval(async () => {
          if (screenLock && !screenLock.released) {
            return;
          }
          if (document.hidden) {
            return;
          }
          try {
            screenLock = await navigator.wakeLock.request("screen");
          } catch (error) {}
        }, 10_000); // every 10s
      } catch (error) {}
    })();

    return () => {
      screenLock?.release().then(() => {
        clearInterval(retryInterval);
      });
    };
  });

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
    withDefault(createEnumParam(["QOTD", "timer", "text"]), "QOTD")
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

  const [centerText, setCenterText] = useQueryParam(
    "centerText",
    withDefault(StringParam, "")
  );

  const [topLeftNotes, setTopLeftNotes] = useQueryParam(
    "topLeftNotes",
    withDefault(StringParam, "")
  );
  const [topLeftNotesSize, setTopLeftNotesSize] = useQueryParam(
    "topLeftNotesSize",
    withDefault(NumberParam, 3)
  );
  const [showTopLeftNotes, setShowTopLeftNotes] = useQueryParam(
    "showTopLeftNotes",
    withDefault(BooleanParam, true)
  );
  const [topRightNotes, setTopRightNotes] = useQueryParam(
    "topRightNotes",
    withDefault(StringParam, "")
  );
  const [topRightNotesSize, setTopRightNotesSize] = useQueryParam(
    "topRightNotesSize",
    withDefault(NumberParam, 3)
  );
  const [showTopRightNotes, setShowTopRightNotes] = useQueryParam(
    "showTopRightNotes",
    withDefault(BooleanParam, true)
  );
  const [bottomLeftNotes, setBottomLeftNotes] = useQueryParam(
    "bottomLeftNotes",
    withDefault(StringParam, "")
  );
  const [bottomLeftNotesSize, setBottomLeftNotesSize] = useQueryParam(
    "bottomLeftNotesSize",
    withDefault(NumberParam, 3)
  );
  const [showBottomLeftNotes, setShowBottomLeftNotes] = useQueryParam(
    "showBottomLeftNotes",
    withDefault(BooleanParam, true)
  );
  const [bottomRightNotes, setBottomRightNotes] = useQueryParam(
    "bottomRightNotes",
    withDefault(StringParam, "")
  );
  const [bottomRightNotesSize, setBottomRightNotesSize] = useQueryParam(
    "bottomRightNotesSize",
    withDefault(NumberParam, 3)
  );
  const [showBottomRightNotes, setShowBottomRightNotes] = useQueryParam(
    "showBottomRightNotes",
    withDefault(BooleanParam, true)
  );

  const [isCursorVisible, setIsCursorVisible] = useState(true);
  const cursorTimeout = useRef<number | null>(null);
  const cursorDelay = 5000;

  const converter = new showdown.Converter();
  const topLeftNotesHtml = converter.makeHtml(topLeftNotes);
  const topRightNotesHtml = converter.makeHtml(topRightNotes);
  const bottomLeftNotesHtml = converter.makeHtml(bottomLeftNotes);
  const bottomRightNotesHtml = converter.makeHtml(bottomRightNotes);

  return (
    <div className="session-board">
      <div
        className={`session-board-content ${isCursorVisible ? "" : "no-cursor"}`}
        onPointerMove={() => {
          if (cursorTimeout.current) {
            clearTimeout(cursorTimeout.current);
          }
          setIsCursorVisible(true);
          cursorTimeout.current = window.setTimeout(() => {
            setIsCursorVisible(false);
          }, cursorDelay);
        }}
      >
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
          ) : mainContentState === "timer" ? (
            <div className="timer">
              <h1>{countdownTitle}</h1>
              <div className="countdown">
                <span className="tnum">
                  <CountDownText countdownTo={countdownToTime} />
                </span>
              </div>
              <div className="countdown-to">
                at&nbsp;
                <span className="tnum">
                  {Number(countdownToTime.split(":")[0]) % 12}:
                  {countdownToTime.split(":")[1]}
                </span>
              </div>
            </div>
          ) : (
            <div className="text">
              <p>{centerText}</p>
            </div>
          )}
        </div>

        <div className="notes">
          {showTopLeftNotes && (
            <div
              className={`top left size-${topLeftNotesSize}`}
              dangerouslySetInnerHTML={{ __html: topLeftNotesHtml }}
            />
          )}
          {showTopRightNotes && (
            <div
              className={`top right size-${topRightNotesSize}`}
              dangerouslySetInnerHTML={{ __html: topRightNotesHtml }}
            />
          )}
          {showBottomLeftNotes && (
            <div
              className={`bottom left size-${bottomLeftNotesSize}`}
              dangerouslySetInnerHTML={{ __html: bottomLeftNotesHtml }}
            />
          )}
          {showBottomRightNotes && (
            <div
              className={`bottom right size-${bottomRightNotesSize}`}
              dangerouslySetInnerHTML={{ __html: bottomRightNotesHtml }}
            />
          )}
        </div>
      </div>
      <div className="session-board-config gaps">
        <div>
          <button
            onClick={() => {
              if (document.fullscreenElement) {
                document.exitFullscreen();
              } else {
                document.documentElement.requestFullscreen();
              }
            }}
          >
            fullscreen
          </button>
        </div>
        <div>presets:</div>
        <div>
          UBC:
          <a href="/session?topRight=UBC&qotd=%5BTODO%5D&countdownToTime=14%3A21&countdownTitle=Break+starts+in&bottomRightNotes=Welcome+to+Atelier+❤%EF%B8%8F&bottomLeftNotesSize=2&bottomLeftNotes=%23+Hosts%0A%0A1.+Rae%0A1.+Clo%0A1.+Iris%0A1.+Jen%0A1.+Stella&qotdLocation=UBC%2C+Vancouver%2C+BC%2C+Canada">
            <button>welcome</button>
          </a>
          <a
            href={toChangedParam({
              bottomRightNotes: `# Intro
1. Name
1. What are you working on?
1. Question of the day`,
              bottomRightNotesSize: "2",
            })}
          >
            <button>intro</button>
          </a>
          <a
            href={toChangedParam({
              bottomRightNotes: `Talk to a host for demos (short 2-min max show and tell)`,
              mainContent: "timer",
              countdownToTime:
                currentTimePlusMinutesRoundedToNearest5Minutes(70),
              countdownTitle: "Break Starts",
            })}
          >
            <button>work-session1</button>
          </a>
          <a
            href={toChangedParam({
              mainContent: "timer",
              countdownToTime:
                currentTimePlusMinutesRoundedToNearest5Minutes(15),
              countdownTitle: "Break Ends",
            })}
          >
            <button>break</button>
          </a>
          <a
            href={toChangedParam({
              mainContent: "timer",
              countdownToTime:
                currentTimePlusMinutesRoundedToNearest5Minutes(70),
              countdownTitle: "Demos Start",
            })}
          >
            <button>work-session2</button>
          </a>
          <a
            href={toChangedParam({
              mainContent: "text",
              centerText: "Gather around for demos!",
            })}
          >
            <button>demos</button>
          </a>
        </div>
        <div>
          Weeknights:
          <a href='session?topRight=V2+House&qotd=%5BTODO%5D&countdownToTime=14%3A21&countdownTitle=Break+starts+in&bottomRightNotes=Welcome+to+Atelier+Weeknights+❤%EF%B8%8F&bottomLeftNotesSize=2&bottomLeftNotes=%23+Hosts%0A%0A1.+Rae%0A1.+Vibhor%0A1.+Clo%0A1.+Chloe-Amelie%0A1.+Connell%0A1.+Stuti&topLeftNotes=%23+WIFI%0A%0ATELUS3176%0A%0AH46MdfvtvJK4%0A%0A%0A<img+style%3D"margin-top%3A+0.5ch"+src%3D"data%3Aimage%2Fsvg%2Bxml%2C%253Csvg+xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27+version%3D%271.1%27+viewBox%3D%270+0+37+37%27+stroke%3D%27none%27%253E%253Crect+width%3D%27100%2525%27+height%3D%27100%2525%27+fill%3D%27%2523FFF%27%2F%253E%253Cpath+d%3D%27M4%2C4h1v1h-1z+M5%2C4h1v1h-1z+M6%2C4h1v1h-1z+M7%2C4h1v1h-1z+M8%2C4h1v1h-1z+M9%2C4h1v1h-1z+M10%2C4h1v1h-1z+M12%2C4h1v1h-1z+M16%2C4h1v1h-1z+M18%2C4h1v1h-1z+M21%2C4h1v1h-1z+M23%2C4h1v1h-1z+M26%2C4h1v1h-1z+M27%2C4h1v1h-1z+M28%2C4h1v1h-1z+M29%2C4h1v1h-1z+M30%2C4h1v1h-1z+M31%2C4h1v1h-1z+M32%2C4h1v1h-1z+M4%2C5h1v1h-1z+M10%2C5h1v1h-1z+M12%2C5h1v1h-1z+M13%2C5h1v1h-1z+M20%2C5h1v1h-1z+M26%2C5h1v1h-1z+M32%2C5h1v1h-1z+M4%2C6h1v1h-1z+M6%2C6h1v1h-1z+M7%2C6h1v1h-1z+M8%2C6h1v1h-1z+M10%2C6h1v1h-1z+M14%2C6h1v1h-1z+M17%2C6h1v1h-1z+M19%2C6h1v1h-1z+M20%2C6h1v1h-1z+M22%2C6h1v1h-1z+M23%2C6h1v1h-1z+M26%2C6h1v1h-1z+M28%2C6h1v1h-1z+M29%2C6h1v1h-1z+M30%2C6h1v1h-1z+M32%2C6h1v1h-1z+M4%2C7h1v1h-1z+M6%2C7h1v1h-1z+M7%2C7h1v1h-1z+M8%2C7h1v1h-1z+M10%2C7h1v1h-1z+M12%2C7h1v1h-1z+M13%2C7h1v1h-1z+M14%2C7h1v1h-1z+M15%2C7h1v1h-1z+M17%2C7h1v1h-1z+M26%2C7h1v1h-1z+M28%2C7h1v1h-1z+M29%2C7h1v1h-1z+M30%2C7h1v1h-1z+M32%2C7h1v1h-1z+M4%2C8h1v1h-1z+M6%2C8h1v1h-1z+M7%2C8h1v1h-1z+M8%2C8h1v1h-1z+M10%2C8h1v1h-1z+M13%2C8h1v1h-1z+M14%2C8h1v1h-1z+M17%2C8h1v1h-1z+M20%2C8h1v1h-1z+M21%2C8h1v1h-1z+M22%2C8h1v1h-1z+M26%2C8h1v1h-1z+M28%2C8h1v1h-1z+M29%2C8h1v1h-1z+M30%2C8h1v1h-1z+M32%2C8h1v1h-1z+M4%2C9h1v1h-1z+M10%2C9h1v1h-1z+M13%2C9h1v1h-1z+M16%2C9h1v1h-1z+M20%2C9h1v1h-1z+M23%2C9h1v1h-1z+M26%2C9h1v1h-1z+M32%2C9h1v1h-1z+M4%2C10h1v1h-1z+M5%2C10h1v1h-1z+M6%2C10h1v1h-1z+M7%2C10h1v1h-1z+M8%2C10h1v1h-1z+M9%2C10h1v1h-1z+M10%2C10h1v1h-1z+M12%2C10h1v1h-1z+M14%2C10h1v1h-1z+M16%2C10h1v1h-1z+M18%2C10h1v1h-1z+M20%2C10h1v1h-1z+M22%2C10h1v1h-1z+M24%2C10h1v1h-1z+M26%2C10h1v1h-1z+M27%2C10h1v1h-1z+M28%2C10h1v1h-1z+M29%2C10h1v1h-1z+M30%2C10h1v1h-1z+M31%2C10h1v1h-1z+M32%2C10h1v1h-1z+M12%2C11h1v1h-1z+M16%2C11h1v1h-1z+M19%2C11h1v1h-1z+M21%2C11h1v1h-1z+M24%2C11h1v1h-1z+M4%2C12h1v1h-1z+M6%2C12h1v1h-1z+M7%2C12h1v1h-1z+M9%2C12h1v1h-1z+M10%2C12h1v1h-1z+M11%2C12h1v1h-1z+M15%2C12h1v1h-1z+M16%2C12h1v1h-1z+M19%2C12h1v1h-1z+M20%2C12h1v1h-1z+M21%2C12h1v1h-1z+M23%2C12h1v1h-1z+M24%2C12h1v1h-1z+M26%2C12h1v1h-1z+M29%2C12h1v1h-1z+M31%2C12h1v1h-1z+M32%2C12h1v1h-1z+M8%2C13h1v1h-1z+M9%2C13h1v1h-1z+M13%2C13h1v1h-1z+M14%2C13h1v1h-1z+M15%2C13h1v1h-1z+M17%2C13h1v1h-1z+M18%2C13h1v1h-1z+M19%2C13h1v1h-1z+M20%2C13h1v1h-1z+M21%2C13h1v1h-1z+M24%2C13h1v1h-1z+M26%2C13h1v1h-1z+M28%2C13h1v1h-1z+M30%2C13h1v1h-1z+M31%2C13h1v1h-1z+M4%2C14h1v1h-1z+M6%2C14h1v1h-1z+M10%2C14h1v1h-1z+M12%2C14h1v1h-1z+M14%2C14h1v1h-1z+M15%2C14h1v1h-1z+M16%2C14h1v1h-1z+M17%2C14h1v1h-1z+M18%2C14h1v1h-1z+M28%2C14h1v1h-1z+M29%2C14h1v1h-1z+M30%2C14h1v1h-1z+M31%2C14h1v1h-1z+M9%2C15h1v1h-1z+M13%2C15h1v1h-1z+M16%2C15h1v1h-1z+M17%2C15h1v1h-1z+M18%2C15h1v1h-1z+M19%2C15h1v1h-1z+M24%2C15h1v1h-1z+M25%2C15h1v1h-1z+M29%2C15h1v1h-1z+M6%2C16h1v1h-1z+M7%2C16h1v1h-1z+M9%2C16h1v1h-1z+M10%2C16h1v1h-1z+M12%2C16h1v1h-1z+M19%2C16h1v1h-1z+M20%2C16h1v1h-1z+M24%2C16h1v1h-1z+M25%2C16h1v1h-1z+M27%2C16h1v1h-1z+M28%2C16h1v1h-1z+M29%2C16h1v1h-1z+M30%2C16h1v1h-1z+M4%2C17h1v1h-1z+M6%2C17h1v1h-1z+M7%2C17h1v1h-1z+M9%2C17h1v1h-1z+M11%2C17h1v1h-1z+M13%2C17h1v1h-1z+M14%2C17h1v1h-1z+M17%2C17h1v1h-1z+M18%2C17h1v1h-1z+M19%2C17h1v1h-1z+M20%2C17h1v1h-1z+M25%2C17h1v1h-1z+M26%2C17h1v1h-1z+M4%2C18h1v1h-1z+M6%2C18h1v1h-1z+M7%2C18h1v1h-1z+M10%2C18h1v1h-1z+M11%2C18h1v1h-1z+M12%2C18h1v1h-1z+M13%2C18h1v1h-1z+M14%2C18h1v1h-1z+M15%2C18h1v1h-1z+M16%2C18h1v1h-1z+M18%2C18h1v1h-1z+M20%2C18h1v1h-1z+M23%2C18h1v1h-1z+M26%2C18h1v1h-1z+M27%2C18h1v1h-1z+M29%2C18h1v1h-1z+M30%2C18h1v1h-1z+M31%2C18h1v1h-1z+M32%2C18h1v1h-1z+M5%2C19h1v1h-1z+M6%2C19h1v1h-1z+M7%2C19h1v1h-1z+M9%2C19h1v1h-1z+M13%2C19h1v1h-1z+M17%2C19h1v1h-1z+M19%2C19h1v1h-1z+M20%2C19h1v1h-1z+M22%2C19h1v1h-1z+M23%2C19h1v1h-1z+M27%2C19h1v1h-1z+M28%2C19h1v1h-1z+M29%2C19h1v1h-1z+M10%2C20h1v1h-1z+M11%2C20h1v1h-1z+M13%2C20h1v1h-1z+M14%2C20h1v1h-1z+M20%2C20h1v1h-1z+M23%2C20h1v1h-1z+M29%2C20h1v1h-1z+M30%2C20h1v1h-1z+M32%2C20h1v1h-1z+M5%2C21h1v1h-1z+M7%2C21h1v1h-1z+M8%2C21h1v1h-1z+M11%2C21h1v1h-1z+M14%2C21h1v1h-1z+M15%2C21h1v1h-1z+M17%2C21h1v1h-1z+M19%2C21h1v1h-1z+M22%2C21h1v1h-1z+M25%2C21h1v1h-1z+M27%2C21h1v1h-1z+M29%2C21h1v1h-1z+M32%2C21h1v1h-1z+M4%2C22h1v1h-1z+M6%2C22h1v1h-1z+M7%2C22h1v1h-1z+M8%2C22h1v1h-1z+M9%2C22h1v1h-1z+M10%2C22h1v1h-1z+M11%2C22h1v1h-1z+M16%2C22h1v1h-1z+M19%2C22h1v1h-1z+M28%2C22h1v1h-1z+M29%2C22h1v1h-1z+M30%2C22h1v1h-1z+M7%2C23h1v1h-1z+M8%2C23h1v1h-1z+M9%2C23h1v1h-1z+M11%2C23h1v1h-1z+M12%2C23h1v1h-1z+M13%2C23h1v1h-1z+M15%2C23h1v1h-1z+M16%2C23h1v1h-1z+M19%2C23h1v1h-1z+M20%2C23h1v1h-1z+M21%2C23h1v1h-1z+M25%2C23h1v1h-1z+M26%2C23h1v1h-1z+M28%2C23h1v1h-1z+M30%2C23h1v1h-1z+M31%2C23h1v1h-1z+M32%2C23h1v1h-1z+M5%2C24h1v1h-1z+M8%2C24h1v1h-1z+M10%2C24h1v1h-1z+M14%2C24h1v1h-1z+M15%2C24h1v1h-1z+M17%2C24h1v1h-1z+M21%2C24h1v1h-1z+M23%2C24h1v1h-1z+M24%2C24h1v1h-1z+M25%2C24h1v1h-1z+M26%2C24h1v1h-1z+M27%2C24h1v1h-1z+M28%2C24h1v1h-1z+M30%2C24h1v1h-1z+M31%2C24h1v1h-1z+M32%2C24h1v1h-1z+M12%2C25h1v1h-1z+M13%2C25h1v1h-1z+M14%2C25h1v1h-1z+M17%2C25h1v1h-1z+M18%2C25h1v1h-1z+M20%2C25h1v1h-1z+M23%2C25h1v1h-1z+M24%2C25h1v1h-1z+M28%2C25h1v1h-1z+M30%2C25h1v1h-1z+M4%2C26h1v1h-1z+M5%2C26h1v1h-1z+M6%2C26h1v1h-1z+M7%2C26h1v1h-1z+M8%2C26h1v1h-1z+M9%2C26h1v1h-1z+M10%2C26h1v1h-1z+M12%2C26h1v1h-1z+M13%2C26h1v1h-1z+M14%2C26h1v1h-1z+M17%2C26h1v1h-1z+M22%2C26h1v1h-1z+M24%2C26h1v1h-1z+M26%2C26h1v1h-1z+M28%2C26h1v1h-1z+M31%2C26h1v1h-1z+M4%2C27h1v1h-1z+M10%2C27h1v1h-1z+M12%2C27h1v1h-1z+M13%2C27h1v1h-1z+M14%2C27h1v1h-1z+M15%2C27h1v1h-1z+M19%2C27h1v1h-1z+M24%2C27h1v1h-1z+M28%2C27h1v1h-1z+M31%2C27h1v1h-1z+M4%2C28h1v1h-1z+M6%2C28h1v1h-1z+M7%2C28h1v1h-1z+M8%2C28h1v1h-1z+M10%2C28h1v1h-1z+M13%2C28h1v1h-1z+M14%2C28h1v1h-1z+M15%2C28h1v1h-1z+M16%2C28h1v1h-1z+M18%2C28h1v1h-1z+M19%2C28h1v1h-1z+M24%2C28h1v1h-1z+M25%2C28h1v1h-1z+M26%2C28h1v1h-1z+M27%2C28h1v1h-1z+M28%2C28h1v1h-1z+M29%2C28h1v1h-1z+M4%2C29h1v1h-1z+M6%2C29h1v1h-1z+M7%2C29h1v1h-1z+M8%2C29h1v1h-1z+M10%2C29h1v1h-1z+M12%2C29h1v1h-1z+M16%2C29h1v1h-1z+M18%2C29h1v1h-1z+M19%2C29h1v1h-1z+M20%2C29h1v1h-1z+M23%2C29h1v1h-1z+M27%2C29h1v1h-1z+M29%2C29h1v1h-1z+M30%2C29h1v1h-1z+M32%2C29h1v1h-1z+M4%2C30h1v1h-1z+M6%2C30h1v1h-1z+M7%2C30h1v1h-1z+M8%2C30h1v1h-1z+M10%2C30h1v1h-1z+M12%2C30h1v1h-1z+M15%2C30h1v1h-1z+M17%2C30h1v1h-1z+M18%2C30h1v1h-1z+M20%2C30h1v1h-1z+M22%2C30h1v1h-1z+M23%2C30h1v1h-1z+M24%2C30h1v1h-1z+M25%2C30h1v1h-1z+M27%2C30h1v1h-1z+M29%2C30h1v1h-1z+M32%2C30h1v1h-1z+M4%2C31h1v1h-1z+M10%2C31h1v1h-1z+M14%2C31h1v1h-1z+M16%2C31h1v1h-1z+M18%2C31h1v1h-1z+M19%2C31h1v1h-1z+M20%2C31h1v1h-1z+M23%2C31h1v1h-1z+M24%2C31h1v1h-1z+M27%2C31h1v1h-1z+M28%2C31h1v1h-1z+M29%2C31h1v1h-1z+M31%2C31h1v1h-1z+M4%2C32h1v1h-1z+M5%2C32h1v1h-1z+M6%2C32h1v1h-1z+M7%2C32h1v1h-1z+M8%2C32h1v1h-1z+M9%2C32h1v1h-1z+M10%2C32h1v1h-1z+M12%2C32h1v1h-1z+M13%2C32h1v1h-1z+M14%2C32h1v1h-1z+M15%2C32h1v1h-1z+M17%2C32h1v1h-1z+M18%2C32h1v1h-1z+M22%2C32h1v1h-1z+M24%2C32h1v1h-1z+M26%2C32h1v1h-1z+M30%2C32h1v1h-1z+M31%2C32h1v1h-1z%27+fill%3D%27%2523000%27%2F%253E%253C%2Fsvg%253E"+%2F>&topLeftNotesSize=1'>
            <button>welcome</button>
          </a>
          <a
            href={toChangedParam({
              bottomRightNotes: `# Intro
1. Name
1. What are you working on?
1. Question of the day`,
              bottomRightNotesSize: "2",
            })}
          >
            <button>intro</button>
          </a>
          <a
            href={toChangedParam({
              bottomRightNotes: `Talk to a host for demos (short 2-min max show and tell)`,
              mainContent: "timer",
              countdownToTime:
                currentTimePlusMinutesRoundedToNearest5Minutes(50),
              countdownTitle: "Break Starts",
            })}
          >
            <button>work-session1</button>
          </a>
          <a
            href={toChangedParam({
              mainContent: "timer",
              countdownToTime:
                currentTimePlusMinutesRoundedToNearest5Minutes(15),
              countdownTitle: "Break Ends",
            })}
          >
            <button>break</button>
          </a>
          <a
            href={toChangedParam({
              mainContent: "timer",
              countdownToTime:
                currentTimePlusMinutesRoundedToNearest5Minutes(50),
              countdownTitle: "Demos Start",
            })}
          >
            <button>work-session2</button>
          </a>
          <a
            href={toChangedParam({
              mainContent: "text",
              centerText: "Gather around for demos!",
            })}
          >
            <button>demos</button>
          </a>
        </div>
        <details>
          <summary>content:</summary>
          <div className="content-config gaps">
            <div>
              mode:
              <label>
                <input
                  type="radio"
                  value="QOTD"
                  checked={mainContentState === "QOTD"}
                  onChange={(e) => {
                    setMainContentState(e.target.value);
                  }}
                />
                QOTD
              </label>
              <label>
                <input
                  type="radio"
                  value="timer"
                  checked={mainContentState === "timer"}
                  onChange={(e) => {
                    setMainContentState(e.target.value);
                  }}
                />
                timer
              </label>
              <label>
                <input
                  type="radio"
                  value="text"
                  checked={mainContentState === "text"}
                  onChange={(e) => {
                    setMainContentState(e.target.value);
                  }}
                />
                text
              </label>
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
            <details>
              <summary>text:</summary>
              <div>
                text:
                <div>
                  <textarea
                    value={centerText}
                    onChange={(e) => setCenterText(e.target.value)}
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
              top left:
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={showTopLeftNotes}
                    onChange={(e) => setShowTopLeftNotes(e.target.checked)}
                  />
                  show
                </label>
              </div>
              <div>
                <textarea
                  value={topLeftNotes}
                  onChange={(e) => setTopLeftNotes(e.target.value)}
                />
              </div>
              <div>
                size:
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={topLeftNotesSize}
                  onChange={(e) => {
                    setTopLeftNotesSize(parseInt(e.target.value));
                  }}
                />
              </div>
            </div>
            <div>
              top right:
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={showTopRightNotes}
                    onChange={(e) => setShowTopRightNotes(e.target.checked)}
                  />
                  show
                </label>
              </div>
              <div>
                <textarea
                  value={topRightNotes}
                  onChange={(e) => setTopRightNotes(e.target.value)}
                />
              </div>
              <div>
                size:
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={topRightNotesSize}
                  onChange={(e) => {
                    setTopRightNotesSize(parseInt(e.target.value));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="notes-config">
            <div>
              bottom left:
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={showBottomLeftNotes}
                    onChange={(e) => setShowBottomLeftNotes(e.target.checked)}
                  />
                  show
                </label>
              </div>
              <div>
                <textarea
                  value={bottomLeftNotes}
                  onChange={(e) => setBottomLeftNotes(e.target.value)}
                />
              </div>
              <div>
                size:
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={bottomLeftNotesSize}
                  onChange={(e) => {
                    setBottomLeftNotesSize(parseInt(e.target.value));
                  }}
                />
              </div>
            </div>
            <div>
              bottom right:
              <div>
                <label>
                  <input
                    type="checkbox"
                    checked={showBottomRightNotes}
                    onChange={(e) => setShowBottomRightNotes(e.target.checked)}
                  />
                  show
                </label>
              </div>
              <div>
                <textarea
                  value={bottomRightNotes}
                  onChange={(e) => setBottomRightNotes(e.target.value)}
                />
              </div>
              <div>
                size:
                <input
                  type="range"
                  min={1}
                  max={3}
                  value={bottomRightNotesSize}
                  onChange={(e) => {
                    setBottomRightNotesSize(parseInt(e.target.value));
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

/**
 *
 * @param {number} minute The number of minutes to add to the current time
 *
 * @return {string} The current time + minute rounded to the nearest 5 minute in the format HH:MM
 */
function currentTimePlusMinutesRoundedToNearest5Minutes(
  minute: number
): string {
  const now = new Date();
  const currentMinutes = now.getMinutes();
  const roundedMinutes = Math.round(currentMinutes / 5) * 5;
  now.setMinutes(roundedMinutes + minute);

  const hours = now.getHours();
  const minutes = now.getMinutes();

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
}

function CountDownText({ countdownTo }: { countdownTo: string }) {
  const [time, setTime] = useState<string>("00:00");

  useEffect(() => {
    function updateTime() {
      const countdownToHour = parseInt(countdownTo.split(":")[0]);
      const countdownToMinute = parseInt(countdownTo.split(":")[1]);

      const countdownToDate = new Date();
      countdownToDate.setHours(countdownToHour);
      countdownToDate.setMinutes(countdownToMinute);
      countdownToDate.setSeconds(0);
      countdownToDate.setMilliseconds(0);

      const now = new Date();
      const diff = countdownToDate.getTime() - now.getTime();
      const absDiff = Math.abs(diff);

      const hours = Math.floor(absDiff / (1000 * 60 * 60));
      const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

      let timeString = diff < 0 ? "-" : "";
      // setTime(
      //   new Intl.DurationFormat("en", { style: "short" }).format({
      //     hours,
      //     minutes,
      //   })
      // );
      if (hours > 0) {
        timeString += hours.toString().padStart(2, "0") + ":";
      }
      timeString += minutes.toString().padStart(2, "0") + ":";
      timeString += seconds.toString().padStart(2, "0");
      setTime(timeString);
    }

    // Update immediately
    updateTime();

    // Update every minute
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, [countdownTo]);

  return <>{time}</>;
}

function toChangedParam(p: Record<string, string>): string {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  Object.entries(p).forEach(([key, value]) => {
    params.set(key, value);
  });
  url.search = params.toString();
  return url.toString();
}

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
