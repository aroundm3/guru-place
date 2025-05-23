import { getListCategories } from "@lib/data/category"
import CategoryItem from "./CategoryItem"
import { Fragment } from "react"
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded"

export default async function Categories() {
  const categories = await getListCategories({})
  return (
    <Fragment>
      <div className="flex-col space-y-2 sm:w-32 w-20 content-end sm:flex hidden">
        {categories.map((category) => {
          return <CategoryItem category={category} key={category.documentId} />
        })}
      </div>
      <div className="text-sm font-semibold text-stone-400 sm:hidden flex space-x-1">
        <span>Danh mục</span> <KeyboardArrowDownRoundedIcon />
      </div>
    </Fragment>
  )
}
