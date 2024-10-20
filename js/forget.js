function handleForgotPassword(e) {
    e.preventDefault();
    
    const email = document.getElementById('forgotEmail').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email);
    const serverid="service_t4viodh";
    const templateid="template_rppscnl";
    emailjs.init("8arHpYEsf--CmO75x"); // Replace with your actual User ID
    if (user) {
        console.log('User found:', user);

        const code = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit code
        localStorage.setItem('resetCode', JSON.stringify({ email, code }));
        emailjs.send(serverid, templateid, {
            to_email: email,
            reset_code: code
            
        }).then(function(response) {
            console.log('Email sent successfully:', response);
            alert('A reset code has been sent to your email. Please check your inbox.');
            document.getElementById('forgotPasswordForm').style.display = 'none';
            document.getElementById('verifyCodeForm').style.display = 'block';
        }, function(error) {
            console.log('Failed to send email:', error);
            alert('Failed to send reset code. Please try again later.');
        });
    } else {
        alert('Email not found. Please check your email and try again.');
    }
}