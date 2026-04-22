-- Meeting Data Import Script
BEGIN;
TRUNCATE TABLE meetings, group_contacts, groups, districts CASCADE;

-- Group: 새희망 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '새희망' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('새희망', v_district_id, '용산역 3번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '용산역 3번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8745-1988') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8745-1988'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '13:00:00', 'OPEN', 'SEOUL', '서울특별시 용산구 새창로 144-5', '효동교회', NULL, true, NOW(), NOW());
END $$;

-- Group: 밀알 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '밀알' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('밀알', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5287-2458') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5287-2458'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '15:00:00', 'OPEN', 'SEOUL', '서울특별시 동대문구 장한로2길 14', '지혜병원 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 해상함께하는 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '해상함께하는' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('해상함께하는', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3972-5960') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3972-5960'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '17:00:00', 'CLOSED', 'SEOUL', '서울특별시 영등포구 당산로 123', '영등포보건소 4층 정신건강복지센터 프로그램실', NULL, true, NOW(), NOW());
END $$;

-- Group: 온유 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '온유' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('온유', v_district_id, '충정로역 6번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '충정로역 6번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3817-1798') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3817-1798'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '17:00:00', 'OPEN', 'SEOUL', '서울특별시 마포구 환일길 3', '아현실버복지관 5층 교육실', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '17:00:00', 'NOTFIXED', 'SEOUL', '서울특별시 마포구 환일길 3', '아현실버복지관 5층 교육실', NULL, true, NOW(), NOW());
END $$;

-- Group: 한마음 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '한마음' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('한마음', v_district_id, '충정로역 4번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '충정로역 4번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7764-6015') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7764-6015'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '18:30:00', 'OPEN', 'SEOUL', '서울특별시 중구 서소문로6길 16', '중림종합사회복지관 5층 배움터', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '18:30:00', 'CLOSED', 'SEOUL', '서울특별시 중구 서소문로6길 16', '중림종합사회복지관 5층 배움터', NULL, true, NOW(), NOW());
END $$;

