type Props = {
    title: string;
    value: string;
};
const Stat = ({title, value}: Props) => {
  return (
    <div className="stat place-items-center md:place-items-end bg-primary rounded">
      <div className="stat-title">{title}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
};
export default Stat;
