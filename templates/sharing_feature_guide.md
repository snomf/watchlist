# Sharing Feature Implementation Guide

This guide explains how to implement a link sharing feature for a media modal using TMDB IDs, similar to the implementation in Marvel Marathon.

## Overview

The goal is to allow users to share a specific media item via a URL that includes the TMDB ID (e.g., `https://example.com/?tmdb_id=12345`). When a user visits this link, the application should automatically open the corresponding modal.

## Prerequisites

1.  **Media Data**: Your application must have a list of media items, each with a `tmdbId` property.
2.  **Modal System**: You need a function to open a modal based on an internal ID or the TMDB ID.

## Implementation Steps

### 1. Add Share Button to Modal (HTML)

Add a button to your modal's HTML structure.

```html
<button id="share-modal-btn" class="share-btn-class">
    <i class="fas fa-share-alt"></i> Share
</button>
```

### 2. Implement Sharing Logic (JavaScript)

Create a function to handle the sharing action. This function should:
1.  Construct the share URL with the `tmdb_id` query parameter.
2.  Use the Web Share API (`navigator.share`) on mobile devices.
3.  Fallback to the Clipboard API (`navigator.clipboard.writeText`) on desktop.

```javascript
async function handleShare(item) {
    const shareUrl = `${window.location.origin}/?tmdb_id=${item.tmdbId}`;
    const shareData = {
        title: `Check out ${item.title}`,
        text: `Check out ${item.title} on our site!`,
        url: shareUrl
    };

    // Check for mobile/Android to use native share sheet
    if (navigator.share && /Mobi|Android/i.test(navigator.userAgent)) {
        try {
            await navigator.share(shareData);
        } catch (err) {
            console.error('Error sharing:', err);
        }
    } else {
        // Desktop fallback: Copy to clipboard
        try {
            await navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!'); // Replace with a custom toast/popup
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }
}
```

### 3. Attach Event Listener

Attach the `handleShare` function to your share button when the modal opens.

```javascript
document.getElementById('share-modal-btn').addEventListener('click', () => {
    // Assuming 'currentItem' is the data object for the currently open modal
    if (currentItem) handleShare(currentItem);
});
```

### 4. Handle URL Parameters on Load

On page load, check for the `tmdb_id` query parameter and open the corresponding modal.

```javascript
document.addEventListener('DOMContentLoaded', () => {
    // ... your existing init code ...

    const urlParams = new URLSearchParams(window.location.search);
    const sharedTmdbId = urlParams.get('tmdb_id');

    if (sharedTmdbId) {
        // Find the item in your data by TMDB ID
        // Note: Ensure your data is loaded before running this!
        const item = allMediaItems.find(i => i.tmdbId == sharedTmdbId);
        
        if (item) {
            openModal(item.id); // Or whatever function opens your modal

            // Optional: Clean the URL to remove the query param without reloading
            const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
            window.history.pushState({path:newUrl},'',newUrl);
        }
    }
});
```

## Important Note on Link Previews (OG Tags)

For static client-side applications (SPA), the shared link will display the **default** website metadata (title, image, description) when shared on social media (Discord, iMessage, etc.).

To display dynamic previews (e.g., the specific movie poster and title), you must use **Server-Side Rendering (SSR)** or **Edge Middleware** (e.g., Vercel Edge Functions) to inject the `<meta property="og:..." content="...">` tags *before* the JavaScript runs. Bots do not execute JavaScript.
