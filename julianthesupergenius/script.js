document.addEventListener('DOMContentLoaded', () => {
    const interactBtn = document.getElementById('interact-btn');
    const container = document.querySelector('.container');

    interactBtn.addEventListener('click', () => {
        // Create a ripple effect
        const ripple = document.createElement('div');
        ripple.style.position = 'fixed';
        ripple.style.top = '50%';
        ripple.style.left = '50%';
        ripple.style.width = '10px';
        ripple.style.height = '10px';
        ripple.style.background = 'rgba(0, 240, 255, 0.5)';
        ripple.style.borderRadius = '50%';
        ripple.style.transform = 'translate(-50%, -50%)';
        ripple.style.pointerEvents = 'none';
        ripple.style.zIndex = '9999';
        ripple.style.transition = 'all 1s cubic-bezier(0.1, 0.8, 0.3, 1)';
        document.body.appendChild(ripple);

        setTimeout(() => {
            ripple.style.transform = 'translate(-50%, -50%) scale(500)';
            ripple.style.opacity = '0';
        }, 10);

        setTimeout(() => {
            ripple.remove();
        }, 1000);

        // Update button text
        interactBtn.textContent = 'Genius Activated!';
        interactBtn.style.background = 'var(--primary)';
        interactBtn.style.color = 'var(--bg-color)';
        
        // Add a shake effect to the card
        const card = document.querySelector('.glass-card');
        card.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
        
        setTimeout(() => {
            card.style.animation = 'none';
        }, 500);
    });
    
    // Add dynamic hover effect to the card based on mouse position
    const card = document.querySelector('.glass-card');
    
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
});

// Add the shake animation via JS
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}
`;
document.head.appendChild(style);

// Newspaper Form Handler
const newspaperForm = document.getElementById('newspaper-form');
if (newspaperForm) {
    newspaperForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = newspaperForm.querySelector('input[name="name"]').value;
        const submission = newspaperForm.querySelector('textarea[name="submission"]').value;
        
        const email = 'julianlacinaromer@gmail.com';
        const subject = encodeURIComponent('Hartsbrook Post Submission from ' + name);
        const body = encodeURIComponent(submission);
        
        // Open Gmail web composer in a new tab
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
        window.open(gmailLink, '_blank');
        
        // Optional: clear the form after opening
        newspaperForm.reset();
    });
}

// Fetch and render posts dynamically from Firebase
const postsContainer = document.getElementById('posts-container');
if (postsContainer && typeof db !== 'undefined') {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot((snapshot) => {
        if (snapshot.empty) {
            postsContainer.innerHTML = '<p>No posts available yet. Check back soon!</p>';
            return;
        }
        
        let html = '';
        snapshot.forEach(doc => {
            const post = doc.data();
            html += `
                <div style="margin-bottom: 2rem; padding: 1rem; background: rgba(0,0,0,0.2); border-radius: 10px; border: 1px solid var(--glass-border);">
                    <h4 style="color: var(--primary); margin-bottom: 0.5rem; font-size: 1.2rem;">${post.headline}</h4>
                    <p style="color: #aaa; font-size: 0.9rem; margin-bottom: 1rem;">Released: ${post.date}</p>
                    <a href="${post.fileUrl}" target="_blank" class="cta-button" style="display: inline-block; font-size: 0.9rem; padding: 0.5rem 1rem; text-decoration: none;">Download / View</a>
                </div>
            `;
        });
        postsContainer.innerHTML = html;
    }, (error) => {
        console.error('Error fetching posts from Firebase:', error);
        postsContainer.innerHTML = '<p style="color: #ff003c;">Error loading posts. Please check your database permissions.</p>';
    });
}
