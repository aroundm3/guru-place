import { Suspense } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import Image from "next/image"
import SearchIcon from "@mui/icons-material/Search"
import SearchButton from "@modules/layout/components/search-button"
import Link from "next/link"

export default async function Nav() {
  // const regions = await listRegions().then((regions: StoreRegion[]) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b duration-200 bg-stone-100 border-ui-border-base">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular">
          <div className="flex-1 basis-0 h-full flex items-center space-x-4">
            <div className="h-full">
              <SideMenu regions={[]} />
            </div>
            <Suspense fallback={<SearchIcon className="cursor-pointer" />}>
              <SearchButton />
            </Suspense>
          </div>

          <div className="flex items-center h-full">
            <Link
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
            >
              {/* <div className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase">
                DIVI COSMETICS
              </div> */}
              <Image
                src={"/logo.png"}
                alt={"Divi Cosmetics"}
                width={80}
                height={80}
                className="my-auto"
                sizes="100vw"
              />
            </Link>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            {/* <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div> */}

            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
