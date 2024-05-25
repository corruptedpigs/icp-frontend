import Image from "next/image"

export default function Avatar({ name, role, src }) {
  return (
    <div className="avatar flex flex-col text-center mb-8 mx-6 max-w-32">
      <div className="w-36 mask mask-hexagon">
        <Image src={src} height={36} width={36} alt={name}/>
      </div>
      <p className="">{name}</p>
      <p className="font-bold text-pink">{role}</p>
    </div>
  )
}
