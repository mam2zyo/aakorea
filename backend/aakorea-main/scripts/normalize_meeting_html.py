#!/usr/bin/env python3

import argparse
import html
import json
import re
from pathlib import Path


HTML_COMMENT_PATTERN = re.compile(r"<!--.*?-->", re.S)
AREA_SECTION_PATTERN = re.compile(
    r'<div id="area[^"]*" class="boxtable">(.*?)(?=<div id="area[^"]*" class="boxtable">|\Z)',
    re.S | re.I,
)
AREA_NAME_PATTERN = re.compile(r'<div class="areaname">(.*?)</div>', re.S | re.I)
TBODY_PATTERN = re.compile(r"<tbody>(.*?)</tbody>", re.S | re.I)
ROW_FRAGMENT_PATTERN = re.compile(r"<!--\s*(<tr\b.*?</tr>)\s*-->|(<tr\b.*?</tr>)", re.S | re.I)
TD_PATTERN = re.compile(r"<td\b[^>]*>(.*?)(?=</td>|<td\b|</tr>|<tr\b|</tbody>)", re.S | re.I)
TAG_PATTERN = re.compile(r"<[^>]+>")
PHONE_PATTERN = re.compile(r"01\d-\d{3,4}-\d{4}")
NOTE_PATTERN = re.compile(r"\(([^)]*)\)|\[([^\]]*)\]")
SPECIAL_NOTICE_PATTERN = re.compile(r"매월|격주|첫째|둘째|셋째|넷째|1째|2째|3째|4째", re.I)
NUMBER_TOKEN_PATTERN = re.compile(r"\d+(?:-\d+)?")
ROAD_TOKEN_PATTERN = re.compile(r".*(?:로|길|대로|번길)$")
ADDRESS_CONTEXT_PATTERN = re.compile(r".*(?:시|군|구|읍|면|동|리|가)$")

DAY_OF_WEEK_BY_KOREAN = {
    "월": "MONDAY",
    "화": "TUESDAY",
    "수": "WEDNESDAY",
    "목": "THURSDAY",
    "금": "FRIDAY",
    "토": "SATURDAY",
    "일": "SUNDAY",
}
DAY_ORDER = {
    "MONDAY": 1,
    "TUESDAY": 2,
    "WEDNESDAY": 3,
    "THURSDAY": 4,
    "FRIDAY": 5,
    "SATURDAY": 6,
    "SUNDAY": 7,
}
DAY_LABELS = {
    "MONDAY": "월요일",
    "TUESDAY": "화요일",
    "WEDNESDAY": "수요일",
    "THURSDAY": "목요일",
    "FRIDAY": "금요일",
    "SATURDAY": "토요일",
    "SUNDAY": "일요일",
}
TYPE_BY_SYMBOL = {"○": "OPEN", "●": "CLOSED", "◐": "NOTFIXED"}

INCHEON_ALLIANCE_LOCALITIES = {
    "인천",
    "부천시",
    "부천",
    "시흥시",
    "시흥",
    "강화군",
    "강화",
}
CAPITAL_WEST_LOCALITIES = {
    "강서구",
    "마포구",
    "영등포구",
    "은평구",
    "용산구",
    "종로구",
    "중구",
    "고양시",
    "고양",
    "일산동구",
    "김포시",
    "김포",
    "파주시",
    "파주",
    "광명시",
    "광명",
}
CAPITAL_SOUTH_LOCALITIES = {
    "강남구",
    "강동구",
    "관악구",
    "서초구",
    "송파구",
    "성남시",
    "성남",
    "수원시",
    "수원",
    "안산시",
    "안산",
    "안양시",
    "안양",
    "오산시",
    "오산",
    "용인시",
    "용인",
    "의왕시",
    "의왕",
    "평택시",
    "평택",
}
CAPITAL_NORTH_LOCALITIES = {"강북구", "노원구", "도봉구", "의정부시", "의정부"}
CAPITAL_EAST_LOCALITIES = {
    "광진구",
    "동대문구",
    "성북구",
    "중랑구",
    "광주시",
    "광주",
    "이천시",
    "이천",
}

