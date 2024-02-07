import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, 
    // getDocs,
    onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'


const firebaseConfig = {
    apiKey: "AIzaSyALgVz1iXD7nDatQZbx0HSxf0cEhFRppuU",
    authDomain: "fire-9-dojo-ka-shche.firebaseapp.com",
    projectId: "fire-9-dojo-ka-shche",
    storageBucket: "fire-9-dojo-ka-shche.appspot.com",
    messagingSenderId: "997936482696",
    appId: "1:997936482696:web:52afa5efc2b0785184d23d"
  };

// init firebase app
initializeApp(firebaseConfig)

// init servises
const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'books')

//queries
// const q = query(colRef, where("author", "==", "patrick rothfuss"), orderBy('title', 'desc'))
const q = query(colRef, orderBy('createdAt'))

// get collection data
// getDocs(colRef)
//   .then((snapshot) => {
//     let books = []
//     snapshot.docs.forEach((doc) => {
//         books.push({ ...doc.data(), id: doc.id })
//     })
//     console.log(books)
//   })
//   .catch(err => {
//     console.log(err.message)
//   })

// get real time data (we can pass collection or query)

const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books)

})


  //adding documents
  const addBookForm = document.querySelector('.add')
  addBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    addDoc(colRef, {
        title: addBookForm.title.value,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    })
    //addDoc is async
    .then(() => {
        addBookForm.reset()
    })
  })

  //deleting documents
  const deleteBookForm = document.querySelector('.delete')
  deleteBookForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBookForm.id.value)

      //deleteDoc returns a promise with info about succes/not but it does not contain any data obj to use
    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset()
        })
  })

  //get a single document

 const docRef = doc(db, 'books', "CaosRX4eeiTkjMsARIU2")
 console.log(docRef)
//   getDoc(docRef)
//     .then((doc) => {
//         console.log(doc.data(), doc.id)
//     })

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
})

// updating a document
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', updateForm.id.value)
    console.log(docRef)

    updateDoc(docRef, {
        title: 'updated title'
    })
    .then(() => {
        updateForm.reset()
    })
})

//signing user up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    console.log(email)
    const password = signupForm.password.value
    console.log(password)
    createUserWithEmailAndPassword(auth, email, password)
    .then((cred) => {
        // console.log(cred, cred.user, "user created")
        signupForm.reset()
    })
    .catch((err) => {
        // console.log(err.message)
    })
})

// login and logout
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    signOut(auth)
        .then(() => {
            // console.log('the user signed out')
        })
        .catch(err => console.log(err.message))

})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password)
        .then(cred => {
            // console.log('user logged in', cred.user)
        })
        .catch(err => console.log(err.message))
})

//subscription to auth changes

const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed', user)
})

// unsubscription from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
    console.log('unsubscribing')
    unsubAuth()
    unsubCol()
    unsubDoc()
})

