//Data needed
/*
    - Color
    - Mini game component
*/

import { Mini666, Mini777, Mini867, Mini911 } from '../components/miniGame/index';

export default function getMiniGameData(currentResult) {
	// return { color: "#e2c419", component: Mini867 };
	// return { color: "#c71111", component: Mini666 };
	// return { color: "#1ac21a", component: Mini777 };
	// return { color: "#2d2dce", component: Mini911 };
	// console.log(currentResult);
	// const current_minigame = localStorage.getItem('minigame');
	switch (currentResult) {
		case JSON.stringify([6, 6, 6]):
			return { color: '#c71111', component: Mini666 };
		case JSON.stringify([7, 7, 7]):
			return { color: '#1ac21a', component: Mini777 };
		case JSON.stringify([8, 6, 7]):
			return { color: '#e2c419', component: Mini867 };
		case JSON.stringify([9, 1, 1]):
			return { color: '#2d2dce', component: Mini911 };
		default:
			return { color: null, component: null };
	}
}
