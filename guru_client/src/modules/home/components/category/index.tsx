import { getListCategories } from "@lib/data/category"
import CategoryItem from "./CategoryItem"
import CategoryPickerMobile from "./CategoryPickerMobile"
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded"
import CategoriesFlatList from "./CategoriesFlatList"

export default async function Categories({
  isShowList,
}: {
  isShowList?: boolean
}) {
  const categories = await getListCategories({})

  if (isShowList) {
    return <CategoriesFlatList categories={categories} />
  }

  return (
    <div className="flex flex-col space-y-4 sm:w-1/4 w-full">
      <div className="mr-4 flex sm:space-x-1 space-x-0.5 text-gray-700 items-center">
        <CategoryRoundedIcon className="sm:!h-5 !h-4" />
        <h6 className="my-auto sm:text-xl text-lg font-semibold">Danh mục</h6>
      </div>
      <div className="flex-col space-y-2 content-end sm:flex hidden pl-2">
        {categories.map((category) => {
          return <CategoryItem category={category} key={category.documentId} />
        })}
      </div>
      <CategoryPickerMobile categories={categories} />
    </div>
  )
}
