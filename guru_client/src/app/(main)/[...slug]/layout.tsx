import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <div
      style={{
        // background: `
        //     // linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 2px),
        //     // linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 2px),
        //     #fffdf8
        //   `,
        // backgroundSize: "60px 60px",
        minHeight: "100vh",
      }}
    >
      {props.children}
    </div>
  )
}
