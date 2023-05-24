import { Schema, model } from "mongoose";

const appointmentSchema = new Schema<Appointment>({
    dentist: {
        type: Schema.Types.ObjectId,
        ref: "Dentist"
    },
    patient: {
        type: Schema.Types.ObjectId,
        ref: "Patient"
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: "Service"
    },
    dateTimeScheduled: Date,
    dateTimeFinished: Date,
})

export default model<Appointment>("Appointment", appointmentSchema)