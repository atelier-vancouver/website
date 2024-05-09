export default function Home() {
  return (
    <div
      className="min-h-screen min-w-full relative bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('images/Paper 4.svg')` }}
    >
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        <img src="images/mascots.svg" alt="mascots" />
        <h1 className="font-hahmlet font-semibold text-9xl text-off-black tracking-tighter -mt-8">
          atelier
        </h1>
        <p className="font-hahmlet font-bold text-2xl text-off-black text-center mt-2">
          we gather weekly to <span className="font-handwriting">CREATE</span>
        </p>
        <button className="relative font-handwriting font-semibold text-2xl text-off-black bg-off-white hover:bg-[#706F6B] transition-colors duration-500 ease-in-out px-6 py-2 mt-4 border-[0.5px] border-black rounded-md shadow-lg after:absolute after:-bottom-[4px] after:-right-[4px] after:w-[calc(100%+4px)] after:h-[calc(100%+4px)] after:border-b-4 after:border-r-4 after:border-black after:rounded-md after:bg-off-white after:z-[-1]">
          JOIN US THIS SUNDAY
        </button>
        <p className="mt-4 font-ibm font-light uppercase">📍 Vancouver, BC</p>
      </div>
      <img
        src="images/background.svg"
        alt="background"
        className="h-[100vh] w-[95vw] z-20"
      />
      {/* "Strip" image should be visually below "background" */}
      <img src="images/strip.svg" alt="strip" className="w-full mt-2 z-10" />

      <div className="mt-32 pl-32 pr-0 relative">
        <div className="bg-black py-1.5 px-3 inline-block">
          <h2 className="font-handwriting text-white text-2xl">WHAT WE DO</h2>
        </div>

        <div className="flex justify-between mt-4 relative">
          <div className="mt-8 w-3/4">
            <p className="font-hahmlet font-semibold text-5xl leading-snug">
              Atelier is an open co-working session for the curious.
            </p>
            <p className="font-hahmlet text-3xl mt-8">to be creative,</p>
            <p className="font-hahmlet font-semibold text-3xl mt-0.5">
              you need dedicated time to create.
            </p>
            <p className="font-hahmlet text-3xl mt-6">
              we explore our curiousity by{" "}
              <span className="font-semibold">making</span> things:
            </p>
          </div>
          <div className="w-1/4 relative">
            <img src="images/lightbulb.svg" alt="lightbulb" className="z-20" />
            <img
              src="images/background2.svg"
              alt="background2"
              className="absolute left-[0%] bottom-0"
            />
          </div>
        </div>
      </div>

      <p className="font-hahmlet font-semibold text-7xl mt-12 whitespace-nowrap text-center mx-auto">
        software, paintings, drawings, research
      </p>
      {/* <p className="font-hahmlet font-semibold text-7xl mt-12 whitespace-nowrap text-center absolute left-1/2 transform -translate-x-1/2">
        software, paintings, drawings, research
      </p> */}
    </div>
  );
}
