package org.aakorea.main.group.application;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.RequiredArgsConstructor;
import org.aakorea.main.common.error.FieldValidationException;
import org.aakorea.main.generalservice.domain.District;
import org.aakorea.main.generalservice.infrastructure.DistrictRepository;
import org.aakorea.main.group.domain.Group;
import org.aakorea.main.group.domain.GroupContact;
import org.aakorea.main.group.domain.Meeting;
import org.aakorea.main.group.domain.MeetingType;
import org.aakorea.main.group.infrastructure.GroupContactRepository;
import org.aakorea.main.group.infrastructure.GroupRepository;
import org.aakorea.main.group.infrastructure.MeetingRepository;
import org.aakorea.main.shared.Location;
import org.aakorea.main.shared.Province;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.HtmlUtils;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MeetingImportAdminService {

    private static final Pattern HTML_COMMENT_PATTERN = Pattern.compile("<!--.*?-->", Pattern.DOTALL);
    private static final Pattern AREA_SECTION_PATTERN = Pattern.compile(
            "<div id=\"area[^\"]*\" class=\"boxtable\">(.*?)(?=<div id=\"area[^\"]*\" class=\"boxtable\">|\\z)",
            Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
    private static final Pattern AREA_NAME_PATTERN = Pattern.compile(
            "<div class=\"areaname\">(.*?)</div>",
            Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
    private static final Pattern TBODY_PATTERN = Pattern.compile(
            "<tbody>(.*?)</tbody>",
            Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
    private static final Pattern ROW_FRAGMENT_PATTERN = Pattern.compile(
            "<!--\\s*(<tr\\b.*?</tr>)\\s*-->|(<tr\\b.*?</tr>)",
            Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
    private static final Pattern TD_PATTERN = Pattern.compile(
            "<td\\b[^>]*>(.*?)(?=</td>|<td\\b|</tr>|<tr\\b|</tbody>)",
            Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
    private static final Pattern TAG_PATTERN = Pattern.compile("<[^>]+>");
    private static final Pattern PHONE_PATTERN = Pattern.compile("01\\d-\\d{3,4}-\\d{4}");
    private static final Pattern NOTE_PATTERN = Pattern.compile("\\(([^)]*)\\)|\\[([^\\]]*)\\]");
    private static final Pattern SPECIAL_NOTICE_PATTERN = Pattern.compile(
            "매월|격주|첫째|둘째|셋째|넷째|1째|2째|3째|4째",
            Pattern.CASE_INSENSITIVE);
    private static final Pattern NUMBER_TOKEN_PATTERN = Pattern.compile("\\d+(?:-\\d+)?");
    private static final Pattern ROAD_TOKEN_PATTERN = Pattern.compile(".*(?:로|길|대로|번길)$");
    private static final Pattern ADDRESS_CONTEXT_PATTERN = Pattern.compile(".*(?:시|군|구|읍|면|동|리|가)$");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private static final Map<String, DayOfWeek> DAY_OF_WEEK_BY_KOREAN = Map.of(
            "월", DayOfWeek.MONDAY,
            "화", DayOfWeek.TUESDAY,
            "수", DayOfWeek.WEDNESDAY,
            "목", DayOfWeek.THURSDAY,
            "금", DayOfWeek.FRIDAY,
            "토", DayOfWeek.SATURDAY,
            "일", DayOfWeek.SUNDAY);
    private static final Map<DayOfWeek, String> DAY_LABELS = new EnumMap<>(DayOfWeek.class);

    private static final Set<String> INCHEON_ALLIANCE_LOCALITIES = Set.of(
            "인천",
            "부천시", "부천",
            "시흥시", "시흥",
            "강화군", "강화");
    private static final Set<String> CAPITAL_WEST_LOCALITIES = Set.of(
            "강서구", "마포구", "영등포구", "은평구", "용산구", "종로구", "중구",
            "고양시", "고양", "일산동구",
            "김포시", "김포",
            "파주시", "파주",
            "광명시", "광명");
    private static final Set<String> CAPITAL_SOUTH_LOCALITIES = Set.of(
            "강남구", "강동구", "관악구", "서초구", "송파구",
            "성남시", "성남",
            "수원시", "수원",
            "안산시", "안산",
            "안양시", "안양",
            "오산시", "오산",
            "용인시", "용인",
            "의왕시", "의왕",
            "평택시", "평택");
    private static final Set<String> CAPITAL_NORTH_LOCALITIES = Set.of(
            "강북구", "노원구", "도봉구",
            "의정부시", "의정부");
    private static final Set<String> CAPITAL_EAST_LOCALITIES = Set.of(
            "광진구", "동대문구", "성북구", "중랑구",
            "광주시", "광주",
            "이천시", "이천");
    private static final Map<String, Province> PROVINCE_BY_LOCALITY = new HashMap<>();

    static {
        DAY_LABELS.put(DayOfWeek.MONDAY, "월요일");
        DAY_LABELS.put(DayOfWeek.TUESDAY, "화요일");
        DAY_LABELS.put(DayOfWeek.WEDNESDAY, "수요일");
        DAY_LABELS.put(DayOfWeek.THURSDAY, "목요일");
        DAY_LABELS.put(DayOfWeek.FRIDAY, "금요일");
        DAY_LABELS.put(DayOfWeek.SATURDAY, "토요일");
        DAY_LABELS.put(DayOfWeek.SUNDAY, "일요일");

        registerLocalities(Province.SEOUL,
                "강남구", "강동구", "강북구", "강서구", "관악구",
                "광진구", "노원구", "도봉구", "동대문구", "마포구",
                "서초구", "성북구", "송파구", "영등포구", "용산구",
                "은평구", "종로구", "중구", "중랑구");
        registerLocalities(Province.GYEONGGI,
                "고양시", "고양", "광명시", "광명", "광주시", "광주",
                "김포시", "김포", "부천시", "부천", "성남시", "성남",
                "수원시", "수원", "시흥시", "시흥", "안산시", "안산",
                "안양시", "안양", "오산시", "오산", "용인시", "용인",
                "의왕시", "의왕", "의정부시", "의정부", "이천시", "이천",
                "일산동구", "파주시", "파주", "평택시", "평택");
        registerLocalities(Province.GYEONGNAM, "김해시", "김해");
        registerLocalities(Province.CHUNGBUK, "청주시", "청주");
        registerLocalities(Province.GANGWON, "삼척시", "삼척");
    }

    private final DistrictRepository districtRepository;
    private final GroupRepository groupRepository;
    private final GroupContactRepository groupContactRepository;
    private final MeetingRepository meetingRepository;

    public NormalizedMeetingImport normalizeHtml(String html) {
        return toNormalizedMeetingImport(buildImportPlanFromHtml(html));
    }

    @Transactional
    public ImportResetResult resetImportData() {
        long deletedMeetingCount = meetingRepository.count();
        long deletedGroupContactCount = groupContactRepository.count();
        long deletedGroupCount = groupRepository.count();
        long deletedDistrictCount = districtRepository.count();

        meetingRepository.deleteAllInBatch();
        groupContactRepository.deleteAllInBatch();
        groupRepository.deleteAllInBatch();
        districtRepository.deleteAllInBatch();

        return new ImportResetResult(
                deletedDistrictCount,
                deletedGroupCount,
                deletedGroupContactCount,
                deletedMeetingCount);
    }

    public ImportPreview previewImport(NormalizedMeetingImport normalizedImport) {
        ImportPlan plan = buildImportPlan(normalizedImport);
        Set<String> existingDistrictNames = districtRepository.findAllByOrderByIdAsc().stream()
                .map(District::getName)
                .collect(LinkedHashSet::new, Set::add, Set::addAll);

        List<String> missingDistrictNames = plan.groups().stream()
                .map(ImportedGroupPlan::districtName)
                .distinct()
                .filter(districtName -> !existingDistrictNames.contains(districtName))
                .toList();

        return new ImportPreview(
                plan.sourceMeetingCount(),
                plan.groups().size(),
                plan.groups().stream().mapToInt(group -> group.meetings().size()).sum(),
                missingDistrictNames,
                plan.issues().stream().map(this::toIssueData).toList(),
                plan.groups().stream().map(this::toGroupPreview).toList());
    }

    @Transactional
    public ImportApplyResult applyImport(NormalizedMeetingImport normalizedImport) {
        ImportPlan plan = buildImportPlan(normalizedImport);
        ensureNoBlockingIssues(plan.issues());

        DistrictContext districtContext = new DistrictContext(districtRepository.findAllByOrderByIdAsc());
        ExistingGroupContext existingGroupContext = new ExistingGroupContext(
                groupRepository.findAllByOrderByIdAsc(),
                groupContactRepository.findAllByOrderByIdAsc());

        int createdGroupCount = 0;
        int updatedGroupCount = 0;
        int createdGroupContactCount = 0;
        int updatedGroupContactCount = 0;
        int createdMeetingCount = 0;
        int updatedMeetingCount = 0;

        for (ImportedGroupPlan importedGroup : plan.groups()) {
            District district = districtContext.getOrCreate(importedGroup.districtName());
            Optional<Group> existingGroupCandidate =
                    existingGroupContext.find(importedGroup.normalizedName(), importedGroup.primaryPhone());

            Group group;
            if (existingGroupCandidate.isPresent()) {
                group = existingGroupCandidate.get();
                group.update(district, importedGroup.name(), importedGroup.notice());
                updatedGroupCount++;
            } else {
                group = groupRepository.save(new Group(district, importedGroup.name(), importedGroup.notice()));
                createdGroupCount++;
                existingGroupContext.registerGroup(group, importedGroup.primaryPhone());
            }

            Optional<GroupContact> existingContact = existingGroupContext.findContact(group.getId());
            if (existingContact.isPresent()) {
                GroupContact groupContact = existingContact.get();
                groupContact.update(importedGroup.primaryPhone(), groupContact.getEmail(), groupContact.getPostalContact());
                updatedGroupContactCount++;
                existingGroupContext.registerGroup(group, importedGroup.primaryPhone());
                existingGroupContext.registerContact(groupContact);
            } else {
                GroupContact groupContact = groupContactRepository.save(new GroupContact(
                        group,
                        importedGroup.primaryPhone(),
                        null,
                        null));
                createdGroupContactCount++;
                existingGroupContext.registerGroup(group, groupContact.getPhone());
                existingGroupContext.registerContact(groupContact);
            }

            MeetingSyncSummary meetingSyncSummary = syncMeetings(group, importedGroup.meetings());
            createdMeetingCount += meetingSyncSummary.createdCount();
            updatedMeetingCount += meetingSyncSummary.updatedCount();
        }

        return new ImportApplyResult(
                plan.sourceMeetingCount(),
                plan.groups().size(),
                plan.groups().stream().mapToInt(group -> group.meetings().size()).sum(),
                districtContext.createdDistrictNames().size(),
                createdGroupCount,
                updatedGroupCount,
                createdGroupContactCount,
                updatedGroupContactCount,
                createdMeetingCount,
                updatedMeetingCount,
                districtContext.createdDistrictNames(),
                plan.issues().stream().map(this::toIssueData).toList());
    }

    private MeetingSyncSummary syncMeetings(Group group, List<ImportedMeetingPlan> importedMeetings) {
        Map<MeetingIdentity, Meeting> existingMeetings = new LinkedHashMap<>();
        for (Meeting meeting : meetingRepository.findAllByGroup_IdOrderByIdAsc(group.getId())) {
            existingMeetings.putIfAbsent(MeetingIdentity.from(meeting), meeting);
        }

        int createdCount = 0;
        int updatedCount = 0;

        for (ImportedMeetingPlan importedMeeting : importedMeetings) {
            MeetingIdentity identity = importedMeeting.identity();
            Meeting existingMeeting = existingMeetings.get(identity);

            if (existingMeeting != null) {
                existingMeeting.update(
                        group,
                        new Location(
                                importedMeeting.province(),
                                importedMeeting.locationDetail(),
                                importedMeeting.locationAddress(),
                                existingMeeting.getLatitude(),
                                existingMeeting.getLongitude()),
                        importedMeeting.dayOfWeek(),
                        importedMeeting.startTime(),
                        importedMeeting.type(),
                        importedMeeting.contactPhoneOverride(),
                        importedMeeting.active());
                updatedCount++;
                continue;
            }

            meetingRepository.save(new Meeting(
                    group,
                    new Location(
                            importedMeeting.province(),
                            importedMeeting.locationDetail(),
                            importedMeeting.locationAddress(),
                            null,
                            null),
                    importedMeeting.dayOfWeek(),
                    importedMeeting.startTime(),
                    importedMeeting.type(),
                    importedMeeting.contactPhoneOverride(),
                    importedMeeting.active()));
            createdCount++;
        }

        return new MeetingSyncSummary(createdCount, updatedCount);
    }

    private void ensureNoBlockingIssues(List<ImportIssue> issues) {
        issues.stream()
                .filter(issue -> issue.severity() == IssueSeverity.ERROR)
                .findFirst()
                .ifPresent(issue -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, issue.message());
                });
    }

    private ImportPlan buildImportPlan(NormalizedMeetingImport normalizedImport) {
        if (normalizedImport == null) {
            throw FieldValidationException.badRequest("importJson", "normalized import json is required");
        }

        List<NormalizedImportGroup> normalizedGroups = Optional.ofNullable(normalizedImport.groups()).orElse(List.of());
        if (normalizedGroups.isEmpty()) {
            throw FieldValidationException.badRequest("groups", "at least one group is required");
        }

        List<ImportedGroupPlan> groups = new ArrayList<>();
        List<ImportIssue> issues = new ArrayList<>();

        for (NormalizedImportGroup normalizedGroup : normalizedGroups) {
            ImportedGroupPlan importedGroup = toImportedGroup(normalizedGroup);
            groups.add(importedGroup);
            issues.addAll(importedGroup.issues());
        }

        Map<String, Integer> importKeyCounts = new LinkedHashMap<>();
        for (ImportedGroupPlan group : groups) {
            importKeyCounts.merge(group.normalizedName() + "|" + group.primaryPhone(), 1, Integer::sum);
        }
        for (ImportedGroupPlan group : groups) {
            if (importKeyCounts.get(group.normalizedName() + "|" + group.primaryPhone()) > 1) {
                issues.add(new ImportIssue(
                        IssueSeverity.ERROR,
                        "DUPLICATE_GROUP_KEY",
                        "normalized json contains duplicate group keys for the same name and phone.",
                        group.name(),
                        null,
                        null));
            }
        }

        groups.sort(Comparator
                .comparing(ImportedGroupPlan::districtName)
                .thenComparing(ImportedGroupPlan::name)
                .thenComparing(ImportedGroupPlan::primaryPhone));

        int importedMeetingCount = groups.stream().mapToInt(group -> group.meetings().size()).sum();
        int sourceMeetingCount = normalizedImport.sourceMeetingCount() == null || normalizedImport.sourceMeetingCount() < 1
                ? importedMeetingCount
                : normalizedImport.sourceMeetingCount();

        return new ImportPlan(sourceMeetingCount, List.copyOf(groups), List.copyOf(issues));
    }

    private ImportPlan buildImportPlanFromHtml(String html) {
        List<SourceMeetingRow> sourceRows = extractSourceRows(html);
        if (sourceRows.isEmpty()) {
            throw FieldValidationException.badRequest("html", "html did not contain meeting rows");
        }

        Map<String, List<SourceMeetingRow>> rowsByName = new LinkedHashMap<>();
        for (SourceMeetingRow row : sourceRows) {
            rowsByName.computeIfAbsent(row.normalizedGroupName(), ignored -> new ArrayList<>()).add(row);
        }

        List<ImportedGroupPlan> groups = new ArrayList<>();
        List<ImportIssue> issues = new ArrayList<>();

        for (List<SourceMeetingRow> sameNameRows : rowsByName.values()) {
            List<SourceMeetingRow> deduplicatedRows = deduplicateRows(sameNameRows);
            for (List<SourceMeetingRow> cluster : clusterSameNamedRows(deduplicatedRows)) {
                ImportedGroupPlan importedGroup = toImportedGroup(cluster);
                groups.add(importedGroup);
                issues.addAll(importedGroup.issues());
            }
        }

        groups.sort(Comparator
                .comparing(ImportedGroupPlan::districtName)
                .thenComparing(ImportedGroupPlan::name)
                .thenComparing(ImportedGroupPlan::primaryPhone));

        return new ImportPlan(sourceRows.size(), List.copyOf(groups), List.copyOf(issues));
    }

    private NormalizedMeetingImport toNormalizedMeetingImport(ImportPlan plan) {
        return new NormalizedMeetingImport(
                plan.sourceMeetingCount(),
                plan.issues().stream().map(this::toIssueData).toList(),
                plan.groups().stream().map(this::toNormalizedImportGroup).toList());
    }

    private NormalizedImportGroup toNormalizedImportGroup(ImportedGroupPlan group) {
        return new NormalizedImportGroup(
                group.districtName(),
                group.name(),
                group.primaryPhone(),
                group.notice(),
                group.meetings().stream().map(this::toNormalizedImportMeeting).toList());
    }

    private NormalizedImportMeeting toNormalizedImportMeeting(ImportedMeetingPlan meeting) {
        return new NormalizedImportMeeting(
                meeting.dayOfWeek().name(),
                formatTime(meeting.startTime()),
                meeting.type().name(),
                meeting.province().name(),
                meeting.locationAddress(),
                meeting.locationDetail(),
                meeting.contactPhoneOverride(),
                meeting.heuristicLocationSplit(),
                meeting.active());
    }

    private List<SourceMeetingRow> extractSourceRows(String html) {
        if (html == null || html.isBlank()) {
            throw FieldValidationException.badRequest("html", "html is required");
        }

        String sanitizedHtml = HTML_COMMENT_PATTERN.matcher(html).replaceAll("");
        List<SourceMeetingRow> areaRows = extractAreaSourceRows(sanitizedHtml);
        if (!areaRows.isEmpty()) {
            return areaRows;
        }

        return extractFlatTableSourceRows(html);
    }

    private List<SourceMeetingRow> extractAreaSourceRows(String sanitizedHtml) {
        List<SourceMeetingRow> rows = new ArrayList<>();
        Matcher areaMatcher = AREA_SECTION_PATTERN.matcher(sanitizedHtml);
        while (areaMatcher.find()) {
            String areaSection = areaMatcher.group(1);
            String areaName = extractAreaName(areaSection);
            String tbody = extractTbody(areaSection);
            List<String> cells = extractCells(tbody);
            String currentDay = null;

            for (int index = 0; index + 6 < cells.size(); index += 7) {
                String sourceDay = cells.get(index);
                if (!sourceDay.isBlank()) {
                    currentDay = sourceDay;
                }
                if (currentDay == null || currentDay.isBlank()) {
                    continue;
                }

                String groupName = cells.get(index + 2);
                String representative = cells.get(index + 5);
                String rawLocation = cells.get(index + 3);

                if (groupName.isBlank() || representative.isBlank() || rawLocation.isBlank()) {
                    continue;
                }

                Matcher phoneMatcher = PHONE_PATTERN.matcher(representative);
                if (!phoneMatcher.find()) {
                    continue;
                }

                LocationParseResult location = parseLocation(rawLocation);
                DayOfWeek dayOfWeek = requireDayOfWeek(currentDay);
                LocalTime startTime = requireStartTime(cells.get(index + 1));
                MeetingType meetingType = requireMeetingType(cells.get(index + 6));
                Province province = resolveProvince(location.address());
                String districtName = inferDistrictName(province, location.address());

                rows.add(new SourceMeetingRow(
                        areaName,
                        groupName.trim(),
                        normalize(groupName),
                        phoneMatcher.group(),
                        dayOfWeek,
                        startTime,
                        meetingType,
                        rawLocation.trim(),
                        location,
                        districtName,
                        true));
            }
        }

        return rows;
    }

    private List<SourceMeetingRow> extractFlatTableSourceRows(String html) {
        List<SourceMeetingRow> rows = new ArrayList<>();

        Matcher tbodyMatcher = TBODY_PATTERN.matcher(html);
        while (tbodyMatcher.find()) {
            String tbody = tbodyMatcher.group(1);
            String currentDay = null;

            for (RowFragment rowFragment : extractRowFragments(tbody)) {
                List<String> cells = extractCells(rowFragment.html());
                if (cells.size() < 6) {
                    continue;
                }

                String sourceDay = cells.getFirst();
                if (!sourceDay.isBlank()) {
                    currentDay = sourceDay;
                }
                if (currentDay == null || currentDay.isBlank()) {
                    continue;
                }

                SourceMeetingRow row = toSourceMeetingRow("", cells, currentDay, rowFragment.active());
                if (row != null) {
                    rows.add(row);
                }
            }
        }

        return rows;
    }

    private ImportedGroupPlan toImportedGroup(List<SourceMeetingRow> cluster) {
        List<SourceMeetingRow> sortedRows = new ArrayList<>(cluster);
        sortedRows.sort(Comparator
                .comparing(SourceMeetingRow::dayOfWeek)
                .thenComparing(SourceMeetingRow::startTime)
                .thenComparing(SourceMeetingRow::phone)
                .thenComparing(SourceMeetingRow::groupName));

        List<SourceMeetingRow> representativeRows = sortedRows.stream()
                .filter(SourceMeetingRow::active)
                .toList();
        if (representativeRows.isEmpty()) {
            representativeRows = sortedRows;
        }

        SourceMeetingRow representative = representativeRows.getFirst();
        String districtName = pickDistrictName(sortedRows);
        String primaryPhone = representative.phone();
        LinkedHashSet<String> noticeParts = new LinkedHashSet<>();
        List<ImportIssue> issues = new ArrayList<>();

        for (SourceMeetingRow row : representativeRows) {
            for (String specialNotice : row.location().specialNotices()) {
                noticeParts.add(toMeetingNotice(row, specialNotice));
            }
        }

        for (SourceMeetingRow row : representativeRows) {
            for (String generalNotice : row.location().generalNotices()) {
                noticeParts.add(generalNotice);
            }
            if (row.location().usedFallbackDetail()) {
                issues.add(new ImportIssue(
                        IssueSeverity.WARNING,
                        "LOCATION_DETAIL_FALLBACK",
                        "상세 위치를 자동 분리하지 못해 기본 문구를 사용했습니다.",
                        row.groupName(),
                        row.dayOfWeek(),
                        formatTime(row.startTime())));
            }
        }

        String notice = noticeParts.isEmpty() ? null : String.join(" / ", noticeParts);
        if (notice != null && notice.length() > 200) {
            issues.add(new ImportIssue(
                    IssueSeverity.ERROR,
                    "NOTICE_TOO_LONG",
                    "group.notice must be at most 200 characters after import normalization.",
                    representative.groupName(),
                    null,
                    null));
        }

        Map<MeetingIdentity, ImportedMeetingPlan> deduplicatedMeetings = new LinkedHashMap<>();
        for (SourceMeetingRow row : sortedRows) {
            ImportedMeetingPlan importedMeeting = toImportedMeetingPlan(row, primaryPhone);
            ImportedMeetingPlan existingMeeting = deduplicatedMeetings.get(importedMeeting.identity());
            if (shouldReplaceMeeting(existingMeeting, importedMeeting)) {
                deduplicatedMeetings.put(importedMeeting.identity(), importedMeeting);
            }
        }

        return new ImportedGroupPlan(
                districtName,
                representative.groupName(),
                representative.normalizedGroupName(),
                primaryPhone,
                notice,
                List.copyOf(deduplicatedMeetings.values()),
                List.copyOf(issues));
    }

    private ImportedGroupPlan toImportedGroup(NormalizedImportGroup group) {
        if (group == null) {
            throw FieldValidationException.badRequest("groups", "group item is required");
        }

        String districtName = normalizeSpaces(group.districtName());
        String name = normalizeSpaces(group.name());
        String phone = normalizeSpaces(group.phone());
        String notice = normalizeSpaces(group.notice());

        if (districtName.isBlank()) {
            throw FieldValidationException.badRequest("districtName", "districtName is required");
        }
        if (name.isBlank()) {
            throw FieldValidationException.badRequest("name", "name is required");
        }
        if (!PHONE_PATTERN.matcher(phone).matches()) {
            throw FieldValidationException.badRequest("phone", "phone must match 010-0000-0000 format");
        }

        List<NormalizedImportMeeting> normalizedMeetings = Optional.ofNullable(group.meetings()).orElse(List.of());
        if (normalizedMeetings.isEmpty()) {
            throw FieldValidationException.badRequest("meetings", "at least one meeting is required");
        }

        List<ImportIssue> issues = new ArrayList<>();
        Map<MeetingIdentity, ImportedMeetingPlan> deduplicatedMeetings = new LinkedHashMap<>();
        for (NormalizedImportMeeting meeting : normalizedMeetings) {
            ImportedMeetingPlan importedMeeting = toImportedMeetingPlan(meeting);
            MeetingIdentity previous = importedMeeting.identity();
            ImportedMeetingPlan existingMeeting = deduplicatedMeetings.get(previous);
            if (existingMeeting != null) {
                issues.add(new ImportIssue(
                        IssueSeverity.WARNING,
                        "DUPLICATE_MEETING",
                        "normalized json contained duplicate meetings; only the first was kept.",
                        name,
                        importedMeeting.dayOfWeek(),
                        formatTime(importedMeeting.startTime())));
                if (shouldReplaceMeeting(existingMeeting, importedMeeting)) {
                    deduplicatedMeetings.put(previous, importedMeeting);
                }
                continue;
            }
            deduplicatedMeetings.put(previous, importedMeeting);
        }

        String normalizedNotice = notice.isBlank() ? null : notice;
        if (normalizedNotice != null && normalizedNotice.length() > 200) {
            issues.add(new ImportIssue(
                    IssueSeverity.ERROR,
                    "NOTICE_TOO_LONG",
                    "group.notice must be at most 200 characters after import normalization.",
                    name,
                    null,
                    null));
        }

        return new ImportedGroupPlan(
                districtName,
                name,
                normalize(name),
                phone,
                normalizedNotice,
                List.copyOf(deduplicatedMeetings.values()),
                List.copyOf(issues));
    }

    private ImportedMeetingPlan toImportedMeetingPlan(SourceMeetingRow row, String primaryPhone) {
        return new ImportedMeetingPlan(
                row.dayOfWeek(),
                row.startTime(),
                row.meetingType(),
                row.location().address(),
                row.location().detail(),
                row.location().province(),
                row.phone().equals(primaryPhone) ? null : row.phone(),
                row.location().usedHeuristicSplit() || row.location().usedFallbackDetail(),
                row.active());
    }

    private ImportedMeetingPlan toImportedMeetingPlan(NormalizedImportMeeting meeting) {
        if (meeting == null) {
            throw FieldValidationException.badRequest("meetings", "meeting item is required");
        }

        String dayOfWeekValue = normalizeSpaces(meeting.dayOfWeek());
        String startTimeValue = normalizeSpaces(meeting.startTime());
        String typeValue = normalizeSpaces(meeting.type());
        String provinceValue = normalizeSpaces(meeting.province());
        String locationAddress = normalizeSpaces(meeting.locationAddress());
        String locationDetail = normalizeSpaces(meeting.locationDetail());
        String contactPhoneOverride = normalizeSpaces(meeting.contactPhoneOverride());

        if (dayOfWeekValue.isBlank()) {
            throw FieldValidationException.badRequest("dayOfWeek", "dayOfWeek is required");
        }
        if (startTimeValue.isBlank()) {
            throw FieldValidationException.badRequest("startTime", "startTime is required");
        }
        if (typeValue.isBlank()) {
            throw FieldValidationException.badRequest("type", "type is required");
        }
        if (provinceValue.isBlank()) {
            throw FieldValidationException.badRequest("province", "province is required");
        }
        if (locationAddress.isBlank()) {
            throw FieldValidationException.badRequest("locationAddress", "locationAddress is required");
        }
        if (locationDetail.isBlank()) {
            throw FieldValidationException.badRequest("locationDetail", "locationDetail is required");
        }

        return new ImportedMeetingPlan(
                parseDayOfWeekValue(dayOfWeekValue),
                requireStartTime(startTimeValue),
                parseMeetingTypeValue(typeValue),
                locationAddress,
                locationDetail,
                parseProvinceValue(provinceValue),
                contactPhoneOverride.isBlank() ? null : contactPhoneOverride,
                Boolean.TRUE.equals(meeting.heuristicLocationSplit()),
                meeting.active() == null || meeting.active());
    }

    private boolean shouldReplaceMeeting(ImportedMeetingPlan existingMeeting, ImportedMeetingPlan importedMeeting) {
        if (existingMeeting == null) {
            return true;
        }
        if (existingMeeting.active() != importedMeeting.active()) {
            return importedMeeting.active();
        }
        return existingMeeting.contactPhoneOverride() == null && importedMeeting.contactPhoneOverride() != null;
    }

    private String pickDistrictName(List<SourceMeetingRow> rows) {
        Map<String, Integer> counts = new LinkedHashMap<>();
        for (SourceMeetingRow row : rows) {
            counts.merge(row.districtName(), 1, Integer::sum);
        }

        return counts.entrySet().stream()
                .max(Map.Entry.<String, Integer>comparingByValue()
                        .thenComparing(entry -> firstDayOrderForDistrict(rows, entry.getKey()), Comparator.reverseOrder()))
                .map(Map.Entry::getKey)
                .orElse("수도권서부연합");
    }

    private int firstDayOrderForDistrict(List<SourceMeetingRow> rows, String districtName) {
        return rows.stream()
                .filter(row -> row.districtName().equals(districtName))
                .mapToInt(row -> row.dayOfWeek().getValue())
                .min()
                .orElse(Integer.MAX_VALUE);
    }

    private List<SourceMeetingRow> deduplicateRows(List<SourceMeetingRow> rows) {
        Map<RowIdentity, SourceMeetingRow> deduplicated = new LinkedHashMap<>();
        for (SourceMeetingRow row : rows) {
            RowIdentity identity = RowIdentity.from(row);
            SourceMeetingRow existingRow = deduplicated.get(identity);
            if (existingRow == null || (!existingRow.active() && row.active())) {
                deduplicated.put(identity, row);
            }
        }
        return new ArrayList<>(deduplicated.values());
    }

    private List<List<SourceMeetingRow>> clusterSameNamedRows(List<SourceMeetingRow> rows) {
        if (rows.isEmpty()) {
            return List.of();
        }

        int[] parent = new int[rows.size()];
        for (int index = 0; index < rows.size(); index++) {
            parent[index] = index;
        }

        for (int left = 0; left < rows.size(); left++) {
            for (int right = left + 1; right < rows.size(); right++) {
                if (rows.get(left).phone().equals(rows.get(right).phone())
                        || rows.get(left).location().groupingPlaceKey().equals(rows.get(right).location().groupingPlaceKey())) {
                    union(parent, left, right);
                }
            }
        }

        Map<Integer, List<SourceMeetingRow>> grouped = new LinkedHashMap<>();
        for (int index = 0; index < rows.size(); index++) {
            grouped.computeIfAbsent(find(parent, index), ignored -> new ArrayList<>()).add(rows.get(index));
        }
        return new ArrayList<>(grouped.values());
    }

    private int find(int[] parent, int node) {
        if (parent[node] == node) {
            return node;
        }
        parent[node] = find(parent, parent[node]);
        return parent[node];
    }

    private void union(int[] parent, int left, int right) {
        int leftRoot = find(parent, left);
        int rightRoot = find(parent, right);
        if (leftRoot != rightRoot) {
            parent[rightRoot] = leftRoot;
        }
    }

    private String extractAreaName(String areaSection) {
        Matcher matcher = AREA_NAME_PATTERN.matcher(areaSection);
        if (!matcher.find()) {
            return "";
        }
        return htmlToText(matcher.group(1));
    }

    private String extractTbody(String areaSection) {
        Matcher matcher = TBODY_PATTERN.matcher(areaSection);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return areaSection;
    }

    private List<String> extractCells(String htmlFragment) {
        List<String> cells = new ArrayList<>();
        Matcher matcher = TD_PATTERN.matcher(htmlFragment);
        while (matcher.find()) {
            cells.add(htmlToText(matcher.group(1)));
        }
        return cells;
    }

    private String htmlToText(String html) {
        return normalizeSpaces(HtmlUtils.htmlUnescape(TAG_PATTERN.matcher(html).replaceAll(" ")));
    }

    private List<RowFragment> extractRowFragments(String htmlFragment) {
        List<RowFragment> rowFragments = new ArrayList<>();
        Matcher matcher = ROW_FRAGMENT_PATTERN.matcher(htmlFragment);
        while (matcher.find()) {
            String commentedRow = matcher.group(1);
            String regularRow = matcher.group(2);
            if (commentedRow != null) {
                rowFragments.add(new RowFragment(commentedRow, false));
                continue;
            }
            if (regularRow != null) {
                rowFragments.add(new RowFragment(regularRow, true));
            }
        }
        return rowFragments;
    }

    private SourceMeetingRow toSourceMeetingRow(String areaName, List<String> cells, String currentDay, boolean active) {
        String groupName = cells.get(2);
        String rawLocation = cells.get(3);
        String representative = cells.get(cells.size() - 2);
        String meetingTypeSymbol = cells.getLast();

        if (groupName.isBlank() || representative.isBlank() || rawLocation.isBlank()) {
            return null;
        }

        Matcher phoneMatcher = PHONE_PATTERN.matcher(representative);
        if (!phoneMatcher.find()) {
            return null;
        }

        LocationParseResult location = parseLocation(rawLocation);
        DayOfWeek dayOfWeek = requireDayOfWeek(currentDay);
        LocalTime startTime = requireStartTime(cells.get(1));
        MeetingType meetingType = requireMeetingType(meetingTypeSymbol);
        Province province = resolveProvince(location.address());
        String districtName = inferDistrictName(province, location.address());

        return new SourceMeetingRow(
                areaName,
                groupName.trim(),
                normalize(groupName),
                phoneMatcher.group(),
                dayOfWeek,
                startTime,
                meetingType,
                rawLocation.trim(),
                location,
                districtName,
                active);
    }

    private LocationParseResult parseLocation(String rawLocation) {
        String normalizedRawLocation = normalizeSpaces(rawLocation);
        LinkedHashSet<String> generalNotices = new LinkedHashSet<>();
        LinkedHashSet<String> specialNotices = new LinkedHashSet<>();

        Matcher noteMatcher = NOTE_PATTERN.matcher(normalizedRawLocation);
        while (noteMatcher.find()) {
            String note = normalizeSpaces(Optional.ofNullable(noteMatcher.group(1)).orElse(noteMatcher.group(2)));
            if (note.isBlank()) {
                continue;
            }
            if (SPECIAL_NOTICE_PATTERN.matcher(note).find()) {
                specialNotices.add(note);
            } else {
                generalNotices.add(note);
            }
        }

        String locationWithoutNotes = normalizeSpaces(NOTE_PATTERN.matcher(normalizedRawLocation).replaceAll(""));
        String address;
        String detail;
        boolean usedHeuristicSplit = false;
        boolean usedFallbackDetail = false;

        int commaIndex = locationWithoutNotes.indexOf(',');
        if (commaIndex >= 0) {
            address = normalizeSpaces(locationWithoutNotes.substring(0, commaIndex));
            detail = normalizeSpaces(locationWithoutNotes.substring(commaIndex + 1));
        } else {
            SplitResult splitResult = splitWithoutComma(locationWithoutNotes);
            address = splitResult.address();
            detail = splitResult.detail();
            usedHeuristicSplit = splitResult.usedHeuristic();
        }

        if (address.isBlank()) {
            address = locationWithoutNotes;
        }

        if (detail.isBlank()) {
            detail = "상세 위치 미기재";
            usedFallbackDetail = true;
        }

        Province province = resolveProvince(address);
        return new LocationParseResult(
                address,
                detail,
                province,
                normalize(address) + "|" + normalize(detail),
                List.copyOf(generalNotices),
                List.copyOf(specialNotices),
                usedHeuristicSplit,
                usedFallbackDetail);
    }

    private SplitResult splitWithoutComma(String locationWithoutNotes) {
        List<String> tokens = List.of(locationWithoutNotes.split("\\s+"));
        int splitIndex = -1;

        for (int index = 0; index < tokens.size(); index++) {
            String token = tokens.get(index);
            if (!NUMBER_TOKEN_PATTERN.matcher(token).matches()) {
                continue;
            }

            boolean hasRoadContext = false;
            for (int lookback = 0; lookback < index; lookback++) {
                if (ROAD_TOKEN_PATTERN.matcher(tokens.get(lookback)).matches()) {
                    hasRoadContext = true;
                    break;
                }
            }

            boolean hasAddressContext = index > 0 && ADDRESS_CONTEXT_PATTERN.matcher(tokens.get(index - 1)).matches();
            if (hasRoadContext || hasAddressContext) {
                splitIndex = index;
                break;
            }
        }

        if (splitIndex < 0) {
            return new SplitResult(locationWithoutNotes, "", false);
        }

        String address = String.join(" ", tokens.subList(0, splitIndex + 1));
        String detail = splitIndex + 1 < tokens.size()
                ? String.join(" ", tokens.subList(splitIndex + 1, tokens.size()))
                : "";
        return new SplitResult(address, detail, true);
    }

    private DayOfWeek requireDayOfWeek(String koreanDayOfWeek) {
        DayOfWeek dayOfWeek = DAY_OF_WEEK_BY_KOREAN.get(koreanDayOfWeek);
        if (dayOfWeek == null) {
            throw FieldValidationException.badRequest("html", "unsupported dayOfWeek: " + koreanDayOfWeek);
        }
        return dayOfWeek;
    }

    private DayOfWeek parseDayOfWeekValue(String value) {
        DayOfWeek localizedDayOfWeek = DAY_OF_WEEK_BY_KOREAN.get(value.replace("요일", ""));
        if (localizedDayOfWeek != null) {
            return localizedDayOfWeek;
        }

        try {
            return DayOfWeek.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (Exception exception) {
            throw FieldValidationException.badRequest("dayOfWeek", "unsupported dayOfWeek: " + value);
        }
    }

    private LocalTime requireStartTime(String value) {
        try {
            return LocalTime.parse(value.trim(), TIME_FORMATTER);
        } catch (Exception exception) {
            throw FieldValidationException.badRequest("html", "unsupported startTime: " + value);
        }
    }

    private MeetingType requireMeetingType(String symbol) {
        return switch (symbol.trim()) {
            case "○" -> MeetingType.OPEN;
            case "●" -> MeetingType.CLOSED;
            case "◐" -> MeetingType.NOTFIXED;
            default -> throw FieldValidationException.badRequest("html", "unsupported meeting type symbol: " + symbol);
        };
    }

    private MeetingType parseMeetingTypeValue(String value) {
        try {
            return MeetingType.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (Exception exception) {
            throw FieldValidationException.badRequest("type", "unsupported meeting type: " + value);
        }
    }

    private Province resolveProvince(String address) {
        try {
            return Province.fromAddress(address);
        } catch (IllegalArgumentException exception) {
            Province province = PROVINCE_BY_LOCALITY.get(firstAddressToken(address));
            if (province != null) {
                return province;
            }
            throw FieldValidationException.badRequest("html", "cannot determine province from address: " + address);
        }
    }

    private Province parseProvinceValue(String value) {
        try {
            return Province.valueOf(value.toUpperCase(Locale.ROOT));
        } catch (Exception exception) {
            throw FieldValidationException.badRequest("province", "unsupported province: " + value);
        }
    }

    private String inferDistrictName(Province province, String address) {
        if (province == Province.GANGWON) {
            return "강원연합";
        }
        if (province == Province.DAEGU || province == Province.GYEONGBUK) {
            return "대경연합";
        }
        if (province == Province.DAEJEON || province == Province.SEJONG
                || province == Province.CHUNGNAM || province == Province.CHUNGBUK) {
            return "충청연합";
        }
        if (province == Province.BUSAN || province == Province.GYEONGNAM) {
            return "부경연합";
        }
        if (province == Province.ULSAN) {
            return "울산연합";
        }
        if (province == Province.GWANGJU || province == Province.JEONNAM || province == Province.JEONBUK) {
            return "호남연합";
        }
        if (province == Province.JEJU) {
            return "호남연합";
        }
        if (province == Province.INCHEON) {
            return "인천연합";
        }

        String locality = extractLocality(address);
        if (INCHEON_ALLIANCE_LOCALITIES.contains(locality)) {
            return "인천연합";
        }
        if (CAPITAL_WEST_LOCALITIES.contains(locality)) {
            return "수도권서부연합";
        }
        if (CAPITAL_SOUTH_LOCALITIES.contains(locality)) {
            return "수도권남부연합";
        }
        if (CAPITAL_NORTH_LOCALITIES.contains(locality)) {
            return "수도권북부연합";
        }
        if (CAPITAL_EAST_LOCALITIES.contains(locality)) {
            return "수도권동부연합";
        }

        if (province == Province.SEOUL || province == Province.GYEONGGI) {
            return "수도권서부연합";
        }

        throw FieldValidationException.badRequest("html", "cannot infer district from address: " + address);
    }

    private String extractLocality(String address) {
        String[] tokens = address.split("\\s+");
        if (tokens.length < 2) {
            return "";
        }
        return tokens[1];
    }

    private String firstAddressToken(String address) {
        String[] tokens = normalizeSpaces(address).split("\\s+");
        if (tokens.length == 0) {
            return "";
        }
        return tokens[0];
    }

    private String dayLabel(DayOfWeek dayOfWeek) {
        return DAY_LABELS.get(dayOfWeek);
    }

    private String formatTime(LocalTime time) {
        return TIME_FORMATTER.format(time);
    }

    private String toMeetingNotice(SourceMeetingRow row, String note) {
        return dayLabel(row.dayOfWeek()) + " " + formatTime(row.startTime()) + " " + note;
    }

    private String normalize(String value) {
        String normalized = normalizeSpaces(value).toLowerCase(Locale.ROOT);
        normalized = NOTE_PATTERN.matcher(normalized).replaceAll("");
        return normalizeSpaces(normalized);
    }

    private String normalizeSpaces(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s+", " ");
    }

    private static void registerLocalities(Province province, String... localities) {
        for (String locality : localities) {
            PROVINCE_BY_LOCALITY.putIfAbsent(locality, province);
        }
    }

    private ImportedGroupPreview toGroupPreview(ImportedGroupPlan group) {
        return new ImportedGroupPreview(
                group.districtName(),
                group.name(),
                group.primaryPhone(),
                group.notice(),
                group.meetings().size(),
                group.meetings().stream()
                        .map(meeting -> new ImportedMeetingPreview(
                                meeting.dayOfWeek().name(),
                                formatTime(meeting.startTime()),
                                meeting.type(),
                                meeting.locationAddress(),
                                meeting.locationDetail(),
                                meeting.contactPhoneOverride(),
                                meeting.active(),
                                meeting.heuristicLocationSplit()))
                        .toList());
    }

    private ImportIssueData toIssueData(ImportIssue issue) {
        return new ImportIssueData(
                issue.severity().name(),
                issue.code(),
                issue.message(),
                issue.groupName(),
                issue.dayOfWeek() == null ? null : issue.dayOfWeek().name(),
                issue.startTime());
    }

    private record ImportPlan(
            int sourceMeetingCount,
            List<ImportedGroupPlan> groups,
            List<ImportIssue> issues
    ) {
    }

    private record ImportedGroupPlan(
            String districtName,
            String name,
            String normalizedName,
            String primaryPhone,
            String notice,
            List<ImportedMeetingPlan> meetings,
            List<ImportIssue> issues
    ) {
    }

    private record ImportedMeetingPlan(
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            MeetingType type,
            String locationAddress,
            String locationDetail,
            Province province,
            String contactPhoneOverride,
            boolean heuristicLocationSplit,
            boolean active
    ) {
        private MeetingIdentity identity() {
            return new MeetingIdentity(dayOfWeek, startTime, locationAddress, locationDetail);
        }
    }

    private record SourceMeetingRow(
            String sourceAreaName,
            String groupName,
            String normalizedGroupName,
            String phone,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            MeetingType meetingType,
            String rawLocation,
            LocationParseResult location,
            String districtName,
            boolean active
    ) {
    }

    private record LocationParseResult(
            String address,
            String detail,
            Province province,
            String groupingPlaceKey,
            List<String> generalNotices,
            List<String> specialNotices,
            boolean usedHeuristicSplit,
            boolean usedFallbackDetail
    ) {
    }

    private record SplitResult(
            String address,
            String detail,
            boolean usedHeuristic
    ) {
    }

    private record RowFragment(
            String html,
            boolean active
    ) {
    }

    private record RowIdentity(
            String normalizedGroupName,
            String phone,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            String groupingPlaceKey
    ) {
        private static RowIdentity from(SourceMeetingRow row) {
            return new RowIdentity(
                    row.normalizedGroupName(),
                    row.phone(),
                    row.dayOfWeek(),
                    row.startTime(),
                    row.location().groupingPlaceKey());
        }
    }

    private record MeetingIdentity(
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            String locationAddress,
            String locationDetail
    ) {
        private static MeetingIdentity from(Meeting meeting) {
            return new MeetingIdentity(
                    meeting.getDayOfWeek(),
                    meeting.getStartTime(),
                    meeting.getLocationAddress(),
                    meeting.getLocationDetail());
        }
    }

    private record MeetingSyncSummary(
            int createdCount,
            int updatedCount
    ) {
    }

    private enum IssueSeverity {
        WARNING,
        ERROR
    }

    private record ImportIssue(
            IssueSeverity severity,
            String code,
            String message,
            String groupName,
            DayOfWeek dayOfWeek,
            String startTime
    ) {
    }

    public record NormalizedMeetingImport(
            Integer sourceMeetingCount,
            List<ImportIssueData> issues,
            List<NormalizedImportGroup> groups
    ) {
    }

    public record NormalizedImportGroup(
            String districtName,
            String name,
            String phone,
            String notice,
            List<NormalizedImportMeeting> meetings
    ) {
    }

    public record NormalizedImportMeeting(
            String dayOfWeek,
            String startTime,
            String type,
            String province,
            String locationAddress,
            String locationDetail,
            String contactPhoneOverride,
            Boolean heuristicLocationSplit,
            Boolean active
    ) {
    }

    public record ImportPreview(
            int sourceMeetingCount,
            int importedGroupCount,
            int importedMeetingCount,
            List<String> missingDistrictNames,
            List<ImportIssueData> issues,
            List<ImportedGroupPreview> groups
    ) {
    }

    public record ImportedGroupPreview(
            String districtName,
            String name,
            String phone,
            String notice,
            int meetingCount,
            List<ImportedMeetingPreview> meetings
    ) {
    }

    public record ImportedMeetingPreview(
            String dayOfWeek,
            String startTime,
            MeetingType type,
            String locationAddress,
            String locationDetail,
            String contactPhoneOverride,
            boolean active,
            boolean heuristicLocationSplit
    ) {
    }

    public record ImportIssueData(
            String severity,
            String code,
            String message,
            String groupName,
            String dayOfWeek,
            String startTime
    ) {
    }

    public record ImportApplyResult(
            int sourceMeetingCount,
            int importedGroupCount,
            int importedMeetingCount,
            int createdDistrictCount,
            int createdGroupCount,
            int updatedGroupCount,
            int createdGroupContactCount,
            int updatedGroupContactCount,
            int createdMeetingCount,
            int updatedMeetingCount,
            List<String> createdDistrictNames,
            List<ImportIssueData> issues
    ) {
    }

    public record ImportResetResult(
            long deletedDistrictCount,
            long deletedGroupCount,
            long deletedGroupContactCount,
            long deletedMeetingCount
    ) {
    }

    private final class DistrictContext {

        private final Map<String, District> districtsByName = new LinkedHashMap<>();
        private final List<String> createdDistrictNames = new ArrayList<>();

        private DistrictContext(List<District> districts) {
            for (District district : districts) {
                districtsByName.putIfAbsent(district.getName(), district);
            }
        }

        private District getOrCreate(String districtName) {
            District district = districtsByName.get(districtName);
            if (district != null) {
                return district;
            }

            District createdDistrict = districtRepository.save(new District(districtName));
            districtsByName.put(districtName, createdDistrict);
            createdDistrictNames.add(districtName);
            return createdDistrict;
        }

        private List<String> createdDistrictNames() {
            return List.copyOf(createdDistrictNames);
        }
    }

    private final class ExistingGroupContext {

        private final Map<String, Group> groupByImportKey = new LinkedHashMap<>();
        private final Map<Long, GroupContact> contactByGroupId = new HashMap<>();

        private ExistingGroupContext(List<Group> groups, List<GroupContact> contacts) {
            for (GroupContact contact : contacts) {
                contactByGroupId.putIfAbsent(contact.getGroup().getId(), contact);
            }

            for (Group group : groups) {
                GroupContact contact = contactByGroupId.get(group.getId());
                if (contact == null) {
                    continue;
                }

                String key = importKey(normalize(group.getName()), contact.getPhone());
                Group previous = groupByImportKey.putIfAbsent(key, group);
                if (previous != null && !previous.getId().equals(group.getId())) {
                    throw new ResponseStatusException(
                            HttpStatus.CONFLICT,
                            "multiple existing groups match import key for name=" + group.getName() + ", phone=" + contact.getPhone());
                }
            }
        }

        private Optional<Group> find(String normalizedName, String phone) {
            return Optional.ofNullable(groupByImportKey.get(importKey(normalizedName, phone)));
        }

        private Optional<GroupContact> findContact(Long groupId) {
            return Optional.ofNullable(contactByGroupId.get(groupId));
        }

        private void registerGroup(Group group, String phone) {
            groupByImportKey.put(importKey(normalize(group.getName()), phone), group);
        }

        private void registerContact(GroupContact groupContact) {
            contactByGroupId.put(groupContact.getGroup().getId(), groupContact);
        }

        private String importKey(String normalizedName, String phone) {
            return normalizedName + "|" + phone;
        }
    }
}
