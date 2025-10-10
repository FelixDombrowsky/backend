-- CREATE TABLE tank_setting (
--     code VARCHAR(10) NOT NULL,
--     tank_name VARCHAR(100) NOT NULL,
--     probe_id INT NOT NULL,
--     fuel_code VARCHAR(10) NOT NULL,
--     capacity_l DECIMAL(12,2),
--     tank_type INT,
--     vertical_mm DECIMAL(12,2),
--     horizontal_mm DECIMAL(12,2),
--     length_mm DECIMAL(12,2),
--     cal_capacity_l DECIMAL(12,2),
--     comp_oil_mm DECIMAL(12,2),
--     comp_water_mm DECIMAL(12,2),
--     high_alarm_l DECIMAL(12,2),
--     high_alert_l DECIMAL(12,2),
--     low_alarm_l DECIMAL(12,2),
--     water_high_alarm_l DECIMAL(12,2),
--     PRIMARY KEY (code),
--     FOREIGN KEY (probe_id) REFERENCES probe_setting(probe_id),
--     FOREIGN KEY (fuel_code) REFERENCES fuel_names(fuel_code)
-- );



--
-- PostgreSQL database dump
--

\restrict YcaaEJh9UfpVQRdjHFAJedP4GzUhf4wZtfcPOsG3NJdtqFj2OaUuSYHk7oyhCsH

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-10 15:39:39

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
-- TOC entry 2 (class 3079 OID 17164)
-- Name: timescaledb; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS timescaledb WITH SCHEMA public;


--
-- TOC entry 4147 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION timescaledb; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION timescaledb IS 'Enables scalable inserts and complex queries for time-series data (Community Edition)';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 287 (class 1259 OID 27032)
-- Name: fuel_level; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fuel_level (
    id integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    tank_id integer NOT NULL,
    oil_h numeric(10,4),
    oil_v numeric(10,4),
    oil_p numeric(10,4),
    water_h numeric(10,4),
    water_v numeric(10,4),
    water_p numeric(10,4),
    ullage numeric(10,4),
    temp numeric(8,4),
    status text,
    probe_id integer
);


ALTER TABLE public.fuel_level OWNER TO postgres;

--
-- TOC entry 294 (class 1259 OID 27088)
-- Name: _hyper_2_1_chunk; Type: TABLE; Schema: _timescaledb_internal; Owner: postgres
--

CREATE TABLE _timescaledb_internal._hyper_2_1_chunk (
    CONSTRAINT constraint_1 CHECK ((("timestamp" >= '2025-09-04 00:00:00+00'::timestamp with time zone) AND ("timestamp" < '2025-09-11 00:00:00+00'::timestamp with time zone)))
)
INHERITS (public.fuel_level);


ALTER TABLE _timescaledb_internal._hyper_2_1_chunk OWNER TO postgres;

--
-- TOC entry 293 (class 1259 OID 27070)
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    pass character varying(255) NOT NULL
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 27069)
-- Name: admin_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_id_seq OWNER TO postgres;

--
-- TOC entry 4148 (class 0 OID 0)
-- Dependencies: 292
-- Name: admin_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_id_seq OWNED BY public.admin.id;


--
-- TOC entry 283 (class 1259 OID 27002)
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    id integer NOT NULL,
    branch_code character varying(255) NOT NULL,
    branch_name character varying(255) NOT NULL
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 27001)
-- Name: branches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branches_id_seq OWNER TO postgres;

--
-- TOC entry 4149 (class 0 OID 0)
-- Dependencies: 282
-- Name: branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branches_id_seq OWNED BY public.branches.id;


--
-- TOC entry 286 (class 1259 OID 27031)
-- Name: fuel_level_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fuel_level_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fuel_level_id_seq OWNER TO postgres;

--
-- TOC entry 4150 (class 0 OID 0)
-- Dependencies: 286
-- Name: fuel_level_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fuel_level_id_seq OWNED BY public.fuel_level.id;


