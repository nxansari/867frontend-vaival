import TextField from './TextField';
import Button from './Button';
import { useState } from 'react';
import gsap from 'gsap';
import useWindowSize from '../hooks/useWindowSize';

export default function ResetPasswordModal({
	visible,
	setVisible,
	setSignupVisible,
	setResetPasswordVisible,
}) {
	const [email, setEmail] = useState('');
	const [emailError, setEmailError] = useState('');
	const [message, setMessage] = useState('');
	function close() {
		gsap.to('#modal', { right: '-100%', duration: 0.5 });
		document.body.style.overflow = 'unset';
		setTimeout(() => setVisible(false), 200);
	}

	async function reset(e) {
		let error = false;
		setEmailError('');

		e.preventDefault();
		if (email.trim() === '') {
			setEmailError('Invalid email');
			error = true;
		}

		if (error) return;

		let res = await fetch(`https://api.867casino.com/auth/password_reset_request?email=${email}`);
		let json = await res.json();

		if (res.status === 200) {
			setMessage(json['message']);
		} else {
			setEmailError(json['message']);
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
					<div className="px-7">
						<h1 className="modal-glowing-header">Reset Password</h1>

						<form className="mt-8">
							<TextField
								errorText={emailError === '' ? null : emailError}
								label="Email"
								placeholder="you@867casino.com"
								className="w-full"
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>

							<Button text="Reset" className="w-full mt-1" onClick={reset} />
							<p className="mt-2 text-green-400">{message}</p>

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
						</form>
					</div>
				</div>
			</>
		);
	} else {
		return <></>;
	}
}
