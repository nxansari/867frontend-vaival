import VolumeOnIcon from '../img/volumeOn.svg';
import VolumeOffIcon from '../img/volumeOff.svg';
import { useEffect, useState } from 'react';

export default function MusicToggle({ musicRef, playAudio, json }) {
	const [icon, setIcon] = useState(VolumeOffIcon);
	useEffect(
		() =>
			setInterval(() => {
				try {
					setIcon(musicRef.current.paused ? VolumeOffIcon : VolumeOnIcon);
				} catch {
					setIcon(VolumeOffIcon);
				}
			}, 20),
		[]
	);
	return (
		<div
			onClick={() => playAudio(json)}
			className={
				'z-10 fixed rounded-full top-5 left-5 bg-gray-200 hover:bg-gray-400 transition-all cursor-pointer p-3 text-white shadow-lg'
			}
		>
			<img src={icon} alt="Mute" className="mute-icon" />
		</div>
	);
}
