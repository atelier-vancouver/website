import { onMounted, onUnmounted, ref } from "vue";

const VANCOUVER = { lat: 49.2827, lng: -123.1207 };

// sunrise/sunset from the NOAA/suncalc approximation, accurate to ~1 minute
const RAD = Math.PI / 180;
const DAY_MS = 86_400_000;
const J1970 = 2440588;
const J2000 = 2451545;
const J0 = 0.0009;
const OBLIQUITY = RAD * 23.4397;
const SUNRISE_ALTITUDE = RAD * -0.833;

function getSunTimes(date: Date, lat: number, lng: number) {
  const lw = RAD * -lng;
  const phi = RAD * lat;
  const days = date.valueOf() / DAY_MS - 0.5 + J1970 - J2000;

  const cycle = Math.round(days - J0 - lw / (2 * Math.PI));
  const approxNoon = J0 + lw / (2 * Math.PI) + cycle;

  const meanAnomaly = RAD * (357.5291 + 0.98560028 * approxNoon);
  const center =
    RAD *
    (1.9148 * Math.sin(meanAnomaly) +
      0.02 * Math.sin(2 * meanAnomaly) +
      0.0003 * Math.sin(3 * meanAnomaly));
  const eclipticLongitude = meanAnomaly + center + RAD * 102.9372 + Math.PI;
  const declination = Math.asin(
    Math.sin(OBLIQUITY) * Math.sin(eclipticLongitude),
  );

  const transit = (approx: number) =>
    J2000 +
    approx +
    0.0053 * Math.sin(meanAnomaly) -
    0.0069 * Math.sin(2 * eclipticLongitude);

  const hourAngle = Math.acos(
    (Math.sin(SUNRISE_ALTITUDE) - Math.sin(phi) * Math.sin(declination)) /
      (Math.cos(phi) * Math.cos(declination)),
  );

  const noon = transit(approxNoon);
  const set = transit(J0 + (hourAngle + lw) / (2 * Math.PI) + cycle);
  const rise = noon - (set - noon);

  const fromJulian = (j: number) => new Date((j + 0.5 - J1970) * DAY_MS);
  return { sunrise: fromJulian(rise), sunset: fromJulian(set) };
}

export function isNightInVancouver(date = new Date()) {
  const { sunrise, sunset } = getSunTimes(date, VANCOUVER.lat, VANCOUVER.lng);
  return date < sunrise || date > sunset;
}

// true between Vancouver sunset and sunrise, rechecked every minute
export function useIsNight() {
  const isNight = ref(isNightInVancouver());

  let interval: ReturnType<typeof setInterval> | undefined;
  onMounted(() => {
    interval = setInterval(() => {
      isNight.value = isNightInVancouver();
    }, 60_000);
  });
  onUnmounted(() => clearInterval(interval));

  return isNight;
}
