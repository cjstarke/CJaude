import { useRef, useState } from "react";
import Greeting from "./components/Greeting";
import Chat from "./components/Chat";

const MIN_PERCENT = 20; // neither side can be dragged smaller than this
const MAX_PERCENT = 80;
const KEYBOARD_STEP = 5; // how far one arrow key press moves the divider

function clampPercent(percent) {
  return Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, percent));
}

function App() {
  const [leftPercent, setLeftPercent] = useState(50); // left section's share of the width
  const leftRef = useRef(null);
  const rightRef = useRef(null);
  const drag = useRef(null); // where the current drag started (null when not dragging)

  function startDrag(event) {
    // Keep receiving moves even if the pointer slides off the divider
    event.currentTarget.setPointerCapture(event.pointerId);
    const leftWidth = leftRef.current.getBoundingClientRect().width;
    const rightWidth = rightRef.current.getBoundingClientRect().width;
    drag.current = {
      startX: event.clientX,
      leftWidth,
      totalWidth: leftWidth + rightWidth,
    };
  }

  function moveDrag(event) {
    if (!drag.current) return;
    const { startX, leftWidth, totalWidth } = drag.current;
    const newLeftWidth = leftWidth + event.clientX - startX;
    setLeftPercent(clampPercent((newLeftWidth / totalWidth) * 100));
  }

  function endDrag() {
    drag.current = null;
  }

  // Lets keyboard users move the divider with the arrow keys
  function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
      setLeftPercent((percent) => clampPercent(percent - KEYBOARD_STEP));
    } else if (event.key === "ArrowRight") {
      setLeftPercent((percent) => clampPercent(percent + KEYBOARD_STEP));
    }
  }

  // The widths only apply at the lg: breakpoint, so mobile stays stacked
  return (
    <div
      className="flex min-h-screen flex-col lg:flex-row items-stretch px-8"
      style={{ "--left": leftPercent, "--right": 100 - leftPercent }}
    >
      <div ref={leftRef} className="min-w-0 lg:flex-[var(--left)_1_0%] h-min-screen py-8">
        <Greeting />
      </div>

      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Resize sections"
        aria-valuemin={MIN_PERCENT}
        aria-valuemax={MAX_PERCENT}
        aria-valuenow={Math.round(leftPercent)}
        tabIndex={0}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={handleKeyDown}
        className="group hidden w-4 shrink-0 cursor-col-resize touch-none select-none justify-center self-stretch lg:flex"
      >
        <div className="w-0.5 bg-black group-hover:w-1 group-active:w-1" />
      </div>

      <div ref={rightRef} className="min-w-0 lg:flex-[var(--right)_1_0%] lg:h-screen lg:sticky lg:top-0">
        <Chat />
      </div>
    </div>
  );
}

export default App;
