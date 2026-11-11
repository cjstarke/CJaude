import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import DiceIcon from "./DiceIcon";
import CalculatorIcon from "./CalculatorIcon";
import EightBallIcon from "./EightBallIcon";
import ClockIcon from "./ClockIcon";
import LightningIcon from "./WeatherIcon";
import WeatherIcon from "./WeatherIcon";
gsap.registerPlugin(useGSAP);

const ROLL_SPEED = 300;

function setUpRolling(container, contextSafe) {
  const tile = container.querySelector(".roll");
  let hovering = false;
  let rolling = false;

  // Measured often, since dragging the divider changes the width
  const getRoomToRoll = () => container.clientWidth - tile.offsetWidth;

  const rollTo = contextSafe((edge) => {
    const targetX = edge === "right" ? getRoomToRoll() : 0;

    gsap.to(tile, {
      x: targetX,
      // Tie the spin to the distance travelled so it rolls instead of sliding
      rotation: (targetX / (Math.PI * tile.offsetWidth)) * 360,
      duration: Math.abs(targetX - gsap.getProperty(tile, "x")) / ROLL_SPEED,
      ease: "sine.inOut",
      onComplete: () => {
        // Always finish the route: out to the edge means coming back too.
        // Only once it's home do we check whether to go again.
        if (edge === "right") {
          rollTo("left");
        } else if (hovering && getRoomToRoll() > 0) {
          rollTo("right");
        } else {
          rolling = false;
        }
      },
    });
  });

  const startRolling = () => {
    hovering = true;
    if (rolling || getRoomToRoll() <= 0) return;
    rolling = true;
    rollTo("right");
  };

  const stopRolling = () => {
    hovering = false;
  };

  container.addEventListener("mouseenter", startRolling);
  container.addEventListener("mouseleave", stopRolling);

  return () => {
    container.removeEventListener("mouseenter", startRolling);
    container.removeEventListener("mouseleave", stopRolling);
  };
}

function Greeting() {
  const rootRef = useRef(null);

  useGSAP(
    (context, contextSafe) => {
      const containers = rootRef.current.querySelectorAll(".roll-container");
      const cleanups = [...containers].map((container) =>
        setUpRolling(container, contextSafe),
      );

      return () => cleanups.forEach((cleanup) => cleanup());
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="w-full flex flex-col">
      <h1 className="self-center mb-frame inline-block border-2 border-black bg-frameYellow px-frame py-2 text-lg lg:text-2xl lg:text-4xl font-normal shadow-frame rounded-sm">
        Hi, I&apos;m <span className="font-semibold">CJ</span>aude
      </h1>
      <p className="text-sm lg:text-base pt-10 pb-4">Here are some of my specialties:</p>
      <div className="roll-container w-full flex items-end mb-6">
        <div className="roll rounded-sm border-black border-2 shadow-frame w-14 h-14 lg:w-20 lg:h-20 bg-frameLime flex items-center justify-center  shrink-0">
          <div className="w-10 lg:w-16 ">
            <DiceIcon />
          </div>
        </div>
        <div className="pl-8 flex flex-col lg:flex-row lg:items-baseline lg:gap-3">
          <h3 className="font-bold text-lg lg:text-2xl">Dice Roll</h3>
          <p className="italic text-sm lg:text-base font-light text-gray-500">
            ex: "roll 2d20", "roll a d6"
          </p>
        </div>
      </div>
      <div className="roll-container w-full flex items-end mb-6">
        <div className="roll rounded-sm border-black border-2 shadow-frame w-14 h-14 lg:w-20 lg:h-20 bg-frameYellow flex items-center justify-center  shrink-0">
          <div className="w-10 lg:w-16 ">
            <CalculatorIcon />
          </div>
        </div>
        <div className="pl-8 flex flex-col lg:flex-row lg:items-baseline lg:gap-3">
          <h3 className="font-bold text-lg lg:text-2xl">Calculator</h3>
          <p className="italic text-sm lg:text-base font-light text-gray-500">
            ex: "17 * 23 + 4", "what's 2 to the 10th?"
          </p>
        </div>
      </div>
      <div className="roll-container w-full flex items-end mb-6">
        <div className="roll rounded-sm border-black border-2 shadow-frame w-14 h-14 lg:w-20 lg:h-20 bg-frameLime flex items-center justify-center  shrink-0">
          <div className="w-10 lg:w-16 ">
            <EightBallIcon />
          </div>
        </div>
        <div className="pl-8 flex flex-col lg:flex-row lg:items-baseline lg:gap-3">
          <h3 className="font-bold text-lg lg:text-2xl">Magic 8 Ball</h3>
          <p className="italic text-sm lg:text-base font-light text-gray-500">
            ex: "8 ball, will I win?", "8 ball, should I nap?"
          </p>
        </div>
      </div>
      <div className="roll-container w-full flex items-end mb-6">
        <div className="roll rounded-sm border-black border-2 shadow-frame w-14 h-14 lg:w-20 lg:h-20 bg-frameYellow flex items-center justify-center  shrink-0">
          <div className="w-10 lg:w-16 ">
            <ClockIcon />
          </div>
        </div>
        <div className="pl-8 flex flex-col lg:flex-row lg:items-baseline lg:gap-3">
          <h3 className="font-bold text-lg lg:text-2xl">Clock</h3>
          <p className="italic text-sm lg:text-base font-light text-gray-500">
            ex: "what time is it?", "what day is it?"
          </p>
        </div>
      </div>
      <div className="roll-container w-full flex items-end mb-6">
        <div className="roll rounded-sm border-black border-2 shadow-frame w-14 h-14 lg:w-20 lg:h-20 bg-frameLime flex items-center justify-center  shrink-0">
          <div className="w-10 lg:w-16 ">
            <WeatherIcon />{" "}
          </div>
        </div>
        <div className="pl-8 flex flex-col lg:flex-row lg:items-baseline lg:gap-3">
          <h3 className="font-bold text-lg lg:text-2xl">Weather</h3>
          <p className="italic text-sm lg:text-base font-light text-gray-500">
            ex: "weather in Tokyo", "is it raining in Paris?"
          </p>
        </div>
      </div>
    </div>
  );
}

export default Greeting;
