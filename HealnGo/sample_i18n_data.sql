-- 샘플 번역 데이터 추가 (ITEM_LIST_I18N 테이블)
-- 영어 번역
INSERT INTO ITEM_LIST_I18N (ITEM_ID, LOCALE, NAME_LABEL, ADDRESS_LABEL) VALUES 
(1, 'en', '2010 Plastic Surgery Clinic', 'Incheon Metropolitan City, Yeonsu-gu, Incheontower-daero 180beon-gil 11, B-211 (Songdo-dong, The Sharp Songdo Central Park III)'),
(2, 'en', 'ABC Dermatology Clinic', 'Seoul, Gangnam-gu, Teheran-ro 123'),
(3, 'en', 'XYZ Dental Hospital', 'Busan, Haeundae-gu, Marine City 1-ro 45');

-- 중국어 번역
INSERT INTO ITEM_LIST_I18N (ITEM_ID, LOCALE, NAME_LABEL, ADDRESS_LABEL) VALUES 
(1, 'zh', '2010整形外科诊所', '仁川广域市延寿区仁川塔大道180号路11号B-211室（松岛洞，The Sharp松岛中央公园III）'),
(2, 'zh', 'ABC皮肤科诊所', '首尔江南区德黑兰路123号'),
(3, 'zh', 'XYZ牙科医院', '釜山海云台区海洋城市1路45号');

-- 일본어 번역
INSERT INTO ITEM_LIST_I18N (ITEM_ID, LOCALE, NAME_LABEL, ADDRESS_LABEL) VALUES 
(1, 'ja', '2010形成外科クリニック', '仁川広域市延寿区仁川タワー大路180番路11、B-211（ソンド洞、The SharpソンドセントラルパークIII）'),
(2, 'ja', 'ABC皮膚科クリニック', 'ソウル江南区テヘラン路123'),
(3, 'ja', 'XYZ歯科医院', '釜山海雲台区マリンシティ1路45');

