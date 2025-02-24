
import { addDoc, collection, getDocs, query, where } from "firebase/firestore"
import {db} from "../config/firebaseConfig"

// Nom, prenom, direction

const AddUser = async (Id_user,First_Name,Last_Name,email)=>{

     try{
          
     const clientsCollection=collection(db,"utilisateurs")

     const q= query(clientsCollection,where("Id","==",Id_user))

     const snaphotquery = await getDocs(q)

     if(!snaphotquery.empty){
         console.log("le user est deja exist ")
         return
     }

     const docRef= await addDoc(clientsCollection,{
        Id:Id_user,
        name:First_Name,
        prenom:Last_Name,
        email:email,
       
        
     })

     console.log("User ajouté avec l'ID : ", docRef.id); 
           
     }catch(e){
            console.log("Erreure lors de l'ajouter de user" ,e)
     }

     
}

export {AddUser}


