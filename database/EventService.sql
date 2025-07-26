--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-07-27 04:32:34

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16910)
-- Name: event_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event_images (
    image_id bigint NOT NULL,
    event_id bigint NOT NULL,
    image_url character varying(500) NOT NULL,
    image_alt_text character varying(255),
    display_order integer DEFAULT 0
);


ALTER TABLE public.event_images OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16909)
-- Name: event_images_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_images_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_images_image_id_seq OWNER TO postgres;

--
-- TOC entry 4918 (class 0 OID 0)
-- Dependencies: 219
-- Name: event_images_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_images_image_id_seq OWNED BY public.event_images.image_id;


--
-- TOC entry 218 (class 1259 OID 16895)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    event_id bigint NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    report character varying(100),
    start_date timestamp with time zone NOT NULL,
    end_date timestamp with time zone NOT NULL,
    location_address character varying(255) NOT NULL,
    location_city character varying(100) NOT NULL,
    location_district character varying(100) NOT NULL,
    status character varying(20) NOT NULL,
    required_goods jsonb,
    budget_amount numeric(12,2),
    external_campaign_id uuid NOT NULL,
    CONSTRAINT event_dates_check CHECK ((end_date >= start_date)),
    CONSTRAINT events_status_check CHECK (((status)::text = ANY ((ARRAY['UPCOMING'::character varying, 'ONGOING'::character varying, 'COMPLETED'::character varying])::text[])))
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16894)
-- Name: events_event_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_event_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.events_event_id_seq OWNER TO postgres;

--
-- TOC entry 4919 (class 0 OID 0)
-- Dependencies: 217
-- Name: events_event_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_event_id_seq OWNED BY public.events.event_id;


--
-- TOC entry 222 (class 1259 OID 16945)
-- Name: fund_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fund_applications (
    application_id uuid DEFAULT gen_random_uuid() NOT NULL,
    external_user_id uuid NOT NULL,
    full_name character varying(255) NOT NULL,
    phone_number character varying(20) NOT NULL,
    national_id character varying(50) NOT NULL,
    amount numeric(12,2) NOT NULL,
    purpose character varying(255) NOT NULL,
    submission_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    feedback text,
    disbursed_amount numeric(12,2),
    disbursement_date timestamp with time zone,
    bank_account_no text,
    bank_name text,
    bank_branch text,
    union_name text,
    upazila text,
    district text,
    postal_code text,
    nid text,
    nationality_proof text,
    other_document text,
    CONSTRAINT fund_applications_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'UNDER_VERIFICATION'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying])::text[])))
);


ALTER TABLE public.fund_applications OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 17129)
-- Name: fund_applications_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fund_applications_documents (
    fund_applications_application_id uuid NOT NULL,
    documents jsonb
);


ALTER TABLE public.fund_applications_documents OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16958)
-- Name: fund_verifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fund_verifications (
    verification_id uuid DEFAULT gen_random_uuid() NOT NULL,
    application_id uuid NOT NULL,
    assigned_volunteer_id uuid NOT NULL,
    assigned_date timestamp with time zone,
    verification_due_date timestamp with time zone,
    recommendation character varying(20),
    recommended_amount numeric(12,2),
    report text,
    CONSTRAINT fund_verifications_recommendation_check CHECK (((recommendation)::text = ANY ((ARRAY[NULL::character varying, 'APPROVE'::character varying, 'PARTIALLY_APPROVE'::character varying, 'REJECT'::character varying])::text[])))
);


ALTER TABLE public.fund_verifications OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16980)
-- Name: team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team (
    team_id bigint NOT NULL,
    event_id bigint NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    leader_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.team OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17054)
-- Name: team_members; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.team_members (
    team_members_id bigint NOT NULL,
    team_id bigint NOT NULL,
    volunteer_id uuid NOT NULL
);


ALTER TABLE public.team_members OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 17053)
-- Name: team_members_team_members_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_members_team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_members_team_members_id_seq OWNER TO postgres;

--
-- TOC entry 4920 (class 0 OID 0)
-- Dependencies: 228
-- Name: team_members_team_members_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_members_team_members_id_seq OWNED BY public.team_members.team_members_id;


