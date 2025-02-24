
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"
import {db} from "../config/firebaseConfig"

// Nom, prenom, direction

const AddClient = async (Id_user,First_Name,Last_Name,email,direction="Nktt, Cairo, Egypte")=>{

     try{
          
     const clientsCollection=collection(db,"clients")

     const q= query(clientsCollection,where("Id","==",Id_user))

     const snaphotquery = await getDocs(q)

     if(!snaphotquery.empty){
         console.log("le client est deja exist ")
         return
     }

     const docRef= await addDoc(clientsCollection,{
        Id:Id_user,
        name:First_Name,
        prenom:Last_Name,
        email:email,
        direction:direction

     })

     console.log("Client ajouté avec l'ID : ", docRef.id); 
           
     }catch(e){
            console.log("Erreure lors de l'ajouter de client" ,e)
     }

     
}

export {AddClient}