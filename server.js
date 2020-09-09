const express = require('express'),
server = express();
server.use(express.static('./dist/sd'));
server.listen(process.env.PORT || 8080);