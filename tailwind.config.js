/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wpDarkBg: "#0b141a",
        wpDarkHeader: "#202c33",
        wpIncoming: "#202c33",
        wpOutgoing: "#005c4b",
        // add/replace inside theme.extend.colors
wpLightBG: "#ECE5DD",          // chat area background
wpLightIncoming: "#FFFFFF",    // white bubbles
wpLightOutgoing: "#E1F7CB",    // WhatsApp green-ish bubbles (iOS-like)
wpLightHeader: "#F7F8FA",      // top app bar
wpAccent: "#00A884",           // WhatsApp green
wpTickGrey: "#8899a6",
wpTickBlue: "#34B7F1",
wpIosHeader: "#F2F3F5",
wpIosIncoming: "#FFFFFF",
wpIosOutgoing: "#DCF8C6",
wpIosText: "#111B21",
wpIosTimestamp: "#667781",
wpIosAccent: "#00A884"


      },
    },
  },
  plugins: [],
};
