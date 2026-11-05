document.addEventListener('DOMContentLoaded', () => {
    const interactBtn = document.getElementById('interact-btn');
    const container = document.querySelector('.container');

    if (interactBtn) {
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
            if (card) {
                card.style.animation = 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both';
                setTimeout(() => {
                    card.style.animation = 'none';
                    
                    // Reveal the navigation bar
                    const nav = document.getElementById('main-nav');
                    if (nav) {
                        nav.style.opacity = '1';
                        nav.style.pointerEvents = 'auto';
                    }
                }, 500);
            }
        });
    }
    
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

// Newspaper Form Handler -> Automatic transmission via Formspree + Cloudinary attachments
const newspaperForm = document.getElementById('newspaper-form');
if (newspaperForm) {
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xwllzwjr';
    const newspaperSubmitBtn = document.getElementById('newspaper-submit-btn');
    const newspaperStatus = document.getElementById('newspaper-status');

    newspaperForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('newspaper-name').value;
        const submission = document.getElementById('newspaper-submission').value;
        const fileInput = document.getElementById('newspaper-file');
        const file = fileInput && fileInput.files ? fileInput.files[0] : null;
        
        if (newspaperSubmitBtn) {
            newspaperSubmitBtn.disabled = true;
            newspaperSubmitBtn.textContent = 'Submitting...';
        }

        try {
            let fileUrl = 'None';
            if (file) {
                if (newspaperStatus) {
                    newspaperStatus.style.color = 'var(--primary)';
                    newspaperStatus.textContent = 'Uploading attached file...';
                }
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'super genius');

                const cloudRes = await fetch('https://api.cloudinary.com/v1_1/j4eh5zvd/auto/upload', {
                    method: 'POST',
                    body: formData
                });
                const cloudData = await cloudRes.json();
                if (cloudData.error) {
                    throw new Error('File upload failed: ' + cloudData.error.message);
                }
                fileUrl = cloudData.secure_url;
            }

            if (newspaperStatus) {
                newspaperStatus.style.color = 'var(--primary)';
                newspaperStatus.textContent = 'Transmitting article to publishing desk...';
            }

            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    service: 'Hartsbrook Post Article Submission',
                    author: name,
                    article: submission,
                    attachedFile: fileUrl,
                    _subject: `Hartsbrook Post Submission from ${name}`
                })
            });

            if (response.ok) {
                if (newspaperStatus) {
                    newspaperStatus.style.color = '#00ff88';
                    newspaperStatus.textContent = '✓ Article and file submitted successfully!';
                }
                newspaperForm.reset();
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Failed to submit article');
            }
        } catch (err) {
            console.error('Newspaper submission error:', err);
            if (newspaperStatus) {
                newspaperStatus.style.color = 'var(--secondary)';
                newspaperStatus.textContent = 'Error: ' + err.message;
            }
        } finally {
            if (newspaperSubmitBtn) {
                newspaperSubmitBtn.disabled = false;
                newspaperSubmitBtn.textContent = 'Submit Article';
            }
        }
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
