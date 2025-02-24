import { addDoc, collection, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { auth } from "../config/firebaseConfig"; // Import Firebase Auth
import { db } from "../config/firebaseConfig";

const AddIntervention = async (type = "Hard", Motive = "Non spécifié", etat = "En attente") => {
    
    // Vérifier si un utilisateur est connecté
    const user = auth.currentUser;

    if (!user) {
        console.log("Aucun utilisateur connecté !");
        return;
    }

    const intervCollection = collection(db, "intervention");

    // Ajouter l'intervention avec les infos du client connecté
    const docRef = await addDoc(intervCollection, {
        type,
        Motive,
        etat,
        date: serverTimestamp(),
        client: {
            Id: user.uid,           // ID Firebase de l'utilisateur
            email: user.email,      // Email de l'utilisateur
            name: user.displayName || "Non spécifié", // Nom (si disponible)
        }
    });

    // Maintenant, mettre à jour le document pour ajouter l'ID dans le champ 'id'
    // Utilisation de setDoc avec merge: true pour ajouter l'ID au champ 'id'
    await setDoc(doc(db, "intervention", docRef.id), {
        id: docRef.id // Ajouter l'ID du document dans le champ 'id'
    }, { merge: true });

    console.log("L'intervention a été ajoutée avec succès", docRef.id);
};

export { AddIntervention };
