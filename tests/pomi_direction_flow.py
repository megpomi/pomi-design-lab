# Playwright body (for browser_automation tool): full per-direction flow for Pomi showcase
import datetime
await page.set_viewport_size({"width": 1920, "height": 1080})
errs = []
page.on("pageerror", lambda e: errs.append(str(e)))
BASE = "https://pomi-design-lab--1dole0sy.preview.emergentagent.com"
today = datetime.date.today()
tiso = today.isoformat()
y3 = (today - datetime.timedelta(days=3)).isoformat()
d10 = (today - datetime.timedelta(days=10)).isoformat()
res = {}
def ok(k, v):
    res[k] = v
    print(("PASS " if v else "FAIL ") + k)
await page.goto(BASE + "/")
await page.evaluate("localStorage.clear()")
for did, p in [("almanac", "alm"), ("ledger", "led"), ("bloom", "blm")]:
    try:
        await page.goto(f"{BASE}/direction/{did}")
        await page.wait_for_selector(f'[data-testid="phone-{did}"]', timeout=10000)
        t = lambda s: page.locator(f'[data-testid="{p}-{s}"]')
        ok(f"{did} starts welcome", await t("welcome-step-0").count() == 1)
        # rationale sections
        for s in ["mood", "palette", "typography", "components", "screens", "premium", "different"]:
            if await page.locator(f'[data-testid="rationale-panel-{did}"] [data-testid="rationale-{s}"]').count() != 1:
                ok(f"{did} rationale-{s}", False)
        # screen jumper
        for s in ["home", "cycle", "log", "insights", "settings", "welcome"]:
            await page.click(f'[data-testid="screen-jump-{s}"]'); await page.wait_for_timeout(250)
            want = f"{p}-welcome-step-0" if s == "welcome" else f"{p}-{s}"
            if await page.locator(f'[data-testid="{want}"]').count() != 1:
                ok(f"{did} jump {s}", False)
        await page.click('[data-testid="rationale-screen-insights"]'); await page.wait_for_timeout(300)
        ok(f"{did} rationale-screen switch", await t("insights").count() == 1)
        avg = (await t("insights-avg").inner_text()).strip()
        print(did, "avg:", avg)
        # onboarding
        await page.click('[data-testid="screen-jump-welcome"]'); await page.wait_for_timeout(300)
        await t("welcome-begin").click(); await page.wait_for_timeout(300)
        ok(f"{did} step1", await t("welcome-step-1").count() == 1)
        await t(f"onboard-day-{d10}").click()
        print(did, "selected:", await t("onboard-selected-date").inner_text())
        await t("onboard-next").click(); await page.wait_for_timeout(300)
        l0 = int((await t("onboard-length").inner_text()).strip())
        await t("onboard-plus").click(); await t("onboard-plus").click(); await t("onboard-minus").click()
        l1 = int((await t("onboard-length").inner_text()).strip())
        ok(f"{did} length +1 ({l0}->{l1})", l1 == l0 + 1)
        await t("onboard-finish").click(); await page.wait_for_timeout(400)
        cd = (await t("home-cycle-day").inner_text()).strip()
        print(did, "home cycle day:", repr(cd))
        ok(f"{did} home day 11", "11" in cd)
        # tabs
        for s in ["cycle", "log", "insights", "settings", "home"]:
            await t(f"tab-{s}").click(); await page.wait_for_timeout(250)
            if await t(s).count() != 1:
                ok(f"{did} tab {s}", False)
        # logging today
        await t("tab-log").click(); await page.wait_for_timeout(300)
        await t(f"log-date-{tiso}").click()
        await t("log-flow-medium").click(); await t("log-mood-calm").click()
        await t("log-symptom-cramps").click(); await t("log-energy-low").click()
        await t("log-note").fill("TEST_note " + did)
        await t("log-save").click(); await page.wait_for_timeout(300)
        ok(f"{did} saved msg", await t("log-saved").count() == 1)
        await t("tab-home").click(); await page.wait_for_timeout(300)
        te = await t("home-today-entry").inner_text()
        ok(f"{did} home today entry", "TEST_note" in te or "Medium" in te)
        print(did, "today entry:", te.replace("\n", " | ")[:160])
        await t("tab-cycle").click(); await page.wait_for_timeout(300)
        ok(f"{did} cal logged today", await t(f"cal-logged-{tiso}").count() == 1)
        # cycle nav + select + write
        await t(f"cal-day-{y3}").click(); await page.wait_for_timeout(200)
        sel = await t("cycle-selected").inner_text()
        print(did, "selected panel:", sel.replace("\n", " | ")[:120])
        await t("cycle-write").click(); await page.wait_for_timeout(300)
        ok(f"{did} cycle-write opens log", await t("log").count() == 1)
        hdr = await t("log").inner_text()
        print(did, "log header:", hdr[:120].replace("\n", " | "))
        await t("tab-cycle").click(); await page.wait_for_timeout(300)
        h0 = await t("cycle").inner_text()
        await t("cycle-prev").click(); await page.wait_for_timeout(200)
        h1 = await t("cycle").inner_text()
        await t("cycle-next").click(); await t("cycle-next").click(); await page.wait_for_timeout(200)
        h2 = await t("cycle").inner_text()
        ok(f"{did} month nav", h0[:80] != h1[:80] and h2[:80] != h0[:80])
        # reload persistence
        await page.reload(); await page.wait_for_selector(f'[data-testid="phone-{did}"]')
        await page.click('[data-testid="screen-jump-home"]'); await page.wait_for_timeout(300)
        ok(f"{did} persists after reload", "TEST_note" in await t("home-today-entry").inner_text())
        ok(f"{did} profile persists", "11" in await t("home-cycle-day").inner_text())
        # settings
        await t("tab-settings").click(); await page.wait_for_timeout(300)
        for k in ["reminders", "discreet", "lock"]:
            await t(f"setting-{k}").click()
        prefs = await page.evaluate(f"JSON.parse(localStorage.getItem('pomi-concept:{did}')).prefs")
        ok(f"{did} toggles {prefs}", prefs == {"reminders": False, "discreet": False, "lock": True})
        await t("settings-export").click(); await page.wait_for_timeout(200)
        ok(f"{did} export note", await t("settings-export-note").count() == 1)
        await t("settings-delete").click(); await page.wait_for_timeout(200)
        await t("settings-delete-confirm").click(); await page.wait_for_timeout(300)
        n = await page.evaluate(f"Object.keys(JSON.parse(localStorage.getItem('pomi-concept:{did}')).log).length")
        ok(f"{did} delete clears ({n})", n == 0)
        await t("settings-reset").click(); await page.wait_for_timeout(300)
        n = await page.evaluate(f"Object.keys(JSON.parse(localStorage.getItem('pomi-concept:{did}')).log).length")
        ok(f"{did} reset restores ({n})", n == 10)
        # log again to test page-level reset
        await page.click('[data-testid="reset-sample-data"]'); await page.wait_for_timeout(400)
        ok(f"{did} page reset -> welcome", await t("welcome-step-0").count() == 1)
    except Exception as e:
        print("ERR", did, str(e)[:300])
# separation check
keys = await page.evaluate("Object.keys(localStorage).filter(k=>k.startsWith('pomi-concept'))")
print("keys", keys)
print("pageerrors", errs)
print("FAILS:", [k for k, v in res.items() if not v])
