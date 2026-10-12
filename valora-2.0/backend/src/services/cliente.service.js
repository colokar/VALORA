import {
    createClienteRepository, 
    findClientesByClienteRepository,
    updateClienteRepository,
    findClienteByIdRepository,
    existsClienteRepository,
    filterClientesRepository,
} from "../repositories/cliente.repository.js";

import { AppError } from "../utils/AppError.util.js";
/**
 * 
 * @param {
 *  usuarioId, 
 *   nombre, 
 *   apellido, 
 *   email, 
 *   cuil_cuit,
 *   telefono 
 * } clienteData 
 * 
 * @returns 
 */
export const createClienteService = async (usuarioId, clienteData) => {
    
    const dataToSave = { 
        ...clienteData, 
        usuario_id:usuarioId
    };

    return await createClienteRepository(dataToSave);

};

export const getClientesByUsuarioService = async (usuarioId) => {
    return await findClientesByClienteRepository(usuarioId);
};

export const getClienteByIdService = async (usuarioId, clienteId) => {
    const cliente = await findClienteByIdRepository(usuarioId, clienteId);
    if (!cliente) {
        throw new AppError("Cliente no encontrado", 404);
    }
    return cliente;
};

export const updateClienteService = async (usuario_id, updateData) => {
    
     const exists = await existsClienteRepository(usuario_id, updateData.id);
    if(!exists) { throw new AppError("Cliente no encontrado", 404); }

    const dataToUpdate = { 
        ...updateData,
        usuario_id
    };

    const cliente = await updateClienteRepository(usuario_id, dataToUpdate);
    
    return cliente;


}

export const filterClientesService = async (usuarioId, filtro = {}, pagina = 1, limite = 5) => {
    // Aseguramos que página y límite sean números válidos
    const page = parseInt(pagina, 10) || 1;
    const limit = parseInt(limite, 10) || 5;
    const skip = (page - 1) * limit;

    // Llamamos al repositorio pasándole los parámetros requeridos
    const resultadoRepo = await filterClientesRepository(usuarioId, filtro, limit, skip);

    return {
        data: resultadoRepo.data,
        meta: {
            paginaActual: page,
            limite: limit,
            total: resultadoRepo.total,
            totalPaginas: Math.ceil(resultadoRepo.total / limit) || 1,
        }
    };
};

