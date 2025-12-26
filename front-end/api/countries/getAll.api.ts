import { CountriesResponse } from "@/interface/getAll.type";
import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

export const getCountries = async () => {
  try {
    const response = await axiosInstance.get<CountriesResponse[]>("/countries");
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw error.response?.data || error;
    }
    throw error;
  }
};
