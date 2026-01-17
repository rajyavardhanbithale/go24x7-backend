import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  endpoint: process.env.S3_RUSTFS_ENDPOINT,
  region: "us-east-1", // Dummy region, RustFS doesn't use it
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true, // IMPORTANT for RustFS
});

export default s3;
