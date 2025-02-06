// Check if email exists in users
function findUserByEmail(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(user => user.email === email);
}

// Reset Password Form
document.getElementById('resetPasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    const user = findUserByEmail(email);

    if (user) {
        // Store email temporarily for the reset process
        sessionStorage.setItem('resetEmail', email);
        document.getElementById('resetModal').style.display = 'block';
    } else {
        alert('No account found with this email address.');
    }
});

// New Password Form
document.getElementById('newPasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    const email = sessionStorage.getItem('resetEmail');
    const users = JSON.parse(localStorage.getItem('users'));
    const userIndex = users.findIndex(user => user.email === email);

    if (userIndex !== -1) {
        // Update password
        users[userIndex].password = newPassword;
        localStorage.setItem('users', JSON.stringify(users));
        
        // Clear reset email from session
        sessionStorage.removeItem('resetEmail');
        
        alert('Password has been reset successfully!');
        window.location.href = '../../index.html';
    }
});

function closeResetModal() {
    document.getElementById('resetModal').style.display = 'none';
}