--
-- TOC entry 224 (class 1259 OID 16979)
-- Name: team_team_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.team_team_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.team_team_id_seq OWNER TO postgres;

--
-- TOC entry 4921 (class 0 OID 0)
-- Dependencies: 224
-- Name: team_team_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.team_team_id_seq OWNED BY public.team.team_id;


--
-- TOC entry 227 (class 1259 OID 17003)
-- Name: volunteer_rating; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.volunteer_rating (
    rating_id bigint NOT NULL,
    volunteer_id uuid NOT NULL,
    team_id bigint NOT NULL,
    rated_by_volunteer_id uuid,
    performance_rating integer NOT NULL,
    punctuality_rating integer NOT NULL,
    communication_rating integer NOT NULL,
    overall_rating numeric(3,2) GENERATED ALWAYS AS (((((performance_rating + punctuality_rating) + communication_rating))::numeric / (3)::numeric)) STORED,
    feedback text,
    strengths text,
    areas_for_improvement text,
    hours_worked integer,
    CONSTRAINT volunteer_rating_communication_rating_check CHECK (((communication_rating >= 1) AND (communication_rating <= 5))),
    CONSTRAINT volunteer_rating_performance_rating_check CHECK (((performance_rating >= 1) AND (performance_rating <= 5))),
    CONSTRAINT volunteer_rating_punctuality_rating_check CHECK (((punctuality_rating >= 1) AND (punctuality_rating <= 5)))
);


ALTER TABLE public.volunteer_rating OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 17002)
-- Name: volunteer_rating_rating_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.volunteer_rating_rating_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.volunteer_rating_rating_id_seq OWNER TO postgres;

--
-- TOC entry 4922 (class 0 OID 0)
-- Dependencies: 226
-- Name: volunteer_rating_rating_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.volunteer_rating_rating_id_seq OWNED BY public.volunteer_rating.rating_id;


--
-- TOC entry 221 (class 1259 OID 16924)
-- Name: volunteers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.volunteers (
    volunteer_id uuid DEFAULT gen_random_uuid() NOT NULL,
    external_user_id uuid NOT NULL,
    national_id character varying(50) NOT NULL,
    phone_number character varying(20) NOT NULL,
    email character varying(255) NOT NULL,
    address_city character varying(100) NOT NULL,
    address_postal_code character varying(20),
    address_district character varying(100) NOT NULL,
    skills text[],
    interests text[],
    availability boolean,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    total_hours integer DEFAULT 0,
    assignments_completed integer DEFAULT 0,
    average_rating numeric(3,2),
    CONSTRAINT volunteers_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying, 'SUSPENDED'::character varying])::text[])))
);


ALTER TABLE public.volunteers OWNER TO postgres;

--
-- TOC entry 4678 (class 2604 OID 17086)
-- Name: event_images image_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_images ALTER COLUMN image_id SET DEFAULT nextval('public.event_images_image_id_seq'::regclass);


--
-- TOC entry 4677 (class 2604 OID 17106)
-- Name: events event_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN event_id SET DEFAULT nextval('public.events_event_id_seq'::regclass);


--
-- TOC entry 4688 (class 2604 OID 17134)
-- Name: team team_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team ALTER COLUMN team_id SET DEFAULT nextval('public.team_team_id_seq'::regclass);


--
-- TOC entry 4693 (class 2604 OID 17169)
-- Name: team_members team_members_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members ALTER COLUMN team_members_id SET DEFAULT nextval('public.team_members_team_members_id_seq'::regclass);


--
-- TOC entry 4691 (class 2604 OID 17190)
-- Name: volunteer_rating rating_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteer_rating ALTER COLUMN rating_id SET DEFAULT nextval('public.volunteer_rating_rating_id_seq'::regclass);


