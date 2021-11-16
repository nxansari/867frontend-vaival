// import SecureEarningsImage from '../img/Secure your earnings.png';
// import SecureEarningsMobileImage from '../img/Secure your earnings mobile.png';
import TextField from './TextField';
import Button from './Button';
import gsap from 'gsap';
import { useState } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function SignupModal({
	visible,
	setVisible,
	setLoginVisible,
	setResetPasswordVisible,
}) {
	const { executeRecaptcha } = useGoogleReCaptcha();
	const [email, setEmail] = useState('');
	const [username, setUsername] = useState('');
	const [usernameError, setUsernameError] = useState('');
	const [password, setPassword] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [areaCode, setAreaCode] = useState('');
	const [phone, setPhone] = useState('');

	function close() {
		gsap.to('#modal', { right: '-100%', duration: 0.5 });
		document.body.style.overflow = 'unset';
		setTimeout(() => setVisible(false), 200);
	}

	async function signup(e) {
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

		const recaptchaToken = await executeRecaptcha('register');
		let res = await fetch(`https://api.867casino.com/auth/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				email: email,
				username: username,
				password: password,
				area_code: areaCode,
				phone: phone,
				recaptchaToken: recaptchaToken,
			}),
		});
		let json = await res.json();

		if (res.status === 200) {
			localStorage.setItem('token', json['token']);
			localStorage.setItem('user', username);
			window.location.reload();
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
					className="modal fixed md:right-0 md:h-full bottom-0 lg:w-5/12 md:w-3/4 w-screen z-20 text-white lg:p-7 pt-2 overflow-y-hidden"
				>
					<div className="px-7">
						<h1 className="modal-glowing-header">Secure your points</h1>

						<p>
							Create an account and get access to unlimited FREE slot play! Collect points for a
							chance to win airdrops and prizes!
						</p>

						<form className="mt-8">
							<TextField
								label="Email"
								placeholder="info@867crypto.com"
								type="email"
								className="w-full"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>

							<TextField
								label="Username"
								placeholder="867crypto"
								type="text"
								className="w-full"
								value={username}
								errorText={usernameError}
								onChange={(e) => setUsername(e.target.value)}
							/>

							<TextField
								label="Password"
								placeholder="***********"
								type="password"
								className="w-full"
								value={password}
								errorText={passwordError}
								onChange={(e) => setPassword(e.target.value)}
							/>

							<div>
								<p>Phone Number</p>
								<div className="flex flex-row">
									<TextField
										placeholder="+1"
										type="text"
										className="w-14"
										inline
										value={areaCode}
										onChange={(e) => setAreaCode(e.target.value)}
									/>
									<TextField
										placeholder="Optional"
										type="tel"
										pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
										className="w-full ml-3"
										inline
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
									/>
								</div>
							</div>

							<Button text="Sign up" className="w-full mt-10" onClick={signup} />
							<p className="mt-2 agreement">
								By clicking Sign up, you agree to our{' '}
								<a
									href="https://519bdd0b-63bb-4bfc-b639-fd9bf6459afd.filesusr.com/ugd/6b9875_1598ce27139a42a5bd44019c943b7c6e.pdf"
									target="_blank"
								>
									Terms of Service
								</a>{' '}
								and Privacy Policy.
							</p>

							<hr className="lg:my-12 my-5" />
							<div>
								<span>Already have an account? </span>
								<a
									onClick={(e) => {
										e.preventDefault();
										setVisible(false);
										setLoginVisible(true);
										setTimeout(() => gsap.to('#modal', { right: 0 }), 10);
									}}
								>
									Log in
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
							<div class="my-10"></div>
						</form>
					</div>
				</div>
			</>
		);
	} else {
		return <></>;
	}
}
