import { Key } from "react";

type TypeAPI = {
	id: Key;
	name: string;
	date: Date;
	status: string;
};

const apiUrl = `https://adgetest23.amocrm.ru`;
const dealsTable = document.getElementById('deals-table');
const dealsTbody = document.getElementById('deals-tbody');


const data = {
	client_id: import.meta.env.REACT_APP_AMOCRM_ID,
	client_secret: import.meta.env.REACT_APP_AMOCRM_SECRET_KEY,
	redirect_uri: apiUrl,
	bearer: import.meta.env.REACT_APP_AMOCRM_TIME_TOKEN,
}

let openDealRow = null;

async function getAccessToken() {
	try {
	const response = await fetch(`${apiUrl}/oauth2/access_token`, {
		method: 'POST',
		mode: 'no-cors',
		headers: {
		'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: `grant_type=refresh_token&refresh_token=${data.bearer}&client_id=${data.client_id}&client_secret=${data.client_secret}`,
	});
	const tokenResponse = await response.json();
	return tokenResponse.access_token;
	} catch (error) {
	console.error(error);
	}
}

async function getDeals() {
	try {
		const accessToken = await getAccessToken();
		const response = await fetch(`${apiUrl}/api/v4/leads`, {
			method: 'GET',
			mode: 'no-cors',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		});
		const deals = await response.json();
		deals._embedded.leads.forEach((deal) => {
			const dealRow = document.createElement('tr');
			dealRow.innerHTML = `
				<td>${deal.id}</td>
				<td>${deal.name}</td>
				<td>${deal.budget}</td>
			`;
			dealsTbody.appendChild(dealRow);
			dealRow.addEventListener('click', () => {
				if (openDealRow) {
					openDealRow.innerHTML = `
						<td>${openDealRow.cells[0].textContent}</td>
						<td>${openDealRow.cells[1].textContent}</td>
						<td>${openDealRow.cells[2].textContent}</td>
					`;
				}
				openDealRow = dealRow;
				dealRow.innerHTML = `
				<td colspan="3">Loading...</td>
				`;
				getDealDetails(deal.id);
			});
		});
	} catch (error) {
		console.error(error);
	}
}

async function getDealDetails(dealId) {
	try {
		const accessToken = await getAccessToken();
		const response = await fetch(`${apiUrl}/api/v4/leads/${dealId}`, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		});
		const dealDetails = await response.json();
		const dealRow = openDealRow;
		dealRow.innerHTML = `
		<td>${dealDetails.id}</td>
		<td>${dealDetails.name}</td>
		<td>${dealDetails.budget}</td>
		<td>${formatDate(dealDetails.created_at)}</td>
		<td>${getTaskStatus(dealDetails.tasks)}</td>
		`;
		openDealRow = null;
	} catch (error) {
		console.error(error);
	}
}

function formatDate(dateString) {
	const date = new Date(dateString);
	return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

function getTaskStatus(tasks) {
	const task = tasks.find((task) => task.deadline >= new Date());
	if (!task) {
		return `<svg width="10" height="10" viewBox="0 0 10 10" fill="red"><circle cx="5" cy="5" r="5"/></svg>`;
	} else if (task.deadline.getDate() === new Date().getDate()) {
		return `<svg width="10" height="10" viewBox="0 0 10 10" fill="green"><circle cx="5" cy="5" r="5"/></svg>`;
	} else if (task.deadline.getDate() - new Date().getDate() === 1) {
		return `<svg width="10" height="10" viewBox="0 0 10 10" fill="yellow"><circle cx="5" cy="5" r="5"/></svg>`;
	} else {
		return `<svg width="10" height="10" viewBox="0 0 10 10" fill="red"><circle cx="5" cy="5" r="5"/></svg>`;
	}
}


const Home = () => {
	const Deals = getDeals();
	return (
	<div>
		<h1>Deals Page</h1>
		<table id="deals-table">
		<thead>
			<tr>
			<th>ID</th>
			<th>Name</th>
			<th>Budget</th>
			</tr>
		</thead>
		<tbody id="deals-tbody">
			<Deals />
		</tbody>
		</table>
	</div>
	);
};

export default Home;