--
-- TOC entry 4902 (class 0 OID 16910)
-- Dependencies: 220
-- Data for Name: event_images; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4900 (class 0 OID 16895)
-- Dependencies: 218
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.events VALUES (3, 'Distributing Books in Azimpur , Dhaka', 'We will distribute books and khatas among 100 street kids', NULL, '2025-07-26 20:00:00+06', '2025-07-31 12:30:00+06', 'Azimpur Etimkhana Mor', 'Dhaka South', 'Dhaka', 'ONGOING', '[{"item": "Khata", "unit": "Pcs", "quantity": 200, "unitPrice": 50, "totalPrice": 10000}, {"item": "Books", "unit": "Pcs", "quantity": 1000, "unitPrice": 200, "totalPrice": 200000}]', 210000.00, '57bb8275-b7d9-441d-94a1-2a7fb93b5d6c');
INSERT INTO public.events VALUES (1, 'Relief Distribution in Gaibandha', 'Distribute Relief Materials to 500 Flood Affected People in Gaibandha', 'The event was finished successfully', '2025-07-08 12:30:00+06', '2025-07-09 19:30:00+06', 'Main Road', 'Gaibandha Sadar', 'Gaibandha', 'ONGOING', '[{"item": "Rice", "unit": "Kg", "quantity": 100, "unitPrice": 50, "totalPrice": 5000}, {"item": "Rice", "unit": "Kg", "quantity": 2500, "unitPrice": 50, "totalPrice": 125000}, {"item": "Puffed RIce", "unit": "Kg", "quantity": 1000, "unitPrice": 45, "totalPrice": 45000}, {"item": "Jaggery", "unit": "kg", "quantity": 250, "unitPrice": 170, "totalPrice": 42500}]', 1000000.00, 'fc91d483-446a-43d9-a871-b430f27c5b91');


--
-- TOC entry 4904 (class 0 OID 16945)
-- Dependencies: 222
-- Data for Name: fund_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.fund_applications VALUES ('2215b4a8-baf2-487f-8c3f-88410bca8e33', '297c27ed-4f2d-4676-ac81-b3a3689055d0', 'Souvik Mondol', '+8801720052005', '1234567890', 100000.00, 'For my treatment', '2025-07-25 15:54:22.030803+06', 'REJECTED', 'This application cannot be accepted. Get your documents correct and apply again', 0.00, '2025-07-26 01:06:36.329+06', '12345678901234567', 'Sonali Bank', 'Sonali Bank , BagerHat', 'Khansama', 'Bagerhat Sadar', 'Bagerhat', '1500', 'https://pdf-temp-files.s3.us-west-2.amazonaws.com/09VPPICUKW704P9RIHXKKU2VXMMUAIJX/API_documentation.pdf?X-Amz-Expires=3600&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIZJDPLX6D7EHVCKA/20250725/us-west-2/s3/aws4_request&X-Amz-Date=20250725T095355Z&X-Amz-SignedHeaders=host&X-Amz-Signature=23a1ee533d30274136b1d449dbb770063504ee5163259c3115da97f003cf7920', 'https://pdf-temp-files.s3.us-west-2.amazonaws.com/86DT3JXHB9WOK4AEKG4G9GH7BV35DPPV/_CSE_408__Online_Assignment_January_2025.pdf?X-Amz-Expires=3600&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIZJDPLX6D7EHVCKA/20250725/us-west-2/s3/aws4_request&X-Amz-Date=20250725T095409Z&X-Amz-SignedHeaders=host&X-Amz-Signature=200dd2377c280a6ee76a79af59c437a2ff4c0cc8a166a5adfbf839dd3fcf1ef6', 'https://pdf-temp-files.s3.us-west-2.amazonaws.com/P7OCKR4HVEXBBD5Y8X0VWVNIC4AGH5VR/CSE_410_Offline_3_Specs__Updated_06-08-22_.pdf?X-Amz-Expires=3600&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIZJDPLX6D7EHVCKA/20250725/us-west-2/s3/aws4_request&X-Amz-Date=20250725T095419Z&X-Amz-SignedHeaders=host&X-Amz-Signature=95d879469ed6a2495043bb9750af82d030dfc7117ef264f60167683613f77394');
INSERT INTO public.fund_applications VALUES ('29aa102e-dc66-4fdc-af6c-4716f8166f07', '297c27ed-4f2d-4676-ac81-b3a3689055d0', 'Souvik Mondol', '+8801575403187', '1234567890', 99999.99, 'I am unemployed', '2025-07-25 22:22:20.694389+06', 'REJECTED', 'Sorry Cannot approve your application due to lack of proper documents', 0.00, '2025-07-26 19:10:21.805+06', '12345678901234567', 'Sonali Bank', 'Sonali Bank , BagerHat', 'Khansama', 'Bagerhat Sadar', 'Bagerhat', '1500', 'https://pdf-temp-files.s3.us-west-2.amazonaws.com/VFHWWSYWUKUHRNDXWNSZQF0T4FBIV24V/_CSE_408__Online_Assignment_January_2025.pdf?X-Amz-Expires=3600&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIZJDPLX6D7EHVCKA/20250725/us-west-2/s3/aws4_request&X-Amz-Date=20250725T162153Z&X-Amz-SignedHeaders=host&X-Amz-Signature=27b2ef2eb5844e13d0f5c1f76f438c1bf3ac1f0a9ede43c0844e0cccca9c5933', 'https://pdf-temp-files.s3.us-west-2.amazonaws.com/1GYF004QJAH08S7K75UM6VRLQD8DW65I/_CSE_408__Online_Assignment_January_2025.pdf?X-Amz-Expires=3600&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIZJDPLX6D7EHVCKA/20250725/us-west-2/s3/aws4_request&X-Amz-Date=20250725T162203Z&X-Amz-SignedHeaders=host&X-Amz-Signature=ce031f7269803b5f8ebcddc1ee1f24b8925dc740259c0aa40e37050ef29b51cc', 'https://pdf-temp-files.s3.us-west-2.amazonaws.com/MUG3SCDWWSZKJNOMFZWB74F7CSYUINZP/_CSE_408__Online_Assignment_January_2025.pdf?X-Amz-Expires=3600&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIZJDPLX6D7EHVCKA/20250725/us-west-2/s3/aws4_request&X-Amz-Date=20250725T162218Z&X-Amz-SignedHeaders=host&X-Amz-Signature=c58026268b154a645db1bd2f96af4c7475b3c784c1c8dc5803d7acd626bf53d8');


