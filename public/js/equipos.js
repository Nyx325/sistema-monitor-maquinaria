function logout() {
    alert("Cerrando sesión...");
   
}
document.addEventListener("DOMContentLoaded", function() {
    const logo = document.querySelector("img"); 
    
    if (logo) {
        logo.style.cursor = "pointer"; 
        logo.addEventListener("click", function() {
            window.location.href = "/"; 
        });
    }
});