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
            "Calvin",
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
            "Calvin",
            "Kai",
            "Rae",
            "Vibhor",
            "Connell",
            "Chloe-Amelie",
          ].join("  \n")}`;
          bottomLeftNotesSize.value = 2;

          topLeftNotes.value =
            '# WIFI\n\nTELUS3176\n\nH46MdfvtvJK4\n\n\n<img style="margin-top: 0.5ch" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%22-1.5%20-1.5%2032%2032%22%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20x%3D%22-1.5%22%20y%3D%22-1.5%22%20fill%3D%22%23fff%22%20rx%3D%224%22%20ry%3D%224%22%2F%3E%3Crect%20width%3D%226%22%20height%3D%226%22%20x%3D%22.5%22%20y%3D%22.5%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20rx%3D%222.3%22%20ry%3D%222.3%22%2F%3E%3Crect%20width%3D%226%22%20height%3D%226%22%20x%3D%22.5%22%20y%3D%2222.5%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20rx%3D%222.3%22%20ry%3D%222.3%22%2F%3E%3Crect%20width%3D%226%22%20height%3D%226%22%20x%3D%2222.5%22%20y%3D%22.5%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20rx%3D%222.3%22%20ry%3D%222.3%22%2F%3E%3Crect%20width%3D%223%22%20height%3D%223%22%20x%3D%222%22%20y%3D%222%22%20rx%3D%22.8%22%20ry%3D%22.8%22%2F%3E%3Crect%20width%3D%223%22%20height%3D%223%22%20x%3D%222%22%20y%3D%2224%22%20rx%3D%22.8%22%20ry%3D%22.8%22%2F%3E%3Crect%20width%3D%223%22%20height%3D%223%22%20x%3D%2224%22%20y%3D%222%22%20rx%3D%22.8%22%20ry%3D%22.8%22%2F%3E%3Crect%20width%3D%224%22%20height%3D%224%22%20x%3D%2220.5%22%20y%3D%2220.5%22%20fill%3D%22none%22%20stroke%3D%22%23000%22%20rx%3D%221.5%22%20ry%3D%221.5%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2222%22%20y%3D%2222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2217%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%221%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2212%22%20y%3D%221%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%221%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%221%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%228%22%20y%3D%222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2216%22%20y%3D%222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2220%22%20y%3D%222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2216%22%20y%3D%223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2217%22%20y%3D%223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2220%22%20y%3D%223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2217%22%20y%3D%224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2219%22%20y%3D%224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%228%22%20y%3D%225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2216%22%20y%3D%225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2219%22%20y%3D%225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2220%22%20y%3D%225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%228%22%20y%3D%226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2212%22%20y%3D%226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2216%22%20y%3D%226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2220%22%20y%3D%226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2212%22%20y%3D%227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2217%22%20y%3D%227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%222%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%226%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%227%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2219%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2220%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2223%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2226%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2228%22%20y%3D%228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%221%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%223%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%225%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%227%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2216%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2221%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2222%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2224%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2225%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2227%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2228%22%20y%3D%229%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%222%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%224%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%226%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%227%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2212%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2220%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2221%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2223%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2224%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2225%22%20y%3D%2210%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%221%22%20y%3D%2211%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%222%22%20y%3D%2211%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%225%22%20y%3D%2211%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%228%22%20y%3D%2211%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%2211%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%2211%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2212%22%20y%3D%2211%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%2211%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2219%22%20y%3D%2211%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2221%22%20y%3D%2211%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2227%22%20y%3D%2211%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2228%22%20y%3D%2211%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20y%3D%2212%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%222%22%20y%3D%2212%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%226%22%20y%3D%2212%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%227%22%20y%3D%2212%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%228%22%20y%3D%2212%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%2212%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%2212%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%2212%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2216%22%20y%3D%2212%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2223%22%20y%3D%2212%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2227%22%20y%3D%2212%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%221%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%222%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%224%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%225%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%227%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2212%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2217%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2220%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2221%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2224%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2225%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2226%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2228%22%20y%3D%2213%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%223%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%224%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%226%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2212%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2221%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2223%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2224%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2225%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2228%22%20y%3D%2214%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%221%22%20y%3D%2215%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%222%22%20y%3D%2215%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%223%22%20y%3D%2215%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%225%22%20y%3D%2215%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%2215%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%2215%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2215%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2222%22%20y%3D%2215%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2225%22%20y%3D%2215%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2226%22%20y%3D%2215%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2227%22%20y%3D%2215%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%223%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%224%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%226%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2212%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2220%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2221%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2223%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2225%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2226%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2228%22%20y%3D%2216%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%222%22%20y%3D%2217%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%228%22%20y%3D%2217%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%2217%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%2217%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%2217%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2216%22%20y%3D%2217%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2222%22%20y%3D%2217%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2224%22%20y%3D%2217%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2226%22%20y%3D%2217%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2228%22%20y%3D%2217%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%221%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%224%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%226%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%228%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2212%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2216%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2219%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2220%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2221%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2222%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2223%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2224%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2225%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2227%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2228%22%20y%3D%2218%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%223%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%224%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%225%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%227%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%228%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2219%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2221%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2226%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2227%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2228%22%20y%3D%2219%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%221%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%222%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%223%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%224%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%226%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2212%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2219%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2225%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2226%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2227%22%20y%3D%2220%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%228%22%20y%3D%2221%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%2221%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%2221%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2216%22%20y%3D%2221%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2221%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2226%22%20y%3D%2221%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2227%22%20y%3D%2221%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%228%22%20y%3D%2222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%2222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%2222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%2222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%2222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2216%22%20y%3D%2222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2219%22%20y%3D%2222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2228%22%20y%3D%2222%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%2223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%2223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%2223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2212%22%20y%3D%2223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%2223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%2223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2217%22%20y%3D%2223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2226%22%20y%3D%2223%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%2224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%2224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%2224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%2224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2225%22%20y%3D%2224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2227%22%20y%3D%2224%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%2225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%2225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%2225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%2225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%2225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%2225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2220%22%20y%3D%2225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2221%22%20y%3D%2225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2222%22%20y%3D%2225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2224%22%20y%3D%2225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2225%22%20y%3D%2225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2226%22%20y%3D%2225%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%228%22%20y%3D%2226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2210%22%20y%3D%2226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2212%22%20y%3D%2226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%2226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2219%22%20y%3D%2226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2222%22%20y%3D%2226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2223%22%20y%3D%2226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2224%22%20y%3D%2226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2225%22%20y%3D%2226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2226%22%20y%3D%2226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2227%22%20y%3D%2226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2228%22%20y%3D%2226%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2212%22%20y%3D%2227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2213%22%20y%3D%2227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%2227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%2227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2217%22%20y%3D%2227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2219%22%20y%3D%2227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2220%22%20y%3D%2227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2224%22%20y%3D%2227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2225%22%20y%3D%2227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2228%22%20y%3D%2227%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%228%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%229%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2211%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2214%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2215%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2216%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2218%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2219%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2221%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2223%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2224%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2225%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2226%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2227%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3Crect%20width%3D%221%22%20height%3D%221%22%20x%3D%2228%22%20y%3D%2228%22%20rx%3D%22.4%22%20ry%3D%22.4%22%2F%3E%3C%2Fsvg%3E" />';
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
