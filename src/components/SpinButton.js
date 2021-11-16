export default function SpinButton({ disabled, onClick, value }) {
	return (
		<button
			className="spin-button py-2 px-12 transform-gpu hover:scale-90 scale-100 transition-all ease-in md:relative fixed bottom-5 md:w-auto w-5/6"
			disabled={disabled}
			onClick={onClick}
		>
			<h2 className="uppercase">{value}</h2>
		</button>
	);
}
