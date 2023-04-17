import { ServiceCategory } from "../components/Services/ServiceCategory";
import { useGetServices } from "../hooks/service";

type Props = {};
const Services = (_: Props) => {
  const { data: services } = useGetServices();

  const serviceCategories: ServiceCategory[] = [
    "First Appointment",
    "Restoration",
    "Cosmetic",
    "Root Canal Treatment",
    "Crowns and Bridges",
    "Oral Surgery or Extractions",
    "Dentures",
    "Orthodontics (Braces)",
  ];

  return (
    <main className="flex flex-col gap-4 py-24 max-w-screen-xl mx-auto">
      <header className="py-4 rounded-lg bg-base-300">
        <h1 className="text-2xl text-center font-extrabold">Our Services</h1>
      </header>
      <section className="flex flex-col gap-10 p-4 pb-8 rounded-lg bg-base-300">
        {services && services.length > 0 ? (
          serviceCategories.map(
            (category, i) =>
              services.filter((service) => service.category === category)
                .length > 0 && <ServiceCategory key={i} category={category} />
          )
        ) : (
          <h1>No Services</h1>
        )}
      </section>
    </main>
  );
};
export default Services;
