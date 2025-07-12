type BannerSize = "sm" | "md" | "lg";

const sizes = {
  sm: { text: "text-4xl", img: "h-10" },
  md: { text: "text-5xl", img: "h-14" },
  lg: { text: "text-6xl", img: "h-20" },
};

function Banner({size}: {size? :BannerSize}) {
    const DEFAULT_TEXT_SIZE = " text-4xl md:text-5xl lg:text-6xl ";
    const DEFAULT_IMAGE_SIZE = " md:h-14 lg:h-20 ";




    return (<h1 className={`flex flex-col font-medium items-center justify-center text-center sm:flex-row gap-3 ${size? sizes[size].text : DEFAULT_TEXT_SIZE}`}>
        The
        <span className={`text-npr-red font-[Caveat] font-bold`}>(unofficial)</span>
        <img
            src="/npr_logo.jpg"
            alt="NPR Logo"
            className={`h-10 ${size? sizes[size].img : DEFAULT_IMAGE_SIZE}`} />
        Audio Quiz
    </h1>)

    // return (<div className="flex flex-col items-center justify-center text-center sm:flex-row gap-3">
    //     <h1 className={`${variant[size].h1}`}>The</h1>
    //     <span className={`${variant[size].h1} text-npr-red font-[Caveat]`}>(unofficial)</span>
    //     <img
    //         src="/npr_logo.jpg"
    //         alt="NPR Logo"
    //         className={` ${variant[size].img}`} />
    //     <h1 className={`${variant[size].h1}`}>Audio Quiz</h1>
    // </div>)

}

export default Banner