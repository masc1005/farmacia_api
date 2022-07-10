import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { prisma } from "../database/index";

class User {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const existentUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (existentUser) {
      return res.status(409).json({
        message: "user already exists",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "email is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        message: "password is required",
      });
    }

    const crypt = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: crypt,
      },
    });

    return res.status(201).json({
      message: "user created",
    });
  }

  public async readOne(req: Request, res: Response): Promise<Response> {
    const { email } = req.params;

    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    delete user.id;

    return res.status(200).json(user);
  }

  public async readAll(req: Request, res: Response): Promise<Response> {
    const users = await prisma.user.findMany();

    users.map((user) => {
      delete user.id;
      delete user.password;
    });

    return res.status(200).json(users);
  }
}

export default new User();
