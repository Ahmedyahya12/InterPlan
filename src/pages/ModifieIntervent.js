import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc
} from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Fonction pour mettre à jour les champs du client dans Firestore
export const updateClientFields = async (clientId, updatedFields) => {
  try {
    const clientDoc = doc(db, "clients", clientId); // Assurez-vous que le nom de la collection est correct
    await updateDoc(clientDoc, updatedFields);
    console.log("Informations du client mises à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour des informations du client:", error);
  }
};

// Fonction pour afficher et mettre à jour les informations du client
export const afficherDetEmpUpd = async (DetaiContainer, clientId) => {
  // Attendre la détection de l'utilisateur connecté
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("Aucun utilisateur connecté !");
      return;
    }

    console.log("Utilisateur connecté :", user.uid);

    const clientCollection = collection(db, "intervenents"); // Supposons que les informations des clients sont dans une collection "clients"

    // Requête pour récupérer le client connecté avec l'ID spécifié
    const queryClient = query(
      clientCollection,
  
    );

    // Exécuter la requête
    onSnapshot(queryClient, (snapshot) => {
      // Vider le DetaiContainer avant d'afficher les nouvelles informations du client
      DetaiContainer.innerHTML = " ";

      if (snapshot.empty) {
        DetaiContainer.innerHTML = `
          <tr>
            <td colspan="4" class="text-center text-muted">
              Aucun Intervenent  trouvé.
            </td>
          </tr>
        `;
        return;
      }
  
      const clients = snapshot.docs.map((doc) => doc.data());

      clients.forEach((client) => {
        // Afficher les détails du client dans le formulaire
        DetaiContainer.innerHTML = `
          <form method="POST" action="#" id="FormUpdClient">
            <div class="card">
              <div class="card-header">
                <h4>Informations du Intervent</h4>
              </div>
              <div class="card-body">
                <div class="form-group">
                  <label for="nomClient">Nom</label>
                  <input
                    type="text"
                    class="form-control"
                    id="nomClient"
                    name="nomClient"
                    placeholder="Entrez le nom"
                    value="${client.name}"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="prenomClient">Prénom</label>
                  <input
                    type="text"
                    class="form-control"
                    id="prenomClient"
                    name="prenomClient"
                    placeholder="Entrez le prénom"
                    value="${client.prenom}"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="emailClient">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="emailClient"
                    name="emailClient"
                    placeholder="Entrez l'email"
                    value="${client.email}"
                    required
                  />
                </div>
                <div class="form-group">
                  <label for="directionClient">Direction</label>
                  <input
                    type="text"
                    class="form-control"
                    id="directionClient"
                    name="directionClient"
                    placeholder="Entrez la direction"
                    value="${client.post || ''}"
                    required
                  />
                </div>
              </div>
              <div class="card-footer text-right">
                <button type="submit" class="btn btn-primary">Enregistrer les changements</button>
              </div>
            </div>
          </form>
        `;

        // Ajouter un écouteur d'événements pour la soumission du formulaire
        const form = document.getElementById("FormUpdClient");
        form.addEventListener("submit",async (event) => {
          event.preventDefault(); // Empêche la soumission normale du formulaire

          // Récupérer les nouvelles valeurs du formulaire
          const updatedFields = {
            name: form.nomClient.value,
            prenom: form.prenomClient.value,
            email: form.emailClient.value,
            direction: form.directionClient.value
          };

          // Mettre à jour les informations du client dans Firestore
          await updateClientFields(clientId, updatedFields);

          // Redirection ou message de succès après la mise à jour (optionnel)
          alert("Informations du Intervenet mises à jour avec succès !");
          
          window.location.href="admin.html"
          
        });
       
      });
    });
  });
};
