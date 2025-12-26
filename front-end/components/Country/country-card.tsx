 "use client";

import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import type { CountriesResponse } from "@/interface/getAll.type";

interface CountryCardProps {
  country: CountriesResponse;
  onClick: () => void;
}

export function CountryCard({ country, onClick }: CountryCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={country.flag}
            alt={`${country.name} flag`}
            fill
            className="object-cover"
            unoptimized
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{country.name}</h3>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium">Region:</span> {country.region}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}


