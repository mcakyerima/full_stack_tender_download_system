import Image from "next/image"

export const Logo = () => {
    return (
        <Image
            height={32}
            width={32}
            alt="logo"
            src="/Mercy-Corps.svg"
        />
    )
}