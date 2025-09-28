window.scrollBy({
  top: 0,
  left: 0,
  behavior: 'smooth'
});


//Header
let mainHeader = document.querySelector(".main-header");

window.addEventListener("scroll", function(event){
    console.log("window.screenY", window.scrollY )
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

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Uncomment next line if you want it only once
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

sectionReveal.forEach(sec => observer.observe(sec));