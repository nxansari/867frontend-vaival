module.exports = {
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		extend: {},
		fontFamily: {
			bold: ['Scania Sans CY Headline Bold'],
			sans: ['Scania Sans CY'],
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
