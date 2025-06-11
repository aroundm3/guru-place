import { Fragment } from "react"

export default function ProductCartLoading() {
  return (
    <Fragment>
      {Array(3).map((idx) => {
        return (
          <div
            key={idx}
            className="w-full h-full bg-gray-100 animate-pulse rounded-lg flex flex-col space-y-4"
          >
            <div className="h-44 w-full bg-gray-200 animate-pulse rounded-t-lg"></div>
            <div className="flex flex-col space-y-1 px-4">
              <div className="bg-gray-200 animate-pulse rounded w-full h-6"></div>
              <div className="bg-gray-200 animate-pulse rounded w-1/2 h-6"></div>
            </div>
          </div>
        )
      })}
    </Fragment>
  )
}
