import { Readable } from 'stream';
import cloudinary from "../config/cloudinary.config.js";
import { generateFolderName } from "../utils/generateFolderName.util.js";
import axios from "axios";
/**
 * COMO EXPORTALO PARA USARLO EN LOS MODULOS SERVICE QUE LLEVA LA LOGICA.
 * Importación con llaves {}
 * Se utiliza cuando el archivo exporta elementos por nombre (Named Export).
 * import {
 *     uploadLogoService,
 *     uploadPdfService
 * } from "./file.service.js";
 */

/**
 * ==========================================================
 * SUBIR LOGO DE UNA EMPRESA
 * ==========================================================
 */
export const uploadLogoService = async (fileBuffer, nombreDeCarpeta) => {
    const nombreFolder = await generateFolderName(nombreDeCarpeta);

    // Convertimos el buffer a stream para Cloudinary
    const stream = Readable.from(fileBuffer);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `empresa/${nombreFolder}/logos`,
                resource_type: "image",
                overwrite: true,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve({ public_id: result.public_id, url: result.secure_url });
            }
        );
        stream.pipe(uploadStream);
    });
};

/**
 * ==========================================================
 * SUBIR PDF DE PRESUPUESTO
 * ==========================================================
 */

export const uploadPresupuestoService = async (
    fileBuffer,
    nombreDeCarpeta,
    creacionFecha,
) => {

    const nombreFolder = await generateFolderName(nombreDeCarpeta);

    const stream = Readable.from(fileBuffer);

    return new Promise((resolve, reject) => {

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: `empresas/${nombreFolder}/presupuestos/${creacionFecha}`,
                resource_type: "raw",
                public_id: `presupuesto-${creacionFecha}`,
                overwrite: true,
            },
            (error, result) => {

                if (error) {
                    console.log("ERROR CLOUDINARY PDF:", error);
                    return reject(error);
                }
console.log(result);
                resolve({
                    public_id: result.public_id,
                    url: result.secure_url,
                });

            }
        );

        stream.pipe(uploadStream);

    });
};




/**
 * ==========================================================
 * ELIMINAR ARCHIVO DE CLOUDINARY
 * ==========================================================
 */
export const deleteFileService = async (publicId, resourceType = "image") => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
        });
        return result;
    } catch (error) {
        console.error("Error al eliminar archivo en Cloudinary:", error);
        throw error;
    }
};

export const getFileStreamService = async (url) => {
    const response = await axios.get(url, {
        responseType: "stream",
    });

    return response.data;
};