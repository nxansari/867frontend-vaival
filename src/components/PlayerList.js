import React from 'react';
import commas from '../utils/commas';
import ReactTooltip from 'react-tooltip';

export default function PlayerList({ players, unit }) {
	function isMe(name) {
		return name === localStorage.getItem('user');
	}
	return (
		<ul className={'player-list text-xl ' + (players.length > 5 ? 'overflow-y-scroll h-40' : '')}>
			{players.map((player) => {
				const index = players.indexOf(player) + 1;
				const me = isMe(player);
				return (
					<div key={index}>
						<li className="my-0.5" key={index}>
							<div className="player-list-item">
								<span className={'player-list-count mr-2 ' + (me ? 'active' : '')}>{index}</span>
								<span
									className={me ? 'active' : ''}
									data-tip={commas(player.points) + ' ' + unit}
									data-for={index.toString()}
								>
									{player.name}
								</span>
							</div>
						</li>
						<ReactTooltip id={index.toString()} effect="solid" />
					</div>
				);
			})}
		</ul>
	);
}
