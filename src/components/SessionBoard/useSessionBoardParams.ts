import { useUrlSearchParams } from "@vueuse/core";
import { computed, type WritableComputedRef } from "vue";

const rawParams = useUrlSearchParams<{
  preset?: (typeof presets)[number]["name"];
  presetStage?: (typeof presets)[number]["stages"][number]["name"];

  topLeftText?: string;
  topRightText?: string;
  bottomLeftText?: string;
  bottomRightText?: string;

  mainContentState?: "timer" | "text" | "qotd";

  qotd?: string;
  qotdLocation?: string;

  countdownTitle?: string;
  countdownToTime?: string;

  centerText?: string;

  topLeftNotes?: string;
  topLeftNotesSize?: string;
  showTopLeftNotes?: string;

  topRightNotes?: string;
  topRightNotesSize?: string;
  showTopRightNotes?: string;

  bottomLeftNotes?: string;
  bottomLeftNotesSize?: string;
  showBottomLeftNotes?: string;

  bottomRightNotes?: string;
  bottomRightNotesSize?: string;
  showBottomRightNotes?: string;
}>("hash-params", {
  writeMode: "push",
});
export const isParamsEmpty = computed(() => {
  console.log(rawParams);
  return Object.keys(rawParams).length === 0;
});

function paramToRef<Key extends keyof typeof rawParams>(
  key: Key,
  config: (typeof rawParams)[Key]
): WritableComputedRef<
  NonNullable<(typeof rawParams)[Key]>,
  (typeof rawParams)[Key]
>;
function paramToRef<Key extends keyof typeof rawParams>(
  key: Key
): WritableComputedRef<(typeof rawParams)[Key] | undefined>;
function paramToRef<Key extends keyof typeof rawParams, Cooked>(
  key: Key,
  config: {
    default: Cooked;
    fromRaw: (
      rawValue: (typeof rawParams)[Key] | undefined
    ) => Cooked | undefined;
    toRaw?: (value: Cooked | undefined) => (typeof rawParams)[Key] | undefined;
  }
): WritableComputedRef<Cooked, Cooked | undefined>;
function paramToRef<Key extends keyof typeof rawParams, Cooked>(
  key: Key,
  config: {
    default?: Cooked;
    fromRaw: (rawValue: (typeof rawParams)[Key] | undefined) => Cooked;
    toRaw?: (value: Cooked) => (typeof rawParams)[Key] | undefined;
  }
): WritableComputedRef<Cooked, Cooked>;
function paramToRef<
  Key extends keyof typeof rawParams,
  Cooked = (typeof rawParams)[Key],
>(
  key: Key,
  config?:
    | (typeof rawParams)[Key]
    | {
        default?: Cooked;
        fromRaw: (
          rawValue: (typeof rawParams)[Key] | undefined
        ) => Cooked | undefined;
        toRaw?: (
          value: Cooked | undefined
        ) => (typeof rawParams)[Key] | undefined;
      }
) {
  return computed({
    get() {
      if (typeof config === "object") {
        if (rawParams[key] === undefined) {
          return config.default;
        }
        return config?.fromRaw?.(rawParams[key]) ?? config?.default;
      }

      return rawParams[key] ?? config;
    },
    set(value) {
      if (typeof config === "object") {
        if (value === config.default) {
          // If the value is the default, we set it to undefined
          // to remove it from the URL params.
          rawParams[key] = undefined;
          return;
        }
      } else if (value === config) {
        // If the value is the same as the default, we set it to undefined
        // to remove it from the URL params.
        rawParams[key] = undefined;
        return;
      }

      // @ts-ignore
      rawParams[key] = config?.toRaw?.(value) ?? String(value);
    },
  });
}

export const selectedPreset = paramToRef("preset");
export const selectedPresetStage = paramToRef("presetStage");

export const topLeftText = paramToRef("topLeftText", ":time:");
export const topRightText = paramToRef("topRightText", "");
export const bottomLeftText = paramToRef("bottomLeftText", "");
export const bottomRightText = paramToRef("bottomRightText", "");

export const mainContentState = paramToRef("mainContentState", "qotd");

