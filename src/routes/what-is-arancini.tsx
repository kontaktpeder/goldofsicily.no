import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/what-is-arancini")({
  beforeLoad: () => {
    throw redirect({
      href: "/arancini",
      statusCode: 301,
      replace: true,
    });
  },
});
