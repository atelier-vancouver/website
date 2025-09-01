export const onRequestGet: PagesFunction = async (context) => {
  const utmSource = context.params.code;

  if (utmSource) {
    const data = {
      t: Date.now(),
      utm_source: utmSource,
      city: context.request.cf?.city,
      postalCode: context.request.cf?.postalCode,
      metroCode: context.request.cf?.metroCode,
      region: context.request.cf?.region,
      regionCode: context.request.cf?.regionCode,
      timezone: context.request.cf?.timezone,
      country: context.request.cf?.country,
      continent: context.request.cf?.continent,
      longitude: context.request.cf?.longitude,
      latitude: context.request.cf?.latitude,
      "User-Agent": context.request.headers.get("User-Agent"),
      "CF-Connecting-IP": context.request.headers.get("CF-Connecting-IP"),
      "CF-Device-Type": context.request.headers.get("CF-Device-Type"),
    };

    console.log(data);

    context.waitUntil(
      fetch(
        "https://script.google.com/macros/s/AKfycbw-9a8LzB2QwDSIHgIUxafeb_CawEo6Z1SUL6r5XzgiRhH_v5OErV64nWSFsRtmozuC/exec",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      )
    );
  }

  const destinationURL = `https://luma.com/atelier.place?utm_source=${utmSource}`;
  const statusCode = 302;

  return new Response(null, {
    status: statusCode,
    headers: {
      Location: destinationURL,
      "Cache-Control": "no-store",
    },
  });
};
