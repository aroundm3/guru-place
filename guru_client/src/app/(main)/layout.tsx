import { Suspense } from "react"
import { Metadata } from "next"

import { getBaseURL } from "@lib/util/env"
import { getFullLinkResource } from "@lib/config"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import { fetcher } from "@lib/config"
import { StoreMetadata, CustomerCard } from "types/global"
import { CustomerCardProvider } from "@lib/context/customer-card-context"
import { CustomerProvider } from "@lib/context/customer-context"
import CustomerModal from "@modules/layout/components/customer-modal"
import LoadingBar from "@modules/common/components/loading-bar"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

const fallbackMetadata: StoreMetadata = {
  documentId: "fallback",
  background_color: "#fffdf8",
  phone_number: "",
  address: "",
  google_map_link: "",
  email_contact: "",
  facebook_link: "",
  zalo_link: "",
  description: "",
  about_me: [],
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  let metada: StoreMetadata = fallbackMetadata
  try {
    const storeMetadataRs = await fetcher("/api/store-metadata")
    metada = storeMetadataRs.data
  } catch (error) {
    console.error("Failed to fetch store metadata:", error)
  }

  // Fetch customer cards (discount cards) from guru-server
  let customerCards: CustomerCard[] = []
  try {
    const customerCardsRs = await fetcher(
      "/api/customer-cards?" +
        "fields[0]=title&" +
        "fields[1]=description&" +
        "fields[2]=discount&" +
        "fields[3]=index&" +
        "fields[4]=publishedAt&" +
        "populate[image][populate]=*"
    )

    // Process the customer cards to include proper image URLs
    customerCards = (customerCardsRs.data || []).map((card: any) => ({
      ...card,
      image: card.image.formats
        ? {
            small: getFullLinkResource(
              card.image.formats.small?.url ?? card.image.url
            ),
            thumbnail: getFullLinkResource(
              card.image.formats.thumbnail?.url ?? card.image.url
            ),
            default: getFullLinkResource(card.image.url),
          }
        : null,
    }))

    console.log({ customerCardsRs, customerCards })
  } catch (error) {
    console.error("Failed to fetch customer cards:", error)
  }

  return (
    <CustomerCardProvider initialCards={customerCards}>
      <CustomerProvider>
        <Suspense fallback={null}>
          <LoadingBar />
        </Suspense>
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
        <CustomerModal />
      </CustomerProvider>
    </CustomerCardProvider>
  )
}
