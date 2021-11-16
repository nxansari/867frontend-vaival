import gsap from 'gsap';
import redirect from '../utils/redirect';

export default function Toast({ text, link }) {
	async function close() {
		await gsap.to('#toast', { opacity: 0 });
		await gsap.to('#toast', { visibility: 'hidden' });
	}
	return (
		<div className="flex justify-center items-center">
			<div
				id="toast"
				className="toast fixed md:bottom-5 bottom-24 md:right-5 text-white md:w-3/12 w-10/12 rounded-lg shadow-xl p-5 z-20"
			>
				<span className="absolute top-2 right-4 opacity-30" onClick={close}>
					✕
				</span>
				<span
					onClick={() => {
						close();
						redirect(link);
					}}
				>
					{text}
				</span>
			</div>
		</div>
	);
}
