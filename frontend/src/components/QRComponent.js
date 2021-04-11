import React, { useState } from 'react';
import QrReader from 'react-qr-reader';
import { Redirect } from 'react-router-dom';
import { BACKEND_API } from '../config/config';
const fetch = require('node-fetch');

const QR = () => {
    const [book, setBook] = useState('');

    const handleScan = (data) => {
        if (data != null) {
            fetch(BACKEND_API + 'getBookId', {
                method: "POST",
                body: JSON.stringify({bookID: data}),
                headers: {
                    "Content-Type": "application/json",
                    // "Access-Control-Allow-Origin": "*" ,
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
                <h3>Отсканируй QR, расположенный на последней странице книги</h3>
                <QrReader delay={100} onError={handleError} onScan={handleScan} style={{ width: '100%' }} />
                <button onClick={testRequest}>Запрос</button>
            </div>
        )
    }
    
}

export default QR;