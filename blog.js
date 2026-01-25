// CAT Blog - Markdown Blog System
// Simple markdown parser and blog post loader

const Blog = {
    // Post registry - add new posts here
    posts: [
        'posts/2026-01-10-welcome.md',
        'posts/2026-01-05-updates.md'
    ],

    // Parse frontmatter from markdown file
    parseFrontmatter(content) {
        const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
        const match = content.match(frontmatterRegex);

        if (!match) {
            return { metadata: {}, body: content };
        }

        const frontmatter = match[1];
        const body = match[2];
        const metadata = {};

        frontmatter.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > -1) {
                const key = line.slice(0, colonIndex).trim();
                const value = line.slice(colonIndex + 1).trim();
                metadata[key] = value;
            }
        });

        return { metadata, body };
    },

    // Simple markdown to HTML converter
    parseMarkdown(markdown) {
        let html = markdown;

        // Escape HTML entities first (except for links we'll process)
        html = html.replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;');

        // Headers
        html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

        // Bold and italic
        html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
        html = html.replace(/___(.*?)___/g, '<strong><em>$1</em></strong>');
        html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
        html = html.replace(/_(.*?)_/g, '<em>$1</em>');

        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

        // Images
        html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');

        // Code blocks
        html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>');

        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

        // Blockquotes
        html = html.replace(/^&gt; (.*$)/gm, '<blockquote>$1</blockquote>');

        // Unordered lists
        html = html.replace(/^\* (.*$)/gm, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

        // Ordered lists
        html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');

        // Horizontal rule
        html = html.replace(/^---$/gm, '<hr>');

        // Paragraphs - wrap text blocks
        html = html.split('\n\n').map(block => {
            block = block.trim();
            if (!block) return '';
            // Don't wrap if already wrapped in block-level element
            if (block.startsWith('<h') ||
                block.startsWith('<ul') ||
                block.startsWith('<ol') ||
                block.startsWith('<blockquote') ||
                block.startsWith('<pre') ||
                block.startsWith('<hr')) {
                return block;
            }
            return `<p>${block.replace(/\n/g, '<br>')}</p>`;
        }).join('\n');

        return html;
    },

    // Format date for display
    formatDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    },

    // Get slug from filename
    getSlug(filepath) {
        const filename = filepath.split('/').pop();
        return filename.replace('.md', '');
    },

    // Load all posts for index page
    async loadPostList() {
        const postsContainer = document.querySelector('.blog-posts');
        if (!postsContainer) return;

        const loadedPosts = [];

        for (const postPath of this.posts) {
            try {
                const response = await fetch(postPath);
                if (!response.ok) continue;

                const content = await response.text();
                const { metadata } = this.parseFrontmatter(content);

                loadedPosts.push({
                    ...metadata,
                    slug: this.getSlug(postPath),
                    path: postPath
                });
            } catch (error) {
                console.error(`Error loading post: ${postPath}`, error);
            }
        }

        // Sort posts by date (newest first)
        loadedPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Render post cards
        postsContainer.innerHTML = loadedPosts.map(post => `
            <article class="post-card">
                <div class="post-meta">
                    <time datetime="${post.date}">${this.formatDate(post.date)}</time>
                </div>
                <h2>${post.title}</h2>
                <p>${post.excerpt}</p>
                <a href="post.html?slug=${post.slug}" class="read-more">Read more →</a>
            </article>
        `).join('');
    },

    // Load a single post for post page
    async loadSinglePost() {
        const postContent = document.querySelector('.post-content');
        const postTitle = document.querySelector('.post-full h1');
        const postMeta = document.querySelector('.post-meta time');

        if (!postContent) return;

        // Get slug from URL
        const params = new URLSearchParams(window.location.search);
        const slug = params.get('slug');

        if (!slug) {
            postContent.innerHTML = '<p>Post not found.</p>';
            return;
        }

        // Find the post file
        const postPath = this.posts.find(p => this.getSlug(p) === slug);

        if (!postPath) {
            postContent.innerHTML = '<p>Post not found.</p>';
            return;
        }

        try {
            const response = await fetch(postPath);
            if (!response.ok) throw new Error('Post not found');

            const content = await response.text();
            const { metadata, body } = this.parseFrontmatter(content);

            // Update page
            if (postTitle) postTitle.textContent = metadata.title;
            if (postMeta) {
                postMeta.setAttribute('datetime', metadata.date);
                postMeta.textContent = this.formatDate(metadata.date);
            }
            document.title = `${metadata.title} - CAT Research Blog`;

            postContent.innerHTML = this.parseMarkdown(body);
        } catch (error) {
            console.error('Error loading post:', error);
            postContent.innerHTML = '<p>Error loading post.</p>';
        }
    }
};

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.blog-posts')) {
        Blog.loadPostList();
    } else if (document.querySelector('.post-content')) {
        Blog.loadSinglePost();
    }
});