--
-- TOC entry 4912 (class 0 OID 17129)
-- Dependencies: 230
-- Data for Name: fund_applications_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 4905 (class 0 OID 16958)
-- Dependencies: 223
-- Data for Name: fund_verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.fund_verifications VALUES ('cea89c6c-4e5c-41e8-b9df-e6b1c19121ed', '2215b4a8-baf2-487f-8c3f-88410bca8e33', '10865d8a-70e8-4f05-bd5e-39a7169c7e86', '2025-07-25 23:32:22.032969+06', '2025-08-09 23:32:22.032969+06', 'Partially Approve', 10.00, 'The amount asked is likely pretty high for the reason he is asking. That''s why a reduced amount is recommended.');
INSERT INTO public.fund_verifications VALUES ('cad9a3bb-76ef-43a1-80c3-c81bdea901b2', '29aa102e-dc66-4fdc-af6c-4716f8166f07', '5341e8bd-0a00-4302-b2f7-8c37d3528eb0', '2025-07-25 23:02:29.036175+06', '2025-08-09 23:02:29.036175+06', 'Completely Reject', 0.01, 'No proper document. Submit offline declaration pdf in place of nid, nationality proof');


--
-- TOC entry 4907 (class 0 OID 16980)
-- Dependencies: 225
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.team VALUES (4, 1, 'Relief Distribution in Gaibandha Team', 'Team formed for Relief Distribution in Gaibandha event in Gaibandha Sadar, Gaibandha.', '1bb1ff7d-dd9c-444c-b6a3-a8deeba8ada0', '2025-07-27 01:05:09.128349+06', '2025-07-27 01:05:09.128349+06');
INSERT INTO public.team VALUES (5, 3, 'Distributing Books in Azimpur , Dhaka Team', 'Team formed for Distributing Books in Azimpur , Dhaka event in Dhaka South, Dhaka.', '10865d8a-70e8-4f05-bd5e-39a7169c7e86', '2025-07-27 01:05:54.991977+06', '2025-07-27 01:05:54.991977+06');


