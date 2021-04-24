import React, { useState, useEffect } from 'react';
import Header from './Header';
import AlertMessage from './AlertMessage';
import { IoCameraReverseOutline } from 'react-icons/io5';
import { AiOutlineQrcode } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import { BACKEND_API } from '../config/config';
import firebase from "firebase";
import { useSelector, useDispatch } from 'react-redux';
import cat_on_books from '../images/cat_on_books.png';
const fetch = require('node-fetch');


const Main = (props) => {
    const [showSuccesMessage, setShowSuccessMessage] = useState(props && props.location && props.location.state && props.location.state.after_create); // Если перешли из страницы создания книги
    const borrowedBooks = useSelector(state => state.borrowedBooks);
    let widthOfBorrowedList = '300px';
    var history = useHistory();

    if (showSuccesMessage) {
        setTimeout(() => { 
            setShowSuccessMessage(false);
            history.replace('', null);
        }, 3000);
    }

    useEffect(() => {
        let cat_size = document.getElementById("cat_photo").offsetWidth;
        let margin_left = 20;
        widthOfBorrowedList = (window.innerWidth - cat_size - margin_left).toString() + 'px';
    });

    const renderBook = (book) => {
        return (
            <div className={"borrowed_container"} key={book.bookID}>
                <img src={book.image} />
                <p style={{fontSize: '10px', fontFamily: "Montserrat Bold"}}>{book.title.toUpperCase()}</p> 
            </div>
        )
    }

    return (
        <div>
            <Header />
            {showSuccesMessage ?  <div className={"success_message_block_on_scanner_component-overlay"}><AlertMessage type={"success"} message={"КНИГА УСПЕШНО СОХРАНЕНА"}/></div> : ''}

            <div className={"main_menu"}>
                <div className={"menu_item"} onClick={() => history.push('/scan')}>
                    <div className={"external_menu_button"}>
                        <div className={"menu_button"}>
                            <IoCameraReverseOutline />
                        </div>
                    </div>
                    <h6 className={"menu_subtitle"}>СКАНЕР</h6>
                </div>
                
                <div className={"menu_item"} onClick={() => history.push('/generate')}>
                    <div className={"external_menu_button"}>
                        <div className={"menu_button"}>
                            <AiOutlineQrcode />
                        </div>
                    </div>
                    <h6 className={"menu_subtitle"}>ДОБАВИТЬ</h6>
                </div>
            </div>
            <div className={"borrowed_list"}>
                <p style={{fontFamily: "Montserrat Bold"}}>НЕ ЗАБУДЬ ВЕРНУТЬ:</p>
                <div style={{display: 'flex', alignItems: 'center', marginTop: '100px'}}>
                    <div style={{position: 'absolute', display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}} >
                        <img src={cat_on_books} id={"cat_photo"} className={"borrowed_container"} />
                        <div className={"borrowed_scrollable"} style={{width: widthOfBorrowedList, marginLeft: '20px'}}>
                            {borrowedBooks.length ? borrowedBooks.map(renderBook) : ''}
                        </div>
                    </div>
                    <div className={"yellow_line"}/>
                </div>
            </div>
        </div>
    )
}
export default Main;