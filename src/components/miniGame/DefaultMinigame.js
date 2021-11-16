import React from 'react';
import './miniGames.css';

export default function DefaultMinigame({ children }) {
	return (
		<div className="MiniGameWrapper slot-number flex justify-center items-center">{children}</div>
	);
}
