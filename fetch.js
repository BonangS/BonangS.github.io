document.addEventListener('DOMContentLoaded', function() {
    const postsContainer = document.getElementById('posts-container');
    
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('cachedPosts', JSON.stringify(data)); 
            
            displayPosts(data); 
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            const cachedData = localStorage.getItem('cachedPosts');
            
            if (cachedData) {
                displayPosts(JSON.parse(cachedData)); 
            } else {
                postsContainer.innerHTML = '<p style="color:red;">Failed to load posts. Check your internet connection.</p>';
            }
        });

    function displayPosts(posts) {
        postsContainer.innerHTML = ''; 
        posts.slice(0, 100).forEach(post => { 
            const postCard = document.createElement('div');
            postCard.classList.add('card');
            postCard.innerHTML = `
                <h3>${post.title}</h3>
                <p>${post.body}</p>
                <p class="post-id">Post ID: ${post.id}</p>
            `;
            postsContainer.appendChild(postCard);
        });
    }
});
