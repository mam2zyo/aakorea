UPDATE districts
SET name = btrim(name)
WHERE name <> btrim(name);

WITH canonical AS (
    SELECT MIN(id) AS keep_id, name
    FROM districts
    GROUP BY name
),
duplicate_map AS (
    SELECT d.id AS duplicate_id, canonical.keep_id
    FROM districts d
    JOIN canonical
      ON d.name = canonical.name
    WHERE d.id <> canonical.keep_id
)
UPDATE groups
SET district_id = duplicate_map.keep_id
FROM duplicate_map
WHERE groups.district_id = duplicate_map.duplicate_id;

WITH canonical AS (
    SELECT MIN(id) AS keep_id, name
    FROM districts
    GROUP BY name
)
DELETE FROM districts
USING canonical
WHERE districts.name = canonical.name
  AND districts.id <> canonical.keep_id;

CREATE UNIQUE INDEX IF NOT EXISTS uk_districts_name
ON districts (name);
