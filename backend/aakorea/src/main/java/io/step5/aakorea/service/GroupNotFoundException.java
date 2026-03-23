package io.step5.aakorea.service;

public class GroupNotFoundException extends RuntimeException {

    public GroupNotFoundException(Long groupId) {
        super("Group not found. id=" + groupId);
    }
}