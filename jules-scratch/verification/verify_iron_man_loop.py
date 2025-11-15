from playwright.sync_api import sync_playwright, expect

def run_verification():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:5173/")

        # Wait for the loading spinner to disappear
        loading_spinner = page.locator('#loading-spinner')
        expect(loading_spinner).to_be_hidden(timeout=60000)

        try:
            # Click the "All" filter to ensure all movies are visible
            page.locator('#filter-controls button[data-filter="all"]').click()

            # Find and click the "Avengers: Endgame" card
            endgame_card = page.locator('img[alt="Avengers: Endgame"]').locator("..")
            endgame_card.click(timeout=60000)

            # Wait for the movie details modal to open
            movie_modal = page.locator('#movie-modal')
            expect(movie_modal).not_to_have_class("modal-hidden")

            # Wait for the movie details modal to open
            movie_modal_content = page.locator('.movie-modal-content')
            expect(movie_modal_content).to_be_visible()

            # Wait for the flash animation to finish
            page.wait_for_timeout(4000)

            # Check for the iron man walker and the walk class
            iron_man_walker = page.locator('#iron-man-walker')
            expect(iron_man_walker).to_be_visible()
            expect(page.locator('#iron-man-walker.walk')).to_be_visible()

            # Take a screenshot of the modal
            page.screenshot(path="jules-scratch/verification/iron_man_loop_start.png")

            # Wait for the animation to loop (it's a 10s animation)
            page.wait_for_timeout(11000)

            # Take another screenshot to show it's still there
            page.screenshot(path="jules-scratch/verification/iron_man_loop_end.png")

        finally:
            browser.close()

if __name__ == "__main__":
    run_verification()
