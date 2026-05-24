import type { APIRoute } from "astro";
import { waitUntil } from "cloudflare:workers";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const utmSource = params.code;

  if (utmSource) {
    const cf = request.cf;
    const data = {
      t: Date.now(),
      utm_source: utmSource,
      city: cf?.city,
      postalCode: cf?.postalCode,
      metroCode: cf?.metroCode,
      region: cf?.region,
      regionCode: cf?.regionCode,
      timezone: cf?.timezone,
      country: cf?.country,
      continent: cf?.continent,
      longitude: cf?.longitude,
      latitude: cf?.latitude,
      "User-Agent": request.headers.get("User-Agent"),
      "CF-Connecting-IP": request.headers.get("CF-Connecting-IP"),
      "CF-Device-Type": request.headers.get("CF-Device-Type"),
    };

    console.log(data);

    waitUntil(
      fetch(
        "https://script.google.com/macros/s/AKfycbw-9a8LzB2QwDSIHgIUxafeb_CawEo6Z1SUL6r5XzgiRhH_v5OErV64nWSFsRtmozuC/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        },
      ),
    );
  }

  const destinationURL = `https://luma.com/atelier.place?utm_source=${utmSource}`;

  return new Response(undefined, {
    status: 302,
    headers: {
      Location: destinationURL,
      "Cache-Control": "no-store",
    },
  });
};
