// middlewares/uploadMiddleware.js
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

// filter hanya gambar yang diizinkan (hanya jpeg dan png sesuai dokumentasi)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // file diterima
    } else {
        // Tidak throw error, biarkan controller yang handle
        cb(null, false);
    }
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // limit 5MB (opsional)
    }
});

module.exports = upload;