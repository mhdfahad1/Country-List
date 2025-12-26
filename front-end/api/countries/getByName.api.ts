import { CountriesResponse } from "@/interface/getAll.type";
import axiosInstance from "@/service/axios";
import { AxiosError } from "axios";

export const getCountryByName = async (name: string) => {
  try {
    const response = await axiosInstance.get<CountriesResponse>(
      `/countries/${encodeURIComponent(name)}`
    );
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const backendMessage = error.response?.data?.message;
      if (backendMessage && typeof backendMessage === "string") {
        // Normalize backend error into a regular Error so React Query/devtools
        // don't log an empty {} and we can easily read error.message in the UI.
        throw new Error(backendMessage);
      }
      throw error;
    }
    throw error;
  }
};