PROVINCES = [
    ("SEOUL", ["서울특별시", "서울"]),
    ("BUSAN", ["부산광역시", "부산"]),
    ("DAEGU", ["대구광역시", "대구"]),
    ("INCHEON", ["인천광역시", "인천"]),
    ("GWANGJU", ["광주광역시", "광주"]),
    ("DAEJEON", ["대전광역시", "대전"]),
    ("ULSAN", ["울산광역시", "울산"]),
    ("SEJONG", ["세종특별자치시", "세종"]),
    ("GYEONGGI", ["경기도", "경기"]),
    ("GANGWON", ["강원특별자치도", "강원도", "강원"]),
    ("CHUNGBUK", ["충청북도", "충북"]),
    ("CHUNGNAM", ["충청남도", "충남"]),
    ("JEONBUK", ["전북특별자치도", "전라북도", "전북"]),
    ("JEONNAM", ["전라남도", "전남"]),
    ("GYEONGBUK", ["경상북도", "경북"]),
    ("GYEONGNAM", ["경상남도", "경남"]),
    ("JEJU", ["제주특별자치도", "제주도", "제주"]),
]

PROVINCE_BY_LOCALITY = {}


def register_localities(province, *localities):
    for locality in localities:
        PROVINCE_BY_LOCALITY.setdefault(locality, province)


register_localities(
    "SEOUL",
    "강남구",
    "강동구",
    "강북구",
    "강서구",
    "관악구",
    "광진구",
    "노원구",
    "도봉구",
    "동대문구",
    "마포구",
    "서초구",
    "성북구",
    "송파구",
    "영등포구",
    "용산구",
    "은평구",
    "종로구",
    "중구",
    "중랑구",
)
register_localities(
    "GYEONGGI",
    "고양시",
    "고양",
    "광명시",
    "광명",
    "광주시",
    "광주",
    "김포시",
    "김포",
    "부천시",
    "부천",
    "성남시",
    "성남",
    "수원시",
    "수원",
    "시흥시",
    "시흥",
    "안산시",
    "안산",
    "안양시",
    "안양",
    "오산시",
    "오산",
    "용인시",
    "용인",
    "의왕시",
    "의왕",
    "의정부시",
    "의정부",
    "이천시",
    "이천",
    "일산동구",
    "파주시",
    "파주",
    "평택시",
    "평택",
)
register_localities("GYEONGNAM", "김해시", "김해")
register_localities("CHUNGBUK", "청주시", "청주")
register_localities("GANGWON", "삼척시", "삼척")


def normalize_spaces(value):
    return re.sub(r"\s+", " ", value or "").strip()


def html_to_text(fragment):
    return normalize_spaces(html.unescape(TAG_PATTERN.sub(" ", fragment)))


def normalize(value):
    lowered = normalize_spaces(value).lower()
    return normalize_spaces(NOTE_PATTERN.sub("", lowered))


def first_address_token(address):
    tokens = normalize_spaces(address).split()
    return tokens[0] if tokens else ""


def extract_locality(address):
    tokens = normalize_spaces(address).split()
    return tokens[1] if len(tokens) >= 2 else ""


def resolve_province(address):
    normalized_address = normalize_spaces(address)
    for province, prefixes in PROVINCES:
        if any(normalized_address.startswith(prefix) for prefix in prefixes):
            return province
    province = PROVINCE_BY_LOCALITY.get(first_address_token(normalized_address))
    if province:
        return province
    raise ValueError(f"cannot determine province from address: {address}")


def infer_district_name(province, address):
    if province == "GANGWON":
        return "강원연합"
    if province in {"DAEGU", "GYEONGBUK"}:
        return "대경연합"
    if province in {"DAEJEON", "SEJONG", "CHUNGNAM", "CHUNGBUK"}:
        return "충청연합"
    if province in {"BUSAN", "GYEONGNAM"}:
        return "부경연합"
    if province == "ULSAN":
        return "울산연합"
    if province in {"GWANGJU", "JEONNAM", "JEONBUK"}:
        return "호남연합"
    if province == "JEJU":
        return "호남연합"
    if province == "INCHEON":
        return "인천연합"

    locality = extract_locality(address)
    if locality in INCHEON_ALLIANCE_LOCALITIES:
        return "인천연합"
    if locality in CAPITAL_WEST_LOCALITIES:
        return "수도권서부연합"
    if locality in CAPITAL_SOUTH_LOCALITIES:
        return "수도권남부연합"
    if locality in CAPITAL_NORTH_LOCALITIES:
        return "수도권북부연합"
    if locality in CAPITAL_EAST_LOCALITIES:
        return "수도권동부연합"
    if province in {"SEOUL", "GYEONGGI"}:
        return "수도권서부연합"
    raise ValueError(f"cannot infer district from address: {address}")


