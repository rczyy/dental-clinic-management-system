import Mailjet, { SendEmailV3_1, LibraryResponse } from "node-mailjet";

const mailjet = new Mailjet({
  apiKey: process.env.MJ_API_KEY,
  apiSecret: process.env.MJ_SECRET_KEY,
});

export const sendEmail = async (emailBody: SendEmailV3_1.Body) => {
  const emailResult: LibraryResponse<SendEmailV3_1.Response> = await mailjet
    .post("send", { version: "v3.1" })
    .request(emailBody);

  return emailResult;
};
