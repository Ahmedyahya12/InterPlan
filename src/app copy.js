
import { sendSignInLink } from "./components/Auth.js"

const FormSendEmail=document.querySelector(".FormSendEmail")


FormSendEmail.addEventListener("submit",
    ()=>{
        const email=FormSendEmail.email.value

        sendSignInLink(email)
    }
)