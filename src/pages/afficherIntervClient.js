import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
  deleteDoc,
  doc
} from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Fonction principale pour afficher les interventions
export const afficherIntrCl = async (table) => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("Aucun utilisateur connecté !");
      return;
    }

    console.log("Utilisateur connecté :", user.uid);

    const interventionCollection = collection(db, "intervention");

    // Filtrer les interventions par utilisateur connecté
    const queryIntervention = query(
      interventionCollection,
      where("client.Id", "==", user.uid),
      orderBy("date", "desc")
    );

    // Écoute les changements en temps réel
    onSnapshot(queryIntervention, (snapshot) => {
      table.innerHTML = "";

      if (snapshot.empty) {
        table.innerHTML = `  
          <tr>
            <td colspan="5" class="text-center text-muted">
              Aucune intervention ajoutée pour le moment.
            </td>
          </tr>`;
        return;
      }

      const interventions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const isAdminPage = window.location.pathname.includes("admin.html");

      interventions.forEach((intr) => {
        const modalId = `ModelSup-${intr.id}`;

        table.innerHTML += `
          <tr class="${getEtatClass(intr.etat)}">
            <td>
              ${
                intr.date && typeof intr.date.toDate === "function"
                  ? intr.date.toDate().toLocaleString()
                  : "Non disponible"
              }
            </td>
            <td>${intr.type}</td>
            <td>${intr.Motive}</td>
            <td>
              <span class="badge ${getBadgeClass(intr.etat)}">${intr.etat}</span>
            </td>
            ${
              isAdminPage
                ? `
                  <td>
                    <a href="Adm_Intr_detail.html?id=${intr.id}" class="btn btn-info">
                      <i class="fa fa-eye"></i>
                    </a>
                    <button class="btn btn-danger btn-delete" data-id="${intr.id}" data-bs-toggle="modal" data-bs-target="#${modalId}">
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                `
                : 
                `
                 <td>
                   
                    <button class="btn btn-danger btn-delete" data-id="${intr.id}" data-bs-toggle="modal" data-bs-target="#${modalId}">
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                `
                
            }
          </tr>

          <!-- Modal de confirmation -->
          <div class="modal fade" id="${modalId}" tabindex="-1" aria-labelledby="${modalId}" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title">Confirmation de suppression</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  Êtes-vous sûr de vouloir supprimer cette intervention ?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                  <button type="button" class="btn btn-danger confirm-delete" data-id="${intr.id}" data-bs-dismiss="modal">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      });
         
      // Ajouter les événements aux boutons de suppression
      document.querySelectorAll(".confirm-delete").forEach((button) => {
        button.addEventListener("click", (event) => {
          const interventionId = event.target.getAttribute("data-id");
          supprimerIntervention(interventionId);
        });
      });
    });
  });
};

// Fonction pour supprimer une intervention
async function supprimerIntervention(id) {
  if (!id) return;
  try {
    await deleteDoc(doc(db, "intervention", id));
    alert("Intervention supprimée avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}

// Fonction pour obtenir la classe CSS de l'état
function getBadgeClass(etat) {
  switch (etat) {
    case "En cours":
      return "badge-info";
    case "Terminé":
      return "badge-success";
    case "Annulé":
      return "badge-danger";
    case "En attente":
      return "badge-warning";
    case "Non pris en charge":
      return "badge-secondary";
    case "Non approuvée":
      return "badge-dark";
    default:
      return "";
  }
}

// Fonction pour obtenir la classe CSS du TR
function getEtatClass(etat) {
  switch (etat) {
    case "Terminé":
      return "Terminer";
    case "En cours":
      return "EnCours";
    case "Annulé":
      return "Annule";
    case "En attente":
      return "EnAttente";
    case "Non pris en charge":
      return "NonPris";
    case "Non approuvée":
      return "NonApprouve";
    default:
      return "";
  }
}
