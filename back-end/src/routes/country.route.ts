import { Router } from "express";
import {
  getAllCountries,
  getCountryByName,
} from "../controllers/country.controller";

const router = Router();

router.get("/", getAllCountries);
router.get("/:name", getCountryByName);

export default router;
