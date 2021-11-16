export default function commas(x) {
	try {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	} catch (error) {
		return x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
}
