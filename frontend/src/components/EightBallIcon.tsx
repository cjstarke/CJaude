const EightBallIcon = () => {
  return (
    <div className="w-full max-w-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 240"
        role="img"
        aria-label="Magic eight ball"
      >
        <circle cx="120" cy="120" r="106" fill="#0A0A0A" />
        <circle cx="120" cy="126" r="56" fill="#FFFFFF" />

        <path
          fill="#0A0A0A"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M120 86c-22 0-35 11-35 27 0 9 5 17 13 22-10 5-16 14-16 24 0 18 15 29 38 29s38-11 38-29c0-10-6-19-16-24 8-5 13-13 13-22 0-16-13-27-35-27Zm0 15c10 0 17 5 17 13s-7 13-17 13-17-5-17-13 7-13 17-13Zm0 40c12 0 20 6 20 15s-8 16-20 16-20-7-20-16 8-15 20-15Z"
        />
      </svg>
    </div>
  );
};

export default EightBallIcon;
