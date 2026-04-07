package org.aakorea.main.auth.domain;

public enum AdminRole {
    SYSTEM_ADMIN,
    MANAGER,
    STAFF;

    public String authority() {
        return "ROLE_" + name();
    }
}
