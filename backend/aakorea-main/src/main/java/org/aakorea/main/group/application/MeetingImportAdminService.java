package org.aakorea.main.group.application;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
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

    private static final Pattern TBODY_PATTERN = Pattern.compile(
            "<tbody>(.*?)</tbody>", Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
    private static final Pattern ROW_FRAGMENT_PATTERN = Pattern.compile(
            "<!--\\s*(<tr\\b.*?</tr>)\\s*-->|(<tr\\b.*?</tr>)", Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
    private static final Pattern TD_PATTERN = Pattern.compile(
            "<t[dh]\\b[^>]*>(.*?)(?=</t[dh]>|<t[dh]\\b|</tr>|<tr\\b|</tbody>)", Pattern.DOTALL | Pattern.CASE_INSENSITIVE);
    private static final Pattern TAG_PATTERN = Pattern.compile("<[^>]+>");
    private static final Pattern PHONE_PATTERN = Pattern.compile("01\\d-\\d{3,4}-\\d{4}");
    private static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    private static final Map<String, DayOfWeek> DAY_OF_WEEK_BY_KOREAN = Map.of(
            "월", DayOfWeek.MONDAY,
            "화", DayOfWeek.TUESDAY,
            "수", DayOfWeek.WEDNESDAY,
            "목", DayOfWeek.THURSDAY,
            "금", DayOfWeek.FRIDAY,
            "토", DayOfWeek.SATURDAY,
            "일", DayOfWeek.SUNDAY);

    private final DistrictRepository districtRepository;
    private final GroupRepository groupRepository;
    private final GroupContactRepository groupContactRepository;
    private final MeetingRepository meetingRepository;

    @Transactional
    public ImportApplyResult applyHtml(String html) {
        ImportPlan plan = buildImportPlanFromHtml(html);
        return applyImport(plan);
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

    @Transactional
    public ImportApplyResult applyImport(ImportPlan plan) {
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

    private ImportPlan buildImportPlanFromHtml(String html) {
        List<SourceMeetingRow> sourceRows = extractFlatTableSourceRows(html);
        List<ImportIssue> issues = new ArrayList<>();

        Map<String, List<SourceMeetingRow>> rowsByGroupName = new LinkedHashMap<>();
        for (SourceMeetingRow row : sourceRows) {
            String key = row.normalizedGroupName();
            rowsByGroupName.computeIfAbsent(key, k -> new ArrayList<>()).add(row);
        }

        List<ImportedGroupPlan> groups = new ArrayList<>();
        for (Map.Entry<String, List<SourceMeetingRow>> entry : rowsByGroupName.entrySet()) {
            List<SourceMeetingRow> groupRows = entry.getValue();
            SourceMeetingRow firstRow = groupRows.getFirst();

            String primaryPhone = extractPhone(firstRow.phoneOrRepresentative());
            
            String mergedNotice = groupRows.stream()
                    .map(SourceMeetingRow::notice)
                    .filter(notice -> notice != null && !notice.isBlank())
                    .distinct()
                    .collect(java.util.stream.Collectors.joining("\n"))
                    .trim();

            List<ImportedMeetingPlan> meetings = new ArrayList<>();
            Map<MeetingIdentity, ImportedMeetingPlan> deduplicatedMeetings = new LinkedHashMap<>();
            
            for (SourceMeetingRow row : groupRows) {
                String rowPhone = extractPhone(row.phoneOrRepresentative());
                String contactPhoneOverride = rowPhone.equals(primaryPhone) ? null : rowPhone;
                
                ImportedMeetingPlan importedMeeting = new ImportedMeetingPlan(
                        row.dayOfWeek(),
                        row.startTime(),
                        row.meetingType(),
                        row.address(),
                        row.detail(),
                        row.province(),
                        contactPhoneOverride,
                        row.active());
                        
                MeetingIdentity identity = importedMeeting.identity();
                if (deduplicatedMeetings.containsKey(identity)) {
                    issues.add(new ImportIssue(
                            IssueSeverity.WARNING,
                            "DUPLICATE_MEETING",
                            "HTML contained duplicate meetings; only the first was kept.",
                            row.groupName(),
                            row.dayOfWeek(),
                            formatTime(row.startTime())));
                    continue;
                }
                deduplicatedMeetings.put(identity, importedMeeting);
            }
            meetings.addAll(deduplicatedMeetings.values());

            String finalNotice = mergedNotice.isBlank() ? null : mergedNotice;
            if (finalNotice != null && finalNotice.length() > 200) {
                issues.add(new ImportIssue(
                        IssueSeverity.ERROR,
                        "NOTICE_TOO_LONG",
                        "Group notice exceeds maximum length of 200 characters.",
                        firstRow.groupName(),
                        null,
                        null));
            }

            groups.add(new ImportedGroupPlan(
                    firstRow.districtName(),
                    firstRow.groupName(),
                    firstRow.normalizedGroupName(),
                    primaryPhone,
                    finalNotice,
                    meetings));
        }

        return new ImportPlan(sourceRows.size(), groups, issues);
    }

    private List<SourceMeetingRow> extractFlatTableSourceRows(String html) {
        List<SourceMeetingRow> rows = new ArrayList<>();
        Matcher tbodyMatcher = TBODY_PATTERN.matcher(html);
        while (tbodyMatcher.find()) {
            String tbody = tbodyMatcher.group(1);
            Matcher rowMatcher = ROW_FRAGMENT_PATTERN.matcher(tbody);
            while (rowMatcher.find()) {
                boolean active = rowMatcher.group(1) == null;
                String rowHtml = active ? rowMatcher.group(2) : rowMatcher.group(1);
                
                List<String> cells = new ArrayList<>();
                Matcher tdMatcher = TD_PATTERN.matcher(rowHtml);
                while (tdMatcher.find()) {
                    cells.add(htmlToText(tdMatcher.group(1)));
                }

                if (cells.size() < 9) {
                    continue; // Header row or invalid row
                }

                SourceMeetingRow row = toSourceMeetingRow(cells, active);
                if (row != null) {
                    rows.add(row);
                }
            }
        }
        return rows;
    }

    private SourceMeetingRow toSourceMeetingRow(List<String> cells, boolean active) {
        String rawDay = cells.get(0);
        String rawTime = cells.get(1);
        String groupName = cells.get(2);
        String detail = cells.get(3);
        String address = cells.get(4);
        String phoneOrRepresentative = cells.get(5);
        String districtName = cells.get(6);
        String notice = cells.get(7);
        String typeLabel = cells.get(8);

        if (groupName.isBlank() || address.isBlank() || rawDay.equals("요일")) {
            return null; // Skip if invalid or header row
        }

        DayOfWeek dayOfWeek = requireDayOfWeek(rawDay);
        LocalTime startTime = requireStartTime(rawTime);
        MeetingType meetingType = requireMeetingType(typeLabel);
        Province province = resolveProvince(address);

        return new SourceMeetingRow(
                groupName.trim(),
                normalize(groupName),
                phoneOrRepresentative.trim(),
                dayOfWeek,
                startTime,
                meetingType,
                address.trim(),
                detail.trim(),
                province,
                districtName.trim(),
                active,
                notice.trim());
    }

    private void ensureNoBlockingIssues(List<ImportIssue> issues) {
        issues.stream()
                .filter(issue -> issue.severity() == IssueSeverity.ERROR)
                .findFirst()
                .ifPresent(issue -> {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, issue.message());
                });
    }

    private String extractPhone(String representative) {
        Matcher phoneMatcher = PHONE_PATTERN.matcher(representative);
        return phoneMatcher.find() ? phoneMatcher.group() : representative.trim();
    }

    private DayOfWeek requireDayOfWeek(String koreanDayOfWeek) {
        DayOfWeek dayOfWeek = DAY_OF_WEEK_BY_KOREAN.get(koreanDayOfWeek);
        if (dayOfWeek == null) {
            throw FieldValidationException.badRequest("html", "unsupported dayOfWeek: " + koreanDayOfWeek);
        }
        return dayOfWeek;
    }

    private LocalTime requireStartTime(String value) {
        try {
            return LocalTime.parse(value.trim(), TIME_FORMATTER);
        } catch (Exception exception) {
            throw FieldValidationException.badRequest("html", "unsupported startTime: " + value);
        }
    }

    private MeetingType requireMeetingType(String symbolOrLabel) {
        String trimmed = symbolOrLabel.trim();
        return switch (trimmed) {
            case "○", "공개" -> MeetingType.OPEN;
            case "●", "비공개" -> MeetingType.CLOSED;
            case "◐", "가변", "불확정", "가변(○,●)" -> MeetingType.NOTFIXED;
            default -> throw FieldValidationException.badRequest("html", "unsupported meeting type: " + symbolOrLabel);
        };
    }

    private Province resolveProvince(String address) {
        try {
            return Province.fromAddress(address);
        } catch (IllegalArgumentException exception) {
            throw FieldValidationException.badRequest("html", "cannot determine province from address: " + address);
        }
    }

    private String formatTime(LocalTime time) {
        return TIME_FORMATTER.format(time);
    }

    private String normalize(String value) {
        String normalized = normalizeSpaces(value).toLowerCase(Locale.ROOT);
        normalized = normalized.replaceAll("(?i)(모임|그룹)$", "");
        return normalizeSpaces(normalized).replace(" ", "");
    }

    private String normalizeSpaces(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s+", " ");
    }

    private String htmlToText(String html) {
        return normalizeSpaces(HtmlUtils.htmlUnescape(TAG_PATTERN.matcher(html).replaceAll(" ")));
    }

    private ImportIssueData toIssueData(ImportIssue issue) {
        return new ImportIssueData(
                issue.severity().name(),
                issue.code(),
                issue.message(),
                issue.groupName(),
                issue.dayOfWeek() != null ? issue.dayOfWeek().name() : null,
                issue.startTime() != null ? issue.startTime() : null);
    }

    // ---------------------------------------------------------
    // Records
    // ---------------------------------------------------------

    private record SourceMeetingRow(
            String groupName,
            String normalizedGroupName,
            String phoneOrRepresentative,
            DayOfWeek dayOfWeek,
            LocalTime startTime,
            MeetingType meetingType,
            String address,
            String detail,
            Province province,
            String districtName,
            boolean active,
            String notice
    ) {
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
            List<ImportedMeetingPlan> meetings
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
            boolean active
    ) {
        MeetingIdentity identity() {
            return new MeetingIdentity(dayOfWeek, startTime, locationAddress, locationDetail);
        }
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
