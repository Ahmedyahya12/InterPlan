import { collection, query, where, onSnapshot } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export const getInterventionsStats = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("Utilisateur non connecté !");
      return;
    }

    // Collection des interventions
    const interventionsRef = collection(db, "intervention");

    // Requête pour obtenir les interventions du client connecté
    const clientInterventionsQuery = query(
      interventionsRef,
      where("client.Id", "==", user.uid) // Filtrer par l'ID du client
    );

    // Écouter les changements en temps réel
    onSnapshot(clientInterventionsQuery, (querySnapshot) => {
      // Initialiser les compteurs
      let termineCount = 0;
      let enAttenteCount = 0;
      let annuleCount = 0;
      let nonPrisEnChargeCount = 0;

      // Vérifier si des interventions sont trouvées
      if (querySnapshot.empty) {
        console.log("Aucune intervention trouvée pour ce client.");
      } else {
        // Parcourir les résultats
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          // Vérifier la présence du champ client.Id
          if (data.client && data.client.Id) {
            console.log("Données de l'intervention : ", data);

            // Compter les interventions par état
            if (data.etat === "Terminé") {
              termineCount++;
            } else if (data.etat === "En attente") {
              enAttenteCount++;
            } else if (data.etat === "Annulé") {
              annuleCount++;
            } else if (data.etat === "Non pris en charge") {
              nonPrisEnChargeCount++;
            }
          } else {
            console.error("Le champ client.Id est manquant dans le document : ", doc.id);
          }
        });
      }

      // Sauvegarder les résultats dans le localStorage
      localStorage.setItem(
        "statsIntrParClient",
        JSON.stringify({ termineCount, enAttenteCount, annuleCount, nonPrisEnChargeCount })
      );

      // Afficher dans la console pour vérification
      console.log("Mise à jour stats :", { termineCount, enAttenteCount, annuleCount, nonPrisEnChargeCount });
    });
  });
};
