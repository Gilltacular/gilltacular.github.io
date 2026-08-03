/** 
 * index.js - Blog listing page renderer
 * 
 * Namespace: window.BlogList
 * Depends on: BlogUtils (utils.js)
 * 
 * Flow: init() > fetchAllPosts() > paginate() > renderCards() + renderPagination()
 * 
 */

// =============================================================================
// NAMESPACE CREATION
// =============================================================================

window.BlogList = window.BlogList || {};

// =============================================================================
// CONSTANTS
// =============================================================================

const POSTS_PER_PAGE = 12;
const POSTS_JSON_PATH = 'data/posts.json';

// =============================================================================
// DATA FETCH
// =============================================================================

/**
 * Fetch all posts from posts.json
 * @returns {Promise<Array>} - Sorted array of posts (objects) by newest first
 */

window.BlogList.fetchAllPosts = async function() {
    const response = await fetch(POSTS_JSON_PATH);

    if (!response.ok) {
        throw new Error('Failed to load posts.json: ' + response.status);
    }

    return await response.json();
};


/**
 * Fetch all posts from posts.json
 * @param {Array} - full array of posts
 * @param {number} - page number (0-index)
 * @returns {Array} - Slice of posts for current page (12 posts per page)
 */

window.BlogList.paginate = function(posts, pageNumber) {
    const start = pageNumber * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    return posts.slice(start, end);
};

/**
 * Generate HTML for a single article card.
 * @param {Object} - post object from posts.json
 * @returns {string} - HTML string for the card
 */

window.BlogList.renderCard = function(post) {
    const formattedDate = BlogUtils.formatDate(post.date);

    return '<article class="card">' +
        '<img src="' + post.thumbnail + '" alt="" class="card-thumbnail">' +
        '<h3 class="card-title">' + post.title + '</h3>' +
        '<div class="card-meta">' +
        '<time>' + formattedDate + '</time> • ' +
        '<span class="reading-time">' + post.readingTime + ' min read</span>' +
        '</div>' +
        '<a href="article.html?slug=' + post.slug + '" class="card-link">Read article →</a>' +
        '</article>';
};

/**
 * Generate HTML for all cards on a page
 * @param {Array} - array of posts (objects)
 * @param {number} - current page number
 * @returns {string} - HTML string for all cards
 */

window.BlogList.renderCards = function(posts, pageNumber) {
    if (posts.length === 0) {
        return '<p class="no-posts">No articles found.</p>';
    }

    const cardsHTML = posts.map(function(post) {
        return BlogList.renderCard(post);
    }).join('');

    return '<div class="card-grid">' + cardsHTML + '</div>';
};

/**
 * Get total number of pages needed for all posts
 * @param {number} - Total number of posts
 * @returns {number} - Number of pages (round up)
 */

window.BlogList.getTotalPages = function(totalPosts) {
    return Math.ceil(totalPosts / POSTS_PER_PAGE);
};

window.BlogList.renderPagination = function(totalPages, currentPage) {
    if (totalPages <= 1) {
        return '';
    }

    const prevDisabled = currentPage === 0 ? 'disabled' : '';
    const nextDisabled = currentPage === totalPages -1 ? 'disabled' : '';

    return '<nav class="pagination">' +
        '<button class="pagination-btn prev" onclick="BlogList.handlePageChange(' + (currentPage - 1) + ')" ' + prevDisabled + '>Previous</button>' +
        '<span class="pagination-info">Page ' + (currentPage + 1) + ' of ' + totalPages + '</span>' +
        '<button class="pagination-btn next" onclick="BlogList.handlePageChange(' + (currentPage + 1) + ')" ' + nextDisabled + '>Next</button>' +
        '</nav>';
};

/**
 * Handle page change with update and re-render
 * @param {number} - Target page number : newPage
 */

window.BlogList.handlePageChange = function(newPage) {
    // Update URL (page parameter)
    const url = new URL(window.location.href);
    url.searchParams.set('page', newPage.toString());
    window.history.pushState({}, '', url);

    // Scroll to top
    window.scrollTo(0, 0);

    // Render new page (URL change)
    window.BlogList.init();
};

// ==============================================================================
// MAIN EXECUTION FLOW
// ==============================================================================

/**
 * Initialize the blog listing page
 */

window.BlogList.init = async function() {
    try {
        const allPosts = await BlogList.fetchAllPosts();
        const totalPages = BlogList.getTotalPages(allPosts.length);

        let currentPage = BlogUtils.getUrlParams().get('page');
        currentPage = currentPage ? parseInt(currentPage, 10) : 0;

        if (isNaN(currentPage) || currentPage < 0 || currentPage >= totalPages) {
            currentPage = 0;
        }

        const pagePosts = BlogList.paginate(allPosts, currentPage);
        const cardsHTML = BlogList.renderCards(pagePosts, currentPage);
        const paginationHTML = BlogList.renderPagination(totalPages, currentPage);

        document.getElementById('article-grid').innerHTML = cardsHTML;
        document.getElementById('pagination').innerHTML = paginationHTML;
    } catch (error) {
        console.error('[BlogList] Failed to initialize:', error);
        document.getElementById('article-grid').innerHTML = '<p class="error-message">Failed to load articles, Please try again later.</p>';
    }
};

// Run init() when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('[BlogList] DOM loaded, initializing...');
    BlogList.init();
});