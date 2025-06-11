import { getListBrand } from "@lib/data/brand"
import { getListCategories } from "@lib/data/category"
import { Text, clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Link from "next/link"
import { StoreMetadata } from "types/global"
import LocalPhoneIcon from "@mui/icons-material/LocalPhone"
import EmailIcon from "@mui/icons-material/Email"
import FacebookIcon from "@mui/icons-material/Facebook"

interface FooterProps {
  metada: StoreMetadata
}

export default async function Footer({ metada }: FooterProps) {
  const categories = await getListCategories({})
  const brands = await getListBrand({})

  return (
    <footer className="border-t border-ui-border-base w-full bg-stone-100">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-20">
          <div>
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase"
            >
              DIVI Cosmetics
            </LocalizedClientLink>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {categories && categories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">Danh mục</span>
                <ul
                  className="grid grid-cols-1 gap-2"
                  data-testid="footer-categories"
                >
                  {categories.map((category) => {
                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={category.documentId}
                      >
                        <Link
                          className={clx(
                            "hover:text-ui-fg-base",
                            "txt-small-plus"
                          )}
                          href={`/category_${category.slug}`}
                          data-testid="category-link"
                        >
                          {category.name}
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            {brands && brands.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Thương hiệu
                </span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
                    {
                      "grid-cols-2": (brands?.length || 0) > 3,
                    }
                  )}
                >
                  {brands.map((brand) => (
                    <li key={brand.documentId}>
                      <Link
                        className="hover:text-ui-fg-base"
                        href={`/brand_${brand.slug}`}
                      >
                        {brand.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">Contact</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                {metada.phone_number && (
                  <li>
                    <a
                      href={`tel:${metada.phone_number}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-ui-fg-base flex items-center"
                    >
                      <LocalPhoneIcon className="!h-4" />
                      {metada.phone_number}
                    </a>
                  </li>
                )}
                {metada.email_contact && (
                  <li>
                    <a
                      href={`mailTo:${metada.phone_number}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-ui-fg-base flex items-center"
                    >
                      <EmailIcon className="!h-4" />
                      {metada.email_contact}
                    </a>
                  </li>
                )}

                {metada.facebook_link && (
                  <li>
                    <a
                      href={metada.facebook_link}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-ui-fg-base flex items-center"
                    >
                      <FacebookIcon className="!h-4" />
                      Facebook
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-16 justify-between text-ui-fg-muted">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} Divi Cosmetics Store.
          </Text>
        </div>
      </div>
    </footer>
  )
}
