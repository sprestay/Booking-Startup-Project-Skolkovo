import React, {useState, useEffect} from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import Header from './Header';
import { BACKEND_API } from '../config/config';
const fetch = require('node-fetch');


const GenerateQR = () => {
    const [qr, setQR] = useState(null);

    const fetchData = async () => {
        try {
          const response = await fetch(BACKEND_API + 'generateQrForNewBook', {method: "GET"});
          const result = await response.arrayBuffer();
          // непосредственное обновление состояния при условии, что компонент не размонтирован (Было условие if(!cleanupFunction))
            setQR("data:image/png;base64, " + Buffer(result).toString('base64'));
        } catch (e) {
          console.error(e.message)
        }
    };

    useEffect(() => {
        let cleanupFunction = false;
        fetchData();
        // функция очистки useEffect
        return () => cleanupFunction = true;
    }, []);

    return (
        <div>
            <Header />
            <Container style={{textAlign: 'center'}}>
                <img src={qr}/>
                <Row style={{marginTop: '30px', justifyContent: 'center'}}>
                    <Button onClick={fetchData}>Создать новый QR</Button>
                    <a style={{marginLeft: "20px"}} href={qr} download="QR, наклеить на книгу">Скачать</a>
                </Row>
            </Container>
        </div>
    )
}

export default GenerateQR;