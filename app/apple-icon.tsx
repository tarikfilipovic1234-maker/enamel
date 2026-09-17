import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the Enamel mark on the brand teal. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f766e",
        }}
      >
        <svg width="112" height="112" viewBox="0 0 32 32">
          <path
            d="M16 7c4.1 0 7 2.8 7 7 0 3.7-1.4 5.8-2.3 9.3-.6 2.2-1.4 4.7-4.7 4.7s-4.1-2.5-4.7-4.7C10.4 19.8 9 17.7 9 14c0-4.2 2.9-7 7-7Z"
            fill="none"
            stroke="#fff"
            strokeWidth="2.1"
            strokeLinejoin="round"
          />
          <path
            d="M13.1 14.2c.9-1 4.9-1 5.8 0"
            fill="none"
            stroke="#fff"
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.75"
          />
        </svg>
      </div>
    ),
    size,
  );
}
