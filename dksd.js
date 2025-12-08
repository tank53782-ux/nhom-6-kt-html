document.addEventListener('DOMContentLoaded', function() {
    const nutVeDauTrang = document.getElementById('nut-ve-dau-trang');

    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) { 
            nutVeDauTrang.classList.remove('an');
        } else {
            nutVeDauTrang.classList.add('an');
        }
    });

    
    nutVeDauTrang.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' 
        });
    });
});