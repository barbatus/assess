import aws from "aws-sdk";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: "us-east-1",
    });

    aws.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
      region: "us-east-1",
      signatureVersion: "v4",
    });

    const post = await s3.createPresignedPost({
      Bucket: process.env.S3_BUCKET,
      Fields: {
        key: req.query.file,
      },
      Expires: 60, // seconds
      Conditions: [
        ["content-length-range", 0, 5048576], // up to 1 MB
      ],
    });
    return res.status(200).json(post);
  } catch (error) {
    console.log(error);
  }
}