-- Group: 강서 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '강서' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('강서', v_district_id, '발산역 6번 출구 300미터, 강서농협 뒷건물', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '발산역 6번 출구 300미터, 강서농협 뒷건물', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2220-1559') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2220-1559'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:00:00', 'OPEN', 'SEOUL', '서울특별시 강서구 우장산로2길 6', '사람과 공간', NULL, true, NOW(), NOW());
END $$;

-- Group: 고마움,번동 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '고마움,번동' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('고마움,번동', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4568-1723') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4568-1723'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:00:00', 'CLOSED', 'SEOUL', '서울특별시 강북구 오현로 208', '번동3단지 종합사회복지관 지하강당', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '19:00:00', 'CLOSED', 'SEOUL', '서울특별시 도봉구 도봉산3길 92', '도봉지구위원회', NULL, true, NOW(), NOW());
END $$;

-- Group: 마음을함께하는 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '마음을함께하는' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('마음을함께하는', v_district_id, '강남역 4번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '강남역 4번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2420-9397') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2420-9397'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:00:00', 'OPEN', 'SEOUL', '서울특별시 강남구 역삼로8길 12', '순복음강남교회 4층 베데스다성전', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:00:00', 'OPEN', 'SEOUL', '서울특별시 강남구 역삼로8길 12', '순복음강남교회 4층 베데스다성전', NULL, true, NOW(), NOW());
END $$;

-- Group: 럭키 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '럭키' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('럭키', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6322-5263') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6322-5263'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:30:00', 'CLOSED', 'SEOUL', '서울특별시 송파구 새말로5길 6', '자비교회 2층 201호', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:30:00', 'OPEN', 'SEOUL', '서울특별시 송파구 새말로5길 6', '자비교회 2층 201호', NULL, true, NOW(), NOW());
END $$;

-- Group: 초심 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '초심' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('초심', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8882-1896') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8882-1896'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '13:00:00', 'OPEN', 'SEOUL', '서울특별시 동대문구 천호대로83길 5', '영산장로교회 지하 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 솔샘 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '솔샘' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('솔샘', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3110-3491') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3110-3491'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '13:00:00', 'OPEN', 'SEOUL', '서울특별시 강북구 삼양로19길 154', '삼각산보건지소 2층, 강북구 중독관리통합지원센터', NULL, true, NOW(), NOW());
END $$;

-- Group: 민들레 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '민들레' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('민들레', v_district_id, '숙대입구역 2번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '숙대입구역 2번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8935-8945') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8935-8945'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '15:00:00', 'OPEN', 'SEOUL', '서울특별시 용산구 두텁바위로 25', '갈월종합사회복지관 6층', NULL, true, NOW(), NOW());
END $$;

-- Group: 감사함 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '감사함' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('감사함', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3788-2799') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3788-2799'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '15:00:00', 'OPEN', 'SEOUL', '서울특별시 강동구 구천면로 297-5', '천호보건지소 1층 정신건강복지센터', NULL, true, NOW(), NOW());
END $$;

-- Group: 우리들 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '우리들' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('우리들', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3980-0340') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3980-0340'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '15:00:00', 'OPEN', 'SEOUL', '서울특별시 동대문구 천호대로83길 5', '영산장로교회 지하 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 복정 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '복정' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('복정', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5310-0305') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5310-0305'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '17:00:00', 'CLOSED', 'SEOUL', '서울특별시 송파구 새말로5길 6', '자비교회 2층 201호', NULL, true, NOW(), NOW());
END $$;

-- Group: 참다운길 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '참다운길' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('참다운길', v_district_id, '거여역 4번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '거여역 4번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7791-7554') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7791-7554'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '18:00:00', 'OPEN', 'SEOUL', '서울특별시 송파구 오금로 513', '송파 미소병원 지하 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 면목한울 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '면목한울' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('면목한울', v_district_id, '상봉역 4번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '상봉역 4번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5598-9597') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5598-9597'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:00:00', 'OPEN', 'SEOUL', '서울특별시 중랑구 동일로114길 10', '중랑상봉도서관 5층 동아리방', NULL, true, NOW(), NOW());
END $$;

-- Group: 겨자씨 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '겨자씨' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('겨자씨', v_district_id, '신당역 3번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '신당역 3번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8990-3015') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8990-3015'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:30:00', 'CLOSED', 'SEOUL', '서울특별시 중구 퇴계로 460', '유락종합복지센터 9층 강당', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:30:00', 'OPEN', 'SEOUL', '서울특별시 중구 퇴계로 460', '유락종합복지센터 9층 강당', NULL, true, NOW(), NOW());
END $$;

-- Group: 정동하나 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '정동하나' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('정동하나', v_district_id, '서대문역 5번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '서대문역 5번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7764-6015') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7764-6015'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:30:00', 'OPEN', 'SEOUL', '서울특별시 중구 정동길 46', '정동제일교회 사회교육관 301호', NULL, true, NOW(), NOW());
END $$;

-- Group: 청심 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '청심' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('청심', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2641-6012') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2641-6012'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '12:00:00', 'OPEN', 'SEOUL', '서울특별시 도봉구 도봉산3길 92', '도봉지구위원회', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '12:00:00', 'OPEN', 'SEOUL', '서울특별시 도봉구 도봉산3길 92', '도봉지구위원회', NULL, true, NOW(), NOW());
END $$;

-- Group: 신길믿음 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '신길믿음' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('신길믿음', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6766-3849') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6766-3849'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '13:00:00', 'OPEN', 'SEOUL', '서울특별시 영등포구 영등포로 343-4', '영길작은복지센터 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 첫마음 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '첫마음' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('첫마음', v_district_id, '을지로3가역 12번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '을지로3가역 12번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8802-0495') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8802-0495'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '15:00:00', 'CLOSED', 'SEOUL', '서울특별시 중구 명동길 80', '명동성당 범우관 701호', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '15:00:00', 'OPEN', 'SEOUL', '서울특별시 중구 명동길 80', '명동성당 범우관 701호', NULL, true, NOW(), NOW());
END $$;

-- Group: 축복 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '축복' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('축복', v_district_id, '서대문역 5번 출구 경향신문사 옆', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '서대문역 5번 출구 경향신문사 옆', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5389-6857') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5389-6857'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '17:00:00', 'OPEN', 'SEOUL', '서울특별시 중구 정동길 9', '프란치스코 교육회관 621호', NULL, true, NOW(), NOW());
END $$;

-- Group: 햇빛 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '햇빛' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('햇빛', v_district_id, '선릉역 2번, 한티역 1번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '선릉역 2번, 한티역 1번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5444-9001') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5444-9001'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'OPEN', 'SEOUL', '서울특별시 강남구 선릉로 334', '혜윰교회 B1', NULL, true, NOW(), NOW());
END $$;

-- Group: 단주정신 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '단주정신' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('단주정신', v_district_id, '서대문역 5번 출구 경향신문사 옆', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '서대문역 5번 출구 경향신문사 옆', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9973-3131') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9973-3131'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'OPEN', 'SEOUL', '서울특별시 중구 정동길 9', '프란치스코 교육회관 621호', NULL, true, NOW(), NOW());
END $$;

-- Group: 열망 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '열망' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('열망', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8240-8433') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8240-8433'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'CLOSED', 'SEOUL', '서울특별시 도봉구 도봉산3길 92', '도봉지구위원회', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'CLOSED', 'SEOUL', '서울특별시 도봉구 도봉산3길 92', '도봉지구위원회', NULL, true, NOW(), NOW());
END $$;

-- Group: 한울 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '한울' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('한울', v_district_id, '신분당선 양재역 3번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '신분당선 양재역 3번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9492-8610') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9492-8610'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'CLOSED', 'SEOUL', '서울특별시 강남구 강남대로48길 14', '양재동 천주교회 지하', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '17:00:00', 'OPEN', 'SEOUL', '서울특별시 강남구 강남대로48길 14', '양재동 천주교회 지하', NULL, true, NOW(), NOW());
END $$;

-- Group: 성남정직 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '성남정직' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('성남정직', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5310-0305') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5310-0305'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:30:00', 'OPEN', 'SEOUL', '서울특별시 송파구 새말로5길 6', '자비교회 2층 201호', NULL, true, NOW(), NOW());
END $$;

-- Group: 밝은하루 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '밝은하루' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('밝은하루', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4337-0631') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4337-0631'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '15:00:00', 'OPEN', 'SEOUL', '서울특별시 동대문구 천호대로83길 5', '영산장로교회 지하 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 맑은정신 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '맑은정신' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('맑은정신', v_district_id, '서대문역 5번 출구 경향신문사 옆', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '서대문역 5번 출구 경향신문사 옆', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6266-4098') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6266-4098'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '15:00:00', 'OPEN', 'SEOUL', '서울특별시 중구 정동길 9', '프란치스코 교육회관 621호', NULL, true, NOW(), NOW());
END $$;

-- Group: 은평함께 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '은평함께' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('은평함께', v_district_id, '연신내역 3번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '연신내역 3번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9203-1835') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9203-1835'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '16:00:00', 'OPEN', 'SEOUL', '서울특별시 은평구 연서로34길 11', '불광보건지소 3층, 은평구정신건강복지센터', NULL, true, NOW(), NOW());
END $$;

-- Group: 효동 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '효동' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('효동', v_district_id, '용산역 3번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '용산역 3번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5664-8532') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5664-8532'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'OPEN', 'SEOUL', '서울특별시 용산구 새창로 144-5', '효동교회', NULL, true, NOW(), NOW());
END $$;

-- Group: 샛별 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '샛별' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('샛별', v_district_id, '보문역 7번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '보문역 7번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5936-3366') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5936-3366'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'OPEN', 'SEOUL', '서울특별시 성북구 보문로 95', '노동사목회관 6층', NULL, true, NOW(), NOW());
END $$;

-- Group: 중심 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '중심' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('중심', v_district_id, '상계역 3번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '상계역 3번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2320-8017') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2320-8017'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '12:00:00', 'CLOSED', 'SEOUL', '서울특별시 노원구 덕릉로 662', '중계종합사회복지관 지하 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 어울림 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '어울림' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('어울림', v_district_id, '숙대입구역 2번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '숙대입구역 2번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4015-3832') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4015-3832'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '13:00:00', 'OPEN', 'SEOUL', '서울특별시 용산구 두텁바위로 25', '갈월종합사회복지관 6층', NULL, true, NOW(), NOW());
END $$;

-- Group: 한길 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '한길' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('한길', v_district_id, '숙대입구역 2번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '숙대입구역 2번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6606-8307') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6606-8307'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '15:00:00', 'OPEN', 'SEOUL', '서울특별시 용산구 두텁바위로 25', '갈월종합사회복지관 6층', NULL, true, NOW(), NOW());
END $$;

-- Group: 브릿지 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '브릿지' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('브릿지', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3629-5161') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3629-5161'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '15:00:00', 'OPEN', 'SEOUL', '서울특별시 중구 정동길 9', '프란치스코 교육회관 621호', NULL, true, NOW(), NOW());
END $$;

-- Group: 희망 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '희망' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('희망', v_district_id, '거여역 7번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '거여역 7번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3526-5041') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3526-5041'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '17:00:00', 'OPEN', 'SEOUL', '서울특별시 송파구 양산로 5', '송파구 보건지소 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 같은마음 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '같은마음' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('같은마음', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5789-7283') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5789-7283'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:00:00', 'CLOSED', 'SEOUL', '서울특별시 도봉구 도봉산3길 92', '도봉지구위원회', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '17:00:00', 'OPEN', 'SEOUL', '서울특별시 도봉구 도봉산3길 92', '도봉지구위원회', NULL, true, NOW(), NOW());
END $$;

-- Group: 열린마음 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '열린마음' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('열린마음', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3724-2410') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3724-2410'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:30:00', 'NOTFIXED', 'SEOUL', '서울특별시 송파구 새말로5길 6', '자비교회 2층 201호', NULL, true, NOW(), NOW());
END $$;

-- Group: 열매 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '열매' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('열매', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9289-5224') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9289-5224'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '20:00:00', 'OPEN', 'SEOUL', '서울특별시 서초구 염곡말길 13', '염곡교회 지하 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 한사랑 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '한사랑' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('한사랑', v_district_id, '충정로역 4번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '충정로역 4번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9021-2440') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9021-2440'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '11:00:00', 'OPEN', 'SEOUL', '서울특별시 중구 서소문로6길 16', '중림종합사회복지관 5층 배움터', NULL, true, NOW(), NOW());
END $$;

-- Group: 강동열망 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '강동열망' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('강동열망', v_district_id, '명일역 4번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '명일역 4번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3977-7006') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3977-7006'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '11:00:00', 'OPEN', 'SEOUL', '서울특별시 강동구 양재대로138길 32', '명일엘지아파트상가 301호 대치감성수학', NULL, true, NOW(), NOW());
END $$;

-- Group: 우리 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '우리' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('우리', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8745-1988') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8745-1988'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '12:30:00', 'NOTFIXED', 'SEOUL', '서울특별시 송파구 새말로5길 6', '자비교회 2층 201호', NULL, true, NOW(), NOW());
END $$;

-- Group: 감나무 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '감나무' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('감나무', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3891-5016') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3891-5016'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '13:00:00', 'OPEN', 'SEOUL', '서울특별시 마포구 연남로1길 50-8', '카프치료공동체 감나무집', NULL, true, NOW(), NOW());
END $$;

-- Group: 신림동행 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '신림동행' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('신림동행', v_district_id, '낙성대역 1번, 사당역 6번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '낙성대역 1번, 사당역 6번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6219-8848') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6219-8848'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '16:00:00', 'OPEN', 'SEOUL', '서울특별시 관악구 남부순환로256길 46', '천주교구속주회유지재단', NULL, true, NOW(), NOW());
END $$;

-- Group: 두레 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '두레' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('두레', v_district_id, '신당역 3번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '신당역 3번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8218-2500') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8218-2500'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '16:30:00', 'OPEN', 'SEOUL', '서울특별시 중구 퇴계로 460', '유락종합복지센터 8층 솔뫼방', NULL, true, NOW(), NOW());
END $$;

-- Group: 사랑의명상 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '사랑의명상' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('사랑의명상', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5055-9822') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5055-9822'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '18:00:00', 'OPEN', 'SEOUL', '서울특별시 서초구 염곡말길 13', '염곡교회 지하 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 신길자유 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '신길자유' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('신길자유', v_district_id, '신길역 1번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '신길역 1번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4894-6610') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4894-6610'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '11:00:00', 'OPEN', 'SEOUL', '서울특별시 영등포구 영등포로 343-4', '영길작은복지센터 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 오늘 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '오늘' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('오늘', v_district_id, '동대문역 10번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '동대문역 10번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6292-3174') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6292-3174'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '12:00:00', 'CLOSED', 'SEOUL', '서울특별시 종로구 종로 269-5', '어르신 행복일자리센터 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 평온함 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '평온함' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('평온함', v_district_id, '군자역 3번, 중곡역 2번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '군자역 3번, 중곡역 2번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9874-3700') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9874-3700'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '15:00:00', 'OPEN', 'SEOUL', '서울특별시 광진구 능동로 360', '성곡빌딩 므두셀라실버센터 지하 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 하늘 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '하늘' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('하늘', v_district_id, '서대문역 5번 출구 경향신문사 옆', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '서대문역 5번 출구 경향신문사 옆', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9151-4373') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9151-4373'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '17:00:00', 'OPEN', 'SEOUL', '서울특별시 중구 정동길 9', '프란치스코 교육회관 630호', NULL, true, NOW(), NOW());
END $$;

-- Group: 교본연구 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '교본연구' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('교본연구', v_district_id, '서대문역 5번 출구 경향신문사 옆', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '서대문역 5번 출구 경향신문사 옆', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2658-2956') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2658-2956'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '19:00:00', 'OPEN', 'SEOUL', '서울특별시 중구 정동길 9', '프란치스코 교육회관 630호', NULL, true, NOW(), NOW());
END $$;

-- Group: 해바라기 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '해바라기' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('해바라기', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5508-1715') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5508-1715'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '19:30:00', 'OPEN', 'SEOUL', '서울특별시 송파구 새말로5길 6', '자비교회 2층 201호', NULL, true, NOW(), NOW());
END $$;

-- Group: 샘누리 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '샘누리' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('샘누리', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6299-9083') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6299-9083'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '12:00:00', 'OPEN', 'GYEONGGI', '경기도 부천시 중동로 36', '샬롬빌딩 3층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '12:00:00', 'OPEN', 'GYEONGGI', '경기도 부천시 중동로 36', '샬롬빌딩 3층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '12:00:00', 'OPEN', 'GYEONGGI', '경기도 부천시 중동로 36', '샬롬빌딩 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 상생 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '상생' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('상생', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6368-8159') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6368-8159'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '13:30:00', 'OPEN', 'GYEONGGI', '경기도 의왕시 오봉로 34', '의왕시보건소 별관 1층 정신건강복지센터 세심당', NULL, true, NOW(), NOW());
END $$;

-- Group: 밀알그룹 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '밀알그룹' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('밀알그룹', v_district_id, '매월 1째, 3째 주', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '매월 1째, 3째 주', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9962-3618') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9962-3618'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '14:00:00', 'OPEN', 'GYEONGGI', '경기도 이천시 호법면 안평리 124', '이천소망병원', NULL, true, NOW(), NOW());
END $$;

-- Group: 고양어울림 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '고양어울림' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('고양어울림', v_district_id, '강매역 도보 15분', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '강매역 도보 15분', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7124-5505') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7124-5505'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '14:00:00', 'OPEN', 'GYEONGGI', '경기도 고양시 서정마을2로 13', '덕양행신종합복지관 4층 배움 4실', NULL, true, NOW(), NOW());
END $$;

-- Group: 평촌하루 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '평촌하루' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('평촌하루', v_district_id, '유치원 입구 쪽 우측 계단', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '유치원 입구 쪽 우측 계단', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7933-5983') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7933-5983'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:00:00', 'OPEN', 'GYEONGGI', '경기도 안양시 만안구 장내로 116', '안양중앙성당 지하 1층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:00:00', 'CLOSED', 'GYEONGGI', '경기도 안양시 만안구 장내로 116', '안양중앙성당 지하 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 곤지암 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '곤지암' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('곤지암', v_district_id, '곤지암역 1번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '곤지암역 1번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8272-1840') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8272-1840'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:30:00', 'OPEN', 'GYEONGGI', '경기도 광주시 곤지암로11번길 7-17', '하늘문커뮤니티교회', NULL, true, NOW(), NOW());
END $$;

-- Group: 부천 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '부천' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('부천', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6564-8471') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6564-8471'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:30:00', 'OPEN', 'GYEONGGI', '경기도 부천시 중동로 36', '샬롬빌딩 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 새생명 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '새생명' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('새생명', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7748-9981') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7748-9981'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:30:00', 'CLOSED', 'INCHEON', '인천광역시 남동구 호구포로 776', '광성빌딩 2층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:30:00', 'OPEN', 'INCHEON', '인천광역시 남동구 호구포로 776', '광성빌딩 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 햇살 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '햇살' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('햇살', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5230-6533') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5230-6533'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '10:30:00', 'OPEN', 'GYEONGGI', '경기도 성남시 수정구 수정로 218', '수정구 보건소 5층 프로그램실', NULL, true, NOW(), NOW());
END $$;

-- Group: 행복 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '행복' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('행복', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4231-5285') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4231-5285'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '11:00:00', 'OPEN', 'GYEONGGI', '경기도 안양시 만안구 안양로 119', '계양빌딩 7층', NULL, true, NOW(), NOW());
END $$;

-- Group: 신의 약속 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '신의 약속' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('신의 약속', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5550-3192') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5550-3192'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '11:00:00', 'OPEN', 'INCHEON', '인천광역시 남동구 백범로 369', '4층 인천남동구중독관리통합지원센터', NULL, true, NOW(), NOW());
END $$;

-- Group: 징검다리 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '징검다리' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('징검다리', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5934-2643') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5934-2643'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '14:00:00', 'OPEN', 'INCHEON', '인천광역시 연수구 앵고개로 183', '남동수도사업소 2층 연수새누리', NULL, true, NOW(), NOW());
END $$;

-- Group: 상록수 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '상록수' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('상록수', v_district_id, '공휴일 모임 없음', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '공휴일 모임 없음', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5022-3279') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5022-3279'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '15:00:00', 'OPEN', 'INCHEON', '인천광역시 부평구 길주로 655', '글로리병원 2층 회의실', NULL, true, NOW(), NOW());
END $$;

-- Group: 글로리아 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '글로리아' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('글로리아', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8154-5713') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8154-5713'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '16:00:00', 'OPEN', 'GYEONGGI', '경기도 고양시 일산동구 고일로 169', '글로리아교회 소예배실', NULL, true, NOW(), NOW());
END $$;

-- Group: 약속 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '약속' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('약속', v_district_id, '한대앞역 2번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '한대앞역 2번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2412-3285') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2412-3285'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:00:00', 'OPEN', 'GYEONGGI', '경기도 안산시 상록구 광덕1로 386', '안산연세병원 7층', NULL, true, NOW(), NOW());
END $$;

-- Group: 강화 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '강화' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('강화', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9090-5398') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9090-5398'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:00:00', 'OPEN', 'INCHEON', '인천광역시 강화군 강화읍 충렬사로 26-1', '강화보건소 정신보건센터 프로그램실', NULL, true, NOW(), NOW());
END $$;

-- Group: 일산백석 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '일산백석' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('일산백석', v_district_id, '백석역 7번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '백석역 7번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8154-5713') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8154-5713'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:00:00', 'OPEN', 'GYEONGGI', '경기도 고양시 일산로 86', '카프성모병원 1층 카프이용센터', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '16:00:00', 'OPEN', 'GYEONGGI', '경기도 고양시 일산로 86', '카프성모병원 1층 카프이용센터', NULL, true, NOW(), NOW());
END $$;

-- Group: 수원성 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '수원성' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('수원성', v_district_id, '성균관대역 2번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '성균관대역 2번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6381-9208') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6381-9208'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:30:00', 'NOTFIXED', 'GYEONGGI', '경기도 수원시 덕영대로439번길 18-10', '수원성교회 봉사관 214호', NULL, true, NOW(), NOW());
END $$;

-- Group: 회복 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '회복' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('회복', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5550-3192') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5550-3192'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:30:00', 'OPEN', 'GYEONGGI', '경기도 부천시 중동로 36', '샬롬빌딩 3층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:30:00', 'OPEN', 'GYEONGGI', '경기도 부천시 중동로 36', '샬롬빌딩 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 새길 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '새길' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('새길', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4711-6253') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4711-6253'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:30:00', 'OPEN', 'INCHEON', '인천광역시 남동구 남동대로922번길 54', '새희망병원 별관 2층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:30:00', 'OPEN', 'INCHEON', '인천광역시 남동구 남동대로922번길 54', '새희망병원 별관 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 호매실사랑 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '호매실사랑' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('호매실사랑', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8791-7701') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8791-7701'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '11:00:00', 'OPEN', 'GYEONGGI', '경기도 수원시 금곡로196번길 61', '예수호매실교회 (SG프라자 4층)', NULL, true, NOW(), NOW());
END $$;

-- Group: 낙타 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '낙타' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('낙타', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7922-7248') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7922-7248'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '12:00:00', 'OPEN', 'GYEONGGI', '경기도 광명시 목감로 120', '광명장애인종합복지관 1층 상담실', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '12:00:00', 'OPEN', 'GYEONGGI', '경기도 광명시 목감로 120', '광명장애인종합복지관 1층 상담실', NULL, true, NOW(), NOW());
END $$;

-- Group: 함께 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '함께' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('함께', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8256-4947') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8256-4947'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '15:00:00', 'OPEN', 'INCHEON', '인천광역시 남동구 호구포로 776', '광성빌딩 2층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '14:00:00', 'OPEN', 'INCHEON', '인천광역시 남동구 호구포로 776', '광성빌딩 2층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '15:00:00', 'OPEN', 'INCHEON', '인천광역시 남동구 호구포로 776', '광성빌딩 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 일산동구 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '일산동구' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('일산동구', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5528-2046') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5528-2046'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '15:00:00', 'OPEN', 'GYEONGGI', '경기도 고양시 일산동구 중앙로 1100', '일산동구 보건소 별관 1층 프로그램실', NULL, true, NOW(), NOW());
END $$;

-- Group: 희망 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '희망' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('희망', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9174-8945') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9174-8945'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '15:30:00', 'OPEN', 'INCHEON', '인천광역시 부평구 마장로410번길 5', '부평구 중독관리통합지원센터 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 새싹 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '새싹' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('새싹', v_district_id, '4월~', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '4월~', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5348-1624') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5348-1624'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '17:00:00', 'OPEN', 'GYEONGGI', '경기도 광주시 중앙로 199', '3층 정신건강센터 남자휴게실', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '17:00:00', 'OPEN', 'GYEONGGI', '경기도 광주시 중앙로 199', '3층 정신건강센터 남자휴게실', NULL, true, NOW(), NOW());
END $$;

-- Group: 김포 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '김포' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('김포', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9165-1934') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9165-1934'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '18:40:00', 'OPEN', 'GYEONGGI', '경기도 김포시 사우중로 100', '김포시 사회복지관 2층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '15:00:00', 'OPEN', 'GYEONGGI', '경기도 김포시 사우중로 100', '김포시 사회복지관 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 안산 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '안산' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('안산', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8928-1590') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8928-1590'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'OPEN', 'GYEONGGI', '경기도 안산시 단원구 화랑로 387', '안산시 중독관리통합지원센터', NULL, true, NOW(), NOW());
END $$;

-- Group: 평택단순한 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '평택단순한' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('평택단순한', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5212-3734') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5212-3734'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'CLOSED', 'GYEONGGI', '경기도 평택시 평택로 22', '합정종합사회복지관 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 늘푸른 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '늘푸른' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('늘푸른', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8628-4951') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8628-4951'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:30:00', 'OPEN', 'GYEONGGI', '경기도 의왕시 등칙골1길 22', '다사랑병원 2층 대강당', NULL, true, NOW(), NOW());
END $$;

-- Group: 노을 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '노을' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('노을', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3447-9151') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3447-9151'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:30:00', 'OPEN', 'GYEONGGI', '경기도 부천시 중동로 36', '샬롬빌딩 3층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:30:00', 'OPEN', 'GYEONGGI', '경기도 부천시 중동로 36', '샬롬빌딩 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 소망 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '소망' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('소망', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6336-8694') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6336-8694'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:30:00', 'OPEN', 'INCHEON', '인천광역시 남동구 호구포로 776', '광성빌딩 2층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '19:30:00', 'CLOSED', 'INCHEON', '인천광역시 남동구 호구포로 776', '광성빌딩 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 복사골 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '복사골' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('복사골', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3390-6249') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3390-6249'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '11:00:00', 'OPEN', 'GYEONGGI', '경기도 부천시 중동로 36', '샬롬빌딩 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 성남늘푸른 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '성남늘푸른' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('성남늘푸른', v_district_id, '모란역 4번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '모란역 4번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2317-1163') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2317-1163'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '11:00:00', 'OPEN', 'GYEONGGI', '경기도 성남시 둔촌대로 118', '성남동성당 안나의집 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 선택 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '선택' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('선택', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9615-1656') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9615-1656'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '14:00:00', 'OPEN', 'INCHEON', '인천광역시 계양구 계양대로 126', '계양구 중독관리센터 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 초월 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '초월' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('초월', v_district_id, '초월역 1번 출구 좌측 400m', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '초월역 1번 출구 좌측 400m', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8272-1840') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8272-1840'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '14:00:00', 'OPEN', 'GYEONGGI', '경기도 광주시 경충대로 1030-6', '초월성신교회 유아실', NULL, true, NOW(), NOW());
END $$;

-- Group: 크로바 여성 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '크로바 여성' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('크로바 여성', v_district_id, '여성만 참석 가능', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '여성만 참석 가능', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2477-9997') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2477-9997'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '15:30:00', 'OPEN', 'GYEONGGI', '경기도 수원시 팔달구 매산로 3가 43-1', '수원시 중독관리센터', NULL, true, NOW(), NOW());
END $$;

-- Group: 파주나눔 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '파주나눔' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('파주나눔', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9253-5111') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9253-5111'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '16:00:00', 'OPEN', 'GYEONGGI', '경기도 파주시 조리읍 봉천로 68', '파주시 중독관리통합지원센터 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 의정부겨자씨 (수도권 북부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 북부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 북부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '의정부겨자씨' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('의정부겨자씨', v_district_id, '의정부역 7번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '의정부역 7번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2009-2400') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2009-2400'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'OPEN', 'GYEONGGI', '경기도 의정부시 평화로 447', '한서중앙병원 신관 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 크로바 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '크로바' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('크로바', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2477-9997') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2477-9997'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'OPEN', 'GYEONGGI', '경기도 수원시 팔달구 매산로 3가 43-1', '수원시 중독관리통합지원센터', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '14:30:00', 'OPEN', 'GYEONGGI', '경기도 수원시 팔달구 매산로 3가 43-1', '수원시 중독관리통합지원센터', NULL, true, NOW(), NOW());
END $$;

-- Group: 받아들임 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '받아들임' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('받아들임', v_district_id, '모임 장소 앞 주차 금지, 아래쪽 주차장 이용', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '모임 장소 앞 주차 금지, 아래쪽 주차장 이용', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9099-8622') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9099-8622'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'OPEN', 'GYEONGGI', '경기도 의왕시 오전로 15', '계요병원 1층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '14:00:00', 'OPEN', 'GYEONGGI', '경기도 의왕시 오전로 15', '계요병원 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 용인부활 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '용인부활' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('용인부활', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8920-8259') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8920-8259'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'OPEN', 'GYEONGGI', '경기도 용인시 처인구 백옥대로1402번길 2', '한일빌딩 1층 라파엘주얼리', NULL, true, NOW(), NOW());
END $$;

-- Group: 주엽사랑 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '주엽사랑' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('주엽사랑', v_district_id, '주엽역 1번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '주엽역 1번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8824-4917') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8824-4917'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'OPEN', 'GYEONGGI', '경기도 고양시 주화로 48', '주엽동성당 지하 B11호, 성요아킴방', NULL, true, NOW(), NOW());
END $$;

-- Group: 온유한 마음 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '온유한 마음' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('온유한 마음', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6395-7459') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6395-7459'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '11:00:00', 'OPEN', 'GYEONGGI', '경기도 부천시 중동로 36', '샬롬빌딩 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 인천새마음 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '인천새마음' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('인천새마음', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8669-2403') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8669-2403'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '14:00:00', 'OPEN', 'INCHEON', '인천광역시 계양구 계양대로 126', '계양구 중독관리통합지원센터 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 문산 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '문산' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('문산', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4186-4740') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4186-4740'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:00:00', 'OPEN', 'GYEONGGI', '경기도 파주시 문산읍 문향로67번길 38', '문산성당 교육관', NULL, true, NOW(), NOW());
END $$;

-- Group: 오산 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '오산' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('오산', v_district_id, '오산대역 1번 출구, 700m', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '오산대역 1번 출구, 700m', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5411-9578') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5411-9578'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:30:00', 'OPEN', 'GYEONGGI', '경기도 오산시 내삼미로80번길 36-4', '좋은이웃교회', NULL, true, NOW(), NOW());
END $$;

-- Group: 안전지대 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '안전지대' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('안전지대', v_district_id, '백석역 7번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '백석역 7번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5528-2046') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5528-2046'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '11:00:00', 'OPEN', 'GYEONGGI', '경기도 고양시 일산동구 일산로 86', '1층, 카프성모병원 내 카프이용센터', NULL, true, NOW(), NOW());
END $$;

-- Group: 인천등불 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '인천등불' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('인천등불', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8628-4951') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8628-4951'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '14:00:00', 'CLOSED', 'GYEONGGI', '경기도 부천시 중동로 36', '샬롬빌딩 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 구원 (수도권 남부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 남부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 남부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '구원' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('구원', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8633-9607') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8633-9607'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '17:00:00', 'OPEN', 'GYEONGGI', '경기도 용인시 기흥구 동백죽전대로 363', '용인세브란스병원 4층 예배실', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '15:00:00', 'OPEN', 'GYEONGGI', '경기도 용인시 기흥구 동백죽전대로 363', '용인세브란스병원 4층 예배실', NULL, true, NOW(), NOW());
END $$;

-- Group: 정서진 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '정서진' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('정서진', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3884-4115') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3884-4115'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '19:30:00', 'OPEN', 'INCHEON', '인천광역시 서구 원창로240번길 9', '참사랑병원 1층 프로그램실', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '19:30:00', 'OPEN', 'INCHEON', '인천광역시 서구 원창로240번길 9', '참사랑병원 1층 프로그램실', NULL, true, NOW(), NOW());
END $$;

-- Group: 성남 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '성남' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('성남', v_district_id, '모란역 4번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '모란역 4번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8644-7570') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8644-7570'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '19:30:00', 'OPEN', 'GYEONGGI', '경기도 성남시 둔촌대로 118', '성남동성당 안나의집 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 계산 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '계산' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('계산', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8832-7282') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8832-7282'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '14:00:00', 'CLOSED', 'INCHEON', '인천광역시 계양구 작전동 910-5', '보람병원 7층 프로그램실', NULL, true, NOW(), NOW());
END $$;

-- Group: 금촌 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '금촌' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('금촌', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8824-4917') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8824-4917'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '15:00:00', 'OPEN', 'GYEONGGI', '경기도 파주시 금정28길 13-17', '금촌성당', NULL, true, NOW(), NOW());
END $$;

-- Group: 행복나눔 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '행복나눔' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('행복나눔', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8628-4951') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8628-4951'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '16:30:00', 'OPEN', 'GYEONGGI', '경기도 시흥시 호현로103번길 25', '로뎀나무작은도서관 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 일산우리 (수도권 서부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 서부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 서부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '일산우리' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('일산우리', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8034-1903') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8034-1903'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '17:00:00', 'OPEN', 'GYEONGGI', '경기도 고양시 일산서구 일청로35번길 41', '일산성당', NULL, true, NOW(), NOW());
END $$;

-- Group: 수지 (수도권 동부연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '수도권 동부연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('수도권 동부연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '수지' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('수지', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5652-1911') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5652-1911'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '19:00:00', 'OPEN', 'GYEONGGI', '경기도 용인시 수지구 수풍로116번길 22', '느티나무도서관', NULL, true, NOW(), NOW());
END $$;

-- Group: 새빛 (인천연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '인천연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('인천연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '새빛' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('새빛', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4566-2545') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4566-2545'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '19:30:00', 'CLOSED', 'INCHEON', '인천광역시 남동구 호구포로 776', '광성빌딩 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 김해디딤돌 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '김해디딤돌' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('김해디딤돌', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9159-9303') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9159-9303'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:30:00', 'CLOSED', 'GYEONGNAM', '경상남도 김해시 가락로49번길 14', '2층 (구)수화당한약방', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:30:00', 'CLOSED', 'GYEONGNAM', '경상남도 김해시 가락로49번길 14', '2층 (구)수화당한약방', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '16:00:00', 'CLOSED', 'GYEONGNAM', '경상남도 김해시 가락로49번길 14', '2층 (구)수화당한약방', '010-4828-8378', true, NOW(), NOW());
END $$;

-- Group: 등대 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '등대' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('등대', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4783-8601') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4783-8601'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:30:00', 'CLOSED', 'BUSAN', '부산광역시 부산진구 신천대로 193-1', '에스티 빌딩 401호', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '16:00:00', 'CLOSED', 'BUSAN', '부산광역시 부산진구 신천대로 193-1', '에스티 빌딩 401호', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '18:00:00', 'CLOSED', 'BUSAN', '부산광역시 부산진구 신천대로 193-1', '에스티 빌딩 401호', NULL, true, NOW(), NOW());
END $$;

-- Group: 은빛 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '은빛' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('은빛', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3834-3065') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3834-3065'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:30:00', 'OPEN', 'BUSAN', '부산광역시 사하구 다송로 53', '다대성당', NULL, true, NOW(), NOW());
END $$;

-- Group: 나눔 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '나눔' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('나눔', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5672-0284') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5672-0284'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '16:00:00', 'OPEN', 'BUSAN', '부산광역시 부산진구 새싹로14번길 7', '가야교회 부전성전 1층 소그룹실', NULL, true, NOW(), NOW());
END $$;

-- Group: 부경새빛 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '부경새빛' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('부경새빛', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3156-6924') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3156-6924'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:30:00', 'OPEN', 'BUSAN', '부산광역시 사하구 하단동 354', '하단성당', NULL, true, NOW(), NOW());
END $$;

-- Group: 해운대 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '해운대' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('해운대', v_district_id, '중동역 6, 8번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '중동역 6, 8번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6613-2939') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6613-2939'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:30:00', 'CLOSED', 'BUSAN', '부산광역시 해운대구 대천로 12', '해운대순복음교회 본관 10층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:30:00', 'NOTFIXED', 'BUSAN', '부산광역시 해운대구 대천로 12', '해운대순복음교회 본관 10층', NULL, true, NOW(), NOW());
END $$;

-- Group: 마산새출발 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '마산새출발' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('마산새출발', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2107-2716') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2107-2716'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:30:00', 'CLOSED', 'GYEONGNAM', '경상남도 창원시 마산회원구 합성옛길 323', '동아건축 지하', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:30:00', 'OPEN', 'GYEONGNAM', '경상남도 창원시 마산회원구 합성옛길 323', '동아건축 지하', NULL, true, NOW(), NOW());
END $$;

-- Group: 김해강동 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '김해강동' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('김해강동', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3718-2792') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3718-2792'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'OPEN', 'GYEONGNAM', '경상남도 김해시 강동로 65', '한사랑병원 1층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '19:00:00', 'OPEN', 'GYEONGNAM', '경상남도 김해시 강동로 65', '한사랑병원 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 마음사랑 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '마음사랑' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('마음사랑', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3703-2616') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3703-2616'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:30:00', 'CLOSED', 'GYEONGNAM', '경상남도 거창군 거함대로 3079', '거창군 보건소 1층 건강증진실', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '16:00:00', 'OPEN', 'GYEONGNAM', '경상남도 거창군 거함대로 3079', '거창군 보건소 1층 건강증진실', NULL, true, NOW(), NOW());
END $$;

-- Group: 횃불 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '횃불' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('횃불', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6383-0481') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6383-0481'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:30:00', 'CLOSED', 'BUSAN', '부산광역시 동래구 중앙대로 1331', '참살이 하우스 3층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '19:30:00', 'CLOSED', 'BUSAN', '부산광역시 동래구 중앙대로 1331', '참살이 하우스 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 양산 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '양산' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('양산', v_district_id, '박내과 맞은편 4층 건물 / 박내과 맞은편 건물', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '박내과 맞은편 4층 건물 / 박내과 맞은편 건물', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2531-1148') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2531-1148'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:30:00', 'OPEN', 'GYEONGNAM', '경상남도 양산시 북안남6길 11', '403호', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '19:30:00', 'OPEN', 'GYEONGNAM', '경상남도 양산시 북안남6길 11', '403호', NULL, true, NOW(), NOW());
END $$;

-- Group: 희망 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '희망' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('희망', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7191-6373') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7191-6373'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '14:00:00', 'CLOSED', 'BUSAN', '부산광역시 서구 구덕로286번길 10', '동대신성당 2교리실', NULL, true, NOW(), NOW());
END $$;

-- Group: 샛별 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '샛별' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('샛별', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2065-0309') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2065-0309'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '16:00:00', 'CLOSED', 'BUSAN', '부산광역시 부산진구 새싹로14번길 7', '가야교회 부전성전 1층 소그룹실', NULL, true, NOW(), NOW());
END $$;

-- Group: 진주남강 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '진주남강' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('진주남강', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6550-4843') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6550-4843'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'OPEN', 'GYEONGNAM', '경상남도 진주시 가좌동 480-7', '컴포즈커피 경상대정문점', NULL, true, NOW(), NOW());
END $$;

-- Group: 큰빛 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '큰빛' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('큰빛', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9606-9509') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9606-9509'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:30:00', 'OPEN', 'BUSAN', '부산광역시 중구 중구로 71', '가톨릭센터 4층', NULL, true, NOW(), NOW());
END $$;

-- Group: 구포 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '구포' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('구포', v_district_id, '2호선 화명역 2번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '2호선 화명역 2번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2823-6540') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2823-6540'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:30:00', 'NOTFIXED', 'BUSAN', '부산광역시 북구 와석장터로 12', '화명성당 104호', NULL, true, NOW(), NOW());
END $$;

-- Group: 반송 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '반송' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('반송', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5679-0745') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5679-0745'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:30:00', 'NOTFIXED', 'BUSAN', '부산광역시 해운대구 반송로 884', '반송성당 교리실 3-2', NULL, true, NOW(), NOW());
END $$;

-- Group: 포도나무 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '포도나무' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('포도나무', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7194-7902') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7194-7902'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:30:00', 'OPEN', 'GYEONGNAM', '경상남도 김해시 가락로49번길 14', '2층 (구)수화당한약방', NULL, true, NOW(), NOW());
END $$;

-- Group: 사과나무 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '사과나무' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('사과나무', v_district_id, '서면역 9번 출구 400m', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '서면역 9번 출구 400m', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3000-6557') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3000-6557'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '11:30:00', 'OPEN', 'BUSAN', '부산광역시 부산진구 부전로 103', '서면성당', NULL, true, NOW(), NOW());
END $$;

-- Group: 무지개 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '무지개' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('무지개', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5805-2046') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5805-2046'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '14:00:00', 'OPEN', 'BUSAN', '부산광역시 사상구 사상로250번길 69', '천주교 사상성당 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 다락방 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '다락방' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('다락방', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5792-6326') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5792-6326'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '11:00:00', 'OPEN', 'BUSAN', '부산광역시 금정구 오륜대로 74', '부산가톨릭대 라파엘관 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 부산새길 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '부산새길' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('부산새길', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4222-6382') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4222-6382'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '15:00:00', 'CLOSED', 'BUSAN', '부산광역시 중구 중구로 71', '가톨릭센터 4층 402호', NULL, true, NOW(), NOW());
END $$;

-- Group: 울산반석 (울산연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '울산연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('울산연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '울산반석' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('울산반석', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8856-9363') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8856-9363'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:30:00', 'CLOSED', 'ULSAN', '울산광역시 남구 법대로95번길 17', '울산옥동성당 교육관 1층 시설분과사무실', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:30:00', 'CLOSED', 'ULSAN', '울산광역시 남구 법대로95번길 17', '울산옥동성당 교육관 1층 시설분과사무실', NULL, true, NOW(), NOW());
END $$;

-- Group: 울산편안한 (울산연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '울산연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('울산연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '울산편안한' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('울산편안한', v_district_id, '3층 건물', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '3층 건물', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9209-3217') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9209-3217'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:30:00', 'CLOSED', 'ULSAN', '울산광역시 중구 산전길 26', '농우곱창 지하 1층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:30:00', 'CLOSED', 'ULSAN', '울산광역시 중구 산전길 26', '농우곱창 지하 1층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '14:00:00', 'OPEN', 'ULSAN', '울산광역시 중구 산전길 26', '농우곱창 지하 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 울산하늘소리 (울산연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '울산연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('울산연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '울산하늘소리' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('울산하늘소리', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7441-2944') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7441-2944'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '19:30:00', 'NOTFIXED', 'ULSAN', '울산광역시 중구 학성1길 54', '금마아케이드 205호', NULL, true, NOW(), NOW());
END $$;

-- Group: 상주열망 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '상주열망' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('상주열망', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3533-2022') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3533-2022'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '11:00:00', 'OPEN', 'GYEONGBUK', '경상북도 상주시 경상대로 3023', '상주시 정신건강복지센터 내', NULL, true, NOW(), NOW());
END $$;

-- Group: 대구드림 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '대구드림' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('대구드림', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3515-0644') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3515-0644'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '15:30:00', 'OPEN', 'DAEGU', '대구광역시 중구 중앙대로 289-36', '남산동 커뮤니티센터 1층 회의실', NULL, true, NOW(), NOW());
END $$;

-- Group: 대구겨자씨 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '대구겨자씨' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('대구겨자씨', v_district_id, '1호선 월촌역 1번 출구 500m', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '1호선 월촌역 1번 출구 500m', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8527-5607') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8527-5607'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '18:50:00', 'OPEN', 'DAEGU', '대구광역시 달서구 송현로 113', '본동 주공복지관 2층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '18:50:00', 'OPEN', 'DAEGU', '대구광역시 달서구 송현로 113', '본동 주공복지관 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 대구솔잎 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '대구솔잎' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('대구솔잎', v_district_id, '2호선 강창역 1번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '2호선 강창역 1번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4568-7024') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4568-7024'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:00:00', 'CLOSED', 'DAEGU', '대구광역시 달서구 달구벌대로205길 24', '대호원룸 003호', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'CLOSED', 'DAEGU', '대구광역시 달서구 달구벌대로205길 24', '대호원룸 003호', NULL, true, NOW(), NOW());
END $$;

-- Group: 포항해맞이 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '포항해맞이' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('포항해맞이', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2685-5630') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2685-5630'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:30:00', 'CLOSED', 'GYEONGBUK', '경상북도 포항시 남구 송림로31번길 20-2', '101호', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:30:00', 'CLOSED', 'GYEONGBUK', '경상북도 포항시 남구 송림로31번길 20-2', '101호', NULL, true, NOW(), NOW());
END $$;

-- Group: 해밀 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '해밀' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('해밀', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3217-9888') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3217-9888'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '16:00:00', 'CLOSED', 'DAEGU', '대구광역시 동구 화랑로 169', '대동병원 8층 소강당', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '16:00:00', 'CLOSED', 'DAEGU', '대구광역시 동구 화랑로 169', '대동병원 8층 소강당', NULL, true, NOW(), NOW());
END $$;

-- Group: 문경새재 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '문경새재' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('문경새재', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8554-7645') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8554-7645'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '18:00:00', 'OPEN', 'GYEONGBUK', '경상북도 문경시 문경읍 하리2길 5', '아카데미 내', NULL, true, NOW(), NOW());
END $$;

-- Group: 구미금오산 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '구미금오산' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('구미금오산', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6528-2478') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6528-2478'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:00:00', 'NOTFIXED', 'GYEONGBUK', '경상북도 구미시 야은로45길 13', '신평성당 204호', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'NOTFIXED', 'GYEONGBUK', '경상북도 구미시 야은로45길 13', '신평성당 204호', NULL, true, NOW(), NOW());
END $$;

-- Group: 대구새희망 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '대구새희망' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('대구새희망', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7374-2597') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7374-2597'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:00:00', 'CLOSED', 'DAEGU', '대구광역시 수성구 동대구로 386', '킹덤오피스텔 지하 1층 15호', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '19:00:00', 'OPEN', 'DAEGU', '대구광역시 수성구 동대구로 386', '킹덤오피스텔 지하 1층 15호', NULL, true, NOW(), NOW());
END $$;

-- Group: 영일만무지개 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '영일만무지개' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('영일만무지개', v_district_id, '선린요양 뒤쪽 주택 1층', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '선린요양 뒤쪽 주택 1층', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2809-8833') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2809-8833'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:30:00', 'CLOSED', 'GYEONGBUK', '경상북도 포항시 북구 대신로31번길 14', '1층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:30:00', 'CLOSED', 'GYEONGBUK', '경상북도 포항시 북구 대신로31번길 14', '1층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '15:00:00', 'OPEN', 'GYEONGBUK', '경상북도 포항시 북구 대신로31번길 14', '1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 대구새마음 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '대구새마음' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('대구새마음', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5730-4289') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5730-4289'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'CLOSED', 'DAEGU', '대구광역시 동구 화랑로 169', '대동병원 601호', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '13:00:00', 'CLOSED', 'DAEGU', '대구광역시 동구 화랑로 169', '대동병원 601호', NULL, true, NOW(), NOW());
END $$;

-- Group: 김천은하수 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '김천은하수' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('김천은하수', v_district_id, '김천역 맞은편', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '김천역 맞은편', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3507-1101') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3507-1101'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'OPEN', 'GYEONGBUK', '경상북도 김천시 김천로 108-1', '명동커피숍, 파리바게뜨 건물 4층', NULL, true, NOW(), NOW());
END $$;

-- Group: 대구 드림 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '대구 드림' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('대구 드림', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3515-0644') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3515-0644'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '15:30:00', 'OPEN', 'DAEGU', '대구광역시 중구 중앙대로 289-36', '남산동 커뮤니티센터 1층 회의실', NULL, true, NOW(), NOW());
END $$;

-- Group: 영천별빛 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '영천별빛' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('영천별빛', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4507-2052') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4507-2052'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '16:00:00', 'CLOSED', 'GYEONGBUK', '경상북도 영천시 상록4길 25', '야사주공 2단지 202동 105호', NULL, true, NOW(), NOW());
END $$;

-- Group: 대경여성 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '대경여성' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('대경여성', v_district_id, '매월 첫째 주 일요일', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '매월 첫째 주 일요일', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7486-0300') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7486-0300'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '13:00:00', 'OPEN', 'GYEONGBUK', '경상북도 포항시 북구 대신로31번길 14', '1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 징검다리 (대경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '대경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('대경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '징검다리' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('징검다리', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9265-4144') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9265-4144'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '15:00:00', 'OPEN', 'DAEGU', '대구광역시 북구 팔거천동로 199', '동천성당 105호', NULL, true, NOW(), NOW());
END $$;

-- Group: 나주빛가람 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '나주빛가람' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('나주빛가람', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8552-4621') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8552-4621'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '14:00:00', 'OPEN', 'JEONNAM', '전라남도 나주시 우정로 106', '토담스타타워 B동 308호', NULL, true, NOW(), NOW());
END $$;

-- Group: 빛고을 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '빛고을' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('빛고을', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4801-2332') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4801-2332'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:00:00', 'CLOSED', 'GWANGJU', '광주광역시 서구 풍서우로 224', '다사랑병원 1층 세미나실', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'CLOSED', 'GWANGJU', '광주광역시 서구 풍서우로 224', '다사랑병원 1층 세미나실', '010-9420-4470', true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:00:00', 'OPEN', 'GWANGJU', '광주광역시 서구 풍서우로 224', '다사랑 병원 1층 세미나실', '010-9420-4470', true, NOW(), NOW());
END $$;

-- Group: 영광열망 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '영광열망' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('영광열망', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2557-9991') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2557-9991'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:00:00', 'CLOSED', 'JEONNAM', '전라남도 영광군 영광읍 단신길1길 6', '', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'OPEN', 'JEONNAM', '전라남도 영광군 영광읍 단신길1길 6', '', NULL, true, NOW(), NOW());
END $$;

-- Group: 사랑 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '사랑' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('사랑', v_district_id, '송정공원역 4번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '송정공원역 4번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9937-5081') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9937-5081'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:00:00', 'OPEN', 'GWANGJU', '광주광역시 광산구 상무대로 309-1', '황금마트 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 평온함 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '평온함' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('평온함', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3954-4312') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3954-4312'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:00:00', 'OPEN', 'GWANGJU', '광주광역시 북구 태봉로 32', '천주의 성요한 병원 본관 2층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'CLOSED', 'GWANGJU', '광주광역시 북구 태봉로 32', '천주의 성요한 병원 본관 2층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '19:00:00', 'CLOSED', 'GWANGJU', '광주광역시 북구 태봉로 32', '천주의 성요한 병원 본관 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 익산한울타리 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '익산한울타리' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('익산한울타리', v_district_id, '건물 뒤 후문으로, 2층 오른쪽', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '건물 뒤 후문으로, 2층 오른쪽', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3943-6696') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3943-6696'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:00:00', 'OPEN', 'JEONBUK', '전북특별자치도 익산시 무왕로 975', '익산보건소 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 등불 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '등불' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('등불', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2613-0330') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2613-0330'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '14:00:00', 'NOTFIXED', 'GWANGJU', '광주광역시 북구 중가로 26', '광주광역시 북구 중독관리통합지원센터 4층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '17:00:00', 'NOTFIXED', 'GWANGJU', '광주광역시 북구 중가로 26', '광주광역시 북구 중독관리통합지원센터 4층', '010-3119-8502', true, NOW(), NOW());
END $$;

-- Group: 화순새싹 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '화순새싹' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('화순새싹', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3440-7286') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3440-7286'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '15:00:00', 'OPEN', 'JEONNAM', '전라남도 화순군 도곡면 고인돌1로 282-14', '화순보은병원', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '18:00:00', 'CLOSED', 'JEONNAM', '전라남도 화순군 도곡면 고인돌1로 282-14', '화순보은병원', NULL, true, NOW(), NOW());
END $$;

-- Group: Again (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = 'Again' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('Again', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7665-3592') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7665-3592'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'OPEN', 'GWANGJU', '광주광역시 남구 독립로 25-1', '광주광역시 남구 중독관리통합지원센터 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 빛고을여성 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '빛고을여성' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('빛고을여성', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2587-3797') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2587-3797'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '16:30:00', 'CLOSED', 'GWANGJU', '광주광역시 서구 풍서우로 224', '다사랑병원 1층 마음홀', NULL, true, NOW(), NOW());
END $$;

-- Group: 여정 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '여정' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('여정', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3685-3264') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3685-3264'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '17:00:00', 'OPEN', 'JEONNAM', '전라남도 여수시 시청서4길 47', '전라남도 여수시 중독관리통합지원센터 내', NULL, true, NOW(), NOW());
END $$;

-- Group: 다락방 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '다락방' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('다락방', v_district_id, '송정공원역 4번 출구', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '송정공원역 4번 출구', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3912-1256') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3912-1256'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'NOTFIXED', 'GWANGJU', '광주광역시 광산구 상무대로 309-1', '황금마트 3층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '19:00:00', 'NOTFIXED', 'GWANGJU', '광주광역시 광산구 상무대로 309-1', '황금마트 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 전주나누리 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '전주나누리' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('전주나누리', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9699-5514') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9699-5514'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'CLOSED', 'JEONBUK', '전북특별자치도 전주시 완산구 물왕멀2길 23', '마음건강복지관 2층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '18:00:00', 'OPEN', 'JEONBUK', '전북특별자치도 전주시 완산구 물왕멀2길 23', '마음건강복지관 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 어깨동무 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '어깨동무' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('어깨동무', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5530-7619') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5530-7619'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:00:00', 'OPEN', 'JEONBUK', '전북특별자치도 군산시 나운5길 46', '맘투맘심리상담센터 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 목포축복 (호남연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '호남연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('호남연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '목포축복' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('목포축복', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6358-5030') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6358-5030'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '15:00:00', 'OPEN', 'JEONNAM', '전라남도 목포시 양을로33번길 6', '천주교 대성동교회 사무실 2층 휴게실', NULL, true, NOW(), NOW());
END $$;

-- Group: 대전징검다리 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '대전징검다리' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('대전징검다리', v_district_id, '대전역 오른쪽 100m', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '대전역 오른쪽 100m', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6220-1250') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6220-1250'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:00:00', 'OPEN', 'DAEJEON', '대전광역시 동구 대전로 835', '약손 한의원 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 청주푸른 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '청주푸른' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('청주푸른', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3806-3192') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3806-3192'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:00:00', 'OPEN', 'CHUNGBUK', '충청북도 청주시 청원구 1순환로341번길 76', '1층 북카페', NULL, true, NOW(), NOW());
END $$;

-- Group: 천안새하늘 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '천안새하늘' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('천안새하늘', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8840-3435') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8840-3435'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:30:00', 'CLOSED', 'CHUNGNAM', '충청남도 천안시 동남구 버들로 40', '동남구 보건소 별관 중독관리센터 1층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:30:00', 'OPEN', 'CHUNGNAM', '충청남도 천안시 동남구 버들로 40', '동남구 보건소 별관 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 새로남 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '새로남' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('새로남', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7130-7691') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7130-7691'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '15:00:00', 'OPEN', 'CHUNGBUK', '충청북도 청주시 상당구 보청대로 4673-61', '주사랑병원 3층 재활훈련실', NULL, true, NOW(), NOW());
END $$;

-- Group: 단주뉴스 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '단주뉴스' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('단주뉴스', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8388-7440') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8388-7440'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '16:00:00', 'OPEN', 'DAEJEON', '대전광역시 동구 동대전로 272', '가양 4가 타임빌딩 502호', NULL, true, NOW(), NOW());
END $$;

-- Group: 사랑방 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '사랑방' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('사랑방', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2488-9861') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2488-9861'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '16:30:00', 'OPEN', 'CHUNGBUK', '충청북도 청주시 상당구 대성로172번길 21', '흥덕보건소 별관 4층 중독관리센터', NULL, true, NOW(), NOW());
END $$;

-- Group: 대전한빛 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '대전한빛' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('대전한빛', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9793-5560') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9793-5560'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:00:00', 'OPEN', 'DAEJEON', '대전광역시 대덕구 대화1길 2', '대전한일병원 1층 세미나실', NULL, true, NOW(), NOW());
END $$;

-- Group: 꿈나무 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '꿈나무' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('꿈나무', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2793-9405') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2793-9405'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:30:00', 'OPEN', 'CHUNGNAM', '충청남도 천안시 동남구 버들로 40', '동남구 보건소 별관 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 동그라미 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '동그라미' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('동그라미', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8065-0537') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8065-0537'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'OPEN', 'DAEJEON', '대전광역시 동구 동대전로 333', '동구 중독관리통합지원센터 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 다솜 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '다솜' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('다솜', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2815-8708') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2815-8708'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'NOTFIXED', 'CHUNGBUK', '충청북도 충주시 봉현로 251', '교현동성당 내 가톨릭회관 2층 201호', NULL, true, NOW(), NOW());
END $$;

-- Group: 노고봉 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '노고봉' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('노고봉', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9392-2546') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9392-2546'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '16:00:00', 'OPEN', 'SEJONG', '세종특별자치시 부강면 노호등곡1로 237', '꽃동네 치료공동체 내', NULL, true, NOW(), NOW());
END $$;

-- Group: 세종한걸음 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '세종한걸음' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('세종한걸음', v_district_id, '성요한 성당', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '성요한 성당', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3806-3192') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3806-3192'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '18:00:00', 'OPEN', 'SEJONG', '세종특별자치시 새롬로 23', '2층 교리실', NULL, true, NOW(), NOW());
END $$;

-- Group: 대전한울타리 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '대전한울타리' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('대전한울타리', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4462-7623') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4462-7623'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '18:30:00', 'OPEN', 'DAEJEON', '대전광역시 중구 대종로 471', '대흥동 천주교회 본관 사무실 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 충주겨자씨 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '충주겨자씨' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('충주겨자씨', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2815-8708') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2815-8708'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:30:00', 'OPEN', 'CHUNGBUK', '충청북도 충주시 사직산21길 34', '충주시 건강복지타운 4층 마음건강실', NULL, true, NOW(), NOW());
END $$;

-- Group: 대전한밭 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '대전한밭' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('대전한밭', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8418-3909') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8418-3909'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:00:00', 'OPEN', 'DAEJEON', '대전광역시 동대전로 272', '가양 4가 타임빌딩 502호', NULL, true, NOW(), NOW());
END $$;

-- Group: 마음소리 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '마음소리' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('마음소리', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2976-8818') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2976-8818'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:30:00', 'OPEN', 'CHUNGBUK', '충청북도 청주시 단재로77번길 5', '영운동성당', NULL, true, NOW(), NOW());
END $$;

-- Group: 홍성느티나무 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '홍성느티나무' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('홍성느티나무', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5780-7842') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5780-7842'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '11:00:00', 'OPEN', 'CHUNGNAM', '충청남도 홍성군 홍성읍 홍성천길 214', '두리프라자 빌딩 신동환병원 4층', NULL, true, NOW(), NOW());
END $$;

-- Group: 서해 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '서해' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('서해', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9271-7425') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9271-7425'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '15:00:00', 'OPEN', 'CHUNGNAM', '충청남도 태안군 태안읍 샘골로 39-5', '태안장로교회 선교관 4층', NULL, true, NOW(), NOW());
END $$;

-- Group: 대전광역시 한그루 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '대전광역시 한그루' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('대전광역시 한그루', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5826-1075') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5826-1075'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '16:00:00', 'OPEN', 'DAEJEON', '대전광역시 동대전로 272', '가양 4가 타임빌딩 502호', NULL, true, NOW(), NOW());
END $$;

-- Group: 무심 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '무심' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('무심', v_district_id, '덕벌초등학교 후문', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '덕벌초등학교 후문', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9677-9458') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9677-9458'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '19:30:00', 'OPEN', 'CHUNGBUK', '충청북도 청주시 청원구 내덕동 698-11', '1층 북카페', NULL, true, NOW(), NOW());
END $$;

-- Group: 충주호반 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '충주호반' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('충주호반', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2815-8708') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2815-8708'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '14:00:00', 'NOTFIXED', 'CHUNGBUK', '충청북도 충주시 예성로 76', '지현동천주교회 1층 성모관', NULL, true, NOW(), NOW());
END $$;

-- Group: 서운 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '서운' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('서운', v_district_id, '덕벌초등학교 후문', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '덕벌초등학교 후문', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4559-7010') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4559-7010'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '14:30:00', 'OPEN', 'CHUNGBUK', '충청북도 청주시 청원구 내덕동 698-11', '1층 북카페', NULL, true, NOW(), NOW());
END $$;

-- Group: 논산황산벌 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '논산황산벌' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('논산황산벌', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3967-4560') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3967-4560'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '15:00:00', 'OPEN', 'CHUNGNAM', '충청남도 논산시 은진면 와야길 22-8', '성복교회', NULL, true, NOW(), NOW());
END $$;

-- Group: 대전해바라기 (충청연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '충청연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('충청연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '대전해바라기' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('대전해바라기', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-7441-8433') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-7441-8433'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '18:00:00', 'OPEN', 'DAEJEON', '대전광역시 서구 갈마로 40', '3층 대전서구중독관리통합지원센터', NULL, true, NOW(), NOW());
END $$;

-- Group: 시나브로 (강원연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '강원연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('강원연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '시나브로' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('시나브로', v_district_id, '속초의료원 맞은편 YWCA 2층', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '속초의료원 맞은편 YWCA 2층', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8420-0945') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8420-0945'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:00:00', 'OPEN', 'GANGWON', '강원특별자치도 속초시 번영로 184', '세광빌딩', NULL, true, NOW(), NOW());
END $$;

-- Group: 홍천희망 (강원연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '강원연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('강원연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '홍천희망' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('홍천희망', v_district_id, '홍천터미널 뒤 보건소 바로 옆', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '홍천터미널 뒤 보건소 바로 옆', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5287-2458') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5287-2458'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '14:00:00', 'OPEN', 'GANGWON', '강원특별자치도 홍천군 신장대로 5', '홍천군 건강증진센터 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 새춘천 (강원연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '강원연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('강원연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '새춘천' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('새춘천', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8833-4251') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8833-4251'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'TUESDAY', '19:30:00', 'OPEN', 'GANGWON', '강원특별자치도 춘천시 공지로 477', '여명축산 지하 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 첫마음 (강원연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '강원연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('강원연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '첫마음' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('첫마음', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-9771-3595') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-9771-3595'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '14:00:00', 'OPEN', 'GANGWON', '강원특별자치도 태백시 태백로 905', '태백정신건강복지센터 2층', NULL, true, NOW(), NOW());
END $$;

-- Group: 춘천연 (강원연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '강원연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('강원연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '춘천연' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('춘천연', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8833-4251') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8833-4251'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '15:00:00', 'OPEN', 'GANGWON', '강원특별자치도 춘천시 중앙로 131', '춘천시 보건소 별관 4층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '15:00:00', 'OPEN', 'GANGWON', '강원특별자치도 춘천시 중앙로 131', '춘천시 보건소 별관 4층', NULL, true, NOW(), NOW());
END $$;

-- Group: 원주생명 (강원연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '강원연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('강원연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '원주생명' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('원주생명', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-8635-2231') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-8635-2231'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'WEDNESDAY', '19:00:00', 'OPEN', 'GANGWON', '강원특별자치도 원주시 능라동길 47', '노블레스타워 402호', NULL, true, NOW(), NOW());
END $$;

-- Group: 죽헌동 (강원연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '강원연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('강원연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '죽헌동' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('죽헌동', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3127-4799') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3127-4799'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'OPEN', 'GANGWON', '강원특별자치도 강릉시 죽헌길 154-3', '강릉전원교회 1층 카페 "뜰" 회의실', NULL, true, NOW(), NOW());
END $$;

-- Group: 양구 청춘 (강원연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '강원연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('강원연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '양구 청춘' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('양구 청춘', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4812-6105') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4812-6105'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'CLOSED', 'GANGWON', '강원특별자치도 양구군 양구읍 관공서로 42', '양구 보건소 3층', NULL, true, NOW(), NOW());
END $$;

-- Group: 춘천참사랑 (강원연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '강원연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('강원연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '춘천참사랑' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('춘천참사랑', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-4378-8859') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-4378-8859'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '18:30:00', 'OPEN', 'GANGWON', '강원특별자치도 춘천시 중앙로 131', '춘천시 보건소 별관 4층', NULL, true, NOW(), NOW());
END $$;

-- Group: 낙원 (강원연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '강원연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('강원연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '낙원' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('낙원', v_district_id, '루안빌딩, 고센헤어 건물', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '루안빌딩, 고센헤어 건물', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5195-4525') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5195-4525'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'FRIDAY', '19:00:00', 'NOTFIXED', 'GANGWON', '강원특별자치도 삼척시 척주로 48', '삼척건강복지센터 3층 프로그램실', NULL, true, NOW(), NOW());
END $$;

-- Group: 행복 (강원연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '강원연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('강원연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '행복' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('행복', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-2407-5727') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-2407-5727'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SATURDAY', '13:00:00', 'OPEN', 'GANGWON', '강원특별자치도 춘천시 공지로 477', '여명축산 지하 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 밀알 (강원연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '강원연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('강원연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '밀알' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('밀알', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-3176-8755') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-3176-8755'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '18:00:00', 'OPEN', 'GANGWON', '강원특별자치도 원주시 문막읍 문막시장1길 80', '문막재가방문요양센터', NULL, true, NOW(), NOW());
END $$;

-- Group: 버팀목 (강원연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '강원연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('강원연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '버팀목' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('버팀목', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-5127-4585') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-5127-4585'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'SUNDAY', '20:00:00', 'OPEN', 'GANGWON', '강원특별자치도 춘천시 공지로 477', '여명축산 지하 1층', NULL, true, NOW(), NOW());
END $$;

-- Group: 제주탐라 (부경연합)
DO $$
DECLARE v_district_id bigint; v_group_id bigint;
BEGIN
    SELECT id INTO v_district_id FROM districts WHERE name = '부경연합';
    IF v_district_id IS NULL THEN INSERT INTO districts (name, created_at, updated_at) VALUES ('부경연합', NOW(), NOW()) RETURNING id INTO v_district_id; END IF;
    SELECT id INTO v_group_id FROM groups WHERE name = '제주탐라' AND district_id = v_district_id;
    IF v_group_id IS NULL THEN INSERT INTO groups (name, district_id, notice, created_at, updated_at) VALUES ('제주탐라', v_district_id, '', NOW(), NOW()) RETURNING id INTO v_group_id;
    ELSE UPDATE groups SET notice = '', updated_at = NOW() WHERE id = v_group_id; END IF;
    IF NOT EXISTS (SELECT 1 FROM group_contacts WHERE group_id = v_group_id AND phone = '010-6886-9829') THEN INSERT INTO group_contacts (group_id, phone) VALUES (v_group_id, '010-6886-9829'); END IF;
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'MONDAY', '19:00:00', 'CLOSED', 'JEJU', '제주특별자치도 제주시 연삼로 264', '제주보건소 별관 2층', NULL, true, NOW(), NOW());
    INSERT INTO meetings (group_id, day_of_week, start_time, type, province, location_address, location_detail, contact_phone_override, active, created_at, updated_at) VALUES (v_group_id, 'THURSDAY', '19:00:00', 'OPEN', 'JEJU', '제주특별자치도 제주시 연삼로 264', '제주보건소 별관 2층', NULL, true, NOW(), NOW());
END $$;

COMMIT;