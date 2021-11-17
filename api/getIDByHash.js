const { createClient } = require('urql');
require('isomorphic-unfetch');
const client = createClient({
  url: 'https://' + process.env.graphQLPath,
  fetchOptions: {
    headers: {
      'x-hasura-admin-secret': process.env.hasuraAdminSecret,
    },
  },
});
const getUserByHashTemplate = `query getUserByHash {
  user(where: {hash: {_eq: "$hash"}}) {
    id
    hash
    login
  }
}`;

module.exports = async (req, res) => {
  try {
    const hash = req.headers.cookie
      .split(';')
      .filter((item) => item.startsWith('token='))
      .join('')
      .replace('token=', '');
    const getUserByHash = getUserByHashTemplate.replace('$hash', hash);
    const { data, error } = await client.query(getUserByHash).toPromise();
    if (error) {
      res.status(500).json();
      return;
    }
    const id = data.user[0]?.id;
    res.status(id ? 200 : 404).json(id ? id : null);
  } catch (e) {
    res.status(500).json('Unexpected error: ' + e);
  }
};
