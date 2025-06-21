--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-21 17:25:40
\c "Event_Volunteer";



SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- TOC entry 4930 (class 0 OID 0)
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
    report text,
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
-- TOC entry 4931 (class 0 OID 0)
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
    address jsonb NOT NULL,
    documents jsonb[],
    bank_info jsonb NOT NULL,
    submission_date timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    status character varying(20) DEFAULT 'PENDING'::character varying NOT NULL,
    feedback text,
    disbursed_amount numeric(12,2),
    disbursement_date timestamp with time zone,
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
-- TOC entry 4932 (class 0 OID 0)
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
-- TOC entry 4933 (class 0 OID 0)
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
-- TOC entry 4934 (class 0 OID 0)
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
-- TOC entry 231 (class 1259 OID 17221)
-- Name: volunteers_interests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.volunteers_interests (
    volunteers_volunteer_id uuid NOT NULL,
    interests text
);


ALTER TABLE public.volunteers_interests OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 17226)
-- Name: volunteers_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.volunteers_skills (
    volunteers_volunteer_id uuid NOT NULL,
    skills text
);


ALTER TABLE public.volunteers_skills OWNER TO postgres;

--
-- TOC entry 4686 (class 2604 OID 17086)
-- Name: event_images image_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_images ALTER COLUMN image_id SET DEFAULT nextval('public.event_images_image_id_seq'::regclass);


--
-- TOC entry 4685 (class 2604 OID 17106)
-- Name: events event_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN event_id SET DEFAULT nextval('public.events_event_id_seq'::regclass);


--
-- TOC entry 4696 (class 2604 OID 17134)
-- Name: team team_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team ALTER COLUMN team_id SET DEFAULT nextval('public.team_team_id_seq'::regclass);


--
-- TOC entry 4701 (class 2604 OID 17169)
-- Name: team_members team_members_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members ALTER COLUMN team_members_id SET DEFAULT nextval('public.team_members_team_members_id_seq'::regclass);


--
-- TOC entry 4699 (class 2604 OID 17190)
-- Name: volunteer_rating rating_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteer_rating ALTER COLUMN rating_id SET DEFAULT nextval('public.volunteer_rating_rating_id_seq'::regclass);


--
-- TOC entry 4912 (class 0 OID 16910)
-- Dependencies: 220
-- Data for Name: event_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event_images (image_id, event_id, image_url, image_alt_text, display_order) FROM stdin;
\.


--
-- TOC entry 4910 (class 0 OID 16895)
-- Dependencies: 218
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.events (event_id, title, description, report, start_date, end_date, location_address, location_city, location_district, status, required_goods, budget_amount, external_campaign_id) FROM stdin;
\.


--
-- TOC entry 4914 (class 0 OID 16945)
-- Dependencies: 222
-- Data for Name: fund_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fund_applications (application_id, external_user_id, full_name, phone_number, national_id, amount, purpose, address, documents, bank_info, submission_date, status, feedback, disbursed_amount, disbursement_date) FROM stdin;
\.


--
-- TOC entry 4922 (class 0 OID 17129)
-- Dependencies: 230
-- Data for Name: fund_applications_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fund_applications_documents (fund_applications_application_id, documents) FROM stdin;
\.


--
-- TOC entry 4915 (class 0 OID 16958)
-- Dependencies: 223
-- Data for Name: fund_verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fund_verifications (verification_id, application_id, assigned_volunteer_id, assigned_date, verification_due_date, recommendation, recommended_amount, report) FROM stdin;
\.


--
-- TOC entry 4917 (class 0 OID 16980)
-- Dependencies: 225
-- Data for Name: team; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team (team_id, event_id, name, description, leader_id, created_at, updated_at) FROM stdin;
\.


--
-- TOC entry 4921 (class 0 OID 17054)
-- Dependencies: 229
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.team_members (team_members_id, team_id, volunteer_id) FROM stdin;
\.


--
-- TOC entry 4919 (class 0 OID 17003)
-- Dependencies: 227
-- Data for Name: volunteer_rating; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.volunteer_rating (rating_id, volunteer_id, team_id, rated_by_volunteer_id, performance_rating, punctuality_rating, communication_rating, feedback, strengths, areas_for_improvement, hours_worked) FROM stdin;
\.


--
-- TOC entry 4913 (class 0 OID 16924)
-- Dependencies: 221
-- Data for Name: volunteers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.volunteers (volunteer_id, external_user_id, national_id, phone_number, email, address_city, address_postal_code, address_district, skills, interests, availability, status, total_hours, assignments_completed, average_rating) FROM stdin;
\.


--
-- TOC entry 4923 (class 0 OID 17221)
-- Dependencies: 231
-- Data for Name: volunteers_interests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.volunteers_interests (volunteers_volunteer_id, interests) FROM stdin;
\.


--
-- TOC entry 4924 (class 0 OID 17226)
-- Dependencies: 232
-- Data for Name: volunteers_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.volunteers_skills (volunteers_volunteer_id, skills) FROM stdin;
\.


