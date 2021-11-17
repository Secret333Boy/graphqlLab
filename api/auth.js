const crypto = require('crypto');
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

const insertUserMutationTemplate = `mutation insertUser {
  insert_user_one(object: {hash: "$hash", login: "$login"}) {
    id
  }
}`;

const getUserByHashTemplate = `query getUserByHash {
  user(where: {_and: {hash: {_eq: "$hash"}, login: {_eq: "$login"}}}) {
    id
    hash
    login
  }
}`;

module.exports = async (req, res) => {
  try {
    const login = req.headers.login;
    const pass = req.headers.pass;
    const salt =
      login
        .split('')
        .map((el, i) => String.fromCharCode(el.charCodeAt(0) + i))
        .join('|') + (process.env.SALT_MODIFICATION || '');
    const code = crypto
      .createHash('sha256')
      .update(login + salt + pass)
      .digest('base64');

    const getUserByHash = getUserByHashTemplate
      .replace('$hash', code)
      .replace('$login', login);
    const { data } = await client.query(getUserByHash).toPromise();
    if (data.user.length > 0) {
      res.status(200).json(code);
      return;
    }

    if (req.headers.register === 'true') {
      const insertUserMutation = insertUserMutationTemplate
        .replace('$hash', code)
        .replace('$login', login);
      const { error } = await client.mutation(insertUserMutation).toPromise();
      if (error) {
        res.status(500).json(error);
      }
      res.status(200).json(code);
      return;
    } else {
      res.status(404).json('User not found. Try registering?');
    }
    res.status(500).json({ o: 'Internal error', d: data });
  } catch (e) {
    console.error(e);
  }
};
