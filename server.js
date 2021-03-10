const body = require('body-parser');
const express = require('express');

const app1 = express();
const app2 = express();

app1.use(body.json());
app2.use(body.json());

const handler = serverNum => (req, res) => {
	console.log(`server ${serverNum}`, req.method, req.url, req.body);
	// res.send(`Hello from server ${serverNum}!`);
	setTimeout(() => { res.send(`Hello from server ${serverNum}!`); }, 1000);
}	

app1.get('*', handler(1)).post('*', handler(1));
app2.get('*', handler(2)).post('*', handler(2));

app1.listen(3000, () => console.log('Server started: Listening at port 3000'));
app2.listen(3001, () => console.log('Server started: Listening at port 3001'));