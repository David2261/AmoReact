import React, { useState, useEffect } from 'react';

interface TypeAPI {
  id: number;
  name: string;
  date: Date;
  status: string;
}

const apiUrl = 'https://adgetest23.amocrm.ru';
const clientId = import.meta.env.REACT_APP_AMOCRM_ID;
const clientSecret = import.meta.env.REACT_APP_AMOCRM_SECRET_KEY;
const redirectUri = apiUrl;
const code = import.meta.env.REACT_APP_AMOCRM_TIME_KEY;

const Home = () => {
	const [deals, setDeals] = useState<TypeAPI[]>([]);
	const [openDealRow, setOpenDealRow] = useState<HTMLTableRowElement | null>(null);

	useEffect(() => {
	getDeals();
	}, []);

	const getAccessToken = async () => {
		try {
			const response = await fetch(`${apiUrl}/oauth2/access_token`, {
				method: 'POST',
				mode: 'no-cors',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Authorization': `Bearer ${code}`,
				},
				body: `client_id=${clientId}&client_secret=${clientSecret}&redirect_uri=${redirectUri}`,
			});
			if (!response.ok) {
				throw new Error(`Error ${response.status}: ${response.statusText}`);
			}
			const tokenResponse = await response.json();
			return tokenResponse.access_token;
		} catch (error) {
			console.error(error);
		}
	};

	const getDeals = async () => {
		try {
			const accessToken = await getAccessToken();
			const response = await fetch(`${apiUrl}/api/v4/leads`, {
				method: 'GET',
				mode: 'no-cors',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
				},
			});
			const dealsResponse = await response.json();
			setDeals(dealsResponse._embedded.leads);
		} catch (error) {
			console.error(error);
		}
	};

	const getDealDetails = async (dealId: number) => {
		try {
			const accessToken = await getAccessToken();
			const response = await fetch(`${apiUrl}/api/v4/leads/${dealId}`, {
			method: 'GET',
			mode: 'no-cors',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			});
			const dealDetailsResponse = await response.json();
			const dealRow = openDealRow;
			dealRow!.innerHTML = `
			<td>${dealDetailsResponse.id}</td>
			<td>${dealDetailsResponse.name}</td>
			<td>${dealDetailsResponse.budget}</td>
			<td>${formatDate(dealDetailsResponse.created_at)}</td>
			<td>${getTaskStatus(dealDetailsResponse.tasks)}</td>
			`;
			setOpenDealRow(null);
		} catch (error) {
			console.error(error);
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
	};

	const getTaskStatus = (tasks: any[]) => {
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
	};

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
		{deals.map((deal) => (
			<tr key={deal.id} onClick={() => getDealDetails(deal.id)}>
			<td>{deal.id}</td>
			<td>{deal.name}</td>
			<td>{deal.budget}</td>
			</tr>
		))}
		</tbody>
		</table>
	</div>
  )
}


export default Home;