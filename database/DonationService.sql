--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-21 00:49:10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4881 (class 1262 OID 16768)
-- Name: Donation_Payment; Type: DATABASE; Schema: -; Owner: postgres
-- (Database creation handled by init-databases.sql)
--

-- Database creation and connection handled by init script

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 225 (class 1255 OID 16891)
-- Name: create_campaign_on_approval(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_campaign_on_approval() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   IF NEW.status = 'APPROVED' AND (OLD.status IS NULL OR OLD.status != 'APPROVED') THEN
       INSERT INTO campaigns (title,description,details,goal_amount,start_date,end_date,
   							category_id,expected_impact) 
   	VALUES (NEW.title,NEW.description,NULL,NEW.goal,NEW.start_date,
           	NEW.end_date,NEW.category_id,NEW.expected_impact);

       NEW.feedback = COALESCE(NEW.feedback || E'\n', '') || 
                     'Campaign automatically created on ' || CURRENT_TIMESTAMP::text;
   END IF;
   
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.create_campaign_on_approval() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16769)
-- Name: campaign_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaign_categories (
    category_id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(100) NOT NULL,
    description text
);


ALTER TABLE public.campaign_categories OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16795)
-- Name: campaign_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaign_images (
    image_id bigint NOT NULL,
    campaign_id uuid NOT NULL,
    image_url character varying(500) NOT NULL,
    image_alt_text character varying(255),
    display_order integer DEFAULT 0
);


ALTER TABLE public.campaign_images OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16794)
-- Name: campaign_images_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.campaign_images_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.campaign_images_image_id_seq OWNER TO postgres;

--
-- TOC entry 4882 (class 0 OID 0)
-- Dependencies: 219
-- Name: campaign_images_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.campaign_images_image_id_seq OWNED BY public.campaign_images.image_id;


--
-- TOC entry 223 (class 1259 OID 16872)
-- Name: campaign_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaign_requests (
    request_id uuid DEFAULT gen_random_uuid() NOT NULL,
    external_user_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    goal numeric(12,2) NOT NULL,
    category_id uuid,
    start_date date NOT NULL,
    end_date date NOT NULL,
    expected_impact text,
    proposer_phone character varying(20),
    proposer_email character varying(255),
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    submission_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    review_date timestamp with time zone,
    feedback text,
    CONSTRAINT campaign_request_dates_check CHECK ((end_date >= start_date)),
    CONSTRAINT campaign_requests_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying])::text[])))
);


ALTER TABLE public.campaign_requests OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16779)
-- Name: campaigns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.campaigns (
    campaign_id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    details text,
    goal_amount numeric(12,2) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    category_id uuid,
    expected_impact text,
    collected_amount numeric(12,2) DEFAULT 0.00 NOT NULL,
    CONSTRAINT campaign_dates_check CHECK ((end_date >= start_date)),
    CONSTRAINT goal_amount_positive CHECK ((goal_amount > (0)::numeric))
);


ALTER TABLE public.campaigns OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16844)
-- Name: donation_usage; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.donation_usage (
    usage_id uuid DEFAULT gen_random_uuid() NOT NULL,
    donation_id uuid NOT NULL,
    campaign_id uuid NOT NULL,
    campaign_category_id uuid NOT NULL,
    amount numeric(12,2) NOT NULL,
    description text,
    external_event_id uuid,
    CONSTRAINT usage_amount_check CHECK ((amount > (0)::numeric))
);


ALTER TABLE public.donation_usage OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16809)
-- Name: donations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.donations (
    donation_id uuid DEFAULT gen_random_uuid() NOT NULL,
    external_user_id uuid,
    campaign_id uuid NOT NULL,
    amount numeric(12,2) NOT NULL,
    donation_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status character varying(20) NOT NULL,
    payment_method character varying(50) NOT NULL,
    transaction_id character varying(100),
    is_anonymous boolean DEFAULT false NOT NULL,
    tracking_key character varying(255),
    CONSTRAINT check_user_if_not_anonymous CHECK (((is_anonymous = true) OR (external_user_id IS NOT NULL))),
    CONSTRAINT donations_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'COMPLETED'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[])))
);


ALTER TABLE public.donations OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 17247)
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.payments (
    payment_id uuid DEFAULT gen_random_uuid() NOT NULL,
    donation_id uuid NOT NULL,
    gateway_name character varying(50) NOT NULL,
    transaction_id character varying(100),
    amount numeric(12,2) NOT NULL,
    status character varying(20) NOT NULL,
    otp character varying(6) NOT NULL,
    CONSTRAINT payment_completion_requires_transaction_id CHECK ((((status)::text <> 'COMPLETED'::text) OR (transaction_id IS NOT NULL))),
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'COMPLETED'::character varying, 'FAILED'::character varying])::text[])))
);


ALTER TABLE public.payments OWNER TO postgres;

--
-- TOC entry 4669 (class 2604 OID 17038)
-- Name: campaign_images image_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_images ALTER COLUMN image_id SET DEFAULT nextval('public.campaign_images_image_id_seq'::regclass);


