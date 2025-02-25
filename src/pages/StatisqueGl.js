import { collection, query, onSnapshot } from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

export const getInterventionsStatsGl = () => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("Utilisateur non connecté !");
      return;
    }

    const interventionsRef = collection(db, "intervention");
    const clientInterventionsQuery = query(interventionsRef);

    onSnapshot(clientInterventionsQuery, (querySnapshot) => {
      let statsParClient = {};

      if (querySnapshot.empty) {
        console.log("Aucune intervention trouvée.");
      } else {
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          if (data.client && data.client.Id) {
            const clientId = data.client.Id;
            const clientName = data.client.name || "Inconnu";

            if (!statsParClient[clientId]) {
              statsParClient[clientId] = {
                name: clientName,
                termineCount: 0,
                enAttenteCount: 0,
                annuleCount: 0,
                nonPrisEnChargeCount: 0,
              };
            }

            switch (data.etat) {
              case "Terminé":
                statsParClient[clientId].termineCount++;
                break;
              case "En attente":
                statsParClient[clientId].enAttenteCount++;
                break;
              case "Annulé":
                statsParClient[clientId].annuleCount++;
                break;
              case "Non pris en charge":
                statsParClient[clientId].nonPrisEnChargeCount++;
                break;
              default:
                console.warn(`État inconnu : ${data.etat}`);
            }
          } else {
            console.error("Le champ client.Id est manquant dans le document : ", doc.id);
          }
        });
      }

      localStorage.setItem("statsIntrParClient", JSON.stringify(statsParClient));
      console.log("Mise à jour des statistiques par client :", statsParClient);

      afficherTableauStats();
    });
  });
};

const afficherTableauStats = () => {
  const statsParClient = JSON.parse(localStorage.getItem("statsIntrParClient")) || {};
  const tableBody = document.querySelector("#tab-stats");

  if (!tableBody) {
    console.error("Élément avec l'ID 'tab-stats' non trouvé.");
    return;
  }

  tableBody.innerHTML = ""; // Réinitialiser le contenu du tableau

  for (const clientId in statsParClient) {
    if (statsParClient.hasOwnProperty(clientId)) {
      const clientData = statsParClient[clientId];
      const row = document.createElement("tr");

      row.innerHTML = `
        <td style="font-weight: 800;">${clientData.name}</td>
        <td><span class="badge bg-success text-white ">${clientData.termineCount}</span></td>
        <td><span class="badge bg-warning  text-white ">${clientData.enAttenteCount}</span></td>
        <td><span class="badge bg-danger text-white ">${clientData.annuleCount}</span></td>
        <td><span class="badge bg-secondary text-white ">${clientData.nonPrisEnChargeCount}</span></td>
      `;

      tableBody.appendChild(row);
    }
  }
};