--
-- TOC entry 289 (class 1259 OID 27046)
-- Name: fuel_loading; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fuel_loading (
    id integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    tank_id integer NOT NULL,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    start_h numeric(10,4),
    end_h numeric(10,4),
    start_v numeric(10,4),
    end_v numeric(10,4),
    load_v numeric(10,4)
);


ALTER TABLE public.fuel_loading OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 27045)
-- Name: fuel_loading_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.fuel_loading_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.fuel_loading_id_seq OWNER TO postgres;

--
-- TOC entry 4151 (class 0 OID 0)
-- Dependencies: 288
-- Name: fuel_loading_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.fuel_loading_id_seq OWNED BY public.fuel_loading.id;


--
-- TOC entry 299 (class 1259 OID 51775)
-- Name: fuel_names; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fuel_names (
    fuel_code character varying(5) NOT NULL,
    fuel_name character varying(50) NOT NULL,
    fuel_type character varying(5) NOT NULL,
    description text,
    fuel_color character varying(50)
);


ALTER TABLE public.fuel_names OWNER TO postgres;

--
-- TOC entry 298 (class 1259 OID 51763)
-- Name: fuel_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fuel_types (
    fuel_type_code character varying(5) NOT NULL,
    fuel_type character varying(50) NOT NULL,
    density numeric(10,2)
);


ALTER TABLE public.fuel_types OWNER TO postgres;

--
-- TOC entry 291 (class 1259 OID 27058)
-- Name: leak_test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leak_test (
    id integer NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    tank_id integer NOT NULL,
    start_time timestamp with time zone,
    end_time timestamp with time zone,
    start_h numeric(10,4),
    end_h numeric(10,4),
    start_v numeric(10,4),
    end_v numeric(10,4),
    flow_rate numeric(10,4)
);


ALTER TABLE public.leak_test OWNER TO postgres;

--
-- TOC entry 290 (class 1259 OID 27057)
-- Name: leak_test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leak_test_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leak_test_id_seq OWNER TO postgres;

--
-- TOC entry 4152 (class 0 OID 0)
-- Dependencies: 290
-- Name: leak_test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leak_test_id_seq OWNED BY public.leak_test.id;


--
-- TOC entry 297 (class 1259 OID 27135)
-- Name: probe_setting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.probe_setting (
    probe_id integer NOT NULL,
    probe_type_id integer,
    oil_h_address integer,
    oil_h_scale double precision,
    water_h_address integer,
    water_h_scale double precision,
    temp_address integer,
    temp_scale double precision,
    format character varying(20) DEFAULT 'CD AB'::character varying,
    function_code character varying(10) DEFAULT '03'::character varying,
    address_length integer DEFAULT 2
);


ALTER TABLE public.probe_setting OWNER TO postgres;

--
-- TOC entry 296 (class 1259 OID 27129)
-- Name: probe_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.probe_types (
    probe_type_id integer NOT NULL,
    probe_type_name character varying(50) NOT NULL
);


ALTER TABLE public.probe_types OWNER TO postgres;

--
-- TOC entry 295 (class 1259 OID 27128)
-- Name: probe_types_probe_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.probe_types_probe_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.probe_types_probe_type_id_seq OWNER TO postgres;

--
-- TOC entry 4153 (class 0 OID 0)
-- Dependencies: 295
-- Name: probe_types_probe_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.probe_types_probe_type_id_seq OWNED BY public.probe_types.probe_type_id;


--
-- TOC entry 281 (class 1259 OID 26995)
-- Name: probes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.probes (
    probe_id integer NOT NULL,
    probe_type character varying(255) NOT NULL
);


ALTER TABLE public.probes OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 26994)
-- Name: probes_probe_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.probes_probe_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.probes_probe_id_seq OWNER TO postgres;

--
-- TOC entry 4154 (class 0 OID 0)
-- Dependencies: 280
-- Name: probes_probe_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.probes_probe_id_seq OWNED BY public.probes.probe_id;


