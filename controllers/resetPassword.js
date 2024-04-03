const nodemailer = require("nodemailer");
const User = require("../models/user");
const bcrypt = require("bcrypt");

const generateRandomCode = () => {
  return Math.floor(1000 + Math.random() * 9000);
};

const sendPasswordResetEmail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tinkernina00@gmail.com",
        pass: "swgl qnph hgky imho",
      },
    });

    const mailOptions = {
      from: "tinkernina00@gmail.com",
      to: email,
      subject: "Réinitialisation de mot de passe",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; border-radius: 10px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="color: #007bff;">Réinitialisation de mot de passe</h2>
  </div>
  <div style="background-color: #fff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
    <p>Bonjour,</p>
    <p>Vous avez demandé à réinitialiser votre mot de passe. Utilisez le code suivant et le lien ci-dessous pour procéder à la réinitialisation :</p>
    <h3 style="text-align: center; padding: 10px; color: black; border-radius: 5px;">${code}</h3>
    <p>Pour réinitialiser votre mot de passe :</p>
    <ol>
      <li>Visitez le lien ci-dessous.</li>
      <li>Saisissez le code de réinitialisation fourni ci-dessus.</li>
      <li>Saisissez votre nouveau mot de passe.</li>
    </ol>
    <div style="text-align: center; margin-top: 20px;">
      <a href="http://localhost:4200/reset-password" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Réinitialiser mon mot de passe</a>
    </div>
    <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, veuillez ignorer cet e-mail.</p>
  </div>
  <div style="text-align: center; margin-top: 20px;">
    <p style="font-size: 0.8em;">Cet e-mail a été envoyé automatiquement. Merci de ne pas y répondre.</p>
  </div>
</div>
  `,
    };

    await transporter.sendMail(mailOptions);
    console.log("E-mail de réinitialisation de mot de passe envoyé.");
  } catch (error) {
    console.error(
      "Erreur lors de l'envoi de l'e-mail de réinitialisation de mot de passe :",
      error
    );
  }
};

exports.requestPasswordReset = async (req, res) => {
  try {
        console.log("req.body: ", req.params.email);
    const  email  = req.params.email;

    console.log('email: ', email);

    const user = await User.findOne({ email });
    console.log("user: ", user);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Aucun utilisateur trouvé avec cet e-mail." });
    }

    let code = generateRandomCode();

    let isCodeUsed = await User.findOne({ newPasswordCode: code });
    while (isCodeUsed) {
      code = generateRandomCode();
      isCodeUsed = await User.findOne({ newPasswordCode: code });
    }
    await User.findOneAndUpdate(
      { email: email },
      { $set: { newPasswordCode: code } },
      { new: true }
    );

    await sendPasswordResetEmail(email, code);

    res.status(200).json({
      message: "Un e-mail de réinitialisation de mot de passe a été envoyé.",
    });
  } catch (error) {
    console.error(
      "Erreur lors de la demande de réinitialisation de mot de passe :",
      error
    );
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email, newPasswordCode: code });
    if (!user) {
      return res.status(404).json({
        message: "Aucun utilisateur trouvé avec cet e-mail et ce code.",
      });
    }

    const hash = await bcrypt.hash(newPassword, 10);

    await User.findOneAndUpdate(
      { email: email },
      { $set: { password: hash, newPasswordCode: null } },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Le mot de passe a été réinitialisé avec succès." });
  } catch (error) {
    console.error(
      "Erreur lors de la réinitialisation du mot de passe :",
      error
    );
    res.status(500).json({ error: error.message });
  }
};
