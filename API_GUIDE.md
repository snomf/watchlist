# Watchlist Status-Only API Guide

A lightweight, "dumb" global status store for tracking watch intent. This API belongs to `w.juainny.com` and is designed to share watch status across multiple applications using TMDB IDs.

## Core Principles
- **Identifier-only**: Uses `tmdb_id` (optionally with `season` and `episode`).
- **No Metadata**: The API does not store titles, posters, or summaries.
- **No Auth**: Publicly accessible. Designed for speed and predictability.
- **Idempotent**: Setting the same status multiple times has no side effects.

---

## Endpoint: Get Status
Retrieves the watch status for a specific item.

**URL:** `GET /api/status`

### Parameters
| Name | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `tmdb_id` | **Yes** | - | The TMDB ID of the media item. |
| `season` | No | `0` | Season number (use `0` for movies or show-level). |
| `episode` | No | `0` | Episode number (use `0` for movies or season-level). |

### Responses
- **200 OK**: Item found or record doesn't exist (returns `unknown`).
- **400 Bad Request**: Missing `tmdb_id`.

---

## Endpoint: Set Status
Creates or updates the watch status for an item.

**URL:** `POST /api/status`

### Request Body (JSON)
| Field | Required | Default | Description |
| :--- | :--- | :--- | :--- |
| `tmdb_id` | **Yes** | - | The TMDB ID of the media item. |
| `status` | **Yes** | - | `want_to_watch`, `watching`, or `watched`. |
| `season` | No | `0` | Season number. |
| `episode` | No | `0` | Episode number. |

### Responses
- **200 OK**: Status successfully updated.
- **400 Bad Request**: Missing fields or invalid status value.

---

## Allowed Status Values
- `unknown` (Returned only on GET if no record exists)
- `want_to_watch`
- `watching`
- `watched`

---

## Usage Examples

### 1. Movie (Fight Club)
**Request:** `GET https://w.juainny.com/api/status?tmdb_id=550`
**Response:**
```json
{
  "tmdb_id": 550,
  "season": 0,
  "episode": 0,
  "status": "watched"
}
```

### 2. TV Show (Breaking Bad) - Show Level
**Request:** `POST https://w.juainny.com/api/status`
```json
{
  "tmdb_id": 1396,
  "status": "watching"
}
```

### 3. TV Show - Specific Episode
**Request:** `GET https://w.juainny.com/api/status?tmdb_id=1396&season=1&episode=1`
**Response:**
```json
{
  "tmdb_id": 1396,
  "season": 1,
  "episode": 1,
  "status": "watched"
}
```

---

## Integration Tips
- **CORS**: This API has CORS enabled for all origins (`*`). You can call it directly from browser-side JavaScript (fetch/axios).
- **Movies vs TV**: For movies, you can ignore the `season` and `episode` parameters entirely.
- **Consistency**: Use the same `tmdb_id` across your apps to ensure they all see the same watch intent.