--
-- TOC entry 300 (class 1259 OID 51841)
-- Name: tank_setting; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tank_setting (
    code character varying(10) NOT NULL,
    tank_name character varying(100) NOT NULL,
    probe_id integer NOT NULL,
    fuel_code character varying(10) NOT NULL,
    capacity_l numeric(12,2),
    tank_type integer,
    vertical_mm numeric(12,2),
    horizontal_mm numeric(12,2),
    length_mm numeric(12,2),
    cal_capacity_l numeric(12,2),
    comp_oil_mm numeric(12,2),
    comp_water_mm numeric(12,2),
    high_alarm_l numeric(12,2),
    high_alert_l numeric(12,2),
    low_alarm_l numeric(12,2),
    water_high_alarm_l numeric(12,2)
);


ALTER TABLE public.tank_setting OWNER TO postgres;

--
-- TOC entry 285 (class 1259 OID 27013)
-- Name: tanks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tanks (
    tank_id integer NOT NULL,
    probe_id integer,
    fuel_name character varying(255),
    capacity numeric(10,4),
    fuel_density numeric(10,4),
    tank_length numeric(10,4),
    hori_diameter numeric(10,4),
    verti_diameter numeric(10,4),
    level_comp integer,
    tank_type character varying(255),
    unit character varying(255),
    high_alarm numeric(10,4),
    high_alert numeric(10,4),
    low_alarm numeric(10,4),
    tank_colors character varying(255),
    branch_code character varying(255) NOT NULL
);


ALTER TABLE public.tanks OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 27012)
-- Name: tanks_tank_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tanks_tank_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tanks_tank_id_seq OWNER TO postgres;

--
-- TOC entry 4155 (class 0 OID 0)
-- Dependencies: 284
-- Name: tanks_tank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tanks_tank_id_seq OWNED BY public.tanks.tank_id;


--
-- TOC entry 3842 (class 2604 OID 27091)
-- Name: _hyper_2_1_chunk id; Type: DEFAULT; Schema: _timescaledb_internal; Owner: postgres
--

ALTER TABLE ONLY _timescaledb_internal._hyper_2_1_chunk ALTER COLUMN id SET DEFAULT nextval('public.fuel_level_id_seq'::regclass);


--
-- TOC entry 3841 (class 2604 OID 27073)
-- Name: admin id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin ALTER COLUMN id SET DEFAULT nextval('public.admin_id_seq'::regclass);


--
-- TOC entry 3836 (class 2604 OID 27005)
-- Name: branches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches ALTER COLUMN id SET DEFAULT nextval('public.branches_id_seq'::regclass);


--
-- TOC entry 3838 (class 2604 OID 27035)
-- Name: fuel_level id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_level ALTER COLUMN id SET DEFAULT nextval('public.fuel_level_id_seq'::regclass);


--
-- TOC entry 3839 (class 2604 OID 27049)
-- Name: fuel_loading id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_loading ALTER COLUMN id SET DEFAULT nextval('public.fuel_loading_id_seq'::regclass);


--
-- TOC entry 3840 (class 2604 OID 27061)
-- Name: leak_test id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leak_test ALTER COLUMN id SET DEFAULT nextval('public.leak_test_id_seq'::regclass);


--
-- TOC entry 3843 (class 2604 OID 27132)
-- Name: probe_types probe_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.probe_types ALTER COLUMN probe_type_id SET DEFAULT nextval('public.probe_types_probe_type_id_seq'::regclass);


--
-- TOC entry 3835 (class 2604 OID 26998)
-- Name: probes probe_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.probes ALTER COLUMN probe_id SET DEFAULT nextval('public.probes_probe_id_seq'::regclass);


--
-- TOC entry 3837 (class 2604 OID 27016)
-- Name: tanks tank_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tanks ALTER COLUMN tank_id SET DEFAULT nextval('public.tanks_tank_id_seq'::regclass);


--
-- TOC entry 3957 (class 2606 OID 27095)
-- Name: _hyper_2_1_chunk 1_1_fuel_level_pkey; Type: CONSTRAINT; Schema: _timescaledb_internal; Owner: postgres
--

