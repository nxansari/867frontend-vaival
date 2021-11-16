import React, { useEffect, useState, useRef } from 'react';
import SpinButton from './SpinButton';
import Bracket from '../img/Slot machine bracket.png';
import gsap from 'gsap';
import Countdown from 'react-countdown';
import useWindowSize from '../hooks/useWindowSize';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import moment from 'moment';
import MusicToggle from './MusicToggle';
import getWinSound from '../utils/getWinSound';
import getMiniGameData from '../utils/getMiniGameData';

// import { Mini666, Mini777, Mini867, Mini911 } from "./miniGame/index.js";

function getPreviousNumber(x) {
	if (x === 0) {
		return 11;
	}
	return x - 1;
}
function getNextNumber(x) {
	if (x === 11) {
		return 0;
	}
	return x + 1;
}
function randomDigit() {
	return Math.floor(Math.random() * 10);
}
function isSpecial(x) {
	if (x === 8 || x === 6 || x === 7) {
		return true;
	} else {
		return false;
	}
}

export default function SlotMachine({ points, setPoints, setSignupVisible, setSpins, spins }) {
	const { executeRecaptcha } = useGoogleReCaptcha();
	const { width, height } = useWindowSize();
	const [slots, setSlots] = useState([0, 0, 0]);
	const [intermissionActive, setIntermissionActive] = useState(false);
	const [spinDisabled, setSpinDisabled] = useState(false);
	const [roundData, setRoundData] = useState(null);
	const [previousResult, setPreviousResult] = useState([]);
	const [MiniGameComponent, setMiniGameComponent] = useState(null);
	const [slotMachineColor, setSlotMachineColor] = useState('#b826bb');
	const [multiplier, setMultiplier] = useState(1);
	const [greenSpins, setGreenSpins] = useState(0);
	const [spinText, setSpinText] = useState('Spin');

	useEffect(() => {
		const stored_minigame = localStorage.getItem('minigame');
		// I guess we could try storing it?
		// const green_spins = localStorage.getItem('green_spins');
		// if (green_spins) {
		// 	setGreenSpins(green_spins);
		// }
		if (stored_minigame !== null && stored_minigame !== JSON.stringify([7, 7, 7])) {
			let { color, component } = getMiniGameData(stored_minigame);
			if (color && MiniGameComponent === null) {
				setSpinDisabled(false);
				setSlotMachineColor(color);
				setMiniGameComponent(() => component);
			}
		}
		if (stored_minigame === JSON.stringify([7, 7, 7])) {
			setSlotMachineColor('#1ac21a');
		}
	}, []);

	let musicRef = useRef();
	// let [winSound, setWinSound] = useState('https://cdn.867casino.com/win.wav');
	let winSoundRef = useRef();
	let [winSound, setWinSound] = useState(null);

	const getCSSVar = (value) => {
		return getComputedStyle(document.documentElement).getPropertyValue(value).trim();
	};

	useEffect(async () => {
		const res = await fetch('https://api.867casino.com/round_status');
		const json = await res.json();
		setRoundData(json);

		setIntermissionActive(!json.can_spin);
		setSpinDisabled(!json.can_spin);

		// TODO: comment out
		// setIntermissionActive(false);
		// setSpinDisabled(false);

		if (json.iteration != 3) {
			// Change to 3 for normal
			document.body.classList.add('rainbow');
		}
	}, []);

	function resetColor() {
		setSlotMachineColor('#b826bb');
		document.documentElement.style.setProperty(`--slot-machine-border`, '#b826bb');
		setSpinText('Spin');
	}
	async function refreshPoints() {
		let token = localStorage.getItem('token');
		if (token == null) return;
		let res = await fetch(`https://api.867casino.com/me?token=${token}`);
		if (res.status === 403) {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			window.location.reload();
		}
		let json = await res.json();
		setPoints(json['points']);
	}

	async function spin() {
		setSpinDisabled(true);

		if (MiniGameComponent) return;

		const recaptchaToken = await executeRecaptcha('spin');
		let res = await fetch(
			` https://api.867casino.com/spin?token=${localStorage.getItem(
				'token'
			)}&recaptchaToken=${recaptchaToken}`
		);
		let json = await res.json();
		if (json['message'] === 'Invalid token') {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			window.location.reload();
		} else if (res.status != 200) {
			alert('Spin failed, ' + json['message']);
			setSpinDisabled(false);
			return;
		}

		let nums = json['result'];
		let win = json['win'];
		let minigame_name = json['minigame'];

		// let nums = [7, 7, 7, 300, 2];
		//let nums = [6, 6, 6, -250, 2];
		// let nums = [9, 1, 1, 200, 3];
		// let nums = [8, 6, 7, 500, 8];
		// let win = true;
		//console.log(nums);

		// console.log("MINIGAME:", minigame_name);
		// TODO: Add checker that the minigame in the backend is same as frontend
		// console.log("TEST:", JSON.stringify(nums) == `[${nums[0]},${nums[1]},${nums[2]}]`);
		// console.log("sdfsd:", !minigame_name);
		// if (minigame_name !== stored_minigame && minigame_name) {
		// 	localStorage.setItem('minigame', `[${minigame_name[0]},${minigame_name[1]},${minigame_name[2]}]`);
		// 	window.location.reload();
		// }
		// if (!minigame_name && stored_minigame) {
		// 	localStorage.removeItem('minigame');
		// 	setMiniGameComponent(() => null);
		// }

		if (slotMachineColor === '#1ac21a') {
			setGreenSpins(greenSpins + 1);
		}

		let firstDone = false;
		let secondDone = false;
		let thirdDone = false;
		setTimeout(() => (firstDone = true), 1000);
		setTimeout(() => (secondDone = true), 2000);
		setTimeout(() => (thirdDone = true), 3000);

		// // Get corresponding mini game
		// let { color, component } = getMiniGameData(nums);
		//
		// if (color && MiniGameComponent === null) {
		//     setSlotMachineColor(color);
		//     setMiniGameComponent(() => component);
		//     // console.log(component);
		//     //Change the color back once the minigame is over
		// }

		while (true) {
			await new Promise((r) => setTimeout(r, 30));
			let scrambled = [randomDigit(), randomDigit(), randomDigit()];
			if (thirdDone) {
				setSlots(nums);
				break;
			}
			if (secondDone) {
				setSlots([nums[0], nums[1], scrambled[2]]);
				continue;
			}
			if (firstDone) {
				setSlots([nums[0], scrambled[1], scrambled[2]]);
				continue;
			}
			setSlots(scrambled);
		}
		if (win) {
			if (localStorage.getItem('token') === null) {
				setSignupVisible(true);
				document.body.style.overflow = 'hidden';
				new Promise((r) => setTimeout(() => gsap.to('#modal', { right: 0 }), 10));
			}

			// Play sound accordingly
			nums.pop();
			nums.pop();
			let sound = getWinSound(previousResult, nums);
			if (sound != null) {
				setWinSound(`https://cdn.867casino.com/${sound}`);
				winSoundRef.current.play().catch((err) => {
					console.log('Win sound not allowed to play');
				});
			}

			// getCSSVar(`--slot-machine-border`) === getCSSVar(`--default-slot-machine-border`)
			if (!minigame_name) {
				// Get corresponding mini game
				let { color, component } = getMiniGameData(JSON.stringify(nums));
				if (color && MiniGameComponent === null) {
					localStorage.setItem('minigame', JSON.stringify(nums));

					setSpinDisabled(false);
					setSlotMachineColor(color);
					setMiniGameComponent(() => component);
					// console.log(component);
					//Change the color back once the minigame is over
				}
			}

			setPreviousResult(nums);
		}

		// setSpins(spins + 1);
		setSpinDisabled(false);

		// 9 will ultimately be 10 spins
		if (greenSpins >= 9) {
			setGreenSpins(0);
			resetColor();
			localStorage.removeItem('minigame');
		}
		refreshPoints();
	}

	function getSeconds(x) {
		let hourSeconds = x.hours() * 3600;
		let minuteSeconds = x.minutes() * 60;
		return hourSeconds + minuteSeconds + x.seconds();
	}

	function getMusicPosition(json) {
		const countdownText = document.getElementById('countdown').firstChild.innerText;
		let timeNow = moment(now());
		let roundEnd = moment(timeNow).add(getSeconds(moment(countdownText, 'hh:mm:ss')), 'seconds');
		let diff = roundEnd.diff(timeNow, 'seconds');
		let iterationTime = (json.iteration === 3 ? 30 : 90) * 60;
		let position = iterationTime - diff;

		return position;
	}

	function playAudio(json) {
		if (musicRef.current.paused) {
			musicRef.current.currentTime = getMusicPosition(json);
			musicRef.current.play();
		} else {
			musicRef.current.pause();
		}
	}

	function convertTZ(date, tzString) {
		return new Date(
			(typeof date === 'string' ? new Date(date) : date).toLocaleString('en-US', {
				timeZone: tzString,
			})
		);
	}

	function getDate() {
		let iteration = roundData.iteration;
		let lastIteratedString = roundData.last_iterated.split(' ');
		let lastIteratedDate = lastIteratedString[0].split(':');
		let lastIteratedTime = lastIteratedString[1].split(':');
		let lastIterated = new Date(
			lastIteratedDate[0],
			lastIteratedDate[1] - 1,
			lastIteratedDate[2],
			lastIteratedTime[0],
			lastIteratedTime[1],
			lastIteratedTime[2]
		);

		if (iteration === 3) {
			let nextRound = moment(lastIterated).add(30, 'm').toDate();
			return nextRound;
		} else {
			let nextRound = moment(lastIterated).add(90, 'm').toDate();
			return nextRound;
		}
	}

	function now() {
		return convertTZ(new Date(), 'America/New_York');
	}

	return (
		<div className="flex justify-center items-center flex-col overflow-hidden">
			{musicRef != null ? (
				<MusicToggle musicRef={musicRef} playAudio={playAudio} json={roundData} />
			) : (
				<></>
			)}

			{roundData != null ? (
				<>
					<p className="fixed select-none text-white opacity-20 md:bottom-0 md:left-0 md:top-auto right-0 top-0 md:p-1 md:pl-2 p-1">
						{now().toLocaleDateString('en-US')} / ROUND {roundData.round}
					</p>
					<audio
						src={`https://cdn.867casino.com/${roundData.iteration === 3 ? '30' : '90'}min.mp3`}
						ref={musicRef}
						preload="auto"
						loop
					></audio>

					<h1 className="uppercase round-text" id="countdown">
						<Countdown
							date={getDate()}
							onComplete={() => window.location.reload()}
							daysInHours={true}
							now={now}
						>
							<span>RESET COMPLETE</span>
						</Countdown>
					</h1>
					<h3 className="tournament-text mb-2 font-bold">
						{intermissionActive ? 'INTERMISSION' : 'TOURNAMENT ACTIVE'}
					</h3>
				</>
			) : (
				<></>
			)}
			<div className="slot-machine grid grid-flow-row grid-rows-3 grid-cols-3 md:gap-16 gap-12 md:px-24 px-4 rounded-2xl text-center">
				{width >= 768 ? (
					<>
						<div className="slot-bracket slot-bracket-left">
							<div className="slot-bracket-arrow" />
						</div>
						<div className="slot-bracket slot-bracket-right">
							<div className="slot-bracket-arrow" />
						</div>
					</>
				) : (
					<></>
				)}

				{
					// Check if there is a minigame component to display
					MiniGameComponent !== null ? (
						<MiniGameComponent
							setSlotColor={() => {
								document.documentElement.style.setProperty(
									`--slot-machine-border`,
									slotMachineColor
								);
							}}
							refreshPoints={refreshPoints}
							spinPressed={spinDisabled}
							setSpinDisabled={setSpinDisabled}
							setMiniGameComponent={setMiniGameComponent}
							setMultiplier={setMultiplier}
							resetColor={resetColor}
							setSpinText={setSpinText}
							exitTime={2500}
						/>
					) : (
						<>
							<h1 className="other-slot flex justify-center items-center">
								{getPreviousNumber(slots[0])}
							</h1>
							<h1 className="other-slot flex justify-center items-center">
								{getPreviousNumber(slots[1])}
							</h1>
							<h1 className="other-slot flex justify-center items-center">
								{getPreviousNumber(slots[2])}
							</h1>

							<h1
								className={
									'slot-number flex justify-center items-center ' +
									(isSpecial(slots[0]) ? 'glowing-slot' : '')
								}
							>
								{slots[0]}
							</h1>
							<h1
								className={
									'slot-number flex justify-center items-center ' +
									(isSpecial(slots[1]) ? 'glowing-slot' : '')
								}
							>
								{slots[1]}
							</h1>
							<h1
								className={
									'slot-number flex justify-center items-center ' +
									(isSpecial(slots[2]) ? 'glowing-slot' : '')
								}
							>
								{slots[2]}
							</h1>

							<h1 className="other-slot flex justify-center items-center">
								{getNextNumber(slots[0])}
							</h1>
							<h1 className="other-slot flex justify-center items-center">
								{getNextNumber(slots[1])}
							</h1>
							<h1 className="other-slot flex justify-center items-center">
								{getNextNumber(slots[2])}
							</h1>
						</>
					)
				}

				<audio src={winSound} ref={winSoundRef}></audio>
			</div>

			<div className="md:mt-12"></div>
			<SpinButton onClick={spin} disabled={spinDisabled} value={spinText} />
		</div>
	);
}
