import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { fetcher } from "@lib/config"
import { StoreMetadata } from "types/global"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const storeMetadataRs = await fetcher("/api/store-metadata")

  const metada: StoreMetadata = storeMetadataRs.data

  return (
    <>
      <Nav />
      {/* {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )} */}

      {/* {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )} */}
      <div
        // #fffdf8
        style={{
          background: metada.background_color,
          // backgroundSize: "60px 60px",
          minHeight: "100vh",
        }}
        className="pb-20"
      >
        {props.children}
      </div>

      <Footer metada={metada} />
    </>
  )
}
