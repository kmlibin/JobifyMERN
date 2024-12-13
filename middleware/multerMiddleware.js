import multer from "multer";

//create a storage. memory storage or disk storage...disk, because we need that file to send to cloudinary
//provide an object with destination and
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    //where you want to put the files
    cb(null, "public/uploads");
  },
  //optional since we are sending right to cloudinary
  fileName: (req, file, cb) => {
    const fileName = file.originalName;
    cb(null, fileName);
  },
});

const upload = multer({storage})

export default upload
