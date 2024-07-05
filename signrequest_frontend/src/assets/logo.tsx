const logo = () => {
  return (
    <div>
      <svg
        width="30"
        height="30"
        viewBox="0 0 37 49"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
      >
        <rect width="37" height="49" fill="url(#pattern0)" />
        <defs>
          <pattern
            id="pattern0"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use
              xlinkHref="#image0_9_88"
              transform="matrix(0.0206926 0 0 0.015625 -0.162162 0)"
            />
          </pattern>
          <image
            id="image0_9_88"
            width="64"
            height="64"
            xlinkHref="data:image/png;base64,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"
          />
        </defs>
      </svg>
    </div>
  );
};

export default logo;
