from playwright.sync_api import sync_playwright
import time
BASE="http://localhost:3000/preview"
shots=[
  ("", "01-overview-dark"),
  ("?theme=light", "02-overview-light"),
  ("?view=themes", "03-themes-editors-dark"),
  ("?view=themes&cat=browser", "04-themes-browser-dark"),
  ("?view=themes&cat=shell&theme=light", "05-themes-shell-light"),
]
with sync_playwright() as p:
    b=p.firefox.launch(headless=True)
    pg=b.new_page(viewport={"width":1280,"height":1800})
    for q,name in shots:
        pg.goto(BASE+q, wait_until="networkidle", timeout=45000)
        time.sleep(1.2)
        pg.screenshot(path=f"outputs/themes-redesign/shots/{name}.png")
        print("shot", name)
    b.close()
print("DONE")
