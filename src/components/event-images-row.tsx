import Image from "next/image"

interface EventImagesRowProps {
  images: {
    src: string
    alt: string
  }[]
  className?: string
}

export default function EventImagesRow({
  images = [
    {
      src: "/images/ep_1.png",
      alt: "Event image 1",
    },
    {
      src: "/images/ep_2.png",
      alt: "Event image 2",
    },
    {
      src: "/images/ep_3.png",
      alt: "Event image 3",
    },
  ],
  className = "",
}: EventImagesRowProps) {
  return (
    <div className={`w-full grid grid-cols-3 ${className}`}>
      {images.map((image, index) => (
        <div key={index} className="relative aspect-[4/3]">
          <Image
            src={image.src || "/placeholder.svg"}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 33vw, 33vw"
          />
        </div>
      ))}
    </div>
  )
}