--
-- TOC entry 4911 (class 0 OID 17054)
-- Dependencies: 229
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.team_members VALUES (12, 4, '1bb1ff7d-dd9c-444c-b6a3-a8deeba8ada0');
INSERT INTO public.team_members VALUES (13, 4, '10865d8a-70e8-4f05-bd5e-39a7169c7e86');
INSERT INTO public.team_members VALUES (14, 4, '5341e8bd-0a00-4302-b2f7-8c37d3528eb0');
INSERT INTO public.team_members VALUES (15, 4, '8854430f-fb0c-4726-a298-5fe165f6e306');
INSERT INTO public.team_members VALUES (16, 4, '14746d46-9b34-45cc-a3df-891f80500c41');
INSERT INTO public.team_members VALUES (17, 4, '8daad34f-1e1a-46b8-870c-102951c2ee76');
INSERT INTO public.team_members VALUES (18, 5, '10865d8a-70e8-4f05-bd5e-39a7169c7e86');
INSERT INTO public.team_members VALUES (19, 5, '1bb1ff7d-dd9c-444c-b6a3-a8deeba8ada0');
INSERT INTO public.team_members VALUES (20, 5, '14746d46-9b34-45cc-a3df-891f80500c41');
INSERT INTO public.team_members VALUES (21, 5, '9bcafd57-e0cf-48d7-bf70-ea9903b90bb6');
INSERT INTO public.team_members VALUES (22, 5, '5ebf16d0-e74d-4842-bb54-28714b2e00ca');


--
-- TOC entry 4909 (class 0 OID 17003)
-- Dependencies: 227
-- Data for Name: volunteer_rating; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.volunteer_rating VALUES (1, '10865d8a-70e8-4f05-bd5e-39a7169c7e86', 4, '1bb1ff7d-dd9c-444c-b6a3-a8deeba8ada0', 4, 4, 4, DEFAULT, 'Good, HardWorking, Team person', 'HardWorking, Not afraid of taking toils', 'Nervous in may situation, has a communication problem', 9);
INSERT INTO public.volunteer_rating VALUES (2, '5341e8bd-0a00-4302-b2f7-8c37d3528eb0', 4, '1bb1ff7d-dd9c-444c-b6a3-a8deeba8ada0', 3, 3, 2, DEFAULT, 'Good Person , but is not good with management', 'Hard Working, Pure soul', 'Punctuality needs to be improved, Need to work about public communication', 7);
INSERT INTO public.volunteer_rating VALUES (3, '8854430f-fb0c-4726-a298-5fe165f6e306', 4, '1bb1ff7d-dd9c-444c-b6a3-a8deeba8ada0', 5, 5, 5, DEFAULT, 'Good', 'Excellent', 'No need', 13);
INSERT INTO public.volunteer_rating VALUES (6, '14746d46-9b34-45cc-a3df-891f80500c41', 4, '1bb1ff7d-dd9c-444c-b6a3-a8deeba8ada0', 5, 5, 4, DEFAULT, 'bsdbsjdj', 'kjnnckw', 'cwklcnkdlcn', 13);
INSERT INTO public.volunteer_rating VALUES (12, '8daad34f-1e1a-46b8-870c-102951c2ee76', 4, '1bb1ff7d-dd9c-444c-b6a3-a8deeba8ada0', 5, 5, 5, DEFAULT, 'good', 'good', 'excellent', 13);
INSERT INTO public.volunteer_rating VALUES (13, '1bb1ff7d-dd9c-444c-b6a3-a8deeba8ada0', 4, '1bb1ff7d-dd9c-444c-b6a3-a8deeba8ada0', 5, 5, 5, DEFAULT, 'good', 'good', 'none', 15);


