import { Request, Response } from "express";

import { prisma } from "../database/index";

class MedsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      name,
      description,
      price,
      quantity,
      pharmacy_cnpj,
      active_compound,
    } = req.body;

    const existentMed = await prisma.meds.findFirst({
      where: {
        name,
      },
    });

    if (existentMed) {
      return res.status(409).json({
        message: "Med already exists",
      });
    }

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const med = await prisma.meds.create({
      data: {
        name,
        description,
        price,
        quantity,
        active_compound,
        pharmacy_cnpj,
      },
    });

    return res.status(201).json({
      message: "Med created",
    });
  }

  public async readOne(req: Request, res: Response): Promise<Response> {
    const { name } = req.params;

    const med = await prisma.meds.findFirst({
      where: {
        name,
      },
    });

    if (!med) {
      return res.status(404).json({
        message: "Med not found",
      });
    }

    delete med.id;

    return res.status(200).json(med);
  }

  public async readAll(req: Request, res: Response): Promise<Response> {
    const meds = await prisma.meds.findMany();

    return res.status(200).json(meds);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name } = req.params;

    const {
      new_name,
      description,
      price,
      quantity,
      pharmacy_cnpj,
      active_compound,
    } = req.body;

    const med = await prisma.meds.findFirst({
      where: {
        name,
      },
    });

    if (!med) {
      return res.status(404).json({
        message: "Med not found",
      });
    }

    await prisma.meds.update({
      where: {
        name,
      },
      data: {
        name: new_name,
        description,
        price,
        quantity,
        active_compound,
        pharmacy_cnpj,
      },
    });

    return res.status(200).json({
      message: "Med updated",
    });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { name } = req.params;

    const med = await prisma.meds.findFirst({
      where: {
        name,
      },
    });

    if (!med) {
      return res.status(404).json({
        message: "Med not found",
      });
    }

    await prisma.meds.delete({
      where: {
        name,
      },
    });

    return res.status(200).json({
      message: "Med deleted",
    });
  }

  public async readAllByPharmacy(
    req: Request,
    res: Response
  ): Promise<Response> {
    const { pharmacy_cnpj } = req.params;

    const meds = await prisma.meds.findMany({
      where: {
        pharmacy_cnpj,
      },
      include: {
        pharmacy: true,
      },
    });

    meds.map((med) => {
      delete med.id;
      delete med.pharmacy.id;
      delete med.pharmacy_cnpj;
    });

    return res.status(200).json(meds);
  }
}

export default new MedsController();
