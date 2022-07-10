import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { prisma } from "../database/index";

class Authenticate {
  public async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

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

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "invalid password",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY, {
      expiresIn: "1h",
    });

    delete user.password;
    delete user.id;

    return res.status(200).json({
      user,
      token,
    });
  }
}

export default new Authenticate();
