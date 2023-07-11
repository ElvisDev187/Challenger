import * as nodemailer from "nodemailer";

const email = process.env.EMAIL_SERVER_USER;
const pass = process.env.EMAIL_SERVER_PASSWORD;
const host = process.env.EMAIL_SERVER_HOST;


export const transporter = nodemailer.createTransport({
  host: host,
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: email,
    pass: pass,
  },
});

export const generateEmailContent = ( role: string, name: string, Tname: string) => {
 
  return {
    text: role,
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Challenger</a>
      </div>
      <p style="font-size:1.1em">Hi,${name}</p>
      <p>Vous avez ete ajouter au tournoi (${Tname}) en tant que </p>
      <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${role}</h2>
      <p style="font-size:0.9em;">Cordialement,<br />Challenger</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Challenger Inc</p>
        <p>1600 Amphitheatre Parkway</p>
        <p>California</p>
      </div>
    </div>
  </div>`,
  };
};

