import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Signal — l'essentiel des dernières 24h";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(900px 400px at 15% 10%, #3DE8FF22, transparent 60%), #0B0E1A",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 40 }}>
            <div style={{ width: 8, height: 16, background: "#3DE8FF", borderRadius: 3 }} />
            <div style={{ width: 8, height: 28, background: "#3DE8FF", borderRadius: 3 }} />
            <div style={{ width: 8, height: 40, background: "#3DE8FF", borderRadius: 3 }} />
            <div style={{ width: 8, height: 22, background: "#FF4FA3", borderRadius: 3 }} />
          </div>
          <div style={{ fontSize: 88, fontWeight: 700, color: "#E8ECF7" }}>Signal</div>
        </div>
        <div style={{ fontSize: 32, color: "#8891B0", marginTop: 24, maxWidth: 820 }}>
          IA, Web, Gaming, Hack &amp; Console, Société, Dev — l'essentiel des
          dernières 24 heures.
        </div>
      </div>
    ),
    { ...size }
  );
}