def split_without_comma(location_without_notes):
    tokens = location_without_notes.split()
    split_index = -1
    for index, token in enumerate(tokens):
        if not NUMBER_TOKEN_PATTERN.fullmatch(token):
            continue
        has_road_context = any(ROAD_TOKEN_PATTERN.fullmatch(lookback) for lookback in tokens[:index])
        has_address_context = index > 0 and ADDRESS_CONTEXT_PATTERN.fullmatch(tokens[index - 1]) is not None
        if has_road_context or has_address_context:
            split_index = index
            break

    if split_index < 0:
        return location_without_notes, "", False

    address = " ".join(tokens[: split_index + 1])
    detail = " ".join(tokens[split_index + 1 :])
    return address, detail, True


def parse_location(raw_location):
    normalized_raw_location = normalize_spaces(raw_location)
    general_notices = []
    special_notices = []

    for match in NOTE_PATTERN.finditer(normalized_raw_location):
        note = normalize_spaces(match.group(1) or match.group(2) or "")
        if not note:
            continue
        target = special_notices if SPECIAL_NOTICE_PATTERN.search(note) else general_notices
        if note not in target:
            target.append(note)

    location_without_notes = normalize_spaces(NOTE_PATTERN.sub("", normalized_raw_location))
    used_heuristic_split = False
    used_fallback_detail = False

    if "," in location_without_notes:
        address, detail = location_without_notes.split(",", 1)
        address = normalize_spaces(address)
        detail = normalize_spaces(detail)
    else:
        address, detail, used_heuristic_split = split_without_comma(location_without_notes)
        address = normalize_spaces(address)
        detail = normalize_spaces(detail)

    if not address:
        address = location_without_notes
    if not detail:
        detail = "상세 위치 미기재"
        used_fallback_detail = True

    province = resolve_province(address)
    return {
        "address": address,
        "detail": detail,
        "province": province,
        "groupingPlaceKey": f"{normalize(address)}|{normalize(detail)}",
        "generalNotices": general_notices,
        "specialNotices": special_notices,
        "usedHeuristicSplit": used_heuristic_split,
        "usedFallbackDetail": used_fallback_detail,
    }


def extract_rows(raw_html):
    area_rows = extract_area_rows(HTML_COMMENT_PATTERN.sub("", raw_html))
    if area_rows:
        return area_rows
    return extract_flat_rows(raw_html)


def extract_area_rows(sanitized_html):
    rows = []
    for area_match in AREA_SECTION_PATTERN.finditer(sanitized_html):
        area_section = area_match.group(1)
        area_name_match = AREA_NAME_PATTERN.search(area_section)
        area_name = html_to_text(area_name_match.group(1)) if area_name_match else ""
        tbody_match = TBODY_PATTERN.search(area_section)
        tbody = tbody_match.group(1) if tbody_match else area_section
        cells = [html_to_text(match.group(1)) for match in TD_PATTERN.finditer(tbody)]

        current_day = None
        for index in range(0, len(cells) - 6, 7):
            source_day = cells[index]
            if source_day:
                current_day = source_day
            if not current_day:
                continue

            group_name = cells[index + 2]
            raw_location = cells[index + 3]
            representative = cells[index + 5]
            meeting_type_symbol = cells[index + 6].strip()

            if not group_name or not representative or not raw_location:
                continue

            phone_match = PHONE_PATTERN.search(representative)
            if not phone_match:
                continue

            location = parse_location(raw_location)
            rows.append(
                {
                    "sourceAreaName": area_name,
                    "groupName": group_name.strip(),
                    "normalizedGroupName": normalize(group_name),
                    "phone": phone_match.group(0),
                    "dayOfWeek": DAY_OF_WEEK_BY_KOREAN[current_day],
                    "startTime": cells[index + 1].strip(),
                    "meetingType": TYPE_BY_SYMBOL[meeting_type_symbol],
                    "rawLocation": raw_location.strip(),
                    "location": location,
                    "districtName": infer_district_name(location["province"], location["address"]),
                    "active": True,
                }
            )

    return rows


