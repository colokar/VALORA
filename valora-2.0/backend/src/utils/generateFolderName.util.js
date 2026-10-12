/**
 * Convierte:
 * "Panadería San Martín"
 *
 * En:
 * "panaderia-san-martin"
 */
export const generateFolderName = (empresa) => {

    console.log("empresa: ", empresa);
    // Si empresa es null, undefined o una cadena vacía, retornamos un nombre genérico
    if (!empresa || typeof empresa !== 'string') {
        return "usuario-sin-nombre";
    }

    return empresa
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
};