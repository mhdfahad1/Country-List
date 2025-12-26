import { getCountries } from "@/api/countries/getAll.api";
import { getCountryByName } from "@/api/countries/getByName.api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Select } from "../ui/select";
import { CountryCard } from "./country-card";
import { CountryDetail } from "./country-detail";
import type { CountriesResponse } from "@/interface/getAll.type";

const REGIONS = ["All", "Africa", "Americas", "Asia", "Europe", "Oceania"];

export default function ListCountries() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedCountry, setSelectedCountry] =
    useState<CountriesResponse | null>(null);
  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Query for all countries (when no search)
  const {
    data: allCountries = [],
    isLoading: isLoadingAll,
    error: errorAll,
  } = useQuery({
    queryKey: ["countries"],
    queryFn: () => getCountries(),
    enabled: !debouncedSearchQuery.trim(), // Only fetch when there's no search
  });

  // Query for search results (list view and detail modal)
  const {
    data: selectedCountryData,
    isLoading: isLoadingSearch,
    error: errorSearch,
  } = useQuery({
    queryKey: ["country", debouncedSearchQuery],
    queryFn: () => getCountryByName(debouncedSearchQuery),
    enabled: !!debouncedSearchQuery.trim(),
    retry: false,
  });

  // Determine which data to use
  const baseCountries = debouncedSearchQuery.trim()
    ? selectedCountryData
      ? [selectedCountryData]
      : []
    : allCountries ?? [];

  // Apply region filter
  const countries = useMemo(() => {
    if (!baseCountries || baseCountries.length === 0) {
      return [];
    }
    if (selectedRegion === "All") {
      return baseCountries;
    }
    return baseCountries.filter((country) => country.region === selectedRegion);
  }, [baseCountries, selectedRegion]);

  const isLoading = debouncedSearchQuery.trim()
    ? isLoadingSearch
    : isLoadingAll;
  const error = debouncedSearchQuery.trim() ? errorSearch : errorAll;

  // Read message from normalized Error (e.g. "Country not found")
  const errorMessage =
    error && error instanceof Error && typeof error.message === "string"
      ? error.message
      : null;

  const notFoundMessage =
    debouncedSearchQuery.trim() && errorMessage === "Country not found"
      ? errorMessage
      : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Countries Explorer
        </h1>

        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Search countries by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
            >
              {REGIONS.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {error && !debouncedSearchQuery.trim() ? (
          <div className="text-center py-12">
            <p className="text-red-500">
              Error loading countries. Please make sure the backend is running.
            </p>
          </div>
        ) : isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading countries...</p>
          </div>
        ) : (
          <>
            {error && debouncedSearchQuery.trim() && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">
                  {notFoundMessage
                    ? notFoundMessage
                    : "Error searching for countries. Please try again."}
                </p>
              </div>
            )}
            <p className="text-sm text-muted-foreground mb-4">
              {debouncedSearchQuery.trim()
                ? `Search results for "${debouncedSearchQuery}"`
                : selectedRegion !== "All"
                ? `Found ${countries.length} countries in ${selectedRegion}`
                : `Found ${countries.length} countries`}
            </p>
            {countries.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {countries.map((country) => (
                  <CountryCard
                    key={country.name}
                    country={country}
                    onClick={() => setSelectedCountry(country)}
                  />
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    {debouncedSearchQuery.trim()
                      ? notFoundMessage ??
                        `No country found with name "${debouncedSearchQuery}"`
                      : selectedRegion !== "All"
                      ? `No countries found in ${selectedRegion}`
                      : "No countries found"}
                  </p>
                </div>
              )
            )}
          </>
        )}
      </div>

      {selectedCountry && (
        <CountryDetail
          country={selectedCountry}
          onClose={() => setSelectedCountry(null)}
        />
      )}
    </div>
  );
}