--
-- TOC entry 4903 (class 0 OID 16924)
-- Dependencies: 221
-- Data for Name: volunteers; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.volunteers VALUES ('7a5aae22-10ec-4546-80ea-484d17e5b24f', 'b36eb6df-ea4b-4f03-ba11-0b606324be6a', '1234567890', '+8801575403187', '2005118@gmail.com', 'Sylhet Sadar', '3600', 'Sylhet', '{Cooking,Accounting,"Public Speaking"}', '{Education,"Disaster Relief","Child Welfare"}', true, 'ACTIVE', 0, 0, 0.00);
INSERT INTO public.volunteers VALUES ('9bcafd57-e0cf-48d7-bf70-ea9903b90bb6', '66d3bb0a-7fe6-498d-bf13-09de01b31f22', '1234567890', '+8801575403188', '2005119@gmail.com', 'Bogura Sadar', '4900', 'Bagura', '{"Computer Skills",Driving,Translation}', '{"Elderly Care","Women Empowerment","Food Distribution"}', true, 'ACTIVE', 0, 0, 0.00);
INSERT INTO public.volunteers VALUES ('5ebf16d0-e74d-4842-bb54-28714b2e00ca', 'c98d8c46-5e5b-4516-957f-fa41dc0f58d2', '1234567890', '+8801575403187', '2005120@gmail.com', 'Rangamati Sadar', '2700', 'Rangamati', '{"First Aid",Counseling,"Project Management"}', '{"Disaster Relief","Elderly Care","Poverty Alleviation","Skill Training"}', true, 'ACTIVE', 0, 0, 0.00);
INSERT INTO public.volunteers VALUES ('8daad34f-1e1a-46b8-870c-102951c2ee76', '189a3d34-ca37-44c5-945e-edefde17bee6', '1234567890', '+8801575403187', '2005117@gmail.com', 'Goforgaon', '4100', 'Mymensingh', '{Photography,Administrative}', '{"Environmental Conservation","Clean Water Projects"}', true, 'ACTIVE', 13, 1, 5.00);
INSERT INTO public.volunteers VALUES ('10865d8a-70e8-4f05-bd5e-39a7169c7e86', 'dde32737-8b22-4b64-a0fe-efcce73b1cf0', '1234567890', '+8801720052005', 'mm@gmail.com', 'Dhaka', '1000', 'Dhaka', NULL, NULL, true, 'ACTIVE', 9, 1, 4.00);
INSERT INTO public.volunteers VALUES ('5341e8bd-0a00-4302-b2f7-8c37d3528eb0', 'd7055fea-1892-4868-a11a-56e9d22c4d04', '1234567890', '+8801720052005', '2005114@gmail.com', 'Badda', '1000', 'Dhaka', '{"Medical Care","Computer Skills"}', '{Healthcare,"Disaster Relief"}', true, 'ACTIVE', 7, 1, 2.67);
INSERT INTO public.volunteers VALUES ('8854430f-fb0c-4726-a298-5fe165f6e306', 'b03ae9c7-7a62-457e-8d63-8a1da09349d5', '1234567890', '+8801720052005', '2005116@gmail.com', 'Gaibandha Sadar', '3100', 'Gaibandha', '{"Medical Care",Construction}', '{"Disaster Relief","Child Welfare"}', true, 'ACTIVE', 13, 1, 5.00);
INSERT INTO public.volunteers VALUES ('14746d46-9b34-45cc-a3df-891f80500c41', '9d109e5a-007f-47fe-bc5b-59f6136c6dc4', '1234567890', '+8801720052005', '2005115@gmail.com', 'Bhola Sadar', '3100', 'Bhola', '{Teaching,"Computer Skills"}', '{Healthcare,"Environmental Conservation"}', true, 'ACTIVE', 13, 1, 4.67);
INSERT INTO public.volunteers VALUES ('1bb1ff7d-dd9c-444c-b6a3-a8deeba8ada0', '297c27ed-4f2d-4676-ac81-b3a3689055d0', '1234567890', '+8801720052005', 'smt@gmail.com', 'Dhaka', '1000', 'Dhaka', NULL, NULL, true, 'ACTIVE', 15, 1, 5.00);


--
-- TOC entry 4923 (class 0 OID 0)
-- Dependencies: 219
-- Name: event_images_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_images_image_id_seq', 1, false);


--
-- TOC entry 4924 (class 0 OID 0)
-- Dependencies: 217
-- Name: events_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_event_id_seq', 3, true);


--
-- TOC entry 4925 (class 0 OID 0)
-- Dependencies: 228
-- Name: team_members_team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_members_team_members_id_seq', 22, true);


--
-- TOC entry 4926 (class 0 OID 0)
-- Dependencies: 224
-- Name: team_team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_team_id_seq', 5, true);


