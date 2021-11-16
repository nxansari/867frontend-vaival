import React, { useState } from 'react';
import Card from './Card';
import PlayerList from './PlayerList';
import ReactTooltip from 'react-tooltip';
import Button from './Button';
// import TopWinningsImage from '../img/Top winnings.png';

export default function TopScores({ data, showMore }) {
	let players = data['top_winnings'];
	ReactTooltip.rebuild();
	return (
		<>
			<Card
				title={
					<>
						<h2
							className="no-select top-scores"
							data-tip="Score displayed is for current round. All scores reset to ZERO at the conclusion of each round."
						>
							Top scores
						</h2>
						<ReactTooltip className="not-wide-tooltip" effect="solid" />
					</>
				}
				backgroundColor="#30135D"
			>
				<PlayerList players={players} unit="points" />
				<Button
					text="Show more"
					className="w-full mt-2 md:block hidden"
					onClick={() => {
						showMore();
					}}
				/>
			</Card>
		</>
	);
}
