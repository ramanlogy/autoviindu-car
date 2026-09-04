#!/usr/bin/env python3
"""Search Wikimedia Commons for images and print direct file URLs.
Usage: commons_search.py "<query>" [limit]
"""
import sys, json, time, urllib.request, urllib.parse, urllib.error

UA = "AutoviinduCarImageSourcing/1.0 (https://autoviindu.example; contact: khatiwadaajeevan@gmail.com) python-urllib"

def fetch_json(url, retries=5):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    delay = 4
    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < retries - 1:
                time.sleep(delay)
                delay *= 2
                continue
            raise

def main():
    query = sys.argv[1]
    limit = int(sys.argv[2]) if len(sys.argv) > 2 else 12
    api = "https://commons.wikimedia.org/w/api.php"
    params = {
        "action": "query", "list": "search", "srsearch": query,
        "srnamespace": "6", "srlimit": str(limit), "format": "json"
    }
    url = api + "?" + urllib.parse.urlencode(params)
    data = fetch_json(url)
    titles = [item["title"] for item in data.get("query", {}).get("search", [])]
    if not titles:
        return
    time.sleep(1.5)
    # Fetch imageinfo for direct URLs
    params2 = {
        "action": "query", "titles": "|".join(titles), "prop": "imageinfo",
        "iiprop": "url|size|mime", "iiurlwidth": "1600", "format": "json"
    }
    url2 = api + "?" + urllib.parse.urlencode(params2)
    data2 = fetch_json(url2)
    pages = data2.get("query", {}).get("pages", {})
    for pid, page in pages.items():
        title = page.get("title", "")
        infos = page.get("imageinfo", [])
        if not infos:
            continue
        info = infos[0]
        u = info.get("thumburl") or info.get("url")
        mime = info.get("mime", "")
        if not u or "image" not in mime:
            continue
        print(f"{u}\t{title}")

if __name__ == "__main__":
    main()