export const qotd = paramToRef("qotd", "");
export const qotdLocation = paramToRef("qotdLocation", "Vancouver, BC, Canada");

export const countdownTitle = paramToRef("countdownTitle", "Break Starts");
export const countdownToTime = paramToRef("countdownToTime", {
  default: { hour: 13, minute: 20 },
  fromRaw(rawValue) {
    if (!rawValue) return undefined;
    const [hour, minute] = rawValue.split(":").map((part) => {
      const num = Number(part);
      if (isNaN(num)) {
        return 0;
      }
      return num;
    });
    return { hour, minute };
  },
  toRaw(value) {
    if (!value) return undefined;
    let hour = value.hour;
    let minute = value.minute;

    const extraMinutes = minute - 60;
    if (extraMinutes >= 0) {
      hour += Math.floor(extraMinutes / 60);
      minute = extraMinutes % 60;
    }

    const formattedHour = String(hour);
    const formattedMinute = String(minute).padStart(2, "0");

    return `${formattedHour}:${formattedMinute}`;
  },
});

export const centerText = paramToRef("centerText", "");

export const topLeftNotes = paramToRef("topLeftNotes", "");
export const topLeftNotesSize = paramToRef("topLeftNotesSize", {
  default: 3,
  fromRaw: Number,
});
export const showTopLeftNotes = paramToRef("showTopLeftNotes", {
  default: true,
  fromRaw: (rawValue) => rawValue === "true",
  toRaw: (value) => (value ? "true" : "false"),
});

export const topRightNotes = paramToRef("topRightNotes", "");
export const topRightNotesSize = paramToRef("topRightNotesSize", {
  default: 3,
  fromRaw: Number,
});
export const showTopRightNotes = paramToRef("showTopRightNotes", {
  default: true,
  fromRaw: (rawValue) => rawValue === "true",
  toRaw: (value) => (value ? "true" : "false"),
});

export const bottomLeftNotes = paramToRef("bottomLeftNotes", "");
export const bottomLeftNotesSize = paramToRef("bottomLeftNotesSize", {
  default: 3,
  fromRaw: Number,
});
export const showBottomLeftNotes = paramToRef("showBottomLeftNotes", {
  default: true,
  fromRaw: (rawValue) => rawValue === "true",
  toRaw: (value) => (value ? "true" : "false"),
});

export const bottomRightNotes = paramToRef("bottomRightNotes", "");
export const bottomRightNotesSize = paramToRef("bottomRightNotesSize", {
  default: 3,
  fromRaw: Number,
});
export const showBottomRightNotes = paramToRef("showBottomRightNotes", {
  default: true,
  fromRaw: (rawValue) => rawValue === "true",
  toRaw: (value) => (value ? "true" : "false"),
});

export function reset() {
  for (const key of Object.keys(rawParams)) {
    // @ts-ignore
    rawParams[key] = undefined;
  }
}

