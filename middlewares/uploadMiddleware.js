const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Folder tempat menyimpan file upload
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext; // Membuat nama file unik
        cb(null, uniqueName);
    }
});

// filter hanya gambar yang diizinkan
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // file diterima
    } else {
        cb(new Error('Hanya file jpg/jpeg/png yang diperbolehkan'), false); // file ditolak
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;