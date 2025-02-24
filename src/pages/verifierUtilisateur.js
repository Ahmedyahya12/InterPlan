import { auth, db } from "../config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const verifierUtilisateur = () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        console.log("Utilisateur non connecté !");
        const data = { role: "non connecté", user: null };
        localStorage.setItem("userRole", JSON.stringify(data)); // Sauvegarde dans le localStorage
        resolve(data);
        return;
      }

      console.log("Vérification de l'utilisateur avec UID :", user.uid);

      try {
        let userData = null;
        let role = "inconnu";

        // Vérifier si l'utilisateur est un client
        const clientQuery = query(collection(db, "clients"), where("Id", "==", user.uid));
        const clientSnap = await getDocs(clientQuery);

        if (!clientSnap.empty) {
          userData = clientSnap.docs[0].data();
          role = "client";
          console.log("Utilisateur est un client :", userData);
        } 

        // Enregistrer le rôle et l'utilisateur dans localStorage
        const data = { role, user: userData };
        localStorage.setItem("userRole", JSON.stringify(data));

        resolve(data);
      } catch (error) {
        console.error("Erreur lors de la vérification :", error);
        const errorData = { role: "erreur", user: null };
        localStorage.setItem("userRole", JSON.stringify(errorData)); // Enregistrer l'erreur
        resolve(errorData);
      }
    });
  });
};
