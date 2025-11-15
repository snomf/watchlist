# Supabase Setup Instructions

Follow these steps to create your own Supabase project and connect it to your new watchlist website.

## 1. Create a Supabase Account

If you don't already have one, go to [supabase.com](https://supabase.com) and sign up for a free account.

## 2. Create a New Project

Once you're logged in, create a new project. Give it a name (e.g., "My Watchlist") and a strong password. You can choose the free plan for this project.

## 3. Create the `media` Table

After your project is created, go to the "Table Editor" in the Supabase dashboard. Create a new table named `media` with the following columns:

| Column Name      | Type        | Default Value | Is Nullable |
| ---------------- | ----------- | ------------- | ----------- |
| `id`             | `int8`      | (none)        | No          |
| `created_at`     | `timestamptz` | `now()`       | No          |
| `title`          | `text`      | (none)        | No          |
| `type`           | `text`      | (none)        | No          |
| `watched`        | `bool`      | `false`       | No          |
| `want_to_watch`  | `bool`      | `false`       | No          |
| `user_ratings`   | `jsonb`     | `{}`          | Yes         |
| `tmdb_id`        | `int8`      | (none)        | Yes         |
| `imdb_id`        | `text`      | (none)        | Yes         |
| `overview`       | `text`      | (none)        | Yes         |
| `poster_path`    | `text`      | (none)        | Yes         |
| `backdrop_path`  | `text`      | (none)        | Yes         |
| `release_year`   | `int4`      | (none)        | Yes         |
| `runtime`        | `int4`      | (none)        | Yes         |
| `content_rating` | `text`      | (none)        | Yes         |

**Note:** Make sure to set `id` as the primary key.

## 4. Get Your Project URL and Anon Key

Go to "Project Settings" > "API". You will find your "Project URL" and your "Project API Keys". You will need the `anon` key.

Keep these safe, as you will need them to connect your website to your new Supabase database.