--
-- TOC entry 4935 (class 0 OID 0)
-- Dependencies: 219
-- Name: event_images_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_images_image_id_seq', 1, false);


--
-- TOC entry 4936 (class 0 OID 0)
-- Dependencies: 217
-- Name: events_event_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_event_id_seq', 1, false);


--
-- TOC entry 4937 (class 0 OID 0)
-- Dependencies: 228
-- Name: team_members_team_members_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_members_team_members_id_seq', 1, false);


--
-- TOC entry 4938 (class 0 OID 0)
-- Dependencies: 224
-- Name: team_team_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.team_team_id_seq', 1, false);


--
-- TOC entry 4939 (class 0 OID 0)
-- Dependencies: 226
-- Name: volunteer_rating_rating_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.volunteer_rating_rating_id_seq', 1, false);


--
-- TOC entry 4717 (class 2606 OID 17088)
-- Name: event_images event_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_images
    ADD CONSTRAINT event_images_pkey PRIMARY KEY (image_id);


--
-- TOC entry 4711 (class 2606 OID 17108)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (event_id);


--
-- TOC entry 4730 (class 2606 OID 16955)
-- Name: fund_applications fund_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_applications
    ADD CONSTRAINT fund_applications_pkey PRIMARY KEY (application_id);


--
-- TOC entry 4734 (class 2606 OID 16966)
-- Name: fund_verifications fund_verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_verifications
    ADD CONSTRAINT fund_verifications_pkey PRIMARY KEY (verification_id);


--
-- TOC entry 4750 (class 2606 OID 17171)
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (team_members_id);


--
-- TOC entry 4740 (class 2606 OID 17136)
-- Name: team team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_pkey PRIMARY KEY (team_id);


--
-- TOC entry 4746 (class 2606 OID 17192)
-- Name: volunteer_rating volunteer_rating_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteer_rating
    ADD CONSTRAINT volunteer_rating_pkey PRIMARY KEY (rating_id);


--
-- TOC entry 4726 (class 2606 OID 16937)
-- Name: volunteers volunteers_external_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteers
    ADD CONSTRAINT volunteers_external_user_id_key UNIQUE (external_user_id);


--
-- TOC entry 4728 (class 2606 OID 16935)
-- Name: volunteers volunteers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteers
    ADD CONSTRAINT volunteers_pkey PRIMARY KEY (volunteer_id);


--
-- TOC entry 4712 (class 1259 OID 16905)
-- Name: idx_events_campaign_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_campaign_id ON public.events USING btree (external_campaign_id);


--
-- TOC entry 4713 (class 1259 OID 16908)
-- Name: idx_events_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_location ON public.events USING btree (location_city, location_district);


--
-- TOC entry 4714 (class 1259 OID 16906)
-- Name: idx_events_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_status ON public.events USING btree (status);


--
-- TOC entry 4715 (class 1259 OID 16907)
-- Name: idx_events_upcoming; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_upcoming ON public.events USING btree (status, start_date) WHERE ((status)::text = 'UPCOMING'::text);


--
-- TOC entry 4731 (class 1259 OID 16957)
-- Name: idx_fund_applications_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fund_applications_status ON public.fund_applications USING btree (status);


--
-- TOC entry 4732 (class 1259 OID 16956)
-- Name: idx_fund_applications_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fund_applications_user_id ON public.fund_applications USING btree (external_user_id);


--
-- TOC entry 4735 (class 1259 OID 16977)
-- Name: idx_fund_verifications_application_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fund_verifications_application_id ON public.fund_verifications USING btree (application_id);


--
-- TOC entry 4736 (class 1259 OID 16978)
-- Name: idx_fund_verifications_volunteer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fund_verifications_volunteer_id ON public.fund_verifications USING btree (assigned_volunteer_id) WHERE (assigned_volunteer_id IS NOT NULL);


--
-- TOC entry 4741 (class 1259 OID 17355)
-- Name: idx_rating_overall; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rating_overall ON public.volunteer_rating USING btree (overall_rating);


--
-- TOC entry 4742 (class 1259 OID 17032)
-- Name: idx_rating_rated_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rating_rated_by ON public.volunteer_rating USING btree (rated_by_volunteer_id);


--
-- TOC entry 4743 (class 1259 OID 17205)
-- Name: idx_rating_team_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rating_team_id ON public.volunteer_rating USING btree (team_id);


--
-- TOC entry 4744 (class 1259 OID 17030)
-- Name: idx_rating_volunteer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_rating_volunteer_id ON public.volunteer_rating USING btree (volunteer_id);


--
-- TOC entry 4737 (class 1259 OID 17155)
-- Name: idx_team_event_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_team_event_id ON public.team USING btree (event_id);


--
-- TOC entry 4738 (class 1259 OID 17001)
-- Name: idx_team_leader_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_team_leader_id ON public.team USING btree (leader_id);


--
-- TOC entry 4747 (class 1259 OID 17178)
-- Name: idx_team_members_team_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_team_members_team_id ON public.team_members USING btree (team_id);


