import React from 'react';

export default function BackgroundToggle({ setToggled, toggled }) {
	return (
		<>
			<div
				className={'background-toggle ml-4 ' + (toggled ? 'toggled' : '')}
				onClick={() => {
					setToggled(!toggled);
				}}
			></div>
		</>
	);
}
