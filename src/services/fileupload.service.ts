import { Upload } from "@aws-sdk/lib-storage";
import { Service } from "typedi";
import s3 from "@/lib/s3client";
import { Readable } from "stream";

@Service()
export class FileUploadService {
  public async uploadStreamToS3(
    stream: Readable,
    filename: string,
    mimeType: string,
    ref_id: string
  ): Promise<void> {
    console.log(`Uploading file for ref_id: ${ref_id}`);
    const upload = new Upload({
      client: s3,
      params: {
        Bucket: 'test',
        Key: `user_upload/${ref_id}/${Date.now()}-${filename}`,
        Body: stream,
        ContentType: mimeType,
      },
    });

    await upload.done();
  }
}
