type DayProofCollageProps = {
  imageUrls: string[]
}

export default function DayProofCollage({ imageUrls }: DayProofCollageProps) {
  const visible = imageUrls.slice(0, 5)
  const extraCount = imageUrls.length - visible.length

  return (
    <div className="flex items-center">
      {visible.map((url, index) => (
        <div
          key={`${url}-${index}`}
          className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full border-2 border-white bg-gray-200 shadow-sm sm:h-8 sm:w-8"
          style={{
            marginLeft: index === 0 ? 0 : -10,
            zIndex: index + 1,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- dynamic Cloudinary proof URLs */}
          <img src={url} alt="" className="h-full w-full object-cover" loading="lazy" />
          {index === visible.length - 1 && extraCount > 0 && (
            <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-[10px] font-semibold text-white">
              +{extraCount}
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
