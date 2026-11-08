import { ImageResponse } from "next/og"

export const alt = "Syntropic: revenue operations for B2B sales teams"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const stages = ["Marketing", "Leads", "Sales", "Pipeline", "Revenue", "Retention"]

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#0b1324",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, fontWeight: 600 }}
      >
        <div
          style={{ width: 40, height: 40, borderRadius: 8, background: "#ffffff", display: "flex" }}
        />
        Syntropic
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            maxWidth: 900,
          }}
        >
          Your pipeline runs every day. Your team closes.
        </div>
        <div style={{ fontSize: 28, color: "#a3aec0" }}>
          Revenue operations for B2B firms that sell through a sales team
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {stages.map((stage, index) => (
          <div key={stage} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                padding: "8px 16px",
                borderRadius: 6,
                fontSize: 22,
                border: "1px solid #24314a",
                background: index === 4 ? "#4be0a4" : "transparent",
                color: index === 4 ? "#0b1324" : "#ffffff",
              }}
            >
              {stage}
            </div>
            {index < stages.length - 1 && (
              <div style={{ width: 24, height: 2, background: "#4be0a4", display: "flex" }} />
            )}
          </div>
        ))}
      </div>
    </div>,
    size,
  )
}
