import { Request, Response } from "express";

import { prisma } from "../database/index";

class VirusController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { scientific_name, common_name, description, meds_id } = req.body;

    const virusExists = await prisma.virus.findFirst({
      where: {
        scientific_name,
      },
    });

    if (virusExists) {
      return res.status(409).json({
        message: "Virus already exists",
      });
    }

    if (!scientific_name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    const virus = await prisma.virus.create({
      data: {
        scientific_name,
        common_name,
        description,
        meds_id,
      },
    });

    return res.status(201).json({
      message: "Virus created",
    });
  }

  public async readOne(req: Request, res: Response): Promise<Response> {
    const { scientific_name } = req.body;

    const virus = await prisma.virus.findFirst({
      where: {
        scientific_name,
      },
      include: {
        meds: true,
      },
    });

    if (!virus) {
      return res.status(404).json({
        message: "Virus not found",
      });
    }

    return res.status(200).json({
      message: "Virus found",
      virus,
    });
  }

  public async readAll(req: Request, res: Response): Promise<Response> {
    const viruses = await prisma.virus.findMany({
      include: {
        meds: true,
      },
    });

    if (!viruses) {
      return res.status(404).json({
        message: "Viruses not found",
      });
    }

    return res.status(200).json({
      message: "Viruses found",
      viruses,
    });
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { scientific_name } = req.params;
    const { new_cientific_name, common_name, description, meds_id } = req.body;

    const virus = await prisma.virus.findFirst({
      where: {
        scientific_name,
      },
    });

    if (!virus) {
      return res.status(404).json({
        message: "Virus not found",
      });
    }

    const updatedVirus = await prisma.virus.update({
      where: {
        scientific_name,
      },
      data: {
        scientific_name: new_cientific_name,
        common_name,
        description,
        meds_id,
      },
    });

    return res.status(200).json({
      message: "Virus updated",
      updatedVirus,
    });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { scientific_name } = req.params;

    const virus = await prisma.virus.findFirst({
      where: {
        scientific_name,
      },
    });

    if (!virus) {
      return res.status(404).json({
        message: "Virus not found",
      });
    }

    await prisma.virus.delete({
      where: {
        scientific_name,
      },
    });

    return res.status(200).json({
      message: "Virus deleted",
    });
  }
}

export default new VirusController();
