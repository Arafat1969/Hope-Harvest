INSERT INTO campaigns (
    title, description, details, goal_amount, collected_amount, start_date, end_date, category_id, expected_impact
) VALUES
-- 1. Free Rural Health Camps
(
    'Free Rural Health Camps',
    'Organizing mobile medical units to provide check-ups and medicine in underserved rural areas.',
    'Hope Harvest will deploy teams of volunteer doctors, nurses, and paramedics to remote villages across 5 districts. Each camp will offer free diagnostics, basic treatment, maternal care, and essential medicine distribution.',
    4500000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '40 days',
    '6989837f-79e9-4d8d-a392-2ad19fa0e85f',
    'Provide medical care to over 8,000 villagers with zero access to clinics or hospitals.'
),

-- 2. Pediatric Surgery Support Program
(
    'Pediatric Surgery Support Program',
    'Funding life-saving surgeries for underprivileged children suffering from congenital conditions.',
    'This program identifies eligible children through partner hospitals and sponsors surgeries such as cleft lip repair, congenital heart defects, and orthopedic procedures. Full post-operative care and rehabilitation are included.',
    6000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '60 days',
    '6989837f-79e9-4d8d-a392-2ad19fa0e85f',
    'Sponsor surgeries for 120+ children and ensure their complete recovery and integration into normal life.'
),

-- 3. Maternal Health & Nutrition Drive
(
    'Maternal Health & Nutrition Drive',
    'Promoting safe pregnancies and reducing maternal mortality in slum communities.',
    'Hope Harvest will distribute nutrition kits, iron supplements, prenatal checkups, and health awareness sessions to pregnant women in urban slums. Follow-up support during childbirth and postnatal care is included.',
    5000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '50 days',
    '6989837f-79e9-4d8d-a392-2ad19fa0e85f',
    'Ensure safer pregnancies and delivery outcomes for over 500 women living below the poverty line.'
),

-- 4. Emergency Ambulance for Hill Districts
(
    'Emergency Ambulance for Hill Districts',
    'Launching a solar-powered emergency ambulance service in the Chittagong Hill Tracts.',
    'This campaign will help purchase, modify, and deploy two ambulances equipped for hilly terrain. Each vehicle will have basic life support (BLS), oxygen, and telemedicine integration for emergency response.',
    7000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '70 days',
    '6989837f-79e9-4d8d-a392-2ad19fa0e85f',
    'Enable emergency medical response in remote hill areas, potentially saving hundreds of lives yearly.'
),

-- 5. Eye Camps & Cataract Surgery Mission
(
    'Eye Camps & Cataract Surgery Mission',
    'Restoring vision through free eye camps and cataract surgeries in elderly populations.',
    'Mobile eye clinics will screen over 5,000 patients in rural and semi-urban areas. Eligible patients will be provided transportation, surgery, and post-operative follow-ups in partner hospitals.',
    3800000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '35 days',
    '6989837f-79e9-4d8d-a392-2ad19fa0e85f',
    'Restore sight and improve quality of life for 1,000+ elderly individuals through cataract removal.'
);



INSERT INTO campaigns (
    title, description, details, goal_amount, collected_amount, start_date, end_date, category_id, expected_impact
) VALUES

-- 1. Clean Canals & Backswamps Project
(
    'Clean Canals & Backswamps Project',
    'Removing years of garbage and toxic buildup from local canals and backswamps.',
    'This project focuses on restoring water flow in clogged drainage canals and backswamps in peri-urban areas. It will involve dredging, community awareness drives, installation of debris filters, and planting vegetation along the banks to prevent future siltation.',
    6500000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '60 days',
    '5b759890-6441-46a0-9600-f78f6312ea94',
    'Rehabilitate 15km+ of water channels and reduce local flood risk for over 5,000 residents.'
),

-- 2. One Million Trees for Bangladesh
(
    'One Million Trees for Bangladesh',
    'Massive afforestation initiative targeting deforested and vulnerable rural zones.',
    'Hope Harvest will collaborate with schools, farmers, and local governments to plant 1 million native saplings across deforested lands, riverbanks, and roadside reserves. The campaign includes training and follow-up visits to ensure sapling survival.',
    7000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '90 days',
    '5b759890-6441-46a0-9600-f78f6312ea94',
    'Plant 1 million trees across 30 districts, sequestering carbon and restoring lost habitats.'
),