ALTER TABLE ONLY _timescaledb_internal._hyper_2_1_chunk
    ADD CONSTRAINT "1_1_fuel_level_pkey" PRIMARY KEY (id, "timestamp");


--
-- TOC entry 3953 (class 2606 OID 27077)
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (id);


--
-- TOC entry 3955 (class 2606 OID 27079)
-- Name: admin admin_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_username_key UNIQUE (username);


--
-- TOC entry 3937 (class 2606 OID 27011)
-- Name: branches branches_branch_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_branch_code_key UNIQUE (branch_code);


--
-- TOC entry 3939 (class 2606 OID 27009)
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- TOC entry 3943 (class 2606 OID 27039)
-- Name: fuel_level fuel_level_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_level
    ADD CONSTRAINT fuel_level_pkey PRIMARY KEY (id, "timestamp");


--
-- TOC entry 3947 (class 2606 OID 27051)
-- Name: fuel_loading fuel_loading_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_loading
    ADD CONSTRAINT fuel_loading_pkey PRIMARY KEY (id);


--
-- TOC entry 3967 (class 2606 OID 51781)
-- Name: fuel_names fuel_names_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_names
    ADD CONSTRAINT fuel_names_pkey PRIMARY KEY (fuel_code);


--
-- TOC entry 3965 (class 2606 OID 51767)
-- Name: fuel_types fuel_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_types
    ADD CONSTRAINT fuel_types_pkey PRIMARY KEY (fuel_type_code);


--
-- TOC entry 3951 (class 2606 OID 27063)
-- Name: leak_test leak_test_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leak_test
    ADD CONSTRAINT leak_test_pkey PRIMARY KEY (id);


--
-- TOC entry 3963 (class 2606 OID 27139)
-- Name: probe_setting probe_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.probe_setting
    ADD CONSTRAINT probe_configs_pkey PRIMARY KEY (probe_id);


--
-- TOC entry 3961 (class 2606 OID 27134)
-- Name: probe_types probe_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.probe_types
    ADD CONSTRAINT probe_types_pkey PRIMARY KEY (probe_type_id);


--
-- TOC entry 3935 (class 2606 OID 27000)
-- Name: probes probes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.probes
    ADD CONSTRAINT probes_pkey PRIMARY KEY (probe_id);


--
-- TOC entry 3969 (class 2606 OID 51845)
-- Name: tank_setting tank_setting_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tank_setting
    ADD CONSTRAINT tank_setting_pkey PRIMARY KEY (code);


--
-- TOC entry 3941 (class 2606 OID 27020)
-- Name: tanks tanks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tanks
    ADD CONSTRAINT tanks_pkey PRIMARY KEY (tank_id);


--
-- TOC entry 3958 (class 1259 OID 27103)
-- Name: _hyper_2_1_chunk_fuel_level_timestamp_idx; Type: INDEX; Schema: _timescaledb_internal; Owner: postgres
--

CREATE INDEX _hyper_2_1_chunk_fuel_level_timestamp_idx ON _timescaledb_internal._hyper_2_1_chunk USING btree ("timestamp" DESC);


--
-- TOC entry 3959 (class 1259 OID 27102)
-- Name: _hyper_2_1_chunk_idx_fuel_level_tank_time; Type: INDEX; Schema: _timescaledb_internal; Owner: postgres
--

CREATE INDEX _hyper_2_1_chunk_idx_fuel_level_tank_time ON _timescaledb_internal._hyper_2_1_chunk USING btree (tank_id, "timestamp" DESC);


--
-- TOC entry 3944 (class 1259 OID 27083)
-- Name: fuel_level_timestamp_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX fuel_level_timestamp_idx ON public.fuel_level USING btree ("timestamp" DESC);


--
-- TOC entry 3945 (class 1259 OID 27080)
-- Name: idx_fuel_level_tank_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fuel_level_tank_time ON public.fuel_level USING btree (tank_id, "timestamp" DESC);


