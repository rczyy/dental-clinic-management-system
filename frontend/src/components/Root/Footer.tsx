import ATLogo from "../Utilities/ATLogo";
import { SiGooglemaps } from "react-icons/si";

type Props = {};

const Footer = (props: Props) => {
  return (
    <footer className="footer p-10 shadow-md border-neutral border-t text-base-content bg-base-100">
      <div className="max-w-sm">
        <ATLogo />
        <span>Aguilar Dental Home Clinic,</span>
        <div className="flex gap-2 items-center">
          <a href="https://goo.gl/maps/wAQY4cqM51gcRVUZ8" rel="noreferrer" target="_blank">
            <SiGooglemaps size={20}/>
          </a>
          <span>13 Azucena Street Andrea 1, Panapaan 6, Bacoor, Cavite.</span>
        </div>
      </div>
      <div>
        <span className="footer-title">Services</span>
        <a className="link link-hover">First Appointment</a>
        <a className="link link-hover">Restoration</a>
        <a className="link link-hover">Cosmetic</a>
      </div>
      <div>
        <span className="footer-title">Services</span>
        <a className="link link-hover">Root Canal Treatment</a>
        <a className="link link-hover">Crowns & Bridges</a>
        <a className="link link-hover">Oral Surgery/Extraction</a>
      </div>
      <div>
        <span className="footer-title">Services</span>
        <a className="link link-hover">Dentures</a>
        <a className="link link-hover">Orthodontics (Braces)</a>
      </div>
    </footer>
  );
};

export default Footer;
