import Banner from "../components/ui/banner"
import { Button } from "../components/ui/button"

function LandingPage({ onStartClicked }: { onStartClicked: () => void }) {
    console.log('LandingPage')
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
        </div>
    )
}

export default LandingPage