const express = require('express');
const app = new express();

const path = require('path');

app.use('/', express.static(path.join(__dirname, 'static')));

app.listen(process.env.PORT || 3000, () => {
	console.log('Express listening on port.');
});