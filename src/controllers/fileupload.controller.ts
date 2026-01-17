import { NextFunction, Request, Response } from "express";
import Busboy from "busboy";
import Container from "typedi";
import { FileUploadService } from "@/services/fileupload.service";

export class FileUploadController {
    public fuc = Container.get(FileUploadService);

    public uploadFile = (req: Request, res: Response, next: NextFunction): void => {
        try {
            const refId = req.params.id;
            if (!refId) {
                res.status(400).json({ message: "ref_id is required in URL" });
                return
            }

            const busboy = Busboy({ headers: req.headers });
            const uploads: Promise<void>[] = [];

            busboy.on("file", (_fieldname, fileStream, info) => {
                const { filename, mimeType } = info;

                // Stream directly to S3
                const uploadPromise = this.fuc.uploadStreamToS3(
                    fileStream,
                    filename,
                    mimeType,
                    refId as string
                );
                uploads.push(uploadPromise);
            });

            busboy.on("finish", async () => {
                try {
                    await Promise.all(uploads); // wait for all files to finish
                    res.status(201).json({ message: "File(s) uploaded successfully" });
                } catch (err) {
                    next(err);
                }
            });

            req.pipe(busboy);
        } catch (err) {
            next(err);
        }
    };
}
