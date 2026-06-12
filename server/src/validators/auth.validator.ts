import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string({
    message: 'Логин обязателен',
  }).min(3, 'Логин должен содержать минимум 3 символа'),
  
  password: z.string({
    message: 'Пароль обязателен',
  }).min(8, 'Пароль должен быть не менее 8 символов'),
});