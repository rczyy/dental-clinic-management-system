import axios from "axios";

export const getRegions = async (): Promise<Region[]> => {
  const regions: { data: Region[] } = await axios.get(
    "https://psgc.gitlab.io/api/regions"
  );

  return regions.data;
};

export const getProvinces = async (regionCode: string): Promise<Province[]> => {
  const provinces: { data: Province[] } = await axios.get(
    `https://psgc.gitlab.io/api/regions/${regionCode}/provinces`
  );

  const districts: { data: City[] } = await axios.get(
    `https://psgc.gitlab.io/api/regions/${regionCode}/districts`
  );

  return provinces.data.concat(districts.data);
};

export const getCities = async (provinceCode: string): Promise<City[]> => {
  const citiesFromProvinces: { data: City[] } = await axios
    .get(
      `https://psgc.gitlab.io/api/provinces/${provinceCode}/cities-municipalities`
    )
    .catch((err) => ({ data: [] }));

  const citiesFromDistricts: { data: City[] } = await axios
    .get(
      `https://psgc.gitlab.io/api/districts/${provinceCode}/cities-municipalities`
    )
    .catch((err) => ({ data: [] }));

  return citiesFromProvinces.data.concat(citiesFromDistricts.data);
};

export const getBarangays = async (cityCode: string): Promise<Barangay[]> => {
  const barangays: { data: Barangay[] } = await axios.get(
    `https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays`
  );

  return barangays.data;
};
