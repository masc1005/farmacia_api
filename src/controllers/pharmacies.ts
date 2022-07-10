import { Request, Response } from "express";

import { prisma } from "../database/index";

class PharmaciesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name, address, phone, email, cnpj } = req.body;

    const existentpharmacy = await prisma.pharmacy.findFirst({
      where: {
        cnpj,
      },
    });

    if (existentpharmacy) {
      return res.status(409).json({
        message: "pharmacy already exists",
      });
    }

    if (!cnpj) {
      return res.status(400).json({
        message: "CNPJ is required",
      });
    }

    const pharmacy = await prisma.pharmacy.create({
      data: {
        name,
        address,
        phone,
        email,
        cnpj,
      },
    });

    return res.status(201).json({
      message: "pharmacy created",
    });
  }
  public async readOne(req: Request, res: Response): Promise<Response> {
    const { cnpj } = req.params;

    const pharmacy = await prisma.pharmacy.findFirst({
      where: {
        cnpj,
      },
    });

    if (!pharmacy) {
      return res.status(404).json({
        message: "pharmacy not found",
      });
    }

    delete pharmacy.id;

    return res.status(200).json(pharmacy);
  }

  public async readAll(req: Request, res: Response): Promise<Response> {
    const pharmacy = await prisma.pharmacy.findMany();

    return res.status(200).json(pharmacy);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { cnpj } = req.params;
    const { name, address, phone, email } = req.body;

    const pharmacy = await prisma.pharmacy.findFirst({
      where: {
        cnpj,
      },
    });

    if (!pharmacy) {
      return res.status(404).json({
        message: "pharmacy not found",
      });
    }

    const updatedpharmacy = await prisma.pharmacy.update({
      where: {
        cnpj,
      },
      data: {
        name,
        address,
        phone,
        email,
      },
    });

    return res.status(200).json({
      message: "pharmacy updated",
    });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { cnpj } = req.params;

    const pharmacy = await prisma.pharmacy.findFirst({
      where: {
        cnpj,
      },
    });

    if (!pharmacy) {
      return res.status(404).json({
        message: "pharmacy not found",
      });
    }

    await prisma.pharmacy.delete({
      where: {
        cnpj,
      },
    });

    return res.status(200).json({
      message: "pharmacy deleted",
    });
  }

  public async readAllByMeds(req: Request, res: Response): Promise<Response> {
    const { cnpj } = req.params;

    if (!cnpj) {
      return res.status(400).json({
        message: "CNPJ is required",
      });
    }

    const pharmacys = await prisma.pharmacy.findMany({
      where: { cnpj },
      include: { medicines: true },
    });

    return res.status(200).json(pharmacys);
  }
}

export default new PharmaciesController();
