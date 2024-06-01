import { z } from 'zod';
import { rankSchema } from './rankSchema';

export const userSchema = z.object({
    email: z.string().email(),
    nombreUsuario: z.string().max(12),
    fotoPerfil: z.string().max(255).optional(),
    contrasenya: z.string().min(8).max(255),
    descripcion: z.string().max(255).optional(),
    rol: z.enum(["Estándar", "Admin", "Científico"]).default("Estándar"),
    experiencia: z.number().int().default(0),
    rango: rankSchema.optional()
});