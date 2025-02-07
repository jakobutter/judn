document.querySelectorAll('.colorButton').forEach(button => {
    button.addEventListener('click', function() {
        const newColor = this.getAttribute('data-color');
        document.documentElement.style.setProperty('--color1', newColor);
    });
});
