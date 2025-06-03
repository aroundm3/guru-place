import { Metadata } from "next"
import "styles/globals.css"

export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1.0",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light">
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
