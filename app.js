const video1 = document.getElementById('projectVides1');
const video2 = document.getElementById('projectVides2');
const video3 = document.getElementById('projectVides3');


const sideBar = document.querySelector('.sidebar');
const menu = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon')

const hoverSign = document.querySelector('.hover-sign');
const videoList = [video1,video2,video3];

videoList.forEach(function(video){
    video.addEventListener("mouseover", function() {
        video.play()
        hoverSign.classList.add("active")
    })
    video.addEventListener("mouseout", function(){
        video.pause();
        hoverSign.classList.remove("active")
    })
})
menu.addEventListener("click", function() {
    sideBar.classList.remove("close-sidebar")
    sideBar.classList.add("open-sidebar")
});
closeIcon.addEventListener("click", function(){
    sideBar.classList.remove("open-sidebar");
    sideBar.classList.add("close-sidebar")
})
const form = document.getElementById("contactForm");

form.addEventListener("submit", async (e) => {
  e.preventDefault(); // page reload ko rokta hai

  const fullName = form.querySelector('input[placeholder="Your Full name"]').value;
  const email = form.querySelector('input[placeholder="Your Email"]').value;
  const message = form.querySelector('.input-message').value;

  try {
    const response = await fetch("http://localhost:3000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, message })
    });

    const data = await response.json();
    if (data.ok) alert("Email sent successfully!");
    else alert("Error: " + data.error);

  } catch (err) {
    console.error(err);
    alert("Server error, check console.");
  }
});

// Smooth scroll for navbar and sidebar
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }

    // close sidebar if open
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) sidebar.classList.remove('active');
  });
});
