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
  const presets: { name: string; stages: { name: string; link: string }[] }[] =
    [
      {
        name: "UBC",
        stages: [
          {
            name: "welcome",
            link: linkWithParams({
              preset: "UBC",
              presetStage: "welcome",

              topRight: "UBC",
              qotd: "[TODO]",
              bottomRightNotes: "Welcome to Atelier ❤️",
              bottomLeftNotesSize: "2",
              bottomLeftNotes: `# Hosts\n\n${[
                "Calvin",
                "Rae",
                "Iris",
                "Jen",
                "Stella",
                "Ananya",
                "Clo",
              ].join("  \n")}`,
              qotdLocation: "UBC, Vancouver, BC, Canada",
            }),
          },
          {
            name: "intro",
            link: toChangedParam({
              preset: "UBC",
              presetStage: "intro",

              bottomRightNotes: `# Intro
1. Name
1. What are you working on?
1. Question of the day`,
              bottomRightNotesSize: "2",
            }),
          },
          {
            name: "work session1",
            link: toChangedParam({
              preset: "UBC",
              presetStage: "work session1",

              bottomRightNotes: `Talk to a host for demos (short 2-min max show and tell)`,
              mainContent: "timer",
              countdownToTime:
                currentTimePlusMinutesRoundedToNearest5Minutes(70),
              countdownTitle: "Break Starts",
            }),
          },
          {
            name: "break",
            link: toChangedParam({
              preset: "UBC",
              presetStage: "break",

              mainContent: "timer",
              countdownToTime:
                currentTimePlusMinutesRoundedToNearest5Minutes(15),
              countdownTitle: "Break Ends",
            }),
          },
          {
            name: "work session2",
            link: toChangedParam({
              preset: "UBC",
              presetStage: "work session2",

              mainContent: "timer",
              countdownToTime:
                currentTimePlusMinutesRoundedToNearest5Minutes(70),
              countdownTitle: "Demos Start",
            }),
          },
          {
            name: "demos",
            link: toChangedParam({
              preset: "UBC",
              presetStage: "demos",

              mainContent: "text",
              centerText: "Gather around for demos!",
            }),
          },
        ],
      },
      {
        name: "Weeknights",
        stages: [
          {
            name: "welcome",
            link: linkWithParams({
              preset: "Weeknights",
              presetStage: "welcome",

              topRight: "V2 House",
              qotd: "[TODO]",
              bottomRightNotes: "Welcome to Atelier Weeknights ❤️",
              bottomLeftNotesSize: "2",
              bottomLeftNotes: `# Hosts\n\n${[
                "Calvin",
                "Rae",
                "Vibhor",
                "Connell",
                "Chloe-Amelie",
                "Ananya",
                "Clo",
                "Scott",
              ].join("  \n")}`,
              topLeftNotes:
                "# WIFI\n\nTELUS3176\n\nH46MdfvtvJK4\n\n\n<img style=\"margin-top: 0.5ch\" src=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 37 37' stroke='none'%3E%3Crect width='100%25' height='100%25' fill='%23FFF'/%3E%3Cpath d='M4,4h1v1h-1z M5,4h1v1h-1z M6,4h1v1h-1z M7,4h1v1h-1z M8,4h1v1h-1z M9,4h1v1h-1z M10,4h1v1h-1z M12,4h1v1h-1z M16,4h1v1h-1z M18,4h1v1h-1z M21,4h1v1h-1z M23,4h1v1h-1z M26,4h1v1h-1z M27,4h1v1h-1z M28,4h1v1h-1z M29,4h1v1h-1z M30,4h1v1h-1z M31,4h1v1h-1z M32,4h1v1h-1z M4,5h1v1h-1z M10,5h1v1h-1z M12,5h1v1h-1z M13,5h1v1h-1z M20,5h1v1h-1z M26,5h1v1h-1z M32,5h1v1h-1z M4,6h1v1h-1z M6,6h1v1h-1z M7,6h1v1h-1z M8,6h1v1h-1z M10,6h1v1h-1z M14,6h1v1h-1z M17,6h1v1h-1z M19,6h1v1h-1z M20,6h1v1h-1z M22,6h1v1h-1z M23,6h1v1h-1z M26,6h1v1h-1z M28,6h1v1h-1z M29,6h1v1h-1z M30,6h1v1h-1z M32,6h1v1h-1z M4,7h1v1h-1z M6,7h1v1h-1z M7,7h1v1h-1z M8,7h1v1h-1z M10,7h1v1h-1z M12,7h1v1h-1z M13,7h1v1h-1z M14,7h1v1h-1z M15,7h1v1h-1z M17,7h1v1h-1z M26,7h1v1h-1z M28,7h1v1h-1z M29,7h1v1h-1z M30,7h1v1h-1z M32,7h1v1h-1z M4,8h1v1h-1z M6,8h1v1h-1z M7,8h1v1h-1z M8,8h1v1h-1z M10,8h1v1h-1z M13,8h1v1h-1z M14,8h1v1h-1z M17,8h1v1h-1z M20,8h1v1h-1z M21,8h1v1h-1z M22,8h1v1h-1z M26,8h1v1h-1z M28,8h1v1h-1z M29,8h1v1h-1z M30,8h1v1h-1z M32,8h1v1h-1z M4,9h1v1h-1z M10,9h1v1h-1z M13,9h1v1h-1z M16,9h1v1h-1z M20,9h1v1h-1z M23,9h1v1h-1z M26,9h1v1h-1z M32,9h1v1h-1z M4,10h1v1h-1z M5,10h1v1h-1z M6,10h1v1h-1z M7,10h1v1h-1z M8,10h1v1h-1z M9,10h1v1h-1z M10,10h1v1h-1z M12,10h1v1h-1z M14,10h1v1h-1z M16,10h1v1h-1z M18,10h1v1h-1z M20,10h1v1h-1z M22,10h1v1h-1z M24,10h1v1h-1z M26,10h1v1h-1z M27,10h1v1h-1z M28,10h1v1h-1z M29,10h1v1h-1z M30,10h1v1h-1z M31,10h1v1h-1z M32,10h1v1h-1z M12,11h1v1h-1z M16,11h1v1h-1z M19,11h1v1h-1z M21,11h1v1h-1z M24,11h1v1h-1z M4,12h1v1h-1z M6,12h1v1h-1z M7,12h1v1h-1z M9,12h1v1h-1z M10,12h1v1h-1z M11,12h1v1h-1z M15,12h1v1h-1z M16,12h1v1h-1z M19,12h1v1h-1z M20,12h1v1h-1z M21,12h1v1h-1z M23,12h1v1h-1z M24,12h1v1h-1z M26,12h1v1h-1z M29,12h1v1h-1z M31,12h1v1h-1z M32,12h1v1h-1z M8,13h1v1h-1z M9,13h1v1h-1z M13,13h1v1h-1z M14,13h1v1h-1z M15,13h1v1h-1z M17,13h1v1h-1z M18,13h1v1h-1z M19,13h1v1h-1z M20,13h1v1h-1z M21,13h1v1h-1z M24,13h1v1h-1z M26,13h1v1h-1z M28,13h1v1h-1z M30,13h1v1h-1z M31,13h1v1h-1z M4,14h1v1h-1z M6,14h1v1h-1z M10,14h1v1h-1z M12,14h1v1h-1z M14,14h1v1h-1z M15,14h1v1h-1z M16,14h1v1h-1z M17,14h1v1h-1z M18,14h1v1h-1z M28,14h1v1h-1z M29,14h1v1h-1z M30,14h1v1h-1z M31,14h1v1h-1z M9,15h1v1h-1z M13,15h1v1h-1z M16,15h1v1h-1z M17,15h1v1h-1z M18,15h1v1h-1z M19,15h1v1h-1z M24,15h1v1h-1z M25,15h1v1h-1z M29,15h1v1h-1z M6,16h1v1h-1z M7,16h1v1h-1z M9,16h1v1h-1z M10,16h1v1h-1z M12,16h1v1h-1z M19,16h1v1h-1z M20,16h1v1h-1z M24,16h1v1h-1z M25,16h1v1h-1z M27,16h1v1h-1z M28,16h1v1h-1z M29,16h1v1h-1z M30,16h1v1h-1z M4,17h1v1h-1z M6,17h1v1h-1z M7,17h1v1h-1z M9,17h1v1h-1z M11,17h1v1h-1z M13,17h1v1h-1z M14,17h1v1h-1z M17,17h1v1h-1z M18,17h1v1h-1z M19,17h1v1h-1z M20,17h1v1h-1z M25,17h1v1h-1z M26,17h1v1h-1z M4,18h1v1h-1z M6,18h1v1h-1z M7,18h1v1h-1z M10,18h1v1h-1z M11,18h1v1h-1z M12,18h1v1h-1z M13,18h1v1h-1z M14,18h1v1h-1z M15,18h1v1h-1z M16,18h1v1h-1z M18,18h1v1h-1z M20,18h1v1h-1z M23,18h1v1h-1z M26,18h1v1h-1z M27,18h1v1h-1z M29,18h1v1h-1z M30,18h1v1h-1z M31,18h1v1h-1z M32,18h1v1h-1z M5,19h1v1h-1z M6,19h1v1h-1z M7,19h1v1h-1z M9,19h1v1h-1z M13,19h1v1h-1z M17,19h1v1h-1z M19,19h1v1h-1z M20,19h1v1h-1z M22,19h1v1h-1z M23,19h1v1h-1z M27,19h1v1h-1z M28,19h1v1h-1z M29,19h1v1h-1z M10,20h1v1h-1z M11,20h1v1h-1z M13,20h1v1h-1z M14,20h1v1h-1z M20,20h1v1h-1z M23,20h1v1h-1z M29,20h1v1h-1z M30,20h1v1h-1z M32,20h1v1h-1z M5,21h1v1h-1z M7,21h1v1h-1z M8,21h1v1h-1z M11,21h1v1h-1z M14,21h1v1h-1z M15,21h1v1h-1z M17,21h1v1h-1z M19,21h1v1h-1z M22,21h1v1h-1z M25,21h1v1h-1z M27,21h1v1h-1z M29,21h1v1h-1z M32,21h1v1h-1z M4,22h1v1h-1z M6,22h1v1h-1z M7,22h1v1h-1z M8,22h1v1h-1z M9,22h1v1h-1z M10,22h1v1h-1z M11,22h1v1h-1z M16,22h1v1h-1z M19,22h1v1h-1z M28,22h1v1h-1z M29,22h1v1h-1z M30,22h1v1h-1z M7,23h1v1h-1z M8,23h1v1h-1z M9,23h1v1h-1z M11,23h1v1h-1z M12,23h1v1h-1z M13,23h1v1h-1z M15,23h1v1h-1z M16,23h1v1h-1z M19,23h1v1h-1z M20,23h1v1h-1z M21,23h1v1h-1z M25,23h1v1h-1z M26,23h1v1h-1z M28,23h1v1h-1z M30,23h1v1h-1z M31,23h1v1h-1z M32,23h1v1h-1z M5,24h1v1h-1z M8,24h1v1h-1z M10,24h1v1h-1z M14,24h1v1h-1z M15,24h1v1h-1z M17,24h1v1h-1z M21,24h1v1h-1z M23,24h1v1h-1z M24,24h1v1h-1z M25,24h1v1h-1z M26,24h1v1h-1z M27,24h1v1h-1z M28,24h1v1h-1z M30,24h1v1h-1z M31,24h1v1h-1z M32,24h1v1h-1z M12,25h1v1h-1z M13,25h1v1h-1z M14,25h1v1h-1z M17,25h1v1h-1z M18,25h1v1h-1z M20,25h1v1h-1z M23,25h1v1h-1z M24,25h1v1h-1z M28,25h1v1h-1z M30,25h1v1h-1z M4,26h1v1h-1z M5,26h1v1h-1z M6,26h1v1h-1z M7,26h1v1h-1z M8,26h1v1h-1z M9,26h1v1h-1z M10,26h1v1h-1z M12,26h1v1h-1z M13,26h1v1h-1z M14,26h1v1h-1z M17,26h1v1h-1z M22,26h1v1h-1z M24,26h1v1h-1z M26,26h1v1h-1z M28,26h1v1h-1z M31,26h1v1h-1z M4,27h1v1h-1z M10,27h1v1h-1z M12,27h1v1h-1z M13,27h1v1h-1z M14,27h1v1h-1z M15,27h1v1h-1z M19,27h1v1h-1z M24,27h1v1h-1z M28,27h1v1h-1z M31,27h1v1h-1z M4,28h1v1h-1z M6,28h1v1h-1z M7,28h1v1h-1z M8,28h1v1h-1z M10,28h1v1h-1z M13,28h1v1h-1z M14,28h1v1h-1z M15,28h1v1h-1z M16,28h1v1h-1z M18,28h1v1h-1z M19,28h1v1h-1z M24,28h1v1h-1z M25,28h1v1h-1z M26,28h1v1h-1z M27,28h1v1h-1z M28,28h1v1h-1z M29,28h1v1h-1z M4,29h1v1h-1z M6,29h1v1h-1z M7,29h1v1h-1z M8,29h1v1h-1z M10,29h1v1h-1z M12,29h1v1h-1z M16,29h1v1h-1z M18,29h1v1h-1z M19,29h1v1h-1z M20,29h1v1h-1z M23,29h1v1h-1z M27,29h1v1h-1z M29,29h1v1h-1z M30,29h1v1h-1z M32,29h1v1h-1z M4,30h1v1h-1z M6,30h1v1h-1z M7,30h1v1h-1z M8,30h1v1h-1z M10,30h1v1h-1z M12,30h1v1h-1z M15,30h1v1h-1z M17,30h1v1h-1z M18,30h1v1h-1z M20,30h1v1h-1z M22,30h1v1h-1z M23,30h1v1h-1z M24,30h1v1h-1z M25,30h1v1h-1z M27,30h1v1h-1z M29,30h1v1h-1z M32,30h1v1h-1z M4,31h1v1h-1z M10,31h1v1h-1z M14,31h1v1h-1z M16,31h1v1h-1z M18,31h1v1h-1z M19,31h1v1h-1z M20,31h1v1h-1z M23,31h1v1h-1z M24,31h1v1h-1z M27,31h1v1h-1z M28,31h1v1h-1z M29,31h1v1h-1z M31,31h1v1h-1z M4,32h1v1h-1z M5,32h1v1h-1z M6,32h1v1h-1z M7,32h1v1h-1z M8,32h1v1h-1z M9,32h1v1h-1z M10,32h1v1h-1z M12,32h1v1h-1z M13,32h1v1h-1z M14,32h1v1h-1z M15,32h1v1h-1z M17,32h1v1h-1z M18,32h1v1h-1z M22,32h1v1h-1z M24,32h1v1h-1z M26,32h1v1h-1z M30,32h1v1h-1z M31,32h1v1h-1z' fill='%23000'/%3E%3C/svg%3E\" />",
              topLeftNotesSize: "1",
            }),
          },
          {
            name: "intro",
            link: toChangedParam({
              preset: "Weeknights",
              presetStage: "intro",

              bottomRightNotes: `# Intro
1. Name
1. What are you working on?
1. Question of the day`,
              bottomRightNotesSize: "2",
            }),
          },
          {
            name: "work session1",
            link: toChangedParam({
              preset: "Weeknights",
              presetStage: "work session1",

              bottomRightNotes: `Talk to a host for demos (short 2-min max show and tell)`,
              mainContent: "timer",
              countdownToTime:
                currentTimePlusMinutesRoundedToNearest5Minutes(50),
              countdownTitle: "Break Starts",
            }),
          },
          {
            name: "break",
            link: toChangedParam({
              preset: "Weeknights",
              presetStage: "break",

              mainContent: "timer",
              countdownToTime:
                currentTimePlusMinutesRoundedToNearest5Minutes(15),
              countdownTitle: "Break Ends",
            }),
          },
          {
            name: "work session2",
            link: toChangedParam({
              preset: "Weeknights",
              presetStage: "work session2",

              mainContent: "timer",
              countdownToTime:
                currentTimePlusMinutesRoundedToNearest5Minutes(50),
              countdownTitle: "Demos Start",
            }),
          },
          {
            name: "demos",
            link: toChangedParam({
              preset: "Weeknights",
              presetStage: "demos",

              mainContent: "text",
              centerText: "Gather around for demos!",
            }),
          },
        ],
      },
    ];

  const [selectedPreset, setSelectedPreset] = useQueryParam(
    "preset",
    withDefault(StringParam, undefined)
  );
  const [selectedPresetStage, setSelectedPresetStage] = useQueryParam(
    "presetStage",
    withDefault(StringParam, undefined)
  );
  useEffect(() => {
    function selectStage(offset: number) {
      const preset = presets.find((p) => p.name === selectedPreset);
      if (!preset) {
        return;
      }
      const currentIndex = preset.stages.findIndex(
        (s) => s.name === selectedPresetStage
      );
      if (currentIndex < 0) {
        return;
      }
      const stage = preset.stages[currentIndex + offset];
      if (!stage) {
        return;
      }
      setSelectedPresetStage(stage.name);
      // @ts-ignore
      window.location = stage.link;
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "f") {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        } else {
          document.documentElement.requestFullscreen();
        }
      } else if (e.key === "ArrowRight") {
        selectStage(1);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedPreset, selectedPresetStage, window.location.href]);

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
          </button>{" "}
          (use "f" key to toggle fullscreen)
        </div>
        <div>presets: (use → keys to go to the next stage)</div>
        {presets.map((preset) => (
          <div
            key={preset.name}
            className={
              selectedPreset === preset.name
                ? "preset border padding-8"
                : "preset"
            }
          >
            {preset.name}
            {": "}
            {preset.stages.map((stage) => (
              <a
                key={stage.name}
                href={stage.link}
                className={
                  selectedPreset === preset.name &&
                  selectedPresetStage === stage.name
                    ? "border padding-4"
                    : ""
                }
              >
                <button>{stage.name}</button>
              </a>
            ))}
          </div>
        ))}
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

function linkWithParams(p: Record<string, string>): string {
  const url = new URL(window.location.href);
  const params = new URLSearchParams();
  Object.entries(p).forEach(([key, value]) => {
    params.set(key, value);
  });
  url.hash = params.toString();
  return url.toString();
}

function toChangedParam(p: Record<string, string>): string {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.hash.slice(1)); // Remove the leading '#'
  Object.entries(p).forEach(([key, value]) => {
    params.set(key, value);
  });
  url.hash = params.toString();
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
