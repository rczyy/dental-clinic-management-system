import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const URL = "https://psgc.gitlab.io/api/";

export const addressApi = createApi({
  reducerPath: "addressApi",
  baseQuery: fetchBaseQuery({ baseUrl: URL }),
  endpoints: (builder) => ({
    getRegions: builder.query<Region[], void>({
      query: () => ({
        url: `regions`,
        method: "GET",
      }),
    }),
    getProvinces: builder.query<Province[], string>({
      queryFn: async (regionCode, _, __, baseQuery) => {
        const provincesResult = await baseQuery(
          `regions/${regionCode}/provinces`
        );
        const districtsResult = await baseQuery(
          `regions/${regionCode}/districts`
        );

        const provinces = provincesResult.data as Province[];
        const districts = districtsResult.data as Province[];

        return {
          data: provinces.concat(districts),
        };
      },
    }),
    getCities: builder.query<City[], string>({
      queryFn: async (provinceCode, _, __, baseQuery) => {
        const citiesFromProvincesResult = await baseQuery(
          `provinces/${provinceCode}/cities-municipalities`
        );
        const citiesFromDistrictsResult = await baseQuery(
          `districts/${provinceCode}/cities-municipalities`
        );

        const citiesFromProvinces = citiesFromProvincesResult.data as City[];
        const citiesFromDistricts = citiesFromDistrictsResult.data as City[];

        return {
          data: citiesFromProvincesResult.error
            ? citiesFromDistricts
            : citiesFromDistrictsResult.error
            ? citiesFromProvinces
            : citiesFromProvinces.concat(citiesFromDistricts),
        };
      },
    }),
    getBarangays: builder.query<Barangay[], string>({
      query: (cityCode) => ({
        url: `https://psgc.gitlab.io/api/cities-municipalities/${cityCode}/barangays`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetRegionsQuery,
  useLazyGetProvincesQuery,
  useLazyGetCitiesQuery,
  useLazyGetBarangaysQuery,
} = addressApi;
