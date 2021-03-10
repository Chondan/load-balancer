const fs = require('fs');
const https = require('https');
const express = require('express');
const request = require('request');

// Logging, Profiling, and SSL Termination
const profileMiddleware = (req, res, next) => {
	const start = Date.now();

	res.on('finish', () => {
		console.log('Completed', req.method, req.url, Date.now() - start);
	});
	next();
}

const servers = ['http://localhost:3000', 'http://localhost:3001'];
let cur = 0;

const handler = (req, res) => {
	// req.pipe(request({ url: servers[cur] + req.url })).pipe(res);

	// --- Adding an error handler to the 'request' object ---
	const _req = request({ url: servers[cur] + req.url }).on('error', error => {
		res.status(500).send(error.message);
	});
	req.pipe(_req).pipe(res);
	cur = (cur + 1) % servers.length;
};
const server = express().use(profileMiddleware).get('*', handler).post('*', handler);

server.listen(8080, () => console.log("Load balancer started: Listening at port 8080"));

// Start an HTTPS server with some self-signed keys
const sslOptions = {
	key: fs.readFileSync('./localhost.key'),
	cert: fs.readFileSync('./localhost.cert')
};
https.createServer(sslOptions, server).listen(4000, () => console.log("Load balancer started: Listening at port 4000"));