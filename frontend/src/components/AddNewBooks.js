import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Form, Button, Row, Alert, Container } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useHistory } from "react-router-dom";
import { BACKEND_API } from '../config/config';
import cat_photo from '../images/on_create_book.png';
import { HiCamera, HiFolderDownload, HiOutlineBookOpen } from 'react-icons/hi';
import AlertMessage from './AlertMessage';
const fetch = require('node-fetch');


const AddNewBook = (props) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState('');
    const [errorLabel, setErrorLabel] = useState(false);
    const [warningLabel, setWarningLabel] = useState(false);
    const [inCameraMode, setCameraMode] = useState(false);

    // Для редиректа
    var history = useHistory();

    if (!(props.location.state && props.location.state.book && props.location.state.book.bookID)) // переход на страницу возможен только с выбранной книгой
        return <Redirect to='/' /> // проверить!
    let book = props.location.state.book;

    // Функция для конвертации загружаемых файлов в base64
    const fileToBase64 = (file) => {
        return new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(file);
        })
    }
    // Загрузка изображений с устройства пользователя
    const uploadImageFromDevice = async (event) => {
        // Данный код, позволяет загрузить несколько фото. Сейчас мы отказались от него, так боимся нагружать базу

        // var image_array = [];
        // for (let i = 0; i < event.target.files.length; i++) {
        //     image_array.push(fileToBase64(event.target.files[i]));
        // }
        // image_array = await Promise.all(image_array);
        // setImages(images.length ? images.concat(image_array) : image_array);
        var image = event.target.files[0];
        image = await fileToBase64(image);
        setPhoto(image);
    }

    const submitFunc = async () => {
        if (title && author && photo) {
            setWarningLabel(false);
            const result = await fetch(BACKEND_API + 'updateBook', {
                method: "POST", 
                body: JSON.stringify({bookID: book.bookID, fields: {"image": photo, "title": title, "author": author, "decription": description, "available": true}}),
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((res) => res.json()).catch((err) => {
                console.log(err);
                setErrorLabel(true);
                document.getElementById("alert_message_id").scrollIntoView(true); // скролл к ошибке
            });
            
            if (result && result.result == 'success') {
                history.replace({
                    pathname: '/', 
                    state: {after_create: true}
                }); // СЮДА передать сообщение об успехе
            } else {
                setErrorLabel(true);
                document.getElementById("alert_message_id").scrollIntoView(true); // скролл к ошибке
            }
        } else {
            setWarningLabel(true);
            document.getElementById("alert_message_id").scrollIntoView(true); // скролл к ошибке
        }
    }

    const getShoot = (base64) => {
        // setImages(images.length ? images.concat([base64]) : [base64]);
        setPhoto(base64);
        setCameraMode(false);
    }

    return (
        <div>
            <Header />
            <div style={{display: 'flex', justifyContent: 'center', marginTop: "20px"}}>
                <img src={cat_photo} style={{width: '50%'}}/>
            </div>

            <h4 className={"page_heading_text"}>{inCameraMode ? "Сделайте снимок обложки" : "ДОБАВЛЕНИЕ КНИГИ"}</h4>
            <p className={"page_heading_subheader"}>ПОЖАЛУЙСТА ЗАПОЛНИТЕ ОБЯЗАТЕЛЬНЫЕ ПОЛЯ*</p>

            <div style={{display: inCameraMode ? 'block' : 'none'}}>
                <Camera
                    idealFacingMode = {FACING_MODES.ENVIRONMENT}
                    isFullscreen = {false}
                    idealResolution = {{width: "300px", height: '400px'}}
                    isImageMirror = {false}
                    onTakePhoto = {(d) => getShoot(d)}
                />
            </div>
            
            {/* Блок алертов. Срабатывают в зависимости от ситуации */}
            {errorLabel ? <AlertMessage type={"error"} message={"НЕПРЕДВИДЕННАЯ ОШИБКА. ПОПРОБУЙТЕ ПОЗЖЕ"} /> : ( warningLabel ?  <AlertMessage type={"warning"} message={"НЕОБХОДИМО УКАЗАТЬ НАЗВАНИЕ И АВТОРА КНИГИ, ПРИЛОЖИТЬ ИЗОБРАЖЕНИЕ"}/>  : '')}

            <div>
            <Form style={{display: inCameraMode ? 'none' : 'block'}} className={"create_book_form"}>
                <Form.Group>
                    <Form.Label className={"create_form_labels"}>НАЗВАНИЕ КНИГИ*</Form.Label>
                    <Form.Control className={"input_field"} type="text" value={title} onChange={e => setTitle(e.target.value)}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label className={"create_form_labels"}>АВТОР КНИГИ*</Form.Label>
                    <Form.Control className={"input_field"} type="text" value={author} onChange={e => setAuthor(e.target.value)}/>
                </Form.Group>

                <Form.Group style={{marginTop: '50px'}}>
                    <Form.Label className={"page_heading_subheader"} style={{fontSize: '10px'}}>ПРИ ЖЕЛАНИИ ВЫ МОЖЕТЕ НАПИСАТЬ СВЯЗАННУЮ С КНИГОЙ ИСТОРИЮ, ЕЁ УВИДЯТ ДРУГИЕ ПОЛЬЗОВАТЕЛИ</Form.Label>
                    <Form.Control className={"input_field"} as="textarea" rows={5} onChange={e => setDescription(e.target.value)} value={description}/>
                </Form.Group>

                <p className={"create_form_labels"}>ДОБАВЬТЕ ФОТОГРАФИЮ КНИГИ</p>
                {/* Form.file нивидим */}
                <Form.Group style={{display: 'none'}}> 
                    <Form.File id='input-file' label="Загрузить фото" accept=".png, .jpeg" onChange={uploadImageFromDevice}/>
                </Form.Group>

                <Container>
                    {photo ? <img src={photo} className={"uploaded_image"} /> : ''}
                    <Row style={{justifyContent: 'space-between', margin: '5px 35px'}}>
                        <Button variant={"warning"} className={"button_container"} onClick={() => setCameraMode(true)}><HiCamera size={50} color={'rgb(255,255,255)'}/></Button>
                        <Button variant={"warning"} className={"button_container"} onClick={() => document.getElementById('input-file').click()}><HiFolderDownload size={50} color={'rgb(255,255,255)'}/></Button>
                    </Row>
                </Container>

                <div style={{textAlign: 'center', marginTop: '30px'}}>
                    <Button variant={"warning"} className={"submit_create_page_button"} onClick={submitFunc}>
                        <div>
                            <HiOutlineBookOpen size={30} color={'white'}/>
                        </div>
                        <div>
                            <p style={{color: "white", fontWeight: 'bold', marginLeft: '20px'}}>СОХРАНИТЬ</p>
                        </div>
                    </Button>
                </div>
            </Form>
            </div>
        </div>
    )

// Проверка на слишком большой файл
// Добавить сжатие файла на клиенте
}

export default AddNewBook;