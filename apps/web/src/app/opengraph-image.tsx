import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "Rove"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: "#0a0a0a",
          color: "#fafafa",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.7, marginBottom: 16 }}>Rove</div>
        <div style={{ fontWeight: 600, lineHeight: 1.15, maxWidth: 900 }}>
          Automated opportunity engine for local businesses
        </div>
      </div>
    ),
    { ...size },
  )
}
