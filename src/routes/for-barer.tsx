import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/for-barer")({
  beforeLoad: () => {
    throw redirect({
      href: "/for-serveringssteder",
      statusCode: 301,
      replace: true,
    });
  },
});
