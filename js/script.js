document.addEventListener('DOMContentLoaded', function() {
    const ticketForm = document.getElementById('ticketForm');
    const confirmation = document.getElementById('confirmation');
    const loadingOverlay = document.getElementById('loadingOverlay');
    const orderReference = document.getElementById('orderReference');
    
    // Azure api URL 
    const apiUrl = 'https://tickethub-app.azurewebsites.net';
    
    ticketForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Show loading overlay
        loadingOverlay.classList.remove('hidden');
        
        // Get form data
        const formData = {
            ConcertId: parseInt(document.getElementById('concertId').value),
            Email: document.getElementById('email').value,
            Name: document.getElementById('name').value,
            Phone: document.getElementById('phone').value,
            Quantity: parseInt(document.getElementById('quantity').value),
            CreditCard: document.getElementById('creditCard').value,
            Expiration: document.getElementById('expiration').value,
            SecurityCode: document.getElementById('securityCode').value,
            Address: document.getElementById('address').value,
            City: document.getElementById('city').value,
            Province: document.getElementById('province').value,
            PostalCode: document.getElementById('postalCode').value,
            Country: document.getElementById('country').value
        };
        
        // Log the data being sent (for debugging)
        console.log('Sending ticket purchase data:', formData);
        
        // Send data to Azure Function
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            // Hide loading overlay
            loadingOverlay.classList.add('hidden');
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            // Generate a random order reference
            const randomRef = 'TH-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
            orderReference.textContent = randomRef;
            
            // Show confirmation
            ticketForm.classList.add('hidden');
            confirmation.classList.remove('hidden');
            
            // Scroll to confirmation
            confirmation.scrollIntoView({ behavior: 'smooth' });
            
            return response.json();
        })
        .then(data => {
            console.log('Success:', data);
        })
        .catch(error => {
            // Hide loading overlay
            loadingOverlay.classList.add('hidden');
            
            console.error('Error:', error);
            alert('There was an error processing your purchase. Please try again.');
        });
    });
    
    // Format credit card number with spaces
    const creditCardInput = document.getElementById('creditCard');
    creditCardInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s+/g, '');
        if (value.length > 0) {
            value = value.match(new RegExp('.{1,4}', 'g')).join(' ');
        }
        e.target.value = value;
    });
    
    // Format expiration date with slash
    const expirationInput = document.getElementById('expiration');
    expirationInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    });
    
    // Format phone number
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 6) {
            value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
        } else if (value.length > 3) {
            value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6);
        } else if (value.length > 0) {
            value = '(' + value.substring(0, 3);
        }
        e.target.value = value;
    });
    
    // Format postal code
    const postalCodeInput = document.getElementById('postalCode');
    postalCodeInput.addEventListener('input', function(e) {
        let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (value.length > 3) {
            value = value.substring(0, 3) + ' ' + value.substring(3, 6);
        }
        e.target.value = value;
    });
});
