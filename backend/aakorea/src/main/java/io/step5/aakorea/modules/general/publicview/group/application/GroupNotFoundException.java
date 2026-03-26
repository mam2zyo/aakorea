package io.step5.aakorea.modules.general.publicview.group.application;

import io.step5.aakorea.modules.general.admin.group.domain.Group;

public class GroupNotFoundException extends RuntimeException {

    public GroupNotFoundException(Long groupId) {
        super("Group not found. id=" + groupId);
    }
}
