const firebaseConfig = {
  apiKey: "AIzaSyD-utxFiefXRu9eQ41QaLukNlAErZZ6_xQ",
  authDomain: "streamhunt-cbafc.firebaseapp.com",
  projectId: "streamhunt-cbafc",
  storageBucket: "streamhunt-cbafc.firebasestorage.app",
  messagingSenderId: "486383628659",
  appId: "1:486383628659:web:77f145faadf1a8c1419506"

};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

window.addEventListener("load", () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setState("signedIn", true)
      setState("user", user)
    } else {
      setState("signedIn", false)
      setState("user", null)
    }
  });
});

function firebaseCreateUserCollection(uid, collectionName) {
  return db.collection("users")
           .doc(uid)
           .collection(collectionName)
           .doc("init")
           .set({ createdAt: firebase.firestore.FieldValue.serverTimestamp() });
}

function firebaseCollectionsOnSignup(uid) {
  return Promise.all([
      firebaseCreateUserCollection(uid, "WatchList"),
      firebaseCreateUserCollection(uid, "Movies"),
      firebaseCreateUserCollection(uid, "Shows")
    ]);
}

async function firebaseAddToCollection(collection, data, id) {
  try {
    await db.collection("users").doc(state["user"].uid).collection(collection).doc(id).set(data)
    return ["success", null]
  } catch (error) {
    return ["error", error]
  }
}

async function firebaseUpdateDocCollection(collection, data, id) {
  try {
    await db.collection("users").doc(state["user"].uid).collection(collection).doc(id).update(data)
    return ["success", null]
  } catch (error) {
    return ["error", error]
  }
}

async function firebaseGetCollection(collection) {
  try {
    let snapshot =  await db.collection("users").doc(state["user"].uid).collection(collection).get()
    if (snapshot.empty == false) {
      return ["success", snapshot]
    } else if (snapshot.empty == true) {
      return ["success", "empty"]
    }
  } catch (error) {
    return ["error", error]
  }
}

async function firebaseSignup(email, password) {
  try {
    const cred = await firebase.auth().createUserWithEmailAndPassword(email, password)
    //await firebaseCollectionsOnSignup(cred.user.uid)
    return ["success", cred];
  } catch(error) {
    return ["error", error]
  }
}

async function firebaseSignOut() {
  try {
    await firebase.auth().signOut()
    return ["success", cred];
  } catch(error) {
    return ["error", error]
  }
}


async function firebaseLoginEP(email, password) {
  try {
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
    const cred = await firebase.auth().signInWithEmailAndPassword(email, password)
    return ["success", cred]
  } catch (error) {
    return new Promise(function(resolve) {resolve(["error", error])}); 
  }
}

async function firebaseChangePassword(newPassowrd) {
  try {
    const user = await firebase.auth().currentUser;
    await user.updatePassword(newPassowrd)
    return ["success", "none"]
  } catch (error) {
    return ["error", error]
  }
}
