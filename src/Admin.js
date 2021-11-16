import { useState } from 'react';
import Button from './components/Button';
import TextField from './components/TextField';
import commas from './utils/commas';
import redirect from './utils/redirect';

export default function Admin() {
	const [password, setPassword] = useState('');
	const [authenticated, setAuthenticated] = useState(false);
	const [status, setStatus] = useState('');
	const [errorText, setErrorText] = useState('');
	const [data, setData] = useState({});
	const [roundData, setRoundData] = useState();

	function download_table_as_csv(table_id, separator = ',') {
		// Select rows from table_id
		var rows = document.querySelectorAll('table#' + table_id + ' tr');
		// Construct csv
		var csv = [];
		for (var i = 0; i < rows.length; i++) {
			var row = [],
				cols = rows[i].querySelectorAll('td, th');
			for (var j = 0; j < cols.length; j++) {
				// Clean innertext to remove multiple spaces and jumpline (break csv)
				var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ');
				// Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
				data = data.replace(/"/g, '""');
				// Push escaped string
				row.push('"' + data + '"');
			}
			csv.push(row.join(separator));
		}
		var csv_string = csv.join('\n');
		// Download it
		var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
		var link = document.createElement('a');
		link.style.display = 'none';
		link.setAttribute('target', '_blank');
		link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	function sortPoints() {
		auth();
	}
	function sortSpins() {
		let sorted = [...data];
		sorted.sort((a, b) => {
			return a.spins - b.spins;
		});
		sorted.reverse();
		setData(sorted);
	}

	async function deleteUser(username) {
		let res = await fetch(
			`https://api.867casino.com/admin/delete?password=${password}&name=${username}`
		);
		let json = await res.json();
		alert(`${res.status}, ${json['message']}`);
		await auth();
	}

	async function auth() {
		setErrorText('');
		setStatus('Loading...');
		let res = await fetch(`https://api.867casino.com/admin?password=${password}`, {});
		let json = await res.json();
		if (res.status === 200) {
			setData(json['users']);
			setAuthenticated(true);
			setStatus(`Got ${json['users'].length} rows (sorted by points)`);
		} else if (res.status === 401) {
			setErrorText(json['message']);
			setStatus('');
		}

		res = await fetch('https://api.867casino.com/round_status');
		json = await res.json();
		if (res.status === 200) {
			setRoundData(json);
		} else {
			setRoundData(null);
		}
	}

	return (
		<div className="text-white p-5">
			{authenticated ? (
				<>
					<Button text="Refresh" onClick={auth} className="mr-2" />
					<Button
						text="Download CSV"
						onClick={() => {
							setStatus('Generating CSV...');
							download_table_as_csv('users-table');
						}}
						className="mr-2"
					/>
					<Button
						text="Update Prize Info Link"
						onClick={async () => {
							const url = window.prompt('New link:', '');
							if (url === null) return;
							const res = await fetch('https://api.867casino.com/admin/link', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ key: 'prize_info', value: url, password: password }),
							});
							if (res.status === 200) {
								setStatus('Updated prize info');
							}
						}}
						className="mr-2"
					/>
					<Button
						text="Update Ad Text"
						onClick={async () => {
							const url = window.prompt('New link:', '');
							if (url === null) return;
							const res = await fetch('https://api.867casino.com/admin/link', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ key: 'ad_text', value: url, password: password }),
							});
							if (res.status === 200) {
								setStatus('Updated ad text');
							}
						}}
						className="mr-2"
					/>
					<Button
						text="Update Ad Link"
						onClick={async () => {
							const url = window.prompt('New link:', '');
							if (url === null) return;
							const res = await fetch('https://api.867casino.com/admin/link', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ key: 'ad_link', value: url, password: password }),
							});
							if (res.status === 200) {
								setStatus('Updated ad link');
							}
						}}
						className="mr-2"
					/>
					<Button
						text="Update Prize Pool"
						onClick={async () => {
							const text = window.prompt('New text:', '');
							if (text === null) return;
							const res = await fetch('https://api.867casino.com/admin/link', {
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ key: 'prize_pool', value: text, password: password }),
							});
							if (res.status === 200) {
								setStatus('Updated prize pool');
							}
						}}
						className="mr-2"
					/>
					<Button
						text="View Previous Round"
						onClick={async () => {
							const text = window.prompt('Which round?', '');
							if (text === null) return;
							redirect(`/admin/previous_round/?round=${text}`);
						}}
						className="mr-2"
					/>
					<Button text="Sort by points" onClick={sortPoints} className="mr-2" />
					<Button text="Sort by spins" onClick={sortSpins} className="mr-2" />

					<p className="my-2">
						<strong>Current Round: </strong>
						{roundData ? roundData['round'] : 'N/A'}
					</p>
					<p className="my-2">
						<strong>Last Iterated (Intermission start or new round): </strong>
						{roundData ? roundData['last_iterated'] : 'N/A'}
					</p>
					<p className="my-2">{status}</p>

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
							</tr>
						</thead>
						<tbody>
							{data.map((user) => {
								return (
									<tr>
										<td>{user['id']}</td>
										<td>{user['username']}</td>
										<td>
											<a href={'mailto:' + user['email']}>{user['email']}</a>
										</td>
										<td>{user['area_code']}</td>
										<td>{user['phone']}</td>
										<td>{commas(user['spin_count'] || 0)}</td>
										<td>{commas(user['points'] || 0)}</td>
										<td>
											<Button
												onClick={() =>
													redirect(
														`https://www.867casino.com/admin/user?password=${password}&name=${user['username']}`
													)
												}
												text="info"
												link
												className="bg-blue-500 rounded-xl my-1"
											/>
										</td>
										<td>
											<Button
												onClick={() => deleteUser(user['username'])}
												text="delete"
												link
												className="bg-red-500 rounded-xl my-1"
											/>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</>
			) : (
				<>
					<TextField
						placeholder="***********"
						label="Password"
						value={password}
						type="password"
						errorText={errorText}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<Button text="Submit" onClick={auth} />
					<p className="my-2">{status}</p>
				</>
			)}
		</div>
	);
}
