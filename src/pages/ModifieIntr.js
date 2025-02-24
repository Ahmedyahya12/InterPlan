import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
  updateDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

// Fonction pour mettre à jour les champs de l'intervention dans Firestore
export const updateFields = async (interventionId, updatedFields) => {
  try {
    const interventionDoc = doc(db, "intervention", interventionId);
    await updateDoc(interventionDoc, updatedFields);
    console.log("Intervention mise à jour avec succès !");
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'intervention:", error);
  }
};

export const afficherDetIntrUpd = async (DetaiContainer, interventionId,CardClient) => {
  // Attendre la détection de l'utilisateur connecté
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      console.log("Aucun utilisateur connecté !");
      return;
    }

    console.log("Utilisateur connecté :", user.uid);

    const interventionCollection = collection(db, "intervention");

    // Requête pour récupérer uniquement l'intervention du client connecté avec l'ID spécifié
    const queryIntervention = query(
      interventionCollection,
      where("id", "==", interventionId) // Filtrer par l'ID spécifique de l'intervention
    );

    // Exécuter la requête
    onSnapshot(queryIntervention, (snapshot) => {
      // Vider le DetaiContainer avant d'afficher la nouvelle intervention
      DetaiContainer.innerHTML = "";

      if (snapshot.empty) {
        DetaiContainer.innerHTML = `  
                    <tr>
                        <td colspan="4" class="text-center text-muted">
                                Aucune intervention trouvée.
                          </td>
                    </tr>
                `;
        return;
      }

      const interventions = snapshot.docs.map((doc) => doc.data());

      interventions.forEach((intr) => {
        // Définir la couleur de badge en fonction de l'état
        let badgeClass = "";
        switch (intr.etat) {
          case "En cours":
            badgeClass = "badge-info"; // Bleu
            break;
          case "Terminé":
            badgeClass = "badge-success"; // Vert
            break;
          case "Annulé":
            badgeClass = "badge-danger"; // Rouge
            break;
          case "En attente":
            badgeClass = "badge-warning"; // Jaune
            break;
          case "Non pris en charge":
            badgeClass = "badge-secondary"; // Gris
            break;
          case "Non approuvée":
            badgeClass = "badge-dark"; // Noir
            break;
          default:
            badgeClass = "";
            break;
        }

        // Vérifier si 'date' est bien un objet 'Timestamp' avant d'appeler toDate()
        const formattedDate =
          intr.date && intr.date.toDate
            ? intr.date.toDate().toLocaleDateString("en-CA")
            : "2025-02-25"; // Valeur par défaut si la date n'est pas valide

        // Mettre à jour l'objet updatedFields avec les données de l'intervention
        const updatedFields = {
          etat: intr.etat, // Nouvel état de l'intervention
          date: formattedDate, // Date formatée
          type: intr.type,

          client: intr.client,
        };

        // Stocker updatedFields dans le localStorage
        localStorage.setItem("updatedFields", JSON.stringify(updatedFields));

        const utilisateurs=JSON.parse(localStorage.getItem("utilisateur")).user

        console.log("utilisateurs ++",utilisateurs)

        

        // Afficher les détails de l'intervention dans le DetaiContainer
        DetaiContainer.innerHTML = `
                    <form method="POST" action="#" id="FormUpdInt">
                        <div class="card">
                            <div class="card-header d-flex align-items-center">
                                <div class="ml-3">
                                    <h4>Motif de l'Intervention</h4>
                                    <p>
                                        <i class="fa fa-spinner fa-spin"></i> État:
                                        <strong>
                                            <span class="badge ${badgeClass}">${
          intr.etat
        }</span>
                                        </strong>
                                    </p>
                                    <p>
                                        <i class="fa fa-clock-o"></i> Date prévue:
                                        <strong>
                                            <input
                                                type="date"
                                                name="date_prevue"
                                                value="${formattedDate}"
                                                class="form-control"
                                                id="date_prevue"
                                                required
                                            />
                                        </strong>
                                    </p>
                                </div>
                            </div>
                            <div class="card-body">
                                <h5>À propos de l'intervention</h5>
                                <p class="mb-3">
                                    <strong>Type d'intervention</strong>:
                                    <select
                                        class="form-select"
                                        id="interventionType"
                                        name="type"
                                        required
                                    >
                                        <option selected disabled value="">Choisir...</option>
                                        <option value="Maintenance" ${
                                          intr.type === "Maintenance"
                                            ? "selected"
                                            : ""
                                        }>Maintenance</option>
                                        <option value="Réparation" ${
                                          intr.type === "Réparation"
                                            ? "selected"
                                            : ""
                                        }>Réparation</option>
                                        <option value="Installation" ${
                                          intr.type === "Installation"
                                            ? "selected"
                                            : ""
                                        }>Installation</option>
                                    </select>
                                </p>
                                <p>
                                    <strong>État d'intervention</strong>:
                                    <select
                                        class="form-select"
                                        id="interventionEtat"
                                        name="etat"
                                        required
                                    >
                                        <option selected disabled value="">Choisir...</option>
                                        <option value="En cours" ${
                                          intr.etat === "En cours"
                                            ? "selected"
                                            : ""
                                        }>En cours</option>
                                        <option value="Terminé" ${
                                          intr.etat === "Terminé"
                                            ? "selected"
                                            : ""
                                        }>Terminé</option>
                                        <option value="Annulé" ${
                                          intr.etat === "Annulé"
                                            ? "selected"
                                            : ""
                                        }>Annulé</option>
                                        <option value="En attente" ${
                                          intr.etat === "En attente"
                                            ? "selected"
                                            : ""
                                        }>En attente</option>
                                        <option value="Non pris en charge" ${
                                          intr.etat === "Non pris en charge"
                                            ? "selected"
                                            : ""
                                        }>Non pris en charge</option>
                                        <option value="Non approuvée" ${
                                          intr.etat === "Non approuvée"
                                            ? "selected"
                                            : ""
                                        }>Non approuvée</option>
                                    </select>
                                </p>
                                <p>
                                    <strong>Description:</strong>
                                    <p>
                                        Cette intervention concerne le client <strong class="text-primary">${
                                          intr.client.name
                                        }</strong> et est traitée par le technicien <strong class="text-danger">[Nom du technicien]</strong>
                                    </p>
                                </p>
                            </div>
                            <div class="card-footer text-right">
                                 
                                <button type="submit" class="btn btn-primary" >
                                    Enregistrer les changements
                                </button>
                            </div>
                            <div class="card-footer text-left">
                                <a href="admin.html" class="btn btn-primary">
                                    ← Retour
                                </a>
                            </div>
                        </div>
                    </form>
         `;
        
         CardClient.innerHTML= `

         <div class="card ">
            <div class="card-header">
              <h5>Informations sur le client ayant créé l'intervention</h5>
            </div>
            <div class="card-body">
              <ul class="list-group">
                <li class="list-group-item">
                  Nom : <span class="font-weight-bold">

                  ${utilisateurs.name} ${utilisateurs.prenom} 
                  
                  </span>
                </li>
                <li class="list-group-item">
                  Email :
                  <span class="font-weight-bold">${utilisateurs.email}</span>
                </li>
                <li class="list-group-item">
                  Adresse :
                  <span class="font-weight-bold">Nktt, Cairo, Egypte</span>
                </li>
              </ul>
            </div>
          </div>
         `
        // Ajouter un écouteur d'événements pour la soumission du formulaire
        const form = document.getElementById("FormUpdInt");
        form.addEventListener("submit", (event) => {
          event.preventDefault(); // Empêche la soumission normale du formulaire

          // Récupérer les nouvelles valeurs du formulaire
          const updatedFields = {
            etat: form.etat.value, // Nouvel état de l'intervention
            date: serverTimestamp(), // Nouvelle date
            type: form.type.value, // Nouveau type
            // Nouveau motif
          };

          // Mettre à jour l'intervention dans Firestore
          updateFields(interventionId, updatedFields);
          
          // Redirection après la mise à jour
        });
      });
    });
  });
};
