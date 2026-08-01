/**
 * article.js - Article Page render functions
 * 
 * NamespaceL window.ArticleRenderer
 * Depends on: BlogUtils (utils.js)
 * 
 * Flow: init() -> fetch slug -> fetchData() -> injectArticleData()
 */

// ================================================================
// NAMESPACE CREATION
// ================================================================

window.ArticleRenderer = window.ArticleRenderer || {};

// ================================================================
// CONSTANTS
// ================================================================

const POSTS_JSON_PATH = 'data/posts.json';
const CONTENT_DIR = 'data/content/';
const CONTENT_EXT = '.html';

// ================================================================
// DATA FETCHING
// ================================================================

/**
 * Fetch article metadata from posts.json by slug.
 * @param {string} slug - Article slug from URL
 * @returns {Promise<Object>} Article metadata object
 */

window.ArticleRenderer.fetchMetadata = async function(slug) {
    const response = await fetch(POSTS_JSON_PATH);

    if (!response.ok) {
        throw new Error('Failed to load posts.json: ' + response.status);
    }

    const allPosts = await response.json();
    const article = allPosts.find(function(post) {
        return post.slug === slug;
    });

    if(!article) {
        throw new Error('Article not found: ' + slug);
    }

    return article;
};

/**
 * Fetch article HTML by slug
 * @param {string} slug - Article slug from URL
 * @returns {Promise<string>} Raw HTML content
 */

window.ArticleRenderer.fetchContent = async function(slug) {
    const response = await fetch(CONTENT_DIR + slug + CONTENT_EXT);

    if (!response.ok) {
        throw new Error('Fail to load content: ' + response.status);
    }

    return await response.text();
};

/**
 * Fetch both metadata and content simultaneously.
 * @param {string} slug - Article slug from URL
 * @returns {Promise<{metadata: Object, content: string}>}
 */

window.ArticleRenderer.fetchData = async function (slug) {
    const results = await Promise.all([
        ArticleRenderer.fetchMetadata(slug),
        ArticleRenderer.fetchContent(slug)
    ]);

    return {
        metadata: results[0],
        content: results[1]
    };
};

// =================================================
// DOM INJECTION
// =================================================

/**
 * Inject article data into the page DOM.
 * @param {{metadata: Object, content: string}} data - Article data
 */

window.ArticleRenderer.injectArticleData = function(data) {
    const { metadata, content } = data;

    document.getElementById('article-title').textContent = metadata.title;
    document.getElementById('article-date').textContent = BlogUtils.formatDate(metadata.date);
    document.getElementById('article-reading-time').textContent = metadata.readingTime;
    document.getElementById('article-content').innerHTML = content;

    document.title = metadata.title + ' — Gilltacular Blog';

    const loadingMessage = document.querySelector('.loading-message');
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }
};

/**
 * Replace article root with 404 error message.
 * @param {string} slug - The slug that was not found
 */

window.ArticleRenderer.showNotFound = function(slug) {
    const root = document.getElementById('article-root');

    root.innerHTML =
        '<div class="not-found-message">' +
        '<h1>404</h1>' +
        '<p>Article not found' + (slug ? ': ' + slug : '') + '</p>' +
        '<a href="index.html">← Back to Blog</a>' +
        '</div>';

    document.title = '404 - Article Not Found';
};

// =================================================
// MAIN EXECUTION FLOW
// =================================================

/**
 * Initialize the article page.
 * render flow when the page loads.
 */

window.ArticleRenderer.init = async function() {
    const slug = BlogUtils.getSlugFromUrl();

    if (!slug) {
        console.warn('No slug found in URL, redirecting to blog listing');
        window.location.href = 'index.html';
        return;
    }

    try {
        const loadingSpinner = document.querySelector('.loading-message');
        if (loadingSpinner) {
            console.log('[ArticleRenderer] Fetching article:', slug);
        }

        const data = await ArticleRenderer.fetchData(slug);
        ArticleRenderer.injectArticleData(data);

        if (loadingSpinner) {
            console.log('[ArticleRenderer] Article loaded successfully:', slug);
        }

    } catch (error) {
        console.error('[ArticleRenderer] Failed to load article:', error);
        ArticleRenderer.showNotFound(slug);
    }
};

// Run init() when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('[ArticleRenderer] DOM loaded, initializing...');
    ArticleRenderer.init();
});