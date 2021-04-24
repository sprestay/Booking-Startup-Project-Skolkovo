import React, {useState, useEffect} from 'react';
import { Button, Container, Row, Spinner } from 'react-bootstrap';
import Header from './Header';
import { BACKEND_API } from '../config/config';
import HashLoader from "react-spinners/HashLoader";
import { FaFileDownload } from "react-icons/fa";
const fetch = require('node-fetch');


const GenerateQR = () => {
    const [qr, setQR] = useState(null);
    const [loader, setLoader] = useState(true);

    const fetchData = async () => {
        setLoader(true);
        try {
            const response = await fetch(BACKEND_API + 'generateQrForNewBook', {method: "GET"});
            const result = await response.arrayBuffer();
            setQR("data:image/png;base64, " + Buffer(result).toString('base64'));
        } catch (e) {
          console.error(e.message)
        }
        setLoader(false);
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
            <Container className={"qr_generator_container"}>
                {loader ? <div className={"qr_spinner_container"}><HashLoader color={"#FFD90F"} size={150}/></div> : <img src={qr}/>}
                <Row style={{marginTop: '30px', justifyContent: 'center'}}>
                    <Button onClick={fetchData} disabled={loader}>Создать новый QR</Button>
                    <div className={"qr_download_button_container"}>
                        <a href={qr} style={{color: 'black', display:"block" }} download="QR, наклеить на книгу">Скачать</a>
                        <FaFileDownload />
                    </div>
                </Row>
            </Container>
        </div>
    )
}

export default GenerateQR;