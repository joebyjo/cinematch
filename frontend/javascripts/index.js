document.body.style.display = "block";


document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    // Show button if page is scrolled down 200px
    btn.style.display = window.scrollY > 200 ? 'block' : 'none';
  });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