-- 3. Clean Your City Movement
(
    'Clean Your City Movement',
    'A volunteer-driven urban hygiene and waste management campaign.',
    'This campaign mobilizes schools, communities, and local businesses in major cities to engage in monthly clean-up drives, awareness rallies, and plastic waste separation initiatives. It also includes distribution of public waste bins and graffiti-cleaning in public parks.',
    4500000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '45 days',
    '5b759890-6441-46a0-9600-f78f6312ea94',
    'Engage 15,000+ citizens and remove over 200 tons of unmanaged waste from public spaces.'
),

-- 4. Riverbank Protection with Bamboo & Grass
(
    'Riverbank Protection with Bamboo & Grass',
    'Preventing erosion in disaster-prone riverside areas using eco-engineering methods.',
    'Using low-cost, natural materials like bamboo fencing, vetiver grass, and coir mats, this campaign aims to stabilize soil along eroding riversides. It includes training local farmers in erosion control methods and long-term monitoring.',
    3000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '35 days',
    '5b759890-6441-46a0-9600-f78f6312ea94',
    'Stabilize over 10km of riverbank and protect nearby homes and agricultural land from flood damage.'
),

-- 5. Eco Education in Schools
(
    'Eco Education in Schools',
    'Embedding sustainability into school curricula with hands-on learning.',
    'Hope Harvest will launch eco-clubs in 100 schools, introduce composting bins, rooftop gardens, and organize climate resilience workshops for teachers and students. Content will be aligned with the national curriculum and local needs.',
    3500000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '50 days',
    '5b759890-6441-46a0-9600-f78f6312ea94',
    'Educate 10,000+ students to become future eco-leaders and initiate sustainable changes in their communities.'
);


INSERT INTO campaigns (
    title, description, details, goal_amount, collected_amount, start_date, end_date, category_id, expected_impact
) VALUES

-- 1. Old Home Renovation & Care Program
(
    'Old Home Renovation & Care Program',
    'Improving facilities and caregiving services in old homes for neglected elderly in Bangladesh.',
    'In many districts of Bangladesh, elderly citizens who are abandoned or without family support end up in poorly funded old homes. This campaign will renovate key facilities in 3 such institutions located in Dhaka, Mymensingh, and Barisal. It includes new beds, clean bathrooms, solar water heaters, medical beds, and emergency care equipment. Trained caregivers and physiotherapists will also be appointed.',
    5000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '60 days',
    'fdd636d3-a7bc-479b-ac5f-0f46043c356a',
    'Enhance the dignity, hygiene, and health care access of 150+ senior citizens in under-resourced shelters.'
),

-- 2. Orphanage Sustainability & Education
(
    'Orphanage Sustainability & Education',
    'Ensuring continuous care, education, and skill-building for orphans in rural Bangladeshi shelters.',
    'This campaign supports four orphanages across Sylhet, Khulna, Rangpur, and Tangail districts. It will fund nutritious meals, school tuition, books, clothing, and Islamic education. Orphans aged 5–17 will also receive training in computer literacy, spoken English, and tailoring to help them build a future.',
    7000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '90 days',
    'fdd636d3-a7bc-479b-ac5f-0f46043c356a',
    'Secure holistic education and care for 300+ orphans in rural Bangladesh, bridging them to self-reliance.'
),

-- 3. Street Child Rescue & Rehabilitation
(
    'Street Child Rescue & Rehabilitation',
    'Rehabilitating homeless children from Dhaka, Chattogram, and Rajshahi into safe, educational homes.',
    'Bangladesh’s urban centers see thousands of children surviving on the streets due to poverty, abuse, or abandonment. This campaign will deploy outreach teams and run 2 safe transit centers. It will fund medical check-ups, legal support (for child documentation), and admission into shelters or foster care.',
    4500000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '45 days',
    'fdd636d3-a7bc-479b-ac5f-0f46043c356a',
    'Rescue and reintegrate 120+ children into safe and nurturing environments, keeping them off the streets.'
),

-- 4. Shelter & Care for Abandoned Mentally Ill
(
    'Shelter & Care for Abandoned Mentally Ill',
    'Creating a safe recovery center for mentally ill individuals found wandering streets or stations in Bangladesh.',
    'In Bangladesh, mentally ill people are often abandoned at bus terminals, stations, or religious shrines. This campaign will build a temporary recovery shelter in Gazipur with psychiatric support, hygiene care, and medication. Local hospital partnerships will allow structured diagnosis, therapy, and recovery planning. Families will be traced where possible.',
    6000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '70 days',
    'fdd636d3-a7bc-479b-ac5f-0f46043c356a',
    'Rehabilitate 60+ individuals with severe mental health conditions and restore their dignity and stability.'
);


