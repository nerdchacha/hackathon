const fetch = require('node-fetch')

const checkUserAccess = async (req, res, next) => {
  const bearerHeader = req.headers['authorization']
  if (!bearerHeader) { return res.sendStatus(401) }
  const bearer = bearerHeader.split(' ')
  const token = bearer[1];
  if (!token) { return res.sendStatus(401) }
  try {
    const response = await fetch(`${process.env.JIRA_URL}/rest/api/2/myself`, { headers: {Authorization: `Bearer ${token} `} });
    const user = await response.json()
    req.jiraUser = user;
    next();
  } catch (e) {
    console.log(e)
    res.sendStatus(401)
  }
}

module.exports = {
  checkUserAccess
}