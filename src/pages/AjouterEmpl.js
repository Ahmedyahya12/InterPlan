
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"
import {db} from "../config/firebaseConfig"

// Nom, prenom, direction

const AddEmploye = async (Id_user,First_Name,Last_Name,email,post="Technicien")=>{

     try{
          
     const clientsCollection=collection(db,"intervenents")

     const q= query(clientsCollection)

     const snaphotquery = await getDocs(q)

    
     const docRef= await addDoc(clientsCollection,{
        Id:Id_user,
        name:First_Name,
        prenom:Last_Name,
        email:email,
        post:post

     })

     console.log("Client ajouté avec l'ID : ", docRef.id); 
           
     }catch(e){
            console.log("Erreure lors de l'ajouter de Intervent" ,e)
     }

     
}

export {AddEmploye}