import { useEffect, useState } from 'react';
import Button from './components/Button';
import TextField from './components/TextField';
import useQuery from './hooks/useQuery';
import commas from './utils/commas';

export default function ResetPassword() {
	const query = useQuery();
	const [code, setCode] = useState(query.get('code'));
	const [newPassword, setNewPassword] = useState('');
	const [resetDisabled, setResetDisabled] = useState(false);
	const [message, setMessage] = useState('');

	async function reset(e) {
		e.preventDefault();
		setMessage('');
		setResetDisabled(true);

		let res = await fetch(
			`https://api.867casino.com/auth/password_reset?code=${code}&password=${newPassword}`
		);
		let json = await res.json();

		setMessage(json['message']);
		if (res.status != 200) {
			setResetDisabled(false);
		}
	}

	return (
		<div className="text-white p-5">
			<h2>Reset Password</h2>
			<TextField value={code} onChange={(e) => setCode(e.target.value)} placeholder="Code" />
			<TextField
				value={newPassword}
				type="password"
				onChange={(e) => setNewPassword(e.target.value)}
				placeholder="New password"
			/>
			<Button text="Reset" onClick={reset} disabled={resetDisabled} />
			<p className="mt-2">{message}</p>
		</div>
	);
}
