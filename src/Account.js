import { useEffect, useState } from 'react';
import Button from './components/Button';
import TextField from './components/TextField';

export default function Account() {
	const [data, setData] = useState();
	const [message, setMessage] = useState('Loading...');
	const [email, setEmail] = useState('');

	async function getData() {
		let res = await fetch(`https://api.867casino.com/me?token=${localStorage.getItem('token')}`);
		let json = await res.json();

		setData(json);
		setEmail(json['email']);
		setMessage('');
		if (res.status != 200) {
			setMessage(json['message']);
		}
	}

	async function changeEmail() {
		let res = await fetch(`https://api.867casino.com/auth/update_email`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ token: localStorage.getItem('token'), email: email }),
		});
		let json = await res.json();
		setMessage(json['message']);
		if (res.status == 200) {
			setEmail(email);
		}
	}

	useEffect(getData, []);

	return (
		<div className="text-white p-5">
			{data == null ? (
				<p className="my-2">{message}</p>
			) : (
				<>
					<p className="my-2">{message}</p>
					<div className="flex-col inline-flex account-container text-lg p-5 rounded-lg">
						<h3 className="text-4xl font-semibold mb-2">Account Details</h3>
						<div>
							<span className="font-semibold">Name: </span>
							<span>{data['username']}</span>
						</div>
						<div>
							<span className="font-semibold">Email: </span>
							<TextField
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								inline
								className="w-72 mb-2"
							/>
							<Button text="Change" onClick={changeEmail} className="sm:ml-2" />
						</div>
						<div>
							<span className="font-semibold">Phone Number: </span>
							<span>
								{data['area_code']} {data['phone']}
							</span>
						</div>
					</div>
				</>
			)}
		</div>
	);
}
