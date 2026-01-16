document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = form.querySelector('.submit-btn');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        // Hide any previous status messages
        formStatus.style.display = 'none';

        // Collect form data
        const formData = new FormData(form);

        console.log('Submitting form to Formspree...');

        // Send to Formspree
        fetch('https://formspree.io/f/mdaanljd', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json().then(data => ({ status: response.status, data: data }));
        })
        .then(result => {
            console.log('Response data:', result);

            if (result.status === 200 || result.status === 201) {
                formStatus.className = 'form-status success';
                formStatus.textContent = 'Thank you for your message! We will respond as soon as possible.';
                formStatus.style.display = 'block';
                form.reset();
            } else {
                throw new Error(result.data.error || 'Form submission failed');
            }
        })
        .catch(error => {
            console.error('Form submission error:', error);
            formStatus.className = 'form-status error';
            formStatus.textContent = 'Oops! There was a problem submitting your form. Please try again. Check the browser console for details.';
            formStatus.style.display = 'block';
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Message';
        });
    });
});
