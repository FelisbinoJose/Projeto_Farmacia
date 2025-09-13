const toggleButton = document.getElementById("btn-menu-lateral");
const sidebar = document.getElementById("menu-lateral");

function toggleSidebar() {
    sidebar.classList.toggle("close");
    toggleButton.classList.toggle("rotate");

    Array.from(sidebar.getElementsByClassName('show')).forEach((ul) => {
        ul.classList.remove('show');
        ul.previousElementSibling.classList.remove('rotate');
    })
}

function toggleSubmenu(button) {
    button.nextElementSibling.classList.toggle('show');
    button.classList.toggle('rotate');

    if(sidebar.classList.contains('close')){
        sidebar.classList.toggle("close");
        toggleButton.classList.toggle('rotate');
    }
}