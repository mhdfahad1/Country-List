import { Request, Response } from "express";
import axios from "axios";

const BASE_URL = process.env.COUNTRIES_API || "https://restcountries.com/v3.1";

export const getAllCountries = async (
  _req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const response = await axios.get(`${BASE_URL}/all`, {
      params: {
        fields: "name,flags,region,capital,population,languages",
      },
    });

    if (!response.data || !Array.isArray(response.data)) {
      return res
        .status(500)
        .json({ message: "Invalid response from countries API" });
    }

    const countries = response.data.map((country: any) => ({
      name: country.name?.common || "Unknown",
      flag: country.flags?.png || "",
      region: country.region || "Unknown",
      capital: country.capital?.[0] || "N/A",
      population: country.population || 0,
      languages: country.languages ? Object.values(country.languages) : [],
    }));

    res.status(200).json(countries);
  } catch (error: any) {
    console.error("Error fetching countries:", error.message);
    res.status(500).json({
      message: "Failed to fetch countries",
      error: error.message,
    });
  }
};

export const getCountryByName = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ message: "Country name is required" });
    }

    const response = await axios.get(
      `${BASE_URL}/name/${encodeURIComponent(name)}`
    );

    if (
      !response.data ||
      !Array.isArray(response.data) ||
      response.data.length === 0
    ) {
      return res.status(404).json({ message: "Country not found" });
    }

    const country = response.data[0];

    res.status(200).json({
      name: country.name?.common || "Unknown",
      flag: country.flags?.png || "",
      region: country.region || "Unknown",
      capital: country.capital?.[0] || "N/A",
      population: country.population || 0,
      languages: country.languages ? Object.values(country.languages) : [],
    });
  } catch (error: any) {
    console.error("Error fetching country:", error.message);
    if (error.response?.status === 404) {
      res.status(404).json({ message: "Country not found" });
    } else {
      res.status(500).json({
        message: "Failed to fetch country",
        error: error.message,
      });
    }
  }
};
