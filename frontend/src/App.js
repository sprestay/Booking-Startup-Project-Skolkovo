import React, {useState} from "react";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import firebase from "firebase";
import Main from './components/Main';
import AddNewBook from './components/AddNewBooks';
import GenerateQR from './components/GenerateQR';
import BookComponent from './components/BookComponent';
import RegisterLoginComponent from './components/RegisterLoginComponent';
import QRScanner from './components/QRScanner';
import HashLoader from "react-spinners/HashLoader";
// new
import PermissionRequest from './components/PermissionRequest';
import DeniedComponent from './components/DeniedComponent';
import { setBorrowedBooks, setBookList, setCurrentUser } from './redux/action';
import { useDispatch } from 'react-redux';
import { BACKEND_API } from './config/config';

import './css/App.css';
import fetch from "node-fetch";

function App() {
  const [toLogin, setToLogin] = useState(false); // исправить
  const [pageIsLoading, setPageIsLoading] = useState(true); // исправить
  const [permission, setPermisson] = useState('prompt');
  const [permissionWasUpdated, setPermissonWasUpdated] = useState(false);
  const dispatch = useDispatch();
  // Нужно ли нам проваливаться в онбординг, запрашиваем разрешения
  navigator.permissions.query({name: 'camera'}).then((result) => {
      if (result.state === 'granted') {
          setPermisson('granted');
      } else if (result.state == 'prompt') {
          setPermisson('prompt');
      } else {
          setPermisson('denied');
      }
  }).catch((err) => console.log("Error happens....", err));

  switch(permission) {
      case 'prompt':
          return <PermissionRequest permissonWasUpdated={setPermissonWasUpdated}/>
      case 'denied':
          return <DeniedComponent />
  }

  // Проврка / создание пользователя
  firebase.auth().onAuthStateChanged(async function(user) {
    if (user) {
      setToLogin(false);
      fetch(BACKEND_API + 'getUsersBooks', { // получаем список книг, взятых пользователем
        method: "POST",
        body: JSON.stringify({userID: user.uid}),
        headers: {
            "Content-Type": "application/json",
        }
      }).then((res) => res.json()).then((books) => dispatch(setBorrowedBooks(books))).catch((err) => console.log("Error getting borrowed books"));
      dispatch(setCurrentUser(user)); // сохраняем текущего пользователя в redux
    } else {
      setToLogin(true);
    }
    setPageIsLoading(false);
  });
  

  if (pageIsLoading) {
    return <div className={"qr_spinner_container"}><HashLoader color={"#FFD90F"} size={150}/></div>
  } else {
    return (
      <Router>
        <Switch>
            <Route exact path="/" render={(props) => toLogin ? <RegisterLoginComponent /> : <Main {...props} />} />
            <Route path="/book" render={(props) => toLogin ? <RegisterLoginComponent /> : <BookComponent {...props}/>} />
            <Route path="/create" render={(props) => toLogin ? <RegisterLoginComponent /> : <AddNewBook {...props}/>} />
            <Route path="/generate" render={(props) => toLogin ? <RegisterLoginComponent /> : <GenerateQR />} />
            <Route path="/register" render={(props) => toLogin ? <RegisterLoginComponent /> : <Redirect to="/" />} />
            <Route path="/scan" render={(props) => toLogin ? <RegisterLoginComponent /> : <QRScanner />} />
          </Switch>
      </Router>
    );
  }
}

export default App;
