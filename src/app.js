import {
  createUser,
  enforceAuthRules,
  LoginUser,
  LogoutUser,
  onChangePge,
  OnChangeState,
  OnChangeStateProfile,
  sendSignInLink,
} from "./components/Auth";
import { showAlertWithProgress } from "./components/showAlertWithProgress";
import { showProgress } from "./config/AlertProg";
import { auth } from "./config/firebaseConfig";

document.addEventListener("DOMContentLoaded", () => {
  //Send Email To user

  const FormSendEmail = document.querySelector(".FormSendEmail");

  if (FormSendEmail) {
    FormSendEmail.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = FormSendEmail.email.value;

      sendSignInLink(email);
    });
  }

  //inscrit un utilsateur
  const RegistrationForm = document.querySelector(".RegistrForm");

  if (RegistrationForm) {
    RegistrationForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const Fist_Name = RegistrationForm.firstName.value;
      const Last_Name = RegistrationForm.lastName.value;
      const email = RegistrationForm.email.value;
      const password = RegistrationForm.password.value;

      createUser(Fist_Name, Last_Name, email, password);
    });
  }

  //Connecter un utilisateur

  const loginForm = document.querySelector(".loginuser");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      LoginUser(email, password);
      
    });
  }

  const fullNameElement = document.querySelector("#NomComplet");

  if (fullNameElement) {
    const x = OnChangeState(fullNameElement)
    OnChangeState(fullNameElement)

  }


  const FormProfile=document.querySelector(".Formprofile")
  if(FormProfile){
    
        
       
        const emailInput= FormProfile.querySelector("input[name='email']")
        const First_Name= FormProfile.querySelector("input[name='first_name']")
        const last_Name= FormProfile.querySelector("input[name='last_name']")
        
       
        OnChangeStateProfile(First_Name,emailInput)
        


      }

  const BtnLogout=document.querySelector("#logout-user")

   if(BtnLogout){

    BtnLogout.addEventListener("click",
      (e)=>{
          e.preventDefault()
          LogoutUser()
          window.location.href="login.html"
      }
    )

   }
  
   enforceAuthRules()
 
});
