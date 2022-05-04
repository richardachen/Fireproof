
(function(){
	// import { doc, getDoc } from "firebase/firestore";

    // Your web app's Firebase configuration
    const firebaseConfig = {
    apiKey: "AIzaSyCUZ-JRFolDPAV5pIKlxwv9EpaNsxnloMs",
    authDomain: "fireproof-375a1.firebaseapp.com",
    projectId: "fireproof-375a1",
    storageBucket: "fireproof-375a1.appspot.com",
    messagingSenderId: "931063529762",
    appId: "1:931063529762:web:3d580d8a061008934aa57b"
    };

	// // Initialize Firebase
	// const app = initializeApp(firebaseConfig);
	// Initialize Firebase
	firebase.initializeApp(firebaseConfig);

	var db = firebase.firestore();
	var uid;

	// get elements
	const email    = document.getElementById('email');
	const password = document.getElementById('password');
	const login    = document.getElementById('login');
	const signup   = document.getElementById('signup');
	const logout   = document.getElementById('logout');
	const lon = document.getElementById('lon');
	const lat = document.getElementById('lat');
	const enter = document.getElementById('enter');


	// const docRef = doc(db, "locations");
	// const docSnap = await getDoc(docRef);

	// not sure if this works?
	// if (docSnap.exists()) {
	// console.log("Document data:", docSnap.data());
	// } else {
	// // doc.data() will be undefined in this case
	// console.log("No such document!");
	// }
	// hmmmmm

	// login
	login.addEventListener('click', e => {
		console.log('Here');
		const auth  = firebase.auth();		
		const promise = auth.signInWithEmailAndPassword(email.value, password.value);
		promise.catch(e => console.log(e.message));
	});

	// signup
	signup.addEventListener('click', e => {
		// TODO: check for real email
		const auth  = firebase.auth();
		const promise = auth.createUserWithEmailAndPassword(email.value,password.value);
		promise.catch(e => console.log(e.message));
	});

    // logout
	logout.addEventListener('click', e => {
		firebase.auth().signOut();
	});

	// writing longitude and latitude
	enter.addEventListener('click', e => {
		console.log('Here');
		status.innerHTML = '';
		db.collection("locations").add({
			lon: lon.value, 
			lat: lat.value,
			user: uid
		})
		.then(function(docRef) {
			console.log("Document written with ID: " + docRef.id);
		status.innerHTML += 'Document written with ID: ${docRef.id}';
		})
	})

    // login state
	firebase.auth().onAuthStateChanged(firebaseUser => {
		if(firebaseUser){
			console.log(firebaseUser.uid);
			uid = firebaseUser.uid;
			logout.style.display = 'inline';
			login.style.display  = 'none';
			signup.style.display = 'none';
		}
		else{
			console.log('User is not logged in');
			logout.style.display = 'none';			
			login.style.display  = 'inline';
			signup.style.display = 'inline';
		}
	});

}());