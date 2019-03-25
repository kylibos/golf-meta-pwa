export const SIGNINUSER = 'SIGNINUSER';
export const SIGNOUTUSER = 'SIGNOUTUSER';

export const signInUser = () => {
  return {
    type: SIGNINUSER
  };
};

export const signOutUser = () => {
  return {
    type: SIGNOUTUSER
  };
};