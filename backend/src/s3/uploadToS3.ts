import S3 from "aws-sdk/clients/s3";

export const uploadToS3 = async (
  key: string,
  body: S3.Body,
  contentType: string
) => {
  const region = process.env.AWS_REGION;
  const bucket = process.env.AWS_BUCKET;
  const accessKeyId = process.env.AWS_ACCESS_KEY;
  const secretAccessKey = process.env.AWS_SECRET_KEY;

  if (!region) throw new Error("No AWS region provided");
  if (!bucket) throw new Error("No AWS bucket provided");
  if (!accessKeyId) throw new Error("No AWS access key provided");
  if (!secretAccessKey) throw new Error("No AWS secret key provided");

  const s3 = new S3({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  const params: S3.PutObjectRequest = {
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: contentType,
  };

  try {
    return await s3.upload(params).promise();
  } catch (error) {
    throw error;
  }
};
