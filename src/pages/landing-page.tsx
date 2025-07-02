import Banner from "../components/ui/banner"
import { Button } from "../components/ui/button"

function LandingPage({ onStartClicked }: { onStartClicked: () => void }) {
    return (

        <div className="flex flex-col min-h-screen justify-center items-center">
            <Banner />
            <h2 className="text-center p-4">
                Think you're an NPR pro?  Listen to a news clip, guess the correct correspondent as fast as you can, and try to get the high score!
            </h2>
            <Button
                variant={"navigation"}
                size={"lg"}
                onClick={onStartClicked}
            >Start</Button>
            {/* <h1 className="text-xl sm:text-3xl font-bold bg-red-300">The</h1>
            <span className="text-xs sm:text-base italic text-gray-500">(unofficial)</span>
            <img src="/path/to/npr-logo.svg" alt="NPR Logo" className="h-8 sm:h-12 my-1" />
            <h2 className="text-2xl sm:text-4xl font-bold">Audio Quiz</h2> */}
        </div>
        // <div className="min-h-screen min-w-full flex items-center justify-center bg-white">
        //     <div className="flex flex-col items-center">
        //         <Banner size={"lg"} />

        //         <div className="w-3/5">
        // <h2 className="text-center p-4">
        //     Think you're an NPR pro?  Listen to a news clip, guess the correct correspondent as fast as you can, and try to get the high score!
        // </h2>
        //             <div className="flex flex-row justify-center p-4">
        // <Button
        //     variant={"navigation"}
        //     size={"lg"}
        //     onClick={onStartClicked}
        // >Start</Button>
        //             </div>
        //         </div>
        //     </div>

        // </div>
    )
}

export default LandingPage