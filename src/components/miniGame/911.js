import React, { useEffect, useState } from 'react';
import Choice from './Choice';
import DefaultMinigame from './DefaultMinigame';
import './miniGames.css';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

function randomDigit() {
	return Math.floor(Math.random() * 5) + 1;
}

const Die = ({ value }) => {
	const conversions = {
		1: '0001000',
		2: '1000001',
		3: '1001001',
		4: '1100011',
		5: '1101011',
		6: '1110111',
	};
	const strValue = conversions[value];

	const Dot = ({ index }) => {
		const hidden = strValue[index] === '0';
		return <div className={`dot ${hidden && 'hiddenDot'}`} />;
	};

	return (
		<div className="dice">
			<div className="dotsCol">
				<Dot index={0} />
				<Dot index={1} />
				<Dot index={2} />
			</div>
			<Dot index={3} />
			<div className="dotsCol">
				<Dot index={4} />
				<Dot index={5} />
				<Dot index={6} />
			</div>
		</div>
	);
};

const Rules = () => {
	return (
		<div className="RulesMini911">
			<strong>RULES:</strong>
			<p>2 EVEN FACES = +500</p>
			<p>1 EVEN + 1 ODD FACE = 0</p>
			<p>2 ODD FACES = - 500</p>
		</div>
	);
};

export default function Mini911(props) {
	let firstDone = false;
	let secondDone = false;
	const [values, setValues] = useState([6, 6]);
	const [finalVals, setFinalVals] = useState([6, 6]); // Request from db
	const [rolled, setRolled] = useState(false);
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
		// console.log("RESULT:", json["result"]);
		setFinalVals(json['result']);
		localStorage.removeItem('minigame');
		return json['result'];
	}

	useEffect(() => {
		if (props.spinPressed) {
			spin();
		}
	}, [props.spinPressed]);

	useEffect(async () => {
		if (props.spinPressed) {
			// console.log(finalVals);

			setTimeout(() => (firstDone = true), 1500);
			setTimeout(() => (secondDone = true), 3000);

			while (true) {
				await new Promise((r) => setTimeout(r, 30));
				let scrambled = [randomDigit(), randomDigit()];

				if (secondDone) {
					setValues(finalVals);
					setTimeout(() => {
						props.setSpinDisabled(false);
						setTimeout(() => props.resetColor(), 10);
						props.setMiniGameComponent(null);
						props.refreshPoints();
					}, props.exitTime);
					break;
				}
				if (firstDone) {
					setValues([finalVals[0], scrambled[1]]);
					continue;
				}
				setValues(scrambled);
			}
		}
	}, [finalVals]);

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
			console.log('No. ' + json['message']);
			return;
		}
		localStorage.removeItem('minigame');
		props.setMiniGameComponent(null);
	}

	return (
		<DefaultMinigame>
			<Choice
				skip={() => {
					// console.log("Skip")
					skip();
					props.setSpinDisabled(false);
					props.resetColor();
				}}
				play={() => {
					props.setSlotColor();
					props.setSpinText('Roll');
				}}
				rules={Rules}
			>
				<div className="Mini911">
					<Rules />
					<Die value={values[0]} />
					<Die value={values[1]} />
				</div>
			</Choice>
		</DefaultMinigame>
	);
}
