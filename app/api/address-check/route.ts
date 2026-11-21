export async function POST(request: Request) {
  const { address } = await request.json();

  const params = new URLSearchParams({
    address,
    benchmark: "4",
    format: "json",
  });

  const response = await fetch(
    `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?${params}`,
  );

  const data = await response.json();

  return Response.json(data, { status: response.status });
}
