import Image from "next/image"

interface EventImagesRowProps {
  images: {
    src: string
    alt: string
  }[]
}

export default function EventImagesRow({ images }: EventImagesRowProps) {
  return (
    <div className="flex w-full">
      {images.map((image, index) => (
        <div key={index} className="flex-1 relative aspect-square">
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
          />
        </div>
      ))}
    </div>
  )
}