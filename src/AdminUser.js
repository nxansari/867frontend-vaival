import { useEffect, useState } from 'react';
import useQuery from './hooks/useQuery';
import commas from './utils/commas';

export default function AdminUser() {
	const [data, setData] = useState(null);
	const [message, setMessage] = useState('Loading...');
	const query = useQuery();

	async function getData() {
		let res = await fetch(
			`https://api.867casino.com/admin/user?password=${query.get('password')}&name=${query.get(
				'name'
			)}`
		);
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
				<table className="admin-table" id="users-table">
					<thead>
						<tr>
							<th>ID</th>
							<th>Username</th>
							<th>Email</th>
							<th>Area Code</th>
							<th>Phone</th>
							<th>Spins</th>
							<th>Points</th>
							<th>Current Boost</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>{data['id']}</td>
							<td>{data['username']}</td>
							<td>
								<a href={'mailto:' + data['email']}>{data['email']}</a>
							</td>
							<td>{data['area_code']}</td>
							<td>{data['phone']}</td>
							<td>{commas(data['spin_count'] || 0)}</td>
							<td>{commas(data['points'] || 0)}</td>
							<td>{commas(data['boost'] || 0)}</td>
						</tr>
					</tbody>
				</table>
			) : (
				<p>{message}</p>
			)}
		</div>
	);
}
