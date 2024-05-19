import Image from "next/image";

export const EmptyTrash = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-full max-w-md">
                <Image
                    className=" h-auto"
                    src="/empty_trash.svg"
                    alt="Empty File Vector"
                    width={300}
                    height={300}
                />
            </div>
            <h1 className="text-lg md:text-xl lg:text-2xl sm:text-xs mb-8 text-center ">
                Your trash is empty! 🎉
            </h1>
        </div>
    );
};
