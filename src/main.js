import "@fontsource-variable/geist";
import "./styles.css";
import appHtml from "./App.html?raw";

document.querySelector("#app").innerHTML = appHtml;

const WHATSAPP_PHONE = "554196168447";
const FEEDBACK_LABEL = "Abrindo WhatsApp...";
const FEEDBACK_DURATION_MS = 2800;


const toastEl = document.getElementById("toast");
const yearEl = document.getElementById("year");
const formEl = document.getElementById("lead-form");
const submitBtn = document.getElementById("submit-btn");
const servicoHint = document.getElementById("servico-hint");


if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}


function buildWhatsAppUrl(message) {

  return (
    `https://wa.me/${WHATSAPP_PHONE}?text=` +
    encodeURIComponent(message)
  );

}



function showToast(text){

  if(!toastEl) return;

  toastEl.textContent = text;
  toastEl.hidden = false;

  requestAnimationFrame(()=>{
    toastEl.classList.add("is-visible");
  });


  setTimeout(()=>{

    toastEl.classList.remove("is-visible");

    setTimeout(()=>{
      toastEl.hidden=true;
    },300);

  },FEEDBACK_DURATION_MS);

}



function getFormData(){

  const nome = formEl.nome.value.trim();
  const marca = formEl.marca.value.trim();
  const instagram = formEl.instagram.value.trim();
  const email = formEl.email.value.trim();
  const objetivo = formEl.objetivo.value.trim();


  const servicos = [...document.querySelectorAll(
    'input[name="servico"]:checked'
  )]
  .map(item=>item.value)
  .join(", ");



  if(!nome || !marca || !instagram || !email || !objetivo){

    formEl.reportValidity();
    return null;

  }



  if(!servicos){

    servicoHint.hidden=false;
    return null;

  }


  servicoHint.hidden=true;


  return {

    nome,
    marca,
    instagram: instagram.startsWith("@")
      ? instagram
      : `@${instagram}`,

    email,
    servicos,
    objetivo

  };

}



function createMessage(data){

return `Olá! Vim pelo site da nabō | mídias sociais e gostaria de conversar sobre um projeto.

*Nome:* ${data.nome}
*Marca:* ${data.marca}
*Instagram:* ${data.instagram}
*E-mail:* ${data.email}
*Serviço(s):* ${data.servicos}
*O que busca:* ${data.objetivo}`;

}




function initForm(){

 if(!formEl || !submitBtn)return;


 formEl.addEventListener("submit",(event)=>{

  event.preventDefault();


  const data=getFormData();

  if(!data)return;


  submitBtn.disabled=true;
  submitBtn.textContent=FEEDBACK_LABEL;

  showToast(FEEDBACK_LABEL);


  setTimeout(()=>{

    window.open(
      buildWhatsAppUrl(createMessage(data)),
      "_blank"
    );

  },400);



  setTimeout(()=>{

    submitBtn.disabled=false;
    submitBtn.textContent="Enviar mensagem";

  },FEEDBACK_DURATION_MS);



 });


}



function initReveal(){

const elements=document.querySelectorAll(".reveal");


if(!elements.length)return;


const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("is-visible");
observer.unobserve(entry.target);

}

});


});


elements.forEach(el=>observer.observe(el));


}




initForm();
initReveal();