INSERT INTO campaigns (
    title, description, details, goal_amount, collected_amount, start_date, end_date, category_id, expected_impact
) VALUES

-- 1. Flood Relief in North Bengal
(
    'Flood Relief in North Bengal',
    'Providing emergency aid to flood-hit families in Kurigram, Gaibandha, and Nilphamari.',
    'Due to heavy monsoon rains and upstream river swelling, thousands in char areas lose homes yearly. This campaign delivers dry food, pure drinking water, and makeshift shelters for affected communities.',
    6500000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    '80eb595e-6072-4abb-bf56-553c00cb9d16',
    'Support 8,000+ families with food and emergency shelter during monsoon floods.'
),

-- 2. Cyclone Emergency Response (Southern Coast)
(
    'Cyclone Emergency Response (Southern Coast)',
    'Immediate relief for families displaced by cyclone in Khulna, Satkhira, and Barguna.',
    'This campaign includes tarpaulin distribution, hygiene kits, emergency food packets, and water purification tablets post-cyclone. Women-friendly spaces will be arranged in shelters.',
    7000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '40 days',
    '80eb595e-6072-4abb-bf56-553c00cb9d16',
    'Assist 10,000 cyclone-affected individuals with emergency and sanitation support.'
),

-- 3. Fire Relief for Slum Dwellers (Dhaka)
(
    'Fire Relief for Slum Dwellers (Dhaka)',
    'Rebuilding essentials for families affected by fire outbreaks in Korail and Rayerbazar slums.',
    'Fires destroy hundreds of makeshift homes annually. This campaign provides cooking items, bedsheets, baby food, and rent support to slum families who lose everything overnight.',
    4000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '20 days',
    '80eb595e-6072-4abb-bf56-553c00cb9d16',
    'Help 1,500+ fire-hit households restart with dignity and warmth.'
),

-- 4. Urban Coldwave Blanket Drive
(
    'Urban Coldwave Blanket Drive',
    'Protecting the homeless and rickshaw-pullers from Dhaka winter chill.',
    'Winter nights are deadly for street sleepers. This drive distributes thermal blankets, winter jackets, and hot meals at major intersections and stations.',
    3000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '25 days',
    '80eb595e-6072-4abb-bf56-553c00cb9d16',
    'Serve warmth and food to over 5,000 people vulnerable to hypothermia.'
),

-- 5. Sylhet Flash Flood Relief
(
    'Sylhet Flash Flood Relief',
    'Rapid response to flash floods in Sunamganj and Sylhet town areas.',
    'Unexpected upstream flooding leaves households stranded. This campaign funds local boats, food parcels, and disinfectants to manage waterborne disease risks.',
    5500000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '30 days',
    '80eb595e-6072-4abb-bf56-553c00cb9d16',
    'Reach 6,000 people with food and flood transport support.'
),

-- 6. Post-Landslide Aid for Chattogram Hill Tracts
(
    'Post-Landslide Aid for Chattogram Hill Tracts',
    'Supporting indigenous families affected by seasonal landslides in Bandarban and Rangamati.',
    'Landslides triggered by heavy rains damage homes and roads. This effort provides temporary shelters, rice, oral saline, and plastic sheets for rebuilding.',
    4800000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '35 days',
    '80eb595e-6072-4abb-bf56-553c00cb9d16',
    'Protect 3,000+ affected individuals and restore mobility in hilly terrain.'
),

-- 7. Urban Flood Recovery in Dhaka & Chattogram
(
    'Urban Flood Recovery in Dhaka & Chattogram',
    'Restoring homes and health after severe waterlogging in low-lying city areas.',
    'This campaign offers clean drinking water, mosquito nets, and disinfectants to prevent dengue and diarrhea during urban floods in densely populated wards.',
    6000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '28 days',
    '80eb595e-6072-4abb-bf56-553c00cb9d16',
    'Provide water and sanitation to 7,000 flood-hit city dwellers.'
),

