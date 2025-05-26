import Banner from "./ui/banner"
import { Button } from "./ui/button"

function LandingPage({ onStartClicked }: { onStartClicked: () => void }) {
    return (
        <div className="min-h-screen min-w-full flex items-center justify-center bg-white">
            <div className="flex flex-col items-center">
                <Banner size={"lg"} />
                {/* <h1 className="flex items-center font-bold text-5xl text-center p-4" >
                    The <span className="text-npr-red font-[Caveat]">(unofficial)</span>
                    <img
                        src="/npr_logo.jpg"
                        alt="NPR Logo"
                        className="h-16 mx-2"
                    />
                    Audio Quiz
                </h1> */}
                <div className="w-3/5">
                    <h2 className="text-center p-4">
                        Think you're an NPR pro?  Listen to a news clip, guess the correct correspondent as fast as you can, and try to get the high score!
                    </h2>
                    <div className="flex flex-row justify-center p-4">
                        <Button
                            variant={"navigation"}
                            size={"lg"}
                            onClick={onStartClicked}
                        >Start</Button>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default LandingPage