const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(path.resolve('dist/marrso-studio/browser')));
app.listen(4401, '127.0.0.1', () =>
  console.log('Static production preview: http://127.0.0.1:4401'),
);
