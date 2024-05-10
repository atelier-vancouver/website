import Image from 'next/image';

export default function Home() {
  return (
    <div
      className="min-h-screen min-w-full relative bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('images/Paper 4.svg')` }}
    >
      <div className="absolute top-[11%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        <Image src="/images/mascots.svg" alt="mascots" width={462} height={154} />
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
      <Image
        src="/images/background.svg"
        alt="background"
        width={933}
        height={884}
        className="h-[100vh] w-[95vw] z-20"
      />
      <Image
        src="/images/strip.svg"
        alt="strip"
        width={1230}
        height={748}
        className="w-full mt-2 z-10 mr-[5%]"
      />

      <div className="mt-40 pl-32 pr-0 relative">
        <div className="bg-black py-1.5 px-3 inline-block">
          <h2 className="font-handwriting text-white text-2xl">WHAT WE DO</h2>
        </div>

        <div className="flex justify-between mt-4 relative">
          <div className="mt-8 w-3/4">
            <p className="font-hahmlet font-semibold text-5xl text-black-grey leading-snug">
              Atelier is an open co-working session for the curious.
            </p>
            <p className="font-hahmlet text-3xl text-black-grey mt-8">
              to be creative,
            </p>
            <p className="font-hahmlet font-semibold text-3xl text-black-grey mt-0.5">
              you need dedicated time to create.
            </p>
            <p className="font-hahmlet text-3xl text-black-grey mt-6">
              we explore our curiousity by{" "}
              <span className="font-semibold">making</span> things:
            </p>
          </div>
          <div className="w-1/4 relative">
            <Image src="/images/lightbulb.svg" alt="lightbulb" width={200} height={328} className="z-20" />
            <Image
              src="/images/background2.svg"
              alt="background2"
              width={380}
              height={549}
              className="absolute left-[0%] bottom-0"
            />
          </div>
        </div>
      </div>

      <p className="font-hahmlet font-semibold text-7xl mt-12 whitespace-nowrap text-center text-black-grey mx-auto">
        software, paintings, drawings, research
      </p>
      {/* <p className="font-hahmlet font-semibold text-7xl mt-12 whitespace-nowrap text-center absolute left-1/2 transform -translate-x-1/2">
        software, paintings, drawings, research
      </p> */}

      <div className="mt-40 pl-32 pr-24 relative">
        <div className="bg-black py-1.5 px-3 inline-block">
          <h2 className="font-handwriting text-white text-2xl">HOW IT WORKS</h2>
        </div>

        <div className="border-2 border-black flex mt-8">
          <div className="w-3/4 px-8 py-12 flex flex-col justify-between">
            <p className="font-hahmlet font-bold text-5xl text-black-grey">
              <span className="text-[#5721A0]">50 minutes</span> of work* time.
            </p>
            <p className="font-hahmlet font-bold text-5xl text-black-grey">
              <span className="text-[#2B6ECE]">10 minute</span> break.
            </p>
            <p className="font-hahmlet font-bold text-5xl text-black-grey">
              Another 50 minute block.
            </p>
            <div className="flex flex-col justify-end space-y-1">
              <p className="font-hahmlet font-bold text-5xl text-black-grey">
                <span className="text-[#BC004C]">Demos</span> after!
              </p>
              <p className="font-hahmlet font-bold text-4xl text-[#005F04]">
                (+ free snacks, always)
              </p>
            </div>
          </div>
          <div className="w-1/4">
            <Image src="/images/food.svg" alt="food" width={298} height={399} className="w-full" />
          </div>
        </div>

        <p className="mt-4 mx-auto mx-8 text-[#555555] text-lg font-hahmlet leading-snug">
          <span className="font-bold">*NO</span> school or co-op work is
          allowed! There are other co-working spaces that exist for studying,
          working, etc. This space is not one of them. We do this to encourage
          our members to show up for themselves and pursue what they don’t make
          time for.
        </p>
      </div>

      <div className="mt-80 pb-40 relative">

        <Image
          src="/images/background3.svg"
          alt="background3"
          width={1247}
          height={563}
          className="absolute inset-0 w-full h-full z-0 object-cover"
        />

        <div className="absolute left-[2%] right-0 -top-24 h-[0.5px] bg-black z-10" />

        <div className="pl-32 pr-24 relative flex z-20">
          <div className="w-3/4 mt-16">
            <p className="font-hahmlet font-bold text-4xl text-black-grey">
              Pushing off that side project?
            </p>
            <p className="mt-4 font-handwriting font-bold text-5xl text-black-grey uppercase">
              It's time to start.
            </p>

            <div className="mt-8 relative flex space-x-4">
              <button className="relative font-handwriting font-semibold text-2xl text-off-white bg-black hover:bg-[#706F6B] transition-colors duration-500 ease-in-out px-6 py-2 mt-4 border-[0.5px] border-black-grey rounded-md shadow-lg after:absolute after:-bottom-[4px] after:-right-[4px] after:w-[calc(100%+4px)] after:h-[calc(100%+4px)] after:border-b-4 after:border-r-4 after:border-black-grey after:rounded-md after:bg-off-black after:z-[-1]">
                JOIN US THIS SUNDAY
              </button>
              <button className="relative font-handwriting font-semibold text-2xl text-off-black bg-off-white hover:bg-[#706F6B] transition-colors duration-500 ease-in-out px-6 py-2 mt-4 border-[0.5px] border-black rounded-md shadow-lg after:absolute after:-bottom-[4px] after:-right-[4px] after:w-[calc(100%+4px)] after:h-[calc(100%+4px)] after:border-b-4 after:border-r-4 after:border-black after:rounded-md after:bg-off-white after:z-[-1]">
                GET UPDATES ON INSTAGRAM
              </button>
            </div>
          </div>

          <div className="w-1/4">
            <Image src="/images/easel.svg" alt="easel" width={261} height={366} />
          </div>
        </div>
      </div>
    </div>
  );
}
