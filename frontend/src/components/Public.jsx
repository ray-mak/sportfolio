//This is the public facing page (landing page)
import { Link } from "react-router-dom"
import graph from "/public/graph.jpg"


const Public = () => {
  return (
    <main className="flex flex-col justify-center items-center">
        <section className="flex flex-col-reverse md:flex-row xl:w-4/5 2xl:w-2/3 mt-16 gap-8">
            <div className="flex flex-col w-full p-8 2xl:w-1/2 justify-center gap-10 xl:gap-12">
                <h1 className="text-3xl xl:text-4xl 2xl:text-5xl font-bold leading-normal">Increase Your <span className="text-darkGreen">ROI</span> From Sportsbetting</h1>
                <p className="text-lg xl:text-xl font-medium leading-normal">Track your betting history, analyze your performance, and refine your strategy. Tail winning bettors or sell your own picks!</p>
                <div className="flex flex-row gap-8 justify-center md:justify-start">
                    <button className="w-28 h-12 border-2 rounded-lg">Free Picks</button>
                    <button className="w-28 h-12 bg-brightRed text-almostWhite rounded-lg">Get Started</button>
                </div>
            </div>
            <div className="w-full 2xl:w-1/2 p-8 m-auto">
                <img className="w-full rounded-xl object-cover" src="../../public/graph2.jpg" />
            </div>
        </section>
        <section className="flex flex-col justify-center items-center w-full bg-lightGray mt-8 p-10 gap-8">
            <h2 className="text-3xl font-semibold">Features Heading</h2>
            <div className="flex flex-col gap-8 md:flex-row md:gap-12 xl:w-4/5 2xl:w-2/3">
                <div className="flex flex-col justify-center items-center gap-6 bg-white p-8 rounded-lg">
                    <img className="w-3/5" src="../../public/icon.jpg"/>
                    <h3 className="text-darkGray text-2xl font-semibold">Feature 1</h3>
                    <p className="font-medium text-center text-lg md:text-base">Some text explaining this feature. Lorem ipsum</p>
                </div>
                <div className="flex flex-col justify-center items-center gap-6 bg-white p-8 rounded-lg">
                    <img className="w-3/5" src="../../public/icon.jpg"/>
                    <h3 className="text-darkGray text-2xl font-semibold">Feature 1</h3>
                    <p className="font-medium text-center text-lg md:text-base">Some text explaining this feature. Lorem ipsum</p>
                </div>
                <div className="flex flex-col justify-center items-center gap-6 bg-white p-8 rounded-lg">
                    <img className="w-3/5" src="../../public/icon.jpg"/>
                    <h3 className="text-darkGray text-2xl font-semibold">Feature 1</h3>
                    <p className="font-medium text-center text-lg md:text-base">Some text explaining this feature. Lorem ipsum</p>
                </div>
            </div>
        </section>
    </main>
  )
}

export default Public