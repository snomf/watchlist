
import re
from playwright.sync_api import Page, expect

def verify(page: Page):
    page.goto("http://localhost:5173")

    # Click on the first movie card
    page.locator(".movie-card").first.click()

    # Check if the modal is visible
    expect(page.locator(".modal")).to_be_visible()

    # Take a screenshot of the modal
    page.screenshot(path="verification/modal_verification.png")
