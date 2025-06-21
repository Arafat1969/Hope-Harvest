--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

-- Started on 2025-06-21 17:26:26
\c "User_Authentication";

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
-- TOC entry 218 (class 1259 OID 16752)
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.refresh_tokens (
    token_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token_value character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    is_revoked boolean DEFAULT false NOT NULL
);


ALTER TABLE public.refresh_tokens OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 16739)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id uuid DEFAULT gen_random_uuid() NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    email_verified boolean DEFAULT false NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    phone_number character varying(20),
    address_city character varying(100),
    address_postal_code character varying(20),
    address_country character varying(100),
    role character varying(20) DEFAULT 'USER'::character varying NOT NULL,
    CONSTRAINT users_role_check CHECK (((role)::text = ANY (ARRAY[('USER'::character varying)::text, ('ADMIN'::character varying)::text, ('VOLUNTEER'::character varying)::text, ('TEAM_LEADER'::character varying)::text])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4807 (class 0 OID 16752)
-- Dependencies: 218
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.refresh_tokens (token_id, user_id, token_value, expires_at, is_revoked) FROM stdin;
13274455-bfeb-4504-8c5e-becb67d05ddb	7a0f10c3-d811-4166-9e5a-30e1882602d5	b30d6bbe-1ac7-495a-848b-bb3dfd31f597	2025-06-01 19:38:32.832475+06	f
bdeef386-d6ec-4f15-a80e-31eab0ad9371	3d7d217e-3613-4e4a-b2a0-d873237e565e	2c7b92bf-140c-48a6-8ae4-aeb79ccf2728	2025-06-01 20:20:38.406054+06	f
6e5210d0-b1a2-47df-9be6-4c9dd7abf71a	3d7d217e-3613-4e4a-b2a0-d873237e565e	263a403a-85ed-4dbc-b8f5-cee9ba3dadac	2025-06-01 20:21:21.714419+06	f
778fa487-1e90-431f-b42c-3f2df5100d03	3d7d217e-3613-4e4a-b2a0-d873237e565e	0bdc31e7-10f8-46fc-9211-410c8a985fa3	2025-06-01 20:23:33.616838+06	f
813690e9-2b16-43ba-a989-358567a56042	85488fb6-6304-422f-bd1d-b0ee3a004720	0b1551ed-6fe8-4f48-b79c-7aa539022648	2025-06-01 23:02:06.511679+06	f
0085b63a-1596-4606-a05c-caefd81902de	85488fb6-6304-422f-bd1d-b0ee3a004720	b5784f3b-cb12-4860-80ea-e118681fd57b	2025-06-01 23:02:38.86281+06	f
eb65f6cd-8aea-4f52-b665-ef65f618e979	29592956-af05-4032-849b-88eae01316f7	8d0014bd-89dd-4f81-b683-94fdc2293e22	2025-06-02 09:16:34.670031+06	f
cbf41bfd-1314-45fe-a61d-84ffb428eb40	29592956-af05-4032-849b-88eae01316f7	6cbfa78b-9a1a-436a-9ba5-cfefbdaec943	2025-06-02 09:19:38.849506+06	f
4f37a217-2925-48ad-9f53-648b691ff180	dde32737-8b22-4b64-a0fe-efcce73b1cf0	c04ccf25-654a-45be-be17-87e076560ac1	2025-06-02 09:57:21.59699+06	f
93d1308a-0f29-4388-b7e5-ace923d1712d	dde32737-8b22-4b64-a0fe-efcce73b1cf0	9522748d-1e48-4a9c-b9f3-d24598df381a	2025-06-02 09:57:50.428681+06	f
80241b14-309c-477e-836a-d0d5a3450ed9	dde32737-8b22-4b64-a0fe-efcce73b1cf0	a9b2f898-fca3-4dcd-a432-d0126e9de138	2025-06-02 13:18:48.906416+06	f
54706512-19f9-434d-9d51-225e8c12b7ac	dde32737-8b22-4b64-a0fe-efcce73b1cf0	358cebbc-8165-49b5-9010-e4892e1eae75	2025-06-02 13:34:23.560892+06	f
20df2ff6-a9ce-44bd-b0ef-eca5185a2a00	ffd0b7d7-8625-49b9-9b27-3a36b43f2417	75c65fc4-2a8c-4391-81c0-514f3a1f3902	2025-06-02 13:50:39.305357+06	f
3b65705f-0e34-40a4-bee3-f4dcc6c3b55b	ffd0b7d7-8625-49b9-9b27-3a36b43f2417	5e0806dd-d2a2-4510-81bf-995cb1ada42c	2025-06-02 13:52:18.254722+06	f
1112e7bd-7946-4236-b8c5-7def4362485a	dde32737-8b22-4b64-a0fe-efcce73b1cf0	3e2f6f36-efbd-49eb-9241-f5bb46a744cc	2025-06-02 14:04:19.029561+06	f
55b57972-bb26-4cd3-bd54-b1f9f25fde42	dde32737-8b22-4b64-a0fe-efcce73b1cf0	e9793179-f43e-48fa-bcdc-955e1023c58f	2025-06-02 14:07:53.799002+06	f
31843670-b589-45fd-ab04-5cf722022531	dde32737-8b22-4b64-a0fe-efcce73b1cf0	226aa91e-8b5f-4bb4-bcd2-8cddcd754ea9	2025-06-02 14:18:35.210794+06	f
e4860563-91b0-4c18-9d64-c3b9fe5a84b9	dde32737-8b22-4b64-a0fe-efcce73b1cf0	53a1ab92-2799-4bad-aa37-619f0636b9aa	2025-06-02 14:21:36.906949+06	f
b6dfb9f1-39ed-4d21-8d0d-06b166c77163	dde32737-8b22-4b64-a0fe-efcce73b1cf0	2dcec8c6-452b-47da-b6d1-1767a5f12ec8	2025-06-02 14:22:52.746458+06	f
b6dc23bf-800b-45fe-aab8-9f0c04c8fbdf	dde32737-8b22-4b64-a0fe-efcce73b1cf0	4843f34c-13d8-4cdf-a00b-13c1252f8214	2025-06-02 14:31:20.376803+06	f
f95006ed-5f79-4e9f-a484-9844e7b81346	7098f785-d7d9-4cb2-adb7-3d711df66a75	17a9a9e6-f84f-4e46-b9cf-ca643e6751b8	2025-06-02 14:44:58.134747+06	f
3c0efc8d-2df9-4836-b4d5-f8f558c9ae07	7098f785-d7d9-4cb2-adb7-3d711df66a75	94694fe0-2f78-43ca-aaf3-f272a59ddede	2025-06-02 14:45:19.15174+06	f
9a3ca77f-7d42-4b7b-9aa3-43970208887e	dde32737-8b22-4b64-a0fe-efcce73b1cf0	31c0d83a-a86c-416b-9d32-4462b1a07138	2025-06-02 14:49:33.865854+06	f
8f25f9f8-9040-422f-971a-9f2b9d882cb6	dde32737-8b22-4b64-a0fe-efcce73b1cf0	8d4fa78c-14ed-43f0-bd4f-39bec9e71538	2025-06-02 14:59:44.26201+06	f
1638e7e9-932d-4fa3-88ff-0c1b9cf02fca	dde32737-8b22-4b64-a0fe-efcce73b1cf0	7d511df3-f383-4404-92ef-f74395d3d95a	2025-06-26 02:53:01.340841+06	f
d945cb6a-a575-4605-80ff-4020491e72be	297c27ed-4f2d-4676-ac81-b3a3689055d0	790f23f1-faab-4f9c-979d-5507ce3df268	2025-06-27 01:32:41.590859+06	f
\.


--
-- TOC entry 4806 (class 0 OID 16739)
-- Dependencies: 217
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, password_hash, email_verified, first_name, last_name, phone_number, address_city, address_postal_code, address_country, role) FROM stdin;
4f9fafae-9c20-40ac-831c-f5892b225049	admin@hopeharvest.org	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	t	Aisha	Rahman	+8801712345678	Dhaka	1212	Bangladesh	ADMIN
e878cc75-1cb4-4e07-a3f1-e6b579a3e43f	tahmid.chowdhury@hopeharvest.org	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	t	Tahmid	Chowdhury	+8801312345678	Dhaka	1209	Bangladesh	ADMIN
bc18fb72-b419-44c6-9afa-561277c74bc1	karim.ahmed@gmail.com	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	t	Karim	Ahmed	+8801812345678	Chittagong	4000	Bangladesh	USER
1de9b4ec-b52f-4a2d-97aa-266a47f3a4c0	nasreen.khan@example.com	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	t	Nasreen	Khan	+8801512345678	Rajshahi	6000	Bangladesh	USER
9e0d35f0-022e-454f-943b-b2d4ac989ac9	zakir.hussain@example.com	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	f	Zakir	Hussain	+8801612345679	Khulna	9100	Bangladesh	USER
0b374be6-3af9-41a6-9b35-06742e4ac0ba	abdul.karim@example.com	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	t	Abdul	Karim	+8801212345678	Barishal	8200	Bangladesh	USER
e18029c2-5397-41fb-bb79-14f2ca5fbb49	salma.begum@example.com	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	t	Salma	Begum	+8801712345680	Sylhet	3100	Bangladesh	USER
fcc48563-5aea-4a85-9eec-b4d98895eb40	rafiq.islam@example.com	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	f	Rafiq	Islam	+8801812345681	Dhaka	1215	Bangladesh	USER
a9060658-30b4-440a-adbc-0f62c01623c1	nusrat.jahan@example.com	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	t	Nusrat	Jahan	+8801912345682	Comilla	3500	Bangladesh	USER
cdc94857-34bc-4195-ae0f-d684f2669e80	monir.hossain@example.com	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	f	Monir	Hossain	+8801712345683	Rangpur	5400	Bangladesh	USER
d5a965ae-d05c-48fe-a557-3533e3ae5df7	farida.akter@example.com	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	t	Farida	Akter	+8801612345684	Mymensingh	2200	Bangladesh	USER
1e1f3574-4f7a-4b4d-9091-1fa09ac350c8	masud.rana@example.com	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	t	Masud	Rana	+8801812345685	Dhaka	1216	Bangladesh	USER
86163299-9e54-48af-bbfa-37ce7141008f	admin2@hopeharvest.org	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	t	Hasin	Arafat	+8801719691969	Dhaka	1212	Bangladesh	ADMIN
38b2baba-2ff9-45d1-bde7-729a4a6ce750	admin33@hopeharvest.org	$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG	t	Shifat	Rahman	+8801712399678	Dhaka	1212	Bangladesh	ADMIN
67f69ae5-9294-4206-a355-62524466106a	drfawziazaman@gmail.com	12345678	f	Fawzia	Zaman	+8801712335677	Dhaka	1000	Bangladesh	USER
2f2ae508-f5a4-4c35-a596-cbcde473248b	drfawziazaman1@gmail.com	$2a$10$g.q8ZN77teSBQzIVRVkXHurxgOM7vg/LZeZzPOxp11WGx1HtnqUza	f	Fawzia	Haque	+8801712445677	Dhaka	1000	Bangladesh	USER
8a9497fa-a961-48c8-bc64-4fff780e93fb	dshifatahmed1@gmail.com	$2a$10$EouzQMm5m4efGVJHIR90kOr6Ss8rC0L163G4VH.zGCmdXCGinv3WO	f	Shifat	Ahmed	+8801720051020	Dhaka	1000	Bangladesh	USER
83b9fc53-024f-4243-b686-ef264b988cc0	dshifatahmed12@gmail.com	$2a$10$8ZdF5vlug1XTWwKdBDKikeRmvMMb75iv3iJ9Nc498difWxD3Ydway	f	Shifat1	Ahmed1	+8801720651020	Dhaka	1000	Bangladesh	USER
e45af25e-a513-4ba5-a6c8-3553bf8dfc35	dshifatahmed123@gmail.com	$2a$10$R7ZVKPNGLn2RLPwdWptRYevF.Co1Gbo3DcEFY4M77CLqUPx5lDnG.	f	Shifat12	Ahmed12	+8801721651020	Dhaka	1000	Bangladesh	USER
c6d9c6de-6d64-4e18-b3fe-46a39716bfbf	dshifatahmed1234@gmail.com	$2a$10$FULBPhIg8Qn.pR4hjnEeUOfStJoNLX9UPRelaY6//MxTdIKXG8QNW	f	Shifat123	Ahmed123	+8801721651021	Dhaka	1000	Bangladesh	USER
b17ea068-bd9d-4912-8041-20c48707eb6f	dshifatahmed12534@gmail.com	$2a$10$M5WAHnaqz4IMTEbIkpxe7e4Y2oPqySiyU.QaktxLy0qJtcXN3Nbl2	f	Shifat123	Ahmed123	+8801721651021	Dhaka	1000	Bangladesh	USER
318233af-73d4-496b-b227-2ec7ccd9c8b7	arafat2534@gmail.com	$2a$10$yFQpNWI18j22/g2eygh9ou/7oqPPq35TTYst0ItCg9VrZS9RLFch6	f	Hasi	Arafat	+8801721621022	Dhaka	1000	Bangladesh	USER
7a0f10c3-d811-4166-9e5a-30e1882602d5	istiakahmed@gmai.com	$2a$10$DqOoNhpvaIlXN8akQu47I..fM51M7vTkXrAEFChSt1QkD0jEZMUF2	f	Istiak	Ahmed					USER
3d7d217e-3613-4e4a-b2a0-d873237e565e	ab@gmail.com	$2a$10$hAYZYX4Q6ngdLlSKr17U6eHvInLHPZujcvfYWPqw2hwtzWWruCj8m	f	ab	cd	+8801761737116				USER
85488fb6-6304-422f-bd1d-b0ee3a004720	xy@gmail.com	$2a$10$8lmmGa2FSSaSNXpjWGt8zO3JpkyV/znweYJkIPGVRvtYKZePaOtTi	f	xy	zz					USER
29592956-af05-4032-849b-88eae01316f7	2005092@gmail.com	$2a$10$S3jKjU3pziJLzw3ZhJ5rku/dVMHS4Y/brcyWuyQYB/pZMw0xUajHO	f	Shahad	Shahriar	01799825973				USER
dde32737-8b22-4b64-a0fe-efcce73b1cf0	mm@gmail.com	$2a$10$ac.ynVXSv6sOyIaDrZxx8u0ROdvwSKHsfIAg8d9Omu4a/.brHYuSO	f	maisha	maksura					USER
ffd0b7d7-8625-49b9-9b27-3a36b43f2417	ece@gmail.com	$2a$10$8OiwZGJZjx9zApXiUMfBRuObq9KndXAeRMd2bKUvkFVIBdEJITGX6	f	ece	eee	+8801720052005	Dhaka	1000	India	USER
7098f785-d7d9-4cb2-adb7-3d711df66a75	gh@gmail.com	$2a$10$YHDUvwcLWOLbvO2VXFday.qalSDR1q5f98TptCeqODRXnrK/P9ac6	f	gh	ij	+8801761837226	Dhaka	1200	BD	USER
297c27ed-4f2d-4676-ac81-b3a3689055d0	smt@gmail.com	$2a$10$nEMlEvW4dMi2kHcvph/omeITkA864En.kI/LzgpdMGyRX70xlVaf6	f	Souvik	Mondol	+8801575403188	Dhaka	1000	Bangladesh	USER
\.


--
-- TOC entry 4655 (class 2606 OID 16758)
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (token_id);


--
-- TOC entry 4658 (class 2606 OID 16760)
-- Name: refresh_tokens refresh_tokens_token_value_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_value_key UNIQUE (token_value);


--
-- TOC entry 4651 (class 2606 OID 16751)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4653 (class 2606 OID 16749)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 4656 (class 1259 OID 16767)
-- Name: refresh_tokens_token_value_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX refresh_tokens_token_value_idx ON public.refresh_tokens USING btree (token_value);


--
-- TOC entry 4659 (class 1259 OID 16766)
-- Name: refresh_tokens_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX refresh_tokens_user_id_idx ON public.refresh_tokens USING btree (user_id);


--
-- TOC entry 4660 (class 2606 OID 16761)
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;


-- Completed on 2025-06-21 17:26:26

--
-- PostgreSQL database dump complete
--

