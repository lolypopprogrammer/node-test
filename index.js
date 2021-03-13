// Загружаем зависимости
const express = require('express');
const multer = require('multer');
const upload = multer();
const dotenv = require('dotenv');
const cors = require('cors')
const request = require('request');
const cheerio = require('cheerio');

dotenv.config();

const app = express();

// Устанавливаем конфиги
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.array());
app.use(express.static('public'));
app.use(cors());

const PORT = process.env.PORT || 5000;


// Роутинг
app.get('/', (req, res) => {
    res.send('Server is working');
});

app.post('/getLinks', (req, response) => {
    const link = req.body.link;
    const option = {
        url: link,
        encoding: null
    }
    request(link, option, (err, res, body) => {
        if (err) throw err;
        const html = body;
        const data = {scripts: [], styles: []};
        const $ = cheerio.load(html);
        $('script').each((i, elem) => {
            elem.attribs.src?.includes('js') ? data.scripts.push(elem.attribs.src) : false;
        });
        $('link').each((i, elem) => {
            elem.attribs.href?.includes('css') ? data.styles.push(elem.attribs.href) : false;
        });
        response.send(data);
    });
});

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));