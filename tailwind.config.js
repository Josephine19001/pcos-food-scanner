const { hairlineWidth } = require("nativewind/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./supabase/**/*.{js,ts,jsx,tsx}",
	],
	presets: [require("nativewind/preset")],
	theme: {
		extend: {
			colors: {
				black: "#0D0D0D",
				white: "#FFFFFF",
				gray: {
					100: "#F3F3F3",
					300: "#D1D1D1",
					500: "#A1A1A1",
					700: "#4B4B4B",
					900: "#1A1A1A",
				},
				brand: {
					DEFAULT: "#1C1C1C",
				},
			},
			borderWidth: {
				hairline: hairlineWidth(),
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" },
				},
			},
		},
	},
	plugins: [require("tailwindcss-animate"), require("nativewind/preset")],
};
