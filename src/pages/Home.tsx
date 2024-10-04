import { Key } from "react";

// название, id, дату в формате DD.MM.YYYY, статус ближайщей задачи
type TypeAPI = {
	id: Key,
	name: String,
	date: Date,
	status: HTMLElement,
}

//  https://www.amocrm.ru/oauth?client_id=101ec5e0-e35c-466d-9392-ff5db8105f22&state={параметр состояния, который будет возвращен вам на Redirect URI}&mode={popup или post_message}

const Home = () => {
	const apiUrl = `https://adgetest23.amocrm.ru/oauth2/access_token`;
	const dealsTable = document.getElementById('deals-table');
	const dealsTbody = document.getElementById('deals-tbody');
	const data = {
		grant_type: "client_credentials",
		client_id: import.meta.env.REACT_APP_AMOCRM_ID,
		client_secret: import.meta.env.REACT_APP_AMOCRM_SECRET_KEY,
		time_key: import.meta.env.REACT_APP_AMOCRM_TIME_KEY,
	};

	let openDealRow = null;

	async function getDeals() {
		const response = await fetch(apiUrl, {
			method: 'GET',
			mode: 'no-cors',
			headers: data
		});
		const deals = await response.json();
		deals.forEach((deal) => {
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
	}

	async function getDealDetails(dealId) {
		const response = await fetch(`${apiUrl}/${dealId}`, {
			method: 'GET',
			mode: 'no-cors',
			headers: {
				'client_id': import.meta.env.REACT_APP_AMOCRM_ID,
				'client_secret': import.meta.env.REACT_APP_AMOCRM_SECRET_KEY,
				"state": import.meta.env.REACT_APP_AMOCRM_TIME_KEY
			},
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

	getDeals();
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
				</tbody>
			</table>
		</div>
	);
}

export default Home;