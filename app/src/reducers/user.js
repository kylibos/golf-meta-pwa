import { SIGNINUSER, SIGNOUTUSER } from '../actions/user.js';

const INITIAL_STATE = {
  displayName: '',
  email: '',
  loggedIn: false
};

const user = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SIGNINUSER:
      return {
        displayName: 'fart dooty',
        email: 'farty@party.com',
        loggedIn: true
      };
    case DECREMENT:
      return {
        displayName: '',
        email: '',
        loggedIn: false
      };
    default:
      return state;
  }
};

export default counter;