export const presets: {
  name: string;
  stages: { name: string; set: () => void }[];
}[] = [
  {
    name: "UBC",
    stages: [
      {
        name: "welcome",
        set() {
          reset();

          selectedPreset.value = "UBC";
          selectedPresetStage.value = "welcome";

          topRightText.value = "UBC";
          qotd.value = "[TODO]";
          bottomRightNotes.value = "Welcome to Atelier ❤️";

          bottomLeftNotes.value = `# Hosts\n\n${[
            "Kai",
            "Rae",
            "Iris",
            "Jen",
          ].join("  \n")}`;
          bottomLeftNotesSize.value = 2;

          qotdLocation.value = "UBC, Vancouver, BC, Canada";
        },
      },
      {
        name: "intro",
        set() {
          selectedPreset.value = "UBC";
          selectedPresetStage.value = "intro";

          bottomRightNotes.value = `# Intro
1. Name
1. What are you working on?
1. Question of the day`;
          bottomRightNotesSize.value = 2;
        },
      },
      {
        name: "work session1",
        set() {
          selectedPreset.value = "UBC";
          selectedPresetStage.value = "work session1";

          bottomRightNotes.value = `Talk to a host for demos (short 2-min max show and tell)`;
          mainContentState.value = "timer";
          countdownToTime.value =
            currentTimePlusMinutesRoundedToNearest5Minutes(70);
          countdownTitle.value = "Break Starts";
        },
      },
      {
        name: "break",
        set() {
          selectedPreset.value = "UBC";
          selectedPresetStage.value = "break";

          mainContentState.value = "timer";
          countdownToTime.value =
            currentTimePlusMinutesRoundedToNearest5Minutes(15);
          countdownTitle.value = "Break Ends";
        },
      },
      {
        name: "work session2",
        set() {
          selectedPreset.value = "UBC";
          selectedPresetStage.value = "work session2";

          mainContentState.value = "timer";
          countdownToTime.value =
            currentTimePlusMinutesRoundedToNearest5Minutes(70);
          countdownTitle.value = "Demos Start";
        },
      },
      {
        name: "demos",
        set() {
          selectedPreset.value = "UBC";
          selectedPresetStage.value = "demos";

          mainContentState.value = "text";
          centerText.value = "Gather around for demos!";
        },
      },
    ],
  },
  {
    name: "Weeknights",
    stages: [
      {
        name: "welcome",
        set() {
          reset();

          selectedPreset.value = "Weeknights";
          selectedPresetStage.value = "welcome";

          topRightText.value = "V2 House";
          qotd.value = "[TODO]";
          bottomRightNotes.value = "Welcome to Atelier Weeknights ❤️";

          bottomLeftNotes.value = `# Hosts\n\n${[
            "Kai",
            "Rae",
            "Vibhor",
            "Connell",
            "Chloe-Amelie",
            "Ananya",
            "Clo",
            "Scott",
          ].join("  \n")}`;
          bottomLeftNotesSize.value = 2;

          topLeftNotes.value =
            "# WIFI\n\nTELUS3176\n\nH46MdfvtvJK4\n\n\n<img style=\"margin-top: 0.5ch\" src=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' version='1.1' viewBox='0 0 37 37' stroke='none'%3E%3Crect width='100%25' height='100%25' fill='%23FFF'/%3E%3Cpath d='M4,4h1v1h-1z M5,4h1v1h-1z M6,4h1v1h-1z M7,4h1v1h-1z M8,4h1v1h-1z M9,4h1v1h-1z M10,4h1v1h-1z M12,4h1v1h-1z M16,4h1v1h-1z M18,4h1v1h-1z M21,4h1v1h-1z M23,4h1v1h-1z M26,4h1v1h-1z M27,4h1v1h-1z M28,4h1v1h-1z M29,4h1v1h-1z M30,4h1v1h-1z M31,4h1v1h-1z M32,4h1v1h-1z M4,5h1v1h-1z M10,5h1v1h-1z M12,5h1v1h-1z M13,5h1v1h-1z M20,5h1v1h-1z M26,5h1v1h-1z M32,5h1v1h-1z M4,6h1v1h-1z M6,6h1v1h-1z M7,6h1v1h-1z M8,6h1v1h-1z M10,6h1v1h-1z M14,6h1v1h-1z M17,6h1v1h-1z M19,6h1v1h-1z M20,6h1v1h-1z M22,6h1v1h-1z M23,6h1v1h-1z M26,6h1v1h-1z M28,6h1v1h-1z M29,6h1v1h-1z M30,6h1v1h-1z M32,6h1v1h-1z M4,7h1v1h-1z M6,7h1v1h-1z M7,7h1v1h-1z M8,7h1v1h-1z M10,7h1v1h-1z M12,7h1v1h-1z M13,7h1v1h-1z M14,7h1v1h-1z M15,7h1v1h-1z M17,7h1v1h-1z M26,7h1v1h-1z M28,7h1v1h-1z M29,7h1v1h-1z M30,7h1v1h-1z M32,7h1v1h-1z M4,8h1v1h-1z M6,8h1v1h-1z M7,8h1v1h-1z M8,8h1v1h-1z M10,8h1v1h-1z M13,8h1v1h-1z M14,8h1v1h-1z M17,8h1v1h-1z M20,8h1v1h-1z M21,8h1v1h-1z M22,8h1v1h-1z M26,8h1v1h-1z M28,8h1v1h-1z M29,8h1v1h-1z M30,8h1v1h-1z M32,8h1v1h-1z M4,9h1v1h-1z M10,9h1v1h-1z M13,9h1v1h-1z M16,9h1v1h-1z M20,9h1v1h-1z M23,9h1v1h-1z M26,9h1v1h-1z M32,9h1v1h-1z M4,10h1v1h-1z M5,10h1v1h-1z M6,10h1v1h-1z M7,10h1v1h-1z M8,10h1v1h-1z M9,10h1v1h-1z M10,10h1v1h-1z M12,10h1v1h-1z M14,10h1v1h-1z M16,10h1v1h-1z M18,10h1v1h-1z M20,10h1v1h-1z M22,10h1v1h-1z M24,10h1v1h-1z M26,10h1v1h-1z M27,10h1v1h-1z M28,10h1v1h-1z M29,10h1v1h-1z M30,10h1v1h-1z M31,10h1v1h-1z M32,10h1v1h-1z M12,11h1v1h-1z M16,11h1v1h-1z M19,11h1v1h-1z M21,11h1v1h-1z M24,11h1v1h-1z M4,12h1v1h-1z M6,12h1v1h-1z M7,12h1v1h-1z M9,12h1v1h-1z M10,12h1v1h-1z M11,12h1v1h-1z M15,12h1v1h-1z M16,12h1v1h-1z M19,12h1v1h-1z M20,12h1v1h-1z M21,12h1v1h-1z M23,12h1v1h-1z M24,12h1v1h-1z M26,12h1v1h-1z M29,12h1v1h-1z M31,12h1v1h-1z M32,12h1v1h-1z M8,13h1v1h-1z M9,13h1v1h-1z M13,13h1v1h-1z M14,13h1v1h-1z M15,13h1v1h-1z M17,13h1v1h-1z M18,13h1v1h-1z M19,13h1v1h-1z M20,13h1v1h-1z M21,13h1v1h-1z M24,13h1v1h-1z M26,13h1v1h-1z M28,13h1v1h-1z M30,13h1v1h-1z M31,13h1v1h-1z M4,14h1v1h-1z M6,14h1v1h-1z M10,14h1v1h-1z M12,14h1v1h-1z M14,14h1v1h-1z M15,14h1v1h-1z M16,14h1v1h-1z M17,14h1v1h-1z M18,14h1v1h-1z M28,14h1v1h-1z M29,14h1v1h-1z M30,14h1v1h-1z M31,14h1v1h-1z M9,15h1v1h-1z M13,15h1v1h-1z M16,15h1v1h-1z M17,15h1v1h-1z M18,15h1v1h-1z M19,15h1v1h-1z M24,15h1v1h-1z M25,15h1v1h-1z M29,15h1v1h-1z M6,16h1v1h-1z M7,16h1v1h-1z M9,16h1v1h-1z M10,16h1v1h-1z M12,16h1v1h-1z M19,16h1v1h-1z M20,16h1v1h-1z M24,16h1v1h-1z M25,16h1v1h-1z M27,16h1v1h-1z M28,16h1v1h-1z M29,16h1v1h-1z M30,16h1v1h-1z M4,17h1v1h-1z M6,17h1v1h-1z M7,17h1v1h-1z M9,17h1v1h-1z M11,17h1v1h-1z M13,17h1v1h-1z M14,17h1v1h-1z M17,17h1v1h-1z M18,17h1v1h-1z M19,17h1v1h-1z M20,17h1v1h-1z M25,17h1v1h-1z M26,17h1v1h-1z M4,18h1v1h-1z M6,18h1v1h-1z M7,18h1v1h-1z M10,18h1v1h-1z M11,18h1v1h-1z M12,18h1v1h-1z M13,18h1v1h-1z M14,18h1v1h-1z M15,18h1v1h-1z M16,18h1v1h-1z M18,18h1v1h-1z M20,18h1v1h-1z M23,18h1v1h-1z M26,18h1v1h-1z M27,18h1v1h-1z M29,18h1v1h-1z M30,18h1v1h-1z M31,18h1v1h-1z M32,18h1v1h-1z M5,19h1v1h-1z M6,19h1v1h-1z M7,19h1v1h-1z M9,19h1v1h-1z M13,19h1v1h-1z M17,19h1v1h-1z M19,19h1v1h-1z M20,19h1v1h-1z M22,19h1v1h-1z M23,19h1v1h-1z M27,19h1v1h-1z M28,19h1v1h-1z M29,19h1v1h-1z M10,20h1v1h-1z M11,20h1v1h-1z M13,20h1v1h-1z M14,20h1v1h-1z M20,20h1v1h-1z M23,20h1v1h-1z M29,20h1v1h-1z M30,20h1v1h-1z M32,20h1v1h-1z M5,21h1v1h-1z M7,21h1v1h-1z M8,21h1v1h-1z M11,21h1v1h-1z M14,21h1v1h-1z M15,21h1v1h-1z M17,21h1v1h-1z M19,21h1v1h-1z M22,21h1v1h-1z M25,21h1v1h-1z M27,21h1v1h-1z M29,21h1v1h-1z M32,21h1v1h-1z M4,22h1v1h-1z M6,22h1v1h-1z M7,22h1v1h-1z M8,22h1v1h-1z M9,22h1v1h-1z M10,22h1v1h-1z M11,22h1v1h-1z M16,22h1v1h-1z M19,22h1v1h-1z M28,22h1v1h-1z M29,22h1v1h-1z M30,22h1v1h-1z M7,23h1v1h-1z M8,23h1v1h-1z M9,23h1v1h-1z M11,23h1v1h-1z M12,23h1v1h-1z M13,23h1v1h-1z M15,23h1v1h-1z M16,23h1v1h-1z M19,23h1v1h-1z M20,23h1v1h-1z M21,23h1v1h-1z M25,23h1v1h-1z M26,23h1v1h-1z M28,23h1v1h-1z M30,23h1v1h-1z M31,23h1v1h-1z M32,23h1v1h-1z M5,24h1v1h-1z M8,24h1v1h-1z M10,24h1v1h-1z M14,24h1v1h-1z M15,24h1v1h-1z M17,24h1v1h-1z M21,24h1v1h-1z M23,24h1v1h-1z M24,24h1v1h-1z M25,24h1v1h-1z M26,24h1v1h-1z M27,24h1v1h-1z M28,24h1v1h-1z M30,24h1v1h-1z M31,24h1v1h-1z M32,24h1v1h-1z M12,25h1v1h-1z M13,25h1v1h-1z M14,25h1v1h-1z M17,25h1v1h-1z M18,25h1v1h-1z M20,25h1v1h-1z M23,25h1v1h-1z M24,25h1v1h-1z M28,25h1v1h-1z M30,25h1v1h-1z M4,26h1v1h-1z M5,26h1v1h-1z M6,26h1v1h-1z M7,26h1v1h-1z M8,26h1v1h-1z M9,26h1v1h-1z M10,26h1v1h-1z M12,26h1v1h-1z M13,26h1v1h-1z M14,26h1v1h-1z M17,26h1v1h-1z M22,26h1v1h-1z M24,26h1v1h-1z M26,26h1v1h-1z M28,26h1v1h-1z M31,26h1v1h-1z M4,27h1v1h-1z M10,27h1v1h-1z M12,27h1v1h-1z M13,27h1v1h-1z M14,27h1v1h-1z M15,27h1v1h-1z M19,27h1v1h-1z M24,27h1v1h-1z M28,27h1v1h-1z M31,27h1v1h-1z M4,28h1v1h-1z M6,28h1v1h-1z M7,28h1v1h-1z M8,28h1v1h-1z M10,28h1v1h-1z M13,28h1v1h-1z M14,28h1v1h-1z M15,28h1v1h-1z M16,28h1v1h-1z M18,28h1v1h-1z M19,28h1v1h-1z M24,28h1v1h-1z M25,28h1v1h-1z M26,28h1v1h-1z M27,28h1v1h-1z M28,28h1v1h-1z M29,28h1v1h-1z M4,29h1v1h-1z M6,29h1v1h-1z M7,29h1v1h-1z M8,29h1v1h-1z M10,29h1v1h-1z M12,29h1v1h-1z M16,29h1v1h-1z M18,29h1v1h-1z M19,29h1v1h-1z M20,29h1v1h-1z M23,29h1v1h-1z M27,29h1v1h-1z M29,29h1v1h-1z M30,29h1v1h-1z M32,29h1v1h-1z M4,30h1v1h-1z M6,30h1v1h-1z M7,30h1v1h-1z M8,30h1v1h-1z M10,30h1v1h-1z M12,30h1v1h-1z M15,30h1v1h-1z M17,30h1v1h-1z M18,30h1v1h-1z M20,30h1v1h-1z M22,30h1v1h-1z M23,30h1v1h-1z M24,30h1v1h-1z M25,30h1v1h-1z M27,30h1v1h-1z M29,30h1v1h-1z M32,30h1v1h-1z M4,31h1v1h-1z M10,31h1v1h-1z M14,31h1v1h-1z M16,31h1v1h-1z M18,31h1v1h-1z M19,31h1v1h-1z M20,31h1v1h-1z M23,31h1v1h-1z M24,31h1v1h-1z M27,31h1v1h-1z M28,31h1v1h-1z M29,31h1v1h-1z M31,31h1v1h-1z M4,32h1v1h-1z M5,32h1v1h-1z M6,32h1v1h-1z M7,32h1v1h-1z M8,32h1v1h-1z M9,32h1v1h-1z M10,32h1v1h-1z M12,32h1v1h-1z M13,32h1v1h-1z M14,32h1v1h-1z M15,32h1v1h-1z M17,32h1v1h-1z M18,32h1v1h-1z M22,32h1v1h-1z M24,32h1v1h-1z M26,32h1v1h-1z M30,32h1v1h-1z M31,32h1v1h-1z' fill='%23000'/%3E%3C/svg%3E\" />";
          topLeftNotesSize.value = 1;
        },
      },
      {
        name: "intro",
        set() {
          selectedPreset.value = "Weeknights";
          selectedPresetStage.value = "intro";

          bottomRightNotes.value = `# Intro
1. Name
1. What are you working on?
1. Question of the day`;
          bottomRightNotesSize.value = 2;
        },
      },
      {
        name: "work session1",
        set() {
          selectedPreset.value = "Weeknights";
          selectedPresetStage.value = "work session1";

          bottomRightNotes.value =
            "Talk to a host for demos (short 2-min max show and tell)";
          mainContentState.value = "timer";
          countdownToTime.value =
            currentTimePlusMinutesRoundedToNearest5Minutes(50);
          countdownTitle.value = "Break Starts";
        },
      },
      {
        name: "break",
        set() {
          selectedPreset.value = "Weeknights";
          selectedPresetStage.value = "break";

          mainContentState.value = "timer";
          countdownToTime.value =
            currentTimePlusMinutesRoundedToNearest5Minutes(10);
          countdownTitle.value = "Break Ends";
        },
      },
      {
        name: "work session2",
        set() {
          selectedPreset.value = "Weeknights";
          selectedPresetStage.value = "work session2";

          mainContentState.value = "timer";
          countdownToTime.value =
            currentTimePlusMinutesRoundedToNearest5Minutes(50);
          countdownTitle.value = "Demos Start";
        },
      },
      {
        name: "demos",
        set() {
          selectedPreset.value = "Weeknights";
          selectedPresetStage.value = "demos";

          mainContentState.value = "text";
          centerText.value = "Gather around for demos!";
        },
      },
    ],
  },
] as const;

function currentTimePlusMinutesRoundedToNearest5Minutes(minuteOffset: number) {
  const now = new Date();
  const currentMinutes = now.getMinutes();
  const roundedMinutes = Math.round(currentMinutes / 5) * 5;
  now.setMinutes(roundedMinutes + minuteOffset);

  const hour = now.getHours();
  const minute = now.getMinutes();

  return {
    hour,
    minute,
  };
}
