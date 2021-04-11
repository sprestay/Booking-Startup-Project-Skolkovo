import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Main from './components/Main';
import AddNewBook from './components/AddNewBooks';
import GenerateQR from './components/GenerateQR';
import BookComponent from './components/BookComponent';

function App() {

  return (
    <Router>
      <Switch>
          <Route exact path="/">
            <Main />
          </Route>
          <Route path="/book" render={(props) => <BookComponent {...props}/>} />
          <Route path="/create" render={(props) => <AddNewBook {...props}/>} />
          <Route path="/generate">
            <GenerateQR />
          </Route>
        </Switch>
    </Router>
  );
}

export default App;
