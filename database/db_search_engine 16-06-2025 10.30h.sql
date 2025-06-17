--
-- PostgreSQL database dump
--

-- Dumped from database version 16.8
-- Dumped by pg_dump version 16.8

-- Started on 2025-04-21 10:34:32

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

--
-- TOC entry 222 (class 1255 OID 18361)
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 18331)
-- Name: tb_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_image (
    id integer NOT NULL,
    url text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tb_image OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 18330)
-- Name: tb_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tb_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tb_image_id_seq OWNER TO postgres;

--
-- TOC entry 4943 (class 0 OID 0)
-- Dependencies: 219
-- Name: tb_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tb_image_id_seq OWNED BY public.tb_image.id;


--
-- TOC entry 218 (class 1259 OID 18312)
-- Name: tb_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_product (
    id integer NOT NULL,
    name text NOT NULL,
    url_identifier text NOT NULL,
    summary text,
    price text NOT NULL,
    type_coin character varying(15) NOT NULL,
    date_consulted timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    store character varying(63) NOT NULL,
    tags character varying(1027),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tb_product OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 18311)
-- Name: tb_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tb_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tb_product_id_seq OWNER TO postgres;

--
-- TOC entry 4944 (class 0 OID 0)
-- Dependencies: 217
-- Name: tb_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tb_product_id_seq OWNED BY public.tb_product.id;


--
-- TOC entry 221 (class 1259 OID 18343)
-- Name: tb_product_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_product_image (
    product_id integer NOT NULL,
    image_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tb_product_image OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 18291)
-- Name: tb_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tb_user (
    id integer NOT NULL,
    username character varying(63),
    email character varying(63) NOT NULL,
    password character varying(1027),
    auth_provider character varying(20),
    provider_id character varying(255),
    access_token text,
    refresh_token text,
    token_expiry timestamp without time zone,
    avatar_url text,
    first_name character varying(100),
    last_name character varying(100),
    is_email_verified boolean DEFAULT false NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT auth_provider_check CHECK (((auth_provider)::text = ANY ((ARRAY['google'::character varying, 'facebook'::character varying, 'github'::character varying, 'local'::character varying, NULL::character varying])::text[])))
);


ALTER TABLE public.tb_user OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 18290)
-- Name: tb_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tb_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tb_user_id_seq OWNER TO postgres;

--
-- TOC entry 4945 (class 0 OID 0)
-- Dependencies: 215
-- Name: tb_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tb_user_id_seq OWNED BY public.tb_user.id;


--
-- TOC entry 4760 (class 2604 OID 18334)
-- Name: tb_image id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_image ALTER COLUMN id SET DEFAULT nextval('public.tb_image_id_seq'::regclass);


--
-- TOC entry 4755 (class 2604 OID 18315)
-- Name: tb_product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_product ALTER COLUMN id SET DEFAULT nextval('public.tb_product_id_seq'::regclass);


--
-- TOC entry 4750 (class 2604 OID 18294)
-- Name: tb_user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_user ALTER COLUMN id SET DEFAULT nextval('public.tb_user_id_seq'::regclass);


--
-- TOC entry 4766 (class 2606 OID 18307)
-- Name: tb_user email_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_user
    ADD CONSTRAINT email_unique UNIQUE (email);


--
-- TOC entry 4783 (class 2606 OID 18340)
-- Name: tb_image tb_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_image
    ADD CONSTRAINT tb_image_pkey PRIMARY KEY (id);


--
-- TOC entry 4789 (class 2606 OID 18348)
-- Name: tb_product_image tb_product_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_product_image
    ADD CONSTRAINT tb_product_image_pkey PRIMARY KEY (product_id, image_id);


--
-- TOC entry 4779 (class 2606 OID 18323)
-- Name: tb_product tb_product_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_product
    ADD CONSTRAINT tb_product_pkey PRIMARY KEY (id);


--
-- TOC entry 4771 (class 2606 OID 18303)
-- Name: tb_user tb_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_user
    ADD CONSTRAINT tb_user_pkey PRIMARY KEY (id);


--
-- TOC entry 4781 (class 2606 OID 18325)
-- Name: tb_product url_identifier_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_product
    ADD CONSTRAINT url_identifier_unique UNIQUE (url_identifier);


--
-- TOC entry 4785 (class 2606 OID 18342)
-- Name: tb_image url_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_image
    ADD CONSTRAINT url_unique UNIQUE (url);


--
-- TOC entry 4773 (class 2606 OID 18305)
-- Name: tb_user username_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_user
    ADD CONSTRAINT username_unique UNIQUE (username);


--
-- TOC entry 4786 (class 1259 OID 18360)
-- Name: idx_product_image_image; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_image_image ON public.tb_product_image USING btree (image_id);


--
-- TOC entry 4787 (class 1259 OID 18359)
-- Name: idx_product_image_product; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_image_product ON public.tb_product_image USING btree (product_id);


--
-- TOC entry 4774 (class 1259 OID 18329)
-- Name: idx_product_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_is_active ON public.tb_product USING btree (is_active);


--
-- TOC entry 4775 (class 1259 OID 18367)
-- Name: idx_product_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_name ON public.tb_product USING btree (name);


--
-- TOC entry 4776 (class 1259 OID 18368)
-- Name: idx_product_price; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_price ON public.tb_product USING btree (price);


--
-- TOC entry 4777 (class 1259 OID 18328)
-- Name: idx_product_store; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_store ON public.tb_product USING btree (store);


--
-- TOC entry 4767 (class 1259 OID 18309)
-- Name: idx_user_auth_provider; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_auth_provider ON public.tb_user USING btree (auth_provider);


--
-- TOC entry 4768 (class 1259 OID 18308)
-- Name: idx_user_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_email ON public.tb_user USING btree (email);


--
-- TOC entry 4769 (class 1259 OID 18310)
-- Name: idx_user_is_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_user_is_active ON public.tb_user USING btree (is_active);


--
-- TOC entry 4794 (class 2620 OID 18364)
-- Name: tb_image update_image_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_image_updated_at BEFORE UPDATE ON public.tb_image FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4793 (class 2620 OID 18363)
-- Name: tb_product update_product_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_product_updated_at BEFORE UPDATE ON public.tb_product FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4792 (class 2620 OID 18362)
-- Name: tb_user update_user_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON public.tb_user FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- TOC entry 4790 (class 2606 OID 18354)
-- Name: tb_product_image fk_image; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_product_image
    ADD CONSTRAINT fk_image FOREIGN KEY (image_id) REFERENCES public.tb_image(id) ON DELETE CASCADE;


--
-- TOC entry 4791 (class 2606 OID 18349)
-- Name: tb_product_image fk_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tb_product_image
    ADD CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES public.tb_product(id) ON DELETE CASCADE;


-- Completed on 2025-04-21 10:34:32

--
-- PostgreSQL database dump complete
--

