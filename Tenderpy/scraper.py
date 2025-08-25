# from selenium import webdriver
# from selenium.webdriver.chrome.options import Options
# from bs4 import BeautifulSoup
# import mysql.connector
# from datetime import datetime
# import time
# def fetch_tenders():
#     options = Options()
#     options.add_argument("--headless")
#     driver = webdriver.Chrome(options=options)
    
#     driver.get("https://www.tendertiger.com/")
#     time.sleep(5)  # wait to ensure page content loads fully
    
#     soup = BeautifulSoup(driver.page_source, "html.parser")
#     driver.quit()
    
#     tenders = []
#     base_url = "https://www.tendertiger.com"
    
#     for li in soup.select("li.tender-listing"):
#         try:
#             div = li.select_one("div.twm-jobs-list-style1")
            
#             tid = div.select_one("b.value.theme-color").text.strip()
#             org = div.select_one("a.org-name").text.strip()
#             location = div.select_one("b.tender-listing-serial.value.theme-color").text.strip()
#             brief_tag = div.select_one("span.tenderbrif p a")
#             brief = brief_tag.text.strip()
#             detail_link = brief_tag["href"]
#             if not detail_link.startswith("http"):
#                 detail_link = base_url + detail_link
            
#             value = div.select("b.value.theme-color")[1].text.strip()
#             emd = div.select("b.value.theme-color")[2].text.strip()
#             due_date = div.select("b.value.theme-color")[3].text.strip()
            
#             print(f"Parsed tender: {tid}, {org}, {location}, due {due_date}")  # debug
            
#             tenders.append({
#                 "tid": tid,
#                 "organization": org,
#                 "location": location,
#                 "brief": brief,
#                 "value": value,
#                 "emd": emd,
#                 "due_date": due_date,
#                 "link": detail_link
#             })
#         except Exception as e:
#             print("Error parsing one tender:", e)
    
#     return tenders



# def save_to_mysql(tenders):
#     conn = mysql.connector.connect(
#     host="localhost",
#     user="root",
#     password="",
#     database="tendersdb",
#     charset='utf8mb4',
#     collation='utf8mb4_unicode_ci'
#     )



#     cursor = conn.cursor()
#     for t in tenders:
#         cursor.execute("SELECT id FROM tenders WHERE tid=%s", (t['tid'],))
#         if cursor.fetchone():
#             continue  # Skip duplicates
#         cursor.execute("""
#             INSERT INTO tenders (tid, organization, location, brief, value, emd, due_date, link)
#             VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
#         """, (
#             t['tid'], t['organization'], t['location'], t['brief'],
#             t['value'], t['emd'],
#             datetime.strptime(t['due_date'], "%d %B %Y").date(),
#             t['link']
#         ))
#     conn.commit()
#     cursor.close()
#     conn.close()


# if __name__ == "__main__":
#     tenders = fetch_tenders()
#     print(f"Fetched {len(tenders)} tenders.")
#     save_to_mysql(tenders)


from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import mysql.connector
from datetime import datetime

def is_valid_date(date_str):
    try:
        datetime.strptime(date_str, "%d %B %Y")
        return True
    except ValueError:
        return False


def fetch_tenders():
    options = Options()
    # options.add_argument("--headless")  # Uncomment for headless mode
    driver = webdriver.Chrome(options=options)

    driver.get("https://www.tendertiger.com/")

    WebDriverWait(driver, 15).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "li.tender-listing"))
    )

    soup = BeautifulSoup(driver.page_source, "html.parser")
    driver.quit()

    tenders = []

    for li in soup.select("li.tender-listing"):
        try:
            div = li.select_one("div.twm-jobs-list-style1")
            if not div:
                continue

            tid = div.select_one("b.value.theme-color").text.strip()
            org = div.select_one("a.org-name").text.strip()
            location = div.select_one("b.tender-listing-serial.value.theme-color").text.strip()
            brief_tag = div.select_one("span.tenderbrif p a")
            brief = brief_tag.text.strip() if brief_tag else ""
            detail_link = brief_tag["href"] if brief_tag and "href" in brief_tag.attrs else ""

            full_text = div.get_text(separator=" ").strip()

            # Initialize
            value = ""
            emd = ""
            due_date = ""

            # Extract values based on keywords
            if "Worth :" in full_text:
                try:
                    value = full_text.split("Worth :")[1].split("EMD :")[0].strip()
                except IndexError:
                    pass

            if "EMD :" in full_text:
                try:
                    emd = full_text.split("EMD :")[1].split("Due Date :")[0].strip()
                except IndexError:
                    pass

            if "Due Date :" in full_text:
                try:
                    due_date_raw = full_text.split("Due Date :")[1].strip()
                    # Format date to match backend
                    due_date_parts = due_date_raw.split(" ")[:3]
                    due_date = " ".join(due_date_parts)
                except IndexError:
                    pass

            tenders.append({
                "tid": tid,
                "organization": org,
                "location": location,
                "brief": brief,
                "value": value,
                "emd": emd,
                "due_date": due_date,
                "link": detail_link
            })

        except Exception as e:
            print("Error parsing one tender:", e)

    return tenders


def save_to_mysql(tenders):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="tendersdb",
        charset='utf8mb4',
        collation='utf8mb4_unicode_ci'
    )

    cursor = conn.cursor()
    for t in tenders:
        cursor.execute("SELECT id FROM tenders WHERE tid=%s", (t['tid'],))
        if cursor.fetchone():
            continue  # Skip duplicates

        due_date_obj = None
        if t['due_date'] and is_valid_date(t['due_date']):
            due_date_obj = datetime.strptime(t['due_date'], "%d %B %Y").date()
        else:
            if t['due_date']:
                print(f"Skipping invalid date '{t['due_date']}' for tender {t['tid']}")

        cursor.execute("""
            INSERT INTO tenders (tid, organization, location, brief, value, emd, due_date, link)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            t['tid'], t['organization'], t['location'], t['brief'],
            t['value'], t['emd'],
            due_date_obj,
            t['link']
        ))
    conn.commit()
    cursor.close()
    conn.close()



if __name__ == "__main__":
    tenders = fetch_tenders()
    print(f"Fetched {len(tenders)} tenders.")
    if tenders:
        save_to_mysql(tenders)