def extract_flat_rows(raw_html):
    rows = []
    for tbody_match in TBODY_PATTERN.finditer(raw_html):
        current_day = None
        tbody = tbody_match.group(1)
        for active, row_html in extract_row_fragments(tbody):
            cells = [html_to_text(match.group(1)) for match in TD_PATTERN.finditer(row_html)]
            if len(cells) < 6:
                continue

            source_day = cells[0]
            if source_day:
                current_day = source_day
            if not current_day:
                continue

            row = build_row("", cells, current_day, active)
            if row is not None:
                rows.append(row)
    return rows


def extract_row_fragments(html_fragment):
    rows = []
    for match in ROW_FRAGMENT_PATTERN.finditer(html_fragment):
        commented_row = match.group(1)
        regular_row = match.group(2)
        if commented_row is not None:
            rows.append((False, commented_row))
        elif regular_row is not None:
            rows.append((True, regular_row))
    return rows


def build_row(area_name, cells, current_day, active):
    group_name = cells[2]
    raw_location = cells[3]
    representative = cells[-2]
    meeting_type_symbol = cells[-1].strip()

    if not group_name or not representative or not raw_location:
        return None

    phone_match = PHONE_PATTERN.search(representative)
    if not phone_match:
        return None

    location = parse_location(raw_location)
    return {
        "sourceAreaName": area_name,
        "groupName": group_name.strip(),
        "normalizedGroupName": normalize(group_name),
        "phone": phone_match.group(0),
        "dayOfWeek": DAY_OF_WEEK_BY_KOREAN[current_day],
        "startTime": cells[1].strip(),
        "meetingType": TYPE_BY_SYMBOL[meeting_type_symbol],
        "rawLocation": raw_location.strip(),
        "location": location,
        "districtName": infer_district_name(location["province"], location["address"]),
        "active": active,
    }


def row_identity(row):
    return (
        row["normalizedGroupName"],
        row["phone"],
        row["dayOfWeek"],
        row["startTime"],
        row["location"]["groupingPlaceKey"],
    )


def cluster_same_named_rows(rows):
    parent = list(range(len(rows)))

    def find(node):
        while parent[node] != node:
            parent[node] = parent[parent[node]]
            node = parent[node]
        return node

    def union(left, right):
        left_root = find(left)
        right_root = find(right)
        if left_root != right_root:
            parent[right_root] = left_root

    for left in range(len(rows)):
        for right in range(left + 1, len(rows)):
            if rows[left]["phone"] == rows[right]["phone"] or rows[left]["location"]["groupingPlaceKey"] == rows[right]["location"]["groupingPlaceKey"]:
                union(left, right)

    grouped = {}
    for index, row in enumerate(rows):
        grouped.setdefault(find(index), []).append(row)
    return list(grouped.values())


def pick_district_name(rows):
    counts = {}
    for row in rows:
        counts[row["districtName"]] = counts.get(row["districtName"], 0) + 1
    return max(
        counts,
        key=lambda district_name: (counts[district_name], -min(DAY_ORDER[row["dayOfWeek"]] for row in rows if row["districtName"] == district_name)),
    )


def imported_meeting_from_row(row):
    location = row["location"]
    return {
        "dayOfWeek": row["dayOfWeek"],
        "startTime": row["startTime"],
        "type": row["meetingType"],
        "province": location["province"],
        "locationAddress": location["address"],
        "locationDetail": location["detail"],
        "contactPhoneOverride": row["contactPhoneOverride"],
        "heuristicLocationSplit": location["usedHeuristicSplit"] or location["usedFallbackDetail"],
        "active": row["active"],
    }


def meeting_key(meeting):
    return (
        meeting["dayOfWeek"],
        meeting["startTime"],
        meeting["type"],
        meeting["province"],
        meeting["locationAddress"],
        meeting["locationDetail"],
        meeting["contactPhoneOverride"],
        meeting["heuristicLocationSplit"],
    )