--
-- TOC entry 4927 (class 0 OID 0)
-- Dependencies: 226
-- Name: volunteer_rating_rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.volunteer_rating_rating_id_seq', 13, true);


--
-- TOC entry 4709 (class 2606 OID 17088)
-- Name: event_images event_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_images
    ADD CONSTRAINT event_images_pkey PRIMARY KEY (image_id);


--
-- TOC entry 4703 (class 2606 OID 17108)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (event_id);


--
-- TOC entry 4722 (class 2606 OID 16955)
-- Name: fund_applications fund_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_applications
    ADD CONSTRAINT fund_applications_pkey PRIMARY KEY (application_id);


--
-- TOC entry 4726 (class 2606 OID 16966)
-- Name: fund_verifications fund_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_verifications
    ADD CONSTRAINT fund_verifications_pkey PRIMARY KEY (verification_id);


--
-- TOC entry 4742 (class 2606 OID 17171)
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (team_members_id);


--
-- TOC entry 4732 (class 2606 OID 17136)
-- Name: team team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (team_id);


--
-- TOC entry 4738 (class 2606 OID 17192)
-- Name: volunteer_rating volunteer_rating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteer_rating
    ADD CONSTRAINT volunteer_rating_pkey PRIMARY KEY (rating_id);


--
-- TOC entry 4718 (class 2606 OID 16937)
-- Name: volunteers volunteers_external_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteers
    ADD CONSTRAINT volunteers_external_user_id_key UNIQUE (external_user_id);


--
-- TOC entry 4720 (class 2606 OID 16935)
-- Name: volunteers volunteers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteers
    ADD CONSTRAINT volunteers_pkey PRIMARY KEY (volunteer_id);


--
-- TOC entry 4704 (class 1259 OID 16905)
-- Name: idx_events_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_campaign_id ON public.events USING btree (external_campaign_id);


--
-- TOC entry 4705 (class 1259 OID 16908)
-- Name: idx_events_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_location ON public.events USING btree (location_city, location_district);


--
-- TOC entry 4706 (class 1259 OID 16906)
-- Name: idx_events_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_status ON public.events USING btree (status);


--
-- TOC entry 4707 (class 1259 OID 16907)
-- Name: idx_events_upcoming; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_upcoming ON public.events USING btree (status, start_date) WHERE ((status)::text = 'UPCOMING'::text);


--
-- TOC entry 4723 (class 1259 OID 16957)
-- Name: idx_fund_applications_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fund_applications_status ON public.fund_applications USING btree (status);


--
-- TOC entry 4724 (class 1259 OID 16956)
-- Name: idx_fund_applications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fund_applications_user_id ON public.fund_applications USING btree (external_user_id);


--
-- TOC entry 4727 (class 1259 OID 16977)
-- Name: idx_fund_verifications_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fund_verifications_application_id ON public.fund_verifications USING btree (application_id);


--
-- TOC entry 4728 (class 1259 OID 16978)
-- Name: idx_fund_verifications_volunteer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fund_verifications_volunteer_id ON public.fund_verifications USING btree (assigned_volunteer_id) WHERE (assigned_volunteer_id IS NOT NULL);


--
-- TOC entry 4733 (class 1259 OID 33959)
-- Name: idx_rating_overall; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rating_overall ON public.volunteer_rating USING btree (overall_rating);


--
-- TOC entry 4734 (class 1259 OID 17032)
-- Name: idx_rating_rated_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rating_rated_by ON public.volunteer_rating USING btree (rated_by_volunteer_id);


--
-- TOC entry 4735 (class 1259 OID 17205)
-- Name: idx_rating_team_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rating_team_id ON public.volunteer_rating USING btree (team_id);


--
-- TOC entry 4736 (class 1259 OID 17030)
-- Name: idx_rating_volunteer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rating_volunteer_id ON public.volunteer_rating USING btree (volunteer_id);


--
-- TOC entry 4729 (class 1259 OID 17155)
-- Name: idx_team_event_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_team_event_id ON public.team USING btree (event_id);


--
-- TOC entry 4730 (class 1259 OID 17001)
-- Name: idx_team_leader_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_team_leader_id ON public.team USING btree (leader_id);


