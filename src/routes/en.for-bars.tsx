import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/en/for-bars")({
  beforeLoad: () => {
    throw redirect({
      href: "/en/for-venues",
      statusCode: 301,
      replace: true,
    });
  },
});
