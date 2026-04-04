package org.aakorea.main.shared;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ProvinceConverter implements AttributeConverter<Province, String> {

    @Override
    public String convertToDatabaseColumn(Province attribute) {
        return attribute == null ? null : attribute.getCode();
    }

    @Override
    public Province convertToEntityAttribute(String dbData) {
        return dbData == null ? null : Province.fromCode(dbData);
    }
}
