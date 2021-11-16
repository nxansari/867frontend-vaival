import React, { useEffect, useState } from 'react';
import Card from './Card';
// import PlayerInfoImage from '../img/Player info.png';

export default function PlayerInfo({ points, setPoints }) {
	const [prizePool, setPrizePool] = useState('N/A');
	const refresh = async () => {
		let res = await fetch('https://api.867casino.com/link?key=prize_pool');
		let json = await res.json();
		setPrizePool(json['link']);

		let token = localStorage.getItem('token');
		if (token === null) {
			return;
		}

		res = await fetch(`https://api.867casino.com/me?token=${token}`);
		if (res.status === 403) {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			window.location.reload();
		}
		json = await res.json();
		setPoints(json['points']);
	};

	useEffect(refresh, [points]);
	return (
		<Card
			// title={<img src={PlayerInfoImage} alt="Player Info" className="lg:h-8 image-title" />}
			title={<h2 className="no-select player-info">Player info</h2>}
			backgroundColor="#5C1974"
		>
			<div className="value">
				<p className="key">Playing as</p>
				<p>{localStorage.getItem('user') || 'Guest'}</p>
			</div>

			<div className="value">
				<p className="key">Total Points</p>
				<p>{points || 0}</p>
			</div>

			<div className="value">
				<p className="key">Prize Pool</p>
				<p>{prizePool}</p>
			</div>
		</Card>
	);
}
