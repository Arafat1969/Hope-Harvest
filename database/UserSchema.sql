-- User Authentication Database Schema and Data
-- This file contains only the table structures and data, not database creation

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

-- Table: refresh_tokens
CREATE TABLE public.refresh_tokens (
    token_id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    token_value character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    is_revoked boolean DEFAULT false NOT NULL
);

-- Table: users  
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
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['USER'::character varying, 'ADMIN'::character varying, 'VOLUNTEER'::character varying, 'TEAM_LEADER'::character varying])::text[])))
);

-- Primary keys and constraints
ALTER TABLE ONLY public.refresh_tokens ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (token_id);
ALTER TABLE ONLY public.refresh_tokens ADD CONSTRAINT refresh_tokens_token_value_key UNIQUE (token_value);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_email_key UNIQUE (email);
ALTER TABLE ONLY public.users ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);

-- Foreign keys
ALTER TABLE ONLY public.refresh_tokens ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX refresh_tokens_token_value_idx ON public.refresh_tokens USING btree (token_value);
CREATE INDEX refresh_tokens_user_id_idx ON public.refresh_tokens USING btree (user_id);

-- Insert user data
INSERT INTO public.users (user_id, email, password_hash, email_verified, first_name, last_name, phone_number, address_city, address_postal_code, address_country, role) VALUES 
('4f9fafae-9c20-40ac-831c-f5892b225049', 'admin@hopeharvest.org', '$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG', true, 'Aisha', 'Rahman', '+8801712345678', 'Dhaka', '1212', 'Bangladesh', 'ADMIN'),
('e878cc75-1cb4-4e07-a3f1-e6b579a3e43f', 'tahmid.chowdhury@hopeharvest.org', '$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG', true, 'Tahmid', 'Chowdhury', '+8801312345678', 'Dhaka', '1209', 'Bangladesh', 'ADMIN'),
('bc18fb72-b419-44c6-9afa-561277c74bc1', 'karim.ahmed@gmail.com', '$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG', true, 'Karim', 'Ahmed', '+8801812345678', 'Chittagong', '4000', 'Bangladesh', 'USER'),
('1de9b4ec-b52f-4a2d-97aa-266a47f3a4c0', 'nasreen.khan@example.com', '$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG', true, 'Nasreen', 'Khan', '+8801512345678', 'Rajshahi', '6000', 'Bangladesh', 'USER'),
('9e0d35f0-022e-454f-943b-b2d4ac989ac9', 'zakir.hussain@example.com', '$2a$12$ybSaJuX2.iW6YkPR7WHyT.jTRwRmaB4M/m1ZfCfY5TzLPJvpY2aJG', false, 'Zakir', 'Hussain', '+8801612345679', 'Khulna', '9100', 'Bangladesh', 'USER');