--
-- TOC entry 4868 (class 0 OID 16769)
-- Dependencies: 217
-- Data for Name: campaign_categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.campaign_categories (category_id, name, description) VALUES ('89de332f-13b6-465e-a41c-2671576b2d55', 'Education & Training', 'Education is not merely the transfer of knowledge—it is the foundation of empowerment, social mobility, and progress. In this category, Hope Harvest aims to bridge educational gaps in underserved communities by supporting foundational literacy, digital education, and skill-based learning programs.\n\n
 From constructing classrooms in rural areas to deploying mobile learning units in slums, we believe every child and adult deserves access to quality education. Programs under this category also include vocational training for youth, computer literacy workshops for women, and adult education modules that empower families to break free from intergenerational poverty.\n\n
 We also partner with schools to provide teacher training, educational materials, uniforms, and scholarships to ensure that financial hardship never stands in the way of learning. Education and training are stepping stones to a dignified, independent life—and through this category, we work to make that dream a reality for all.') ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_categories (category_id, name, description) VALUES ('6989837f-79e9-4d8d-a392-2ad19fa0e85f', 'Medical & HealthCare Support', 'Health is a human right, not a privilege. The Medical Support category is dedicated to ensuring that marginalized individuals and communities receive timely, affordable, and quality healthcare. This includes setting up free health camps in remote villages, funding surgeries for the poor, and providing access to maternal and child care services.\n\n
 Hope Harvest organizes multi-specialty medical camps staffed by volunteer doctors and nurses, offering diagnostics, treatment, and follow-up care. We also run mobile clinics in urban slums and rural regions where permanent facilities are lacking.\n\n
 Furthermore, our initiatives focus on preventive healthcare—spreading awareness about hygiene, nutrition, vaccination, and chronic illness management. By combining treatment with education, we strive to build healthier communities from the ground up.') ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_categories (category_id, name, description) VALUES ('5b759890-6441-46a0-9600-f78f6312ea94', 'Environment', 'Environmental degradation is one of the greatest challenges of our time, and this category seeks to foster ecological consciousness and resilience in communities. Our programs aim to restore ecosystems, promote sustainable living, and empower people to take ownership of their environment.\n\n
 From tree plantation drives and clean-up campaigns to building rainwater harvesting systems and promoting organic farming, Hope Harvest believes that lasting change begins with grassroots action. We work with schools to integrate environmental education into the curriculum, enabling the next generation to grow up with a deep respect for nature.\n\n
 We also support research and implementation of renewable energy solutions in low-income areas, helping reduce dependency on non-sustainable fuels. Every action we take under this category is a step toward securing a healthier planet for future generations.') ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_categories (category_id, name, description) VALUES ('fdd636d3-a7bc-479b-ac5f-0f46043c356a', 'Raising & Caring', 'The heart of our work lies in compassion—for the child without parents, for the elder without a home, for the vulnerable who feel forgotten. This category encompasses initiatives focused on emotional and physical care for orphans, children in need of protection, and elderly individuals without support systems.\n\n
 We run foster care initiatives, orphan shelters, and senior homes where love and dignity are foundational values. Beyond physical care, we provide psychological counseling, life skills training, and platforms for storytelling and intergenerational bonding.\n\n
 Our goal is to create communities where no one is left behind, and where the act of caring becomes a shared responsibility. These programs are not just about survival—they are about giving every individual the right to thrive, be heard, and be cherished.') ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_categories (category_id, name, description) VALUES ('80eb595e-6072-4abb-bf56-553c00cb9d16', 'Relief Distribution', 'In times of crisis—be it natural disasters, pandemics, or conflict—Hope Harvest stands ready to provide immediate relief and long-term rehabilitation. This category supports swift response mechanisms to deliver food, water, shelter, hygiene kits, and medical aid to affected regions.\n\n
 We work in coordination with local authorities and NGOs to identify the most vulnerable and reach them with dignity and care. Our relief packages are not just supplies; they carry the message of hope, resilience, and solidarity.\n\n
 Post-relief, we initiate rehabilitation programs—temporary schooling, livelihood grants, and trauma healing workshops—to help communities rebuild their lives. We believe that how we respond in times of hardship defines the strength of our shared humanity.') ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_categories (category_id, name, description) VALUES ('7704e0e3-0083-42dc-a6c9-c2a37233645c', 'Self Reliance', 'Hope Harvest envisions a world where people are not merely recipients of aid, but active architects of their future. This category promotes economic empowerment and independence through entrepreneurship, microfinance, and livelihood development initiatives.\n\n
 We provide small grants and business mentorship to aspiring entrepreneurs, especially women and youth, enabling them to start local enterprises—from tailoring shops and organic farms to tech-enabled services. Our training programs cover financial literacy, marketing skills, and product development.\n\n
 By connecting artisans, farmers, and small-scale vendors to fair trade networks, we help communities unlock new income streams. Self-reliance is not just economic—it is the confidence to dream big and the capacity to build resilient, self-sustaining communities from within.') ON CONFLICT DO NOTHING;


--
-- TOC entry 4871 (class 0 OID 16795)
-- Dependencies: 220
-- Data for Name: campaign_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (1, '1583d2ea-c3b5-48d8-8d83-a6fd54d940ab', 'https://i.postimg.cc/TPrpZpNq/Agri-Startup-Support-for-Small-Farmers.jpg', 'Agri Startup Support for Small Farmers', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (2, '74fe18aa-b053-4e46-9eb7-820e7ddbcba4', 'https://i.postimg.cc/zf1fSqDL/Clean-Canals-Backswamps-Project.jpg', 'Clean Canals & Backswamps Project', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (3, 'd1d15d41-66ca-4ed6-bf6f-ebc59f528d6c', 'https://i.postimg.cc/65k6tBvH/Clean-Your-City-Movement.jpg', 'Clean Your City Movement', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (4, '9489e009-bdbb-472b-8a5c-fa29e61997ff', 'https://i.postimg.cc/hjtcpjkG/Cyclone-Emergency-Response-Southern-Coast.jpg', 'Cyclone Emergency Response (Southern Coast)', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (5, '73fe9346-bffc-47b9-ba60-cfd393000dff', 'https://i.postimg.cc/jjZrwTDY/Disability-Inclusive-Micro-Business-Program.jpg', 'Disability Inclusive Micro Business Program', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (6, '77bd8161-eabe-40a7-b304-37ee5b891832', 'https://i.postimg.cc/Ls680NfR/Eco-Education-in-Schools.jpg', 'Eco Education in Schools', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (7, '010bb8d9-fdb7-40b1-a4de-e6f5eb06e722', 'https://i.postimg.cc/L6t49r32/Eid-Relief-for-Disaster-affected-Families.jpg', 'Eid Relief for Disaster-affected Families', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (8, '75ae0f94-d73b-4bf1-9f0a-0b95baab9cea', 'https://i.postimg.cc/8zkG1sCm/Emergency-Ambulance-for-Hill-Districts.jpg', 'Emergency Ambulance for Hill Districts', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (9, '6bdc1747-4a51-41de-8be3-e767d88bd201', 'https://i.postimg.cc/ZRNtfdf4/Eye-Camps-Cataract-Surgery-Mission.jpg', 'Eye Camps & Cataract Surgery Mission', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (10, '7494939f-a0f0-4e8e-9abc-da5e4d9b2e53', 'https://i.postimg.cc/Y0fc7wKP/Fire-Relief-for-Slum-Dwellers-Dhaka.jpg', 'Fire Relief for Slum Dwellers (Dhaka)', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (11, 'fc91d483-446a-43d9-a871-b430f27c5b91', 'https://i.postimg.cc/vZTKqnBk/Flood-Relief-in-North-Bengal.jpg', 'Flood Relief in North Bengal', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (12, 'f8cc1ef3-204e-4781-b363-47c89a3e82eb', 'https://i.postimg.cc/ZRtD5Dcz/Free-Rural-Health-Camps.jpg', 'Free Rural Health Camps', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (13, '4e3b6179-b3f9-4d01-85c4-be60b12d8c95', 'https://i.postimg.cc/C56GzRgn/Garments-Training-for-Women.jpg', 'Garments Training for Women', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (14, '1321e1ba-b273-47cc-b56a-4c0fee618fa1', 'https://i.postimg.cc/9fjGR3vb/Heatwave-Relief-in-Northern-Districts.jpg', 'Heatwave Relief in Northern Districts', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (15, '57bb8275-b7d9-441d-94a1-2a7fb93b5d6c', 'https://i.postimg.cc/kMhKNR0B/Literacy-Program-for-Street-Kids.jpg', 'Literacy Program for Street Kids', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (16, 'c80d8c55-ea75-4e2d-a3fc-92ea20d95133', 'https://i.postimg.cc/rmwRxqg1/Maternal-Health-Nutrition-Drive.jpg', 'Maternal Health & Nutrition Drive', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (17, '6c0b90a2-4e9f-43a9-9168-7827c7c989ff', 'https://i.postimg.cc/9QPDkDnP/Mobile-Library-for-Rural-Youth.jpg', 'Mobile Library for Rural Youth', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (18, '3bca42ee-e20e-48ef-928c-1e714523fe41', 'https://i.postimg.cc/xCZ8mMXQ/Old-Home-Renovation-Care-Program.jpg', 'Old Home Renovation & Care Program', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (19, 'c7aebe06-fb94-4fe0-81bc-a3f54eb34077', 'https://i.postimg.cc/HWJ4ht4Q/One-Million-Trees-for-Bangladesh.jpg', 'One Million Trees for Bangladesh', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (20, '9b4c9c8b-4120-4c51-9757-62a35a727d40', 'https://i.postimg.cc/bwqnp0bV/Orphanage-Sustainability-Education.jpg', 'Orphanage Sustainability & Education', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (21, 'ffe4b9b6-1b35-44a8-9f6d-8ff2e94dfcf7', 'https://i.postimg.cc/WbvFwm9p/Pediatric-Surgery-Support-Program.jpg', 'Pediatric Surgery Support Program', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (22, 'a5ca063d-9eed-4cbd-8df5-f297cdc2d256', 'https://i.postimg.cc/vZP4yJGD/Post-Landslide-Aid-for-Chattogram-Hill-Tracts.jpg', 'Post-Landslide Aid for Chattogram Hill Tracts', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (23, '6a762a5c-d0ca-4858-bc61-7f51a71837d8', 'https://i.postimg.cc/Zq20B6BS/Quran-and-Hifz-Education-for-Orphans.jpg', 'Quran and Hifz Education for Orphans', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (24, '6783ab0f-50eb-434a-93ad-1c32aed6c725', 'https://i.postimg.cc/ZYr0nBJG/Relief-for-Storm-hit-Fishing-Communities-Cox-s-Bazar.jpg', 'Relief for Storm-hit Fishing Communities (Cox’s Bazar)', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (25, '86e4f1d7-1212-4eb6-9426-b3ce51e962d2', 'https://i.postimg.cc/QCbXb7tV/Riverbank-Protection-with-Bamboo-Grass.jpg', 'Riverbank Protection with Bamboo & Grass', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (26, '0448dffe-2872-4ff1-aa45-fad911656a2a', 'https://i.postimg.cc/sgWLCrY4/Rural-Women-Co-Operative-Entrepreneurship.jpg', 'Rural Women Co-Operative Entrepreneurship', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (27, 'bb6f4ac1-230d-468e-99b5-78a8ed873a58', 'https://i.postimg.cc/XJj15BTs/School-Bags-Supplies-for-Slum-Kids.jpg', 'School Bags & Supplies for Slum Kids', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (28, 'e8d6f336-6105-4b5d-b8bc-1ced01207808', 'https://i.postimg.cc/kMVzvK2H/Shelter-Care-for-Abandoned-Mentally-Ill.jpg', 'Shelter & Care for Abandoned Mentally Ill', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (29, '51d6e282-241c-4906-a3a6-0de33ea49734', 'https://i.postimg.cc/X74KY06g/Street-Child-Rescue-Rehabilitation.jpg', 'Street Child Rescue & Rehabilitation', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (30, 'ce56f255-05ba-49d5-9a01-068697df359c', 'https://i.postimg.cc/D0W9WbXt/Sylhet-Flash-Flood-Relief.jpg', 'Sylhet Flash Flood Relief', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (31, '63b9745d-ed51-4bc5-bb0c-ab57e22a52e0', 'https://i.postimg.cc/Gt2yvb30/Urban-Coldwave-Blanket-Drive.jpg', 'Urban Coldwave Blanket Drive', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (32, '85ff614b-b399-40a2-93c8-61690d0c07b7', 'https://i.postimg.cc/YqTWmcJV/Urban-Flood-Recovery-in-Dhaka-Chattogram.jpg', 'Urban Flood Recovery in Dhaka & Chattogram', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (33, 'ddb5e5e4-5a41-4b96-b3ce-2992cbd7bfdc', 'https://i.postimg.cc/WzhdhSST/Vocational-Training-for-Underprivileged-Youth.jpg', 'Vocational Training for Underprivileged Youth', 0) ON CONFLICT DO NOTHING;
INSERT INTO public.campaign_images (image_id, campaign_id, image_url, image_alt_text, display_order) VALUES (34, 'e4814545-ed43-4aae-8a51-bcc83dc5a2ea', 'https://i.postimg.cc/44SKrkNd/Women-s-Livelihood-Through-Tailoring.jpg', 'Women’s Livelihood Through Tailoring', 0) ON CONFLICT DO NOTHING;


--
-- TOC entry 4874 (class 0 OID 16872)
-- Dependencies: 223
-- Data for Name: campaign_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4869 (class 0 OID 16779)
-- Dependencies: 218
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('57bb8275-b7d9-441d-94a1-2a7fb93b5d6c', 'Literacy Program for Street Kids', 'A foundational literacy initiative targeting street children with no access to formal education.', 'This campaign provides daily literacy classes, nutritious meals, and psychological counseling to street kids in urban areas. Classes are held in community centers and mobile classrooms, focusing on reading, writing, basic math, and soft skills.', 3500000.00, '2025-06-19', '2025-08-03', '89de332f-13b6-465e-a41c-2671576b2d55', 'Equip 200+ street children with basic reading, writing, and life skills, preparing them for school enrollment or skill training.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('bb6f4ac1-230d-468e-99b5-78a8ed873a58', 'School Bags & Supplies for Slum Kids', 'Distributing school bags, books, and supplies to children living in slums.', 'A back-to-school drive aimed at reducing dropout rates by providing essential academic materials. This includes distributing customized backpacks, notebooks, pens, and hygiene kits to primary and secondary students in 3 slum communities.', 3000000.00, '2025-06-19', '2025-07-19', '89de332f-13b6-465e-a41c-2671576b2d55', 'Support 400+ children with school materials and increase school attendance by 30% in target areas.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('6c0b90a2-4e9f-43a9-9168-7827c7c989ff', 'Mobile Library for Rural Youth', 'Bringing books and reading sessions to remote villages lacking libraries or internet.', 'Hope Harvest will launch a vehicle-based mobile library equipped with books, comics, and digital reading devices. Weekly visits to 15 villages will include story hours, youth clubs, and book lending services.', 7000000.00, '2025-06-19', '2025-08-08', '89de332f-13b6-465e-a41c-2671576b2d55', 'Promote reading culture and digital literacy among 800+ rural youths across multiple districts.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('f8cc1ef3-204e-4781-b363-47c89a3e82eb', 'Free Rural Health Camps', 'Organizing mobile medical units to provide check-ups and medicine in underserved rural areas.', 'Hope Harvest will deploy teams of volunteer doctors, nurses, and paramedics to remote villages across 5 districts. Each camp will offer free diagnostics, basic treatment, maternal care, and essential medicine distribution.', 4500000.00, '2025-06-19', '2025-07-29', '6989837f-79e9-4d8d-a392-2ad19fa0e85f', 'Provide medical care to over 8,000 villagers with zero access to clinics or hospitals.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('ffe4b9b6-1b35-44a8-9f6d-8ff2e94dfcf7', 'Pediatric Surgery Support Program', 'Funding life-saving surgeries for underprivileged children suffering from congenital conditions.', 'This program identifies eligible children through partner hospitals and sponsors surgeries such as cleft lip repair, congenital heart defects, and orthopedic procedures. Full post-operative care and rehabilitation are included.', 6000000.00, '2025-06-19', '2025-08-18', '6989837f-79e9-4d8d-a392-2ad19fa0e85f', 'Sponsor surgeries for 120+ children and ensure their complete recovery and integration into normal life.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('c80d8c55-ea75-4e2d-a3fc-92ea20d95133', 'Maternal Health & Nutrition Drive', 'Promoting safe pregnancies and reducing maternal mortality in slum communities.', 'Hope Harvest will distribute nutrition kits, iron supplements, prenatal checkups, and health awareness sessions to pregnant women in urban slums. Follow-up support during childbirth and postnatal care is included.', 5000000.00, '2025-06-19', '2025-08-08', '6989837f-79e9-4d8d-a392-2ad19fa0e85f', 'Ensure safer pregnancies and delivery outcomes for over 500 women living below the poverty line.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('75ae0f94-d73b-4bf1-9f0a-0b95baab9cea', 'Emergency Ambulance for Hill Districts', 'Launching a solar-powered emergency ambulance service in the Chittagong Hill Tracts.', 'This campaign will help purchase, modify, and deploy two ambulances equipped for hilly terrain. Each vehicle will have basic life support (BLS), oxygen, and telemedicine integration for emergency response.', 7000000.00, '2025-06-19', '2025-08-28', '6989837f-79e9-4d8d-a392-2ad19fa0e85f', 'Enable emergency medical response in remote hill areas, potentially saving hundreds of lives yearly.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('6bdc1747-4a51-41de-8be3-e767d88bd201', 'Eye Camps & Cataract Surgery Mission', 'Restoring vision through free eye camps and cataract surgeries in elderly populations.', 'Mobile eye clinics will screen over 5,000 patients in rural and semi-urban areas. Eligible patients will be provided transportation, surgery, and post-operative follow-ups in partner hospitals.', 3800000.00, '2025-06-19', '2025-07-24', '6989837f-79e9-4d8d-a392-2ad19fa0e85f', 'Restore sight and improve quality of life for 1,000+ elderly individuals through cataract removal.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('74fe18aa-b053-4e46-9eb7-820e7ddbcba4', 'Clean Canals & Backswamps Project', 'Removing years of garbage and toxic buildup from local canals and backswamps.', 'This project focuses on restoring water flow in clogged drainage canals and backswamps in peri-urban areas. It will involve dredging, community awareness drives, installation of debris filters, and planting vegetation along the banks to prevent future siltation.', 6500000.00, '2025-06-19', '2025-08-18', '5b759890-6441-46a0-9600-f78f6312ea94', 'Rehabilitate 15km+ of water channels and reduce local flood risk for over 5,000 residents.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('c7aebe06-fb94-4fe0-81bc-a3f54eb34077', 'One Million Trees for Bangladesh', 'Massive afforestation initiative targeting deforested and vulnerable rural zones.', 'Hope Harvest will collaborate with schools, farmers, and local governments to plant 1 million native saplings across deforested lands, riverbanks, and roadside reserves. The campaign includes training and follow-up visits to ensure sapling survival.', 7000000.00, '2025-06-19', '2025-09-17', '5b759890-6441-46a0-9600-f78f6312ea94', 'Plant 1 million trees across 30 districts, sequestering carbon and restoring lost habitats.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('d1d15d41-66ca-4ed6-bf6f-ebc59f528d6c', 'Clean Your City Movement', 'A volunteer-driven urban hygiene and waste management campaign.', 'This campaign mobilizes schools, communities, and local businesses in major cities to engage in monthly clean-up drives, awareness rallies, and plastic waste separation initiatives. It also includes distribution of public waste bins and graffiti-cleaning in public parks.', 4500000.00, '2025-06-19', '2025-08-03', '5b759890-6441-46a0-9600-f78f6312ea94', 'Engage 15,000+ citizens and remove over 200 tons of unmanaged waste from public spaces.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('86e4f1d7-1212-4eb6-9426-b3ce51e962d2', 'Riverbank Protection with Bamboo & Grass', 'Preventing erosion in disaster-prone riverside areas using eco-engineering methods.', 'Using low-cost, natural materials like bamboo fencing, vetiver grass, and coir mats, this campaign aims to stabilize soil along eroding riversides. It includes training local farmers in erosion control methods and long-term monitoring.', 3000000.00, '2025-06-19', '2025-07-24', '5b759890-6441-46a0-9600-f78f6312ea94', 'Stabilize over 10km of riverbank and protect nearby homes and agricultural land from flood damage.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('77bd8161-eabe-40a7-b304-37ee5b891832', 'Eco Education in Schools', 'Embedding sustainability into school curricula with hands-on learning.', 'Hope Harvest will launch eco-clubs in 100 schools, introduce composting bins, rooftop gardens, and organize climate resilience workshops for teachers and students. Content will be aligned with the national curriculum and local needs.', 3500000.00, '2025-06-19', '2025-08-08', '5b759890-6441-46a0-9600-f78f6312ea94', 'Educate 10,000+ students to become future eco-leaders and initiate sustainable changes in their communities.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('6a762a5c-d0ca-4858-bc61-7f51a71837d8', 'Quran and Hifz Education for Orphans', 'Supporting religious and ethical education for orphans and abandoned children.', 'This campaign funds full-time Hifz classes along with general education, nutrition, and lodging for orphaned children. It covers teacher salaries, learning materials, and memorization support tools such as digital Qurans and progress tracking apps.', 6000000.00, '2025-06-19', '2025-09-17', '89de332f-13b6-465e-a41c-2671576b2d55', 'Enable 60 orphan children to memorize the Quran while receiving holistic care and moral guidance.', 25000.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('3bca42ee-e20e-48ef-928c-1e714523fe41', 'Old Home Renovation & Care Program', 'Improving facilities and caregiving services in old homes for neglected elderly in Bangladesh.', 'In many districts of Bangladesh, elderly citizens who are abandoned or without family support end up in poorly funded old homes. This campaign will renovate key facilities in 3 such institutions located in Dhaka, Mymensingh, and Barisal. It includes new beds, clean bathrooms, solar water heaters, medical beds, and emergency care equipment. Trained caregivers and physiotherapists will also be appointed.', 5000000.00, '2025-06-19', '2025-08-18', 'fdd636d3-a7bc-479b-ac5f-0f46043c356a', 'Enhance the dignity, hygiene, and health care access of 150+ senior citizens in under-resourced shelters.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('9b4c9c8b-4120-4c51-9757-62a35a727d40', 'Orphanage Sustainability & Education', 'Ensuring continuous care, education, and skill-building for orphans in rural Bangladeshi shelters.', 'This campaign supports four orphanages across Sylhet, Khulna, Rangpur, and Tangail districts. It will fund nutritious meals, school tuition, books, clothing, and Islamic education. Orphans aged 5–17 will also receive training in computer literacy, spoken English, and tailoring to help them build a future.', 7000000.00, '2025-06-19', '2025-09-17', 'fdd636d3-a7bc-479b-ac5f-0f46043c356a', 'Secure holistic education and care for 300+ orphans in rural Bangladesh, bridging them to self-reliance.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('51d6e282-241c-4906-a3a6-0de33ea49734', 'Street Child Rescue & Rehabilitation', 'Rehabilitating homeless children from Dhaka, Chattogram, and Rajshahi into safe, educational homes.', 'Bangladesh’s urban centers see thousands of children surviving on the streets due to poverty, abuse, or abandonment. This campaign will deploy outreach teams and run 2 safe transit centers. It will fund medical check-ups, legal support (for child documentation), and admission into shelters or foster care.', 4500000.00, '2025-06-19', '2025-08-03', 'fdd636d3-a7bc-479b-ac5f-0f46043c356a', 'Rescue and reintegrate 120+ children into safe and nurturing environments, keeping them off the streets.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('e8d6f336-6105-4b5d-b8bc-1ced01207808', 'Shelter & Care for Abandoned Mentally Ill', 'Creating a safe recovery center for mentally ill individuals found wandering streets or stations in Bangladesh.', 'In Bangladesh, mentally ill people are often abandoned at bus terminals, stations, or religious shrines. This campaign will build a temporary recovery shelter in Gazipur with psychiatric support, hygiene care, and medication. Local hospital partnerships will allow structured diagnosis, therapy, and recovery planning. Families will be traced where possible.', 6000000.00, '2025-06-19', '2025-08-28', 'fdd636d3-a7bc-479b-ac5f-0f46043c356a', 'Rehabilitate 60+ individuals with severe mental health conditions and restore their dignity and stability.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('fc91d483-446a-43d9-a871-b430f27c5b91', 'Flood Relief in North Bengal', 'Providing emergency aid to flood-hit families in Kurigram, Gaibandha, and Nilphamari.', 'Due to heavy monsoon rains and upstream river swelling, thousands in char areas lose homes yearly. This campaign delivers dry food, pure drinking water, and makeshift shelters for affected communities.', 6500000.00, '2025-06-19', '2025-07-19', '80eb595e-6072-4abb-bf56-553c00cb9d16', 'Support 8,000+ families with food and emergency shelter during monsoon floods.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('9489e009-bdbb-472b-8a5c-fa29e61997ff', 'Cyclone Emergency Response (Southern Coast)', 'Immediate relief for families displaced by cyclone in Khulna, Satkhira, and Barguna.', 'This campaign includes tarpaulin distribution, hygiene kits, emergency food packets, and water purification tablets post-cyclone. Women-friendly spaces will be arranged in shelters.', 7000000.00, '2025-06-19', '2025-07-29', '80eb595e-6072-4abb-bf56-553c00cb9d16', 'Assist 10,000 cyclone-affected individuals with emergency and sanitation support.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('7494939f-a0f0-4e8e-9abc-da5e4d9b2e53', 'Fire Relief for Slum Dwellers (Dhaka)', 'Rebuilding essentials for families affected by fire outbreaks in Korail and Rayerbazar slums.', 'Fires destroy hundreds of makeshift homes annually. This campaign provides cooking items, bedsheets, baby food, and rent support to slum families who lose everything overnight.', 4000000.00, '2025-06-19', '2025-07-09', '80eb595e-6072-4abb-bf56-553c00cb9d16', 'Help 1,500+ fire-hit households restart with dignity and warmth.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('63b9745d-ed51-4bc5-bb0c-ab57e22a52e0', 'Urban Coldwave Blanket Drive', 'Protecting the homeless and rickshaw-pullers from Dhaka winter chill.', 'Winter nights are deadly for street sleepers. This drive distributes thermal blankets, winter jackets, and hot meals at major intersections and stations.', 3000000.00, '2025-06-19', '2025-07-14', '80eb595e-6072-4abb-bf56-553c00cb9d16', 'Serve warmth and food to over 5,000 people vulnerable to hypothermia.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('ce56f255-05ba-49d5-9a01-068697df359c', 'Sylhet Flash Flood Relief', 'Rapid response to flash floods in Sunamganj and Sylhet town areas.', 'Unexpected upstream flooding leaves households stranded. This campaign funds local boats, food parcels, and disinfectants to manage waterborne disease risks.', 5500000.00, '2025-06-19', '2025-07-19', '80eb595e-6072-4abb-bf56-553c00cb9d16', 'Reach 6,000 people with food and flood transport support.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('a5ca063d-9eed-4cbd-8df5-f297cdc2d256', 'Post-Landslide Aid for Chattogram Hill Tracts', 'Supporting indigenous families affected by seasonal landslides in Bandarban and Rangamati.', 'Landslides triggered by heavy rains damage homes and roads. This effort provides temporary shelters, rice, oral saline, and plastic sheets for rebuilding.', 4800000.00, '2025-06-19', '2025-07-24', '80eb595e-6072-4abb-bf56-553c00cb9d16', 'Protect 3,000+ affected individuals and restore mobility in hilly terrain.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('85ff614b-b399-40a2-93c8-61690d0c07b7', 'Urban Flood Recovery in Dhaka & Chattogram', 'Restoring homes and health after severe waterlogging in low-lying city areas.', 'This campaign offers clean drinking water, mosquito nets, and disinfectants to prevent dengue and diarrhea during urban floods in densely populated wards.', 6000000.00, '2025-06-19', '2025-07-17', '80eb595e-6072-4abb-bf56-553c00cb9d16', 'Provide water and sanitation to 7,000 flood-hit city dwellers.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('1321e1ba-b273-47cc-b56a-4c0fee618fa1', 'Heatwave Relief in Northern Districts', 'Protecting outdoor laborers and the elderly from extreme heat stress.', 'Areas like Rajshahi and Dinajpur face rising temperatures. This project distributes electrolyte packs, fans, umbrellas, and arranges cooling centers during May-June heatwaves.', 3500000.00, '2025-06-19', '2025-07-04', '80eb595e-6072-4abb-bf56-553c00cb9d16', 'Reduce heat-related illness among 4,500 rickshaw pullers, farmers, and elderly citizens.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('6783ab0f-50eb-434a-93ad-1c32aed6c725', 'Relief for Storm-hit Fishing Communities (Cox’s Bazar)', 'Emergency support for families who lost boats, nets, and shelters during Nor’wester storms.', 'This campaign provides food, financial stipends, and gear replacement for coastal fishers affected by pre-monsoon storms.', 4300000.00, '2025-06-19', '2025-07-09', '80eb595e-6072-4abb-bf56-553c00cb9d16', 'Help 2,000 coastal families recover livelihoods and food security.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('010bb8d9-fdb7-40b1-a4de-e6f5eb06e722', 'Eid Relief for Disaster-affected Families', 'Providing new clothes, meat, and gifts to disaster-hit families during Eid celebrations.', 'This special campaign brings joy during Eid-ul-Fitr and Eid-ul-Adha to children and families displaced by disaster. Each kit includes new dresses, cooked meals, and festive sweets.', 3000000.00, '2025-06-19', '2025-06-29', '80eb595e-6072-4abb-bf56-553c00cb9d16', 'Bring dignity and happiness to 2,500 struggling families during Eid.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('e4814545-ed43-4aae-8a51-bcc83dc5a2ea', 'Women’s Livelihood Through Tailoring', 'Empowering rural women with tailoring training and sewing machines for income generation.', 'Hope Harvest will provide 3-month certified tailoring training to 200 women in Narshingdi, Kushtia, and Noakhali. Each participant will receive a sewing machine, initial materials, and marketing training to start their own home-based or group tailoring business.', 5000000.00, '2025-06-19', '2025-08-18', '7704e0e3-0083-42dc-a6c9-c2a37233645c', 'Enable 200+ women to earn at least BDT 5,000/month through self-employment in tailoring.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('1583d2ea-c3b5-48d8-8d83-a6fd54d940ab', 'Agri-Startup Support for Small Farmers', 'Providing tools, seed capital, and training to help marginal farmers start profitable agribusinesses.', 'This campaign supports 150 small-scale farmers in Rajshahi and Mymensingh with high-yield seeds, organic compost training, and digital market access tools. Farmers will be coached on water efficiency, livestock, and selling through B2B platforms.', 6500000.00, '2025-06-19', '2025-09-02', '7704e0e3-0083-42dc-a6c9-c2a37233645c', 'Boost incomes and market resilience for 150+ farmers through sustainable agri-entrepreneurship.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('ddb5e5e4-5a41-4b96-b3ce-2992cbd7bfdc', 'Vocational Training for Underprivileged Youth', 'Offering skill-based courses and placement support for unemployed rural youth.', 'The project will launch 4 vocational skill centers offering IT support, electrical work, refrigeration, and mobile servicing training in Bogura, Khulna, and Sylhet. Trainees will also receive resume, interview, and entrepreneurship workshops.', 6000000.00, '2025-06-19', '2025-08-18', '7704e0e3-0083-42dc-a6c9-c2a37233645c', 'Train 300+ youth in demand-driven skills and support job or micro-business placement.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('73fe9346-bffc-47b9-ba60-cfd393000dff', 'Disability-Inclusive Micro-Business Program', 'Enabling people with disabilities to start accessible home-based enterprises.', 'This campaign will offer grant funding and training for persons with physical and speech disabilities to run digital centers, handicraft shops, or online services. It includes adaptive tools, mentorship, and support to register their businesses.', 4000000.00, '2025-06-19', '2025-08-08', '7704e0e3-0083-42dc-a6c9-c2a37233645c', 'Launch 100+ inclusive businesses run by persons with disabilities across 10 districts.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('0448dffe-2872-4ff1-aa45-fad911656a2a', 'Rural Women Co-Operative Entrepreneurship', 'Forming and funding women-led co-operatives for dairy, pickles, or handicrafts.', 'Hope Harvest will facilitate 20 women’s co-ops across Tangail and Netrokona. Groups will receive training on pricing, group savings, packaging, and fair trade marketing. Profits will be reinvested in their communities.', 7000000.00, '2025-06-19', '2025-09-07', '7704e0e3-0083-42dc-a6c9-c2a37233645c', 'Build 20 sustainable women-led businesses improving local livelihoods and leadership.', 0.00) ON CONFLICT DO NOTHING;
INSERT INTO public.campaigns (campaign_id, title, description, details, goal_amount, start_date, end_date, category_id, expected_impact, collected_amount) VALUES ('4e3b6179-b3f9-4d01-85c4-be60b12d8c95', 'Garments Training for Women', 'Vocational training for underprivileged women to gain employment in the garments sector.', 'In partnership with local factories and NGOs, this campaign offers a 3-month training program in sewing, quality control, and machine handling. Trainees also receive job placement assistance and child care support.', 5000000.00, '2025-06-19', '2025-08-18', '89de332f-13b6-465e-a41c-2671576b2d55', 'Train 100+ women and help 75% of them secure employment or self-employment within 3 months of program completion.', 75000.00) ON CONFLICT DO NOTHING;


--
-- TOC entry 4873 (class 0 OID 16844)
-- Dependencies: 222
-- Data for Name: donation_usage; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4872 (class 0 OID 16809)
-- Dependencies: 221
-- Data for Name: donations; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.donations (donation_id, external_user_id, campaign_id, amount, donation_date, status, payment_method, transaction_id, is_anonymous, tracking_key) VALUES ('5a92bf9d-97c1-4feb-a34e-26bfe70e68aa', '297c27ed-4f2d-4676-ac81-b3a3689055d0', '4e3b6179-b3f9-4d01-85c4-be60b12d8c95', 25000.00, '2025-06-20 15:50:09.866406+06', 'COMPLETED', 'BKASH', '71f7dba5f6b0406e', false, 'TRK-5a92bf9d') ON CONFLICT DO NOTHING;
INSERT INTO public.donations (donation_id, external_user_id, campaign_id, amount, donation_date, status, payment_method, transaction_id, is_anonymous, tracking_key) VALUES ('01969e52-4178-40ea-a030-c080b4693ef1', '297c27ed-4f2d-4676-ac81-b3a3689055d0', '4e3b6179-b3f9-4d01-85c4-be60b12d8c95', 25000.00, '2025-06-20 16:24:36.40877+06', 'COMPLETED', 'UPAY', 'c50fe35bb5d94071', false, 'TRK-01969e52') ON CONFLICT DO NOTHING;
INSERT INTO public.donations (donation_id, external_user_id, campaign_id, amount, donation_date, status, payment_method, transaction_id, is_anonymous, tracking_key) VALUES ('6ea6cb71-c15f-426c-a49f-284d26508683', '297c27ed-4f2d-4676-ac81-b3a3689055d0', '4e3b6179-b3f9-4d01-85c4-be60b12d8c95', 25000.00, '2025-06-20 16:28:01.750116+06', 'COMPLETED', 'VISA', '8deb65fcfd4b44e2', false, 'TRK-6ea6cb71') ON CONFLICT DO NOTHING;
INSERT INTO public.donations (donation_id, external_user_id, campaign_id, amount, donation_date, status, payment_method, transaction_id, is_anonymous, tracking_key) VALUES ('b850d337-dee0-4b7b-a48a-44c40b5cdb9f', NULL, '6a762a5c-d0ca-4858-bc61-7f51a71837d8', 25000.00, '2025-06-20 22:59:06.890983+06', 'COMPLETED', 'BKASH', '5df1de8e21af42e9', true, 'TRK-b850d337') ON CONFLICT DO NOTHING;


--
-- TOC entry 4875 (class 0 OID 17247)
-- Dependencies: 224
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.payments (payment_id, donation_id, gateway_name, transaction_id, amount, status, otp) VALUES ('2580e563-04d0-4689-8c44-bdb2b567c257', '5a92bf9d-97c1-4feb-a34e-26bfe70e68aa', 'BKASH', '71f7dba5f6b0406e', 25000.00, 'COMPLETED', '066779') ON CONFLICT DO NOTHING;
INSERT INTO public.payments (payment_id, donation_id, gateway_name, transaction_id, amount, status, otp) VALUES ('22ecffd0-9916-469a-9e1d-5df27633b5f6', '01969e52-4178-40ea-a030-c080b4693ef1', 'UPAY', 'c50fe35bb5d94071', 25000.00, 'COMPLETED', '012377') ON CONFLICT DO NOTHING;
INSERT INTO public.payments (payment_id, donation_id, gateway_name, transaction_id, amount, status, otp) VALUES ('f60ecba4-13f1-497f-9148-34f67c488f68', '6ea6cb71-c15f-426c-a49f-284d26508683', 'VISA', '8deb65fcfd4b44e2', 25000.00, 'COMPLETED', '498980') ON CONFLICT DO NOTHING;
INSERT INTO public.payments (payment_id, donation_id, gateway_name, transaction_id, amount, status, otp) VALUES ('d3095b3a-e691-43f2-90d9-abe8a31c413d', 'b850d337-dee0-4b7b-a48a-44c40b5cdb9f', 'BKASH', '5df1de8e21af42e9', 25000.00, 'COMPLETED', '934404') ON CONFLICT DO NOTHING;


--
-- TOC entry 4883 (class 0 OID 0)
-- Dependencies: 219
-- Name: campaign_images_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.campaign_images_image_id_seq', 34, true);


--
-- TOC entry 4689 (class 2606 OID 17462)
-- Name: campaign_categories campaign_categories_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_categories
    ADD CONSTRAINT campaign_categories_name_key UNIQUE (name);


--
-- TOC entry 4691 (class 2606 OID 16776)
-- Name: campaign_categories campaign_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_categories
    ADD CONSTRAINT campaign_categories_pkey PRIMARY KEY (category_id);


--
-- TOC entry 4695 (class 2606 OID 17040)
-- Name: campaign_images campaign_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_images
    ADD CONSTRAINT campaign_images_pkey PRIMARY KEY (image_id);


--
-- TOC entry 4707 (class 2606 OID 16883)
-- Name: campaign_requests campaign_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_requests
    ADD CONSTRAINT campaign_requests_pkey PRIMARY KEY (request_id);


--
-- TOC entry 4693 (class 2606 OID 16788)
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (campaign_id);


--
-- TOC entry 4701 (class 2606 OID 16852)
-- Name: donation_usage donation_usage_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donation_usage
    ADD CONSTRAINT donation_usage_pkey PRIMARY KEY (usage_id);


--
-- TOC entry 4697 (class 2606 OID 16818)
-- Name: donations donations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_pkey PRIMARY KEY (donation_id);


--
-- TOC entry 4713 (class 2606 OID 17254)
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (payment_id);


--
-- TOC entry 4708 (class 1259 OID 16890)
-- Name: idx_campaign_requests_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_campaign_requests_status ON public.campaign_requests USING btree (status);


--
-- TOC entry 4709 (class 1259 OID 16889)
-- Name: idx_campaign_requests_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_campaign_requests_user_id ON public.campaign_requests USING btree (external_user_id);


--
-- TOC entry 4702 (class 1259 OID 16869)
-- Name: idx_donation_usage_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_donation_usage_campaign_id ON public.donation_usage USING btree (campaign_id);


--
-- TOC entry 4703 (class 1259 OID 16870)
-- Name: idx_donation_usage_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_donation_usage_category_id ON public.donation_usage USING btree (campaign_category_id);


--
-- TOC entry 4704 (class 1259 OID 16868)
-- Name: idx_donation_usage_donation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_donation_usage_donation_id ON public.donation_usage USING btree (donation_id);


--
-- TOC entry 4705 (class 1259 OID 16871)
-- Name: idx_donation_usage_event_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_donation_usage_event_id ON public.donation_usage USING btree (external_event_id) WHERE (external_event_id IS NOT NULL);


--
-- TOC entry 4698 (class 1259 OID 16824)
-- Name: idx_donations_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_donations_campaign_id ON public.donations USING btree (campaign_id);


--
-- TOC entry 4699 (class 1259 OID 16825)
-- Name: idx_donations_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_donations_user_id ON public.donations USING btree (external_user_id) WHERE (external_user_id IS NOT NULL);


--
-- TOC entry 4710 (class 1259 OID 17260)
-- Name: idx_payments_donation_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_donation_id ON public.payments USING btree (donation_id);


--
-- TOC entry 4711 (class 1259 OID 17261)
-- Name: idx_payments_transaction_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_payments_transaction_id ON public.payments USING btree (transaction_id) WHERE (transaction_id IS NOT NULL);


--
-- TOC entry 4722 (class 2620 OID 16892)
-- Name: campaign_requests campaign_request_approval_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER campaign_request_approval_trigger AFTER UPDATE OF status ON public.campaign_requests FOR EACH ROW EXECUTE FUNCTION public.create_campaign_on_approval();


--
-- TOC entry 4715 (class 2606 OID 16804)
-- Name: campaign_images campaign_images_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_images
    ADD CONSTRAINT campaign_images_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(campaign_id) ON DELETE CASCADE;


--
-- TOC entry 4720 (class 2606 OID 16884)
-- Name: campaign_requests campaign_requests_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaign_requests
    ADD CONSTRAINT campaign_requests_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.campaign_categories(category_id);


--
-- TOC entry 4714 (class 2606 OID 16789)
-- Name: campaigns campaigns_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.campaign_categories(category_id);


--
-- TOC entry 4717 (class 2606 OID 16863)
-- Name: donation_usage donation_usage_campaign_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donation_usage
    ADD CONSTRAINT donation_usage_campaign_category_id_fkey FOREIGN KEY (campaign_category_id) REFERENCES public.campaign_categories(category_id);


--
-- TOC entry 4718 (class 2606 OID 16858)
-- Name: donation_usage donation_usage_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donation_usage
    ADD CONSTRAINT donation_usage_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(campaign_id);


--
-- TOC entry 4719 (class 2606 OID 16853)
-- Name: donation_usage donation_usage_donation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donation_usage
    ADD CONSTRAINT donation_usage_donation_id_fkey FOREIGN KEY (donation_id) REFERENCES public.donations(donation_id);


--
-- TOC entry 4716 (class 2606 OID 16819)
-- Name: donations donations_campaign_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_campaign_id_fkey FOREIGN KEY (campaign_id) REFERENCES public.campaigns(campaign_id);


--
-- TOC entry 4721 (class 2606 OID 17255)
-- Name: payments payments_donation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_donation_id_fkey FOREIGN KEY (donation_id) REFERENCES public.donations(donation_id);


-- Completed on 2025-06-21 00:49:11

--
-- PostgreSQL database dump complete
--

