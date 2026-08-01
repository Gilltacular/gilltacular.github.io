// utils.js — Shared utility functions for the blog system.
// Used by: article.js, index.js (future), carousel.js (future)


// =================================================
// NAMESPACE CREATION
// =================================================

window.BlogUtils = window.BlogUtils || {};

// =================================================
// URL FUNCTIONS
// =================================================
// Extract all query parameters from the current page URL.
//
// Example URL:
//   https://gilltacular.github.io/blog/article.html?slug=my-way-of-life
//
// Returns:
//   URLSearchParams object containing { slug: "my-way-of-life" }
//
// @returns {URLSearchParams} Query parameters from current URL

window.BlogUtils.getUrlParams = function() {
    const url = new URL(window.location.href);
    return new URLSearchParams(url.search);
};

// Extract the 'slug' query parameter from the URL.
//
// Example:
//   URL: /blog/article.html?slug=my-way-of-life
//   Returns: "my-way-of-life"
//
// If no parameter exists, return null.
//
// @returns {string|null} Slug value or null if not found

window.BlogUtils.getSlugFromUrl = function() {
    const params = BlogUtils.getUrlParams();
    return params.get('slug') || null;
};

// Format an ISO date string into a human-readable format.
//
// Example:
//   "2018-01-18" → "January 18, 2018"
//
// Uses the browser's built-in Intl.DateTimeFormat API.
//
// @param {string} isoDate - ISO 8601 date string (YYYY-MM-DD)
// @returns {string} Formatted date (Month DD, YYYY)

window.BlogUtils.formatDate = function(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// =================================================
// TEST SUITE (Development only - comment out before production deployment)
// =================================================

// Simple inline test framework for BlogUtils functions.
// 
// Run by opening browser console and calling: BlogUtils.runTests()
// 
// TODO: Move to separate test file for production deployment.

window.BlogUtils.runTests = function() {
    console.group('BlogUtils Test Suite');
    let passed = 0;
    let failed = 0;

    // Helper assertion function
    const assertEqual = (actual, expected, testName) => {
        if (actual === expected) {
            console.log(`${testName} = PASSED`);
            passed++;
        } else {
            console.error(`${testName} = FAILED`);
            console.error(`   Expected: ${expected}`);
            console.error(`   Actual: ${actual}`);
            failed++;
        }
    };

    const assertType = (value, type, testName) => {
        if (typeof value === type) {
            console.log(`${testName} = PASSED`);
            passed++;
        } else {
            console.error(`${testName} = FAILED`);
            console.error(`   Expected type: ${type}`);
            console.error(`   Actual type: ${typeof value}`);
            failed++;
        }
    };

    // ================================
    // NAMESPACE TESTS
    // ================================
    assertType(BlogUtils, 'object', 'BlogUtils namespace exists');
    assertType(BlogUtils.getUrlParams, 'function', 'getUrlParams is a function');
    assertType(BlogUtils.getSlugFromUrl, 'function', 'getSlugFromUrl is a function');
    assertType(BlogUtils.formatDate, 'function', 'formatDate is a function');

    // ================================
    // FORMAT DATE TESTS
    // ================================
    const testDateInput = '2018-01-18';
    const formattedDate = BlogUtils.formatDate(testDateInput);
    
    assertType(formattedDate, 'string', 'formatDate() returns a string');
    assertEqual(
        formattedDate.includes('January'),
        true,
        'formatDate("2018-01-18") includes "January"'
    );
    assertEqual(
        formattedDate.includes('2018'),
        true,
        'formatDate("2018-01-18") includes year'
    );
    
    // Test Determinism (same input = same output)
    const formattedDateAgain = BlogUtils.formatDate(testDateInput);
    assertEqual(
        formattedDate === formattedDateAgain,
        true,
        'formatDate() is deterministic (same input = same output)'
    );

    // Test Different date format
    const anotherDate = BlogUtils.formatDate('2014-10-19');
    assertEqual(
        anotherDate.includes('October') && anotherDate.includes('2014'),
        true,
        'formatDate("2014-10-19") formats correctly'
    );

    // ================================
    // SUMMARY
    // ================================
    console.log('Results:' + passed + ' passed, ' + failed + 'failed');
    console.groupEnd();

    if (failed === 0) {
        console.log('All tests passed!', 'color: green; font-weight: bold;');
    } else {
        console.log('Some tests failed. Check the logs above.', 'color: orange; font-weight: bold;');
    }
};

// Log instructions once on load
setTimeout(() => {
    if (typeof window !== 'undefined' && window.console) {
        console.log('Run tests with: BlogUtils.runTests()');
    }
}, 500);