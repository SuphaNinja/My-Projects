/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {

    extend: {
      writingMode: {
        'vertical-rl': 'vertical-rl',
      },
      textOrientation: {
        'mixed': 'mixed',
      },
      colors: {
        default: "#F6F4E8",
        primary: "#BACEC1",
        secondary: "#E59560",
        important: "#1D3124",
        white: "#ffffff"
      },
      scrollSnapType: {
        y: 'y proximity',
      },
      scrollSnapAlign: {
        start: 'start',
      },
      scrollBehavior: {
        smooth: 'smooth',
      },
      scrollMargin: {
        top: '5px', // Adjust this value as needed for smoother effect
      },
    },
  },
  variants: {
    extend: {
      overflow: ['responsive'], // If you want responsive overflow classes
      scrollSnapType: ['responsive'],
      scrollSnapAlign: ['responsive'],
    },
  },
  plugins: [
    // Custom plugin to handle no-scrollbar
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none',
        },
        '.no-scrollbar': {
          '-ms-overflow-style': 'none', /* IE and Edge */
          'scrollbar-width': 'none', /* Firefox */
        },
        '.scroll-snap-x': {
          scrollSnapType: 'x mandatory',
        },
        '.scroll-snap-y': {
          scrollSnapType: 'y proximity',
        },
        '.scroll-snap-start': {
          scrollSnapAlign: 'start',
        },
        '.scroll-snap-center': {
          scrollSnapAlign: 'center',
        },
        '.scroll-snap-end': {
          scrollSnapAlign: 'end',
        },
        '.scroll-smooth': {
          scrollBehavior: 'smooth',
        },
        '.scroll-margin-top': {
          scrollMarginTop: '5px', /* Adjust as needed */
        },
        '.writing-mode-vertical-rl': {
          writingMode: 'vertical-rl',
        },
        '.text-orientation-mixed': {
          textOrientation: 'mixed',
        },
      });
    },
  ],
}

