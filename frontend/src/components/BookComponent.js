import React, {useState, useEffect} from 'react';
import { Button, Container } from 'react-bootstrap';
import Header from './Header';
import { Redirect, useHistory } from 'react-router-dom';
import { BACKEND_API } from '../config/config';
import firebase from "firebase";
import stack_of_books from '../images/stack_of_books.png';
import { useSelector, useDispatch } from 'react-redux';
import { addToBorrowedBooks, deleteFromBorrowedBooks } from '../redux/action';
const fetch = require('node-fetch');


const BookComponent = (props) => {
    let book = props.location.state ? props.location.state.book : undefined;
    console.log(book);
    const [user, setUser] = useState(false);
    var history = useHistory();
    const dispatch = useDispatch();

    if (!(book))
        return <Redirect to='/' />

    firebase.auth().onAuthStateChanged(function(user) {
        if (user)
            setUser(user);
    });

    const _fetchBackendFunc = async (status) => {
        await fetch(BACKEND_API + 'updateBook', {
            method: "POST", 
            body: JSON.stringify({bookID: book.bookID, fields: {"taken": status}}),
            headers: {
                "Content-Type": "application/json", 
            }
        }).then((res) => res.json()).then((res) => console.log('Fetch success!', res)).catch((err) => console.log(err));
        history.replace('/');
    }


    const interactionFunc = (option) => {
        console.log(user.uid);
        if ((user && book.taken == false) || (option == 'take')) { // книга свободна
            _fetchBackendFunc(user.uid);
            dispatch(addToBorrowedBooks(book));
        } else if ((user && book.taken == user.uid) || (option == 'leave')) { // книга у текущего пользователя
            _fetchBackendFunc(false);
            dispatch(deleteFromBorrowedBooks(book));
        } else {
            return ;
        }
    }

    const buttonRender = () => {
        if (book.taken == false) {
            return <Button className={"book_interaction_button"} onClick={interactionFunc}>ВЗЯТЬ КНИГУ</Button>
        } else if (book.taken == user.uid) {
            return <Button className={"book_interaction_button"} onClick={interactionFunc}>СДАТЬ КНИГУ</Button>
        } else if (book.taken != user.uid) {
            return (
                <div>
                    <p className={"create_form_labels"}>СТРАННО, КНИГА ЧИСЛИТСЯ НЕ ЗА ТОБОЙ.</p>
                    <p className={"page_heading_subheader"} style={{marginTop: '10px'}}>ВИДИМО ПРОШЛЫЙ ВЛАДЕЛЕЦ ЗАБЫЛ ДОЛЖНЫМ ОБРАЗОМ ПРОВЗАИМОДЕЙСТВОВАТЬ С СЕРФИСОМ</p>
                    <Button className={"book_interaction_button"} onClick={() => interactionFunc('leave')}>Я ВОЗВРАЩАЮ ЭТУ КНИГУ</Button>
                    <Button className={"book_interaction_button"} style={{marginTop: '0px'}} onClick={() => interactionFunc('take')}>Я БЕРУ ЭТУ КНИГУ</Button>
                </div>
            )
        }
    }

    const bookDesctiption = (<div><p className={"book_owner_message"}>{"ОТ ВЛАДЕЛЬЦА"}</p><p className={"book_owner_message_text"}>{book.description}</p></div>);

    return (
        <div>
            <Header />
            <Container style={{textAlign: 'center'}}>
                <img src={book.image} className={"book_image"}/>
                <h3 className={"book_title"}>"{book.title.toUpperCase()}"</h3>
                <p>{book.author.toUpperCase()}</p>
                {buttonRender()}
                {book.description ? bookDesctiption : ''} {/* вставляем комментарий автора, если он есть */}
            </Container>
        </div>
    )
}

export default BookComponent;