--
-- TOC entry 4748 (class 1259 OID 17071)
-- Name: idx_team_members_volunteer_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_team_members_volunteer_id ON public.team_members USING btree (volunteer_id);


--
-- TOC entry 4718 (class 1259 OID 16941)
-- Name: idx_volunteers_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_email ON public.volunteers USING btree (email);


--
-- TOC entry 4719 (class 1259 OID 16940)
-- Name: idx_volunteers_interests; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_interests ON public.volunteers USING gin (interests);


--
-- TOC entry 4720 (class 1259 OID 16944)
-- Name: idx_volunteers_location; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_location ON public.volunteers USING btree (address_city, address_district);


--
-- TOC entry 4721 (class 1259 OID 16943)
-- Name: idx_volunteers_national_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_national_id ON public.volunteers USING btree (national_id);


--
-- TOC entry 4722 (class 1259 OID 16942)
-- Name: idx_volunteers_phone; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_phone ON public.volunteers USING btree (phone_number);


--
-- TOC entry 4723 (class 1259 OID 16939)
-- Name: idx_volunteers_skills; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_skills ON public.volunteers USING gin (skills);


--
-- TOC entry 4724 (class 1259 OID 16938)
-- Name: idx_volunteers_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_volunteers_status ON public.volunteers USING btree (status);


--
-- TOC entry 4751 (class 2606 OID 17114)
-- Name: event_images event_images_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event_images
    ADD CONSTRAINT event_images_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON DELETE CASCADE;


--
-- TOC entry 4761 (class 2606 OID 17231)
-- Name: fund_applications_documents fk4vtgq2ffbc6rbq2lpd1cy4trp; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_applications_documents
    ADD CONSTRAINT fk4vtgq2ffbc6rbq2lpd1cy4trp FOREIGN KEY (fund_applications_application_id) REFERENCES public.fund_applications(application_id);


--
-- TOC entry 4762 (class 2606 OID 17236)
-- Name: volunteers_interests fka61rxwgq2rb5s0exi3cwqk162; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteers_interests
    ADD CONSTRAINT fka61rxwgq2rb5s0exi3cwqk162 FOREIGN KEY (volunteers_volunteer_id) REFERENCES public.volunteers(volunteer_id);


--
-- TOC entry 4763 (class 2606 OID 17241)
-- Name: volunteers_skills fkgygpms61enpjroukljofausu2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteers_skills
    ADD CONSTRAINT fkgygpms61enpjroukljofausu2 FOREIGN KEY (volunteers_volunteer_id) REFERENCES public.volunteers(volunteer_id);


--
-- TOC entry 4752 (class 2606 OID 16967)
-- Name: fund_verifications fund_verifications_application_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_verifications
    ADD CONSTRAINT fund_verifications_application_id_fkey FOREIGN KEY (application_id) REFERENCES public.fund_applications(application_id) ON DELETE CASCADE;


--
-- TOC entry 4753 (class 2606 OID 16972)
-- Name: fund_verifications fund_verifications_assigned_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fund_verifications
    ADD CONSTRAINT fund_verifications_assigned_volunteer_id_fkey FOREIGN KEY (assigned_volunteer_id) REFERENCES public.volunteers(volunteer_id);


--
-- TOC entry 4754 (class 2606 OID 17156)
-- Name: team team_event_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(event_id) ON DELETE CASCADE;


--
-- TOC entry 4755 (class 2606 OID 16995)
-- Name: team team_leader_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team
    ADD CONSTRAINT team_leader_id_fkey FOREIGN KEY (leader_id) REFERENCES public.volunteers(volunteer_id);


--
-- TOC entry 4759 (class 2606 OID 17179)
-- Name: team_members team_members_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id) ON DELETE CASCADE;


--
-- TOC entry 4760 (class 2606 OID 17065)
-- Name: team_members team_members_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(volunteer_id) ON DELETE CASCADE;


--
-- TOC entry 4756 (class 2606 OID 17025)
-- Name: volunteer_rating volunteer_rating_rated_by_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteer_rating
    ADD CONSTRAINT volunteer_rating_rated_by_volunteer_id_fkey FOREIGN KEY (rated_by_volunteer_id) REFERENCES public.volunteers(volunteer_id);


--
-- TOC entry 4757 (class 2606 OID 17206)
-- Name: volunteer_rating volunteer_rating_team_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteer_rating
    ADD CONSTRAINT volunteer_rating_team_id_fkey FOREIGN KEY (team_id) REFERENCES public.team(team_id) ON DELETE CASCADE;


--
-- TOC entry 4758 (class 2606 OID 17015)
-- Name: volunteer_rating volunteer_rating_volunteer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.volunteer_rating
    ADD CONSTRAINT volunteer_rating_volunteer_id_fkey FOREIGN KEY (volunteer_id) REFERENCES public.volunteers(volunteer_id) ON DELETE CASCADE;


-- Completed on 2025-06-21 17:25:41

--
-- PostgreSQL database dump complete
--

