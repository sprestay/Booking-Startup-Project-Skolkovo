import React, {useState} from 'react';
import { Button, Container } from 'react-bootstrap';
import Header from './Header';
import { Redirect, useHistory } from 'react-router-dom';
import { BACKEND_API } from '../config/config';
const fetch = require('node-fetch');


const BookComponent = (props) => {
    let book = props.location.state ? props.location.state.book : undefined;
    const [interact, setInteract] = useState(book && book.available); // такая проверка поможет избежать ошибки, если книга не передана
    var history = useHistory();

    if (!(book))
        return <Redirect to='/' />

    const interactionFunc = () => {
        fetch(BACKEND_API + 'updateBook', {
            method: "POST", 
            body: JSON.stringify({bookID: book.bookID, fields: {"available": !interact}}), //"bookID": props.bookID
            headers: {
                "Content-Type": "application/json", 
            }
        }).then((res) => res.json()).then((res) => console.log('Fetch success!', res)).catch((err) => console.log(err));
        history.replace('/');
    }

    return (
        <div>
            <Header />
            <Container style={{textAlign: 'center'}}>
                <img src={book.image} />
                <h4>{book.title}</h4>
                <h5>{book.author}</h5>
                <p>{book.description}</p>
                <Button onClick={interactionFunc}>{interact ? "Взять" : "Вернуть"}</Button>
            </Container>
        </div>
    )
}

export default BookComponent;
