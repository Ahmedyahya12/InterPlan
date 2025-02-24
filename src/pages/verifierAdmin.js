import { auth, db } from "../config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const verifierAdmins= () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("Utilisateur non connecté !");
        const data = { role: "non connecté", user: null };
        localStorage.setItem("utilisateur", JSON.stringify(data)); // Sauvegarde dans le localStorage
        resolve(data);
        return;
      }

      console.log("Vérification de l'utilisateur avec UID :", user.uid);

      try {
        let userData = null;
        let role = "inconnu";

        // Vérifier si l'utilisateur est un client
        const interQuery = query(collection(db, "intervenents"), where("Id", "==", user.uid));
        const InterSnap = await getDocs(interQuery);

        if (!InterSnap.empty) {
          userData = InterSnap.docs[0].data();
          role = "admin";
          console.log("Utilisateur est un admin :", userData);
        } 

        // Enregistrer le rôle et l'utilisateur dans localStorage
        const data = { role, user: userData };
        localStorage.setItem("utilisateur", JSON.stringify(data));

        resolve(data);
      } catch (error) {
        console.error("Erreur lors de la vérification :", error);
        const errorData = { role: "erreur", user: null };
        localStorage.setItem("utilisateur", JSON.stringify(errorData)); // Enregistrer l'erreur
        resolve(errorData);
      }
    });
  });
};
