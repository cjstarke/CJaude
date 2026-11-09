const WeatherIcon = () => {
  return (
    <div className="w-full max-w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 240"
        role="img"
        aria-label="Lightning cloud"
      >
        <g transform="translate(0 -20)">
          <path
            fill="#0A0A0A"
            d="M72 102c4-30 29-52 60-52 33 0 61 26 62 60 19 5 32 22 32 42 0 24-19 43-43 43H62c-27 0-48-21-48-48s21-48 48-48c3 0 7 1 10 3Z"
          />
          <path
            fill="#0A0A0A"
            d="M124 174h35l-22 27h19l-49 38 14-28H96l28-37Z"
          />
        </g>
      </svg>
    </div>
  );
};

export default WeatherIcon;
