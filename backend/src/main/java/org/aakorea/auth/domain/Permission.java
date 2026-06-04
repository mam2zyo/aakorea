package org.aakorea.auth.domain;

import java.util.Arrays;
import java.util.Optional;

public enum Permission {
    SELF_PREFERENCES_MANAGE("self.preferences.manage"),
    DISTRICT_MANAGE("district.manage"),
    GROUP_MANAGE("group.manage"),
    NOTICE_MANAGE("notice.manage"),
    CONTENT_PAGE_MANAGE("content_page.manage"),
    CONTENT_PUBLISH("content.publish"),
    OPERATIONS_IMPORT_MANAGE("operations.import.manage"),
    OPERATIONS_COORDINATE_BACKFILL_MANAGE("operations.coordinate_backfill.manage"),
    AUDIT_VIEW("audit.view"),
    STAFF_MANAGE("staff.manage"),
    MANAGER_MANAGE("manager.manage"),
    STATS_VIEW("stats.view"),
    MENU_MANAGE("menu.manage");

    private final String key;

    Permission(String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }

    public String authority() {
        return "PERM_" + key;
    }

    public static Optional<Permission> fromKey(String key) {
        return Arrays.stream(values())
                .filter(permission -> permission.key.equals(key))
                .findFirst();
    }
}
