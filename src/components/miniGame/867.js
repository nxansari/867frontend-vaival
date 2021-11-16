import React, { useState, useEffect } from 'react';
import Choice from './Choice';
import DefaultMinigame from './DefaultMinigame';
import './miniGames.css';
import WheelComponent from './Wheel867';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function RiskOption(props) {
	return (
		<button
			className="RiskOption"
			onClick={() => {
				props.choose(props.value);
				props.play(props.value);
			}}
		>
			<p>{props.value}%</p>
		</button>
	);
}

function Rules() {
	return (
		<div className="RulesMini867">
			<strong>RULES:</strong>
			<p>
				Land on <span className="Mini867red">RED</span> or{' '}
				<span className="Mini867black">BLACK</span>?
			</p>
			<p>Lose a percent of your points</p>
			<p>
				Land on <span className="Mini867gold">GOLD</span>?
			</p>
			<p>Win that percent of your points!</p>
		</div>
	);
}

function ChooseRisk(props) {
	const [showWheel, setShowWheel] = useState(false);
	const { executeRecaptcha } = useGoogleReCaptcha();
	//onClick={() => setShowWheel(true)}

	const play = ({ risk }) => {
		setShowWheel(true);
		props.setRiskValue(risk);
		// console.log(props.setSpinDisabled);
		props.setSpinDisabled(false);
	};

	async function choose(choice) {
		const recaptchaToken = await executeRecaptcha('minichoice');
		let res = await fetch(
			`https://api.867casino.com/minichoice?token=${localStorage.getItem(
				'token'
			)}&recaptchaToken=${recaptchaToken}&risk=${parseInt(choice / 33)}`
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
		props.spin();
	}

	if (!showWheel) {
		props.setSpinDisabled(true);
		return (
			<div className="chooseRisk">
				<strong>CHOOSE A RISK PERCENTAGE</strong>
				<div className="Mini867subWrapper">
					<Rules />
					<RiskOption value={33} play={play} choose={choose} />
					<RiskOption value={66} play={play} choose={choose} />
					<RiskOption value={100} play={play} choose={choose} />
				</div>
			</div>
		);
	} else {
		return props.children;
	}
}

export default function Mini867(props) {
	const [riskValue, setRiskValue] = useState(0);
	const [hasSpun, setHasSpun] = useState(false);
	const [result, setResult] = useState('placeholder');
	const [currentSegment, setCurrentSegment] = useState('NONE');
	const { executeRecaptcha } = useGoogleReCaptcha();

	async function spin() {
		const recaptchaToken = await executeRecaptcha('spin');
		let res = await fetch(
			`https://api.867casino.com/spin?token=${localStorage.getItem(
				'token'
			)}&recaptchaToken=${recaptchaToken}`
		);
		let json = await res.json();
		if (json['message'] === 'Invalid token') {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			window.location.reload();
		} else if (res.status != 200) {
			console.log('Spin failed. ' + json['message']);
			props.setSpinDisabled(false);
			return;
		}
		setResult(json['result']);
		localStorage.removeItem('minigame');
		return json['result'];
	}

	const segments = Array(4).fill(['RED', 'BLACK', 'GOLD']).flat();
	//segments.sort();

	// Leave spin button not disabled if pressed multiple times
	useEffect(() => {
		// console.log(hasSpun);
		if (hasSpun) {
			props.setSpinDisabled(false);
		}
	}, [hasSpun, props.spinPressed]);

	const onFinished = (winner) => {
		setHasSpun(true);
		props.setSpinDisabled(false);

		setTimeout(() => props.resetColor(), props.exitTime + 10);
		setTimeout(() => props.setMiniGameComponent(null), props.exitTime);
		setTimeout(props.refreshPoints());
	};

	async function skip() {
		const recaptchaToken = await executeRecaptcha('minichoice');
		let res = await fetch(
			`https://api.867casino.com/minichoice?token=${localStorage.getItem(
				'token'
			)}&recaptchaToken=${recaptchaToken}&skip`
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
		localStorage.removeItem('minigame');
		props.setMiniGameComponent(null);
	}

	return (
		<DefaultMinigame>
			<Choice
				skip={() => {
					skip();
					props.setSpinDisabled(false);
					props.resetColor();
				}}
				play={() => {
					props.setSlotColor();
				}}
				rules={Rules}
			>
				<div className={`Mini867 ${riskValue == 0 ? 'Mini867chooseRisk' : 'Mini867play'}`}>
					<ChooseRisk
						setRiskValue={setRiskValue}
						setSpinDisabled={props.setSpinDisabled}
						spin={spin}
					>
						<div key={result}>
							<WheelComponent
								segments={segments}
								onFinished={(winner) => onFinished(winner)}
								primaryColor="white" /*"#e2c419"*/
								glow="#e9e0bb"
								contrastColor="white"
								backgroundColor="#1c0f31"
								buttonText="SPIN"
								isOnlyOnce={false}
								winningSegment={result}
								minTime={250}
								size={100}
								upDuration={100}
								downDuration={1000}
								spinPressed={props.spinPressed}
								hasSpun={hasSpun}
								setCurrentSegment={setCurrentSegment}
							/>
						</div>
						<p className={`currentSegment current867 Mini867${currentSegment.toLowerCase()}`}>
							{currentSegment}
						</p>
					</ChooseRisk>
				</div>
			</Choice>
		</DefaultMinigame>
	);
}
