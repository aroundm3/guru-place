import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  // const customer = await retrieveCustomer()
  // const cart = await retrieveCart()
  // let shippingOptions: StoreCartShippingOption[] = []

  // if (cart) {
  //   const { shipping_options } = await listCartOptions()

  //   shippingOptions = shipping_options
  // }

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
        style={{
          background: `
            linear-gradient(to right, rgba(0, 0, 0, 0.02) 1px, transparent 2px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.02) 1px, transparent 2px),
            #fffdf8
          `,
          backgroundSize: "60px 60px",
          minHeight: "100vh",
        }}
      >
        {props.children}
      </div>

      {/* <Footer /> */}
    </>
  )
}
