import gsap from 'gsap';
import Button from './Button';
import BackgroundToggle from './BackgroundToggle';
import redirect from '../utils/redirect';

export default function Header({
	isLoggedIn,
	setLoginVisible,
	setSignupVisible,
	background,
	setBackground,
}) {
	return (
		<div className="min-w-full flex justify-end items-center pt-5 px-3 bg-transparent">
			{isLoggedIn ? (
				<>
					<Button
						text={localStorage.getItem('user')}
						onClick={() => {
							redirect('/account');
						}}
						link
					/>
					<Button
						text="Log out"
						onClick={() => {
							localStorage.removeItem('token');
							localStorage.removeItem('user');
							window.location.reload();
						}}
					/>
				</>
			) : (
				<>
					<Button
						text="Log in"
						link
						onClick={() => {
							setLoginVisible(true);
							document.body.style.overflow = 'hidden';
							new Promise((r) => setTimeout(() => gsap.to('#modal', { right: 0 }), 10));
						}}
					/>
					<Button
						text="Sign up"
						onClick={() => {
							setSignupVisible(true);
							document.body.style.overflow = 'hidden';
							new Promise((r) => setTimeout(() => gsap.to('#modal', { right: 0 }), 10));
						}}
					/>
				</>
			)}
			<BackgroundToggle toggled={background} setToggled={setBackground} />
		</div>
	);
}
