
from typing import Any, Text, Dict, List, Optional
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import csv, os, re, math

# -----------------------
# Config-like constants
# -----------------------
ADDRESS_COLS = ["주소", "소재지", "도로명주소", "지번주소", "주소지", "시군구", "시도", "지역"]
NAME_COLS    = ["기관명", "시설명", "요양원명", "기관", "시설"]
PHONE_COLS   = ["전화번호", "연락처", "대표번호"]
PRICE_COLS   = ["이용요금", "요금", "월이용료", "월비용", "본인부담금", "수가", "1인당비용"]
BED_COLS     = ["병상수", "정원", "입소정원"]
GRADE_COLS   = ["등급", "평가등급"]

GENERIC_WORDS = {"알려줘","추천","검색","요양","요양원","시설","기관","가까운","근처","목록","리스트"}

REGION_TOKENS = [
    # 광역시/특별시/특별자치도
    "서울","부산","대구","인천","광주","대전","울산",
    "세종","경기","강원","강원특별자치도","충북","충남",
    "전북","전북특별자치도","전남","경북","경남","제주","제주특별자치도",
    # 주요 시/구 (샘플 확장)
    "수원","용인","고양","성남","부천","화성","남양주","안산","안양","평택","의정부",
    "춘천","강릉","원주","속초","동해",
    "청주","천안","아산",
    "전주","군산","익산",
    "여수","순천","목포",
    "포항","경주","구미",
    "창원","진주","김해",
]