--
-- TOC entry 3948 (class 1259 OID 27081)
-- Name: idx_fuel_loading_tank_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fuel_loading_tank_time ON public.fuel_loading USING btree (tank_id, "timestamp" DESC);


--
-- TOC entry 3949 (class 1259 OID 27082)
-- Name: idx_leak_test_tank_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leak_test_tank_time ON public.leak_test USING btree (tank_id, "timestamp" DESC);


--
-- TOC entry 3980 (class 2620 OID 27084)
-- Name: fuel_level ts_insert_blocker; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER ts_insert_blocker BEFORE INSERT ON public.fuel_level FOR EACH ROW EXECUTE FUNCTION _timescaledb_functions.insert_blocker();


--
-- TOC entry 3975 (class 2606 OID 27096)
-- Name: _hyper_2_1_chunk 1_2_fuel_level_tank_id_fkey; Type: FK CONSTRAINT; Schema: _timescaledb_internal; Owner: postgres
--

ALTER TABLE ONLY _timescaledb_internal._hyper_2_1_chunk
    ADD CONSTRAINT "1_2_fuel_level_tank_id_fkey" FOREIGN KEY (tank_id) REFERENCES public.tanks(tank_id);


--
-- TOC entry 3977 (class 2606 OID 51782)
-- Name: fuel_names fk_fuel_type; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_names
    ADD CONSTRAINT fk_fuel_type FOREIGN KEY (fuel_type) REFERENCES public.fuel_types(fuel_type_code) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- TOC entry 3972 (class 2606 OID 27040)
-- Name: fuel_level fuel_level_tank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_level
    ADD CONSTRAINT fuel_level_tank_id_fkey FOREIGN KEY (tank_id) REFERENCES public.tanks(tank_id);


--
-- TOC entry 3973 (class 2606 OID 27052)
-- Name: fuel_loading fuel_loading_tank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fuel_loading
    ADD CONSTRAINT fuel_loading_tank_id_fkey FOREIGN KEY (tank_id) REFERENCES public.tanks(tank_id);


--
-- TOC entry 3974 (class 2606 OID 27064)
-- Name: leak_test leak_test_tank_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leak_test
    ADD CONSTRAINT leak_test_tank_id_fkey FOREIGN KEY (tank_id) REFERENCES public.tanks(tank_id);


--
-- TOC entry 3976 (class 2606 OID 27140)
-- Name: probe_setting probe_configs_probe_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.probe_setting
    ADD CONSTRAINT probe_configs_probe_type_id_fkey FOREIGN KEY (probe_type_id) REFERENCES public.probe_types(probe_type_id);


--
-- TOC entry 3978 (class 2606 OID 51851)
-- Name: tank_setting tank_setting_fuel_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tank_setting
    ADD CONSTRAINT tank_setting_fuel_code_fkey FOREIGN KEY (fuel_code) REFERENCES public.fuel_names(fuel_code);


--
-- TOC entry 3979 (class 2606 OID 51846)
-- Name: tank_setting tank_setting_probe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tank_setting
    ADD CONSTRAINT tank_setting_probe_id_fkey FOREIGN KEY (probe_id) REFERENCES public.probe_setting(probe_id);


--
-- TOC entry 3970 (class 2606 OID 27026)
-- Name: tanks tanks_branch_code_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tanks
    ADD CONSTRAINT tanks_branch_code_fkey FOREIGN KEY (branch_code) REFERENCES public.branches(branch_code);


--
-- TOC entry 3971 (class 2606 OID 27021)
-- Name: tanks tanks_probe_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tanks
    ADD CONSTRAINT tanks_probe_id_fkey FOREIGN KEY (probe_id) REFERENCES public.probes(probe_id);


-- Completed on 2025-10-10 15:39:43

--
-- PostgreSQL database dump complete
--

\unrestrict YcaaEJh9UfpVQRdjHFAJedP4GzUhf4wZtfcPOsG3NJdtqFj2OaUuSYHk7oyhCsH



