import React, { useEffect, useState } from 'react';
import DefaultMinigame from './DefaultMinigame';
import './miniGames.css';
import WheelComponent from './Wheel777';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function Mini777(props) {
	const [hasSpun, setHasSpun] = useState(false);
	const [winResult, setWinResult] = useState('');
	const [currentSegment, setCurrentSegment] = useState('0x');
	const [winNumber, setWinNumber] = useState(1);
	const [multiplierGotten, setMultiplierGotten] = useState(false);
	const { executeRecaptcha } = useGoogleReCaptcha();

	async function getMultiplier() {
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
			// setSpinDisabled(false);
			return;
		}
		// const winningSegment = json["result"];
		// console.log("SPIN MULTIPLIER:", json["result"]);
		setWinResult(json['result'].toString() + 'x');
		setWinNumber(json['result']);
		// console.log("WINRESULT, WINNUMBER:", winResult, winNumber);
		return json['result'];
	}

	// const winResult = 10; // Request from db
	// const winNumber = winResult.toString() + "x";

	// Leave spin button not disabled if pressed multiple times
	useEffect(() => {
		// console.log(hasSpun);
		if (hasSpun) {
			props.setSpinDisabled(false);
		}
	}, [hasSpun, props.spinPressed]);

	useEffect(() => {
		if (!multiplierGotten) {
			getMultiplier();
			setMultiplierGotten(true);
		}
	}, [multiplierGotten]);

	// useEffect(() => {
	//   console.log("win result is currently:", winResult);
	// }, [winResult])

	props.setSlotColor();

	const segments = Array(12)
		.fill('')
		.map((e, i) => i + 1 + 'x');

	const onFinished = (winner) => {
		setHasSpun(true);
		// props.setMultiplier(winResult);
		// console.log(winResult);
		setTimeout(() => {
			props.setMiniGameComponent(null);
			props.setSpinDisabled(false);
		}, props.exitTime);
		setTimeout(props.refreshPoints());
	};

	return (
		<DefaultMinigame>
			<div className="Mini777">
				<p>
					Your next 10 spins will be multiplied by whatever number you land on!
					<br />
					<br />
					Good Luck!
				</p>
				<div key={winResult}>
					<WheelComponent
						key={winResult}
						segments={segments}
						onFinished={(winner) => onFinished(winner)}
						primaryColor="#23ff23"
						glow="#59e659"
						contrastColor="white"
						backgroundColor="#1c0f31"
						buttonText="SPIN"
						isOnlyOnce={false}
						winningSegment={winResult}
						minTime={250}
						size={100}
						upDuration={100}
						downDuration={1000}
						spinPressed={props.spinPressed}
						hasSpun={hasSpun}
						setCurrentSegment={setCurrentSegment}
					/>
				</div>
				<p className="currentSegment current777">{currentSegment}</p>
			</div>
		</DefaultMinigame>
	);
}
