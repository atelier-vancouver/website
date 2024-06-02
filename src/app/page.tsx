"use client";
import { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive';

import Image from 'next/image';
import BlackButton from './components/BlackButton';
import WhiteButton from './components/WhiteButton';


export default function Home() {

  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [word, setWord] = useState('CREATE');
  const words = ['CREATE', 'BUILD', 'DREAM', 'PLAY'];

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      index = index + 1 === words.length ? 0 : index + 1;
      setWord(words[index]);
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="min-h-screen min-w-full relative bg-cover bg-no-repeat"
      style={{ backgroundImage: `url('images/Paper 4.svg')` }}
    >
      <div className="absolute top-[9.5%] md:top-[10%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
        <Image src="/images/mascots.svg" alt="mascots" width={isMobile ? 239: 462} height={isMobile ? 79: 154} />
        <h1 className="font-hahmlet tracking-tighter font-semibold text-7xl md:text-9xl text-off-black tracking-tighter -mt-4 md:-mt-8">
          atelier
        </h1>
        <p className="font-hahmlet tracking-tighter font-bold text-md md:text-2xl text-off-black text-center mt-2">
          we gather weekly to <span className="font-handwriting">{word}</span>
        </p>
        <WhiteButton text="JOIN US THIS SUNDAY" />
        <p className="mt-4 font-ibm font-light uppercase">📍 Vancouver, BC</p>
      </div>
      <Image
        src="/images/background.svg"
        alt="background"
        width={isMobile ? 450 : 933}
        height={isMobile ? 450 : 884}
        className="h-[100vh] w-[95vw] z-20"
      />
      <Image
        src="/images/white_strip.svg"
        alt="strip"
        width={1230}
        height={748}
        className="w-full mt-2 z-10 mr-[5%]"
      />

      <Image
        src="/images/people1.svg"
        alt="people1"
        width={704}
        height={509}
        className="absolute top-[21%] left-[10%] transform -rotate-4"
      />
      <Image
        src="/images/people2.svg"
        alt="people2"
        width={569}
        height={438}
        className="absolute top-[23%] left-[50%] transform rotate-0"
      />
      <Image
        src="/images/people3.svg"
        alt="people3"
        width={646}
        height={398}
        className="absolute top-[28.5%] left-[27%]"
      />

      <div className="mt-40 pl-32 pr-0 relative">
        <div className="bg-black py-1.5 px-3 inline-block">
          <h2 className="font-handwriting text-white text-2xl">WHAT WE DO</h2>
        </div>

        <div className="flex justify-between mt-4 relative">
          <div className="mt-8 w-3/4">
            <p className="font-hahmlet tracking-tighter font-semibold text-5xl text-black-grey leading-snug">
              Atelier is an open co-working session for the curious.
            </p>
            <p className="font-hahmlet tracking-tighter text-3xl text-black-grey mt-8">
              to be creative,
            </p>
            <p className="font-hahmlet tracking-tighter font-semibold text-3xl text-black-grey mt-0.5">
              you need dedicated time to create.
            </p>
            <p className="font-hahmlet tracking-tighter text-3xl text-black-grey mt-6">
              we explore our curiosity by{" "}
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

      {/* <p className="font-hahmlet font-semibold text-7xl mt-12 whitespace-nowrap text-center text-black-grey mx-auto">
        software, paintings, drawings, research
      </p> */}
      
      <div className="overflow-hidden w-full mt-12">
        <div className="flex animate-scroll-left" style={{ height: 'auto', minHeight: 'calc(1.5em * 7)' }}>
          <p className="font-hahmlet tracking-tighter font-semibold text-7xl text-black-grey whitespace-nowrap mx-auto">
            software, paintings, drawings, research,&nbsp;
          </p>
          <p className="font-hahmlet tracking-tighter font-semibold text-7xl text-black-grey whitespace-nowrap mx-auto">
            software, paintings, drawings, research,&nbsp;
          </p>
          <p className="font-hahmlet tracking-tighter font-semibold text-7xl text-black-grey whitespace-nowrap mx-auto">
            software, paintings, drawings, research,&nbsp;
          </p>
          <p className="font-hahmlet tracking-tighter font-semibold text-7xl text-black-grey whitespace-nowrap mx-auto">
            software, paintings, drawings, research,&nbsp;
          </p>
        </div>
      </div>

      <div className="mt-40 pl-32 pr-24 relative">
        <div className="bg-black py-1.5 px-3 inline-block">
          <h2 className="font-handwriting text-white text-2xl">HOW IT WORKS</h2>
        </div>

        <div className="border-2 border-black flex mt-8">
          <div className="w-3/4 px-8 py-12 flex flex-col justify-between">
            <p className="font-hahmlet tracking-tighter font-bold text-5xl text-black-grey">
              <span className="text-[#5721A0]">50 minutes</span> of work* time.
            </p>
            <p className="font-hahmlet tracking-tighter font-bold text-5xl text-black-grey">
              <span className="text-[#2B6ECE]">10 minute</span> break.
            </p>
            <p className="font-hahmlet tracking-tighter font-bold text-5xl text-black-grey">
              Another 50 minute block.
            </p>
            <div className="flex flex-col justify-end space-y-1">
              <p className="font-hahmlet tracking-tighter font-bold text-5xl text-black-grey">
                <span className="text-[#BC004C]">Demos</span> after!
              </p>
              <p className="font-hahmlet tracking-tighter font-bold text-4xl text-[#005F04]">
                (+ free snacks, always)
              </p>

              <Image
                src="/images/green_mascot.svg"
                alt="green mascot"
                width={199}
                height={268}
                className="absolute left-0 -bottom-8"
                style={{ zIndex: 1000 }}
              />
            </div>
          </div>
          <div className="w-1/4">
            <Image src="/images/food.svg" alt="food" width={298} height={399} className="w-full" />
          </div>
        </div>

        <p className="mt-4 mx-auto mx-8 text-[#555555] text-lg font-hahmlet tracking-tighter leading-snug">
          <span className="font-bold">*NO</span> school or co-op work is
          allowed! There are other co-working spaces that exist for studying,
          working, etc. This space is not one of them. We do this to encourage
          our members to show up for themselves and pursue what they don’t make
          time for.
        </p>
      </div>

      <div className="mt-80 pb-48 relative">

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
            <p className="font-hahmlet tracking-tighter font-bold text-4xl text-black-grey">
              Pushing off that side project?
            </p>
            <p className="mt-4 font-handwriting font-bold text-5xl text-black-grey uppercase">
              It&apos;s time to start.
            </p>

            <div className="mt-8 relative flex space-x-4">
              <BlackButton text="JOIN US THIS SUNDAY" />
              <WhiteButton text="GET UPDATES ON INSTAGRAM" />
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
