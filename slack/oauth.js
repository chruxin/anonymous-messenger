const request = require("request");

async function oauth(req, res) {
  // When a user authorizes an app, a code query parameter is passed on the
  // oAuth endpoint.If that code is not there, we respond with an error message
  if (!req.query.code) {
    res.status(500);
    res.send({ Error: "Looks like we're not getting code." });
    // TODO: error handling middleware?
    console.log("Looks like we're not getting code.");
  } else {
    request(
      {
        url: "https://slack.com/api/oauth.access", //URL to hit
        qs: {
          code: req.query.code,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET
        }, //Query string data
        method: "GET" //Specify the method
      },
      (error, response, body) => {
        if (error) {
          console.log(error);
        } else {
          res.json(body);
        }
      }
    );
  }
}

module.exports = {
  oauth
};
