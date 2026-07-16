import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const destinationURL = `https://luma.com/z1kpn9n2${url.search}`;

  return new Response(undefined, {
    status: 301,
    headers: {
      Location: destinationURL,
    },
  });
};
