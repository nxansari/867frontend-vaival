import React, { useEffect, useState } from 'react';
import Card from './Card';
import PlayerList from './PlayerList';

export default function PreviousResults({ round }) {
	let [players, setPlayers] = useState([]);
	useEffect(async () => {
		let res = await fetch('https://api.867casino.com/previous_round/0');
		let json = await res.json();
		setPlayers(json['users'].slice(0, 5));
	}, []);
	return (
		<Card
			// title={<img src={TopActiveImage} alt="Top Active" className="lg:h-8 image-title" />}
			title={<h2 className="no-select previous-results">Previous results</h2>}
			backgroundColor="#19233F"
			className="top-active"
		>
			<PlayerList players={players} unit="points" />
		</Card>
	);
}
