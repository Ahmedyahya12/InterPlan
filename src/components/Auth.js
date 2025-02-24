import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "@firebase/auth";
import { auth } from "../config/firebaseConfig";
import { showAlertWithProgress } from "./showAlertWithProgress";
import { AddClient } from "../pages/AjouterClient";
import { AddUser } from "../pages/AddUser";

// sendSignInLinkToEmail

const sendSignInLink = async (email) => {
  const actionCodeSettings = {
    url: "http://localhost:5500/dist/register.html",
    // This must be true.
    handleCodeInApp: true,
  };

  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      console.log(" email envoyer avec succes a ", email);

      window.location.href = "confirmation.html";
      const EmailConf = document.querySelector("#EmailConfirmation");
      if (EmailConf) EmailConf.innerHTML = email;
    })
    .catch((error) => {
      console.log(error);
    });
};

// inscrition utilsateur

const createUser = (First_Name, Last_Name, email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((UserCre) => {
      const user = UserCre.user;

      return updateProfile(user, {
        displayName: `${First_Name} ${Last_Name}`, // Corrigé la syntaxe
      }).then(() => {
        showAlertWithProgress(
          "🎉 Inscription réussie !",
          "alert-success",
          "bg-success"
        );

        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      });

      //  console.log("L'utilsateur est cree avec succes",user)
    })
    .catch((e) => {
      showAlertWithProgress(`❌ ${e.message} `, "alert-danger", "bg-danger");
    });
};

//connecter l'utilsateur

const LoginUser = (email, password) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((UserCre) => {
      console.log("utilisateur est connecter", UserCre.user.displayName);
      window.location.href = "index.html";
    })
    .catch((e) => {
      console.log(e);
    });
};

const protectedRoutes = ["index.html", "profile.html"];
const publicRoutes = ["login.html", "sendEmail.html"];

const enforceAuthRules = () => {
  onAuthStateChanged(auth, (user) => {
    const currentPage = window.location.pathname.split("/").pop();

    if (user) {
      // Si l'utilisateur est connecté mais essaie d'accéder à une page publique
      if (publicRoutes.includes(currentPage)) {
        window.location.href = "index.html"; // Redirection vers la page principale
      }
    } else {
      // Si l'utilisateur n'est pas connecté mais essaie d'accéder à une page protégée
      if (protectedRoutes.includes(currentPage)) {
        window.location.href = "login.html"; // Redirection vers la page de connexion
      }
    }
  });
};

const OnChangeState = (FullName) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      

      const utilisateurs=
       JSON.parse(localStorage.getItem("utilisateur"))
      const displayName = utilisateurs.user.name + " " + utilisateurs.user.prenom
      console.log("displayName",displayName)
      FullName.innerHTML=" "
      FullName.innerHTML = displayName;
      
    
      
    }
  });
  
};

const OnChangeStateProfile = (displayname, email) => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const First_Name = user.displayName;
      const Last_Name = user.Last_Name;
      const Email = user.email;

      displayname.value = First_Name;

      email.value = Email;
    }
  });
};

const LogoutUser = () => {
  signOut(auth).then(() => {
    showAlertWithProgress(
      "🎉 l'utilisateur est deconnecter avec succes!",
      "alert-success",
      "bg-success"
    );
  });
};

const OnChangeClient = (First_Name='sidi', Last_Name='Ali') => {
  // Vérifiez si l'utilisateur est déjà authentifié avant d'écouter l'événement
  const user = auth.currentUser;

  // Si l'utilisateur est déjà authentifié, appeler AddClient directement
  if (user) {
    AddClient(user.uid, First_Name, Last_Name,user.email);
    AddUser(user.uid, First_Name, Last_Name,user.email);
    
  } else {
    // Si l'utilisateur n'est pas authentifié, attendez le changement d'état
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Si l'utilisateur se connecte, appelez AddClient
        AddClient(user.uid, First_Name, Last_Name,user.email);
        AddUser(user.uid, First_Name, Last_Name,user.email);
       
      } else {
        console.log("L'utilisateur n'est pas authentifié.");
      }
    });
  }
};



export {
  sendSignInLink,
  createUser,
  LoginUser,
  OnChangeState,
  OnChangeStateProfile,
  LogoutUser,
  enforceAuthRules,
  OnChangeClient,
};
