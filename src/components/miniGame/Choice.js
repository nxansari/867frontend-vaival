import React, { useState } from 'react';
import './miniGames.css';

export default function Choice(props) {
	const [showChoice, setShowChoice] = useState(true);

	const Rules = props.rules;

	if (showChoice) {
		return (
			<div className="MiniGameChoice">
				<Rules />
				<button onClick={() => setShowChoice(false)}>PLAY</button>
				<button onClick={() => props.skip()}>SKIP</button>
			</div>
		);
	} else {
		props.play();
		return props.children;
	}
}
