function Banner() {

    return (<h1 className={`flex flex-col font-medium text-4xl md:text-5xl lg:text-6xl items-center justify-center text-center sm:flex-row gap-3`}>
        The
        <span className={`text-npr-red font-[Caveat] font-bold`}>(unofficial)</span>
        <img
            src="/npr_logo.jpg"
            alt="NPR Logo"
            className={`h-10 md:h-14 lg:h-20`} />
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