import { Category } from "types/global"

export default function CategoryPickerMobile({
  categories,
}: {
  categories: Category[]
}) {
  return (
    <div className="flex flex-col space-y-2 sm:hidden">
      <div className="overflow-x-scroll no-scrollbar">
        <div className="flex space-x-2 w-max">
          {categories.map((category) => {
            return (
              <div
                key={category.documentId}
                className="px-4 py-2 flex h-fit space-x-2 bg-white rounded-lg border border-gray-100 pr-2 hover:bg-stone-100 cursor-pointer duration-300 text-pink-700"
              >
                <span className="text-sm font-semibold text-center my-auto">
                  {category.name}
                </span>
              </div>
            )
          })}
          {categories.map((category) => {
            return (
              <div
                key={category.documentId}
                className="px-4 py-2 flex h-fit space-x-2 bg-white rounded-lg border border-gray-100 pr-2 hover:bg-stone-100 cursor-pointer duration-300 text-pink-700"
              >
                <span className="text-sm font-semibold text-center my-auto">
                  {category.name}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
