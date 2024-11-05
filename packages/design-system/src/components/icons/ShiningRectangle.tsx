const ShiningRectangle = ({ width, height, fill }: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 33 17" fill="none">
            <path opacity="0.72" d="M1.5 6.49999C4.21544 3.5 8.5 3.16722e-08 16.5 3.16744e-08C23.5 3.16764e-08 28 3.49999 31 6.49999C35.2246 10.7245 29.9259 17 23.9515 17H16.5H8.51158C2.63802 17 -2.44158 10.8546 1.5 6.49999Z" fill="url(#paint0_radial_2740_14289)" />
            <defs>
                <radialGradient id="paint0_radial_2740_14289" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(16 -4.5) rotate(90) scale(19.5 45.5)">
                    <stop stopColor="white" />
                    <stop offset="1" stopColor="white" stopOpacity="0" />
                </radialGradient>
            </defs>
        </svg>
    );
};

export default ShiningRectangle;