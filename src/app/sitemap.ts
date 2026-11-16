import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://qrstudio.app";

  const routes = [
    "",
    "/generator",
    "/generator/url",
    "/generator/wifi",
    "/generator/text",
    "/generator/email",
    "/generator/phone",
    "/generator/sms",
    "/features",
    "/pricing",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date("2026-10-12T00:00:00.000Z"),
    changeFrequency: "weekly" as const,
    priority: route === "" || route === "/generator" ? 1.0 : 0.8,
  }));
}
