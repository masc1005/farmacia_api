import { Request, Response } from "express";
import { prisma } from "../database/index";

class PatientController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { id, name, email, password, status, virus_id, meds_id } = req.body;

    const patientExists = await prisma.patient.findFirst({
      where: {
        email,
      },
    });

    if (patientExists) {
      return res.status(409).json({
        message: "Patient already exists",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const patient = await prisma.patient.create({
      data: {
        id,
        name,
        email,
        password,
        status,
        virus_id,
        meds_id,
      },
    });

    return res.status(201).json({
      message: "Patient created",
    });
  }

  public async readOne(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const patient = await prisma.patient.findFirst({
      where: {
        email,
      },
      include: {
        meds: true,
        virus: true,
      },
    });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    delete patient.id;
    delete patient.password;

    return res.status(200).json(patient);
  }

  public async readAll(req: Request, res: Response): Promise<Response> {
    const patients = await prisma.patient.findMany({
      include: {
        meds: true,
        virus: true,
      },
    });

    patients.map((patient) => {
      delete patient.id;
      delete patient.password;
      delete patient.virus_id;
      delete patient.meds_id;
      delete patient.meds.id;
      delete patient.virus.id;
    });

    return res.status(200).json(patients);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { name, email, password, status, virus_id, meds_id } = req.body;

    const patientExists = await prisma.patient.findFirst({
      where: {
        email,
      },
    });

    if (!patientExists) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const patient = await prisma.patient.update({
      where: {
        email,
      },
      data: {
        name,
        email,
        password,
        status,
        virus_id,
        meds_id,
      },
    });

    return res.status(200).json({
      message: "Patient updated",
    });
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const patientExists = await prisma.patient.findFirst({
      where: {
        email,
      },
    });

    if (!patientExists) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const patient = await prisma.patient.delete({
      where: {
        email,
      },
    });

    return res.status(200).json({
      message: "Patient deleted",
    });
  }
}

export default new PatientController();
