import React from 'react';

export default function Button({ text, onClick, link, className, disabled }) {
	return (
		<button
			className={(link ? 'link' : 'button') + ' ' + className}
			onClick={onClick}
			disabled={disabled}
		>
			{text}
		</button>
	);
}
