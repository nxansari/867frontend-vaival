import { useEffect, useState } from 'react';
import useQuery from './hooks/useQuery';
import commas from './utils/commas';

export default function AdminPreviousRound() {
	const [data, setData] = useState(null);
	const [message, setMessage] = useState('Loading...');
	const query = useQuery();

	async function getData() {
		let res = await fetch(`https://api.867casino.com/previous_round/${query.get('round')}`);
		let json = await res.json();
		if (res.status === 200) {
			setData(json);
		} else {
			setData(null);
			setMessage(json['message']);
		}
	}
	useEffect(getData, []);

	return (
		<div className="text-white p-5">
			{data != null ? (
				<>
					<h2>Round {query.get('round')}</h2>
					<table className="admin-table" id="users-table">
						<thead>
							<tr>
								<th>ID</th>
								<th>Username</th>
								<th>Points</th>
							</tr>
						</thead>
						<tbody>
							{data['users'].map((user) => {
								return (
									<tr>
										<td>{user['id']}</td>
										<td>{user['name']}</td>
										<td>{commas(user['points'])}</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</>
			) : (
				<p>{message}</p>
			)}
		</div>
	);
}
