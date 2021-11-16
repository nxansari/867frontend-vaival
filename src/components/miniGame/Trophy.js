export default function Trophy({ trophyText, trophyClass, onClick }) {
	// Used in Mini666

	return (
		<div
			id="trophy"
			className={`trophy slot-number flex justify-center items-center ${trophyClass}`}
			onClick={onClick}
		>
			<svg
				version="1.2"
				baseProfile="tiny-ps"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 36 36"
				width="36"
				height="36"
			>
				<title>trophy-svg</title>
				<path id="Layer" fill="none" d="M-6 -6L42 -6L42 42L-6 42L-6 -6Z" />
				<path
					id="Layer"
					fillRule="evenodd"
					fill="#efc42a"
					d="M36 8L36 10C36 15.1 32.16 19.26 27.22 19.88C25.96 22.88 23.26 25.14 20 25.8L20 32L28 32L28 36L8 36L8 32L16 32L16 25.8C12.74 25.14 10.04 22.88 8.78 19.88C3.84 19.26 0 15.1 0 10L0 8C0 5.8 1.8 4 4 4L8 4L8 0L28 0L28 4L32 4C34.2 4 36 5.8 36 8ZM8 15.64L8 8L4 8L4 10C4 12.6 5.68 14.8 8 15.64ZM24 16L24 4L12 4L12 16C12 19.3 14.7 22 18 22C21.3 22 24 19.3 24 16ZM32 8L28 8L28 15.64C30.32 14.8 32 12.6 32 10L32 8Z"
				/>
			</svg>
			<h1>{trophyText}</h1>
		</div>
	);
}
