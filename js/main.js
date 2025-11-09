window.scrollBy({
  top: 0,
  left: 0,
  behavior: 'smooth'
});


//Header
let mainHeader = document.querySelector(".main-header");

window.addEventListener("scroll", function(event){
    if(window.scrollY > 80){
        mainHeader.classList.add("active-top")
    }else{
        mainHeader.classList.remove("active-top")
    }
})
// Mobile header event
let mobileOpenBtn = document.getElementById("mobileOpenBtn");
let closeMobileMenu = document.getElementById("closeMobileMenu");
let clearMobileFade = null
let mobileMenuSection =  document.querySelector(".mobile-menu-section")
mobileOpenBtn.addEventListener("click", (e) => {
    mobileMenuSection.classList.add("show")
    mobileMenuSection.classList.remove("fade")
    document.body.style.overflow = "hidden";
    clearTimeout(clearMobileFade)

    
})
closeMobileMenu.addEventListener("click", (e) => {
    mobileMenuSection.classList.add("fade")
    clearMobileFade = setTimeout(()=>{
        mobileMenuSection.classList.remove("show");
        document.body.style.overflow = "auto";
    }, 500)
})

// Page scroll animation
const sectionReveal = document.querySelectorAll('.anim-reveal');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      sectionObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

sectionReveal.forEach(sec => sectionObserver.observe(sec));

//Counter event
const counterObserver = new IntersectionObserver((elm) => {
  elm.forEach(entry => {
    if (entry.isIntersecting) {
        let node = entry.target
        let val = Number(node.innerHTML);
        runCounter(node, val)
    }
  });
}, { threshold: 0.2 });
let numberCount = document.querySelectorAll(".anim-number")

function runCounter(targetElm, value){
    let count = 0;
    let startCount = setInterval(()=> {
        if(count == value){
            clearInterval(startCount)
            return
        }
        count +=1;
        targetElm.innerHTML = new Intl.NumberFormat("en-IN").format(count);
    }, 20)
}

numberCount.forEach((item) => {
    counterObserver.observe(item)
})


//Form submition
function formQuoteSubmition(formId, urlApi, fieldsInput){
  const homeGetQuoteForm = document.querySelector("#"+formId);
  const homeGetQuoteErr = document.querySelector(`#${formId} .alert`);
  const formInputs = document.querySelectorAll(".form-control");
  const formSelect = document.querySelector(".form-select");
  const loaderForm = document.querySelector(`#${formId} .loader-container`)
  const GOOGLE_SCRIPT_URL = urlApi;
  let formAlertTime;

  formInputs.forEach((inputs) => {
      inputs.addEventListener("keyup", (e)=>{
          let node = e.target;
          node.classList.remove("invalid")
      })
  })
  formSelect.addEventListener("change", (e) => {
      let node = e.target;
      node.classList.remove("invalid")
  })

  function closeErrorMessage(){
      formAlertTime = setTimeout(() => {
          homeGetQuoteErr.classList.add("d-none");
          homeGetQuoteErr.classList.remove("alert-danger");
          homeGetQuoteErr.classList.remove("alert-success");

      }, 2000)
  }

    homeGetQuoteForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        if(formAlertTime) clearTimeout(formAlertTime);
        homeGetQuoteErr.textContent = ""
        let isValidForm = true;
        // let fieldsInput = ["userName", "mobile", "serviceType", "city"]
       
        const nameRegex = /^[A-Za-z\s]+$/;
        const mobileRegex = /^[0-9]{10}$/;
        let message = "";
        let formData = {};
        fieldsInput.forEach((inptId) => {
            let inpt = document.getElementById(inptId)
            const value = inpt.value.trim();
            message = "";
            if(!value){
                message = "All fields is required.";
            }else if (inptId == "userName" && !nameRegex.test(value)) {
                message = "Enter a valid name."
                
            }
            else if (inptId == "mobile" &&  !mobileRegex.test(value)) {
                message = "Enter a valid 10-digit mobile number."
            }

            if (message) {
                isValidForm = false;
                inpt.classList.add("invalid")
                homeGetQuoteErr.classList.remove("d-none");
                homeGetQuoteErr.classList.add("alert-danger");
                homeGetQuoteErr.textContent = message;
            } else{
                message = "Submitted successfully!"
            }
            formData[inptId] = value;

            
        })



        if(message) closeErrorMessage()

        if(!isValidForm) return;

        try {
            const formDataObj = new FormData();
            formDataObj.append("userName", formData["userName"]);
            formDataObj.append("mobile", formData["mobile"]);
            formDataObj.append("serviceType", formData["serviceType"]);
            formDataObj.append("city", formData["city"]);
            loaderForm.classList.remove("d-none")

            const res = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                body: formDataObj,
            });
            const result = await res.json();
            if (result.result === "success") {
                homeGetQuoteErr.classList.remove("d-none");
                homeGetQuoteErr.classList.remove("alert-danger");
                homeGetQuoteErr.classList.add("alert-success");
                homeGetQuoteErr.textContent = message;
                homeGetQuoteForm.reset();
                closeErrorMessage()
            }else { 
                homeGetQuoteErr.classList.remove("d-none"); 
                homeGetQuoteErr.classList.add("alert-danger"); 
                homeGetQuoteErr.textContent = "Failed to save data."; 
                closeErrorMessage() 
            }
            loaderForm.classList.add("d-none")
        } catch (error) {
            loaderForm.classList.add("d-none")
            homeGetQuoteErr.classList.remove("d-none");
            homeGetQuoteErr.classList.add("alert-danger");
            homeGetQuoteErr.textContent  = "Somthing went wrong please try again later.";
            closeErrorMessage()
            console.error(error);
        }
    
    });
}