--
-- TOC entry 4739 (class 1259 OID 17178)
-- Name: idx_team_members_team_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_team_members_team_id ON public.team_members USING btree (team_id);


--
-- TOC entry 4740 (class 1259 OID 17071)
-- Name: idx_team_members_volunteer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_team_members_volunteer_id ON public.team_members USING btree (volunteer_id);


--
-- TOC entry 4710 (class 1259 OID 16941)
-- Name: idx_volunteers_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_email ON public.volunteers USING btree (email);


--
-- TOC entry 4711 (class 1259 OID 16940)
-- Name: idx_volunteers_interests; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_interests ON public.volunteers USING gin (interests);


--
-- TOC entry 4712 (class 1259 OID 16944)
-- Name: idx_volunteers_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_location ON public.volunteers USING btree (address_city, address_district);


--
-- TOC entry 4713 (class 1259 OID 16943)
-- Name: idx_volunteers_national_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_national_id ON public.volunteers USING btree (national_id);


--
-- TOC entry 4714 (class 1259 OID 16942)
-- Name: idx_volunteers_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_phone ON public.volunteers USING btree (phone_number);


--
-- TOC entry 4715 (class 1259 OID 16939)
-- Name: idx_volunteers_skills; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_skills ON public.volunteers USING gin (skills);


--
-- TOC entry 4716 (class 1259 OID 16938)
-- Name: idx_volunteers_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_status ON public.volunteers USING btree (status);


--
-- TOC entry 4743 (class 2606 OID 17114)
-- Name: event_images event_images_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_images
    ADD CONSTRAINT event_images_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON DELETE CASCADE;


--
-- TOC entry 4753 (class 2606 OID 17231)
-- Name: fund_applications_documents fk4vtgq2ffbc6rbq2lpd1cy4trp; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_applications_documents
    ADD CONSTRAINT fk4vtgq2ffbc6rbq2lpd1cy4trp FOREIGN KEY (fund_applications_application_id) REFERENCES public.fund_applications(application_id);


--
-- TOC entry 4744 (class 2606 OID 16967)
-- Name: fund_verifications fund_verifications_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_verifications
    ADD CONSTRAINT fund_verifications_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.fund_applications(application_id) ON DELETE CASCADE;


--
-- TOC entry 4745 (class 2606 OID 16972)
-- Name: fund_verifications fund_verifications_assigned_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_verifications
    ADD CONSTRAINT fund_verifications_assigned_volunteer_id_fkey FOREIGN KEY (assigned_volunteer_id) REFERENCES public.volunteers(volunteer_id);


--
-- TOC entry 4746 (class 2606 OID 17156)
-- Name: team team_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON DELETE CASCADE;


--
-- TOC entry 4747 (class 2606 OID 16995)
-- Name: team team_leader_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_leader_id_fkey FOREIGN KEY (leader_id) REFERENCES public.volunteers(volunteer_id);


--
-- TOC entry 4751 (class 2606 OID 17179)
-- Name: team_members team_members_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id) ON DELETE CASCADE;


--
-- TOC entry 4752 (class 2606 OID 17065)
-- Name: team_members team_members_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(volunteer_id) ON DELETE CASCADE;


--
-- TOC entry 4748 (class 2606 OID 17025)
-- Name: volunteer_rating volunteer_rating_rated_by_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteer_rating
    ADD CONSTRAINT volunteer_rating_rated_by_volunteer_id_fkey FOREIGN KEY (rated_by_volunteer_id) REFERENCES public.volunteers(volunteer_id);


--
-- TOC entry 4749 (class 2606 OID 17206)
-- Name: volunteer_rating volunteer_rating_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteer_rating
    ADD CONSTRAINT volunteer_rating_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id) ON DELETE CASCADE;


--
-- TOC entry 4750 (class 2606 OID 17015)
-- Name: volunteer_rating volunteer_rating_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteer_rating
    ADD CONSTRAINT volunteer_rating_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(volunteer_id) ON DELETE CASCADE;


-- Completed on 2025-07-27 04:32:35

--
-- PostgreSQL database dump complete
--

