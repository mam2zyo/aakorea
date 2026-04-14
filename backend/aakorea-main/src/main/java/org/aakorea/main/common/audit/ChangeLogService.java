package org.aakorea.main.common.audit;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.aakorea.main.group.domain.Meeting;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class ChangeLogService {

    private final DomainChangeLogRepository repository;
    private final ObjectMapper objectMapper;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logCreate(Object entity, Long entityId) {
        String type = entity.getClass().getSimpleName();
        Long id = entityId;
        String label = extractLabel(entity);

        if (entity instanceof Meeting meeting && meeting.getGroup() != null) {
            type = "Group";
            id = meeting.getGroup().getId();
        }

        saveLog(type, id, ChangeAction.CREATE, null, label);
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logUpdate(Object oldEntity, Object newEntity, Long entityId) {
        Object comparableOld = oldEntity;
        Object comparableNew = newEntity;

        if (oldEntity instanceof Meeting.MeetingSnapshot && newEntity instanceof Meeting newMeeting) {
            comparableNew = newMeeting.snapshot();
        }

        Map<String, Map<String, Object>> diff = calculateDiff(comparableOld, comparableNew);
        if (diff.isEmpty()) {
            return;
        }
        
        String type = newEntity.getClass().getSimpleName();
        Long id = entityId;
        String label = extractLabel(newEntity);

        if (newEntity instanceof Meeting meeting && meeting.getGroup() != null) {
            type = "Group";
            id = meeting.getGroup().getId();
        }

        try {
            String json = objectMapper.writeValueAsString(diff);
            saveLog(type, id, ChangeAction.UPDATE, json, label);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize change log diff", e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void logDelete(Class<?> entityClass, Long entityId, String label) {
        String type = entityClass.getSimpleName();
        saveLog(type, entityId, ChangeAction.DELETE, null, label);
    }

    private void saveLog(String type, Long id, ChangeAction action, String changes, String label) {
        DomainChangeLog logEntry = new DomainChangeLog(type, id, action, changes, label);
        repository.save(logEntry);
    }

    private String extractLabel(Object entity) {
        if (entity == null) return null;
        try {
            if (entity instanceof Meeting meeting) {
                String groupName = meeting.getGroup() != null ? meeting.getGroup().getName() : "Unknown";
                return "[모임] " + groupName;
            }
            
            try {
                return (String) entity.getClass().getMethod("getName").invoke(entity);
            } catch (NoSuchMethodException e) {
                try {
                    return (String) entity.getClass().getMethod("getTitle").invoke(entity);
                } catch (NoSuchMethodException e2) {
                    return null;
                }
            }
        } catch (Exception e) {
            return null;
        }
    }

    private static final java.util.Set<String> EXCLUDED_FIELDS = java.util.Set.of(
        "id", "createdAt", "createdBy", "updatedAt", "updatedBy", "version"
    );

    private Map<String, Map<String, Object>> calculateDiff(Object oldObj, Object newObj) {
        Map<String, Map<String, Object>> diff = new HashMap<>();
        Class<?> current = oldObj.getClass();
        
        while (current != null && current != Object.class) {
            Field[] fields = current.getDeclaredFields();
            for (Field field : fields) {
                String fieldName = field.getName();
                if (EXCLUDED_FIELDS.contains(fieldName) || fieldName.startsWith("$")) {
                    continue;
                }

                try {
                    field.setAccessible(true);
                    Object oldVal = field.get(oldObj);
                    Object newVal = field.get(newObj);

                    if (!Objects.equals(oldVal, newVal)) {
                        Map<String, Object> values = new HashMap<>();
                        values.put("oldValue", oldVal);
                        values.put("newValue", newVal);
                        diff.put(fieldName, values);
                    }
                } catch (IllegalAccessException e) {
                    log.warn("Could not access field {} for diff", fieldName);
                }
            }
            current = current.getSuperclass();
        }
        return diff;
    }
}
