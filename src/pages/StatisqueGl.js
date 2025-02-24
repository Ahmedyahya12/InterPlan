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
      let statsGlobales = {
        termineCount: 0,
        enAttenteCount: 0,
        annuleCount: 0,
        nonPrisEnChargeCount: 0,
      };

      let statsParClient = {};

      if (querySnapshot.empty) {
        console.log("Aucune intervention trouvée pour ce client.");
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

            if (data.etat === "Terminé") {
              statsGlobales.termineCount++;
              statsParClient[clientId].termineCount++;
            } else if (data.etat === "En attente") {
              statsGlobales.enAttenteCount++;
              statsParClient[clientId].enAttenteCount++;
            } else if (data.etat === "Annulé") {
              statsGlobales.annuleCount++;
              statsParClient[clientId].annuleCount++;
            } else if (data.etat === "Non pris en charge") {
              statsGlobales.nonPrisEnChargeCount++;
              statsParClient[clientId].nonPrisEnChargeCount++;
            }
          } else {
            console.error("Le champ client.Id est manquant dans le document : ", doc.id);
          }
        });
      }

      localStorage.setItem("statsIntrParGl", JSON.stringify(statsGlobales));
      localStorage.setItem("statsIntrParClient", JSON.stringify(statsParClient));

      console.log("Mise à jour stats globales :", statsGlobales);
      console.log("Mise à jour stats par client :", statsParClient);
    });

    const tab=document.querySelector(".tab-satats")
    const statsParClient = JSON.parse(localStorage.getItem("statsIntrParClient")) || {};
    for (const clientId in statsParClient) {
      if (statsParClient.hasOwnProperty(clientId)) {
        const clientData = statsParClient[clientId];
     
        if(tab){
          tab.innerHTML+=
          `
           <tr>
              <td style="font-weight: 800;">${clientData.name}</td>
              <td><span class="badge badge-success">${clientData.termineCount}</span></td>
              <td><span class="badge badge-warning">${clientData.enAttenteCount}</span></td>
              <td><span class="badge badge-danger">${clientData.annuleCount}</span></td>
              <td><span class="badge badge-secondary">${clientData.nonPrisEnChargeCount}</span></td>
            </tr>
          `

        }
       
        
      }
    }
    
  });
};
