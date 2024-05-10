import Image from "next/image";

export const NoData = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-20">
            <div className="flex flex-col items-center space-y-5">
                <div className=" ">
                    <Image
                        src="/nodata.svg"
                        alt="Empty File Vector"
                        height={200}
                        width={200}
                    />
                </div>
                <p className="text-center">No records found!</p>
            </div>
        </div>
    );
};
