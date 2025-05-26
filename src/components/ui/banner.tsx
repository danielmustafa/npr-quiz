function Banner({size}: {size: "sm" | "md" | "lg"}) {

    const variant = {
        sm: {
            h1: "text-3xl",
            img: "h-8 md:h-10",
        },
        md: {
            h1: "text-4xl",
            img: "h-12 md:h-14",
        },
        lg: {
            h1: "text-5xl",
            img: "h-16 md:h-20",
        }
    }

    return (<h1 className={`flex items-center font-bold text-center p-4 ${variant[size].h1}`} >
        The <span className="text-npr-red font-[Caveat]">(unofficial)</span>
        <img
            src="/npr_logo.jpg"
            alt="NPR Logo"
            className={`inline align-middle mx-2 ${variant[size].img}`}
        />
        Audio Quiz
    </h1>)
}

export default Banner