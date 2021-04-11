import React, { useState, useEffect } from 'react';
import Header from './Header';
import { Form, Button, Row, Alert } from 'react-bootstrap';
import { Redirect } from 'react-router-dom'
import Camera, { FACING_MODES, IMAGE_TYPES } from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
import { useHistory } from "react-router-dom";
import { BACKEND_API } from '../config/config';
const fetch = require('node-fetch');


const AddNewBook = (props) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [photo, setPhoto] = useState('');
    const [errorLabel, setErrorLabel] = useState(false);
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

    // Функция для отрисовки карточки изображения на клиенте
    const renderImage = (item, index) => {
        return (<div style={{flexDirection: 'row'}}>
                    <img src={item} style={{width: '100px'}} />
                </div>)
    }

    const submitFunc = async () => {
        if (title && author && photo) {
            const result = await fetch(BACKEND_API + 'updateBook', {
                method: "POST", 
                body: JSON.stringify({bookID: book.bookID, fields: {"image": photo, "title": title, "author": author, "decription": description, "available": true}}),
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((res) => res.json()).catch((err) => console.log(err));
            
            console.log(result);
            if (result && result.result == 'success') {
                document.getElementById('success_message').style.display = 'block';
                setTimeout(() => history.replace('/'), 3000);
            } else {
                document.getElementById('fetch_error').style.display = 'block';
                setTimeout(() => {
                    document.getElementById('fetch_error').style.display = 'none';
                }, 5000)
            }

            // history.replace('/'); // вернуться домой

        } else {
            setErrorLabel(true);
            setTimeout(() => setErrorLabel(false), 3000)
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
            <h1>{inCameraMode ? "Сделайте снимок обложки" : "Нужно добавить книгу"}</h1>
            <div style={{display: inCameraMode ? 'block' : 'none'}}>
                <Camera
                    idealFacingMode = {FACING_MODES.ENVIRONMENT}
                    isFullscreen = {false}
                    idealResolution = {{width: "300px", height: '400px'}}
                    isImageMirror = {false}
                    onTakePhoto = {(d) => getShoot(d)}
                />
            </div>

            <div id='success_message' style={{display: 'none', backgroundColor: 'green'}}> {/* modal window with success message */}
                <h4>Книга успешно сохранена</h4>
                <p>Ты будешь перенаправлен на главную страницу</p>
            </div>
            <div id='fetch_error' style={{display: 'none', backgroundColor: 'red'}}> {/* modal window with success message */}
                <h4>Произошла ошибка</h4>
                <p>Попробуйте позже</p>
            </div>

            <div>
            <Form style={{display: inCameraMode ? 'none' : 'block'}}>
                <Form.Group>
                    <Form.Label>Название</Form.Label>
                    <Form.Control type="text" placeholder="Введите название книги" value={title} onChange={e => setTitle(e.target.value)}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Автор</Form.Label>
                    <Form.Control type="text" placeholder="Введите автора книги" value={author} onChange={e => setAuthor(e.target.value)}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Добавьте описание книги (необязательно)</Form.Label>
                    <Form.Control as="textarea" rows={3} onChange={e => setDescription(e.target.value)} value={description}/>
                </Form.Group>

                <Form.Group style={{display: 'none'}}> 
                    <Form.File id='input-file' label="Загрузить фото" accept=".png, .jpeg" onChange={uploadImageFromDevice}/>
                </Form.Group>
                <Row style={{justifyContent: 'start', margin: '20px 5px 20px 5px'}}>
                    <Button variant={'dark'} size={'sm'} onClick={() => setCameraMode(true)}>Сделать снимок</Button>
                    <Button onClick={() => document.getElementById('input-file').click()}>Загрузить с устройства</Button>
                    { photo ? <img src={photo}/> : ""}
                </Row>

                <Alert variant={'danger'} style={{display: errorLabel ? 'block' : 'none'}}>
                    Название, автор и фото - обязательные поля. Фото - только формат jpg/png
                </Alert>

                <div style={{textAlign: 'center', marginTop: '30px'}}>
                    <Button variant="primary" onClick={submitFunc}>
                        Сохранить
                    </Button>
                </div>
                
            </Form>
            </div>
        </div>
    )

// Проверка на слишком большой файл
}

export default AddNewBook;