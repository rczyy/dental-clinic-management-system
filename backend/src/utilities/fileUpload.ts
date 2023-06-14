import { hash } from "bcrypt";
import { uploadToS3 } from "../s3/uploadToS3";

export const imageUpload = async (folder: string, file: Express.Multer.File) => {
  const fileExtension = file.originalname.split(".").pop();
  const fileName = file.originalname.replace(`.${fileExtension}`, "");
  const hashedFileName = await hash(fileName, 10);

  const key = `${folder}${hashedFileName}.${fileExtension}`;

  try {
    return await uploadToS3(key, file.buffer, file.mimetype);
  } catch (error) {
    throw error;
  }
};
