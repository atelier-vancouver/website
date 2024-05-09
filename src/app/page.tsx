export default function Home() {
  return (
    <div
      className="min-h-screen min-w-full relative bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('images/Paper 4.svg')` }}
    >
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
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
        className="h-[100vh] w-[95vw]"
      />
    </div>
  );
}
