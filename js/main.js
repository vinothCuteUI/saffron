window.scrollBy({
  top: 0,
  left: 0,
  behavior: 'smooth'
});


let originURL = window.location.origin
console.log("originURL", originURL)
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
mobileOpenBtn?.addEventListener("click", (e) => {
    mobileMenuSection.classList.add("show")
    mobileMenuSection.classList.remove("fade")
    document.body.style.overflow = "hidden";
    clearTimeout(clearMobileFade)

    
})
closeMobileMenu?.addEventListener("click", (e) => {
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
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzhnEovL7gEO3xjhZmICSVYn4ntQiSKwDYwDW5kqLoMt5q4xD5t84i8qnLQH0uTQyDGUQ/exec"
function formQuoteSubmition(formId, formType, fieldsInput){
    const getQuoteForm = document.querySelector("#"+formId);
    const getQuoteErr = getQuoteForm.querySelector(`.alert`);
    const formInputs = getQuoteForm.querySelectorAll(`.form-control`);
    const formSelect = getQuoteForm.querySelector(`.form-select`);
    const loaderForm = getQuoteForm.querySelector(`.loader-container`)
    //   const GOOGLE_SCRIPT_URL = urlApi;
    let formAlertTime;

    formInputs.forEach((inputs) => {
        inputs.addEventListener("keyup", (e)=>{
            let node = e.target;
            node.classList.remove("invalid")
        })
    })
    formSelect?.addEventListener("change", (e) => {
        let node = e.target;
        node.classList.remove("invalid")
    })

    function closeErrorMessage(){
        formAlertTime = setTimeout(() => {
            getQuoteErr.classList.add("d-none");
            getQuoteErr.classList.remove("alert-danger");
            getQuoteErr.classList.remove("alert-success");

        }, 2000)
    }

    getQuoteForm.addEventListener("submit", async (e) => {

        e.preventDefault();
        if(formAlertTime) clearTimeout(formAlertTime);
        getQuoteErr.textContent = ""
        let isValidForm = true;
        // let fieldsInput = ["userName", "mobile", "serviceType", "city"]
       
        const nameRegex = /^[A-Za-z\s]+$/;
        const mobileRegex = /^[0-9]{10}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        let message = "";
        let formData = {};
        fieldsInput.forEach((inptId) => {
            let inpt = getQuoteForm.querySelector(`#${inptId}`)
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
            else if (inptId == "email" &&  !emailRegex.test(value)) {
                message = "Enter a valid Email Id."
            }

            if (message) isValidForm = false;
            if (message) {
                inpt.classList.add("invalid")
                getQuoteErr.classList.remove("d-none");
                getQuoteErr.classList.add("alert-danger");
                getQuoteErr.textContent = message;
            } else{
                message = "Submitted successfully!"
            }

            formData[inptId] = value;

            
        })



        if(message) closeErrorMessage()

        if(!isValidForm) return;

        try {
            const formDataObj = new FormData();
            formDataObj.append("formType", formType);
            for(let fm in formData){
                formDataObj.append(fm, formData[fm]);
            }
            // formDataObj.append("mobile", formData["mobile"]);
            // formDataObj.append("serviceType", formData["serviceType"]);
            // formDataObj.append("city", formData["city"]);
            loaderForm.classList.remove("d-none")
            const res = await fetch(GOOGLE_SCRIPT_URL, {
                method: "POST",
                body: formDataObj,
            });
            const result = await res.json();
            if (result.result === "success") {
                getQuoteErr.classList.remove("d-none");
                getQuoteErr.classList.remove("alert-danger");
                getQuoteErr.classList.add("alert-success");
                getQuoteErr.textContent = message;
                getQuoteForm.reset();
                closeErrorMessage();
                
                if(formType == "interior"){
                    window.location.href = `${originURL}/interiors-thank-you.html`;
                }else if(formType == "construction"){
                    window.location.href = `${originURL}/construction-thank-you.html`
                }else{
                    window.location.href = `${originURL}/thank-you.html`
                }
            }else { 
                getQuoteErr.classList.remove("d-none"); 
                getQuoteErr.classList.add("alert-danger"); 
                getQuoteErr.textContent = "Failed to save data."; 
                closeErrorMessage() 
            }
            loaderForm.classList.add("d-none")
        } catch (error) {
            loaderForm.classList.add("d-none")
            getQuoteErr.classList.remove("d-none");
            getQuoteErr.classList.add("alert-danger");
            getQuoteErr.textContent  = "Somthing went wrong please try again later.";
            closeErrorMessage()
            console.error(error);
        }
    
    });
}

let mobilenavDropdown = document.querySelectorAll(".mobilenav-dropdown");

mobilenavDropdown.forEach((dpMenu) => {
    dpMenu.addEventListener("click", (e) => {
        
        const toggle = e.target.classList.contains('mobilenav-dropdown');
      
        if (!toggle) return;

        e.preventDefault();
        let transitionTime = 500;
        let node = e.target;
        let parent = node.parentNode;
        const mobileSubnav = parent.querySelector(".mobile-subnav")

        node.classList.toggle("active");
        mobileSubnav.style.transition = `height ${(transitionTime / 10) / 100}s ease`;

        if (mobileSubnav.classList.contains("slideup")) {
            mobileSubnav.classList.remove("slideup");
            mobileSubnav.classList.add("slidedown");

            const crntHeight = mobileSubnav.scrollHeight + "px";
            mobileSubnav.style.height = "0px";
            mobileSubnav.offsetHeight;
            mobileSubnav.style.height = crntHeight;
            setTimeout(() => {
                mobileSubnav.style.height = "auto";
            }, transitionTime);
        } else {
            mobileSubnav.style.height = mobileSubnav.scrollHeight + 'px';
            mobileSubnav.offsetHeight;
            mobileSubnav.style.height = '0px';

            mobileSubnav.addEventListener('transitionend', function () {
                mobileSubnav.classList.remove('slidedown');
                mobileSubnav.classList.add('slideup');
            }, { once: true });
        }
    })
})