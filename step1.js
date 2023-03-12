const express = require('express');
const dns = require('dns');

const app = express();
const port = 3000;

app.get('/login', (req, res) => {
  // Get the domain from the query parameter
  const domain = req.query.domain;

  // Look up the MX record for the domain
  dns.resolveMx(domain, (err, addresses) => {
    if (err || addresses.length == 0) {
      // Handle errors or no MX record found
      res.status(404).send('No MX record found for the specified domain.');
    } else {
      // Redirect to the login page of the email service
      const mxHost = addresses[0].exchange;
      switch (mxHost) {
        case 'aspmx.l.google.com':
          res.redirect('https://mail.google.com/');
          break;
        case 'outlook.office365.com':
          res.redirect('https://outlook.office.com/');
          break;
        case 'mx.yahoo.com':
          res.redirect('https://login.yahoo.com/');
          break;
        // Add more cases for other email services as needed
        default:
          res.status(404).send('No login page found for the specified email service.');
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
