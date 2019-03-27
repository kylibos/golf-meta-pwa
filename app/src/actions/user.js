export const SIGN_IN_USER = 'SIGN_IN_USER';
export const SIGN_OUT_USER = 'SIGN_OUT_USER';

export const signInUser = (user) => {
	console.log('user', user.uid);
  return {
    type: SIGN_IN_USER,
    user
  };
};

export const signOutUser = () => {
  return {
    type: SIGN_OUT_USER
  };
};