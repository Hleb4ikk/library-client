import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "@/database/db.js";
import { users } from "../db/schema.js";
import { registerSchema } from "../validators/auth.validator.js";
import type { ZodIssue } from "zod";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const validationResult = registerSchema.safeParse(req.body);

    if (!validationResult.success) {
      res.status(400).json({
        error: "Ошибка валидации данных",
        details: validationResult.error.issues.map(
          (err: ZodIssue) => err.message,
        ),
      });
      return;
    }

    const { username, password } = validationResult.data;

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (existingUser.length > 0) {
      res
        .status(409)
        .json({ error: "Пользователь с таким логином уже существует" });
      return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await db
      .insert(users)
      .values({
        username,
        passwordHash,
      })
      .returning({
        id: users.id,
        username: users.username,
      });

    if (!newUser[0]) {
      res.status(500).json({ error: "Не удалось создать пользователя" });
      return;
    }

    const user = newUser[0];

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" },
    );

    res.status(201).json({
      message: "Пользователь успешно зарегистрирован",
      token,
      user,
    });
  } catch (error) {
    console.error("Ошибка при регистрации:", error);
    res.status(500).json({ error: "Внутренняя ошибка сервера" });
  }
};
