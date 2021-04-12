const functions = require("firebase-functions");
const { PassThrough, Readable } = require('stream'); // readable для создания потока = записи в firebase storage
var QRCode = require('qrcode');
const admin = require('firebase-admin');
var express = require('express');
const bodyParser = require('body-parser');

admin.initializeApp(functions.config().firebase);

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));
exports.webApi = functions.https.onRequest(main);

main.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.append('Access-Control-Allow-Headers', "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false, }));
app.use((req, res, next) => {
    res.append('Access-Control-Allow-Origin', ['*']);
    res.append('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
    res.append('Access-Control-Allow-Headers', "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    next();
});

// Функция напрямую не вызывается из приложения. С ней можно работать для ручного занесения книг
app.post('/addBook', async (req, res) => {
    var objectConstructor = ({}).constructor;
    if (req.method == "POST" && req.body.constructor === objectConstructor) {
        let data = req.body;
        data['createdTime'] = Math.floor(Date.now() / 1000) - 60;
        const addBookResult = await admin.firestore().collection('books').add(data);
        res.json({result: `New book ${addBookResult.id}!`});
    } else {
      res.json({result: "invalid request"});
    }
});

// На вход ID книги, на выход - книга, если есть
app.post('/getBookId', async (req, res) => {
    var objectConstructor = ({}).constructor;
    if (req.method == "POST" && req.body.constructor === objectConstructor) {
      try {
          const book = await admin.firestore().collection('books').doc(req.body.bookID).get();
          var output = book.data();
          output['bookID'] = book.id;
          res.json(output);
      } catch (err) {
          res.json({result: "error"})
      }
    } else {
      res.json({result: 'invalid request'});
    }
});


// Простая тестовая функция. Нету записи в бд - поэтому тут проверяем чисто работу Cors
app.post('/testFunc', async (req, res) => {
    try {        
        const qrStream = new PassThrough();
        const result = await QRCode.toFileStream(qrStream, "RomanSergeerCom",
                    {
                        type: 'png',
                        width: 300,
                        errorCorrectionLevel: 'H',
                        margin: 2,
                    }
                );
    
        let buffers = [];
        qrStream.on('data', (chunk) => { buffers.push(chunk) });
        qrStream.once('end', async () => {
            let buffer = Buffer.concat(buffers);
            try {
                var read = new Readable();
                read.push(buffer);
                read.push(null);
                const myBucket = admin.storage().bucket('gs://booksharing-2247b.appspot.com');
                const file = myBucket.file(Math.random().toString() + ".png");
            
                read.pipe(file.createWriteStream()).on('error', function (err) {
                    console.log("Again error");
                }).on('finish', () => { 
                    console.log('finishing, at last');
                    file.makePublic();
                    console.log("URL", file.publicUrl());
                });
            } catch (err) {
                console.log("ERROR in streams& Fuck firebase");
            }
            res.write(buffer, 'binary');
            res.end(null, 'binary');
        })
    } catch(err){
        console.error('Failed to return content', err);
    }
});

// Функция генерирует QR для книги, создает запись в БД
app.get('/generateQrForNewBook', async (req, res) => {
    const newBook = await admin.firestore().collection('books').add({}); // создаем запись в БД, чтобы получить ID
    try {        
        const qrStream = new PassThrough();
        const result = await QRCode.toFileStream(qrStream, newBook.id,
                    {
                        type: 'png',
                        width: 300,
                        errorCorrectionLevel: 'H',
                        margin: 2,
                    }
                );

        let buffers = [];
        qrStream.on('data', (chunk) => { buffers.push(chunk) });
        qrStream.once('end', () => {
            let buffer = Buffer.concat(buffers);
            res.write(buffer, 'binary');
            res.end(null, 'binary');
        });
        /// новое! - Удаление записи, если она не была заполнена в течении суток
        setTimeout(async () => {
            const thisBook = await admin.firestore().collection('books').doc(newBook.id).get();
            if (! thisBook.data()['title']) {
                admin.firestore().collection('books').doc(newBook.id).delete().then((res) => console.log('successfully deleted')).catch((err) => console.log("error - ", err));
            }
        }, 1000 * 60 * 60 * 24); 
        /// новое
    } catch(err){
        console.error('Failed to return content', err);
    }
});

// Функция получает данные id книги в БД и поля, которые нужно изменить
app.post('/updateBook', async (req, res) => {
    var objectConstructor = ({}).constructor;
    if (req.method == "POST" && req.body.constructor === objectConstructor) {
      try {
            let fields = req.body.fields;
            
            if (!fields['image']) res.json({result: "error"});

            let m = fields['image'].match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            let buffer = Buffer.from(m[2],'base64');
            var read = new Readable();
            read.push(buffer);
            read.push(null);
            const bucket = admin.storage().bucket('gs://booksimages');
            const file = bucket.file(req.body.bookID.toString() + ".png");
            read.pipe(file.createWriteStream())
                .on('finish', async () => { 
                    file.makePublic();
                    fields['image'] = file.publicUrl();
                    const result = await admin.firestore().collection('books').doc(req.body.bookID).update(fields);
                    res.json({result: 'success'});
            });
      } catch (err) {
        console.log(err)
        res.json({result: "error"});
      }

    } else {
      res.json({result: 'invalid request'});
    }
});

// Тестовая функция. Генерирует запись без сканирования QR
app.post('/mockScanner', async (req, res) => {
    let response = {};
    if (Math.random() > 0.5) {
        response = {"bookID": 123, "title": "Фауст", "author": "Гете", "Janre": "Классика"};
    } else {
        const newBook = await admin.firestore().collection('books').add({});
        response = {"bookID": newBook.id};
    }

    return res.status(200).send(response);
});


app.get('/getAllBooks', async (req, res) => {
    let foundBooks = [];
    const books = await admin.firestore().collection('books').get()
    .then((snap) => {
        snap.forEach(item => {
            foundBooks.push(item.data());
        });
    });
    res.json(foundBooks);
});
