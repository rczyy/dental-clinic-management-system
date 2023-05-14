import { Schema, model } from "mongoose";

const appointmentSchema = new Schema<Appointment>({
    dentistId: {
        type: Schema.Types.ObjectId,
        ref: "Dentist"
    },
    patientId: {
        type: Schema.Types.ObjectId,
        ref: "Patient"
    },
    serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service"
    },
    dateTimeScheduled: Date,
    dateTimeFinished: Date,
})

export default model<Appointment>("Appointment", appointmentSchema)