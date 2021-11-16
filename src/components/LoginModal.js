// import SecureEarningsImage from '../img/Secure your earnings.png';
// import SecureEarningsMobileImage from '../img/Secure your earnings mobile.png';
import TextField from './TextField';
import Button from './Button';
import { useState } from 'react';
import gsap from 'gsap';
import useWindowSize from '../hooks/useWindowSize';

export default function LoginModal({
	visible,
	setVisible,
	setSignupVisible,
	setResetPasswordVisible,
}) {
	const [username, setUsername] = useState('');
	const [usernameError, setUsernameError] = useState('');
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	function close() {
		gsap.to('#modal', { right: '-100%', duration: 0.5 });
		document.body.style.overflow = 'unset';
		setTimeout(() => setVisible(false), 200);
	}

	async function login(e) {
		let error = false;
		setUsernameError('');
		setPasswordError('');

		e.preventDefault();
		if (username.trim() === '') {
			setUsernameError('Invalid username.');
			error = true;
		}
		if (password.trim() === '') {
			setPasswordError('Invalid password.');
			error = true;
		}

		if (error) return;

		let res = await fetch(
			`https://api.867casino.com/auth?username=${username}&password=${password}`
		);
		let json = await res.json();

		if (res.status === 200) {
			localStorage.setItem('token', json['token']);
			localStorage.setItem('user', username);
			window.location.reload();
		} else if (res.status === 401) {
			setPasswordError('Invalid username or password.');
		} else {
			setUsernameError(json['message']);
		}
	}

	if (visible) {
		return (
			<>
				<div className="absolute dimmer w-screen h-full z-10" onClick={close}></div>
				<div
					id="modal"
					className="modal fixed md:right-0 md:h-full bottom-0 lg:w-5/12 md:w-3/4 w-screen z-20 text-white lg:p-7 pt-2 overflow-y-hidden flex justify-center flex-col"
				>
					{
						// <img
						// 	src={width <= 1024 ? SecureEarningsMobileImage : SecureEarningsImage}
						// 	alt="Secure Your Earnings"
						// 	className="image-title w-full pl-3 mt-2"
						// />
					}
					<div className="px-7">
						<h1 className="modal-glowing-header">login</h1>

						<form className="mt-8">
							<TextField
								errorText={usernameError === '' ? null : usernameError}
								label="Username"
								placeholder="867crypto"
								className="w-full"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>

							<TextField
								errorText={passwordError === '' ? null : passwordError}
								label="Password"
								placeholder="***********"
								type="password"
								className="w-full"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>

							<Button text="Log in" className="w-full mt-4" onClick={login} />

							<hr className="lg:my-12 my-5" />
							<div>
								<span>Don't have an account? </span>
								<a
									onClick={(e) => {
										e.preventDefault();
										setVisible(false);
										setSignupVisible(true);
										setTimeout(() => gsap.to('#modal', { right: 0 }), 10);
									}}
								>
									Sign up
								</a>
							</div>
							<div>
								<span>Forgot your password? </span>
								<a
									onClick={(e) => {
										e.preventDefault();
										setVisible(false);
										setResetPasswordVisible(true);
										setTimeout(() => gsap.to('#modal', { right: 0 }), 10);
									}}
								>
									Reset it
								</a>
							</div>
						</form>
					</div>
				</div>
			</>
		);
	} else {
		return <></>;
	}
}
