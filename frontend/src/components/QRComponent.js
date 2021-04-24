import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import { Redirect, useHistory } from 'react-router-dom';
import { BACKEND_API } from '../config/config';
// import AlertMessage from './AlertMessage';
import Header from './Header';
const fetch = require('node-fetch');

const QR = (props) => {
    // const [showSuccesMessage, setShowSuccessMessage] = useState(props && props.location && props.location.state && props.location.state.after_create); // Если перешли из страницы создания книги
    const [book, setBook] = useState('');
    var history = useHistory();

    // if (showSuccesMessage) {
    //     setTimeout(() => { 
    //         setShowSuccessMessage(false);
    //         history.replace('', null);
    //     }, 3000);
    // }

    const handleScan = (data) => {
        if (data != null) {
            fetch(BACKEND_API + 'getBookId', {
                method: "POST",
                body: JSON.stringify({bookID: data}),
                headers: {
                    "Content-Type": "application/json",
                }
            })
            .then((response) => response.json())
            .then((response) => {
                if (!(response.result && response.result == 'error'))
                    setBook(response)
            })
            .catch((err) => console.log("Error while fetching data"));
        }
    }
    
    // функция для отладки. Вызывается при тестировании локально
    const testRequest = async () => {
        let book = await fetch(BACKEND_API + 'mockScanner', {
            method: "POST",
            body: JSON.stringify({bookID: "Привет"}),
            headers: {
                "Content-Type": "application/json",
            }
        }).then((response) => response.json())
        .then((res) => { setBook(res) })
        .catch((err) => console.log("Error while fetching data", err));
    }

    const handleError = (err) => {
        console.log("Error in scanner", err);
    }

    if (Object.keys(book).length == 1) {
        return <Redirect to={{pathname:'/create', state:{book: book}}}/>
    } else if (Object.keys(book).length > 1) {
        console.log("IN QR", book);
        return <Redirect to={{pathname:'/book', state: {book: book}}} />
    } else {
        return (
            <div>
                {/* {showSuccesMessage ?  <div className={"success_message_block_on_scanner_component-overlay"}><AlertMessage type={"success"} message={"КНИГА УСПЕШНО СОХРАНЕНА"}/></div> : ''} */}
                <Header />
                <h4 className={"page_heading_text"}>ОТСКАНИРУЙТЕ QR</h4>
                <div style={{textAlign: 'center'}}>
                    <p>QR РАСПОЛОЖЕН НА ПОСЛЕДНЕЙ СТРАНИЦЕ КНИГИ</p>
                </div>
                <QrReader delay={100} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
                <button onClick={testRequest}>Запрос</button>
            </div>
        )
    }
    
}

export default QR;