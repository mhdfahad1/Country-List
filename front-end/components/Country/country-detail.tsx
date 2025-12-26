"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CountriesResponse } from "@/interface/getAll.type";

interface CountryDetailProps {
  country: CountriesResponse | undefined;
  isLoading?: boolean;
  error?: unknown;
  onClose: () => void;
}

export function CountryDetail({
  country,
  isLoading,
  error,
  onClose,
}: CountryDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              {isLoading
                ? "Loading..."
                : error
                ? "Error"
                : country?.name || "Country Details"}
            </CardTitle>
            <Button variant="ghost" onClick={onClose}>
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 ">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Loading country details...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">
                Failed to load country details. Please try again.
              </p>
            </div>
          ) : country ? (
            <>
              <div className="relative h-64 w-full overflow-hidden rounded-lg">
                <Image
                  src={country.flag}
                  alt={`${country.name} flag`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Capital
                  </p>
                  <p className="text-lg">{country.capital}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Region
                  </p>
                  <p className="text-lg">{country.region}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Population
                  </p>
                  <p className="text-lg">
                    {country.population.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Languages
                  </p>
                  <p className="text-lg">
                    {country.languages.length > 0
                      ? country.languages.join(", ")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </>
          ) : null}
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
