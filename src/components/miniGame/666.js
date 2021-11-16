import React, { useState, useEffect } from 'react';
import Trophy from './Trophy.js';
import './miniGames.css';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import DefaultMinigame from './DefaultMinigame';

export default function Mini666(props) {
	const { executeRecaptcha } = useGoogleReCaptcha();

	const [hasSpun, setHasSpun] = useState(false);
	const [slots, setSlots] = useState([0, 1, 2]);
	const trophyNames = {
		0: 'SAFE',
		1: '-2x',
		2: '-3x',
	};
	const [names, setNames] = useState(trophyNames);
	const [chosen, setChosen] = useState(['', -1]);

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	async function reveal(trophyNum, trophyIndex) {
		if (!hasSpun || chosen[0] !== '') {
			return;
		}

		const recaptchaToken = await executeRecaptcha('minichoice');
		let res = await fetch(
			`https://api.867casino.com/minichoice?token=${localStorage.getItem(
				'token'
			)}&recaptchaToken=${recaptchaToken}&pick_trophy`
		);
		let json = await res.json();
		if (json['message'] === 'Invalid token') {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			window.location.reload();
		} else if (res.status != 200) {
			alert('No. ' + json['message']);
			return;
		}
		const picked_trophy = { 0: 0, 2: 1, 3: 2 }[json['result']];
		// const picked_trophy = 0;
		// The trophy that's chosen came from the backend, the other two are just frontend
		let result = [0, 1, 2];
		// index of trophy that was chosen and therefore has to be moved
		let oldIndex = result.findIndex((element) => element === picked_trophy);
		result[oldIndex] = result[trophyNum];
		result[trophyNum] = picked_trophy;

		const temp_names = result.map((num) => trophyNames[num]);
		await setNames(temp_names); // setting all the names to the result
		// changing to the right class and name for a trophy
		setChosen([temp_names[picked_trophy], trophyNum]);

		setTimeout(() => props.resetColor(), props.exitTime + 10);
		setTimeout(() => {
			props.setMiniGameComponent(null);
			props.setSpinDisabled(false);
		}, props.exitTime);
		setTimeout(props.refreshPoints());

		localStorage.removeItem('minigame');
	}

	async function spin() {
		let thirdDone = false;
		setTimeout(() => (thirdDone = true), 3000);
		setNames(['', '', '']);

		while (true) {
			await new Promise((r) => setTimeout(r, 100));
			let scrambled = shuffleArray([0, 1, 2]);
			if (thirdDone) {
				setHasSpun(true);
				break;
			}
			setSlots(scrambled);
		}
	}

	props.setSlotColor();

	useEffect(() => {
		if (props.spinPressed) {
			spin();
			props.setSpinDisabled(true);
		}
	}, [props.spinPressed]);

	return (
		<DefaultMinigame>
			<div className={`Mini666`}>
				<p>
					Watch these cups closely, for only one will allow you to pass safely. The others? They
					multiply the amount of points you LOSE!
				</p>
				<Trophy
					trophyText={names[slots[0]]}
					trophyClass={`trophy-${slots[0]} ${
						chosen[1] === slots[0] && `trophy-${slots[0]}-chosen`
					}`}
					onClick={() => reveal(slots[0], 0)}
				/>
				<Trophy
					trophyText={names[slots[1]]}
					trophyClass={`trophy-${slots[1]} ${
						chosen[1] === slots[1] && `trophy-${slots[1]}-chosen`
					}`}
					onClick={() => reveal(slots[1], 1)}
				/>
				<Trophy
					trophyText={names[slots[2]]}
					trophyClass={`trophy-${slots[2]} ${
						chosen[1] === slots[2] && `trophy-${slots[2]}-chosen`
					}`}
					onClick={() => reveal(slots[2], 2)}
				/>
			</div>
		</DefaultMinigame>
	);
}
