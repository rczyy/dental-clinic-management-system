import React from "react";
type Props = {};

const Landing = (props: Props) => {
  return (
    <div className="hero font-work h-screen my-auto">
      <div className="hero-content flex-col lg:flex-col">
        <div>
          <h1 className="font-light text-4xl text-center">AT Dental Home's</h1>
          <h1 className="font-bold text-primary text-3xl text-center">
            Online Appointment System
          </h1>
        </div>
        <div>
          <button className="btn btn-primary text-base-100">
            Book an appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
