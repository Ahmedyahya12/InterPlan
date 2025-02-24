import { onAuthStateChanged } from "firebase/auth";
import {
  createUser,
  enforceAuthRules,
  LoginUser,
  LogoutUser,
  OnChangeClient,
  onChangePge,
  OnChangeState,
  OnChangeStateProfile,
  sendSignInLink,
} from "./components/Auth";
import { FormValide } from "./components/FormIntrVald";
import { showAlertWithProgress } from "./components/showAlertWithProgress";
import { showProgress } from "./config/AlertProg";
import { auth } from "./config/firebaseConfig";
import { afficherIntr } from "./pages/afficherInterv";
import { AddClient } from "./pages/AjouterClient";
import { AddIntervention } from "./pages/AjouterInter";
import { verifierUtilisateur } from "./pages/verifierUtilisateur";
import { getInterventionsStats } from "./pages/Statisque";
import { cacherPage } from "./pages/cacherMenuAdmin";
import { afficherDetIntr } from "./pages/afficherDetIntr";
import { afficherDetIntrUpd, updateFields } from "./pages/ModifieIntr";
import { afficherClients } from "./pages/afficheClients";
import {
  afficherDetClientUpd,
  updateClientFields,
} from "./pages/ModifieClient";
import { AddEmploye } from "./pages/AjouterEmpl";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "./config/firebaseConfig";
import { afficherEmpls } from "./pages/afficheEmpl";
import { afficherDetEmpUpd } from "./pages/ModifieIntervent";
import { verifierAdmins } from "./pages/verifierAdmin";
import { afficherIntrCl } from "./pages/afficherIntervClient";
import { getInterventionsStatsGl } from "./pages/StatisqueGl";
import { exportTableToCSV, exportTableToExcel } from "./pages/ExportStat";