def meeting_notice(row, note):
    return f'{DAY_LABELS[row["dayOfWeek"]]} {row["startTime"]} {note}'


def to_imported_group(cluster):
    sorted_rows = sorted(
        cluster,
        key=lambda row: (DAY_ORDER[row["dayOfWeek"]], row["startTime"], row["phone"], row["groupName"]),
    )
    representative_rows = [row for row in sorted_rows if row["active"]] or sorted_rows
    representative = representative_rows[0]
    primary_phone = representative["phone"]
    district_name = pick_district_name(sorted_rows)
    notice_parts = []
    issues = []

    def add_notice(value):
        if value and value not in notice_parts:
            notice_parts.append(value)

    for row in representative_rows:
        for special_notice in row["location"]["specialNotices"]:
            add_notice(meeting_notice(row, special_notice))

    for row in representative_rows:
        for general_notice in row["location"]["generalNotices"]:
            add_notice(general_notice)
        if row["location"]["usedFallbackDetail"]:
            issues.append(
                {
                    "severity": "WARNING",
                    "code": "LOCATION_DETAIL_FALLBACK",
                    "message": "상세 위치를 자동 분리하지 못해 기본 문구를 사용했습니다.",
                    "groupName": row["groupName"],
                    "dayOfWeek": row["dayOfWeek"],
                    "startTime": row["startTime"],
                }
            )

    notice = " / ".join(notice_parts) if notice_parts else None
    if notice and len(notice) > 200:
        issues.append(
            {
                "severity": "ERROR",
                "code": "NOTICE_TOO_LONG",
                "message": "group.notice must be at most 200 characters after import normalization.",
                "groupName": representative["groupName"],
                "dayOfWeek": None,
                "startTime": None,
            }
        )

    meetings = {}
    for row in sorted_rows:
        row = {
            **row,
            "contactPhoneOverride": None if row["phone"] == primary_phone else row["phone"],
        }
        meeting = imported_meeting_from_row(row)
        key = meeting_key(meeting)
        existing = meetings.get(key)
        if (
            existing is None
            or (existing["active"] != meeting["active"] and meeting["active"])
            or (existing["contactPhoneOverride"] is None and meeting["contactPhoneOverride"] is not None)
        ):
            meetings[key] = meeting

    return {
        "districtName": district_name,
        "name": representative["groupName"],
        "phone": primary_phone,
        "notice": notice,
        "meetings": list(meetings.values()),
        "_issues": issues,
    }


def normalize_html(raw_html):
    rows = extract_rows(raw_html)
    if not rows:
        raise ValueError("html did not contain meeting rows")

    rows_by_name = {}
    for row in rows:
        rows_by_name.setdefault(row["normalizedGroupName"], []).append(row)

    groups = []
    issues = []
    for same_name_rows in rows_by_name.values():
        deduplicated = {}
        for row in same_name_rows:
            identity = row_identity(row)
            existing = deduplicated.get(identity)
            if existing is None or (not existing["active"] and row["active"]):
                deduplicated[identity] = row

        for cluster in cluster_same_named_rows(list(deduplicated.values())):
            group = to_imported_group(cluster)
            groups.append(group)
            issues.extend(group.pop("_issues"))

    groups.sort(key=lambda group: (group["districtName"], group["name"], group["phone"]))
    return {
        "sourceMeetingCount": len(rows),
        "issues": issues,
        "groups": groups,
    }


def main():
    parser = argparse.ArgumentParser(description="Normalize meeting.html into JSON import payload.")
    parser.add_argument("source_html", type=Path, help="Path to raw meeting.html")
    parser.add_argument("output_json", type=Path, help="Path to normalized json output")
    args = parser.parse_args()

    payload = normalize_html(args.source_html.read_text(encoding="utf-8"))
    args.output_json.parent.mkdir(parents=True, exist_ok=True)
    args.output_json.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(
        json.dumps(
            {
                "sourceMeetingCount": payload["sourceMeetingCount"],
                "groupCount": len(payload["groups"]),
                "meetingCount": sum(len(group["meetings"]) for group in payload["groups"]),
                "issueCount": len(payload["issues"]),
                "output": str(args.output_json),
            },
            ensure_ascii=False,
        )
    )


if __name__ == "__main__":
    main()
