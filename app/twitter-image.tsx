import { ImageResponse } from "next/og";

import { siteConfig } from "@/data/site";

export const alt = "Osman ASLAN portfolio";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#0d1117",
        color: "#f0f6fc",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: "72px",
        width: "100%",
      }}
    >
      <div
        style={{
          border: "1px solid #30363d",
          display: "flex",
          flexDirection: "column",
          gap: "28px",
          padding: "56px",
          width: "100%",
        }}
      >
        <div style={{ color: "#58a6ff", fontSize: 30 }}>
          {siteConfig.links.primaryDomain.replace("https://", "")}
        </div>
        <div style={{ fontSize: 72, fontWeight: 700 }}>
          {siteConfig.owner.name}
        </div>
        <div style={{ color: "#8b949e", fontSize: 36 }}>
          {siteConfig.owner.role}
        </div>
      </div>
    </div>,
    size
  );
}