def load_csv_rows(csv_path: Text) -> List[Dict[Text, Text]]:
    rows = []
    with open(csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append({(k or "").strip(): (v or "").strip() for k, v in r.items()})
    return rows

def tokenize_ko(text: Text) -> List[Text]:
    # extract 2+ length tokens (Korean, letters, digits)
    words = re.findall(r"[가-힣A-Za-z0-9]{2,}", text)
    # de-dup preserving order
    out = []
    for w in words:
        if w not in out:
            out.append(w)
    return out

def extract_locations(text: Text) -> List[Text]:
    found = []
    for loc in REGION_TOKENS:
        if loc in text and loc not in found:
            found.append(loc)
    return found

def parse_price_value(val: Text) -> Optional[float]:
    if not val:
        return None
    # pick first big number; treat 만/원 suffix
    v = val.replace(",", "")
    # handle "70~90만원" style: take first number
    m = re.search(r"(\d+(?:\.\d+)?)\s*(만|만원|원)?", v)
    if not m:
        return None
    num = float(m.group(1))
    unit = m.group(2) or ""
    if "만" in unit and "원" in unit:
        return num * 10000.0
    if unit.strip() == "원":
        return num
    # if no unit but number is small (< 1000), maybe "만원"
    if num < 1000:
        return num * 10000.0
    return num

def row_price(row: Dict[Text, Text]) -> Optional[float]:
    for col in PRICE_COLS:
        if col in row and row[col]:
            p = parse_price_value(row[col])
            if p is not None:
                return p
    return None

def get_text_by_cols(row: Dict[Text, Text], cols: List[Text]) -> Text:
    for c in cols:
        if c in row and row[c]:
            return row[c]
    return ""

def row_has_location(row: Dict[Text, Text], locations: List[Text]) -> bool:
    if not locations:
        return True
    hay = " | ".join([get_text_by_cols(row, ADDRESS_COLS), get_text_by_cols(row, NAME_COLS)])
    hay = hay or " ".join(str(v) for v in row.values())
    return any(loc in hay for loc in locations)

def score_row(row: Dict[Text, Text], keywords: List[Text], locations: List[Text]) -> int:
    score = 0
    hay = " | ".join([get_text_by_cols(row, ADDRESS_COLS), get_text_by_cols(row, NAME_COLS)])
    if not hay:
        hay = " ".join(str(v) for v in row.values())
    hay_low = hay.lower()
    for kw in keywords:
        if kw in GENERIC_WORDS:
            continue
        if kw.lower() in hay_low:
            score += 2
    # slight boost if location matches
    if row_has_location(row, locations) and locations:
        score += 3
    return score

def wants_cheapest(text: Text) -> bool:
    return any(k in text for k in ["저렴","싸","낮","가성비","싼"])

def wants_expensive(text: Text) -> bool:
    return any(k in text for k in ["비싸","높은 가격","프리미엄","고가"])

def wants_more_beds(text: Text) -> bool:
    return any(k in text for k in ["병상","정원","많은","큰 곳"])

def row_beds(row: Dict[Text, Text]) -> Optional[int]:
    for col in BED_COLS:
        if col in row and row[col]:
            m = re.search(r"\d+", row[col].replace(",", ""))
            if m:
                return int(m.group(0))
    return None

class ActionQueryCSV(Action):
    def name(self) -> Text:
        return "action_query_csv"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: Dict[Text, Any]):
        msg = (tracker.latest_message.get("text") or "").strip()
        if not msg:
            dispatcher.utter_message(text="검색어를 입력해 주세요. (예: '서울 요양원', '가장 저렴한 곳')")
            return []

        csv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "knowledge.csv"))
        try:
            rows = load_csv_rows(csv_path)
        except Exception as e:
            dispatcher.utter_message(text=f"CSV 로딩 오류: {e}")
            return []

        tokens = tokenize_ko(msg)
        locations = extract_locations(msg)
        # filter rows by location first (if provided)
        filtered = [r for r in rows if row_has_location(r, locations)]

        if not filtered:
            dispatcher.utter_message(text="해당 지역에서 결과가 없어요. 다른 지역명이나 키워드를 시도해 보세요.")
            return []

        # compute scores
        scored = []
        for r in filtered:
            scored.append((score_row(r, tokens, locations), r))
        # sort by score desc
        scored.sort(key=lambda x: x[0], reverse=True)
        sorted_rows = [r for s,r in scored if s > 0] or [r for s,r in scored]

        # apply intent-like sorting
        if wants_cheapest(msg) or wants_expensive(msg):
            rows_with_price = []
            for r in sorted_rows:
                p = row_price(r)
                rows_with_price.append((float('inf') if p is None else p, r))
            # ascending for cheapest, descending for expensive
            rows_with_price.sort(key=lambda x: x[0], reverse=not wants_cheapest(msg))
            sorted_rows = [r for p,r in rows_with_price]

        elif wants_more_beds(msg):
            tmp = []
            for r in sorted_rows:
                b = row_beds(r)
                tmp.append((-1 if b is None else -b, r))  # larger beds first
            tmp.sort(key=lambda x: x[0])
            sorted_rows = [r for _,r in tmp]

        # format top N
        out_lines = []
        for r in sorted_rows[:5]:
            name = get_text_by_cols(r, NAME_COLS) or (list(r.values())[0] if r else "")
            addr = get_text_by_cols(r, ADDRESS_COLS)
            phone = get_text_by_cols(r, PHONE_COLS)
            price = row_price(r)
            parts = []
            if name: parts.append(f"기관명: {name}")
            if addr: parts.append(f"주소: {addr}")
            if phone: parts.append(f"전화: {phone}")
            if price is not None: parts.append(f"예상 월비용: {int(price):,}원~")
            out_lines.append(" / ".join(parts) if parts else str(r)[:200])

        if not out_lines:
            dispatcher.utter_message(text="관련 결과를 찾지 못했어요. 키워드를 바꿔서 다시 시도해 주세요.")
        else:
            header = "요청하신 조건에 맞춰 정렬했어요." if (wants_cheapest(msg) or wants_expensive(msg) or wants_more_beds(msg) or locations) else "다음이 관련 결과예요:"
            dispatcher.utter_message(text=header + "\n- " + "\n- ".join(out_lines))

        return []
