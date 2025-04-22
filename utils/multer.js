const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads')
    },
    filename:(req, file, cb)=>{
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9)
        const ext = file.mimetype.split('/')[1]
        cb(null, `${file.fieldname}_${uniqueSuffix}.${ext}`)
    }
});

const fileFilter = (req, file, cb)=>{
    //Allow Images an documents
    if(file.mimetype.startsWith('image/') || file.mimetype.startsWith('application/') || file.mimetype.startsWith
('video/')){
        cb(null, true)
    } else{
        cb(new Error('Invalid file format: Only images, videos, and documents are allowed.'));

    }
};

const limits = {
    fileSize: 1024 * 1024 * 25
};

const upload = multer({
    storage,
    fileFilter,
    limits
});

module.exports = upload;