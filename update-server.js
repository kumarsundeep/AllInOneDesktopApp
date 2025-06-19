const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'releases')));

app.get('/update', (req, res) => {
  const version = req.query.version;
  const platform = req.query.platform || 'win32';

  if (version === '1.0.0') {
    res.json({
      name: 'v1.0.1',
      notes: 'Test update',
      pub_date: new Date().toISOString(),
      url: `http://localhost:3000/AllInOneDesktopApp-1.0.1-${platform}.zip`,
    });
  } else {
    res.status(204).end();
  }
});

app.listen(3000, () => {
  console.log('Update server running on http://localhost:3000');
});
