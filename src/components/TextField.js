export default function TextField({
	placeholder,
	type = 'text',
	onChange,
	value,
	className = '',
	label,
	inline = false,
	disabled = false,
	errorText = '',
	pattern,
}) {
	if (inline) {
		return (
			<input
				className={'text-field rounded-lg px-3 py-1.5 ' + className}
				type={type}
				onChange={onChange}
				value={value}
				placeholder={placeholder}
				disabled={disabled}
				pattern={pattern}
			/>
		);
	} else {
		return (
			<div className="my-4">
				{label ? <p className={disabled ? 'disabled-text-label' : ''}>{label}</p> : <></>}
				<input
					className={
						'text-field rounded-lg px-3 py-1.5 ' +
						(errorText ? 'text-field-error' : '') +
						' ' +
						className
					}
					type={type}
					onChange={onChange}
					value={value}
					placeholder={placeholder}
					disabled={disabled}
					pattern={pattern}
				/>
				{errorText ? <p className="text-field-error-text">{errorText}</p> : <></>}
			</div>
		);
	}
}
