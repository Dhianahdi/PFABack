const jwt = require("jsonwebtoken");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const cron = require("node-cron");

exports.sendVerificationEmail = async (req, res) => {
  try {
    const { nom, prenom, email, token } = req;

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
      subject: "Validation de l'adresse e-mail",
      html: `
      <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              .button {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 5px;
              }
              .footer {
                margin-top: 20px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>Bienvenue chez Nous !</h2>
              </div>
              <p>Bonjour ${prenom} ${nom},</p>
              <p>Merci de vous être inscrit. Veuillez cliquer sur le bouton ci-dessous pour valider votre adresse e-mail :</p>
              <div style="text-align: center;">
                <a href="http://localhost:4200/email-verified" class="button">Valider votre e-mail</a>
              </div>
              <p>Le lien de validation est valide pour trois jours. Si le lien expire, veuillez créer un nouveau compte et valider votre e-mail avec le nouveau lien qui vous sera envoyé par e-mail.</p>
              <div class="footer">
                <p>Cordialement,<br>L'Équipe Technique</p>
              </div>
            </div>
          </body>
          </html>`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email envoyé");
  } catch (error) {
    console.log(error);
  }
};

exports.verifyAllUnverifiedUsers = async (req, res) => {
  try {
    const result = await User.updateMany(
      { isVerified: false },
      { $set: { isVerified: true } }
    );
    res
      .status(200)
      .json({
        message:
          "Tous les utilisateurs non vérifiés ont été vérifiés avec succès",
        result,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


exports.validateEmail = async (req, res) => {
  try {
    const { email, token } = req.params;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "L'utilisateur est déjà vérifié" });
    }

    jwt.verify(token, "EMAIL TOKEN", async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: "Le jeton est invalide ou expiré" });
      }

      if (token !== user.token) {
        return res.status(400).json({ message: "Le jeton n'est pas valide pour cet utilisateur" });
      }

      user.isVerified = true;
      user.token = null;
      await user.save();

      res.status(200).json({ message: "L'e-mail a été vérifié avec succès" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

exports.validateEmail = async (req, res) => {
  try {
    const { email, token } = req.params;

    const user = await User.findOne({ email });
    console.log('user: ', user);


    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    if (user.isVerified) {
      return res
        .status(400)
        .json({ message: "L'utilisateur est déjà vérifié" });
    }

    jwt.verify(token, "EMAIL TOKEN", async (err, decoded) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Le jeton est invalide ou expiré" });
      }

      if (token !== user.token) {
        return res
          .status(400)
          .json({ message: "Le jeton n'est pas valide pour cet utilisateur" });
      }

      const updatedUser = await User.findOneAndUpdate(
        { email: email },
        { $set: { isVerified: true, token: null } },
        { new: true }
      );

      res.status(200).json({ message: "L'e-mail a été vérifié avec succès" });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUnverifiedUsers = async () => {
  try {

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const usersToDelete = await User.find({
      isVerified: false,
      createdAt: { $lt: threeDaysAgo },
    });

    for (const user of usersToDelete) {
      await User.findByIdAndDelete(user._id);
    }

    console.log("Utilisateurs non vérifiés supprimés avec succès.");
  } catch (error) {
    console.error(
      "Erreur lors de la suppression des utilisateurs non vérifiés :",
      error
    );
  }
};

cron.schedule("0 0 * * *", deleteUnverifiedUsers);

