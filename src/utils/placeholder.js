const PLACEHOLDER_CHAR = '-';

export default function placeholder(length) {
	let x = '';
	for (let i = 0; i < length; i++) {
		x += PLACEHOLDER_CHAR;
	}
	return x;
}
