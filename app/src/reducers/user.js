import { SIGN_IN_USER, SIGN_OUT_USER } from '../actions/user.js';
import { firestore } from '../firebase.js';
import { auth } from '../firebase.js';

const INITIAL_STATE = {
  displayName: '',
  email: '',
  signedIn: false
};

const user = (state = INITIAL_STATE, action) => {
  console.log('action xuz');
  console.log(action);
  switch (action.type) {
    case SIGN_IN_USER:

      const user = action.user;
      console.log('reducer: ', user.displayName);
      return {
        ...state,
        displayName: user.displayName,
        email: user.email,
        signedIn: true
      };
    case SIGN_OUT_USER:
      return {
        ...state,
        displayName: '',
        email: '',
        signedIn: false
      };
    default:
      return state;
  }
};

export default user;