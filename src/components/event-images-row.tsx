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

/*
I want to change the component in the home page. 
The EventImagesRow component. I only want this component to change in the homepage, every other page it is used it must stay the same. 
So only adapt it for the hompage. The component should contine look the way it curretly does but I want to add somthing new. 
the three images that at appear any given time should revolve every 2.5 seconds.the rotating is
*/