-- 8. Heatwave Relief in Northern Districts
(
    'Heatwave Relief in Northern Districts',
    'Protecting outdoor laborers and the elderly from extreme heat stress.',
    'Areas like Rajshahi and Dinajpur face rising temperatures. This project distributes electrolyte packs, fans, umbrellas, and arranges cooling centers during May-June heatwaves.',
    3500000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '15 days',
    '80eb595e-6072-4abb-bf56-553c00cb9d16',
    'Reduce heat-related illness among 4,500 rickshaw pullers, farmers, and elderly citizens.'
),

-- 9. Relief for Storm-hit Fishing Communities (Cox’s Bazar)
(
    'Relief for Storm-hit Fishing Communities (Cox’s Bazar)',
    'Emergency support for families who lost boats, nets, and shelters during Nor’wester storms.',
    'This campaign provides food, financial stipends, and gear replacement for coastal fishers affected by pre-monsoon storms.',
    4300000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '20 days',
    '80eb595e-6072-4abb-bf56-553c00cb9d16',
    'Help 2,000 coastal families recover livelihoods and food security.'
),

-- 10. Eid Relief for Disaster-affected Families
(
    'Eid Relief for Disaster-affected Families',
    'Providing new clothes, meat, and gifts to disaster-hit families during Eid celebrations.',
    'This special campaign brings joy during Eid-ul-Fitr and Eid-ul-Adha to children and families displaced by disaster. Each kit includes new dresses, cooked meals, and festive sweets.',
    3000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '10 days',
    '80eb595e-6072-4abb-bf56-553c00cb9d16',
    'Bring dignity and happiness to 2,500 struggling families during Eid.'
);


INSERT INTO campaigns (
    title, description, details, goal_amount, collected_amount, start_date, end_date, category_id, expected_impact
) VALUES

-- 1. Women’s Livelihood Through Tailoring
(
    'Women’s Livelihood Through Tailoring',
    'Empowering rural women with tailoring training and sewing machines for income generation.',
    'Hope Harvest will provide 3-month certified tailoring training to 200 women in Narshingdi, Kushtia, and Noakhali. Each participant will receive a sewing machine, initial materials, and marketing training to start their own home-based or group tailoring business.',
    5000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '60 days',
    '7704e0e3-0083-42dc-a6c9-c2a37233645c',
    'Enable 200+ women to earn at least BDT 5,000/month through self-employment in tailoring.'
),

-- 2. Agri-Startup Support for Small Farmers
(
    'Agri-Startup Support for Small Farmers',
    'Providing tools, seed capital, and training to help marginal farmers start profitable agribusinesses.',
    'This campaign supports 150 small-scale farmers in Rajshahi and Mymensingh with high-yield seeds, organic compost training, and digital market access tools. Farmers will be coached on water efficiency, livestock, and selling through B2B platforms.',
    6500000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '75 days',
    '7704e0e3-0083-42dc-a6c9-c2a37233645c',
    'Boost incomes and market resilience for 150+ farmers through sustainable agri-entrepreneurship.'
),

-- 3. Vocational Training for Underprivileged Youth
(
    'Vocational Training for Underprivileged Youth',
    'Offering skill-based courses and placement support for unemployed rural youth.',
    'The project will launch 4 vocational skill centers offering IT support, electrical work, refrigeration, and mobile servicing training in Bogura, Khulna, and Sylhet. Trainees will also receive resume, interview, and entrepreneurship workshops.',
    6000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '60 days',
    '7704e0e3-0083-42dc-a6c9-c2a37233645c',
    'Train 300+ youth in demand-driven skills and support job or micro-business placement.'
),

-- 4. Disability-Inclusive Micro-Business Program
(
    'Disability-Inclusive Micro-Business Program',
    'Enabling people with disabilities to start accessible home-based enterprises.',
    'This campaign will offer grant funding and training for persons with physical and speech disabilities to run digital centers, handicraft shops, or online services. It includes adaptive tools, mentorship, and support to register their businesses.',
    4000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '50 days',
    '7704e0e3-0083-42dc-a6c9-c2a37233645c',
    'Launch 100+ inclusive businesses run by persons with disabilities across 10 districts.'
),

-- 5. Rural Women Co-Operative Entrepreneurship
(
    'Rural Women Co-Operative Entrepreneurship',
    'Forming and funding women-led co-operatives for dairy, pickles, or handicrafts.',
    'Hope Harvest will facilitate 20 women’s co-ops across Tangail and Netrokona. Groups will receive training on pricing, group savings, packaging, and fair trade marketing. Profits will be reinvested in their communities.',
    7000000.00,
    0.00,
    CURRENT_DATE,
    CURRENT_DATE + INTERVAL '80 days',
    '7704e0e3-0083-42dc-a6c9-c2a37233645c',
    'Build 20 sustainable women-led businesses improving local livelihoods and leadership.'
);


