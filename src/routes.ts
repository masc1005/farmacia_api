import { Router } from "express";

import {
  PharmaciesController,
  MedsController,
  UserController,
  AuthController,
  VirusController,
  PatientController,
} from "./controllers";

import AuthMiddleware from "./middlewares/auht";

const router = Router();

router.get("/", (req, res) => {
  res.send("Hello World!");
});

router.post("/user", UserController.create);
router.post("/login", AuthController.login);

router.use(AuthMiddleware);

router.get("/pharmacies/:cnpj", PharmaciesController.readOne);
router.get("/pharmacies/:cnpj/meds", PharmaciesController.readAllByMeds);
router.get("/pharmacies", PharmaciesController.readAll);
router.post("/pharmacies", PharmaciesController.create);
router.put("/pharmacies/:cnpj", PharmaciesController.update);
router.delete("/pharmacies/:cnpj", PharmaciesController.delete);

router.get("/meds/:name", MedsController.readOne);
router.get("/meds", MedsController.readAll);
router.get("/meds/pharmacies/:cnpj", MedsController.readAllByPharmacy);
router.post("/meds", MedsController.create);
router.put("/meds/:name", MedsController.update);
router.delete("/meds/:name", MedsController.delete);

router.get("/virus/:scientific_name", VirusController.readOne);
router.get("/virus", VirusController.readAll);
router.post("/virus", VirusController.create);
router.put("/virus/:scientific_name", VirusController.update);
router.delete("/virus/:scientific_name", VirusController.delete);

router.get("/patient/:id", PatientController.readOne);
router.get("/patient", PatientController.readAll);
router.post("/patient", PatientController.create);
router.put("/patient/:id", PatientController.update);
router.delete("/patient/:id", PatientController.delete);

export default router;
