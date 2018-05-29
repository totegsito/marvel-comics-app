import statusMessage from './status';
import ErrorMessages from '../../constants/errors';
import { createUser, signIn } from '../../services/user';
import { setAuthenticationHeader } from '../../services/base';

export function signUp(formData) {
  const {
    password,
    password2,
    username,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    // Validation checks
    if (!username) return reject(new Error(ErrorMessages.missingUsername));
    if (!password) return reject(new Error(ErrorMessages.missingPassword));
    if (!password2) return reject(new Error(ErrorMessages.missingPassword));
    if (password !== password2) return reject(new Error(ErrorMessages.passwordsDontMatch));
    await statusMessage(dispatch, 'loading', true);

    return createUser({ username, password })
      .catch(reject)
      .then(() => statusMessage(dispatch, 'loading', false)
        .catch(reject)
        .then(resolve));
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); throw err.message; });
}


export function login(formData) {
  const {
    username,
    password,
  } = formData;

  return dispatch => new Promise(async (resolve, reject) => {
    try {
      await statusMessage(dispatch, 'loading', true);

      // Validation checks
      if (!username) return reject(new Error(ErrorMessages.missingEmail));
      if (!password) return reject(new Error(ErrorMessages.missingPassword));

      return signIn({ username, password })
        .then(async (res) => {
          await statusMessage(dispatch, 'loading', false);
          setAuthenticationHeader(res.token);
          return resolve(dispatch({
            type: 'USER_LOGIN',
            data: { ...res.data, username },
          }));
        })
        .catch(reject);
    } catch (ex) {
      await statusMessage(dispatch, 'error', ex.message);
      throw ex;
    }
  }).catch(async (err) => { await statusMessage(dispatch, 'error', err.message); });
}


export default {
  login,
  signUp,
};