INSERT INTO campaign_images (campaign_id, image_url, image_alt_text, display_order) VALUES
('1583d2ea-c3b5-48d8-8d83-a6fd54d940ab', 'https://i.postimg.cc/TPrpZpNq/Agri-Startup-Support-for-Small-Farmers.jpg', 'Agri Startup Support for Small Farmers', 0),
('74fe18aa-b053-4e46-9eb7-820e7ddbcba4', 'https://i.postimg.cc/zf1fSqDL/Clean-Canals-Backswamps-Project.jpg', 'Clean Canals & Backswamps Project', 0),
('d1d15d41-66ca-4ed6-bf6f-ebc59f528d6c', 'https://i.postimg.cc/65k6tBvH/Clean-Your-City-Movement.jpg', 'Clean Your City Movement', 0),
('9489e009-bdbb-472b-8a5c-fa29e61997ff', 'https://i.postimg.cc/hjtcpjkG/Cyclone-Emergency-Response-Southern-Coast.jpg', 'Cyclone Emergency Response (Southern Coast)', 0),
('73fe9346-bffc-47b9-ba60-cfd393000dff', 'https://i.postimg.cc/jjZrwTDY/Disability-Inclusive-Micro-Business-Program.jpg', 'Disability Inclusive Micro Business Program', 0),
('77bd8161-eabe-40a7-b304-37ee5b891832', 'https://i.postimg.cc/Ls680NfR/Eco-Education-in-Schools.jpg', 'Eco Education in Schools', 0),
('010bb8d9-fdb7-40b1-a4de-e6f5eb06e722', 'https://i.postimg.cc/L6t49r32/Eid-Relief-for-Disaster-affected-Families.jpg', 'Eid Relief for Disaster-affected Families', 0),
('75ae0f94-d73b-4bf1-9f0a-0b95baab9cea', 'https://i.postimg.cc/8zkG1sCm/Emergency-Ambulance-for-Hill-Districts.jpg', 'Emergency Ambulance for Hill Districts', 0),
('6bdc1747-4a51-41de-8be3-e767d88bd201', 'https://i.postimg.cc/ZRNtfdf4/Eye-Camps-Cataract-Surgery-Mission.jpg', 'Eye Camps & Cataract Surgery Mission', 0),
('7494939f-a0f0-4e8e-9abc-da5e4d9b2e53', 'https://i.postimg.cc/Y0fc7wKP/Fire-Relief-for-Slum-Dwellers-Dhaka.jpg', 'Fire Relief for Slum Dwellers (Dhaka)', 0),
('fc91d483-446a-43d9-a871-b430f27c5b91', 'https://i.postimg.cc/vZTKqnBk/Flood-Relief-in-North-Bengal.jpg', 'Flood Relief in North Bengal', 0),
('f8cc1ef3-204e-4781-b363-47c89a3e82eb', 'https://i.postimg.cc/ZRtD5Dcz/Free-Rural-Health-Camps.jpg', 'Free Rural Health Camps', 0),
('4e3b6179-b3f9-4d01-85c4-be60b12d8c95', 'https://i.postimg.cc/C56GzRgn/Garments-Training-for-Women.jpg', 'Garments Training for Women', 0),
('1321e1ba-b273-47cc-b56a-4c0fee618fa1', 'https://i.postimg.cc/9fjGR3vb/Heatwave-Relief-in-Northern-Districts.jpg', 'Heatwave Relief in Northern Districts', 0),
('57bb8275-b7d9-441d-94a1-2a7fb93b5d6c', 'https://i.postimg.cc/kMhKNR0B/Literacy-Program-for-Street-Kids.jpg', 'Literacy Program for Street Kids', 0),
('c80d8c55-ea75-4e2d-a3fc-92ea20d95133', 'https://i.postimg.cc/rmwRxqg1/Maternal-Health-Nutrition-Drive.jpg', 'Maternal Health & Nutrition Drive', 0),
('6c0b90a2-4e9f-43a9-9168-7827c7c989ff', 'https://i.postimg.cc/9QPDkDnP/Mobile-Library-for-Rural-Youth.jpg', 'Mobile Library for Rural Youth', 0),
('3bca42ee-e20e-48ef-928c-1e714523fe41', 'https://i.postimg.cc/xCZ8mMXQ/Old-Home-Renovation-Care-Program.jpg', 'Old Home Renovation & Care Program', 0),
('c7aebe06-fb94-4fe0-81bc-a3f54eb34077', 'https://i.postimg.cc/HWJ4ht4Q/One-Million-Trees-for-Bangladesh.jpg', 'One Million Trees for Bangladesh', 0),
('9b4c9c8b-4120-4c51-9757-62a35a727d40', 'https://i.postimg.cc/bwqnp0bV/Orphanage-Sustainability-Education.jpg', 'Orphanage Sustainability & Education', 0),
('ffe4b9b6-1b35-44a8-9f6d-8ff2e94dfcf7', 'https://i.postimg.cc/WbvFwm9p/Pediatric-Surgery-Support-Program.jpg', 'Pediatric Surgery Support Program', 0),
('a5ca063d-9eed-4cbd-8df5-f297cdc2d256', 'https://i.postimg.cc/vZP4yJGD/Post-Landslide-Aid-for-Chattogram-Hill-Tracts.jpg', 'Post-Landslide Aid for Chattogram Hill Tracts', 0),
('6a762a5c-d0ca-4858-bc61-7f51a71837d8', 'https://i.postimg.cc/Zq20B6BS/Quran-and-Hifz-Education-for-Orphans.jpg', 'Quran and Hifz Education for Orphans', 0),
('6783ab0f-50eb-434a-93ad-1c32aed6c725', 'https://i.postimg.cc/ZYr0nBJG/Relief-for-Storm-hit-Fishing-Communities-Cox-s-Bazar.jpg', 'Relief for Storm-hit Fishing Communities (Cox’s Bazar)', 0),
('86e4f1d7-1212-4eb6-9426-b3ce51e962d2', 'https://i.postimg.cc/QCbXb7tV/Riverbank-Protection-with-Bamboo-Grass.jpg', 'Riverbank Protection with Bamboo & Grass', 0),
('0448dffe-2872-4ff1-aa45-fad911656a2a', 'https://i.postimg.cc/sgWLCrY4/Rural-Women-Co-Operative-Entrepreneurship.jpg', 'Rural Women Co-Operative Entrepreneurship', 0),
('bb6f4ac1-230d-468e-99b5-78a8ed873a58', 'https://i.postimg.cc/XJj15BTs/School-Bags-Supplies-for-Slum-Kids.jpg', 'School Bags & Supplies for Slum Kids', 0),
('e8d6f336-6105-4b5d-b8bc-1ced01207808', 'https://i.postimg.cc/kMVzvK2H/Shelter-Care-for-Abandoned-Mentally-Ill.jpg', 'Shelter & Care for Abandoned Mentally Ill', 0),
('51d6e282-241c-4906-a3a6-0de33ea49734', 'https://i.postimg.cc/X74KY06g/Street-Child-Rescue-Rehabilitation.jpg', 'Street Child Rescue & Rehabilitation', 0),
('ce56f255-05ba-49d5-9a01-068697df359c', 'https://i.postimg.cc/D0W9WbXt/Sylhet-Flash-Flood-Relief.jpg', 'Sylhet Flash Flood Relief', 0),
('63b9745d-ed51-4bc5-bb0c-ab57e22a52e0', 'https://i.postimg.cc/Gt2yvb30/Urban-Coldwave-Blanket-Drive.jpg', 'Urban Coldwave Blanket Drive', 0),
('85ff614b-b399-40a2-93c8-61690d0c07b7', 'https://i.postimg.cc/YqTWmcJV/Urban-Flood-Recovery-in-Dhaka-Chattogram.jpg', 'Urban Flood Recovery in Dhaka & Chattogram', 0),
('ddb5e5e4-5a41-4b96-b3ce-2992cbd7bfdc', 'https://i.postimg.cc/WzhdhSST/Vocational-Training-for-Underprivileged-Youth.jpg', 'Vocational Training for Underprivileged Youth', 0),
('e4814545-ed43-4aae-8a51-bcc83dc5a2ea', 'https://i.postimg.cc/44SKrkNd/Women-s-Livelihood-Through-Tailoring.jpg', 'Women’s Livelihood Through Tailoring', 0);
