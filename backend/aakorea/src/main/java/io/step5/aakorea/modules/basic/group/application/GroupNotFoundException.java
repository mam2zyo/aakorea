package io.step5.aakorea.modules.basic.group.application;

import io.step5.aakorea.modules.service.group.domain.Group;

public class GroupNotFoundException extends RuntimeException {

    public GroupNotFoundException(Long groupId) {
        super("Group not found. id=" + groupId);
    }
}
