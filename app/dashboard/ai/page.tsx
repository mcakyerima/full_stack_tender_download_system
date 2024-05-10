import Image from "next/image";

const AiAgent = () => {
    return (
        <div className="flex flex-col items-center justify-center mt-20">
            <div className="flex flex-col items-center space-y-5">
                <div className=" ">
                    <Image
                        src="/ai.svg"
                        alt="Empty File Vector"
                        height={300}
                        width={300}
                    />
                </div>
                <p className="text-center">Ai Agent Coming soon!</p>
            </div>
        </div>
    );
};

export default AiAgent;
