package org.aakorea.auth.domain;

public enum Role {
    SYSTEM_ADMIN,
    MANAGER,
    STAFF;

    public String authority() {
        return "ROLE_" + name();
    }
}
