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