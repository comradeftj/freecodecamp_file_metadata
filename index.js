var express = require('express');
var cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

var app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    // extname -> takes the file's extenion (any string beyond the '.')
    // file.fieldname -> takes what name the file ws assigned at first upload
  }
});
const upload = multer({ storage: storage })

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single("upfile"), (req, res) => {
  if (req.file) {
    // req.file.originalName, req.file.size, req.file.mimetype
    res.json({ name: req.file.originalname, type: req.file.mimetype, size: req.file.size});
  } else {
    res.json({ error: 'invalid input' });
  }
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
