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

// Fonction principale pour afficher les clients
export const afficherEmpls = async (table) => {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("Aucun utilisateur connecté !");
      return;
    }

    console.log("Utilisateur connecté :", user.uid);

    const clientsCollection = collection(db, "intervenents");

    // Filtrer les clients par utilisateur connecté
    const queryClients = query(
      clientsCollection,
      orderBy("name", "desc")  // On trie ici par nom, mais tu peux ajuster à ce que tu veux.
    );

    // Écoute les changements en temps réel
    onSnapshot(queryClients, (snapshot) => {
      table.innerHTML = "";

      if (snapshot.empty) {
        table.innerHTML = `  
          <tr>
            <td colspan="5" class="text-center text-muted">
              Aucun Intervenent  ajouté pour le moment.
            </td>
          </tr>`;
        return;
      }

      const clients = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const isAdminPage = window.location.pathname.includes("admin.html");

      clients.forEach((Empl) => {
        const modalId = `ModelSup-${Empl.id}`;

        table.innerHTML += `
          <tr>
            <td>${Empl.name}</td>
            <td>${Empl.prenom}</td>
            <td>${Empl.email}</td>
            <td>${Empl.post}</td>
            ${
              isAdminPage
                ? `
                  <td>
                    <a href="Adm_Intrven_detail.html?id=${Empl.id}" class="btn btn-info">
                      <i class="fa fa-eye"></i>
                    </a>
                    <button class="btn btn-danger btn-delete" data-id="${Empl.id}" data-bs-toggle="modal" data-bs-target="#${modalId}">
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                `
                : ""
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
                  Êtes-vous sûr de vouloir supprimer ce intervenent ?
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
                  <button type="button" class="btn btn-danger confirm-delete" data-id="${Empl.id}" data-bs-dismiss="modal">
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
          const clientId = event.target.getAttribute("data-id");
          supprimerClient(clientId);
        });
      });
    });
  });
};

// Fonction pour supprimer un client
async function supprimerClient(id) {
  if (!id) return;
  try {
    await deleteDoc(doc(db, "intervenents", id));
    alert("Intervent  supprimé avec succès !");
  } catch (error) {
    console.error("Erreur lors de la suppression :", error);
  }
}
