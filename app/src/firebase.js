var config = {
	apiKey: "AIzaSyBwLD9Zz3OgXt-3D7jex8cfd0F3prp_G54",
	authDomain: "golf-meta-dev.firebaseapp.com",
	databaseURL: "https://golf-meta-dev.firebaseio.com",
	projectId: "golf-meta-dev",
	storageBucket: "golf-meta-dev.appspot.com",
	messagingSenderId: "823322072217"
};
firebase.initializeApp(config);

const firestore = firebase.firestore();
const auth = firebase.auth();

export default firebase;

export {
  firestore,
  auth
};