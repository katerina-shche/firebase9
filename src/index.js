import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, 
    // getDocs,
    onSnapshot,
    addDoc, deleteDoc, doc
} from 'firebase/firestore'


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

// collection ref
const colRef = collection(db, 'books')

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

// get real time data 

onSnapshot(colRef, (snapshot) => {
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

    deleteDoc(docRef)
        .then(() => {
            deleteBookForm.reset()
        })
  })