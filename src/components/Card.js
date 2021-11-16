import React from 'react';

export default function Card({ title, children, backgroundColor, className }) {
	return (
		<div
			className={'container rounded-2xl p-6 shadow-lg ' + className}
			style={{ backgroundColor: backgroundColor ? backgroundColor : '' }}
		>
			<div className="mb-2">{title}</div>
			<div className="ml-1">{children}</div>
		</div>
	);
}
