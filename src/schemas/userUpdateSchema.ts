import { z } from 'zod';

export const userUpdateSchema = z.object({
    nombreUsuario: z.string().max(12).optional(),
    fotoPerfil: z.string().max(255).optional(),
    contrasenya: z.string().min(8).max(255).optional(),
    descripcion: z.string().max(255).optional(),
    rol: z.enum(["Estándar", "Admin", "Científico"]).default("Estándar"),
    experiencia: z.number().int().default(0),
    notificaciones: z.boolean().default(true),
    rangoId: z.number().optional()
});