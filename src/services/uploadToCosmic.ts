import { NextApiRequest } from "next";
import cosmicjs from "cosmicjs";
import multer from "multer";

//.env variables
const {
  AVATARS_BUCKET,
  AVATARS_BUCKET_WRITE_KEY,
  POSTS_BUCKET,
  POSTS_BUCKET_WRITE_KEY,
} = process.env;

// cosmicjs instance
const Cosmic = cosmicjs();

//buckets definitions
const avatarBucket = Cosmic.bucket({
  slug: AVATARS_BUCKET,
  write_key: AVATARS_BUCKET_WRITE_KEY,
});
const postsBucket = Cosmic.bucket({
  slug: POSTS_BUCKET,
  write_key: POSTS_BUCKET_WRITE_KEY,
});

//multer storage definition
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//upload to cosmicjs
const uploadToCosmic = async (req: any) => {
  //check if file exists and create a media object to store
  if (req?.file?.originalname) {
    const media_object = {
      originalname: req.file.originalname,
      buffer: req.file.buffer,
    };
    //check if the request is for avatar or post
    if (req.url && req.url.includes("post")) {
      return await postsBucket.addMedia({ media: media_object });
    } else {
      return await avatarBucket.addMedia({ media: media_object });
    }
  }
};

export {upload, uploadToCosmic}