document.addEventListener("DOMContentLoaded", () => {
  //Send Email To user

  const FormSendEmail = document.querySelector(".FormSendEmail");

  if (FormSendEmail) {
    FormSendEmail.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = FormSendEmail.email.value;

      sendSignInLink(email);
    });
  }

  //inscrit un utilsateur
  const RegistrationForm = document.querySelector(".RegistrForm");

  if (RegistrationForm) {
    RegistrationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const Fist_Name = RegistrationForm.firstName.value;
      const Last_Name = RegistrationForm.lastName.value;
      const email = RegistrationForm.email.value;
      const password = RegistrationForm.password.value;

      const user = {
        First_Name: Fist_Name,
        Last_Name: Last_Name,
      };

      localStorage.setItem("User", JSON.stringify(user));

      createUser(Fist_Name, Last_Name, email, password);
    });
  }

  //Connecter un utilisateur

  const loginForm = document.querySelector(".loginuser");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      LoginUser(email, password);
    });
  }

  const fullNameElement = document.querySelector("#NomComplet");

  if (fullNameElement) {
    const FullName = OnChangeState(fullNameElement);
    console.log("FullName", FullName);
  }

  const utilisateurs = JSON.parse(localStorage.getItem("utilisateur"));
  const FormProfile = document.querySelector(".Formprofile");
  if (FormProfile) {
    const emailInput = FormProfile.querySelector("input[name='email']");
    const First_Name = FormProfile.querySelector("input[name='first_name']");

    emailInput.value = utilisateurs.user.email;
    First_Name.value = utilisateurs.user.name + utilisateurs.user.prenom;
    console.log(utilisateurs.user);
  }

  const BtnLogout = document.querySelector("#logout-user");

  if (BtnLogout) {
    BtnLogout.addEventListener("click", (e) => {
      e.preventDefault();
      LogoutUser();
      window.location.href = "login.html";
    });
  }

  enforceAuthRules();

  const user = JSON.parse(localStorage.getItem("User"));

  OnChangeClient(user.First_Name, user.Last_Name);

  const FormAddIntr = document.querySelector(".AddInter");

  if (FormAddIntr) {
    FormAddIntr.addEventListener("submit",  (e) => {
      e.preventDefault();
      const motif = FormAddIntr.motif.value;
      const type = FormAddIntr.type.value;

      const btnCls = document.querySelector(".ColsBtn");

      AddIntervention(type, motif); // Attendre que l'ajout soit terminé
      calStats(); // Mettre à jour les stats immédiatement après l'ajout

      btnCls?.click();
    });
  }

  const FormAddIntrAdmin = document.querySelector(".AddInterAdmin");

  console.log(FormAddIntrAdmin);
  if (FormAddIntrAdmin) {
    FormAddIntrAdmin.addEventListener("submit", (e) => {
      e.preventDefault();
      const motif = FormAddIntrAdmin.motif.value;
      const type = FormAddIntrAdmin.type.value;

      const btnCls = document.querySelector(".ColsBtn");

      AddIntervention(type, motif);

      btnCls?.click();
    });
  }

  //Update intervention

  const urlParams = new URLSearchParams(window.location.search);
  const paramId = urlParams.get("id"); // Récupère l'ID de l'intervention à partir de l'URL
  console.log("Intr id id", paramId); // Affiche l'ID de l'intervention

  // ID du document à modifier

  const DetaiContainerCl = document.querySelector("#DetaiContainer");
  const DetaiContainerEmp = document.querySelector("#DetaiContEmpl");

  if (DetaiContainerCl) {
    afficherDetClientUpd(DetaiContainerCl, paramId);
  }
  if (DetaiContainerEmp) {
    afficherDetEmpUpd(DetaiContainerEmp, paramId);
  }

  //   const updatedFields = {
  //     etat: FormUpdInt.etat.value, // Nouvel état de l'intervention
  //     date: serverTimestamp(),
  //     type: FormUpdInt.type.value,
  //     Motive: FormUpdInt.motif.value,
  //   };

  //   updateIntervention(paramId, updatedFields);
  // });

  const tableTasks = document.querySelector("#table-tasks");
  const tableClients = document.querySelector("#table-clients");
  const tableIntervent = document.querySelector("#table-inter");

  if (tableTasks) {
    afficherIntr(tableTasks);
  }

  if (tableTasks) {
    afficherIntrCl(tableTasks);
  }

  if (tableClients) {
    afficherClients(tableClients);
  }
  if (tableIntervent) {
    afficherEmpls(tableIntervent);
  }

  const DetaiContainer = document.querySelector(".DetaiContainer");
  const CardClient = document.querySelector(".CardClient");

  if (DetaiContainer && CardClient) {
    // afficherDetIntr(DetaiContainer,paramId)
    afficherDetIntrUpd(DetaiContainer, paramId, CardClient);
  }

  const verifier = async () => {
    // Vérifie d'abord si l'utilisateur est un client ou intervenant
    let utilisateur = await verifierUtilisateur();

    // Stocker l'utilisateur dans localStorage
    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
    console.log("Utilisateur connecté :", utilisateur.role);

    // Vérifier si l'utilisateur est admin et mettre à jour si nécessaire
    if (utilisateur.role !== "non connecté") {
      const admin = await verifierAdmins();
      if (admin && admin.role === "admin") {
        localStorage.setItem("utilisateur", JSON.stringify(admin));
        console.log("Utilisateur mis à jour en admin :", admin);
      } // Vérifier si l'utilisateur est client, et revalider ses infos
      else if (utilisateur.role === "client") {
        utilisateur = await verifierUtilisateur(); // Rafraîchir les données
        localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
        console.log("Client mis à jour :", utilisateur);
      }
    }

    // Mettre à jour l'affichage utilisateur
    const RoleDiv = document.querySelector(".Role");
    const NomUser = document.querySelector(".NomUser");
    const IdUser = document.querySelector("#NomUser");

    const utilisateurs = JSON.parse(localStorage.getItem("utilisateur"));

    if (RoleDiv) RoleDiv.innerHTML = utilisateurs.role;

    if (NomUser)
      NomUser.innerHTML =
        utilisateurs.user?.name + "_" + utilisateurs.user?.prenom;

    if (IdUser)
      IdUser.innerHTML =
        utilisateurs.user?.name + " " + utilisateurs.user?.prenom;
  };

  // Exécuter la vérification au chargement
  verifier();

 
  getInterventionsStatsGl();
  
  getInterventionsStats();


  function calStats() {
    try {
      if (window.location.pathname.includes("index.html")) {
        const stats = JSON.parse(localStorage.getItem("statsIntrParClient"));
        if (!stats) return; // Évite une erreur si le localStorage est vide

        document.getElementById("stat-termine").textContent =
          stats.termineCount;
        document.getElementById("stat-en-attente").textContent =
          stats.enAttenteCount;
        document.getElementById("stat-annule").textContent = stats.annuleCount;
        document.getElementById("stat-non-pris").textContent =
          stats.nonPrisEnChargeCount;
      } 
      else if (window.location.pathname.includes("stats.html")) {
        const stats = JSON.parse(localStorage.getItem("statsIntrParGl"));
        if (!stats) return; // Évite une erreur si le localStorage est vide

        document.getElementById("stat-termine").textContent =
          stats.termineCount;
        document.getElementById("stat-en-attente").textContent =
          stats.enAttenteCount;
        document.getElementById("stat-annule").textContent = stats.annuleCount;
        document.getElementById("stat-non-pris").textContent =
          stats.nonPrisEnChargeCount;
      }
    } catch (e) {
      console.error("Erreur dans calStats:", e);
    }
  }

  calStats();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const FormAddEmpl = document.querySelector(".AddEmpl");

      if (FormAddEmpl) {
        FormAddEmpl.addEventListener("submit", async (e) => {
          e.preventDefault(); // Empêcher le rechargement de la page

          // Récupération des valeurs du formulaire
          const firstName = FormAddEmpl.nom.value.trim();
          const lastName = FormAddEmpl.prenom.value.trim();
          const poste = FormAddEmpl.poste.value.trim();
          const email = FormAddEmpl.email.value.trim(); // Email saisi dans le formulaire

          try {
            // Vérifier si l'email existe déjà dans la collection "utilisateurs"

            const usersRef = collection(db, "utilisateurs");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              // Email existe déjà -> Ajouter l'employé
              await AddEmploye(user.uid, firstName, lastName, email, poste);

              FormAddEmpl.reset();

              alert("Employé ajouté avec succès !");

              const btnCls = document.querySelector(".ColsBtn");
              btnCls?.click();

              // Réinitialiser le formulaire après soumission
              // FormAddEmpl.reset();
            } else {
              alert(
                "Impossible d'ajouter l'employé : l'email n'existe pas dans la base de données."
              );
            }
          } catch (error) {
            console.error("Erreur lors de la vérification de l'email :", error);
          }
        });
      }
    } else {
      console.log("L'utilisateur n'est pas authentifié.");
    }
  });

  cacherPage(JSON.parse(localStorage.getItem("utilisateur")).role);
  const btnExportCsv = document.getElementById("export-csv");
  const btnExportEx = document.getElementById("export-excel"); // Corrigé ici

  btnExportCsv?.addEventListener("click", function () {
    exportTableToCSV("statistiques_interventions.csv");
  });

  btnExportEx?.addEventListener("click", function () {
    exportTableToExcel("statistiques_interventions.xlsx");
  });
});
