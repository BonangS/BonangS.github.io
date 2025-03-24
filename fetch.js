document.addEventListener('DOMContentLoaded', function() {
    fetch('https://jsonplaceholder.typicode.com/posts')
        .then(response => response.json())
        .then(data => {
            const postsContainer = document.getElementById('posts-container');
            data.slice(0, 100).forEach(post => { 
                const postCard = document.createElement('div');
                postCard.classList.add('card');
                postCard.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.body}</p>
                    <p class="post-id">Post ID: ${post.id}</p>
                `;
                postsContainer.appendChild(postCard);
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
});
