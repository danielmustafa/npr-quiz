import Banner from "../components/ui/banner"
import { Button } from "../components/ui/button"

function LandingPage({ onStartClicked }: { onStartClicked: () => void }) {
    return (
        <div className="min-h-screen min-w-full flex items-center justify-center bg-white">
            <div className="flex flex-col items-center">
                <Banner size={"lg"} />

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