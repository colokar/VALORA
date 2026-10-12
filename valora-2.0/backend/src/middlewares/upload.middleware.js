import multer from "multer";

/**
 * Carpeta temporal
 */
const storage =
    multer.diskStorage({

        destination: (
            req,
            file,
            cb
        ) => {

            cb(
                null,
                "uploads/"
            );

        },

        filename: (
            req,
            file,
            cb
        ) => {

            cb(
                null,
                Date.now() +
                "-" +
                file.originalname
            );

        }

    });

export const upload =
    multer({ storage });