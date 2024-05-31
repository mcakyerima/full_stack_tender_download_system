import Image from "next/image"

export const Logo = () => {
    return (
        <div className="flex items-center gap-1">
            <Image
                height={25}
                width={25}
                alt='logo'
                src="/Logo-2.svg"
                className="md:opacity-0 "
            />
            <span className="md:opacity-0 font-semibold">Tender-Download</span>
        </div>
    )
}