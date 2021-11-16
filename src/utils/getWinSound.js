export default function getWinSound(previousResult, currentResult) {
	switch (JSON.stringify(currentResult)) {
		case JSON.stringify([6, 6, 6]):
			return '6-6-6.wav';
		case JSON.stringify([7, 7, 7]):
			return '7-7-7.wav';
		case JSON.stringify([8, 6, 7]):
			if (JSON.stringify(previousResult) === JSON.stringify([8, 6, 7])) {
				return '8-6-7-twice.wav';
			} else {
				return '8-6-7.wav';
			}
		case JSON.stringify([8, 9, 10]):
			return '8-9-10.wav';
		case JSON.stringify([9, 1, 1]):
			return '9-1-1.wav';
		case JSON.stringify([11, 11, 11]):
			return '11-11-11.wav';
		case JSON.stringify([1, 2, 3]):
			return '1-2-3.wav';
		default:
			return null;
	}
}
