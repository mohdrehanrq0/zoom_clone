const express = require('express');
const route = express.Router();

const service = require('../services/render');

route.get('/', service.room);

route.get('/:roomId', service.roomId);

route.get('/t/thanks', service.thanks);

module.exports = route;
