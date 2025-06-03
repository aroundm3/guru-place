--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

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
-- Name: admin_permissions; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.admin_permissions (
    id integer NOT NULL,
    document_id character varying(255),
    action character varying(255),
    action_parameters jsonb,
    subject character varying(255),
    properties jsonb,
    conditions jsonb,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.admin_permissions OWNER TO dinhanh;

--
-- Name: admin_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.admin_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_permissions_id_seq OWNER TO dinhanh;

--
-- Name: admin_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.admin_permissions_id_seq OWNED BY public.admin_permissions.id;


--
-- Name: admin_permissions_role_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.admin_permissions_role_lnk (
    id integer NOT NULL,
    permission_id integer,
    role_id integer,
    permission_ord double precision
);


ALTER TABLE public.admin_permissions_role_lnk OWNER TO dinhanh;

--
-- Name: admin_permissions_role_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.admin_permissions_role_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_permissions_role_lnk_id_seq OWNER TO dinhanh;

--
-- Name: admin_permissions_role_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.admin_permissions_role_lnk_id_seq OWNED BY public.admin_permissions_role_lnk.id;


--
-- Name: admin_roles; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.admin_roles (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    code character varying(255),
    description character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.admin_roles OWNER TO dinhanh;

--
-- Name: admin_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.admin_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_roles_id_seq OWNER TO dinhanh;

--
-- Name: admin_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.admin_roles_id_seq OWNED BY public.admin_roles.id;


--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    document_id character varying(255),
    firstname character varying(255),
    lastname character varying(255),
    username character varying(255),
    email character varying(255),
    password character varying(255),
    reset_password_token character varying(255),
    registration_token character varying(255),
    is_active boolean,
    blocked boolean,
    prefered_language character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.admin_users OWNER TO dinhanh;

--
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_id_seq OWNER TO dinhanh;

--
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- Name: admin_users_roles_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.admin_users_roles_lnk (
    id integer NOT NULL,
    user_id integer,
    role_id integer,
    role_ord double precision,
    user_ord double precision
);


ALTER TABLE public.admin_users_roles_lnk OWNER TO dinhanh;

--
-- Name: admin_users_roles_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.admin_users_roles_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_roles_lnk_id_seq OWNER TO dinhanh;

--
-- Name: admin_users_roles_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.admin_users_roles_lnk_id_seq OWNED BY public.admin_users_roles_lnk.id;


--
-- Name: banners; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.banners (
    id integer NOT NULL,
    document_id character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255),
    index integer
);


ALTER TABLE public.banners OWNER TO dinhanh;

--
-- Name: banners_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.banners_id_seq OWNER TO dinhanh;

--
-- Name: banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.banners_id_seq OWNED BY public.banners.id;


--
-- Name: brands; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.brands (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    is_highlight boolean,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255),
    slug character varying(255),
    hidden_name boolean
);


ALTER TABLE public.brands OWNER TO dinhanh;

--
-- Name: brands_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.brands_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.brands_id_seq OWNER TO dinhanh;

--
-- Name: brands_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.brands_id_seq OWNED BY public.brands.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    description text,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255),
    slug character varying(255)
);


ALTER TABLE public.categories OWNER TO dinhanh;

--
-- Name: categories_brands_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.categories_brands_lnk (
    id integer NOT NULL,
    category_id integer,
    brand_id integer,
    brand_ord double precision,
    category_ord double precision
);


ALTER TABLE public.categories_brands_lnk OWNER TO dinhanh;

--
-- Name: categories_brands_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.categories_brands_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_brands_lnk_id_seq OWNER TO dinhanh;

--
-- Name: categories_brands_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.categories_brands_lnk_id_seq OWNED BY public.categories_brands_lnk.id;


--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO dinhanh;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: components_shared_media; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.components_shared_media (
    id integer NOT NULL
);


ALTER TABLE public.components_shared_media OWNER TO dinhanh;

--
-- Name: components_shared_media_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.components_shared_media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.components_shared_media_id_seq OWNER TO dinhanh;

--
-- Name: components_shared_media_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.components_shared_media_id_seq OWNED BY public.components_shared_media.id;


--
-- Name: components_shared_quotes; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.components_shared_quotes (
    id integer NOT NULL,
    title character varying(255),
    body text
);


ALTER TABLE public.components_shared_quotes OWNER TO dinhanh;

--
-- Name: components_shared_quotes_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.components_shared_quotes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.components_shared_quotes_id_seq OWNER TO dinhanh;

--
-- Name: components_shared_quotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.components_shared_quotes_id_seq OWNED BY public.components_shared_quotes.id;


--
-- Name: components_shared_rich_texts; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.components_shared_rich_texts (
    id integer NOT NULL,
    body text
);


ALTER TABLE public.components_shared_rich_texts OWNER TO dinhanh;

--
-- Name: components_shared_rich_texts_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.components_shared_rich_texts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.components_shared_rich_texts_id_seq OWNER TO dinhanh;

--
-- Name: components_shared_rich_texts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.components_shared_rich_texts_id_seq OWNED BY public.components_shared_rich_texts.id;


--
-- Name: components_shared_seos; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.components_shared_seos (
    id integer NOT NULL,
    meta_title character varying(255),
    meta_description text
);


ALTER TABLE public.components_shared_seos OWNER TO dinhanh;

--
-- Name: components_shared_seos_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.components_shared_seos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.components_shared_seos_id_seq OWNER TO dinhanh;

--
-- Name: components_shared_seos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.components_shared_seos_id_seq OWNED BY public.components_shared_seos.id;


--
-- Name: components_shared_sliders; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.components_shared_sliders (
    id integer NOT NULL
);


ALTER TABLE public.components_shared_sliders OWNER TO dinhanh;

--
-- Name: components_shared_sliders_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.components_shared_sliders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.components_shared_sliders_id_seq OWNER TO dinhanh;

--
-- Name: components_shared_sliders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.components_shared_sliders_id_seq OWNED BY public.components_shared_sliders.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    document_id character varying(255),
    full_name character varying(255),
    dob date,
    phone_number character varying(255),
    address character varying(255),
    point bigint,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.customers OWNER TO dinhanh;

--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.customers_id_seq OWNER TO dinhanh;

--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: files; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.files (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    alternative_text character varying(255),
    caption character varying(255),
    width integer,
    height integer,
    formats jsonb,
    hash character varying(255),
    ext character varying(255),
    mime character varying(255),
    size numeric(10,2),
    url character varying(255),
    preview_url character varying(255),
    provider character varying(255),
    provider_metadata jsonb,
    folder_path character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.files OWNER TO dinhanh;

--
-- Name: files_folder_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.files_folder_lnk (
    id integer NOT NULL,
    file_id integer,
    folder_id integer,
    file_ord double precision
);


ALTER TABLE public.files_folder_lnk OWNER TO dinhanh;

--
-- Name: files_folder_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.files_folder_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_folder_lnk_id_seq OWNER TO dinhanh;

--
-- Name: files_folder_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.files_folder_lnk_id_seq OWNED BY public.files_folder_lnk.id;


--
-- Name: files_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_id_seq OWNER TO dinhanh;

--
-- Name: files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.files_id_seq OWNED BY public.files.id;


--
-- Name: files_related_mph; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.files_related_mph (
    id integer NOT NULL,
    file_id integer,
    related_id integer,
    related_type character varying(255),
    field character varying(255),
    "order" double precision
);


ALTER TABLE public.files_related_mph OWNER TO dinhanh;

--
-- Name: files_related_mph_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.files_related_mph_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.files_related_mph_id_seq OWNER TO dinhanh;

--
-- Name: files_related_mph_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.files_related_mph_id_seq OWNED BY public.files_related_mph.id;


--
-- Name: globals; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.globals (
    id integer NOT NULL,
    document_id character varying(255),
    site_name character varying(255),
    site_description text,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.globals OWNER TO dinhanh;

--
-- Name: globals_cmps; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.globals_cmps (
    id integer NOT NULL,
    entity_id integer,
    cmp_id integer,
    component_type character varying(255),
    field character varying(255),
    "order" double precision
);


ALTER TABLE public.globals_cmps OWNER TO dinhanh;

--
-- Name: globals_cmps_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.globals_cmps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.globals_cmps_id_seq OWNER TO dinhanh;

--
-- Name: globals_cmps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.globals_cmps_id_seq OWNED BY public.globals_cmps.id;


--
-- Name: globals_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.globals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.globals_id_seq OWNER TO dinhanh;

--
-- Name: globals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.globals_id_seq OWNED BY public.globals.id;


--
-- Name: i18n_locale; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.i18n_locale (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    code character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.i18n_locale OWNER TO dinhanh;

--
-- Name: i18n_locale_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.i18n_locale_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.i18n_locale_id_seq OWNER TO dinhanh;

--
-- Name: i18n_locale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.i18n_locale_id_seq OWNED BY public.i18n_locale.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    document_id character varying(255),
    quantity bigint,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.order_items OWNER TO dinhanh;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_id_seq OWNER TO dinhanh;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: order_items_order_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.order_items_order_lnk (
    id integer NOT NULL,
    order_item_id integer,
    order_id integer,
    order_item_ord double precision
);


ALTER TABLE public.order_items_order_lnk OWNER TO dinhanh;

--
-- Name: order_items_order_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.order_items_order_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_order_lnk_id_seq OWNER TO dinhanh;

--
-- Name: order_items_order_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.order_items_order_lnk_id_seq OWNED BY public.order_items_order_lnk.id;


--
-- Name: order_items_variant_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.order_items_variant_lnk (
    id integer NOT NULL,
    order_item_id integer,
    variant_id integer,
    order_item_ord double precision
);


ALTER TABLE public.order_items_variant_lnk OWNER TO dinhanh;

--
-- Name: order_items_variant_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.order_items_variant_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_items_variant_lnk_id_seq OWNER TO dinhanh;

--
-- Name: order_items_variant_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.order_items_variant_lnk_id_seq OWNED BY public.order_items_variant_lnk.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    document_id character varying(255),
    shipping_fee bigint,
    point bigint,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.orders OWNER TO dinhanh;

--
-- Name: orders_customer_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.orders_customer_lnk (
    id integer NOT NULL,
    order_id integer,
    customer_id integer,
    order_ord double precision
);


ALTER TABLE public.orders_customer_lnk OWNER TO dinhanh;

--
-- Name: orders_customer_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.orders_customer_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_customer_lnk_id_seq OWNER TO dinhanh;

--
-- Name: orders_customer_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.orders_customer_lnk_id_seq OWNED BY public.orders_customer_lnk.id;


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO dinhanh;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product_list_blocks; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.product_list_blocks (
    id integer NOT NULL,
    document_id character varying(255),
    index integer,
    title character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.product_list_blocks OWNER TO dinhanh;

--
-- Name: product_list_blocks_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.product_list_blocks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_list_blocks_id_seq OWNER TO dinhanh;

--
-- Name: product_list_blocks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.product_list_blocks_id_seq OWNED BY public.product_list_blocks.id;


--
-- Name: product_list_blocks_products_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.product_list_blocks_products_lnk (
    id integer NOT NULL,
    product_list_block_id integer,
    product_id integer,
    product_ord double precision
);


ALTER TABLE public.product_list_blocks_products_lnk OWNER TO dinhanh;

--
-- Name: product_list_blocks_products_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.product_list_blocks_products_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_list_blocks_products_lnk_id_seq OWNER TO dinhanh;

--
-- Name: product_list_blocks_products_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.product_list_blocks_products_lnk_id_seq OWNED BY public.product_list_blocks_products_lnk.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.products (
    id integer NOT NULL,
    document_id character varying(255),
    name text,
    short_description text,
    detail_description jsonb,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255),
    sold_quantity bigint,
    slug character varying(255)
);


ALTER TABLE public.products OWNER TO dinhanh;

--
-- Name: products_brand_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.products_brand_lnk (
    id integer NOT NULL,
    product_id integer,
    brand_id integer
);


ALTER TABLE public.products_brand_lnk OWNER TO dinhanh;

--
-- Name: products_brand_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.products_brand_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_brand_lnk_id_seq OWNER TO dinhanh;

--
-- Name: products_brand_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.products_brand_lnk_id_seq OWNED BY public.products_brand_lnk.id;


--
-- Name: products_category_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.products_category_lnk (
    id integer NOT NULL,
    product_id integer,
    category_id integer
);


ALTER TABLE public.products_category_lnk OWNER TO dinhanh;

--
-- Name: products_category_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.products_category_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_category_lnk_id_seq OWNER TO dinhanh;

--
-- Name: products_category_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.products_category_lnk_id_seq OWNED BY public.products_category_lnk.id;


--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO dinhanh;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.services (
    id integer NOT NULL,
    document_id character varying(255),
    price bigint,
    title text,
    description jsonb,
    number_booking bigint,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.services OWNER TO dinhanh;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.services_id_seq OWNER TO dinhanh;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: strapi_api_token_permissions; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_api_token_permissions (
    id integer NOT NULL,
    document_id character varying(255),
    action character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_api_token_permissions OWNER TO dinhanh;

--
-- Name: strapi_api_token_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_api_token_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_api_token_permissions_id_seq OWNER TO dinhanh;

--
-- Name: strapi_api_token_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_api_token_permissions_id_seq OWNED BY public.strapi_api_token_permissions.id;


--
-- Name: strapi_api_token_permissions_token_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_api_token_permissions_token_lnk (
    id integer NOT NULL,
    api_token_permission_id integer,
    api_token_id integer,
    api_token_permission_ord double precision
);


ALTER TABLE public.strapi_api_token_permissions_token_lnk OWNER TO dinhanh;

--
-- Name: strapi_api_token_permissions_token_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_api_token_permissions_token_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_api_token_permissions_token_lnk_id_seq OWNER TO dinhanh;

--
-- Name: strapi_api_token_permissions_token_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_api_token_permissions_token_lnk_id_seq OWNED BY public.strapi_api_token_permissions_token_lnk.id;


--
-- Name: strapi_api_tokens; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_api_tokens (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    description character varying(255),
    type character varying(255),
    access_key character varying(255),
    encrypted_key text,
    last_used_at timestamp(6) without time zone,
    expires_at timestamp(6) without time zone,
    lifespan bigint,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_api_tokens OWNER TO dinhanh;

--
-- Name: strapi_api_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_api_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_api_tokens_id_seq OWNER TO dinhanh;

--
-- Name: strapi_api_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_api_tokens_id_seq OWNED BY public.strapi_api_tokens.id;


--
-- Name: strapi_core_store_settings; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_core_store_settings (
    id integer NOT NULL,
    key character varying(255),
    value text,
    type character varying(255),
    environment character varying(255),
    tag character varying(255)
);


ALTER TABLE public.strapi_core_store_settings OWNER TO dinhanh;

--
-- Name: strapi_core_store_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_core_store_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_core_store_settings_id_seq OWNER TO dinhanh;

--
-- Name: strapi_core_store_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_core_store_settings_id_seq OWNED BY public.strapi_core_store_settings.id;


--
-- Name: strapi_database_schema; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_database_schema (
    id integer NOT NULL,
    schema json,
    "time" timestamp without time zone,
    hash character varying(255)
);


ALTER TABLE public.strapi_database_schema OWNER TO dinhanh;

--
-- Name: strapi_database_schema_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_database_schema_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_database_schema_id_seq OWNER TO dinhanh;

--
-- Name: strapi_database_schema_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_database_schema_id_seq OWNED BY public.strapi_database_schema.id;


--
-- Name: strapi_history_versions; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_history_versions (
    id integer NOT NULL,
    content_type character varying(255) NOT NULL,
    related_document_id character varying(255),
    locale character varying(255),
    status character varying(255),
    data jsonb,
    schema jsonb,
    created_at timestamp(6) without time zone,
    created_by_id integer
);


ALTER TABLE public.strapi_history_versions OWNER TO dinhanh;

--
-- Name: strapi_history_versions_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_history_versions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_history_versions_id_seq OWNER TO dinhanh;

--
-- Name: strapi_history_versions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_history_versions_id_seq OWNED BY public.strapi_history_versions.id;


--
-- Name: strapi_migrations; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_migrations (
    id integer NOT NULL,
    name character varying(255),
    "time" timestamp without time zone
);


ALTER TABLE public.strapi_migrations OWNER TO dinhanh;

--
-- Name: strapi_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_migrations_id_seq OWNER TO dinhanh;

--
-- Name: strapi_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_migrations_id_seq OWNED BY public.strapi_migrations.id;


--
-- Name: strapi_migrations_internal; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_migrations_internal (
    id integer NOT NULL,
    name character varying(255),
    "time" timestamp without time zone
);


ALTER TABLE public.strapi_migrations_internal OWNER TO dinhanh;

--
-- Name: strapi_migrations_internal_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_migrations_internal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_migrations_internal_id_seq OWNER TO dinhanh;

--
-- Name: strapi_migrations_internal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_migrations_internal_id_seq OWNED BY public.strapi_migrations_internal.id;


--
-- Name: strapi_release_actions; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_release_actions (
    id integer NOT NULL,
    document_id character varying(255),
    type character varying(255),
    content_type character varying(255),
    entry_document_id character varying(255),
    locale character varying(255),
    is_entry_valid boolean,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer
);


ALTER TABLE public.strapi_release_actions OWNER TO dinhanh;

--
-- Name: strapi_release_actions_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_release_actions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_release_actions_id_seq OWNER TO dinhanh;

--
-- Name: strapi_release_actions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_release_actions_id_seq OWNED BY public.strapi_release_actions.id;


--
-- Name: strapi_release_actions_release_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_release_actions_release_lnk (
    id integer NOT NULL,
    release_action_id integer,
    release_id integer,
    release_action_ord double precision
);


ALTER TABLE public.strapi_release_actions_release_lnk OWNER TO dinhanh;

--
-- Name: strapi_release_actions_release_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_release_actions_release_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_release_actions_release_lnk_id_seq OWNER TO dinhanh;

--
-- Name: strapi_release_actions_release_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_release_actions_release_lnk_id_seq OWNED BY public.strapi_release_actions_release_lnk.id;


--
-- Name: strapi_releases; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_releases (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    released_at timestamp(6) without time zone,
    scheduled_at timestamp(6) without time zone,
    timezone character varying(255),
    status character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_releases OWNER TO dinhanh;

--
-- Name: strapi_releases_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_releases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_releases_id_seq OWNER TO dinhanh;

--
-- Name: strapi_releases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_releases_id_seq OWNED BY public.strapi_releases.id;


--
-- Name: strapi_transfer_token_permissions; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_transfer_token_permissions (
    id integer NOT NULL,
    document_id character varying(255),
    action character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_transfer_token_permissions OWNER TO dinhanh;

--
-- Name: strapi_transfer_token_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_transfer_token_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_transfer_token_permissions_id_seq OWNER TO dinhanh;

--
-- Name: strapi_transfer_token_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_transfer_token_permissions_id_seq OWNED BY public.strapi_transfer_token_permissions.id;


--
-- Name: strapi_transfer_token_permissions_token_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_transfer_token_permissions_token_lnk (
    id integer NOT NULL,
    transfer_token_permission_id integer,
    transfer_token_id integer,
    transfer_token_permission_ord double precision
);


ALTER TABLE public.strapi_transfer_token_permissions_token_lnk OWNER TO dinhanh;

--
-- Name: strapi_transfer_token_permissions_token_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_transfer_token_permissions_token_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_transfer_token_permissions_token_lnk_id_seq OWNER TO dinhanh;

--
-- Name: strapi_transfer_token_permissions_token_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_transfer_token_permissions_token_lnk_id_seq OWNED BY public.strapi_transfer_token_permissions_token_lnk.id;


--
-- Name: strapi_transfer_tokens; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_transfer_tokens (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    description character varying(255),
    access_key character varying(255),
    last_used_at timestamp(6) without time zone,
    expires_at timestamp(6) without time zone,
    lifespan bigint,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_transfer_tokens OWNER TO dinhanh;

--
-- Name: strapi_transfer_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_transfer_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_transfer_tokens_id_seq OWNER TO dinhanh;

--
-- Name: strapi_transfer_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_transfer_tokens_id_seq OWNED BY public.strapi_transfer_tokens.id;


--
-- Name: strapi_webhooks; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_webhooks (
    id integer NOT NULL,
    name character varying(255),
    url text,
    headers jsonb,
    events jsonb,
    enabled boolean
);


ALTER TABLE public.strapi_webhooks OWNER TO dinhanh;

--
-- Name: strapi_webhooks_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_webhooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_webhooks_id_seq OWNER TO dinhanh;

--
-- Name: strapi_webhooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_webhooks_id_seq OWNED BY public.strapi_webhooks.id;


--
-- Name: strapi_workflows; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_workflows (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    content_types jsonb,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_workflows OWNER TO dinhanh;

--
-- Name: strapi_workflows_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_workflows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_workflows_id_seq OWNER TO dinhanh;

--
-- Name: strapi_workflows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_workflows_id_seq OWNED BY public.strapi_workflows.id;


--
-- Name: strapi_workflows_stage_required_to_publish_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_workflows_stage_required_to_publish_lnk (
    id integer NOT NULL,
    workflow_id integer,
    workflow_stage_id integer
);


ALTER TABLE public.strapi_workflows_stage_required_to_publish_lnk OWNER TO dinhanh;

--
-- Name: strapi_workflows_stage_required_to_publish_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_workflows_stage_required_to_publish_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_workflows_stage_required_to_publish_lnk_id_seq OWNER TO dinhanh;

--
-- Name: strapi_workflows_stage_required_to_publish_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_workflows_stage_required_to_publish_lnk_id_seq OWNED BY public.strapi_workflows_stage_required_to_publish_lnk.id;


--
-- Name: strapi_workflows_stages; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_workflows_stages (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    color character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.strapi_workflows_stages OWNER TO dinhanh;

--
-- Name: strapi_workflows_stages_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_workflows_stages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_workflows_stages_id_seq OWNER TO dinhanh;

--
-- Name: strapi_workflows_stages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_workflows_stages_id_seq OWNED BY public.strapi_workflows_stages.id;


--
-- Name: strapi_workflows_stages_permissions_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_workflows_stages_permissions_lnk (
    id integer NOT NULL,
    workflow_stage_id integer,
    permission_id integer,
    permission_ord double precision
);


ALTER TABLE public.strapi_workflows_stages_permissions_lnk OWNER TO dinhanh;

--
-- Name: strapi_workflows_stages_permissions_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_workflows_stages_permissions_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_workflows_stages_permissions_lnk_id_seq OWNER TO dinhanh;

--
-- Name: strapi_workflows_stages_permissions_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_workflows_stages_permissions_lnk_id_seq OWNED BY public.strapi_workflows_stages_permissions_lnk.id;


--
-- Name: strapi_workflows_stages_workflow_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.strapi_workflows_stages_workflow_lnk (
    id integer NOT NULL,
    workflow_stage_id integer,
    workflow_id integer,
    workflow_stage_ord double precision
);


ALTER TABLE public.strapi_workflows_stages_workflow_lnk OWNER TO dinhanh;

--
-- Name: strapi_workflows_stages_workflow_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.strapi_workflows_stages_workflow_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.strapi_workflows_stages_workflow_lnk_id_seq OWNER TO dinhanh;

--
-- Name: strapi_workflows_stages_workflow_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.strapi_workflows_stages_workflow_lnk_id_seq OWNED BY public.strapi_workflows_stages_workflow_lnk.id;


--
-- Name: up_permissions; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.up_permissions (
    id integer NOT NULL,
    document_id character varying(255),
    action character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.up_permissions OWNER TO dinhanh;

--
-- Name: up_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.up_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.up_permissions_id_seq OWNER TO dinhanh;

--
-- Name: up_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.up_permissions_id_seq OWNED BY public.up_permissions.id;


--
-- Name: up_permissions_role_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.up_permissions_role_lnk (
    id integer NOT NULL,
    permission_id integer,
    role_id integer,
    permission_ord double precision
);


ALTER TABLE public.up_permissions_role_lnk OWNER TO dinhanh;

--
-- Name: up_permissions_role_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.up_permissions_role_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.up_permissions_role_lnk_id_seq OWNER TO dinhanh;

--
-- Name: up_permissions_role_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.up_permissions_role_lnk_id_seq OWNED BY public.up_permissions_role_lnk.id;


--
-- Name: up_roles; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.up_roles (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    description character varying(255),
    type character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.up_roles OWNER TO dinhanh;

--
-- Name: up_roles_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.up_roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.up_roles_id_seq OWNER TO dinhanh;

--
-- Name: up_roles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.up_roles_id_seq OWNED BY public.up_roles.id;


--
-- Name: up_users; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.up_users (
    id integer NOT NULL,
    document_id character varying(255),
    username character varying(255),
    email character varying(255),
    provider character varying(255),
    password character varying(255),
    reset_password_token character varying(255),
    confirmation_token character varying(255),
    confirmed boolean,
    blocked boolean,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.up_users OWNER TO dinhanh;

--
-- Name: up_users_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.up_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.up_users_id_seq OWNER TO dinhanh;

--
-- Name: up_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.up_users_id_seq OWNED BY public.up_users.id;


--
-- Name: up_users_role_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.up_users_role_lnk (
    id integer NOT NULL,
    user_id integer,
    role_id integer,
    user_ord double precision
);


ALTER TABLE public.up_users_role_lnk OWNER TO dinhanh;

--
-- Name: up_users_role_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.up_users_role_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.up_users_role_lnk_id_seq OWNER TO dinhanh;

--
-- Name: up_users_role_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.up_users_role_lnk_id_seq OWNED BY public.up_users_role_lnk.id;


--
-- Name: upload_folders; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.upload_folders (
    id integer NOT NULL,
    document_id character varying(255),
    name character varying(255),
    path_id integer,
    path character varying(255),
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255)
);


ALTER TABLE public.upload_folders OWNER TO dinhanh;

--
-- Name: upload_folders_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.upload_folders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.upload_folders_id_seq OWNER TO dinhanh;

--
-- Name: upload_folders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.upload_folders_id_seq OWNED BY public.upload_folders.id;


--
-- Name: upload_folders_parent_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.upload_folders_parent_lnk (
    id integer NOT NULL,
    folder_id integer,
    inv_folder_id integer,
    folder_ord double precision
);


ALTER TABLE public.upload_folders_parent_lnk OWNER TO dinhanh;

--
-- Name: upload_folders_parent_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.upload_folders_parent_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.upload_folders_parent_lnk_id_seq OWNER TO dinhanh;

--
-- Name: upload_folders_parent_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.upload_folders_parent_lnk_id_seq OWNED BY public.upload_folders_parent_lnk.id;


--
-- Name: variants; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.variants (
    id integer NOT NULL,
    document_id character varying(255),
    variant_option character varying(255),
    variant_value character varying(255),
    quantity bigint,
    created_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    published_at timestamp(6) without time zone,
    created_by_id integer,
    updated_by_id integer,
    locale character varying(255),
    base_price bigint,
    sale_price bigint,
    sku character varying(255)
);


ALTER TABLE public.variants OWNER TO dinhanh;

--
-- Name: variants_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.variants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.variants_id_seq OWNER TO dinhanh;

--
-- Name: variants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.variants_id_seq OWNED BY public.variants.id;


--
-- Name: variants_product_lnk; Type: TABLE; Schema: public; Owner: dinhanh
--

CREATE TABLE public.variants_product_lnk (
    id integer NOT NULL,
    variant_id integer,
    product_id integer,
    variant_ord double precision
);


ALTER TABLE public.variants_product_lnk OWNER TO dinhanh;

--
-- Name: variants_product_lnk_id_seq; Type: SEQUENCE; Schema: public; Owner: dinhanh
--

CREATE SEQUENCE public.variants_product_lnk_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.variants_product_lnk_id_seq OWNER TO dinhanh;

--
-- Name: variants_product_lnk_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: dinhanh
--

ALTER SEQUENCE public.variants_product_lnk_id_seq OWNED BY public.variants_product_lnk.id;


--
-- Name: admin_permissions id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_permissions ALTER COLUMN id SET DEFAULT nextval('public.admin_permissions_id_seq'::regclass);


--
-- Name: admin_permissions_role_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_permissions_role_lnk ALTER COLUMN id SET DEFAULT nextval('public.admin_permissions_role_lnk_id_seq'::regclass);


--
-- Name: admin_roles id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_roles ALTER COLUMN id SET DEFAULT nextval('public.admin_roles_id_seq'::regclass);


--
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- Name: admin_users_roles_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_users_roles_lnk ALTER COLUMN id SET DEFAULT nextval('public.admin_users_roles_lnk_id_seq'::regclass);


--
-- Name: banners id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.banners ALTER COLUMN id SET DEFAULT nextval('public.banners_id_seq'::regclass);


--
-- Name: brands id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.brands ALTER COLUMN id SET DEFAULT nextval('public.brands_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: categories_brands_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.categories_brands_lnk ALTER COLUMN id SET DEFAULT nextval('public.categories_brands_lnk_id_seq'::regclass);


--
-- Name: components_shared_media id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.components_shared_media ALTER COLUMN id SET DEFAULT nextval('public.components_shared_media_id_seq'::regclass);


--
-- Name: components_shared_quotes id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.components_shared_quotes ALTER COLUMN id SET DEFAULT nextval('public.components_shared_quotes_id_seq'::regclass);


--
-- Name: components_shared_rich_texts id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.components_shared_rich_texts ALTER COLUMN id SET DEFAULT nextval('public.components_shared_rich_texts_id_seq'::regclass);


--
-- Name: components_shared_seos id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.components_shared_seos ALTER COLUMN id SET DEFAULT nextval('public.components_shared_seos_id_seq'::regclass);


--
-- Name: components_shared_sliders id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.components_shared_sliders ALTER COLUMN id SET DEFAULT nextval('public.components_shared_sliders_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: files id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.files ALTER COLUMN id SET DEFAULT nextval('public.files_id_seq'::regclass);


--
-- Name: files_folder_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.files_folder_lnk ALTER COLUMN id SET DEFAULT nextval('public.files_folder_lnk_id_seq'::regclass);


--
-- Name: files_related_mph id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.files_related_mph ALTER COLUMN id SET DEFAULT nextval('public.files_related_mph_id_seq'::regclass);


--
-- Name: globals id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.globals ALTER COLUMN id SET DEFAULT nextval('public.globals_id_seq'::regclass);


--
-- Name: globals_cmps id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.globals_cmps ALTER COLUMN id SET DEFAULT nextval('public.globals_cmps_id_seq'::regclass);


--
-- Name: i18n_locale id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.i18n_locale ALTER COLUMN id SET DEFAULT nextval('public.i18n_locale_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: order_items_order_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items_order_lnk ALTER COLUMN id SET DEFAULT nextval('public.order_items_order_lnk_id_seq'::regclass);


--
-- Name: order_items_variant_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items_variant_lnk ALTER COLUMN id SET DEFAULT nextval('public.order_items_variant_lnk_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: orders_customer_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.orders_customer_lnk ALTER COLUMN id SET DEFAULT nextval('public.orders_customer_lnk_id_seq'::regclass);


--
-- Name: product_list_blocks id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.product_list_blocks ALTER COLUMN id SET DEFAULT nextval('public.product_list_blocks_id_seq'::regclass);


--
-- Name: product_list_blocks_products_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.product_list_blocks_products_lnk ALTER COLUMN id SET DEFAULT nextval('public.product_list_blocks_products_lnk_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: products_brand_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products_brand_lnk ALTER COLUMN id SET DEFAULT nextval('public.products_brand_lnk_id_seq'::regclass);


--
-- Name: products_category_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products_category_lnk ALTER COLUMN id SET DEFAULT nextval('public.products_category_lnk_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Name: strapi_api_token_permissions id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_api_token_permissions ALTER COLUMN id SET DEFAULT nextval('public.strapi_api_token_permissions_id_seq'::regclass);


--
-- Name: strapi_api_token_permissions_token_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_api_token_permissions_token_lnk ALTER COLUMN id SET DEFAULT nextval('public.strapi_api_token_permissions_token_lnk_id_seq'::regclass);


--
-- Name: strapi_api_tokens id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_api_tokens ALTER COLUMN id SET DEFAULT nextval('public.strapi_api_tokens_id_seq'::regclass);


--
-- Name: strapi_core_store_settings id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_core_store_settings ALTER COLUMN id SET DEFAULT nextval('public.strapi_core_store_settings_id_seq'::regclass);


--
-- Name: strapi_database_schema id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_database_schema ALTER COLUMN id SET DEFAULT nextval('public.strapi_database_schema_id_seq'::regclass);


--
-- Name: strapi_history_versions id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_history_versions ALTER COLUMN id SET DEFAULT nextval('public.strapi_history_versions_id_seq'::regclass);


--
-- Name: strapi_migrations id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_migrations ALTER COLUMN id SET DEFAULT nextval('public.strapi_migrations_id_seq'::regclass);


--
-- Name: strapi_migrations_internal id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_migrations_internal ALTER COLUMN id SET DEFAULT nextval('public.strapi_migrations_internal_id_seq'::regclass);


--
-- Name: strapi_release_actions id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_release_actions ALTER COLUMN id SET DEFAULT nextval('public.strapi_release_actions_id_seq'::regclass);


--
-- Name: strapi_release_actions_release_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_release_actions_release_lnk ALTER COLUMN id SET DEFAULT nextval('public.strapi_release_actions_release_lnk_id_seq'::regclass);


--
-- Name: strapi_releases id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_releases ALTER COLUMN id SET DEFAULT nextval('public.strapi_releases_id_seq'::regclass);


--
-- Name: strapi_transfer_token_permissions id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions ALTER COLUMN id SET DEFAULT nextval('public.strapi_transfer_token_permissions_id_seq'::regclass);


--
-- Name: strapi_transfer_token_permissions_token_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions_token_lnk ALTER COLUMN id SET DEFAULT nextval('public.strapi_transfer_token_permissions_token_lnk_id_seq'::regclass);


--
-- Name: strapi_transfer_tokens id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_transfer_tokens ALTER COLUMN id SET DEFAULT nextval('public.strapi_transfer_tokens_id_seq'::regclass);


--
-- Name: strapi_webhooks id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_webhooks ALTER COLUMN id SET DEFAULT nextval('public.strapi_webhooks_id_seq'::regclass);


--
-- Name: strapi_workflows id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows ALTER COLUMN id SET DEFAULT nextval('public.strapi_workflows_id_seq'::regclass);


--
-- Name: strapi_workflows_stage_required_to_publish_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stage_required_to_publish_lnk ALTER COLUMN id SET DEFAULT nextval('public.strapi_workflows_stage_required_to_publish_lnk_id_seq'::regclass);


--
-- Name: strapi_workflows_stages id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages ALTER COLUMN id SET DEFAULT nextval('public.strapi_workflows_stages_id_seq'::regclass);


--
-- Name: strapi_workflows_stages_permissions_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages_permissions_lnk ALTER COLUMN id SET DEFAULT nextval('public.strapi_workflows_stages_permissions_lnk_id_seq'::regclass);


--
-- Name: strapi_workflows_stages_workflow_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages_workflow_lnk ALTER COLUMN id SET DEFAULT nextval('public.strapi_workflows_stages_workflow_lnk_id_seq'::regclass);


--
-- Name: up_permissions id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_permissions ALTER COLUMN id SET DEFAULT nextval('public.up_permissions_id_seq'::regclass);


--
-- Name: up_permissions_role_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_permissions_role_lnk ALTER COLUMN id SET DEFAULT nextval('public.up_permissions_role_lnk_id_seq'::regclass);


--
-- Name: up_roles id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_roles ALTER COLUMN id SET DEFAULT nextval('public.up_roles_id_seq'::regclass);


--
-- Name: up_users id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_users ALTER COLUMN id SET DEFAULT nextval('public.up_users_id_seq'::regclass);


--
-- Name: up_users_role_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_users_role_lnk ALTER COLUMN id SET DEFAULT nextval('public.up_users_role_lnk_id_seq'::regclass);


--
-- Name: upload_folders id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.upload_folders ALTER COLUMN id SET DEFAULT nextval('public.upload_folders_id_seq'::regclass);


--
-- Name: upload_folders_parent_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.upload_folders_parent_lnk ALTER COLUMN id SET DEFAULT nextval('public.upload_folders_parent_lnk_id_seq'::regclass);


--
-- Name: variants id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.variants ALTER COLUMN id SET DEFAULT nextval('public.variants_id_seq'::regclass);


--
-- Name: variants_product_lnk id; Type: DEFAULT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.variants_product_lnk ALTER COLUMN id SET DEFAULT nextval('public.variants_product_lnk_id_seq'::regclass);


--
-- Data for Name: admin_permissions; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.admin_permissions (id, document_id, action, action_parameters, subject, properties, conditions, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
5	zm2k5bg9u1lzajrvfi0zgpto	plugin::content-manager.explorer.create	{}	api::global.global	{"fields": ["siteName", "favicon", "siteDescription", "defaultSeo.metaTitle", "defaultSeo.metaDescription", "defaultSeo.shareImage"]}	[]	2025-05-19 18:04:34.078	2025-05-19 18:04:34.078	2025-05-19 18:04:34.079	\N	\N	\N
208	lnpqn8jvlm453vi2gcrsrpok	plugin::content-manager.explorer.create	{}	api::customer.customer	{"fields": ["full_name", "dob", "phone_number", "address", "point", "orders"]}	[]	2025-05-21 16:16:00.127	2025-05-21 16:16:00.127	2025-05-21 16:16:00.134	\N	\N	\N
10	kqcy4nwfnmcieedan65pd9rz	plugin::content-manager.explorer.read	{}	api::global.global	{"fields": ["siteName", "favicon", "siteDescription", "defaultSeo.metaTitle", "defaultSeo.metaDescription", "defaultSeo.shareImage"]}	[]	2025-05-19 18:04:34.113	2025-05-19 18:04:34.113	2025-05-19 18:04:34.113	\N	\N	\N
210	tban7ikxbe7mx8j61g7qk27x	plugin::content-manager.explorer.read	{}	api::customer.customer	{"fields": ["full_name", "dob", "phone_number", "address", "point", "orders"]}	[]	2025-05-21 16:16:00.2	2025-05-21 16:16:00.2	2025-05-21 16:16:00.202	\N	\N	\N
15	a4zx7pt4vjp6axo7oat5zmdk	plugin::content-manager.explorer.update	{}	api::global.global	{"fields": ["siteName", "favicon", "siteDescription", "defaultSeo.metaTitle", "defaultSeo.metaDescription", "defaultSeo.shareImage"]}	[]	2025-05-19 18:04:34.147	2025-05-19 18:04:34.147	2025-05-19 18:04:34.148	\N	\N	\N
212	fs5orkracmu8a6shq98jjuws	plugin::content-manager.explorer.update	{}	api::customer.customer	{"fields": ["full_name", "dob", "phone_number", "address", "point", "orders"]}	[]	2025-05-21 16:16:00.234	2025-05-21 16:16:00.234	2025-05-21 16:16:00.235	\N	\N	\N
19	mwl09704226h8b4fn1swcq6m	plugin::content-manager.explorer.delete	{}	api::category.category	{}	[]	2025-05-19 18:04:34.171	2025-05-19 18:04:34.171	2025-05-19 18:04:34.171	\N	\N	\N
20	kdgn8uuesimec3xgco3saqhv	plugin::content-manager.explorer.delete	{}	api::global.global	{}	[]	2025-05-19 18:04:34.177	2025-05-19 18:04:34.177	2025-05-19 18:04:34.177	\N	\N	\N
214	k1kln72y08ch9m8t0evf1uv0	plugin::content-manager.explorer.delete	{}	api::order.order	{}	[]	2025-05-21 16:16:00.279	2025-05-21 16:16:00.279	2025-05-21 16:16:00.279	\N	\N	\N
24	ysowcrggu5m4ywyyvegtt4jw	plugin::content-manager.explorer.publish	{}	api::category.category	{}	[]	2025-05-19 18:04:34.206	2025-05-19 18:04:34.206	2025-05-19 18:04:34.206	\N	\N	\N
25	yytx7w0k83gn3fkszwvb5ftl	plugin::content-manager.explorer.publish	{}	api::global.global	{}	[]	2025-05-19 18:04:34.212	2025-05-19 18:04:34.212	2025-05-19 18:04:34.212	\N	\N	\N
26	hci4qf92i8mgovvnu7pyo2te	plugin::upload.read	{}	\N	{}	[]	2025-05-19 18:04:34.218	2025-05-19 18:04:34.218	2025-05-19 18:04:34.218	\N	\N	\N
27	h1mwvia7gapdp6vdg5ozseum	plugin::upload.configure-view	{}	\N	{}	[]	2025-05-19 18:04:34.224	2025-05-19 18:04:34.224	2025-05-19 18:04:34.224	\N	\N	\N
28	apyis8o5s6ecqx638zodni2z	plugin::upload.assets.create	{}	\N	{}	[]	2025-05-19 18:04:34.23	2025-05-19 18:04:34.23	2025-05-19 18:04:34.23	\N	\N	\N
29	juw34z0b9dm4nm9a8bqol6te	plugin::upload.assets.update	{}	\N	{}	[]	2025-05-19 18:04:34.235	2025-05-19 18:04:34.235	2025-05-19 18:04:34.235	\N	\N	\N
30	zgdg87ouywgoj75qxhblxall	plugin::upload.assets.download	{}	\N	{}	[]	2025-05-19 18:04:34.241	2025-05-19 18:04:34.241	2025-05-19 18:04:34.241	\N	\N	\N
31	fod3jbly1x7yja0yvxol2mri	plugin::upload.assets.copy-link	{}	\N	{}	[]	2025-05-19 18:04:34.248	2025-05-19 18:04:34.248	2025-05-19 18:04:34.248	\N	\N	\N
215	h81xesfopjo5xvca51iwop76	plugin::content-manager.explorer.publish	{}	api::order.order	{}	[]	2025-05-21 16:16:00.294	2025-05-21 16:16:00.294	2025-05-21 16:16:00.295	\N	\N	\N
36	q4fdsxg95su4lmueokd1b3wd	plugin::content-manager.explorer.create	{}	api::global.global	{"fields": ["siteName", "favicon", "siteDescription", "defaultSeo.metaTitle", "defaultSeo.metaDescription", "defaultSeo.shareImage"]}	["admin::is-creator"]	2025-05-19 18:04:34.293	2025-05-19 18:04:34.293	2025-05-19 18:04:34.293	\N	\N	\N
262	skbl9zln4w622szuwck78v5s	plugin::content-manager.explorer.delete	{}	api::service.service	{}	[]	2025-05-28 16:55:06.904	2025-05-28 16:55:06.904	2025-05-28 16:55:06.905	\N	\N	\N
263	tvl44dfdor516j5qkvqxcazh	plugin::content-manager.explorer.publish	{}	api::service.service	{}	[]	2025-05-28 16:55:06.92	2025-05-28 16:55:06.92	2025-05-28 16:55:06.921	\N	\N	\N
267	uevyfudl7e1ti6m3ygu67gi3	plugin::content-manager.explorer.create	{}	api::brand.brand	{"fields": ["name", "logo", "isHighlight", "categories", "slug", "hidden_name"]}	[]	2025-05-28 18:03:26.547	2025-05-28 18:03:26.547	2025-05-28 18:03:26.556	\N	\N	\N
9	jauohh39v0umhujn39v5meer	plugin::content-manager.explorer.read	{}	api::category.category	{"fields": ["name", "description", "slug"]}	[]	2025-05-19 18:04:34.106	2025-05-24 04:12:08.709	2025-05-19 18:04:34.106	\N	\N	\N
35	namdax5g0ku0t63ij4zmhg4k	plugin::content-manager.explorer.create	{}	api::category.category	{"fields": ["name", "description", "slug"]}	["admin::is-creator"]	2025-05-19 18:04:34.287	2025-05-24 04:12:08.709	2025-05-19 18:04:34.287	\N	\N	\N
14	jbl7y9wmpex3kz9tfwi2b194	plugin::content-manager.explorer.update	{}	api::category.category	{"fields": ["name", "description", "slug"]}	[]	2025-05-19 18:04:34.14	2025-05-24 04:12:08.709	2025-05-19 18:04:34.14	\N	\N	\N
4	rlpj5ej1i94v89vm8ck7rmb8	plugin::content-manager.explorer.create	{}	api::category.category	{"fields": ["name", "description", "slug"]}	[]	2025-05-19 18:04:34.072	2025-05-24 04:12:08.709	2025-05-19 18:04:34.072	\N	\N	\N
268	g65lbiqyjywk66blrk67otbc	plugin::content-manager.explorer.read	{}	api::brand.brand	{"fields": ["name", "logo", "isHighlight", "categories", "slug", "hidden_name"]}	[]	2025-05-28 18:03:26.578	2025-05-28 18:03:26.578	2025-05-28 18:03:26.578	\N	\N	\N
269	hc0hx8b7jjq0vu1q6p16h3we	plugin::content-manager.explorer.update	{}	api::brand.brand	{"fields": ["name", "logo", "isHighlight", "categories", "slug", "hidden_name"]}	[]	2025-05-28 18:03:26.593	2025-05-28 18:03:26.593	2025-05-28 18:03:26.594	\N	\N	\N
273	xclijci3o16im3chnrcoo04z	plugin::content-manager.explorer.delete	{}	api::banner.banner	{}	[]	2025-05-29 15:17:10.548	2025-05-29 15:17:10.548	2025-05-29 15:17:10.549	\N	\N	\N
274	f548o1i7gn802htx45vvpqng	plugin::content-manager.explorer.publish	{}	api::banner.banner	{}	[]	2025-05-29 15:17:10.56	2025-05-29 15:17:10.56	2025-05-29 15:17:10.561	\N	\N	\N
278	a4029g6uxfasz7dilhn6hahl	plugin::content-manager.explorer.create	{}	api::category.category	{"fields": ["name", "description", "brands", "slug", "image"]}	[]	2025-05-31 15:35:18.629	2025-05-31 15:35:18.629	2025-05-31 15:35:18.63	\N	\N	\N
279	ll3tddh37vuk5eckr3mx8scv	plugin::content-manager.explorer.read	{}	api::category.category	{"fields": ["name", "description", "brands", "slug", "image"]}	[]	2025-05-31 15:35:18.666	2025-05-31 15:35:18.666	2025-05-31 15:35:18.667	\N	\N	\N
280	uhv5dp4ubgp6ze8q0a6wfanh	plugin::content-manager.explorer.update	{}	api::category.category	{"fields": ["name", "description", "brands", "slug", "image"]}	[]	2025-05-31 15:35:18.675	2025-05-31 15:35:18.675	2025-05-31 15:35:18.676	\N	\N	\N
281	pekmtfm9bg3m51w07r8lujvo	plugin::config-sync.settings.read	{}	\N	{}	[]	2025-06-02 16:38:07.255	2025-06-02 16:38:07.255	2025-06-02 16:38:07.263	\N	\N	\N
282	cd6aoy2b1kdeyomitymeg132	plugin::config-sync.menu-link	{}	\N	{}	[]	2025-06-02 16:38:07.287	2025-06-02 16:38:07.287	2025-06-02 16:38:07.288	\N	\N	\N
41	h4nbe2gcmxgzpif8d3rzj29g	plugin::content-manager.explorer.read	{}	api::global.global	{"fields": ["siteName", "favicon", "siteDescription", "defaultSeo.metaTitle", "defaultSeo.metaDescription", "defaultSeo.shareImage"]}	["admin::is-creator"]	2025-05-19 18:04:34.326	2025-05-19 18:04:34.326	2025-05-19 18:04:34.326	\N	\N	\N
46	x4l7bing2y5iwpweqeabn9ba	plugin::content-manager.explorer.update	{}	api::global.global	{"fields": ["siteName", "favicon", "siteDescription", "defaultSeo.metaTitle", "defaultSeo.metaDescription", "defaultSeo.shareImage"]}	["admin::is-creator"]	2025-05-19 18:04:34.363	2025-05-19 18:04:34.363	2025-05-19 18:04:34.364	\N	\N	\N
206	z458lf9wepp78joarkuenhtp	plugin::content-manager.explorer.delete	{}	api::customer.customer	{}	[]	2025-05-20 18:26:29.739	2025-05-20 18:26:29.739	2025-05-20 18:26:29.74	\N	\N	\N
207	faghy84yyiabilfxjmnth5ie	plugin::content-manager.explorer.publish	{}	api::customer.customer	{}	[]	2025-05-20 18:26:29.755	2025-05-20 18:26:29.755	2025-05-20 18:26:29.757	\N	\N	\N
50	drwr20nexnjn7skewgb14rp9	plugin::content-manager.explorer.delete	{}	api::category.category	{}	["admin::is-creator"]	2025-05-19 18:04:34.393	2025-05-19 18:04:34.393	2025-05-19 18:04:34.393	\N	\N	\N
51	sfeynj3cobdrpnhp5qmifj5r	plugin::content-manager.explorer.delete	{}	api::global.global	{}	["admin::is-creator"]	2025-05-19 18:04:34.399	2025-05-19 18:04:34.399	2025-05-19 18:04:34.399	\N	\N	\N
52	j58hy8jr0s6ru3swzsf8iu26	plugin::upload.read	{}	\N	{}	["admin::is-creator"]	2025-05-19 18:04:34.405	2025-05-19 18:04:34.405	2025-05-19 18:04:34.405	\N	\N	\N
53	zmh44ciuxsc2hcx0evg6c1e2	plugin::upload.configure-view	{}	\N	{}	[]	2025-05-19 18:04:34.411	2025-05-19 18:04:34.411	2025-05-19 18:04:34.411	\N	\N	\N
54	dfg3ow5yuvans3gngeziyhu3	plugin::upload.assets.create	{}	\N	{}	[]	2025-05-19 18:04:34.417	2025-05-19 18:04:34.417	2025-05-19 18:04:34.417	\N	\N	\N
55	wmz2tx8k2jik2jo9vt0tgwjq	plugin::upload.assets.update	{}	\N	{}	["admin::is-creator"]	2025-05-19 18:04:34.423	2025-05-19 18:04:34.423	2025-05-19 18:04:34.423	\N	\N	\N
56	yith1bv87f98p8iv8atbgwhs	plugin::upload.assets.download	{}	\N	{}	[]	2025-05-19 18:04:34.429	2025-05-19 18:04:34.429	2025-05-19 18:04:34.429	\N	\N	\N
57	l9nfl2p6q4isd73ej1nz93nn	plugin::upload.assets.copy-link	{}	\N	{}	[]	2025-05-19 18:04:34.435	2025-05-19 18:04:34.435	2025-05-19 18:04:34.435	\N	\N	\N
58	t7mu9ha4bm48k2vap7pjwn0k	plugin::content-manager.explorer.create	{}	plugin::users-permissions.user	{"fields": ["username", "email", "provider", "password", "resetPasswordToken", "confirmationToken", "confirmed", "blocked", "role"]}	[]	2025-05-19 18:04:34.502	2025-05-19 18:04:34.502	2025-05-19 18:04:34.505	\N	\N	\N
216	zr59eu2no2etvzotnuyko32m	plugin::content-manager.explorer.create	{}	api::order.order	{"fields": ["customer", "shipping_fee", "point", "order_items"]}	[]	2025-05-21 16:20:29.572	2025-05-21 16:20:29.572	2025-05-21 16:20:29.579	\N	\N	\N
217	dl9gjgied3l2lh7vjeyy0a3l	plugin::content-manager.explorer.create	{}	api::order-item.order-item	{"fields": ["order", "variant", "quantity"]}	[]	2025-05-21 16:20:29.594	2025-05-21 16:20:29.594	2025-05-21 16:20:29.594	\N	\N	\N
218	omhmxwwfjtznnfpz8h0tbsb5	plugin::content-manager.explorer.create	{}	api::variant.variant	{"fields": ["variant_option", "variant_value", "variant_image", "quantity", "product", "base_price", "sale_price", "SKU", "order_items"]}	[]	2025-05-21 16:20:29.603	2025-05-21 16:20:29.603	2025-05-21 16:20:29.603	\N	\N	\N
63	zty0sspzcrhhn0hbttq7nl51	plugin::content-manager.explorer.create	{}	api::global.global	{"fields": ["siteName", "favicon", "siteDescription", "defaultSeo.metaTitle", "defaultSeo.metaDescription", "defaultSeo.shareImage"]}	[]	2025-05-19 18:04:34.54	2025-05-19 18:04:34.54	2025-05-19 18:04:34.54	\N	\N	\N
64	x4yk0bsufm3y60opnm2miqvc	plugin::content-manager.explorer.read	{}	plugin::users-permissions.user	{"fields": ["username", "email", "provider", "password", "resetPasswordToken", "confirmationToken", "confirmed", "blocked", "role"]}	[]	2025-05-19 18:04:34.546	2025-05-19 18:04:34.546	2025-05-19 18:04:34.546	\N	\N	\N
219	szraf5g28maxsklidyo4vary	plugin::content-manager.explorer.read	{}	api::order.order	{"fields": ["customer", "shipping_fee", "point", "order_items"]}	[]	2025-05-21 16:20:29.611	2025-05-21 16:20:29.611	2025-05-21 16:20:29.611	\N	\N	\N
220	x0zfogh8qb9b6m5lg3y637h2	plugin::content-manager.explorer.read	{}	api::order-item.order-item	{"fields": ["order", "variant", "quantity"]}	[]	2025-05-21 16:20:29.626	2025-05-21 16:20:29.626	2025-05-21 16:20:29.627	\N	\N	\N
221	s5322jw6vvqf1m05xih8eypb	plugin::content-manager.explorer.read	{}	api::variant.variant	{"fields": ["variant_option", "variant_value", "variant_image", "quantity", "product", "base_price", "sale_price", "SKU", "order_items"]}	[]	2025-05-21 16:20:29.65	2025-05-21 16:20:29.65	2025-05-21 16:20:29.653	\N	\N	\N
69	esl460agan0nm6silwxahafn	plugin::content-manager.explorer.read	{}	api::global.global	{"fields": ["siteName", "favicon", "siteDescription", "defaultSeo.metaTitle", "defaultSeo.metaDescription", "defaultSeo.shareImage"]}	[]	2025-05-19 18:04:34.574	2025-05-19 18:04:34.574	2025-05-19 18:04:34.574	\N	\N	\N
70	zi1pdkytvcpe7km3agsayudv	plugin::content-manager.explorer.update	{}	plugin::users-permissions.user	{"fields": ["username", "email", "provider", "password", "resetPasswordToken", "confirmationToken", "confirmed", "blocked", "role"]}	[]	2025-05-19 18:04:34.579	2025-05-19 18:04:34.579	2025-05-19 18:04:34.58	\N	\N	\N
222	fodee0kopycefb1n2dc5ts9s	plugin::content-manager.explorer.update	{}	api::order.order	{"fields": ["customer", "shipping_fee", "point", "order_items"]}	[]	2025-05-21 16:20:29.664	2025-05-21 16:20:29.664	2025-05-21 16:20:29.665	\N	\N	\N
223	ayze51b3kt0cwxv1aq42aus3	plugin::content-manager.explorer.update	{}	api::order-item.order-item	{"fields": ["order", "variant", "quantity"]}	[]	2025-05-21 16:20:29.676	2025-05-21 16:20:29.676	2025-05-21 16:20:29.676	\N	\N	\N
224	kb4yowvjvjqug3g5473bme1a	plugin::content-manager.explorer.update	{}	api::variant.variant	{"fields": ["variant_option", "variant_value", "variant_image", "quantity", "product", "base_price", "sale_price", "SKU", "order_items"]}	[]	2025-05-21 16:20:29.686	2025-05-21 16:20:29.686	2025-05-21 16:20:29.686	\N	\N	\N
225	lutjwh7k60ca6dssr8wpo192	plugin::content-manager.explorer.delete	{}	api::order-item.order-item	{}	[]	2025-05-21 16:20:29.693	2025-05-21 16:20:29.693	2025-05-21 16:20:29.694	\N	\N	\N
226	bcyw1oq4ve7wgebpi9thmqxz	plugin::content-manager.explorer.publish	{}	api::order-item.order-item	{}	[]	2025-05-21 16:20:29.701	2025-05-21 16:20:29.701	2025-05-21 16:20:29.701	\N	\N	\N
45	ttqm87va3y3aid15663102pk	plugin::content-manager.explorer.update	{}	api::category.category	{"fields": ["name", "description", "slug"]}	["admin::is-creator"]	2025-05-19 18:04:34.356	2025-05-24 04:12:08.709	2025-05-19 18:04:34.356	\N	\N	\N
264	g82653r575ktzv5uozm4ivut	plugin::content-manager.explorer.create	{}	api::service.service	{"fields": ["price", "title", "description", "number_booking", "images"]}	[]	2025-05-28 16:59:50.435	2025-05-28 16:59:50.435	2025-05-28 16:59:50.437	\N	\N	\N
40	ysuyv0q80wicsuw16r5gx6eb	plugin::content-manager.explorer.read	{}	api::category.category	{"fields": ["name", "description", "slug"]}	["admin::is-creator"]	2025-05-19 18:04:34.319	2025-05-24 04:12:08.709	2025-05-19 18:04:34.319	\N	\N	\N
75	sg0ctjy0uxtvjn12u9w4phjx	plugin::content-manager.explorer.update	{}	api::global.global	{"fields": ["siteName", "favicon", "siteDescription", "defaultSeo.metaTitle", "defaultSeo.metaDescription", "defaultSeo.shareImage"]}	[]	2025-05-19 18:04:34.614	2025-05-19 18:04:34.614	2025-05-19 18:04:34.614	\N	\N	\N
76	omz5hjunpjo7sl6923v5fwb4	plugin::content-manager.explorer.delete	{}	plugin::users-permissions.user	{}	[]	2025-05-19 18:04:34.62	2025-05-19 18:04:34.62	2025-05-19 18:04:34.62	\N	\N	\N
80	kqx9v28wzggtj6ecjxei4uhd	plugin::content-manager.explorer.delete	{}	api::category.category	{}	[]	2025-05-19 18:04:34.661	2025-05-19 18:04:34.661	2025-05-19 18:04:34.662	\N	\N	\N
81	ly2azhjfr3exkxaw4392oz4v	plugin::content-manager.explorer.delete	{}	api::global.global	{}	[]	2025-05-19 18:04:34.672	2025-05-19 18:04:34.672	2025-05-19 18:04:34.672	\N	\N	\N
82	r9fy8q53pufco3z0eq2psay5	plugin::content-manager.explorer.publish	{}	plugin::users-permissions.user	{}	[]	2025-05-19 18:04:34.685	2025-05-19 18:04:34.685	2025-05-19 18:04:34.686	\N	\N	\N
251	jrtuio0dr0vfjkb2ap2ufgs1	plugin::content-manager.explorer.create	{}	api::product-list-block.product-list-block	{"fields": ["index", "products", "title"]}	[]	2025-05-24 14:40:02.017	2025-05-24 14:40:02.017	2025-05-24 14:40:02.019	\N	\N	\N
252	v616r7ez74xf4f9wfutmfo1a	plugin::content-manager.explorer.read	{}	api::product-list-block.product-list-block	{"fields": ["index", "products", "title"]}	[]	2025-05-24 14:40:02.038	2025-05-24 14:40:02.038	2025-05-24 14:40:02.038	\N	\N	\N
86	ae1zzpmhe2jx5f2nbgijh73o	plugin::content-manager.explorer.publish	{}	api::category.category	{}	[]	2025-05-19 18:04:34.754	2025-05-19 18:04:34.754	2025-05-19 18:04:34.754	\N	\N	\N
87	amd09jad5lzoosiqv64vu6iv	plugin::content-manager.explorer.publish	{}	api::global.global	{}	[]	2025-05-19 18:04:34.761	2025-05-19 18:04:34.761	2025-05-19 18:04:34.761	\N	\N	\N
88	c0j8c6l2y3fc01xa3t93f4kg	plugin::content-manager.single-types.configure-view	{}	\N	{}	[]	2025-05-19 18:04:34.768	2025-05-19 18:04:34.768	2025-05-19 18:04:34.768	\N	\N	\N
89	bpcg584ca4g95kxbmvskw98l	plugin::content-manager.collection-types.configure-view	{}	\N	{}	[]	2025-05-19 18:04:34.775	2025-05-19 18:04:34.775	2025-05-19 18:04:34.775	\N	\N	\N
90	y2tvl2btyagztmhlrrkt4sbo	plugin::content-manager.components.configure-layout	{}	\N	{}	[]	2025-05-19 18:04:34.782	2025-05-19 18:04:34.782	2025-05-19 18:04:34.782	\N	\N	\N
91	qtbt2dgiljo2hfhjq6bjksyu	plugin::content-type-builder.read	{}	\N	{}	[]	2025-05-19 18:04:34.788	2025-05-19 18:04:34.788	2025-05-19 18:04:34.789	\N	\N	\N
92	z6hybace4q16n7l4y01aol2w	plugin::email.settings.read	{}	\N	{}	[]	2025-05-19 18:04:34.795	2025-05-19 18:04:34.795	2025-05-19 18:04:34.795	\N	\N	\N
93	tr8qqgyshkla57yhvkdsx672	plugin::upload.read	{}	\N	{}	[]	2025-05-19 18:04:34.803	2025-05-19 18:04:34.803	2025-05-19 18:04:34.803	\N	\N	\N
94	om6c0j4yps3ylayra5mx03bj	plugin::upload.assets.create	{}	\N	{}	[]	2025-05-19 18:04:34.808	2025-05-19 18:04:34.808	2025-05-19 18:04:34.809	\N	\N	\N
95	eg8g0603ev5mdrvjs27nqc2x	plugin::upload.assets.update	{}	\N	{}	[]	2025-05-19 18:04:34.814	2025-05-19 18:04:34.814	2025-05-19 18:04:34.814	\N	\N	\N
96	y2m51c4vdau8qzh54udr721t	plugin::upload.assets.download	{}	\N	{}	[]	2025-05-19 18:04:34.822	2025-05-19 18:04:34.822	2025-05-19 18:04:34.822	\N	\N	\N
97	hjqmjts5tkzuz068k7t9i717	plugin::upload.assets.copy-link	{}	\N	{}	[]	2025-05-19 18:04:34.828	2025-05-19 18:04:34.828	2025-05-19 18:04:34.828	\N	\N	\N
98	zp8hlp4j46x41qqwob2v353q	plugin::upload.configure-view	{}	\N	{}	[]	2025-05-19 18:04:34.835	2025-05-19 18:04:34.835	2025-05-19 18:04:34.835	\N	\N	\N
99	vdqaorg3g85dkmjpx17i5htm	plugin::upload.settings.read	{}	\N	{}	[]	2025-05-19 18:04:34.841	2025-05-19 18:04:34.841	2025-05-19 18:04:34.841	\N	\N	\N
100	ouixoxzucuxrhb0zzz4siw44	plugin::i18n.locale.create	{}	\N	{}	[]	2025-05-19 18:04:34.858	2025-05-19 18:04:34.858	2025-05-19 18:04:34.858	\N	\N	\N
101	vots5gu96kw4ggqtktiu82jd	plugin::i18n.locale.read	{}	\N	{}	[]	2025-05-19 18:04:34.874	2025-05-19 18:04:34.874	2025-05-19 18:04:34.874	\N	\N	\N
102	gf1afk0b1z6khy8bgneavra4	plugin::i18n.locale.update	{}	\N	{}	[]	2025-05-19 18:04:34.882	2025-05-19 18:04:34.882	2025-05-19 18:04:34.884	\N	\N	\N
103	e29u7hr9s7kbu082qgzf8kcv	plugin::i18n.locale.delete	{}	\N	{}	[]	2025-05-19 18:04:34.899	2025-05-19 18:04:34.899	2025-05-19 18:04:34.9	\N	\N	\N
104	lspyqprqb7eimq97wb1vp0uy	plugin::users-permissions.roles.create	{}	\N	{}	[]	2025-05-19 18:04:34.908	2025-05-19 18:04:34.908	2025-05-19 18:04:34.908	\N	\N	\N
105	az1f4ox5ru6jupwyzy8ktxst	plugin::users-permissions.roles.read	{}	\N	{}	[]	2025-05-19 18:04:34.916	2025-05-19 18:04:34.916	2025-05-19 18:04:34.916	\N	\N	\N
106	wzfg8vcv08si1jab8gg7amqn	plugin::users-permissions.roles.update	{}	\N	{}	[]	2025-05-19 18:04:34.923	2025-05-19 18:04:34.923	2025-05-19 18:04:34.923	\N	\N	\N
107	bgieq2o6c2rzgnjihmw6tu1w	plugin::users-permissions.roles.delete	{}	\N	{}	[]	2025-05-19 18:04:34.93	2025-05-19 18:04:34.93	2025-05-19 18:04:34.93	\N	\N	\N
108	j2rlllb6r1b12rhcunc1ej0w	plugin::users-permissions.providers.read	{}	\N	{}	[]	2025-05-19 18:04:34.937	2025-05-19 18:04:34.937	2025-05-19 18:04:34.937	\N	\N	\N
109	d3ti6nwl4yvjqlajbfsd3lmi	plugin::users-permissions.providers.update	{}	\N	{}	[]	2025-05-19 18:04:34.944	2025-05-19 18:04:34.944	2025-05-19 18:04:34.944	\N	\N	\N
110	wjie86mvmhkrz1el2ra5qjqo	plugin::users-permissions.email-templates.read	{}	\N	{}	[]	2025-05-19 18:04:34.953	2025-05-19 18:04:34.953	2025-05-19 18:04:34.953	\N	\N	\N
111	lskytnh3669amdy9yxb1yl8h	plugin::users-permissions.email-templates.update	{}	\N	{}	[]	2025-05-19 18:04:34.96	2025-05-19 18:04:34.96	2025-05-19 18:04:34.96	\N	\N	\N
112	kttlyprxqdxaaun68moyg5ns	plugin::users-permissions.advanced-settings.read	{}	\N	{}	[]	2025-05-19 18:04:34.967	2025-05-19 18:04:34.967	2025-05-19 18:04:34.967	\N	\N	\N
113	v2jq4kq02j60z3j7mgua7l2p	plugin::users-permissions.advanced-settings.update	{}	\N	{}	[]	2025-05-19 18:04:34.975	2025-05-19 18:04:34.975	2025-05-19 18:04:34.975	\N	\N	\N
114	griqqfdkxx3vync00j5irkpl	admin::marketplace.read	{}	\N	{}	[]	2025-05-19 18:04:34.982	2025-05-19 18:04:34.982	2025-05-19 18:04:34.982	\N	\N	\N
115	bmfzbidimxo1y736ho7ae6hf	admin::webhooks.create	{}	\N	{}	[]	2025-05-19 18:04:34.989	2025-05-19 18:04:34.989	2025-05-19 18:04:34.989	\N	\N	\N
116	jyvl9h90ua8s05x83di2dfq3	admin::webhooks.read	{}	\N	{}	[]	2025-05-19 18:04:34.997	2025-05-19 18:04:34.997	2025-05-19 18:04:34.997	\N	\N	\N
117	e4cd6i4jvhjgnf1tjsosp39x	admin::webhooks.update	{}	\N	{}	[]	2025-05-19 18:04:35.005	2025-05-19 18:04:35.005	2025-05-19 18:04:35.006	\N	\N	\N
118	acm06iu4yhcn2ltmdxtgkdhd	admin::webhooks.delete	{}	\N	{}	[]	2025-05-19 18:04:35.014	2025-05-19 18:04:35.014	2025-05-19 18:04:35.014	\N	\N	\N
119	oo9uhibsb6zc0bolytpf2m8z	admin::users.create	{}	\N	{}	[]	2025-05-19 18:04:35.022	2025-05-19 18:04:35.022	2025-05-19 18:04:35.022	\N	\N	\N
120	yw5zuwziou70b0ke8wtylghl	admin::users.read	{}	\N	{}	[]	2025-05-19 18:04:35.028	2025-05-19 18:04:35.028	2025-05-19 18:04:35.028	\N	\N	\N
121	tnac4m3txg4kx95vf7iww4mm	admin::users.update	{}	\N	{}	[]	2025-05-19 18:04:35.034	2025-05-19 18:04:35.034	2025-05-19 18:04:35.034	\N	\N	\N
122	nc76gvbrw8x1ex64ltos0zqr	admin::users.delete	{}	\N	{}	[]	2025-05-19 18:04:35.04	2025-05-19 18:04:35.04	2025-05-19 18:04:35.041	\N	\N	\N
123	bl5dcmqyulv7kvz9jtyxfo2t	admin::roles.create	{}	\N	{}	[]	2025-05-19 18:04:35.047	2025-05-19 18:04:35.047	2025-05-19 18:04:35.047	\N	\N	\N
124	gvu2m7q1mfh4tvs3krhbe48s	admin::roles.read	{}	\N	{}	[]	2025-05-19 18:04:35.056	2025-05-19 18:04:35.056	2025-05-19 18:04:35.056	\N	\N	\N
125	segi1oip7ak9ykug0od5zu8a	admin::roles.update	{}	\N	{}	[]	2025-05-19 18:04:35.062	2025-05-19 18:04:35.062	2025-05-19 18:04:35.062	\N	\N	\N
126	fv894fumihk6bn567ijik1hj	admin::roles.delete	{}	\N	{}	[]	2025-05-19 18:04:35.068	2025-05-19 18:04:35.068	2025-05-19 18:04:35.068	\N	\N	\N
127	b8fltry80kw7f96zbdhvweqw	admin::api-tokens.access	{}	\N	{}	[]	2025-05-19 18:04:35.078	2025-05-19 18:04:35.078	2025-05-19 18:04:35.078	\N	\N	\N
253	xcs3dl9cx0n1yk9sxdl1ndk3	plugin::content-manager.explorer.update	{}	api::product-list-block.product-list-block	{"fields": ["index", "products", "title"]}	[]	2025-05-24 14:40:02.05	2025-05-24 14:40:02.05	2025-05-24 14:40:02.051	\N	\N	\N
254	ydq909ejxc92ksjr2e6n3bhj	plugin::content-manager.explorer.delete	{}	api::product-list-block.product-list-block	{}	[]	2025-05-24 14:40:02.066	2025-05-24 14:40:02.066	2025-05-24 14:40:02.068	\N	\N	\N
255	q1erigvbyds9ttuttfjnl9dg	plugin::content-manager.explorer.publish	{}	api::product-list-block.product-list-block	{}	[]	2025-05-24 14:40:02.087	2025-05-24 14:40:02.087	2025-05-24 14:40:02.089	\N	\N	\N
128	s4feq0rhk19abc625pu1y1cv	admin::api-tokens.create	{}	\N	{}	[]	2025-05-19 18:04:35.084	2025-05-19 18:04:35.084	2025-05-19 18:04:35.084	\N	\N	\N
129	bncnvs56wgivmt1kx02n8gij	admin::api-tokens.read	{}	\N	{}	[]	2025-05-19 18:04:35.091	2025-05-19 18:04:35.091	2025-05-19 18:04:35.091	\N	\N	\N
130	lmksbak8g7kbxx45qrxjvh6i	admin::api-tokens.update	{}	\N	{}	[]	2025-05-19 18:04:35.099	2025-05-19 18:04:35.099	2025-05-19 18:04:35.099	\N	\N	\N
131	kpfwxv3uuw6luhcql23r6n40	admin::api-tokens.regenerate	{}	\N	{}	[]	2025-05-19 18:04:35.105	2025-05-19 18:04:35.105	2025-05-19 18:04:35.105	\N	\N	\N
132	qthpvpbidvanxa3ybasnx64q	admin::api-tokens.delete	{}	\N	{}	[]	2025-05-19 18:04:35.112	2025-05-19 18:04:35.112	2025-05-19 18:04:35.113	\N	\N	\N
133	seopzdg9r056m1of8659u17j	admin::project-settings.update	{}	\N	{}	[]	2025-05-19 18:04:35.119	2025-05-19 18:04:35.119	2025-05-19 18:04:35.119	\N	\N	\N
134	a5dfdgwwnw5m7ydz7qebbk1a	admin::project-settings.read	{}	\N	{}	[]	2025-05-19 18:04:35.124	2025-05-19 18:04:35.124	2025-05-19 18:04:35.125	\N	\N	\N
135	rwk97levgkahdkdopa3tofn5	admin::transfer.tokens.access	{}	\N	{}	[]	2025-05-19 18:04:35.13	2025-05-19 18:04:35.13	2025-05-19 18:04:35.13	\N	\N	\N
136	mi8ntcq4etihuavodfkougfy	admin::transfer.tokens.create	{}	\N	{}	[]	2025-05-19 18:04:35.136	2025-05-19 18:04:35.136	2025-05-19 18:04:35.136	\N	\N	\N
137	jkv7zbsi9p3lyrz3p6mnaf2y	admin::transfer.tokens.read	{}	\N	{}	[]	2025-05-19 18:04:35.142	2025-05-19 18:04:35.142	2025-05-19 18:04:35.142	\N	\N	\N
138	oo8ll8l8fnym0tli76h3zqqu	admin::transfer.tokens.update	{}	\N	{}	[]	2025-05-19 18:04:35.147	2025-05-19 18:04:35.147	2025-05-19 18:04:35.147	\N	\N	\N
139	ofl5olmdm233v7hmmppf6a00	admin::transfer.tokens.regenerate	{}	\N	{}	[]	2025-05-19 18:04:35.155	2025-05-19 18:04:35.155	2025-05-19 18:04:35.155	\N	\N	\N
140	lnz1cquulcv3fqjyv00ej3om	admin::transfer.tokens.delete	{}	\N	{}	[]	2025-05-19 18:04:35.162	2025-05-19 18:04:35.162	2025-05-19 18:04:35.162	\N	\N	\N
144	h7lzi6cqg65nvva7awqiqe9e	plugin::content-manager.explorer.delete	{}	api::brand.brand	{}	[]	2025-05-19 18:13:00.341	2025-05-19 18:13:00.341	2025-05-19 18:13:00.342	\N	\N	\N
145	rgpwtvsr01eqai8nogl6wie8	plugin::content-manager.explorer.publish	{}	api::brand.brand	{}	[]	2025-05-19 18:13:00.362	2025-05-19 18:13:00.362	2025-05-19 18:13:00.364	\N	\N	\N
256	tut5gtn4t4wp9139pdjxx5rc	plugin::content-manager.explorer.create	{}	api::product.product	{"fields": ["name", "short_description", "media", "brand", "category", "variants", "sold_quantity", "slug", "detail_description"]}	[]	2025-05-24 14:53:47.518	2025-05-24 14:53:47.518	2025-05-24 14:53:47.534	\N	\N	\N
257	ucl2wdy2lzc8xa56crl3mno2	plugin::content-manager.explorer.read	{}	api::product.product	{"fields": ["name", "short_description", "media", "brand", "category", "variants", "sold_quantity", "slug", "detail_description"]}	[]	2025-05-24 14:53:47.553	2025-05-24 14:53:47.553	2025-05-24 14:53:47.553	\N	\N	\N
258	zh6na2v8i69e6iqipa5o4k3e	plugin::content-manager.explorer.update	{}	api::product.product	{"fields": ["name", "short_description", "media", "brand", "category", "variants", "sold_quantity", "slug", "detail_description"]}	[]	2025-05-24 14:53:47.563	2025-05-24 14:53:47.563	2025-05-24 14:53:47.564	\N	\N	\N
265	qdnygoh68dllocjba0mifl8r	plugin::content-manager.explorer.read	{}	api::service.service	{"fields": ["price", "title", "description", "number_booking", "images"]}	[]	2025-05-28 16:59:50.455	2025-05-28 16:59:50.455	2025-05-28 16:59:50.455	\N	\N	\N
266	dszhbnj25rh5avz3voad2t53	plugin::content-manager.explorer.update	{}	api::service.service	{"fields": ["price", "title", "description", "number_booking", "images"]}	[]	2025-05-28 16:59:50.464	2025-05-28 16:59:50.464	2025-05-28 16:59:50.465	\N	\N	\N
154	ccmah5jihcdr3sqh28aoij4s	plugin::content-manager.explorer.delete	{}	api::product.product	{}	[]	2025-05-19 18:59:30.939	2025-05-19 18:59:30.939	2025-05-19 18:59:30.94	\N	\N	\N
155	gntxipt7kn0fuqs33r5k7dtm	plugin::content-manager.explorer.publish	{}	api::product.product	{}	[]	2025-05-19 18:59:30.962	2025-05-19 18:59:30.962	2025-05-19 18:59:30.963	\N	\N	\N
275	hbvblug0twalnhpd23fqdn4b	plugin::content-manager.explorer.create	{}	api::banner.banner	{"fields": ["image", "index"]}	[]	2025-05-29 15:22:19.608	2025-05-29 15:22:19.608	2025-05-29 15:22:19.615	\N	\N	\N
276	n291k1p6x3jurxvgxfj3ciw7	plugin::content-manager.explorer.read	{}	api::banner.banner	{"fields": ["image", "index"]}	[]	2025-05-29 15:22:19.638	2025-05-29 15:22:19.638	2025-05-29 15:22:19.639	\N	\N	\N
277	jrtacyb60yzoocyu1tnwew88	plugin::content-manager.explorer.update	{}	api::banner.banner	{"fields": ["image", "index"]}	[]	2025-05-29 15:22:19.65	2025-05-29 15:22:19.65	2025-05-29 15:22:19.651	\N	\N	\N
174	eazwg66y3mun9u6huarw5g5q	plugin::content-manager.explorer.delete	{}	api::variant.variant	{}	[]	2025-05-20 15:12:40.402	2025-05-20 15:12:40.402	2025-05-20 15:12:40.403	\N	\N	\N
175	cr2kiyk6z4uefsj3vgph35cf	plugin::content-manager.explorer.publish	{}	api::variant.variant	{}	[]	2025-05-20 15:12:40.414	2025-05-20 15:12:40.414	2025-05-20 15:12:40.415	\N	\N	\N
\.


--
-- Data for Name: admin_permissions_role_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.admin_permissions_role_lnk (id, permission_id, role_id, permission_ord) FROM stdin;
216	216	1	143
217	217	1	144
4	4	2	4
5	5	2	5
218	218	1	145
219	219	1	146
9	9	2	9
10	10	2	10
220	220	1	147
221	221	1	148
14	14	2	14
15	15	2	15
222	222	1	149
223	223	1	150
19	19	2	19
20	20	2	20
224	224	1	151
225	225	1	152
24	24	2	24
25	25	2	25
26	26	2	26
27	27	2	27
28	28	2	28
29	29	2	29
30	30	2	30
31	31	2	31
226	226	1	153
35	35	3	4
36	36	3	5
40	40	3	9
41	41	3	10
45	45	3	14
46	46	3	15
50	50	3	19
51	51	3	20
52	52	3	21
53	53	3	22
54	54	3	23
55	55	3	24
56	56	3	25
57	57	3	26
58	58	1	1
63	63	1	6
64	64	1	7
69	69	1	12
70	70	1	13
251	251	1	172
75	75	1	18
76	76	1	19
252	252	1	173
253	253	1	174
80	80	1	23
81	81	1	24
82	82	1	25
254	254	1	175
255	255	1	176
86	86	1	29
87	87	1	30
88	88	1	31
89	89	1	32
90	90	1	33
91	91	1	34
92	92	1	35
93	93	1	36
94	94	1	37
95	95	1	38
96	96	1	39
97	97	1	40
98	98	1	41
99	99	1	42
100	100	1	43
101	101	1	44
102	102	1	45
103	103	1	46
104	104	1	47
105	105	1	48
106	106	1	49
107	107	1	50
108	108	1	51
109	109	1	52
110	110	1	53
111	111	1	54
112	112	1	55
113	113	1	56
114	114	1	57
115	115	1	58
116	116	1	59
117	117	1	60
118	118	1	61
119	119	1	62
120	120	1	63
121	121	1	64
122	122	1	65
123	123	1	66
124	124	1	67
125	125	1	68
126	126	1	69
127	127	1	70
128	128	1	71
129	129	1	72
130	130	1	73
131	131	1	74
132	132	1	75
133	133	1	76
134	134	1	77
135	135	1	78
136	136	1	79
137	137	1	80
138	138	1	81
139	139	1	82
140	140	1	83
144	144	1	87
145	145	1	88
262	262	1	183
263	263	1	184
267	267	1	188
268	268	1	189
269	269	1	190
154	154	1	97
155	155	1	98
273	273	1	194
274	274	1	195
278	278	1	199
279	279	1	200
280	280	1	201
281	281	1	202
282	282	1	203
256	256	1	177
257	257	1	178
258	258	1	179
264	264	1	185
265	265	1	186
266	266	1	187
275	275	1	196
174	174	1	102
175	175	1	103
276	276	1	197
277	277	1	198
206	206	1	133
207	207	1	134
208	208	1	135
210	210	1	137
212	212	1	139
214	214	1	141
215	215	1	142
\.


--
-- Data for Name: admin_roles; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.admin_roles (id, document_id, name, code, description, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
1	rn1skon1zfq741tk43ybs9o0	Super Admin	strapi-super-admin	Super Admins can access and manage all features and settings.	2025-05-19 18:04:33.991	2025-05-19 18:04:33.991	2025-05-19 18:04:33.992	\N	\N	\N
2	ntb5ctpwbfsi7ujri0zlws3f	Editor	strapi-editor	Editors can manage and publish contents including those of other users.	2025-05-19 18:04:34.009	2025-05-19 18:04:34.009	2025-05-19 18:04:34.01	\N	\N	\N
3	os9zte51qfa8c1q0errub037	Author	strapi-author	Authors can manage the content they have created.	2025-05-19 18:04:34.016	2025-05-19 18:04:34.016	2025-05-19 18:04:34.017	\N	\N	\N
\.


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.admin_users (id, document_id, firstname, lastname, username, email, password, reset_password_token, registration_token, is_active, blocked, prefered_language, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
1	xj5md1bzhxg668j0nvcgahjx	Dinh	Anh	\N	gnoud17.thng@gmail.com	$2a$10$xbuwskvnrnxiZ31q1VSIhOJh7/gt48ovfTk/npSAM87Gekqq.GShG	\N	\N	t	f	\N	2025-05-19 18:10:06.626	2025-05-19 18:10:06.626	2025-05-19 18:10:06.627	\N	\N	\N
\.


--
-- Data for Name: admin_users_roles_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.admin_users_roles_lnk (id, user_id, role_id, role_ord, user_ord) FROM stdin;
1	1	1	1	1
\.


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.banners (id, document_id, created_at, updated_at, published_at, created_by_id, updated_by_id, locale, index) FROM stdin;
1	ib3v69gqhs99n98ye1jwg2hf	2025-05-29 15:31:02.074	2025-05-29 15:31:02.074	\N	1	1	\N	1
2	ib3v69gqhs99n98ye1jwg2hf	2025-05-29 15:31:02.074	2025-05-29 15:31:02.074	2025-05-29 15:31:02.188	1	1	\N	1
3	ltxyudyvfjg6l626hflpqvig	2025-05-29 15:31:24.029	2025-05-29 15:31:24.029	\N	1	1	\N	2
4	ltxyudyvfjg6l626hflpqvig	2025-05-29 15:31:24.029	2025-05-29 15:31:24.029	2025-05-29 15:31:24.063	1	1	\N	2
5	geq1p6udz22dxaonfkqvouic	2025-05-29 15:31:43.379	2025-05-29 15:31:43.379	\N	1	1	\N	3
6	geq1p6udz22dxaonfkqvouic	2025-05-29 15:31:43.379	2025-05-29 15:31:43.379	2025-05-29 15:31:43.413	1	1	\N	3
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.brands (id, document_id, name, is_highlight, created_at, updated_at, published_at, created_by_id, updated_by_id, locale, slug, hidden_name) FROM stdin;
14	flzcyemchcu5ahjdap0rfm81	bdias	t	2025-05-21 18:54:39.054	2025-05-24 04:12:39.087	\N	1	1	\N	bdias	\N
22	flzcyemchcu5ahjdap0rfm81	bdias	t	2025-05-21 18:54:39.054	2025-05-24 04:12:39.087	2025-05-24 04:12:39.144	1	1	\N	bdias	\N
6	gap9e4kfrlm862lg8ohi64tw	dbhsj đạkas	t	2025-05-21 18:45:43.226	2025-05-24 04:13:03.183	\N	1	1	\N	dbhsj-dakas	\N
23	gap9e4kfrlm862lg8ohi64tw	dbhsj đạkas	t	2025-05-21 18:45:43.226	2025-05-24 04:13:03.183	2025-05-24 04:13:03.236	1	1	\N	dbhsj-dakas	\N
11	jo0w66csrt1x3oxww5aa7gcq	bhjdaw	t	2025-05-21 18:52:32.113	2025-05-24 04:13:31.081	\N	1	1	\N	bhjdaw	\N
24	jo0w66csrt1x3oxww5aa7gcq	bhjdaw	t	2025-05-21 18:52:32.113	2025-05-24 04:13:31.081	2025-05-24 04:13:31.153	1	1	\N	bhjdaw	\N
16	l27nhu2r136s7y6fs05jone6	iporiwe	t	2025-05-21 18:55:00.4	2025-05-24 04:14:50.136	\N	1	1	\N	iporiwe	\N
25	l27nhu2r136s7y6fs05jone6	iporiwe	t	2025-05-21 18:55:00.4	2025-05-24 04:14:50.136	2025-05-24 04:14:50.222	1	1	\N	iporiwe	\N
4	zfq4nikxe5qjc2qc4hoe9tka	opqwop	t	2025-05-21 18:41:30.201	2025-05-24 04:15:04.512	\N	1	1	\N	opqwop	\N
26	zfq4nikxe5qjc2qc4hoe9tka	opqwop	t	2025-05-21 18:41:30.201	2025-05-24 04:15:04.512	2025-05-24 04:15:04.579	1	1	\N	opqwop	\N
19	cnwbyprlnfgfrpuul4kgbwag	rteqwty	t	2025-05-21 18:56:36.523	2025-05-24 04:15:08.447	\N	1	1	\N	rteqwty	\N
27	cnwbyprlnfgfrpuul4kgbwag	rteqwty	t	2025-05-21 18:56:36.523	2025-05-24 04:15:08.447	2025-05-24 04:15:08.49	1	1	\N	rteqwty	\N
1	havy4irkskn11m59ayi9dbp3	Omo2	t	2025-05-20 15:41:41.943	2025-05-28 18:05:15.72	\N	1	1	\N	uhwp	t
30	havy4irkskn11m59ayi9dbp3	Omo2	t	2025-05-20 15:41:41.943	2025-05-28 18:05:15.72	2025-05-28 18:05:15.804	1	1	\N	uhwp	t
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.categories (id, document_id, name, description, created_at, updated_at, published_at, created_by_id, updated_by_id, locale, slug) FROM stdin;
2	my9qlh7uun5coouiayvxxout	Dầu gội	\N	2025-05-20 15:40:08.285	2025-05-31 15:37:12.642	\N	1	1	\N	dau-goi
12	my9qlh7uun5coouiayvxxout	Dầu gội	\N	2025-05-20 15:40:08.285	2025-05-31 15:37:12.642	2025-05-31 15:37:12.721	1	1	\N	dau-goi
4	i7yb0eovjjy7gnfz7mcp5t21	Kem ủ tóc	bdas dmn adjasdma sdaks dkas	2025-05-22 16:54:05.761	2025-05-31 15:38:00.847	\N	1	1	\N	kem-u-toc
13	i7yb0eovjjy7gnfz7mcp5t21	Kem ủ tóc	bdas dmn adjasdma sdaks dkas	2025-05-22 16:54:05.761	2025-05-31 15:38:00.847	2025-05-31 15:38:00.884	1	1	\N	kem-u-toc
6	xrcmy6uvirdpvhrct1c1nxje	Xịt dưỡng tóc	\N	2025-05-22 16:54:38.847	2025-05-31 15:39:20.206	\N	1	1	\N	xit-duong-toc
14	xrcmy6uvirdpvhrct1c1nxje	Xịt dưỡng tóc	\N	2025-05-22 16:54:38.847	2025-05-31 15:39:20.206	2025-05-31 15:39:20.293	1	1	\N	xit-duong-toc
\.


--
-- Data for Name: categories_brands_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.categories_brands_lnk (id, category_id, brand_id, brand_ord, category_ord) FROM stdin;
1	2	1	1	1
2	2	6	2	1
5	6	19	0	1
6	6	4	1	1
7	6	1	2	2
11	4	4	1	2
32	12	23	2	1
31	12	30	1	1
33	13	26	1	2
35	14	26	2	1
34	14	27	1	1
36	14	30	3	2
\.


--
-- Data for Name: components_shared_media; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.components_shared_media (id) FROM stdin;
\.


--
-- Data for Name: components_shared_quotes; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.components_shared_quotes (id, title, body) FROM stdin;
\.


--
-- Data for Name: components_shared_rich_texts; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.components_shared_rich_texts (id, body) FROM stdin;
\.


--
-- Data for Name: components_shared_seos; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.components_shared_seos (id, meta_title, meta_description) FROM stdin;
\.


--
-- Data for Name: components_shared_sliders; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.components_shared_sliders (id) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.customers (id, document_id, full_name, dob, phone_number, address, point, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.files (id, document_id, name, alternative_text, caption, width, height, formats, hash, ext, mime, size, url, preview_url, provider, provider_metadata, folder_path, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
2	tg15kw56vrwlpzt2325a8h7y	test.jpeg	\N	\N	564	614	{"small": {"ext": ".jpeg", "url": "/uploads/small_test_4944eefd0b.jpeg", "hash": "small_test_4944eefd0b", "mime": "image/jpeg", "name": "small_test.jpeg", "path": null, "size": 25.94, "width": 459, "height": 500, "sizeInBytes": 25937}, "thumbnail": {"ext": ".jpeg", "url": "/uploads/thumbnail_test_4944eefd0b.jpeg", "hash": "thumbnail_test_4944eefd0b", "mime": "image/jpeg", "name": "thumbnail_test.jpeg", "path": null, "size": 4.57, "width": 143, "height": 156, "sizeInBytes": 4572}}	test_4944eefd0b	.jpeg	image/jpeg	26.56	/uploads/test_4944eefd0b.jpeg	\N	local	\N	/	2025-05-20 15:41:37.408	2025-05-20 15:41:37.408	2025-05-20 15:41:37.409	1	1	\N
3	j2vsq58ebyue08bjho6lwyor	pngwing.com.png	\N	\N	1405	2500	{"large": {"ext": ".png", "url": "/uploads/large_pngwing_com_67a62c4277.png", "hash": "large_pngwing_com_67a62c4277", "mime": "image/png", "name": "large_pngwing.com.png", "path": null, "size": 73.84, "width": 562, "height": 1000, "sizeInBytes": 73841}, "small": {"ext": ".png", "url": "/uploads/small_pngwing_com_67a62c4277.png", "hash": "small_pngwing_com_67a62c4277", "mime": "image/png", "name": "small_pngwing.com.png", "path": null, "size": 30.82, "width": 281, "height": 500, "sizeInBytes": 30820}, "medium": {"ext": ".png", "url": "/uploads/medium_pngwing_com_67a62c4277.png", "hash": "medium_pngwing_com_67a62c4277", "mime": "image/png", "name": "medium_pngwing.com.png", "path": null, "size": 50.73, "width": 422, "height": 750, "sizeInBytes": 50731}, "thumbnail": {"ext": ".png", "url": "/uploads/thumbnail_pngwing_com_67a62c4277.png", "hash": "thumbnail_pngwing_com_67a62c4277", "mime": "image/png", "name": "thumbnail_pngwing.com.png", "path": null, "size": 7.41, "width": 88, "height": 156, "sizeInBytes": 7405}}	pngwing_com_67a62c4277	.png	image/png	33.14	/uploads/pngwing_com_67a62c4277.png	\N	local	\N	/	2025-05-21 18:42:18.879	2025-05-21 18:42:18.879	2025-05-21 18:42:18.88	1	1	\N
6	gp6m2x9qfoklnpeo8x6906ku	01JTJ652FX0B9WQYXQQR192TM5.webp	\N	\N	96	96	\N	01_JTJ_652_FX_0_B9_WQYXQQR_192_TM_5_36752277a3	.webp	image/webp	1.92	/uploads/01_JTJ_652_FX_0_B9_WQYXQQR_192_TM_5_36752277a3.webp	\N	local	\N	/	2025-05-21 18:47:57.771	2025-05-21 18:47:57.771	2025-05-21 18:47:57.771	1	1	\N
7	dcskxgo610vl2b1rzolgu844	01JBXM1446DJMAWSXX45K7FZPE.webp	\N	\N	96	96	\N	01_JBXM_1446_DJMAWSXX_45_K7_FZPE_e243f6dc40	.webp	image/webp	1.34	/uploads/01_JBXM_1446_DJMAWSXX_45_K7_FZPE_e243f6dc40.webp	\N	local	\N	/	2025-05-21 18:47:57.778	2025-05-21 18:47:57.778	2025-05-21 18:47:57.778	1	1	\N
8	taqeco178bf7536tiity5kh5	01JBBZSPY476VG47G185HHEHPH.webp	\N	\N	96	96	\N	01_JBBZSPY_476_VG_47_G185_HHEHPH_36a4f6a5da	.webp	image/webp	0.78	/uploads/01_JBBZSPY_476_VG_47_G185_HHEHPH_36a4f6a5da.webp	\N	local	\N	/	2025-05-21 18:54:14.561	2025-05-21 18:54:14.561	2025-05-21 18:54:14.561	1	1	\N
9	qgw099fu5bsgslfgtrd1670f	01JBC0NE1ZGF4K4XV9VG7BH93E.webp	\N	\N	96	96	\N	01_JBC_0_NE_1_ZGF_4_K4_XV_9_VG_7_BH_93_E_32f26b5f09	.webp	image/webp	0.55	/uploads/01_JBC_0_NE_1_ZGF_4_K4_XV_9_VG_7_BH_93_E_32f26b5f09.webp	\N	local	\N	/	2025-05-21 18:54:14.592	2025-05-21 18:54:14.592	2025-05-21 18:54:14.593	1	1	\N
4	kcs6mgozqoxq0mjfe4n11hsj	01JV1NAZEEE7HDP5ZAFW4H11PF.webp	\N	\N	96	69	\N	01_JV_1_NAZEEE_7_HDP_5_ZAFW_4_H11_PF_e531b9be20	.webp	image/webp	0.67	/uploads/01_JV_1_NAZEEE_7_HDP_5_ZAFW_4_H11_PF_e531b9be20.webp	\N	local	\N	/	2025-05-21 18:47:57.653	2025-05-21 18:54:56.524	2025-05-21 18:47:57.656	1	1	\N
5	ozzuf60lwcv3diejxd0pgc3r	01JBE32VSPBYC2VWQE87EGRF2N.webp	\N	\N	96	87	\N	01_JBE_32_VSPBYC_2_VWQE_87_EGRF_2_N_4385ee3c2b	.webp	image/webp	0.86	/uploads/01_JBE_32_VSPBYC_2_VWQE_87_EGRF_2_N_4385ee3c2b.webp	\N	local	\N	/	2025-05-21 18:47:57.659	2025-05-21 18:56:32.973	2025-05-21 18:47:57.66	1	1	\N
10	q8bn8ecf1l2dsex0s64a7epf	test.jpeg	\N	\N	564	614	{"small": {"ext": ".jpeg", "url": "/uploads/small_test_02ab26613e.jpeg", "hash": "small_test_02ab26613e", "mime": "image/jpeg", "name": "small_test.jpeg", "path": null, "size": 25.94, "width": 459, "height": 500, "sizeInBytes": 25937}, "thumbnail": {"ext": ".jpeg", "url": "/uploads/thumbnail_test_02ab26613e.jpeg", "hash": "thumbnail_test_02ab26613e", "mime": "image/jpeg", "name": "thumbnail_test.jpeg", "path": null, "size": 4.57, "width": 143, "height": 156, "sizeInBytes": 4572}}	test_02ab26613e	.jpeg	image/jpeg	26.56	/uploads/test_02ab26613e.jpeg	\N	local	\N	/	2025-05-24 11:01:20.621	2025-05-24 11:01:20.621	2025-05-24 11:01:20.622	1	1	\N
1	nwewkyws7v3w3b3mbhm0gppj	bot_pic.jpeg	\N	\N	1024	724	{"large": {"ext": ".jpeg", "url": "/uploads/large_bot_pic_0a964d7666.jpeg", "hash": "large_bot_pic_0a964d7666", "mime": "image/jpeg", "name": "large_bot_pic.jpeg", "path": null, "size": 81.56, "width": 1000, "height": 707, "sizeInBytes": 81561}, "small": {"ext": ".jpeg", "url": "/uploads/small_bot_pic_0a964d7666.jpeg", "hash": "small_bot_pic_0a964d7666", "mime": "image/jpeg", "name": "small_bot_pic.jpeg", "path": null, "size": 27.59, "width": 500, "height": 354, "sizeInBytes": 27594}, "medium": {"ext": ".jpeg", "url": "/uploads/medium_bot_pic_0a964d7666.jpeg", "hash": "medium_bot_pic_0a964d7666", "mime": "image/jpeg", "name": "medium_bot_pic.jpeg", "path": null, "size": 51.9, "width": 750, "height": 530, "sizeInBytes": 51898}, "thumbnail": {"ext": ".jpeg", "url": "/uploads/thumbnail_bot_pic_0a964d7666.jpeg", "hash": "thumbnail_bot_pic_0a964d7666", "mime": "image/jpeg", "name": "thumbnail_bot_pic.jpeg", "path": null, "size": 7.36, "width": 221, "height": 156, "sizeInBytes": 7359}}	bot_pic_0a964d7666	.jpeg	image/jpeg	84.62	/uploads/bot_pic_0a964d7666.jpeg	\N	local	\N	/	2025-05-20 15:30:25.201	2025-05-27 17:10:11.658	2025-05-20 15:30:25.202	1	1	\N
11	pbbdne5zvvo5slo0vsdhdkzg	divi_logo.png	\N	\N	2400	2400	{"large": {"ext": ".png", "url": "/uploads/large_divi_logo_c63316baba.png", "hash": "large_divi_logo_c63316baba", "mime": "image/png", "name": "large_divi_logo.png", "path": null, "size": 58.43, "width": 1000, "height": 1000, "sizeInBytes": 58429}, "small": {"ext": ".png", "url": "/uploads/small_divi_logo_c63316baba.png", "hash": "small_divi_logo_c63316baba", "mime": "image/png", "name": "small_divi_logo.png", "path": null, "size": 24.93, "width": 500, "height": 500, "sizeInBytes": 24925}, "medium": {"ext": ".png", "url": "/uploads/medium_divi_logo_c63316baba.png", "hash": "medium_divi_logo_c63316baba", "mime": "image/png", "name": "medium_divi_logo.png", "path": null, "size": 40.84, "width": 750, "height": 750, "sizeInBytes": 40839}, "thumbnail": {"ext": ".png", "url": "/uploads/thumbnail_divi_logo_c63316baba.png", "hash": "thumbnail_divi_logo_c63316baba", "mime": "image/png", "name": "thumbnail_divi_logo.png", "path": null, "size": 6.19, "width": 156, "height": 156, "sizeInBytes": 6194}}	divi_logo_c63316baba	.png	image/png	26.69	/uploads/divi_logo_c63316baba.png	\N	local	\N	/	2025-05-28 17:26:40.346	2025-05-28 17:26:40.346	2025-05-28 17:26:40.347	1	1	\N
12	bmpy9dvg40znl74xwx4bcxpo	vn-11134210-7ra0g-m8ehvh2j1d3b6b.webp	\N	\N	940	788	{"small": {"ext": ".webp", "url": "/uploads/small_vn_11134210_7ra0g_m8ehvh2j1d3b6b_34038899d8.webp", "hash": "small_vn_11134210_7ra0g_m8ehvh2j1d3b6b_34038899d8", "mime": "image/webp", "name": "small_vn-11134210-7ra0g-m8ehvh2j1d3b6b.webp", "path": null, "size": 43.52, "width": 500, "height": 419, "sizeInBytes": 43518}, "medium": {"ext": ".webp", "url": "/uploads/medium_vn_11134210_7ra0g_m8ehvh2j1d3b6b_34038899d8.webp", "hash": "medium_vn_11134210_7ra0g_m8ehvh2j1d3b6b_34038899d8", "mime": "image/webp", "name": "medium_vn-11134210-7ra0g-m8ehvh2j1d3b6b.webp", "path": null, "size": 77.16, "width": 750, "height": 629, "sizeInBytes": 77160}, "thumbnail": {"ext": ".webp", "url": "/uploads/thumbnail_vn_11134210_7ra0g_m8ehvh2j1d3b6b_34038899d8.webp", "hash": "thumbnail_vn_11134210_7ra0g_m8ehvh2j1d3b6b_34038899d8", "mime": "image/webp", "name": "thumbnail_vn-11134210-7ra0g-m8ehvh2j1d3b6b.webp", "path": null, "size": 9.45, "width": 186, "height": 156, "sizeInBytes": 9446}}	vn_11134210_7ra0g_m8ehvh2j1d3b6b_34038899d8	.webp	image/webp	121.31	/uploads/vn_11134210_7ra0g_m8ehvh2j1d3b6b_34038899d8.webp	\N	local	\N	/	2025-05-29 15:30:57.781	2025-05-29 15:30:57.781	2025-05-29 15:30:57.781	1	1	\N
13	rujem1uiso1k9qyuhc8ipi1w	vn-11134210-7ra0g-m674my4cboag9f.webp	\N	\N	1552	1571	{"large": {"ext": ".webp", "url": "/uploads/large_vn_11134210_7ra0g_m674my4cboag9f_2561cae8a5.webp", "hash": "large_vn_11134210_7ra0g_m674my4cboag9f_2561cae8a5", "mime": "image/webp", "name": "large_vn-11134210-7ra0g-m674my4cboag9f.webp", "path": null, "size": 83.21, "width": 988, "height": 1000, "sizeInBytes": 83214}, "small": {"ext": ".webp", "url": "/uploads/small_vn_11134210_7ra0g_m674my4cboag9f_2561cae8a5.webp", "hash": "small_vn_11134210_7ra0g_m674my4cboag9f_2561cae8a5", "mime": "image/webp", "name": "small_vn-11134210-7ra0g-m674my4cboag9f.webp", "path": null, "size": 35.1, "width": 494, "height": 500, "sizeInBytes": 35096}, "medium": {"ext": ".webp", "url": "/uploads/medium_vn_11134210_7ra0g_m674my4cboag9f_2561cae8a5.webp", "hash": "medium_vn_11134210_7ra0g_m674my4cboag9f_2561cae8a5", "mime": "image/webp", "name": "medium_vn-11134210-7ra0g-m674my4cboag9f.webp", "path": null, "size": 58.5, "width": 741, "height": 750, "sizeInBytes": 58496}, "thumbnail": {"ext": ".webp", "url": "/uploads/thumbnail_vn_11134210_7ra0g_m674my4cboag9f_2561cae8a5.webp", "hash": "thumbnail_vn_11134210_7ra0g_m674my4cboag9f_2561cae8a5", "mime": "image/webp", "name": "thumbnail_vn-11134210-7ra0g-m674my4cboag9f.webp", "path": null, "size": 6.44, "width": 154, "height": 156, "sizeInBytes": 6440}}	vn_11134210_7ra0g_m674my4cboag9f_2561cae8a5	.webp	image/webp	165.59	/uploads/vn_11134210_7ra0g_m674my4cboag9f_2561cae8a5.webp	\N	local	\N	/	2025-05-29 15:31:17.382	2025-05-29 15:31:17.382	2025-05-29 15:31:17.383	1	1	\N
14	odt8smsyq1towtvtp5s5fv0k	vn-11134210-7ra0g-m674my4cd2bnef.webp	\N	\N	1554	1574	{"large": {"ext": ".webp", "url": "/uploads/large_vn_11134210_7ra0g_m674my4cd2bnef_19752461bf.webp", "hash": "large_vn_11134210_7ra0g_m674my4cd2bnef_19752461bf", "mime": "image/webp", "name": "large_vn-11134210-7ra0g-m674my4cd2bnef.webp", "path": null, "size": 83.62, "width": 987, "height": 1000, "sizeInBytes": 83616}, "small": {"ext": ".webp", "url": "/uploads/small_vn_11134210_7ra0g_m674my4cd2bnef_19752461bf.webp", "hash": "small_vn_11134210_7ra0g_m674my4cd2bnef_19752461bf", "mime": "image/webp", "name": "small_vn-11134210-7ra0g-m674my4cd2bnef.webp", "path": null, "size": 35.09, "width": 494, "height": 500, "sizeInBytes": 35086}, "medium": {"ext": ".webp", "url": "/uploads/medium_vn_11134210_7ra0g_m674my4cd2bnef_19752461bf.webp", "hash": "medium_vn_11134210_7ra0g_m674my4cd2bnef_19752461bf", "mime": "image/webp", "name": "medium_vn-11134210-7ra0g-m674my4cd2bnef.webp", "path": null, "size": 59.13, "width": 740, "height": 750, "sizeInBytes": 59126}, "thumbnail": {"ext": ".webp", "url": "/uploads/thumbnail_vn_11134210_7ra0g_m674my4cd2bnef_19752461bf.webp", "hash": "thumbnail_vn_11134210_7ra0g_m674my4cd2bnef_19752461bf", "mime": "image/webp", "name": "thumbnail_vn-11134210-7ra0g-m674my4cd2bnef.webp", "path": null, "size": 6.27, "width": 154, "height": 156, "sizeInBytes": 6272}}	vn_11134210_7ra0g_m674my4cd2bnef_19752461bf	.webp	image/webp	164.90	/uploads/vn_11134210_7ra0g_m674my4cd2bnef_19752461bf.webp	\N	local	\N	/	2025-05-29 15:31:39.381	2025-05-29 15:31:39.381	2025-05-29 15:31:39.382	1	1	\N
15	sl737aqjil0suzfp1xn5ip4d	dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024.webp	\N	\N	1024	1024	{"large": {"ext": ".webp", "url": "/uploads/large_dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024_5c572c1f5d.webp", "hash": "large_dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024_5c572c1f5d", "mime": "image/webp", "name": "large_dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024.webp", "path": null, "size": 29.28, "width": 1000, "height": 1000, "sizeInBytes": 29276}, "small": {"ext": ".webp", "url": "/uploads/small_dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024_5c572c1f5d.webp", "hash": "small_dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024_5c572c1f5d", "mime": "image/webp", "name": "small_dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024.webp", "path": null, "size": 13.42, "width": 500, "height": 500, "sizeInBytes": 13424}, "medium": {"ext": ".webp", "url": "/uploads/medium_dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024_5c572c1f5d.webp", "hash": "medium_dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024_5c572c1f5d", "mime": "image/webp", "name": "medium_dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024.webp", "path": null, "size": 21.54, "width": 750, "height": 750, "sizeInBytes": 21536}, "thumbnail": {"ext": ".webp", "url": "/uploads/thumbnail_dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024_5c572c1f5d.webp", "hash": "thumbnail_dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024_5c572c1f5d", "mime": "image/webp", "name": "thumbnail_dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024.webp", "path": null, "size": 2.92, "width": 156, "height": 156, "sizeInBytes": 2924}}	dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024_5c572c1f5d	.webp	image/webp	34.84	/uploads/dsdsefergtrh_7a53b8d5cafa40208750e66955b12443_1024x1024_5c572c1f5d.webp	\N	local	\N	/	2025-05-31 15:37:07.691	2025-05-31 15:37:07.691	2025-05-31 15:37:07.692	1	1	\N
16	hr4zddfzazo7r374xtxv4kh9	daugoixabiotintrang1000ml1-1.jpg	\N	\N	800	800	{"small": {"ext": ".jpg", "url": "/uploads/small_daugoixabiotintrang1000ml1_1_bea2d12462.jpg", "hash": "small_daugoixabiotintrang1000ml1_1_bea2d12462", "mime": "image/jpeg", "name": "small_daugoixabiotintrang1000ml1-1.jpg", "path": null, "size": 23.39, "width": 500, "height": 500, "sizeInBytes": 23386}, "medium": {"ext": ".jpg", "url": "/uploads/medium_daugoixabiotintrang1000ml1_1_bea2d12462.jpg", "hash": "medium_daugoixabiotintrang1000ml1_1_bea2d12462", "mime": "image/jpeg", "name": "medium_daugoixabiotintrang1000ml1-1.jpg", "path": null, "size": 43.86, "width": 750, "height": 750, "sizeInBytes": 43858}, "thumbnail": {"ext": ".jpg", "url": "/uploads/thumbnail_daugoixabiotintrang1000ml1_1_bea2d12462.jpg", "hash": "thumbnail_daugoixabiotintrang1000ml1_1_bea2d12462", "mime": "image/jpeg", "name": "thumbnail_daugoixabiotintrang1000ml1-1.jpg", "path": null, "size": 3.63, "width": 156, "height": 156, "sizeInBytes": 3632}}	daugoixabiotintrang1000ml1_1_bea2d12462	.jpg	image/jpeg	48.86	/uploads/daugoixabiotintrang1000ml1_1_bea2d12462.jpg	\N	local	\N	/	2025-05-31 15:37:57.446	2025-05-31 15:37:57.446	2025-05-31 15:37:57.447	1	1	\N
17	mgebgpk4ropt73qxpbd95xl3	5b4eaba04c6723a2912fb9fa33b01bc6-1.jpg	\N	\N	500	500	{"thumbnail": {"ext": ".jpg", "url": "/uploads/thumbnail_5b4eaba04c6723a2912fb9fa33b01bc6_1_4531f564cc.jpg", "hash": "thumbnail_5b4eaba04c6723a2912fb9fa33b01bc6_1_4531f564cc", "mime": "image/jpeg", "name": "thumbnail_5b4eaba04c6723a2912fb9fa33b01bc6-1.jpg", "path": null, "size": 2.36, "width": 156, "height": 156, "sizeInBytes": 2360}}	5b4eaba04c6723a2912fb9fa33b01bc6_1_4531f564cc	.jpg	image/jpeg	13.09	/uploads/5b4eaba04c6723a2912fb9fa33b01bc6_1_4531f564cc.jpg	\N	local	\N	/	2025-05-31 15:39:17.711	2025-05-31 15:39:17.711	2025-05-31 15:39:17.712	1	1	\N
\.


--
-- Data for Name: files_folder_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.files_folder_lnk (id, file_id, folder_id, file_ord) FROM stdin;
\.


--
-- Data for Name: files_related_mph; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.files_related_mph (id, file_id, related_id, related_type, field, "order") FROM stdin;
98	3	1	api::brand.brand	logo	1
99	3	30	api::brand.brand	logo	1
100	12	1	api::banner.banner	image	1
101	12	2	api::banner.banner	image	1
102	13	3	api::banner.banner	image	1
103	13	4	api::banner.banner	image	1
104	14	5	api::banner.banner	image	1
105	14	6	api::banner.banner	image	1
106	15	2	api::category.category	image	1
107	15	12	api::category.category	image	1
108	16	4	api::category.category	image	1
109	16	13	api::category.category	image	1
13	2	1	api::variant.variant	variant_image	1
14	2	4	api::variant.variant	variant_image	1
110	17	6	api::category.category	image	1
111	17	14	api::category.category	image	1
45	9	14	api::brand.brand	logo	1
46	9	22	api::brand.brand	logo	1
47	7	6	api::brand.brand	logo	1
48	7	23	api::brand.brand	logo	1
49	8	11	api::brand.brand	logo	1
50	8	24	api::brand.brand	logo	1
51	8	16	api::brand.brand	logo	1
52	8	25	api::brand.brand	logo	1
53	4	4	api::brand.brand	logo	1
54	4	26	api::brand.brand	logo	1
55	5	19	api::brand.brand	logo	1
56	5	27	api::brand.brand	logo	1
63	10	1	api::product.product	media	1
64	1	1	api::product.product	media	2
65	10	9	api::product.product	media	1
66	1	9	api::product.product	media	2
75	1	10	api::variant.variant	variant_image	1
76	1	11	api::variant.variant	variant_image	1
77	1	12	api::product.product	media	1
78	3	12	api::product.product	media	2
79	1	13	api::product.product	media	1
80	3	13	api::product.product	media	2
85	2	1	api::service.service	images	1
86	2	4	api::service.service	images	1
87	6	12	api::variant.variant	variant_image	1
88	6	13	api::variant.variant	variant_image	1
92	10	10	api::product.product	media	1
93	3	10	api::product.product	media	2
94	1	10	api::product.product	media	3
95	10	14	api::product.product	media	1
96	3	14	api::product.product	media	2
97	1	14	api::product.product	media	3
\.


--
-- Data for Name: globals; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.globals (id, document_id, site_name, site_description, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
\.


--
-- Data for Name: globals_cmps; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.globals_cmps (id, entity_id, cmp_id, component_type, field, "order") FROM stdin;
\.


--
-- Data for Name: i18n_locale; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.i18n_locale (id, document_id, name, code, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
1	d6h1mll1a51jcostb0x396if	English (en)	en	2025-05-19 17:57:27.74	2025-05-19 17:57:27.74	2025-05-19 17:57:27.741	\N	\N	\N
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.order_items (id, document_id, quantity, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
\.


--
-- Data for Name: order_items_order_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.order_items_order_lnk (id, order_item_id, order_id, order_item_ord) FROM stdin;
\.


--
-- Data for Name: order_items_variant_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.order_items_variant_lnk (id, order_item_id, variant_id, order_item_ord) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.orders (id, document_id, shipping_fee, point, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
\.


--
-- Data for Name: orders_customer_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.orders_customer_lnk (id, order_id, customer_id, order_ord) FROM stdin;
\.


--
-- Data for Name: product_list_blocks; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.product_list_blocks (id, document_id, index, title, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
6	pgaviojtgpo9y3dguikzxdwu	1	Bộ sản phẩm A	2025-05-28 17:42:50.874	2025-05-28 17:42:50.874	\N	1	1	\N
7	pgaviojtgpo9y3dguikzxdwu	1	Bộ sản phẩm A	2025-05-28 17:42:50.874	2025-05-28 17:42:50.874	2025-05-28 17:42:50.94	1	1	\N
1	ro8a8aofg8pi7tihlgaz30e3	2	Sản phẩm bán chạy	2025-05-24 16:53:39.303	2025-05-28 17:44:37.466	\N	1	1	\N
8	ro8a8aofg8pi7tihlgaz30e3	2	Sản phẩm bán chạy	2025-05-24 16:53:39.303	2025-05-28 17:44:37.466	2025-05-28 17:44:37.528	1	1	\N
3	f0osy80jj3pwdp7001kfwrgk	3	Sản phẩm ưu đãi	2025-05-24 16:54:21.912	2025-05-28 17:44:43.873	\N	1	1	\N
9	f0osy80jj3pwdp7001kfwrgk	3	Sản phẩm ưu đãi	2025-05-24 16:54:21.912	2025-05-28 17:44:43.873	2025-05-28 17:44:43.921	1	1	\N
\.


--
-- Data for Name: product_list_blocks_products_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.product_list_blocks_products_lnk (id, product_list_block_id, product_id, product_ord) FROM stdin;
3	3	10	0
1	1	10	1
5	1	12	2
8	6	10	0
9	6	12	1
11	7	13	2
13	8	13	2
10	7	14	1
12	8	14	1
14	9	14	1
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.products (id, document_id, name, short_description, detail_description, created_at, updated_at, published_at, created_by_id, updated_by_id, locale, sold_quantity, slug) FROM stdin;
12	s776u91b7ux8juwo2qwu4a3x	Bộ dụng cụ ủ tóc	Bộ dụng cụ đầy đủ 4 món dabshdja djha shd á dha hs dha sjhd jas djh ạhd hád jha shjd áhd hjas dhj áhd ạhs dhjas 	[{"type": "paragraph", "children": [{"text": "How to hide scrollbar on your element in TailwindCSS", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "#", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "tailwindcss", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "#", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "react", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "#", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "webdev", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "#", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "tutorial", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Hi there👋,", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "You don't want your UI to look like this?", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "before", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Before", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Final result", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "After", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Here are two steps to follow in order to hide a scrollbar in your HTML elements using TailwindCss.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Step I", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Go to your global.css file styles/global.css and past this code:", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "/* global index.css */ ", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "@tailwind base;", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "@tailwind components;", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "@tailwind utilities;", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "/* add the code bellow */ ", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "@layer utilities {", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "      /* Hide scrollbar for Chrome, Safari and Opera */", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "      .no-scrollbar::-webkit-scrollbar {", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "          display: none;", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "      }", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "     /* Hide scrollbar for IE, Edge and Firefox */", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "      .no-scrollbar {", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "          -ms-overflow-style: none;  /* IE and Edge */", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "          scrollbar-width: none;  /* Firefox */", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "    }", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "  }", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "At this point we added ::-webkit-scrollbar to target the scrollbar style in Chrome,Safari, Edge and Opera.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "no-scrollbar is the class that we are going to use for hidding the scrollbar.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Step II", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Now use no-scrollbar to hide the scrollbar in your elements. Like this:", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "<div className=\\"w-full h-42 overflow-y-scroll no-scrollbar\\">...</div>", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "I hope you find this post useful.", "type": "text"}]}]	2025-05-27 17:11:03.636	2025-05-27 17:11:03.636	\N	1	1	\N	399	product
13	s776u91b7ux8juwo2qwu4a3x	Bộ dụng cụ ủ tóc	Bộ dụng cụ đầy đủ 4 món dabshdja djha shd á dha hs dha sjhd jas djh ạhd hád jha shjd áhd hjas dhj áhd ạhs dhjas 	[{"type": "paragraph", "children": [{"text": "How to hide scrollbar on your element in TailwindCSS", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "#", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "tailwindcss", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "#", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "react", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "#", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "webdev", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "#", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "tutorial", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Hi there👋,", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "You don't want your UI to look like this?", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "before", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Before", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Final result", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "After", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Here are two steps to follow in order to hide a scrollbar in your HTML elements using TailwindCss.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Step I", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Go to your global.css file styles/global.css and past this code:", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "/* global index.css */ ", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "@tailwind base;", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "@tailwind components;", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "@tailwind utilities;", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "/* add the code bellow */ ", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "@layer utilities {", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "      /* Hide scrollbar for Chrome, Safari and Opera */", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "      .no-scrollbar::-webkit-scrollbar {", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "          display: none;", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "      }", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "     /* Hide scrollbar for IE, Edge and Firefox */", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "      .no-scrollbar {", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "          -ms-overflow-style: none;  /* IE and Edge */", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "          scrollbar-width: none;  /* Firefox */", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "    }", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "  }", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "At this point we added ::-webkit-scrollbar to target the scrollbar style in Chrome,Safari, Edge and Opera.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "no-scrollbar is the class that we are going to use for hidding the scrollbar.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Step II", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Now use no-scrollbar to hide the scrollbar in your elements. Like this:", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "<div className=\\"w-full h-42 overflow-y-scroll no-scrollbar\\">...</div>", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "I hope you find this post useful.", "type": "text"}]}]	2025-05-27 17:11:03.636	2025-05-27 17:11:03.636	2025-05-27 17:11:03.75	1	1	\N	399	product
10	zifnk6lfriog998c9uutgmvl	Dầu gội Thái Dương	bjhdabjs djha sjdha sj	[{"type": "paragraph", "children": [{"text": "Trong phát biểu tại Phòng Bầu dục ngày 23/5 về chủ đề thuế quan với hàng hoá nhập khẩu từ EU, Tổng thống Mỹ Donald Trump khẳng định: “Tôi không tìm kiếm một thoả thuận. Chúng tôi ấn định thoả thuận và đó là 50%”.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "24-05-2025Nghịch lý xung quanh dự luật \\"lớn và đẹp\\" của ông Trump: Giới siêu giàu sẽ có nghìn...", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "23-05-2025Ông Trump doạ đánh thuế 50% với hàng hoá EU ngay 1/6 vì \\"đàm phán chẳng đi...", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "23-05-2025Tổng thống Trump chiêu đãi các triệu phú tiền số, nhiều nghị sĩ nổi xung", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "23-05-2025Nóng: Tổng thống Mỹ Donald Trump chính thức cấm Đại học Harvard tuyển sinh...", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Không còn là đe doạ, ông Trump quyết ấn định thuế 50% với hàng hoá EU, chỉ thời điểm là có thể cân nhắc; Bộ trưởng Tài chính Mỹ khẳng định đàm phán với các nước châu Á đang tiến triển tốt- Ảnh 1.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Trước đó, trên mạng xã hội Truth Social, ông Trump đe doạ đánh thuế hàng hoá nhập khẩu từ Liên minh châu Âu (EU) ở mức 50%, chính thức có hiệu lực từ ngày 1/6, vì các cuộc đàn phán thương mại không có gì tiến triển.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Tuy nhiên, ông Trump không đóng tất cả các cánh cửa. “Nếu ai đó đến và muốn xây dựng một nhà máy ở đây, tôi có thể nói chuyện với họ về việc hoãn lại một chút thời điểm mức thuế mới có hiệu lực”, ông Trump nói.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Olof Gill, người phát ngôn của Ủy ban châu Âu (EC), từ chối bình luận ngay lập tức. Ông Gill cho biết đang đợi thông tin về cuộc điện đàm giữa Maroš Šefčovič, Ủy viên thương mại châu Âu và Đại diện thương mại Mỹ Jamieson Greer. Gill không nêu rõ cuộc gọi sẽ diễn ra khi nào nhưng Reuters đưa tin cuộc gọi sẽ diễn ra lúc 11 giờ sáng theo giờ miền Đông vào thứ Sáu.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Ngay sau bài đăng của ông Trump, Bộ trưởng Tài chính Mỹ Scott Bessent nói rằng “chất lượng các đề xuất thương mại của EU không tương đương với đề xuất của các đối tác thương mại khác với chúng tôi”.", "type": "text"}]}]	2025-05-24 16:34:45.988	2025-05-28 17:55:46.685	\N	1	1	\N	399	dau-goi-thai-duong
14	zifnk6lfriog998c9uutgmvl	Dầu gội Thái Dương	bjhdabjs djha sjdha sj	[{"type": "paragraph", "children": [{"text": "Trong phát biểu tại Phòng Bầu dục ngày 23/5 về chủ đề thuế quan với hàng hoá nhập khẩu từ EU, Tổng thống Mỹ Donald Trump khẳng định: “Tôi không tìm kiếm một thoả thuận. Chúng tôi ấn định thoả thuận và đó là 50%”.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "24-05-2025Nghịch lý xung quanh dự luật \\"lớn và đẹp\\" của ông Trump: Giới siêu giàu sẽ có nghìn...", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "23-05-2025Ông Trump doạ đánh thuế 50% với hàng hoá EU ngay 1/6 vì \\"đàm phán chẳng đi...", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "23-05-2025Tổng thống Trump chiêu đãi các triệu phú tiền số, nhiều nghị sĩ nổi xung", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "23-05-2025Nóng: Tổng thống Mỹ Donald Trump chính thức cấm Đại học Harvard tuyển sinh...", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Không còn là đe doạ, ông Trump quyết ấn định thuế 50% với hàng hoá EU, chỉ thời điểm là có thể cân nhắc; Bộ trưởng Tài chính Mỹ khẳng định đàm phán với các nước châu Á đang tiến triển tốt- Ảnh 1.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Trước đó, trên mạng xã hội Truth Social, ông Trump đe doạ đánh thuế hàng hoá nhập khẩu từ Liên minh châu Âu (EU) ở mức 50%, chính thức có hiệu lực từ ngày 1/6, vì các cuộc đàn phán thương mại không có gì tiến triển.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Tuy nhiên, ông Trump không đóng tất cả các cánh cửa. “Nếu ai đó đến và muốn xây dựng một nhà máy ở đây, tôi có thể nói chuyện với họ về việc hoãn lại một chút thời điểm mức thuế mới có hiệu lực”, ông Trump nói.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Olof Gill, người phát ngôn của Ủy ban châu Âu (EC), từ chối bình luận ngay lập tức. Ông Gill cho biết đang đợi thông tin về cuộc điện đàm giữa Maroš Šefčovič, Ủy viên thương mại châu Âu và Đại diện thương mại Mỹ Jamieson Greer. Gill không nêu rõ cuộc gọi sẽ diễn ra khi nào nhưng Reuters đưa tin cuộc gọi sẽ diễn ra lúc 11 giờ sáng theo giờ miền Đông vào thứ Sáu.", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "", "type": "text"}]}, {"type": "paragraph", "children": [{"text": "Ngay sau bài đăng của ông Trump, Bộ trưởng Tài chính Mỹ Scott Bessent nói rằng “chất lượng các đề xuất thương mại của EU không tương đương với đề xuất của các đối tác thương mại khác với chúng tôi”.", "type": "text"}]}]	2025-05-24 16:34:45.988	2025-05-28 17:55:46.685	2025-05-28 17:55:46.746	1	1	\N	399	dau-goi-thai-duong
\.


--
-- Data for Name: products_brand_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.products_brand_lnk (id, product_id, brand_id) FROM stdin;
10	10	1
12	12	19
13	13	27
14	14	30
\.


--
-- Data for Name: products_category_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.products_category_lnk (id, product_id, category_id) FROM stdin;
10	10	4
12	12	6
14	14	13
13	13	14
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.services (id, document_id, price, title, description, number_booking, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
1	am3y3uhl4orvj4s47e7m35my	159000	Gội đầu cơ bản: 39k (dầu cơ bản)	[{"type": "list", "format": "unordered", "children": [{"type": "list-item", "children": [{"text": "Gội nước 1", "type": "text"}]}, {"type": "list-item", "children": [{"text": "Rửa mặt", "type": "text"}]}, {"type": "list-item", "children": [{"text": "Massage mặt", "type": "text"}]}, {"type": "list-item", "children": [{"text": "Gội nước 2", "type": "text"}]}, {"type": "list-item", "children": [{"text": "Ủ xả", "type": "text"}]}, {"type": "list-item", "children": [{"text": "Massage đầu", "type": "text"}]}, {"type": "list-item", "children": [{"text": "Sấy", "type": "text"}]}]}]	323	2025-05-28 16:58:38.543	2025-05-28 17:48:20.284	\N	1	1	\N
4	am3y3uhl4orvj4s47e7m35my	159000	Gội đầu cơ bản: 39k (dầu cơ bản)	[{"type": "list", "format": "unordered", "children": [{"type": "list-item", "children": [{"text": "Gội nước 1", "type": "text"}]}, {"type": "list-item", "children": [{"text": "Rửa mặt", "type": "text"}]}, {"type": "list-item", "children": [{"text": "Massage mặt", "type": "text"}]}, {"type": "list-item", "children": [{"text": "Gội nước 2", "type": "text"}]}, {"type": "list-item", "children": [{"text": "Ủ xả", "type": "text"}]}, {"type": "list-item", "children": [{"text": "Massage đầu", "type": "text"}]}, {"type": "list-item", "children": [{"text": "Sấy", "type": "text"}]}]}]	323	2025-05-28 16:58:38.543	2025-05-28 17:48:20.284	2025-05-28 17:48:20.315	1	1	\N
\.


--
-- Data for Name: strapi_api_token_permissions; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_api_token_permissions (id, document_id, action, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
1	maq5v5ovzrawu89gs9mqhqeh	api::brand.brand.find	2025-05-20 16:39:55.526	2025-05-20 16:39:55.526	2025-05-20 16:39:55.527	\N	\N	\N
2	y5tztqokulgl4u23wmrmuaue	api::brand.brand.findOne	2025-05-20 16:39:55.526	2025-05-20 16:39:55.526	2025-05-20 16:39:55.528	\N	\N	\N
3	rn65n8essxcqw0vyhn8yrhab	api::category.category.find	2025-05-20 16:39:55.526	2025-05-20 16:39:55.526	2025-05-20 16:39:55.528	\N	\N	\N
4	yvktxbug44x1mcfm8vl690x6	api::category.category.findOne	2025-05-20 16:39:55.526	2025-05-20 16:39:55.526	2025-05-20 16:39:55.529	\N	\N	\N
5	vznf9ut6y0p2k5a13y4oh2l1	api::product.product.find	2025-05-20 16:39:55.526	2025-05-20 16:39:55.526	2025-05-20 16:39:55.53	\N	\N	\N
6	qps38yucxlzowtiv2j5jas6c	api::product.product.findOne	2025-05-20 16:39:55.526	2025-05-20 16:39:55.526	2025-05-20 16:39:55.532	\N	\N	\N
7	b95x2rqzfmwka3r3ypvvbc3z	api::variant.variant.find	2025-05-20 16:39:55.526	2025-05-20 16:39:55.526	2025-05-20 16:39:55.532	\N	\N	\N
8	dt8buqjc2svnmdmbyxgas21h	api::variant.variant.findOne	2025-05-20 16:39:55.526	2025-05-20 16:39:55.526	2025-05-20 16:39:55.533	\N	\N	\N
9	l6x66vjjgz72p4he09ai5le2	api::order.order.findOne	2025-05-25 04:34:38.04	2025-05-25 04:34:38.04	2025-05-25 04:34:38.045	\N	\N	\N
10	gft3x38r42zg9v9vbz9ba1xo	api::customer.customer.findOne	2025-05-25 04:34:38.04	2025-05-25 04:34:38.04	2025-05-25 04:34:38.046	\N	\N	\N
11	hisr7wujljjky8t50ua73cif	api::order-item.order-item.find	2025-05-25 04:34:38.04	2025-05-25 04:34:38.04	2025-05-25 04:34:38.049	\N	\N	\N
12	tmomuze9atul1bop278l1m12	api::product-list-block.product-list-block.findOne	2025-05-25 04:34:38.04	2025-05-25 04:34:38.04	2025-05-25 04:34:38.05	\N	\N	\N
13	l823uy58rg9bgwo5hg1kejde	api::product-list-block.product-list-block.find	2025-05-25 04:34:38.04	2025-05-25 04:34:38.04	2025-05-25 04:34:38.05	\N	\N	\N
14	be7ylmoqfk47b7ltu8osklr8	api::banner.banner.find	2025-05-29 15:33:02.017	2025-05-29 15:33:02.017	2025-05-29 15:33:02.018	\N	\N	\N
\.


--
-- Data for Name: strapi_api_token_permissions_token_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_api_token_permissions_token_lnk (id, api_token_permission_id, api_token_id, api_token_permission_ord) FROM stdin;
1	1	3	1
2	2	3	1
3	3	3	1
4	4	3	1
5	5	3	2
6	7	3	2
7	6	3	2
8	8	3	2
9	10	3	3
10	11	3	3
11	9	3	3
12	13	3	3
13	12	3	4
14	14	3	5
\.


--
-- Data for Name: strapi_api_tokens; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_api_tokens (id, document_id, name, description, type, access_key, encrypted_key, last_used_at, expires_at, lifespan, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
1	la9xx9n02ip5r0chjf6bk4r0	Read Only	A default API token with read-only permissions, only used for accessing resources	read-only	9921c0bc88532b1d5706800f2b2549aa81e64aa8851a05ac2164c393772be5202c1529a90e560625b071983426661b2de8c3880c97e1c0eeb278e5ecb3400d72	v1:e1a02b1b6934f2e83247ea62a78f5668:4f07f0f741a4895d7090df70263eaae858fbf63831760f61a5bd38df098638efd47a1ee767a4cb276fc5b2ca872451303943e14cab48f37b8e33293116df69e7919ea985482656ec2f3d481cf1dc89d7b38fc33220eff6d2f7a9e76559e8745d939ae35cbb7489128b1e839b158fe5eb3cbe10ab1c8c6f88acea415a0fe5b648faf17d420d71e5dc8285f20c8498062eee1c07d115cbca0024a5a596af2cd3a17cdaf5f49334212055442440aaebc6e4ed43eaea3da08a2b79fd882f202393c0e3ac0b80c2722c358f23ba4f4cdb77630c1a20e075382896614c2e40a800a3ec5adf1e3396313482205f4003d83b9a7637b0eb336a7a9fae0f551e78b2e4e289:596de5dfb56cc646a133cbe942176019	\N	\N	\N	2025-05-19 18:04:35.333	2025-05-19 18:04:35.333	2025-05-19 18:04:35.333	\N	\N	\N
2	nffo35xj6exjvt986e91r826	Full Access	A default API token with full access permissions, used for accessing or modifying resources	full-access	3b785b9c02332eef5ac8225ed210d850890416bdc368ab94fd844f9e0a2ee54d757d795675131405976b50af210549291d284bacb6a70da42bcf6abe9f3da644	v1:89ee1edd36dfae9c8b67a7f2402cf355:7040250d1fc52ebd6a435dfdd58e83336db3eb19fce2f68bb49007e4cd4c551d8732846c9f8f754eca527729747bd05d40037203eabc0bfb534a5a380db018908759812a363728072b32e09c0028633d439b882ad3dd687f3f8a04e1f865d338cd5de82cc00ccf25f4d16e294efec8f4f9549182146f6674faede8fa1431eaaaca43b09194695267655e6d9e756ebeeb48547182f4785f80c647e1464030bf8cb993d562ceab7a8ef4c2ff58d9a3951d62b841c9f72eb6bb8379f4a3959f0ee2875a8955c12979da43b8fb78dc04b65298f93c5b29acd07afced3ce09e6a8ed3d8d3575d4b1f8c3dcf25cd10780bc44fec8870900d57f4abfce5a4d50ed86dac:82cdff44a1f237d80690bf99fa3f9b62	\N	\N	\N	2025-05-19 18:04:35.343	2025-05-19 18:04:35.343	2025-05-19 18:04:35.343	\N	\N	\N
3	lnlmtx0rl6yday1uz0e8jn9i	get public data		custom	58e3e2e17a19d12eb50bd6835e145a84371d036852549b5f475162e3fd93cb4fddf6c4338ab1e84638fab14cccadff57338cb16883faa493839bdf5774671563	v1:c485d0704bd7775099806e375196fe9b:2011681c7ab907f6bbec7154d4d58a46a59a74c797f5ae4f8fafeddf3c516aefee87bcd766c82f9dcdff16bbebb21f807f059f7e151dd988b38d39011d878e7a2437f2cba992ae2e094a3dad739bc0cd2364c1dc1ea96d409088c39ed15d71dc96a9b0c7cdafe231f002db1bae3a59290f5cdfc8a0b177335be7c3513f59bb5a91b32cdcc9b185dac9d950b7733f0ba992199760197201543070189734a755b7cf8f04179390a63c75e6a10c4ebeaabdf7465fc7fd3c35792c4de5099e9f0de7a2c5582b291fd66f466abbd3d9709a31f5fa7ceb6ef386d9db905dc9d6713f4cc1397cadfd0679c28e5440d0ade61677e5c7c778016aa78d582281c76f5d1326:a05b3de5e1def53c3e675808666ed117	\N	\N	\N	2025-05-20 16:39:55.509	2025-05-29 15:33:01.993	2025-05-20 16:39:55.511	\N	\N	\N
\.


--
-- Data for Name: strapi_core_store_settings; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_core_store_settings (id, key, value, type, environment, tag) FROM stdin;
7	plugin_content_manager_configuration_content_types::plugin::upload.file	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"name","defaultSortBy":"name","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"name":{"edit":{"label":"name","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"name","searchable":true,"sortable":true}},"alternativeText":{"edit":{"label":"alternativeText","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"alternativeText","searchable":true,"sortable":true}},"caption":{"edit":{"label":"caption","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"caption","searchable":true,"sortable":true}},"width":{"edit":{"label":"width","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"width","searchable":true,"sortable":true}},"height":{"edit":{"label":"height","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"height","searchable":true,"sortable":true}},"formats":{"edit":{"label":"formats","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"formats","searchable":false,"sortable":false}},"hash":{"edit":{"label":"hash","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"hash","searchable":true,"sortable":true}},"ext":{"edit":{"label":"ext","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"ext","searchable":true,"sortable":true}},"mime":{"edit":{"label":"mime","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"mime","searchable":true,"sortable":true}},"size":{"edit":{"label":"size","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"size","searchable":true,"sortable":true}},"url":{"edit":{"label":"url","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"url","searchable":true,"sortable":true}},"previewUrl":{"edit":{"label":"previewUrl","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"previewUrl","searchable":true,"sortable":true}},"provider":{"edit":{"label":"provider","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"provider","searchable":true,"sortable":true}},"provider_metadata":{"edit":{"label":"provider_metadata","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"provider_metadata","searchable":false,"sortable":false}},"folder":{"edit":{"label":"folder","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"folder","searchable":true,"sortable":true}},"folderPath":{"edit":{"label":"folderPath","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"folderPath","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","name","alternativeText","caption"],"edit":[[{"name":"name","size":6},{"name":"alternativeText","size":6}],[{"name":"caption","size":6},{"name":"width","size":4}],[{"name":"height","size":4}],[{"name":"formats","size":12}],[{"name":"hash","size":6},{"name":"ext","size":6}],[{"name":"mime","size":6},{"name":"size","size":4}],[{"name":"url","size":6},{"name":"previewUrl","size":6}],[{"name":"provider","size":6}],[{"name":"provider_metadata","size":12}],[{"name":"folder","size":6},{"name":"folderPath","size":6}]]},"uid":"plugin::upload.file"}	object	\N	\N
8	plugin_content_manager_configuration_content_types::plugin::content-releases.release	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"name","defaultSortBy":"name","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"name":{"edit":{"label":"name","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"name","searchable":true,"sortable":true}},"releasedAt":{"edit":{"label":"releasedAt","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"releasedAt","searchable":true,"sortable":true}},"scheduledAt":{"edit":{"label":"scheduledAt","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"scheduledAt","searchable":true,"sortable":true}},"timezone":{"edit":{"label":"timezone","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"timezone","searchable":true,"sortable":true}},"status":{"edit":{"label":"status","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"status","searchable":true,"sortable":true}},"actions":{"edit":{"label":"actions","description":"","placeholder":"","visible":true,"editable":true,"mainField":"contentType"},"list":{"label":"actions","searchable":false,"sortable":false}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","name","releasedAt","scheduledAt"],"edit":[[{"name":"name","size":6},{"name":"releasedAt","size":6}],[{"name":"scheduledAt","size":6},{"name":"timezone","size":6}],[{"name":"status","size":6},{"name":"actions","size":6}]]},"uid":"plugin::content-releases.release"}	object	\N	\N
9	plugin_content_manager_configuration_content_types::plugin::content-releases.release-action	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"contentType","defaultSortBy":"contentType","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"type":{"edit":{"label":"type","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"type","searchable":true,"sortable":true}},"contentType":{"edit":{"label":"contentType","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"contentType","searchable":true,"sortable":true}},"entryDocumentId":{"edit":{"label":"entryDocumentId","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"entryDocumentId","searchable":true,"sortable":true}},"release":{"edit":{"label":"release","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"release","searchable":true,"sortable":true}},"isEntryValid":{"edit":{"label":"isEntryValid","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"isEntryValid","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","type","contentType","entryDocumentId"],"edit":[[{"name":"type","size":6},{"name":"contentType","size":6}],[{"name":"entryDocumentId","size":6},{"name":"release","size":6}],[{"name":"isEntryValid","size":4}]]},"uid":"plugin::content-releases.release-action"}	object	\N	\N
10	plugin_content_manager_configuration_content_types::plugin::review-workflows.workflow	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"name","defaultSortBy":"name","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"name":{"edit":{"label":"name","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"name","searchable":true,"sortable":true}},"stages":{"edit":{"label":"stages","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"stages","searchable":false,"sortable":false}},"stageRequiredToPublish":{"edit":{"label":"stageRequiredToPublish","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"stageRequiredToPublish","searchable":true,"sortable":true}},"contentTypes":{"edit":{"label":"contentTypes","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"contentTypes","searchable":false,"sortable":false}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","name","stages","stageRequiredToPublish"],"edit":[[{"name":"name","size":6},{"name":"stages","size":6}],[{"name":"stageRequiredToPublish","size":6}],[{"name":"contentTypes","size":12}]]},"uid":"plugin::review-workflows.workflow"}	object	\N	\N
15	plugin_content_manager_configuration_content_types::plugin::users-permissions.user	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"username","defaultSortBy":"username","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"username":{"edit":{"label":"username","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"username","searchable":true,"sortable":true}},"email":{"edit":{"label":"email","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"email","searchable":true,"sortable":true}},"provider":{"edit":{"label":"provider","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"provider","searchable":true,"sortable":true}},"password":{"edit":{"label":"password","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"password","searchable":true,"sortable":true}},"resetPasswordToken":{"edit":{"label":"resetPasswordToken","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"resetPasswordToken","searchable":true,"sortable":true}},"confirmationToken":{"edit":{"label":"confirmationToken","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"confirmationToken","searchable":true,"sortable":true}},"confirmed":{"edit":{"label":"confirmed","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"confirmed","searchable":true,"sortable":true}},"blocked":{"edit":{"label":"blocked","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"blocked","searchable":true,"sortable":true}},"role":{"edit":{"label":"role","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"role","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","username","email","confirmed"],"edit":[[{"name":"username","size":6},{"name":"email","size":6}],[{"name":"password","size":6},{"name":"confirmed","size":4}],[{"name":"blocked","size":4},{"name":"role","size":6}]]},"uid":"plugin::users-permissions.user"}	object	\N	\N
2	plugin_content_manager_configuration_components::shared.slider	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"id","defaultSortBy":"id","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":false,"sortable":false}},"files":{"edit":{"label":"files","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"files","searchable":false,"sortable":false}}},"layouts":{"list":["id","files"],"edit":[[{"name":"files","size":6}]]},"uid":"shared.slider","isComponent":true}	object	\N	\N
3	plugin_content_manager_configuration_components::shared.rich-text	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"id","defaultSortBy":"id","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":false,"sortable":false}},"body":{"edit":{"label":"body","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"body","searchable":false,"sortable":false}}},"layouts":{"list":["id"],"edit":[[{"name":"body","size":12}]]},"uid":"shared.rich-text","isComponent":true}	object	\N	\N
4	plugin_content_manager_configuration_components::shared.quote	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"title","defaultSortBy":"title","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":false,"sortable":false}},"title":{"edit":{"label":"title","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"title","searchable":true,"sortable":true}},"body":{"edit":{"label":"body","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"body","searchable":true,"sortable":true}}},"layouts":{"list":["id","title","body"],"edit":[[{"name":"title","size":6},{"name":"body","size":6}]]},"uid":"shared.quote","isComponent":true}	object	\N	\N
5	plugin_content_manager_configuration_components::shared.media	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"id","defaultSortBy":"id","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":false,"sortable":false}},"file":{"edit":{"label":"file","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"file","searchable":false,"sortable":false}}},"layouts":{"list":["id","file"],"edit":[[{"name":"file","size":6}]]},"uid":"shared.media","isComponent":true}	object	\N	\N
1	strapi_content_types_schema	{"plugin::upload.file":{"collectionName":"files","info":{"singularName":"file","pluralName":"files","displayName":"File","description":""},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","configurable":false,"required":true},"alternativeText":{"type":"string","configurable":false},"caption":{"type":"string","configurable":false},"width":{"type":"integer","configurable":false},"height":{"type":"integer","configurable":false},"formats":{"type":"json","configurable":false},"hash":{"type":"string","configurable":false,"required":true},"ext":{"type":"string","configurable":false},"mime":{"type":"string","configurable":false,"required":true},"size":{"type":"decimal","configurable":false,"required":true},"url":{"type":"string","configurable":false,"required":true},"previewUrl":{"type":"string","configurable":false},"provider":{"type":"string","configurable":false,"required":true},"provider_metadata":{"type":"json","configurable":false},"related":{"type":"relation","relation":"morphToMany","configurable":false},"folder":{"type":"relation","relation":"manyToOne","target":"plugin::upload.folder","inversedBy":"files","private":true},"folderPath":{"type":"string","minLength":1,"required":true,"private":true,"searchable":false},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"plugin::upload.file","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"files"}}},"indexes":[{"name":"upload_files_folder_path_index","columns":["folder_path"],"type":null},{"name":"upload_files_created_at_index","columns":["created_at"],"type":null},{"name":"upload_files_updated_at_index","columns":["updated_at"],"type":null},{"name":"upload_files_name_index","columns":["name"],"type":null},{"name":"upload_files_size_index","columns":["size"],"type":null},{"name":"upload_files_ext_index","columns":["ext"],"type":null}],"plugin":"upload","globalId":"UploadFile","uid":"plugin::upload.file","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"files","info":{"singularName":"file","pluralName":"files","displayName":"File","description":""},"options":{},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","configurable":false,"required":true},"alternativeText":{"type":"string","configurable":false},"caption":{"type":"string","configurable":false},"width":{"type":"integer","configurable":false},"height":{"type":"integer","configurable":false},"formats":{"type":"json","configurable":false},"hash":{"type":"string","configurable":false,"required":true},"ext":{"type":"string","configurable":false},"mime":{"type":"string","configurable":false,"required":true},"size":{"type":"decimal","configurable":false,"required":true},"url":{"type":"string","configurable":false,"required":true},"previewUrl":{"type":"string","configurable":false},"provider":{"type":"string","configurable":false,"required":true},"provider_metadata":{"type":"json","configurable":false},"related":{"type":"relation","relation":"morphToMany","configurable":false},"folder":{"type":"relation","relation":"manyToOne","target":"plugin::upload.folder","inversedBy":"files","private":true},"folderPath":{"type":"string","minLength":1,"required":true,"private":true,"searchable":false}},"kind":"collectionType"},"modelName":"file"},"plugin::upload.folder":{"collectionName":"upload_folders","info":{"singularName":"folder","pluralName":"folders","displayName":"Folder"},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","minLength":1,"required":true},"pathId":{"type":"integer","unique":true,"required":true},"parent":{"type":"relation","relation":"manyToOne","target":"plugin::upload.folder","inversedBy":"children"},"children":{"type":"relation","relation":"oneToMany","target":"plugin::upload.folder","mappedBy":"parent"},"files":{"type":"relation","relation":"oneToMany","target":"plugin::upload.file","mappedBy":"folder"},"path":{"type":"string","minLength":1,"required":true},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"plugin::upload.folder","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"upload_folders"}}},"indexes":[{"name":"upload_folders_path_id_index","columns":["path_id"],"type":"unique"},{"name":"upload_folders_path_index","columns":["path"],"type":"unique"}],"plugin":"upload","globalId":"UploadFolder","uid":"plugin::upload.folder","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"upload_folders","info":{"singularName":"folder","pluralName":"folders","displayName":"Folder"},"options":{},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","minLength":1,"required":true},"pathId":{"type":"integer","unique":true,"required":true},"parent":{"type":"relation","relation":"manyToOne","target":"plugin::upload.folder","inversedBy":"children"},"children":{"type":"relation","relation":"oneToMany","target":"plugin::upload.folder","mappedBy":"parent"},"files":{"type":"relation","relation":"oneToMany","target":"plugin::upload.file","mappedBy":"folder"},"path":{"type":"string","minLength":1,"required":true}},"kind":"collectionType"},"modelName":"folder"},"plugin::i18n.locale":{"info":{"singularName":"locale","pluralName":"locales","collectionName":"locales","displayName":"Locale","description":""},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","min":1,"max":50,"configurable":false},"code":{"type":"string","unique":true,"configurable":false},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"plugin::i18n.locale","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"i18n_locale"}}},"plugin":"i18n","collectionName":"i18n_locale","globalId":"I18NLocale","uid":"plugin::i18n.locale","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"i18n_locale","info":{"singularName":"locale","pluralName":"locales","collectionName":"locales","displayName":"Locale","description":""},"options":{},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","min":1,"max":50,"configurable":false},"code":{"type":"string","unique":true,"configurable":false}},"kind":"collectionType"},"modelName":"locale"},"plugin::content-releases.release":{"collectionName":"strapi_releases","info":{"singularName":"release","pluralName":"releases","displayName":"Release"},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","required":true},"releasedAt":{"type":"datetime"},"scheduledAt":{"type":"datetime"},"timezone":{"type":"string"},"status":{"type":"enumeration","enum":["ready","blocked","failed","done","empty"],"required":true},"actions":{"type":"relation","relation":"oneToMany","target":"plugin::content-releases.release-action","mappedBy":"release"},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"plugin::content-releases.release","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"strapi_releases"}}},"plugin":"content-releases","globalId":"ContentReleasesRelease","uid":"plugin::content-releases.release","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"strapi_releases","info":{"singularName":"release","pluralName":"releases","displayName":"Release"},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","required":true},"releasedAt":{"type":"datetime"},"scheduledAt":{"type":"datetime"},"timezone":{"type":"string"},"status":{"type":"enumeration","enum":["ready","blocked","failed","done","empty"],"required":true},"actions":{"type":"relation","relation":"oneToMany","target":"plugin::content-releases.release-action","mappedBy":"release"}},"kind":"collectionType"},"modelName":"release"},"plugin::content-releases.release-action":{"collectionName":"strapi_release_actions","info":{"singularName":"release-action","pluralName":"release-actions","displayName":"Release Action"},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"type":{"type":"enumeration","enum":["publish","unpublish"],"required":true},"contentType":{"type":"string","required":true},"entryDocumentId":{"type":"string"},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"release":{"type":"relation","relation":"manyToOne","target":"plugin::content-releases.release","inversedBy":"actions"},"isEntryValid":{"type":"boolean"},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"localizations":{"type":"relation","relation":"oneToMany","target":"plugin::content-releases.release-action","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"strapi_release_actions"}}},"plugin":"content-releases","globalId":"ContentReleasesReleaseAction","uid":"plugin::content-releases.release-action","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"strapi_release_actions","info":{"singularName":"release-action","pluralName":"release-actions","displayName":"Release Action"},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"type":{"type":"enumeration","enum":["publish","unpublish"],"required":true},"contentType":{"type":"string","required":true},"entryDocumentId":{"type":"string"},"locale":{"type":"string"},"release":{"type":"relation","relation":"manyToOne","target":"plugin::content-releases.release","inversedBy":"actions"},"isEntryValid":{"type":"boolean"}},"kind":"collectionType"},"modelName":"release-action"},"plugin::review-workflows.workflow":{"collectionName":"strapi_workflows","info":{"name":"Workflow","description":"","singularName":"workflow","pluralName":"workflows","displayName":"Workflow"},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","required":true,"unique":true},"stages":{"type":"relation","target":"plugin::review-workflows.workflow-stage","relation":"oneToMany","mappedBy":"workflow"},"stageRequiredToPublish":{"type":"relation","target":"plugin::review-workflows.workflow-stage","relation":"oneToOne","required":false},"contentTypes":{"type":"json","required":true,"default":"[]"},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"plugin::review-workflows.workflow","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"strapi_workflows"}}},"plugin":"review-workflows","globalId":"ReviewWorkflowsWorkflow","uid":"plugin::review-workflows.workflow","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"strapi_workflows","info":{"name":"Workflow","description":"","singularName":"workflow","pluralName":"workflows","displayName":"Workflow"},"options":{},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","required":true,"unique":true},"stages":{"type":"relation","target":"plugin::review-workflows.workflow-stage","relation":"oneToMany","mappedBy":"workflow"},"stageRequiredToPublish":{"type":"relation","target":"plugin::review-workflows.workflow-stage","relation":"oneToOne","required":false},"contentTypes":{"type":"json","required":true,"default":"[]"}},"kind":"collectionType"},"modelName":"workflow"},"plugin::review-workflows.workflow-stage":{"collectionName":"strapi_workflows_stages","info":{"name":"Workflow Stage","description":"","singularName":"workflow-stage","pluralName":"workflow-stages","displayName":"Stages"},"options":{"version":"1.1.0","draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","configurable":false},"color":{"type":"string","configurable":false,"default":"#4945FF"},"workflow":{"type":"relation","target":"plugin::review-workflows.workflow","relation":"manyToOne","inversedBy":"stages","configurable":false},"permissions":{"type":"relation","target":"admin::permission","relation":"manyToMany","configurable":false},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"plugin::review-workflows.workflow-stage","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"strapi_workflows_stages"}}},"plugin":"review-workflows","globalId":"ReviewWorkflowsWorkflowStage","uid":"plugin::review-workflows.workflow-stage","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"strapi_workflows_stages","info":{"name":"Workflow Stage","description":"","singularName":"workflow-stage","pluralName":"workflow-stages","displayName":"Stages"},"options":{"version":"1.1.0"},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","configurable":false},"color":{"type":"string","configurable":false,"default":"#4945FF"},"workflow":{"type":"relation","target":"plugin::review-workflows.workflow","relation":"manyToOne","inversedBy":"stages","configurable":false},"permissions":{"type":"relation","target":"admin::permission","relation":"manyToMany","configurable":false}},"kind":"collectionType"},"modelName":"workflow-stage"},"plugin::users-permissions.permission":{"collectionName":"up_permissions","info":{"name":"permission","description":"","singularName":"permission","pluralName":"permissions","displayName":"Permission"},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"action":{"type":"string","required":true,"configurable":false},"role":{"type":"relation","relation":"manyToOne","target":"plugin::users-permissions.role","inversedBy":"permissions","configurable":false},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"plugin::users-permissions.permission","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"up_permissions"}}},"plugin":"users-permissions","globalId":"UsersPermissionsPermission","uid":"plugin::users-permissions.permission","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"up_permissions","info":{"name":"permission","description":"","singularName":"permission","pluralName":"permissions","displayName":"Permission"},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"action":{"type":"string","required":true,"configurable":false},"role":{"type":"relation","relation":"manyToOne","target":"plugin::users-permissions.role","inversedBy":"permissions","configurable":false}},"kind":"collectionType"},"modelName":"permission","options":{"draftAndPublish":false}},"plugin::users-permissions.role":{"collectionName":"up_roles","info":{"name":"role","description":"","singularName":"role","pluralName":"roles","displayName":"Role"},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","minLength":3,"required":true,"configurable":false},"description":{"type":"string","configurable":false},"type":{"type":"string","unique":true,"configurable":false},"permissions":{"type":"relation","relation":"oneToMany","target":"plugin::users-permissions.permission","mappedBy":"role","configurable":false},"users":{"type":"relation","relation":"oneToMany","target":"plugin::users-permissions.user","mappedBy":"role","configurable":false},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"plugin::users-permissions.role","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"up_roles"}}},"plugin":"users-permissions","globalId":"UsersPermissionsRole","uid":"plugin::users-permissions.role","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"up_roles","info":{"name":"role","description":"","singularName":"role","pluralName":"roles","displayName":"Role"},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","minLength":3,"required":true,"configurable":false},"description":{"type":"string","configurable":false},"type":{"type":"string","unique":true,"configurable":false},"permissions":{"type":"relation","relation":"oneToMany","target":"plugin::users-permissions.permission","mappedBy":"role","configurable":false},"users":{"type":"relation","relation":"oneToMany","target":"plugin::users-permissions.user","mappedBy":"role","configurable":false}},"kind":"collectionType"},"modelName":"role","options":{"draftAndPublish":false}},"plugin::users-permissions.user":{"collectionName":"up_users","info":{"name":"user","description":"","singularName":"user","pluralName":"users","displayName":"User"},"options":{"timestamps":true,"draftAndPublish":false},"attributes":{"username":{"type":"string","minLength":3,"unique":true,"configurable":false,"required":true},"email":{"type":"email","minLength":6,"configurable":false,"required":true},"provider":{"type":"string","configurable":false},"password":{"type":"password","minLength":6,"configurable":false,"private":true,"searchable":false},"resetPasswordToken":{"type":"string","configurable":false,"private":true,"searchable":false},"confirmationToken":{"type":"string","configurable":false,"private":true,"searchable":false},"confirmed":{"type":"boolean","default":false,"configurable":false},"blocked":{"type":"boolean","default":false,"configurable":false},"role":{"type":"relation","relation":"manyToOne","target":"plugin::users-permissions.role","inversedBy":"users","configurable":false},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"plugin::users-permissions.user","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"up_users"}}},"config":{"attributes":{"resetPasswordToken":{"hidden":true},"confirmationToken":{"hidden":true},"provider":{"hidden":true}}},"plugin":"users-permissions","globalId":"UsersPermissionsUser","uid":"plugin::users-permissions.user","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"up_users","info":{"name":"user","description":"","singularName":"user","pluralName":"users","displayName":"User"},"options":{"timestamps":true},"attributes":{"username":{"type":"string","minLength":3,"unique":true,"configurable":false,"required":true},"email":{"type":"email","minLength":6,"configurable":false,"required":true},"provider":{"type":"string","configurable":false},"password":{"type":"password","minLength":6,"configurable":false,"private":true,"searchable":false},"resetPasswordToken":{"type":"string","configurable":false,"private":true,"searchable":false},"confirmationToken":{"type":"string","configurable":false,"private":true,"searchable":false},"confirmed":{"type":"boolean","default":false,"configurable":false},"blocked":{"type":"boolean","default":false,"configurable":false},"role":{"type":"relation","relation":"manyToOne","target":"plugin::users-permissions.role","inversedBy":"users","configurable":false}},"kind":"collectionType"},"modelName":"user"},"api::banner.banner":{"kind":"collectionType","collectionName":"banners","info":{"singularName":"banner","pluralName":"banners","displayName":"Banner","description":""},"options":{"draftAndPublish":true},"attributes":{"image":{"type":"media","multiple":false,"required":true,"allowedTypes":["images","files","videos","audios"]},"index":{"type":"integer","required":true,"unique":false},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"api::banner.banner","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"banners"}}},"apiName":"banner","globalId":"Banner","uid":"api::banner.banner","modelType":"contentType","__schema__":{"collectionName":"banners","info":{"singularName":"banner","pluralName":"banners","displayName":"Banner","description":""},"options":{"draftAndPublish":true},"attributes":{"image":{"type":"media","multiple":false,"required":true,"allowedTypes":["images","files","videos","audios"]},"index":{"type":"integer","required":true,"unique":false}},"kind":"collectionType"},"modelName":"banner","actions":{},"lifecycles":{}},"api::brand.brand":{"kind":"collectionType","collectionName":"brands","info":{"singularName":"brand","pluralName":"brands","displayName":"Brand","description":""},"options":{"draftAndPublish":true},"attributes":{"name":{"type":"string","required":true,"unique":true},"logo":{"type":"media","multiple":false,"required":false,"allowedTypes":["images","files","videos","audios"]},"isHighlight":{"type":"boolean","default":true,"required":true},"categories":{"type":"relation","relation":"manyToMany","target":"api::category.category","mappedBy":"brands"},"slug":{"type":"uid","targetField":"name","required":true},"hidden_name":{"type":"boolean","default":false,"required":true},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"api::brand.brand","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"brands"}}},"apiName":"brand","globalId":"Brand","uid":"api::brand.brand","modelType":"contentType","__schema__":{"collectionName":"brands","info":{"singularName":"brand","pluralName":"brands","displayName":"Brand","description":""},"options":{"draftAndPublish":true},"attributes":{"name":{"type":"string","required":true,"unique":true},"logo":{"type":"media","multiple":false,"required":false,"allowedTypes":["images","files","videos","audios"]},"isHighlight":{"type":"boolean","default":true,"required":true},"categories":{"type":"relation","relation":"manyToMany","target":"api::category.category","mappedBy":"brands"},"slug":{"type":"uid","targetField":"name","required":true},"hidden_name":{"type":"boolean","default":false,"required":true}},"kind":"collectionType"},"modelName":"brand","actions":{},"lifecycles":{}},"api::category.category":{"kind":"collectionType","collectionName":"categories","info":{"singularName":"category","pluralName":"categories","displayName":"Category","description":"Organize your content into categories"},"options":{"draftAndPublish":true},"pluginOptions":{},"attributes":{"name":{"type":"string","required":true,"unique":true},"description":{"type":"text"},"brands":{"type":"relation","relation":"manyToMany","target":"api::brand.brand","inversedBy":"categories"},"slug":{"type":"uid","targetField":"name","required":true},"image":{"allowedTypes":["images","files","videos","audios"],"type":"media","multiple":false,"required":false},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"api::category.category","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"categories"}}},"apiName":"category","globalId":"Category","uid":"api::category.category","modelType":"contentType","__schema__":{"collectionName":"categories","info":{"singularName":"category","pluralName":"categories","displayName":"Category","description":"Organize your content into categories"},"options":{"draftAndPublish":true},"pluginOptions":{},"attributes":{"name":{"type":"string","required":true,"unique":true},"description":{"type":"text"},"brands":{"type":"relation","relation":"manyToMany","target":"api::brand.brand","inversedBy":"categories"},"slug":{"type":"uid","targetField":"name","required":true},"image":{"allowedTypes":["images","files","videos","audios"],"type":"media","multiple":false,"required":false}},"kind":"collectionType"},"modelName":"category","actions":{},"lifecycles":{}},"api::customer.customer":{"kind":"collectionType","collectionName":"customers","info":{"singularName":"customer","pluralName":"customers","displayName":"Customer"},"options":{"draftAndPublish":true},"attributes":{"full_name":{"type":"string","required":true},"dob":{"type":"date"},"phone_number":{"type":"string","required":true,"unique":true},"address":{"type":"string","required":true},"point":{"type":"biginteger"},"orders":{"type":"relation","relation":"oneToMany","target":"api::order.order","mappedBy":"customer"},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"api::customer.customer","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"customers"}}},"apiName":"customer","globalId":"Customer","uid":"api::customer.customer","modelType":"contentType","__schema__":{"collectionName":"customers","info":{"singularName":"customer","pluralName":"customers","displayName":"Customer"},"options":{"draftAndPublish":true},"attributes":{"full_name":{"type":"string","required":true},"dob":{"type":"date"},"phone_number":{"type":"string","required":true,"unique":true},"address":{"type":"string","required":true},"point":{"type":"biginteger"},"orders":{"type":"relation","relation":"oneToMany","target":"api::order.order","mappedBy":"customer"}},"kind":"collectionType"},"modelName":"customer","actions":{},"lifecycles":{}},"api::global.global":{"kind":"singleType","collectionName":"globals","info":{"singularName":"global","pluralName":"globals","displayName":"Global","description":"Define global settings"},"options":{"draftAndPublish":false},"pluginOptions":{},"attributes":{"siteName":{"type":"string","required":true},"favicon":{"type":"media","multiple":false,"required":false,"allowedTypes":["images","files","videos"]},"siteDescription":{"type":"text","required":true},"defaultSeo":{"type":"component","repeatable":false,"component":"shared.seo"},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"api::global.global","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"globals"}}},"apiName":"global","globalId":"Global","uid":"api::global.global","modelType":"contentType","__schema__":{"collectionName":"globals","info":{"singularName":"global","pluralName":"globals","displayName":"Global","description":"Define global settings"},"options":{"draftAndPublish":false},"pluginOptions":{},"attributes":{"siteName":{"type":"string","required":true},"favicon":{"type":"media","multiple":false,"required":false,"allowedTypes":["images","files","videos"]},"siteDescription":{"type":"text","required":true},"defaultSeo":{"type":"component","repeatable":false,"component":"shared.seo"}},"kind":"singleType"},"modelName":"global","actions":{},"lifecycles":{}},"api::order.order":{"kind":"collectionType","collectionName":"orders","info":{"singularName":"order","pluralName":"orders","displayName":"Order"},"options":{"draftAndPublish":true},"attributes":{"customer":{"type":"relation","relation":"manyToOne","target":"api::customer.customer","inversedBy":"orders"},"shipping_fee":{"required":true,"default":"15000","type":"biginteger"},"point":{"type":"biginteger","required":true,"default":"0"},"order_items":{"type":"relation","relation":"oneToMany","target":"api::order-item.order-item","mappedBy":"order"},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"api::order.order","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"orders"}}},"apiName":"order","globalId":"Order","uid":"api::order.order","modelType":"contentType","__schema__":{"collectionName":"orders","info":{"singularName":"order","pluralName":"orders","displayName":"Order"},"options":{"draftAndPublish":true},"attributes":{"customer":{"type":"relation","relation":"manyToOne","target":"api::customer.customer","inversedBy":"orders"},"shipping_fee":{"required":true,"default":"15000","type":"biginteger"},"point":{"type":"biginteger","required":true,"default":"0"},"order_items":{"type":"relation","relation":"oneToMany","target":"api::order-item.order-item","mappedBy":"order"}},"kind":"collectionType"},"modelName":"order","actions":{},"lifecycles":{}},"api::order-item.order-item":{"kind":"collectionType","collectionName":"order_items","info":{"singularName":"order-item","pluralName":"order-items","displayName":"OrderItem"},"options":{"draftAndPublish":true},"attributes":{"order":{"type":"relation","relation":"manyToOne","target":"api::order.order","inversedBy":"order_items"},"variant":{"type":"relation","relation":"manyToOne","target":"api::variant.variant","inversedBy":"order_items"},"quantity":{"required":true,"type":"biginteger"},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"api::order-item.order-item","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"order_items"}}},"apiName":"order-item","globalId":"OrderItem","uid":"api::order-item.order-item","modelType":"contentType","__schema__":{"collectionName":"order_items","info":{"singularName":"order-item","pluralName":"order-items","displayName":"OrderItem"},"options":{"draftAndPublish":true},"attributes":{"order":{"type":"relation","relation":"manyToOne","target":"api::order.order","inversedBy":"order_items"},"variant":{"type":"relation","relation":"manyToOne","target":"api::variant.variant","inversedBy":"order_items"},"quantity":{"required":true,"type":"biginteger"}},"kind":"collectionType"},"modelName":"order-item","actions":{},"lifecycles":{}},"api::product.product":{"kind":"collectionType","collectionName":"products","info":{"singularName":"product","pluralName":"products","displayName":"Product","description":""},"options":{"draftAndPublish":true},"attributes":{"name":{"type":"text","required":true,"unique":true},"short_description":{"type":"text","required":false},"media":{"type":"media","multiple":true,"required":false,"allowedTypes":["images","files","videos","audios"]},"brand":{"type":"relation","relation":"oneToOne","target":"api::brand.brand"},"category":{"type":"relation","relation":"oneToOne","target":"api::category.category"},"variants":{"type":"relation","relation":"oneToMany","target":"api::variant.variant","mappedBy":"product"},"sold_quantity":{"type":"biginteger","required":true,"default":"399"},"slug":{"type":"uid","targetField":"name","required":true},"detail_description":{"type":"blocks"},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"api::product.product","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"products"}}},"apiName":"product","globalId":"Product","uid":"api::product.product","modelType":"contentType","__schema__":{"collectionName":"products","info":{"singularName":"product","pluralName":"products","displayName":"Product","description":""},"options":{"draftAndPublish":true},"attributes":{"name":{"type":"text","required":true,"unique":true},"short_description":{"type":"text","required":false},"media":{"type":"media","multiple":true,"required":false,"allowedTypes":["images","files","videos","audios"]},"brand":{"type":"relation","relation":"oneToOne","target":"api::brand.brand"},"category":{"type":"relation","relation":"oneToOne","target":"api::category.category"},"variants":{"type":"relation","relation":"oneToMany","target":"api::variant.variant","mappedBy":"product"},"sold_quantity":{"type":"biginteger","required":true,"default":"399"},"slug":{"type":"uid","targetField":"name","required":true},"detail_description":{"type":"blocks"}},"kind":"collectionType"},"modelName":"product","actions":{},"lifecycles":{}},"api::product-list-block.product-list-block":{"kind":"collectionType","collectionName":"product_list_blocks","info":{"singularName":"product-list-block","pluralName":"product-list-blocks","displayName":"ProductListBlock","description":""},"options":{"draftAndPublish":true},"attributes":{"index":{"type":"integer","required":true,"default":1},"products":{"type":"relation","relation":"oneToMany","target":"api::product.product"},"title":{"type":"string","required":true},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"api::product-list-block.product-list-block","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"product_list_blocks"}}},"apiName":"product-list-block","globalId":"ProductListBlock","uid":"api::product-list-block.product-list-block","modelType":"contentType","__schema__":{"collectionName":"product_list_blocks","info":{"singularName":"product-list-block","pluralName":"product-list-blocks","displayName":"ProductListBlock","description":""},"options":{"draftAndPublish":true},"attributes":{"index":{"type":"integer","required":true,"default":1},"products":{"type":"relation","relation":"oneToMany","target":"api::product.product"},"title":{"type":"string","required":true}},"kind":"collectionType"},"modelName":"product-list-block","actions":{},"lifecycles":{}},"api::service.service":{"kind":"collectionType","collectionName":"services","info":{"singularName":"service","pluralName":"services","displayName":"Service","description":""},"options":{"draftAndPublish":true},"attributes":{"price":{"type":"biginteger"},"title":{"type":"text","required":true},"description":{"type":"blocks","required":true},"number_booking":{"type":"biginteger","required":true,"default":"0"},"images":{"allowedTypes":["images","files","videos","audios"],"type":"media","multiple":true},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"api::service.service","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"services"}}},"apiName":"service","globalId":"Service","uid":"api::service.service","modelType":"contentType","__schema__":{"collectionName":"services","info":{"singularName":"service","pluralName":"services","displayName":"Service","description":""},"options":{"draftAndPublish":true},"attributes":{"price":{"type":"biginteger"},"title":{"type":"text","required":true},"description":{"type":"blocks","required":true},"number_booking":{"type":"biginteger","required":true,"default":"0"},"images":{"allowedTypes":["images","files","videos","audios"],"type":"media","multiple":true}},"kind":"collectionType"},"modelName":"service","actions":{},"lifecycles":{}},"api::variant.variant":{"kind":"collectionType","collectionName":"variants","info":{"singularName":"variant","pluralName":"variants","displayName":"Variant","description":""},"options":{"draftAndPublish":true},"attributes":{"variant_option":{"type":"string","required":true},"variant_value":{"type":"string","required":true},"variant_image":{"type":"media","multiple":false,"required":false,"allowedTypes":["images","files","videos","audios"]},"quantity":{"type":"biginteger","unique":false,"default":"0","required":true},"product":{"type":"relation","relation":"manyToOne","target":"api::product.product","inversedBy":"variants"},"base_price":{"type":"biginteger","required":true},"sale_price":{"type":"biginteger","required":true},"SKU":{"type":"string","required":true,"unique":true},"order_items":{"type":"relation","relation":"oneToMany","target":"api::order-item.order-item","mappedBy":"variant"},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"api::variant.variant","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"variants"}}},"apiName":"variant","globalId":"Variant","uid":"api::variant.variant","modelType":"contentType","__schema__":{"collectionName":"variants","info":{"singularName":"variant","pluralName":"variants","displayName":"Variant","description":""},"options":{"draftAndPublish":true},"attributes":{"variant_option":{"type":"string","required":true},"variant_value":{"type":"string","required":true},"variant_image":{"type":"media","multiple":false,"required":false,"allowedTypes":["images","files","videos","audios"]},"quantity":{"type":"biginteger","unique":false,"default":"0","required":true},"product":{"type":"relation","relation":"manyToOne","target":"api::product.product","inversedBy":"variants"},"base_price":{"type":"biginteger","required":true},"sale_price":{"type":"biginteger","required":true},"SKU":{"type":"string","required":true,"unique":true},"order_items":{"type":"relation","relation":"oneToMany","target":"api::order-item.order-item","mappedBy":"variant"}},"kind":"collectionType"},"modelName":"variant","actions":{},"lifecycles":{}},"admin::permission":{"collectionName":"admin_permissions","info":{"name":"Permission","description":"","singularName":"permission","pluralName":"permissions","displayName":"Permission"},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"action":{"type":"string","minLength":1,"configurable":false,"required":true},"actionParameters":{"type":"json","configurable":false,"required":false,"default":{}},"subject":{"type":"string","minLength":1,"configurable":false,"required":false},"properties":{"type":"json","configurable":false,"required":false,"default":{}},"conditions":{"type":"json","configurable":false,"required":false,"default":[]},"role":{"configurable":false,"type":"relation","relation":"manyToOne","inversedBy":"permissions","target":"admin::role"},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"admin::permission","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"admin_permissions"}}},"plugin":"admin","globalId":"AdminPermission","uid":"admin::permission","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"admin_permissions","info":{"name":"Permission","description":"","singularName":"permission","pluralName":"permissions","displayName":"Permission"},"options":{},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"action":{"type":"string","minLength":1,"configurable":false,"required":true},"actionParameters":{"type":"json","configurable":false,"required":false,"default":{}},"subject":{"type":"string","minLength":1,"configurable":false,"required":false},"properties":{"type":"json","configurable":false,"required":false,"default":{}},"conditions":{"type":"json","configurable":false,"required":false,"default":[]},"role":{"configurable":false,"type":"relation","relation":"manyToOne","inversedBy":"permissions","target":"admin::role"}},"kind":"collectionType"},"modelName":"permission"},"admin::user":{"collectionName":"admin_users","info":{"name":"User","description":"","singularName":"user","pluralName":"users","displayName":"User"},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"firstname":{"type":"string","unique":false,"minLength":1,"configurable":false,"required":false},"lastname":{"type":"string","unique":false,"minLength":1,"configurable":false,"required":false},"username":{"type":"string","unique":false,"configurable":false,"required":false},"email":{"type":"email","minLength":6,"configurable":false,"required":true,"unique":true,"private":true},"password":{"type":"password","minLength":6,"configurable":false,"required":false,"private":true,"searchable":false},"resetPasswordToken":{"type":"string","configurable":false,"private":true,"searchable":false},"registrationToken":{"type":"string","configurable":false,"private":true,"searchable":false},"isActive":{"type":"boolean","default":false,"configurable":false,"private":true},"roles":{"configurable":false,"private":true,"type":"relation","relation":"manyToMany","inversedBy":"users","target":"admin::role","collectionName":"strapi_users_roles"},"blocked":{"type":"boolean","default":false,"configurable":false,"private":true},"preferedLanguage":{"type":"string","configurable":false,"required":false,"searchable":false},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"admin::user","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"admin_users"}}},"config":{"attributes":{"resetPasswordToken":{"hidden":true},"registrationToken":{"hidden":true}}},"plugin":"admin","globalId":"AdminUser","uid":"admin::user","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"admin_users","info":{"name":"User","description":"","singularName":"user","pluralName":"users","displayName":"User"},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"firstname":{"type":"string","unique":false,"minLength":1,"configurable":false,"required":false},"lastname":{"type":"string","unique":false,"minLength":1,"configurable":false,"required":false},"username":{"type":"string","unique":false,"configurable":false,"required":false},"email":{"type":"email","minLength":6,"configurable":false,"required":true,"unique":true,"private":true},"password":{"type":"password","minLength":6,"configurable":false,"required":false,"private":true,"searchable":false},"resetPasswordToken":{"type":"string","configurable":false,"private":true,"searchable":false},"registrationToken":{"type":"string","configurable":false,"private":true,"searchable":false},"isActive":{"type":"boolean","default":false,"configurable":false,"private":true},"roles":{"configurable":false,"private":true,"type":"relation","relation":"manyToMany","inversedBy":"users","target":"admin::role","collectionName":"strapi_users_roles"},"blocked":{"type":"boolean","default":false,"configurable":false,"private":true},"preferedLanguage":{"type":"string","configurable":false,"required":false,"searchable":false}},"kind":"collectionType"},"modelName":"user","options":{"draftAndPublish":false}},"admin::role":{"collectionName":"admin_roles","info":{"name":"Role","description":"","singularName":"role","pluralName":"roles","displayName":"Role"},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","minLength":1,"unique":true,"configurable":false,"required":true},"code":{"type":"string","minLength":1,"unique":true,"configurable":false,"required":true},"description":{"type":"string","configurable":false},"users":{"configurable":false,"type":"relation","relation":"manyToMany","mappedBy":"roles","target":"admin::user"},"permissions":{"configurable":false,"type":"relation","relation":"oneToMany","mappedBy":"role","target":"admin::permission"},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"admin::role","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"admin_roles"}}},"plugin":"admin","globalId":"AdminRole","uid":"admin::role","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"admin_roles","info":{"name":"Role","description":"","singularName":"role","pluralName":"roles","displayName":"Role"},"options":{},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","minLength":1,"unique":true,"configurable":false,"required":true},"code":{"type":"string","minLength":1,"unique":true,"configurable":false,"required":true},"description":{"type":"string","configurable":false},"users":{"configurable":false,"type":"relation","relation":"manyToMany","mappedBy":"roles","target":"admin::user"},"permissions":{"configurable":false,"type":"relation","relation":"oneToMany","mappedBy":"role","target":"admin::permission"}},"kind":"collectionType"},"modelName":"role"},"admin::api-token":{"collectionName":"strapi_api_tokens","info":{"name":"Api Token","singularName":"api-token","pluralName":"api-tokens","displayName":"Api Token","description":""},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","minLength":1,"configurable":false,"required":true,"unique":true},"description":{"type":"string","minLength":1,"configurable":false,"required":false,"default":""},"type":{"type":"enumeration","enum":["read-only","full-access","custom"],"configurable":false,"required":true,"default":"read-only"},"accessKey":{"type":"string","minLength":1,"configurable":false,"required":true,"searchable":false},"encryptedKey":{"type":"text","minLength":1,"configurable":false,"required":false,"searchable":false},"lastUsedAt":{"type":"datetime","configurable":false,"required":false},"permissions":{"type":"relation","target":"admin::api-token-permission","relation":"oneToMany","mappedBy":"token","configurable":false,"required":false},"expiresAt":{"type":"datetime","configurable":false,"required":false},"lifespan":{"type":"biginteger","configurable":false,"required":false},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"admin::api-token","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"strapi_api_tokens"}}},"plugin":"admin","globalId":"AdminApiToken","uid":"admin::api-token","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"strapi_api_tokens","info":{"name":"Api Token","singularName":"api-token","pluralName":"api-tokens","displayName":"Api Token","description":""},"options":{},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","minLength":1,"configurable":false,"required":true,"unique":true},"description":{"type":"string","minLength":1,"configurable":false,"required":false,"default":""},"type":{"type":"enumeration","enum":["read-only","full-access","custom"],"configurable":false,"required":true,"default":"read-only"},"accessKey":{"type":"string","minLength":1,"configurable":false,"required":true,"searchable":false},"encryptedKey":{"type":"text","minLength":1,"configurable":false,"required":false,"searchable":false},"lastUsedAt":{"type":"datetime","configurable":false,"required":false},"permissions":{"type":"relation","target":"admin::api-token-permission","relation":"oneToMany","mappedBy":"token","configurable":false,"required":false},"expiresAt":{"type":"datetime","configurable":false,"required":false},"lifespan":{"type":"biginteger","configurable":false,"required":false}},"kind":"collectionType"},"modelName":"api-token"},"admin::api-token-permission":{"collectionName":"strapi_api_token_permissions","info":{"name":"API Token Permission","description":"","singularName":"api-token-permission","pluralName":"api-token-permissions","displayName":"API Token Permission"},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"action":{"type":"string","minLength":1,"configurable":false,"required":true},"token":{"configurable":false,"type":"relation","relation":"manyToOne","inversedBy":"permissions","target":"admin::api-token"},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"admin::api-token-permission","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"strapi_api_token_permissions"}}},"plugin":"admin","globalId":"AdminApiTokenPermission","uid":"admin::api-token-permission","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"strapi_api_token_permissions","info":{"name":"API Token Permission","description":"","singularName":"api-token-permission","pluralName":"api-token-permissions","displayName":"API Token Permission"},"options":{},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"action":{"type":"string","minLength":1,"configurable":false,"required":true},"token":{"configurable":false,"type":"relation","relation":"manyToOne","inversedBy":"permissions","target":"admin::api-token"}},"kind":"collectionType"},"modelName":"api-token-permission"},"admin::transfer-token":{"collectionName":"strapi_transfer_tokens","info":{"name":"Transfer Token","singularName":"transfer-token","pluralName":"transfer-tokens","displayName":"Transfer Token","description":""},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","minLength":1,"configurable":false,"required":true,"unique":true},"description":{"type":"string","minLength":1,"configurable":false,"required":false,"default":""},"accessKey":{"type":"string","minLength":1,"configurable":false,"required":true},"lastUsedAt":{"type":"datetime","configurable":false,"required":false},"permissions":{"type":"relation","target":"admin::transfer-token-permission","relation":"oneToMany","mappedBy":"token","configurable":false,"required":false},"expiresAt":{"type":"datetime","configurable":false,"required":false},"lifespan":{"type":"biginteger","configurable":false,"required":false},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"admin::transfer-token","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"strapi_transfer_tokens"}}},"plugin":"admin","globalId":"AdminTransferToken","uid":"admin::transfer-token","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"strapi_transfer_tokens","info":{"name":"Transfer Token","singularName":"transfer-token","pluralName":"transfer-tokens","displayName":"Transfer Token","description":""},"options":{},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"name":{"type":"string","minLength":1,"configurable":false,"required":true,"unique":true},"description":{"type":"string","minLength":1,"configurable":false,"required":false,"default":""},"accessKey":{"type":"string","minLength":1,"configurable":false,"required":true},"lastUsedAt":{"type":"datetime","configurable":false,"required":false},"permissions":{"type":"relation","target":"admin::transfer-token-permission","relation":"oneToMany","mappedBy":"token","configurable":false,"required":false},"expiresAt":{"type":"datetime","configurable":false,"required":false},"lifespan":{"type":"biginteger","configurable":false,"required":false}},"kind":"collectionType"},"modelName":"transfer-token"},"admin::transfer-token-permission":{"collectionName":"strapi_transfer_token_permissions","info":{"name":"Transfer Token Permission","description":"","singularName":"transfer-token-permission","pluralName":"transfer-token-permissions","displayName":"Transfer Token Permission"},"options":{"draftAndPublish":false},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"action":{"type":"string","minLength":1,"configurable":false,"required":true},"token":{"configurable":false,"type":"relation","relation":"manyToOne","inversedBy":"permissions","target":"admin::transfer-token"},"createdAt":{"type":"datetime"},"updatedAt":{"type":"datetime"},"publishedAt":{"type":"datetime","configurable":false,"writable":true,"visible":false},"createdBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"updatedBy":{"type":"relation","relation":"oneToOne","target":"admin::user","configurable":false,"writable":false,"visible":false,"useJoinTable":false,"private":true},"locale":{"writable":true,"private":true,"configurable":false,"visible":false,"type":"string"},"localizations":{"type":"relation","relation":"oneToMany","target":"admin::transfer-token-permission","writable":false,"private":true,"configurable":false,"visible":false,"unstable_virtual":true,"joinColumn":{"name":"document_id","referencedColumn":"document_id","referencedTable":"strapi_transfer_token_permissions"}}},"plugin":"admin","globalId":"AdminTransferTokenPermission","uid":"admin::transfer-token-permission","modelType":"contentType","kind":"collectionType","__schema__":{"collectionName":"strapi_transfer_token_permissions","info":{"name":"Transfer Token Permission","description":"","singularName":"transfer-token-permission","pluralName":"transfer-token-permissions","displayName":"Transfer Token Permission"},"options":{},"pluginOptions":{"content-manager":{"visible":false},"content-type-builder":{"visible":false}},"attributes":{"action":{"type":"string","minLength":1,"configurable":false,"required":true},"token":{"configurable":false,"type":"relation","relation":"manyToOne","inversedBy":"permissions","target":"admin::transfer-token"}},"kind":"collectionType"},"modelName":"transfer-token-permission"}}	object	\N	\N
11	plugin_content_manager_configuration_content_types::plugin::review-workflows.workflow-stage	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"name","defaultSortBy":"name","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"name":{"edit":{"label":"name","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"name","searchable":true,"sortable":true}},"color":{"edit":{"label":"color","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"color","searchable":true,"sortable":true}},"workflow":{"edit":{"label":"workflow","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"workflow","searchable":true,"sortable":true}},"permissions":{"edit":{"label":"permissions","description":"","placeholder":"","visible":true,"editable":true,"mainField":"action"},"list":{"label":"permissions","searchable":false,"sortable":false}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","name","color","workflow"],"edit":[[{"name":"name","size":6},{"name":"color","size":6}],[{"name":"workflow","size":6},{"name":"permissions","size":6}]]},"uid":"plugin::review-workflows.workflow-stage"}	object	\N	\N
12	plugin_content_manager_configuration_content_types::plugin::i18n.locale	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"name","defaultSortBy":"name","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"name":{"edit":{"label":"name","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"name","searchable":true,"sortable":true}},"code":{"edit":{"label":"code","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"code","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","name","code","createdAt"],"edit":[[{"name":"name","size":6},{"name":"code","size":6}]]},"uid":"plugin::i18n.locale"}	object	\N	\N
13	plugin_content_manager_configuration_content_types::plugin::upload.folder	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"name","defaultSortBy":"name","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"name":{"edit":{"label":"name","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"name","searchable":true,"sortable":true}},"pathId":{"edit":{"label":"pathId","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"pathId","searchable":true,"sortable":true}},"parent":{"edit":{"label":"parent","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"parent","searchable":true,"sortable":true}},"children":{"edit":{"label":"children","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"children","searchable":false,"sortable":false}},"files":{"edit":{"label":"files","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"files","searchable":false,"sortable":false}},"path":{"edit":{"label":"path","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"path","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","name","pathId","parent"],"edit":[[{"name":"name","size":6},{"name":"pathId","size":4}],[{"name":"parent","size":6},{"name":"children","size":6}],[{"name":"files","size":6},{"name":"path","size":6}]]},"uid":"plugin::upload.folder"}	object	\N	\N
14	plugin_content_manager_configuration_content_types::plugin::users-permissions.role	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"name","defaultSortBy":"name","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"name":{"edit":{"label":"name","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"name","searchable":true,"sortable":true}},"description":{"edit":{"label":"description","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"description","searchable":true,"sortable":true}},"type":{"edit":{"label":"type","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"type","searchable":true,"sortable":true}},"permissions":{"edit":{"label":"permissions","description":"","placeholder":"","visible":true,"editable":true,"mainField":"action"},"list":{"label":"permissions","searchable":false,"sortable":false}},"users":{"edit":{"label":"users","description":"","placeholder":"","visible":true,"editable":true,"mainField":"username"},"list":{"label":"users","searchable":false,"sortable":false}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","name","description","type"],"edit":[[{"name":"name","size":6},{"name":"description","size":6}],[{"name":"type","size":6},{"name":"permissions","size":6}],[{"name":"users","size":6}]]},"uid":"plugin::users-permissions.role"}	object	\N	\N
20	plugin_content_manager_configuration_content_types::admin::permission	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"action","defaultSortBy":"action","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"action":{"edit":{"label":"action","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"action","searchable":true,"sortable":true}},"actionParameters":{"edit":{"label":"actionParameters","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"actionParameters","searchable":false,"sortable":false}},"subject":{"edit":{"label":"subject","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"subject","searchable":true,"sortable":true}},"properties":{"edit":{"label":"properties","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"properties","searchable":false,"sortable":false}},"conditions":{"edit":{"label":"conditions","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"conditions","searchable":false,"sortable":false}},"role":{"edit":{"label":"role","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"role","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","action","subject","role"],"edit":[[{"name":"action","size":6}],[{"name":"actionParameters","size":12}],[{"name":"subject","size":6}],[{"name":"properties","size":12}],[{"name":"conditions","size":12}],[{"name":"role","size":6}]]},"uid":"admin::permission"}	object	\N	\N
29	plugin_upload_settings	{"sizeOptimization":true,"responsiveDimensions":true,"autoOrientation":false}	object	\N	\N
30	plugin_upload_view_configuration	{"pageSize":10,"sort":"createdAt:DESC"}	object	\N	\N
31	plugin_upload_metrics	{"weeklySchedule":"44 54 8 * * 2","lastWeeklyUpdate":1748336084034}	object	\N	\N
24	plugin_content_manager_configuration_content_types::admin::transfer-token	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"name","defaultSortBy":"name","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"name":{"edit":{"label":"name","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"name","searchable":true,"sortable":true}},"description":{"edit":{"label":"description","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"description","searchable":true,"sortable":true}},"accessKey":{"edit":{"label":"accessKey","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"accessKey","searchable":true,"sortable":true}},"lastUsedAt":{"edit":{"label":"lastUsedAt","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"lastUsedAt","searchable":true,"sortable":true}},"permissions":{"edit":{"label":"permissions","description":"","placeholder":"","visible":true,"editable":true,"mainField":"action"},"list":{"label":"permissions","searchable":false,"sortable":false}},"expiresAt":{"edit":{"label":"expiresAt","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"expiresAt","searchable":true,"sortable":true}},"lifespan":{"edit":{"label":"lifespan","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"lifespan","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","name","description","accessKey"],"edit":[[{"name":"name","size":6},{"name":"description","size":6}],[{"name":"accessKey","size":6},{"name":"lastUsedAt","size":6}],[{"name":"permissions","size":6},{"name":"expiresAt","size":6}],[{"name":"lifespan","size":4}]]},"uid":"admin::transfer-token"}	object	\N	\N
25	plugin_content_manager_configuration_content_types::admin::user	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"firstname","defaultSortBy":"firstname","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"firstname":{"edit":{"label":"firstname","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"firstname","searchable":true,"sortable":true}},"lastname":{"edit":{"label":"lastname","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"lastname","searchable":true,"sortable":true}},"username":{"edit":{"label":"username","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"username","searchable":true,"sortable":true}},"email":{"edit":{"label":"email","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"email","searchable":true,"sortable":true}},"password":{"edit":{"label":"password","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"password","searchable":true,"sortable":true}},"resetPasswordToken":{"edit":{"label":"resetPasswordToken","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"resetPasswordToken","searchable":true,"sortable":true}},"registrationToken":{"edit":{"label":"registrationToken","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"registrationToken","searchable":true,"sortable":true}},"isActive":{"edit":{"label":"isActive","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"isActive","searchable":true,"sortable":true}},"roles":{"edit":{"label":"roles","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"roles","searchable":false,"sortable":false}},"blocked":{"edit":{"label":"blocked","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"blocked","searchable":true,"sortable":true}},"preferedLanguage":{"edit":{"label":"preferedLanguage","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"preferedLanguage","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","firstname","lastname","username"],"edit":[[{"name":"firstname","size":6},{"name":"lastname","size":6}],[{"name":"username","size":6},{"name":"email","size":6}],[{"name":"password","size":6},{"name":"isActive","size":4}],[{"name":"roles","size":6},{"name":"blocked","size":4}],[{"name":"preferedLanguage","size":6}]]},"uid":"admin::user"}	object	\N	\N
18	plugin_content_manager_configuration_content_types::plugin::users-permissions.permission	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"action","defaultSortBy":"action","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"action":{"edit":{"label":"action","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"action","searchable":true,"sortable":true}},"role":{"edit":{"label":"role","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"role","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","action","role","createdAt"],"edit":[[{"name":"action","size":6},{"name":"role","size":6}]]},"uid":"plugin::users-permissions.permission"}	object	\N	\N
22	plugin_content_manager_configuration_content_types::admin::api-token	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"name","defaultSortBy":"name","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"name":{"edit":{"label":"name","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"name","searchable":true,"sortable":true}},"description":{"edit":{"label":"description","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"description","searchable":true,"sortable":true}},"type":{"edit":{"label":"type","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"type","searchable":true,"sortable":true}},"accessKey":{"edit":{"label":"accessKey","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"accessKey","searchable":true,"sortable":true}},"encryptedKey":{"edit":{"label":"encryptedKey","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"encryptedKey","searchable":true,"sortable":true}},"lastUsedAt":{"edit":{"label":"lastUsedAt","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"lastUsedAt","searchable":true,"sortable":true}},"permissions":{"edit":{"label":"permissions","description":"","placeholder":"","visible":true,"editable":true,"mainField":"action"},"list":{"label":"permissions","searchable":false,"sortable":false}},"expiresAt":{"edit":{"label":"expiresAt","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"expiresAt","searchable":true,"sortable":true}},"lifespan":{"edit":{"label":"lifespan","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"lifespan","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","name","description","type"],"edit":[[{"name":"name","size":6},{"name":"description","size":6}],[{"name":"type","size":6},{"name":"accessKey","size":6}],[{"name":"encryptedKey","size":6},{"name":"lastUsedAt","size":6}],[{"name":"permissions","size":6},{"name":"expiresAt","size":6}],[{"name":"lifespan","size":4}]]},"uid":"admin::api-token"}	object	\N	\N
21	plugin_content_manager_configuration_content_types::admin::role	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"name","defaultSortBy":"name","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"name":{"edit":{"label":"name","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"name","searchable":true,"sortable":true}},"code":{"edit":{"label":"code","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"code","searchable":true,"sortable":true}},"description":{"edit":{"label":"description","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"description","searchable":true,"sortable":true}},"users":{"edit":{"label":"users","description":"","placeholder":"","visible":true,"editable":true,"mainField":"firstname"},"list":{"label":"users","searchable":false,"sortable":false}},"permissions":{"edit":{"label":"permissions","description":"","placeholder":"","visible":true,"editable":true,"mainField":"action"},"list":{"label":"permissions","searchable":false,"sortable":false}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","name","code","description"],"edit":[[{"name":"name","size":6},{"name":"code","size":6}],[{"name":"description","size":6},{"name":"users","size":6}],[{"name":"permissions","size":6}]]},"uid":"admin::role"}	object	\N	\N
28	plugin_content_manager_configuration_content_types::admin::transfer-token-permission	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"action","defaultSortBy":"action","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"action":{"edit":{"label":"action","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"action","searchable":true,"sortable":true}},"token":{"edit":{"label":"token","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"token","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","action","token","createdAt"],"edit":[[{"name":"action","size":6},{"name":"token","size":6}]]},"uid":"admin::transfer-token-permission"}	object	\N	\N
32	plugin_i18n_default_locale	"en"	string	\N	\N
33	plugin_users-permissions_grant	{"email":{"icon":"envelope","enabled":true},"discord":{"icon":"discord","enabled":false,"key":"","secret":"","callbackUrl":"api/auth/discord/callback","scope":["identify","email"]},"facebook":{"icon":"facebook-square","enabled":false,"key":"","secret":"","callbackUrl":"api/auth/facebook/callback","scope":["email"]},"google":{"icon":"google","enabled":false,"key":"","secret":"","callbackUrl":"api/auth/google/callback","scope":["email"]},"github":{"icon":"github","enabled":false,"key":"","secret":"","callbackUrl":"api/auth/github/callback","scope":["user","user:email"]},"microsoft":{"icon":"windows","enabled":false,"key":"","secret":"","callbackUrl":"api/auth/microsoft/callback","scope":["user.read"]},"twitter":{"icon":"twitter","enabled":false,"key":"","secret":"","callbackUrl":"api/auth/twitter/callback"},"instagram":{"icon":"instagram","enabled":false,"key":"","secret":"","callbackUrl":"api/auth/instagram/callback","scope":["user_profile"]},"vk":{"icon":"vk","enabled":false,"key":"","secret":"","callbackUrl":"api/auth/vk/callback","scope":["email"]},"twitch":{"icon":"twitch","enabled":false,"key":"","secret":"","callbackUrl":"api/auth/twitch/callback","scope":["user:read:email"]},"linkedin":{"icon":"linkedin","enabled":false,"key":"","secret":"","callbackUrl":"api/auth/linkedin/callback","scope":["r_liteprofile","r_emailaddress"]},"cognito":{"icon":"aws","enabled":false,"key":"","secret":"","subdomain":"my.subdomain.com","callback":"api/auth/cognito/callback","scope":["email","openid","profile"]},"reddit":{"icon":"reddit","enabled":false,"key":"","secret":"","callback":"api/auth/reddit/callback","scope":["identity"]},"auth0":{"icon":"","enabled":false,"key":"","secret":"","subdomain":"my-tenant.eu","callback":"api/auth/auth0/callback","scope":["openid","email","profile"]},"cas":{"icon":"book","enabled":false,"key":"","secret":"","callback":"api/auth/cas/callback","scope":["openid email"],"subdomain":"my.subdomain.com/cas"},"patreon":{"icon":"","enabled":false,"key":"","secret":"","callback":"api/auth/patreon/callback","scope":["identity","identity[email]"]},"keycloak":{"icon":"","enabled":false,"key":"","secret":"","subdomain":"myKeycloakProvider.com/realms/myrealm","callback":"api/auth/keycloak/callback","scope":["openid","email","profile"]}}	object	\N	\N
23	plugin_content_manager_configuration_content_types::admin::api-token-permission	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"action","defaultSortBy":"action","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"action":{"edit":{"label":"action","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"action","searchable":true,"sortable":true}},"token":{"edit":{"label":"token","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"token","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","action","token","createdAt"],"edit":[[{"name":"action","size":6},{"name":"token","size":6}]]},"uid":"admin::api-token-permission"}	object	\N	\N
27	plugin_content_manager_configuration_content_types::api::global.global	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"siteName","defaultSortBy":"siteName","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"siteName":{"edit":{"label":"siteName","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"siteName","searchable":true,"sortable":true}},"favicon":{"edit":{"label":"favicon","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"favicon","searchable":false,"sortable":false}},"siteDescription":{"edit":{"label":"siteDescription","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"siteDescription","searchable":true,"sortable":true}},"defaultSeo":{"edit":{"label":"defaultSeo","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"defaultSeo","searchable":false,"sortable":false}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","siteName","favicon","siteDescription"],"edit":[[{"name":"siteName","size":6},{"name":"favicon","size":6}],[{"name":"siteDescription","size":6}],[{"name":"defaultSeo","size":12}]]},"uid":"api::global.global"}	object	\N	\N
34	plugin_users-permissions_email	{"reset_password":{"display":"Email.template.reset_password","icon":"sync","options":{"from":{"name":"Administration Panel","email":"no-reply@strapi.io"},"response_email":"","object":"Reset password","message":"<p>We heard that you lost your password. Sorry about that!</p>\\n\\n<p>But don’t worry! You can use the following link to reset your password:</p>\\n<p><%= URL %>?code=<%= TOKEN %></p>\\n\\n<p>Thanks.</p>"}},"email_confirmation":{"display":"Email.template.email_confirmation","icon":"check-square","options":{"from":{"name":"Administration Panel","email":"no-reply@strapi.io"},"response_email":"","object":"Account confirmation","message":"<p>Thank you for registering!</p>\\n\\n<p>You have to confirm your email address. Please click on the link below.</p>\\n\\n<p><%= URL %>?confirmation=<%= CODE %></p>\\n\\n<p>Thanks.</p>"}}}	object	\N	\N
35	plugin_users-permissions_advanced	{"unique_email":true,"allow_register":true,"email_confirmation":false,"email_reset_password":null,"email_confirmation_redirection":null,"default_role":"authenticated"}	object	\N	\N
6	plugin_content_manager_configuration_components::shared.seo	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"metaTitle","defaultSortBy":"metaTitle","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":false,"sortable":false}},"metaTitle":{"edit":{"label":"metaTitle","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"metaTitle","searchable":true,"sortable":true}},"metaDescription":{"edit":{"label":"metaDescription","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"metaDescription","searchable":true,"sortable":true}},"shareImage":{"edit":{"label":"shareImage","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"shareImage","searchable":false,"sortable":false}}},"layouts":{"list":["id","metaTitle","metaDescription","shareImage"],"edit":[[{"name":"metaTitle","size":6},{"name":"metaDescription","size":6}],[{"name":"shareImage","size":6}]]},"uid":"shared.seo","isComponent":true}	object	\N	\N
39	plugin_content_manager_configuration_content_types::api::product.product	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"id","defaultSortBy":"id","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"name":{"edit":{"label":"Tên sản phẩm","description":"","placeholder":"Ví dụ dầu gội Thái Dương, nước rửa chén Sunlight,...","visible":true,"editable":true},"list":{"label":"name","searchable":true,"sortable":true}},"short_description":{"edit":{"label":"Mô tả ngắn","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"short_description","searchable":true,"sortable":true}},"media":{"edit":{"label":"Ảnh sản phẩm","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"media","searchable":false,"sortable":false}},"brand":{"edit":{"label":"Thương hiệu","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"brand","searchable":true,"sortable":true}},"category":{"edit":{"label":"Danh mục","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"category","searchable":true,"sortable":true}},"detail_description":{"edit":{"label":"Mô tả chi tiết","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"detail_description","searchable":false,"sortable":false}},"variants":{"edit":{"label":"Các biến thể","description":"","placeholder":"","visible":true,"editable":true,"mainField":"SKU"},"list":{"label":"variants","searchable":false,"sortable":false}},"sold_quantity":{"edit":{"label":"sold_quantity","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"sold_quantity","searchable":true,"sortable":true}},"slug":{"edit":{"label":"slug","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"slug","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","name","short_description","media"],"edit":[[{"name":"name","size":6},{"name":"short_description","size":6}],[{"name":"media","size":6}],[{"name":"brand","size":6}],[{"name":"category","size":6}],[{"name":"detail_description","size":12}],[{"name":"variants","size":6},{"name":"sold_quantity","size":4}],[{"name":"slug","size":6}]]},"uid":"api::product.product"}	object	\N	\N
36	core_admin_auth	{"providers":{"autoRegister":false,"defaultRole":null,"ssoLockedRoles":null}}	object	\N	\N
43	plugin_content_manager_configuration_content_types::api::variant.variant	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"variant_option","defaultSortBy":"variant_option","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"variant_option":{"edit":{"label":"Tên phân loại","description":"","placeholder":"Vị dụ màu sắc, kích thước, phân loại,...","visible":true,"editable":true},"list":{"label":"tên phân loại","searchable":true,"sortable":true}},"variant_value":{"edit":{"label":"Giá trị phân loại","description":"","placeholder":"Ví dụ đỏ, cam, xanh, size XL, size M,...","visible":true,"editable":true},"list":{"label":"giá trị phân loại","searchable":true,"sortable":true}},"variant_image":{"edit":{"label":"Ảnh biến thể","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"ảnh biến thể","searchable":false,"sortable":false}},"quantity":{"edit":{"label":"Số lượng khả dụng","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"quantity","searchable":true,"sortable":true}},"product":{"edit":{"label":"Biến thể thuộc sản phẩm ","description":"","placeholder":"","visible":true,"editable":true,"mainField":"id"},"list":{"label":"product","searchable":true,"sortable":true}},"base_price":{"edit":{"label":"Giá gốc","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"base_price","searchable":true,"sortable":true}},"sale_price":{"edit":{"label":"Giá bán thực tế","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"sale_price","searchable":true,"sortable":true}},"SKU":{"edit":{"label":"Mã SKU","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"SKU","searchable":true,"sortable":true}},"order_items":{"edit":{"label":"order_items","description":"","placeholder":"","visible":true,"editable":true,"mainField":"id"},"list":{"label":"order_items","searchable":false,"sortable":false}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","variant_option","variant_value","variant_image","SKU"],"edit":[[{"name":"variant_option","size":6},{"name":"variant_value","size":6}],[{"name":"variant_image","size":6},{"name":"quantity","size":4}],[{"name":"base_price","size":4}],[{"name":"sale_price","size":4},{"name":"SKU","size":6}],[{"name":"order_items","size":6}]]},"uid":"api::variant.variant"}	object	\N	\N
44	plugin_content_manager_configuration_content_types::api::customer.customer	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"full_name","defaultSortBy":"full_name","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"full_name":{"edit":{"label":"full_name","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"full_name","searchable":true,"sortable":true}},"dob":{"edit":{"label":"dob","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"dob","searchable":true,"sortable":true}},"phone_number":{"edit":{"label":"phone_number","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"phone_number","searchable":true,"sortable":true}},"address":{"edit":{"label":"address","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"address","searchable":true,"sortable":true}},"point":{"edit":{"label":"point","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"point","searchable":true,"sortable":true}},"orders":{"edit":{"label":"orders","description":"","placeholder":"","visible":true,"editable":true,"mainField":"id"},"list":{"label":"orders","searchable":false,"sortable":false}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","full_name","dob","phone_number"],"edit":[[{"name":"full_name","size":6},{"name":"dob","size":4}],[{"name":"phone_number","size":6},{"name":"address","size":6}],[{"name":"point","size":4},{"name":"orders","size":6}]]},"uid":"api::customer.customer"}	object	\N	\N
46	plugin_content_manager_configuration_content_types::api::order-item.order-item	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"id","defaultSortBy":"id","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"order":{"edit":{"label":"order","description":"","placeholder":"","visible":true,"editable":true,"mainField":"id"},"list":{"label":"order","searchable":true,"sortable":true}},"variant":{"edit":{"label":"variant","description":"","placeholder":"","visible":true,"editable":true,"mainField":"variant_option"},"list":{"label":"variant","searchable":true,"sortable":true}},"quantity":{"edit":{"label":"quantity","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"quantity","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","order","variant","quantity"],"edit":[[{"name":"order","size":6},{"name":"variant","size":6}],[{"name":"quantity","size":4}]]},"uid":"api::order-item.order-item"}	object	\N	\N
37	plugin_content_manager_configuration_content_types::api::brand.brand	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"name","defaultSortBy":"name","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"name":{"edit":{"label":"Tên thương hiệu","description":"","placeholder":"Ví dụ Thái Dương, Omo, Sunlight,...","visible":true,"editable":true},"list":{"label":"Tên thương hiệu","searchable":true,"sortable":true}},"logo":{"edit":{"label":"logo","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"logo","searchable":false,"sortable":false}},"isHighlight":{"edit":{"label":"Được highlight lên trang chính","description":"chọn true nếu muốn thương hiệu này được xuất hiên trên trang chính","placeholder":"","visible":true,"editable":true},"list":{"label":"Được highlight lên trang chính","searchable":true,"sortable":true}},"categories":{"edit":{"label":"categories","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"categories","searchable":false,"sortable":false}},"slug":{"edit":{"label":"slug","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"slug","searchable":true,"sortable":true}},"hidden_name":{"edit":{"label":"ẩn tên thương hiệu (ở trang chủ)","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"hidden_name","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"edit":[[{"name":"name","size":6},{"name":"logo","size":6}],[{"name":"isHighlight","size":4},{"name":"categories","size":6}],[{"name":"slug","size":6},{"name":"hidden_name","size":4}]],"list":["id","name","logo","isHighlight"]},"uid":"api::brand.brand"}	object	\N	\N
45	plugin_content_manager_configuration_content_types::api::order.order	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"id","defaultSortBy":"id","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"customer":{"edit":{"label":"customer","description":"","placeholder":"","visible":true,"editable":true,"mainField":"full_name"},"list":{"label":"customer","searchable":true,"sortable":true}},"shipping_fee":{"edit":{"label":"shipping_fee","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"shipping_fee","searchable":true,"sortable":true}},"point":{"edit":{"label":"point","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"point","searchable":true,"sortable":true}},"order_items":{"edit":{"label":"order_items","description":"","placeholder":"","visible":true,"editable":true,"mainField":"id"},"list":{"label":"order_items","searchable":false,"sortable":false}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","customer","shipping_fee","point"],"edit":[[{"name":"customer","size":6},{"name":"shipping_fee","size":4}],[{"name":"point","size":4},{"name":"order_items","size":6}]]},"uid":"api::order.order"}	object	\N	\N
26	plugin_content_manager_configuration_content_types::api::category.category	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"name","defaultSortBy":"name","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"name":{"edit":{"label":"Tên phân loại sản phẩm","description":"","placeholder":"Ví dụ dầu gội, sữa rửa mặt,...","visible":true,"editable":true},"list":{"label":"Tên phân loại sản phẩm","searchable":true,"sortable":true}},"description":{"edit":{"label":"Mô tả (có thể để trống)","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"description","searchable":true,"sortable":true}},"brands":{"edit":{"label":"brands","description":"","placeholder":"","visible":true,"editable":true,"mainField":"name"},"list":{"label":"brands","searchable":false,"sortable":false}},"slug":{"edit":{"label":"slug","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"slug","searchable":true,"sortable":true}},"image":{"edit":{"label":"image","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"image","searchable":false,"sortable":false}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","name","brands","slug"],"edit":[[{"name":"name","size":6}],[{"name":"description","size":6},{"name":"brands","size":6}],[{"name":"slug","size":6},{"name":"image","size":6}]]},"uid":"api::category.category"}	object	\N	\N
47	plugin_content_manager_configuration_content_types::api::product-list-block.product-list-block	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"title","defaultSortBy":"title","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"index":{"edit":{"label":"index","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"index","searchable":true,"sortable":true}},"products":{"edit":{"label":"products","description":"","placeholder":"","visible":true,"editable":true,"mainField":"id"},"list":{"label":"products","searchable":false,"sortable":false}},"title":{"edit":{"label":"title","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"title","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"edit":[[{"name":"index","size":4},{"name":"products","size":6}],[{"name":"title","size":6}]],"list":["id","index","products","title"]},"uid":"api::product-list-block.product-list-block"}	object	\N	\N
48	plugin_content_manager_configuration_content_types::api::service.service	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"id","defaultSortBy":"id","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"price":{"edit":{"label":"price","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"price","searchable":true,"sortable":true}},"title":{"edit":{"label":"title","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"title","searchable":true,"sortable":true}},"description":{"edit":{"label":"description","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"description","searchable":false,"sortable":false}},"number_booking":{"edit":{"label":"number_booking","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"number_booking","searchable":true,"sortable":true}},"images":{"edit":{"label":"images","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"images","searchable":false,"sortable":false}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","price","title","number_booking"],"edit":[[{"name":"price","size":4},{"name":"title","size":6}],[{"name":"description","size":12}],[{"name":"number_booking","size":4},{"name":"images","size":6}]]},"uid":"api::service.service"}	object	\N	\N
49	plugin_content_manager_configuration_content_types::api::banner.banner	{"settings":{"bulkable":true,"filterable":true,"searchable":true,"pageSize":10,"mainField":"id","defaultSortBy":"id","defaultSortOrder":"ASC"},"metadatas":{"id":{"edit":{},"list":{"label":"id","searchable":true,"sortable":true}},"image":{"edit":{"label":"image","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"image","searchable":false,"sortable":false}},"index":{"edit":{"label":"index","description":"","placeholder":"","visible":true,"editable":true},"list":{"label":"index","searchable":true,"sortable":true}},"createdAt":{"edit":{"label":"createdAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"createdAt","searchable":true,"sortable":true}},"updatedAt":{"edit":{"label":"updatedAt","description":"","placeholder":"","visible":false,"editable":true},"list":{"label":"updatedAt","searchable":true,"sortable":true}},"createdBy":{"edit":{"label":"createdBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"createdBy","searchable":true,"sortable":true}},"updatedBy":{"edit":{"label":"updatedBy","description":"","placeholder":"","visible":false,"editable":true,"mainField":"firstname"},"list":{"label":"updatedBy","searchable":true,"sortable":true}}},"layouts":{"list":["id","image","createdAt","updatedAt"],"edit":[[{"name":"image","size":6},{"name":"index","size":4}]]},"uid":"api::banner.banner"}	object	\N	\N
\.


--
-- Data for Name: strapi_database_schema; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_database_schema (id, schema, "time", hash) FROM stdin;
38	{"tables":[{"name":"files","indexes":[{"name":"upload_files_folder_path_index","columns":["folder_path"],"type":null},{"name":"upload_files_created_at_index","columns":["created_at"],"type":null},{"name":"upload_files_updated_at_index","columns":["updated_at"],"type":null},{"name":"upload_files_name_index","columns":["name"],"type":null},{"name":"upload_files_size_index","columns":["size"],"type":null},{"name":"upload_files_ext_index","columns":["ext"],"type":null},{"name":"files_documents_idx","columns":["document_id","locale","published_at"]},{"name":"files_created_by_id_fk","columns":["created_by_id"]},{"name":"files_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"files_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"files_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"alternative_text","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"caption","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"width","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"height","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"formats","type":"jsonb","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"hash","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"ext","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"mime","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"size","type":"decimal","args":[10,2],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"url","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"preview_url","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"provider","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"provider_metadata","type":"jsonb","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"folder_path","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"upload_folders","indexes":[{"name":"upload_folders_path_id_index","columns":["path_id"],"type":"unique"},{"name":"upload_folders_path_index","columns":["path"],"type":"unique"},{"name":"upload_folders_documents_idx","columns":["document_id","locale","published_at"]},{"name":"upload_folders_created_by_id_fk","columns":["created_by_id"]},{"name":"upload_folders_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"upload_folders_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"upload_folders_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"path_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"path","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"i18n_locale","indexes":[{"name":"i18n_locale_documents_idx","columns":["document_id","locale","published_at"]},{"name":"i18n_locale_created_by_id_fk","columns":["created_by_id"]},{"name":"i18n_locale_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"i18n_locale_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"i18n_locale_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"code","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"strapi_releases","indexes":[{"name":"strapi_releases_documents_idx","columns":["document_id","locale","published_at"]},{"name":"strapi_releases_created_by_id_fk","columns":["created_by_id"]},{"name":"strapi_releases_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"strapi_releases_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"strapi_releases_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"released_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"scheduled_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"timezone","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"status","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"strapi_release_actions","indexes":[{"name":"strapi_release_actions_documents_idx","columns":["document_id","locale","published_at"]},{"name":"strapi_release_actions_created_by_id_fk","columns":["created_by_id"]},{"name":"strapi_release_actions_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"strapi_release_actions_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"strapi_release_actions_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"type","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"content_type","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"entry_document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"is_entry_valid","type":"boolean","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"strapi_workflows","indexes":[{"name":"strapi_workflows_documents_idx","columns":["document_id","locale","published_at"]},{"name":"strapi_workflows_created_by_id_fk","columns":["created_by_id"]},{"name":"strapi_workflows_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"strapi_workflows_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"strapi_workflows_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"content_types","type":"jsonb","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"strapi_workflows_stages","indexes":[{"name":"strapi_workflows_stages_documents_idx","columns":["document_id","locale","published_at"]},{"name":"strapi_workflows_stages_created_by_id_fk","columns":["created_by_id"]},{"name":"strapi_workflows_stages_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"strapi_workflows_stages_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"strapi_workflows_stages_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"color","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"up_permissions","indexes":[{"name":"up_permissions_documents_idx","columns":["document_id","locale","published_at"]},{"name":"up_permissions_created_by_id_fk","columns":["created_by_id"]},{"name":"up_permissions_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"up_permissions_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"up_permissions_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"action","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"up_roles","indexes":[{"name":"up_roles_documents_idx","columns":["document_id","locale","published_at"]},{"name":"up_roles_created_by_id_fk","columns":["created_by_id"]},{"name":"up_roles_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"up_roles_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"up_roles_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"description","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"type","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"up_users","indexes":[{"name":"up_users_documents_idx","columns":["document_id","locale","published_at"]},{"name":"up_users_created_by_id_fk","columns":["created_by_id"]},{"name":"up_users_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"up_users_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"up_users_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"username","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"email","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"provider","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"password","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"reset_password_token","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"confirmation_token","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"confirmed","type":"boolean","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"blocked","type":"boolean","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"banners","indexes":[{"name":"banners_documents_idx","columns":["document_id","locale","published_at"]},{"name":"banners_created_by_id_fk","columns":["created_by_id"]},{"name":"banners_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"banners_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"banners_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"index","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"brands","indexes":[{"name":"brands_documents_idx","columns":["document_id","locale","published_at"]},{"name":"brands_created_by_id_fk","columns":["created_by_id"]},{"name":"brands_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"brands_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"brands_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"is_highlight","type":"boolean","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"slug","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"hidden_name","type":"boolean","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"categories","indexes":[{"name":"categories_documents_idx","columns":["document_id","locale","published_at"]},{"name":"categories_created_by_id_fk","columns":["created_by_id"]},{"name":"categories_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"categories_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"categories_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"description","type":"text","args":["longtext"],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"slug","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"customers","indexes":[{"name":"customers_documents_idx","columns":["document_id","locale","published_at"]},{"name":"customers_created_by_id_fk","columns":["created_by_id"]},{"name":"customers_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"customers_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"customers_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"full_name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"dob","type":"date","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"phone_number","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"address","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"point","type":"bigInteger","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"globals_cmps","indexes":[{"name":"globals_field_idx","columns":["field"]},{"name":"globals_component_type_idx","columns":["component_type"]},{"name":"globals_entity_fk","columns":["entity_id"]},{"name":"globals_uq","columns":["entity_id","cmp_id","field","component_type"],"type":"unique"}],"foreignKeys":[{"name":"globals_entity_fk","columns":["entity_id"],"referencedColumns":["id"],"referencedTable":"globals","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"entity_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"cmp_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"component_type","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"field","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"order","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"globals","indexes":[{"name":"globals_documents_idx","columns":["document_id","locale","published_at"]},{"name":"globals_created_by_id_fk","columns":["created_by_id"]},{"name":"globals_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"globals_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"globals_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"site_name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"site_description","type":"text","args":["longtext"],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"orders","indexes":[{"name":"orders_documents_idx","columns":["document_id","locale","published_at"]},{"name":"orders_created_by_id_fk","columns":["created_by_id"]},{"name":"orders_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"orders_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"orders_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"shipping_fee","type":"bigInteger","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"point","type":"bigInteger","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"order_items","indexes":[{"name":"order_items_documents_idx","columns":["document_id","locale","published_at"]},{"name":"order_items_created_by_id_fk","columns":["created_by_id"]},{"name":"order_items_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"order_items_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"order_items_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"quantity","type":"bigInteger","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"products","indexes":[{"name":"products_documents_idx","columns":["document_id","locale","published_at"]},{"name":"products_created_by_id_fk","columns":["created_by_id"]},{"name":"products_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"products_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"products_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"name","type":"text","args":["longtext"],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"short_description","type":"text","args":["longtext"],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"sold_quantity","type":"bigInteger","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"slug","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"detail_description","type":"jsonb","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"product_list_blocks","indexes":[{"name":"product_list_blocks_documents_idx","columns":["document_id","locale","published_at"]},{"name":"product_list_blocks_created_by_id_fk","columns":["created_by_id"]},{"name":"product_list_blocks_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"product_list_blocks_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"product_list_blocks_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"index","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"title","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"services","indexes":[{"name":"services_documents_idx","columns":["document_id","locale","published_at"]},{"name":"services_created_by_id_fk","columns":["created_by_id"]},{"name":"services_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"services_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"services_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"price","type":"bigInteger","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"title","type":"text","args":["longtext"],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"description","type":"jsonb","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"number_booking","type":"bigInteger","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"variants","indexes":[{"name":"variants_documents_idx","columns":["document_id","locale","published_at"]},{"name":"variants_created_by_id_fk","columns":["created_by_id"]},{"name":"variants_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"variants_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"variants_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"variant_option","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"variant_value","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"quantity","type":"bigInteger","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"base_price","type":"bigInteger","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"sale_price","type":"bigInteger","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"sku","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"admin_permissions","indexes":[{"name":"admin_permissions_documents_idx","columns":["document_id","locale","published_at"]},{"name":"admin_permissions_created_by_id_fk","columns":["created_by_id"]},{"name":"admin_permissions_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"admin_permissions_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"admin_permissions_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"action","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"action_parameters","type":"jsonb","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"subject","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"properties","type":"jsonb","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"conditions","type":"jsonb","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"admin_users","indexes":[{"name":"admin_users_documents_idx","columns":["document_id","locale","published_at"]},{"name":"admin_users_created_by_id_fk","columns":["created_by_id"]},{"name":"admin_users_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"admin_users_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"admin_users_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"firstname","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"lastname","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"username","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"email","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"password","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"reset_password_token","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"registration_token","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"is_active","type":"boolean","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"blocked","type":"boolean","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"prefered_language","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"admin_roles","indexes":[{"name":"admin_roles_documents_idx","columns":["document_id","locale","published_at"]},{"name":"admin_roles_created_by_id_fk","columns":["created_by_id"]},{"name":"admin_roles_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"admin_roles_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"admin_roles_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"code","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"description","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"strapi_api_tokens","indexes":[{"name":"strapi_api_tokens_documents_idx","columns":["document_id","locale","published_at"]},{"name":"strapi_api_tokens_created_by_id_fk","columns":["created_by_id"]},{"name":"strapi_api_tokens_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"strapi_api_tokens_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"strapi_api_tokens_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"description","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"type","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"access_key","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"encrypted_key","type":"text","args":["longtext"],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"last_used_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"expires_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"lifespan","type":"bigInteger","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"strapi_api_token_permissions","indexes":[{"name":"strapi_api_token_permissions_documents_idx","columns":["document_id","locale","published_at"]},{"name":"strapi_api_token_permissions_created_by_id_fk","columns":["created_by_id"]},{"name":"strapi_api_token_permissions_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"strapi_api_token_permissions_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"strapi_api_token_permissions_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"action","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"strapi_transfer_tokens","indexes":[{"name":"strapi_transfer_tokens_documents_idx","columns":["document_id","locale","published_at"]},{"name":"strapi_transfer_tokens_created_by_id_fk","columns":["created_by_id"]},{"name":"strapi_transfer_tokens_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"strapi_transfer_tokens_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"strapi_transfer_tokens_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"description","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"access_key","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"last_used_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"expires_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"lifespan","type":"bigInteger","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"strapi_transfer_token_permissions","indexes":[{"name":"strapi_transfer_token_permissions_documents_idx","columns":["document_id","locale","published_at"]},{"name":"strapi_transfer_token_permissions_created_by_id_fk","columns":["created_by_id"]},{"name":"strapi_transfer_token_permissions_updated_by_id_fk","columns":["updated_by_id"]}],"foreignKeys":[{"name":"strapi_transfer_token_permissions_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"},{"name":"strapi_transfer_token_permissions_updated_by_id_fk","columns":["updated_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"action","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"updated_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"published_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"updated_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"components_shared_sliders","indexes":[],"foreignKeys":[],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false}]},{"name":"components_shared_seos","indexes":[],"foreignKeys":[],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"meta_title","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"meta_description","type":"text","args":["longtext"],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"components_shared_rich_texts","indexes":[],"foreignKeys":[],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"body","type":"text","args":["longtext"],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"components_shared_quotes","indexes":[],"foreignKeys":[],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"title","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"body","type":"text","args":["longtext"],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"components_shared_media","indexes":[],"foreignKeys":[],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false}]},{"name":"strapi_core_store_settings","indexes":[],"foreignKeys":[],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"key","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"value","type":"text","args":["longtext"],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"type","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"environment","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"tag","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"strapi_webhooks","indexes":[],"foreignKeys":[],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"name","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"url","type":"text","args":["longtext"],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"headers","type":"jsonb","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"events","type":"jsonb","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"enabled","type":"boolean","args":[],"defaultTo":null,"notNullable":false,"unsigned":false}]},{"name":"strapi_history_versions","indexes":[{"name":"strapi_history_versions_created_by_id_fk","columns":["created_by_id"]}],"foreignKeys":[{"name":"strapi_history_versions_created_by_id_fk","columns":["created_by_id"],"referencedTable":"admin_users","referencedColumns":["id"],"onDelete":"SET NULL"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"content_type","type":"string","args":[],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"related_document_id","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"locale","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"status","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"data","type":"jsonb","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"schema","type":"jsonb","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_at","type":"datetime","args":[{"useTz":false,"precision":6}],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"created_by_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"files_related_mph","indexes":[{"name":"files_related_mph_fk","columns":["file_id"]},{"name":"files_related_mph_oidx","columns":["order"]},{"name":"files_related_mph_idix","columns":["related_id"]}],"foreignKeys":[{"name":"files_related_mph_fk","columns":["file_id"],"referencedColumns":["id"],"referencedTable":"files","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"file_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"related_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"related_type","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"field","type":"string","args":[],"defaultTo":null,"notNullable":false,"unsigned":false},{"name":"order","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"files_folder_lnk","indexes":[{"name":"files_folder_lnk_fk","columns":["file_id"]},{"name":"files_folder_lnk_ifk","columns":["folder_id"]},{"name":"files_folder_lnk_uq","columns":["file_id","folder_id"],"type":"unique"},{"name":"files_folder_lnk_oifk","columns":["file_ord"]}],"foreignKeys":[{"name":"files_folder_lnk_fk","columns":["file_id"],"referencedColumns":["id"],"referencedTable":"files","onDelete":"CASCADE"},{"name":"files_folder_lnk_ifk","columns":["folder_id"],"referencedColumns":["id"],"referencedTable":"upload_folders","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"file_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"folder_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"file_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"upload_folders_parent_lnk","indexes":[{"name":"upload_folders_parent_lnk_fk","columns":["folder_id"]},{"name":"upload_folders_parent_lnk_ifk","columns":["inv_folder_id"]},{"name":"upload_folders_parent_lnk_uq","columns":["folder_id","inv_folder_id"],"type":"unique"},{"name":"upload_folders_parent_lnk_oifk","columns":["folder_ord"]}],"foreignKeys":[{"name":"upload_folders_parent_lnk_fk","columns":["folder_id"],"referencedColumns":["id"],"referencedTable":"upload_folders","onDelete":"CASCADE"},{"name":"upload_folders_parent_lnk_ifk","columns":["inv_folder_id"],"referencedColumns":["id"],"referencedTable":"upload_folders","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"folder_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"inv_folder_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"folder_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"strapi_release_actions_release_lnk","indexes":[{"name":"strapi_release_actions_release_lnk_fk","columns":["release_action_id"]},{"name":"strapi_release_actions_release_lnk_ifk","columns":["release_id"]},{"name":"strapi_release_actions_release_lnk_uq","columns":["release_action_id","release_id"],"type":"unique"},{"name":"strapi_release_actions_release_lnk_oifk","columns":["release_action_ord"]}],"foreignKeys":[{"name":"strapi_release_actions_release_lnk_fk","columns":["release_action_id"],"referencedColumns":["id"],"referencedTable":"strapi_release_actions","onDelete":"CASCADE"},{"name":"strapi_release_actions_release_lnk_ifk","columns":["release_id"],"referencedColumns":["id"],"referencedTable":"strapi_releases","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"release_action_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"release_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"release_action_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"strapi_workflows_stage_required_to_publish_lnk","indexes":[{"name":"strapi_workflows_stage_required_to_publish_lnk_fk","columns":["workflow_id"]},{"name":"strapi_workflows_stage_required_to_publish_lnk_ifk","columns":["workflow_stage_id"]},{"name":"strapi_workflows_stage_required_to_publish_lnk_uq","columns":["workflow_id","workflow_stage_id"],"type":"unique"}],"foreignKeys":[{"name":"strapi_workflows_stage_required_to_publish_lnk_fk","columns":["workflow_id"],"referencedColumns":["id"],"referencedTable":"strapi_workflows","onDelete":"CASCADE"},{"name":"strapi_workflows_stage_required_to_publish_lnk_ifk","columns":["workflow_stage_id"],"referencedColumns":["id"],"referencedTable":"strapi_workflows_stages","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"workflow_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"workflow_stage_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"strapi_workflows_stages_workflow_lnk","indexes":[{"name":"strapi_workflows_stages_workflow_lnk_fk","columns":["workflow_stage_id"]},{"name":"strapi_workflows_stages_workflow_lnk_ifk","columns":["workflow_id"]},{"name":"strapi_workflows_stages_workflow_lnk_uq","columns":["workflow_stage_id","workflow_id"],"type":"unique"},{"name":"strapi_workflows_stages_workflow_lnk_oifk","columns":["workflow_stage_ord"]}],"foreignKeys":[{"name":"strapi_workflows_stages_workflow_lnk_fk","columns":["workflow_stage_id"],"referencedColumns":["id"],"referencedTable":"strapi_workflows_stages","onDelete":"CASCADE"},{"name":"strapi_workflows_stages_workflow_lnk_ifk","columns":["workflow_id"],"referencedColumns":["id"],"referencedTable":"strapi_workflows","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"workflow_stage_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"workflow_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"workflow_stage_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"strapi_workflows_stages_permissions_lnk","indexes":[{"name":"strapi_workflows_stages_permissions_lnk_fk","columns":["workflow_stage_id"]},{"name":"strapi_workflows_stages_permissions_lnk_ifk","columns":["permission_id"]},{"name":"strapi_workflows_stages_permissions_lnk_uq","columns":["workflow_stage_id","permission_id"],"type":"unique"},{"name":"strapi_workflows_stages_permissions_lnk_ofk","columns":["permission_ord"]}],"foreignKeys":[{"name":"strapi_workflows_stages_permissions_lnk_fk","columns":["workflow_stage_id"],"referencedColumns":["id"],"referencedTable":"strapi_workflows_stages","onDelete":"CASCADE"},{"name":"strapi_workflows_stages_permissions_lnk_ifk","columns":["permission_id"],"referencedColumns":["id"],"referencedTable":"admin_permissions","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"workflow_stage_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"permission_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"permission_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"up_permissions_role_lnk","indexes":[{"name":"up_permissions_role_lnk_fk","columns":["permission_id"]},{"name":"up_permissions_role_lnk_ifk","columns":["role_id"]},{"name":"up_permissions_role_lnk_uq","columns":["permission_id","role_id"],"type":"unique"},{"name":"up_permissions_role_lnk_oifk","columns":["permission_ord"]}],"foreignKeys":[{"name":"up_permissions_role_lnk_fk","columns":["permission_id"],"referencedColumns":["id"],"referencedTable":"up_permissions","onDelete":"CASCADE"},{"name":"up_permissions_role_lnk_ifk","columns":["role_id"],"referencedColumns":["id"],"referencedTable":"up_roles","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"permission_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"role_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"permission_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"up_users_role_lnk","indexes":[{"name":"up_users_role_lnk_fk","columns":["user_id"]},{"name":"up_users_role_lnk_ifk","columns":["role_id"]},{"name":"up_users_role_lnk_uq","columns":["user_id","role_id"],"type":"unique"},{"name":"up_users_role_lnk_oifk","columns":["user_ord"]}],"foreignKeys":[{"name":"up_users_role_lnk_fk","columns":["user_id"],"referencedColumns":["id"],"referencedTable":"up_users","onDelete":"CASCADE"},{"name":"up_users_role_lnk_ifk","columns":["role_id"],"referencedColumns":["id"],"referencedTable":"up_roles","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"user_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"role_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"user_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"categories_brands_lnk","indexes":[{"name":"categories_brands_lnk_fk","columns":["category_id"]},{"name":"categories_brands_lnk_ifk","columns":["brand_id"]},{"name":"categories_brands_lnk_uq","columns":["category_id","brand_id"],"type":"unique"},{"name":"categories_brands_lnk_ofk","columns":["brand_ord"]},{"name":"categories_brands_lnk_oifk","columns":["category_ord"]}],"foreignKeys":[{"name":"categories_brands_lnk_fk","columns":["category_id"],"referencedColumns":["id"],"referencedTable":"categories","onDelete":"CASCADE"},{"name":"categories_brands_lnk_ifk","columns":["brand_id"],"referencedColumns":["id"],"referencedTable":"brands","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"category_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"brand_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"brand_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"category_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"orders_customer_lnk","indexes":[{"name":"orders_customer_lnk_fk","columns":["order_id"]},{"name":"orders_customer_lnk_ifk","columns":["customer_id"]},{"name":"orders_customer_lnk_uq","columns":["order_id","customer_id"],"type":"unique"},{"name":"orders_customer_lnk_oifk","columns":["order_ord"]}],"foreignKeys":[{"name":"orders_customer_lnk_fk","columns":["order_id"],"referencedColumns":["id"],"referencedTable":"orders","onDelete":"CASCADE"},{"name":"orders_customer_lnk_ifk","columns":["customer_id"],"referencedColumns":["id"],"referencedTable":"customers","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"order_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"customer_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"order_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"order_items_order_lnk","indexes":[{"name":"order_items_order_lnk_fk","columns":["order_item_id"]},{"name":"order_items_order_lnk_ifk","columns":["order_id"]},{"name":"order_items_order_lnk_uq","columns":["order_item_id","order_id"],"type":"unique"},{"name":"order_items_order_lnk_oifk","columns":["order_item_ord"]}],"foreignKeys":[{"name":"order_items_order_lnk_fk","columns":["order_item_id"],"referencedColumns":["id"],"referencedTable":"order_items","onDelete":"CASCADE"},{"name":"order_items_order_lnk_ifk","columns":["order_id"],"referencedColumns":["id"],"referencedTable":"orders","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"order_item_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"order_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"order_item_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"order_items_variant_lnk","indexes":[{"name":"order_items_variant_lnk_fk","columns":["order_item_id"]},{"name":"order_items_variant_lnk_ifk","columns":["variant_id"]},{"name":"order_items_variant_lnk_uq","columns":["order_item_id","variant_id"],"type":"unique"},{"name":"order_items_variant_lnk_oifk","columns":["order_item_ord"]}],"foreignKeys":[{"name":"order_items_variant_lnk_fk","columns":["order_item_id"],"referencedColumns":["id"],"referencedTable":"order_items","onDelete":"CASCADE"},{"name":"order_items_variant_lnk_ifk","columns":["variant_id"],"referencedColumns":["id"],"referencedTable":"variants","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"order_item_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"variant_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"order_item_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"products_brand_lnk","indexes":[{"name":"products_brand_lnk_fk","columns":["product_id"]},{"name":"products_brand_lnk_ifk","columns":["brand_id"]},{"name":"products_brand_lnk_uq","columns":["product_id","brand_id"],"type":"unique"}],"foreignKeys":[{"name":"products_brand_lnk_fk","columns":["product_id"],"referencedColumns":["id"],"referencedTable":"products","onDelete":"CASCADE"},{"name":"products_brand_lnk_ifk","columns":["brand_id"],"referencedColumns":["id"],"referencedTable":"brands","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"product_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"brand_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"products_category_lnk","indexes":[{"name":"products_category_lnk_fk","columns":["product_id"]},{"name":"products_category_lnk_ifk","columns":["category_id"]},{"name":"products_category_lnk_uq","columns":["product_id","category_id"],"type":"unique"}],"foreignKeys":[{"name":"products_category_lnk_fk","columns":["product_id"],"referencedColumns":["id"],"referencedTable":"products","onDelete":"CASCADE"},{"name":"products_category_lnk_ifk","columns":["category_id"],"referencedColumns":["id"],"referencedTable":"categories","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"product_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"category_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"product_list_blocks_products_lnk","indexes":[{"name":"product_list_blocks_products_lnk_fk","columns":["product_list_block_id"]},{"name":"product_list_blocks_products_lnk_ifk","columns":["product_id"]},{"name":"product_list_blocks_products_lnk_uq","columns":["product_list_block_id","product_id"],"type":"unique"},{"name":"product_list_blocks_products_lnk_ofk","columns":["product_ord"]}],"foreignKeys":[{"name":"product_list_blocks_products_lnk_fk","columns":["product_list_block_id"],"referencedColumns":["id"],"referencedTable":"product_list_blocks","onDelete":"CASCADE"},{"name":"product_list_blocks_products_lnk_ifk","columns":["product_id"],"referencedColumns":["id"],"referencedTable":"products","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"product_list_block_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"product_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"product_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"variants_product_lnk","indexes":[{"name":"variants_product_lnk_fk","columns":["variant_id"]},{"name":"variants_product_lnk_ifk","columns":["product_id"]},{"name":"variants_product_lnk_uq","columns":["variant_id","product_id"],"type":"unique"},{"name":"variants_product_lnk_oifk","columns":["variant_ord"]}],"foreignKeys":[{"name":"variants_product_lnk_fk","columns":["variant_id"],"referencedColumns":["id"],"referencedTable":"variants","onDelete":"CASCADE"},{"name":"variants_product_lnk_ifk","columns":["product_id"],"referencedColumns":["id"],"referencedTable":"products","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"variant_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"product_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"variant_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"admin_permissions_role_lnk","indexes":[{"name":"admin_permissions_role_lnk_fk","columns":["permission_id"]},{"name":"admin_permissions_role_lnk_ifk","columns":["role_id"]},{"name":"admin_permissions_role_lnk_uq","columns":["permission_id","role_id"],"type":"unique"},{"name":"admin_permissions_role_lnk_oifk","columns":["permission_ord"]}],"foreignKeys":[{"name":"admin_permissions_role_lnk_fk","columns":["permission_id"],"referencedColumns":["id"],"referencedTable":"admin_permissions","onDelete":"CASCADE"},{"name":"admin_permissions_role_lnk_ifk","columns":["role_id"],"referencedColumns":["id"],"referencedTable":"admin_roles","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"permission_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"role_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"permission_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"admin_users_roles_lnk","indexes":[{"name":"admin_users_roles_lnk_fk","columns":["user_id"]},{"name":"admin_users_roles_lnk_ifk","columns":["role_id"]},{"name":"admin_users_roles_lnk_uq","columns":["user_id","role_id"],"type":"unique"},{"name":"admin_users_roles_lnk_ofk","columns":["role_ord"]},{"name":"admin_users_roles_lnk_oifk","columns":["user_ord"]}],"foreignKeys":[{"name":"admin_users_roles_lnk_fk","columns":["user_id"],"referencedColumns":["id"],"referencedTable":"admin_users","onDelete":"CASCADE"},{"name":"admin_users_roles_lnk_ifk","columns":["role_id"],"referencedColumns":["id"],"referencedTable":"admin_roles","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"user_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"role_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"role_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"user_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"strapi_api_token_permissions_token_lnk","indexes":[{"name":"strapi_api_token_permissions_token_lnk_fk","columns":["api_token_permission_id"]},{"name":"strapi_api_token_permissions_token_lnk_ifk","columns":["api_token_id"]},{"name":"strapi_api_token_permissions_token_lnk_uq","columns":["api_token_permission_id","api_token_id"],"type":"unique"},{"name":"strapi_api_token_permissions_token_lnk_oifk","columns":["api_token_permission_ord"]}],"foreignKeys":[{"name":"strapi_api_token_permissions_token_lnk_fk","columns":["api_token_permission_id"],"referencedColumns":["id"],"referencedTable":"strapi_api_token_permissions","onDelete":"CASCADE"},{"name":"strapi_api_token_permissions_token_lnk_ifk","columns":["api_token_id"],"referencedColumns":["id"],"referencedTable":"strapi_api_tokens","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"api_token_permission_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"api_token_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"api_token_permission_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]},{"name":"strapi_transfer_token_permissions_token_lnk","indexes":[{"name":"strapi_transfer_token_permissions_token_lnk_fk","columns":["transfer_token_permission_id"]},{"name":"strapi_transfer_token_permissions_token_lnk_ifk","columns":["transfer_token_id"]},{"name":"strapi_transfer_token_permissions_token_lnk_uq","columns":["transfer_token_permission_id","transfer_token_id"],"type":"unique"},{"name":"strapi_transfer_token_permissions_token_lnk_oifk","columns":["transfer_token_permission_ord"]}],"foreignKeys":[{"name":"strapi_transfer_token_permissions_token_lnk_fk","columns":["transfer_token_permission_id"],"referencedColumns":["id"],"referencedTable":"strapi_transfer_token_permissions","onDelete":"CASCADE"},{"name":"strapi_transfer_token_permissions_token_lnk_ifk","columns":["transfer_token_id"],"referencedColumns":["id"],"referencedTable":"strapi_transfer_tokens","onDelete":"CASCADE"}],"columns":[{"name":"id","type":"increments","args":[{"primary":true,"primaryKey":true}],"defaultTo":null,"notNullable":true,"unsigned":false},{"name":"transfer_token_permission_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"transfer_token_id","type":"integer","args":[],"defaultTo":null,"notNullable":false,"unsigned":true},{"name":"transfer_token_permission_ord","type":"double","args":[],"defaultTo":null,"notNullable":false,"unsigned":true}]}]}	2025-05-29 15:22:18.224	5ecb8904987bac51465d8d6072b4057e
\.


--
-- Data for Name: strapi_history_versions; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_history_versions (id, content_type, related_document_id, locale, status, data, schema, created_at, created_by_id) FROM stdin;
\.


--
-- Data for Name: strapi_migrations; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_migrations (id, name, "time") FROM stdin;
\.


--
-- Data for Name: strapi_migrations_internal; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_migrations_internal (id, name, "time") FROM stdin;
1	5.0.0-rename-identifiers-longer-than-max-length	2025-05-19 17:57:25.127
2	5.0.0-02-created-document-id	2025-05-19 17:57:25.236
3	5.0.0-03-created-locale	2025-05-19 17:57:25.332
4	5.0.0-04-created-published-at	2025-05-19 17:57:25.424
5	5.0.0-05-drop-slug-fields-index	2025-05-19 17:57:25.504
6	core::5.0.0-discard-drafts	2025-05-19 17:57:25.588
\.


--
-- Data for Name: strapi_release_actions; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_release_actions (id, document_id, type, content_type, entry_document_id, locale, is_entry_valid, created_at, updated_at, published_at, created_by_id, updated_by_id) FROM stdin;
\.


--
-- Data for Name: strapi_release_actions_release_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_release_actions_release_lnk (id, release_action_id, release_id, release_action_ord) FROM stdin;
\.


--
-- Data for Name: strapi_releases; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_releases (id, document_id, name, released_at, scheduled_at, timezone, status, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
\.


--
-- Data for Name: strapi_transfer_token_permissions; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_transfer_token_permissions (id, document_id, action, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
\.


--
-- Data for Name: strapi_transfer_token_permissions_token_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_transfer_token_permissions_token_lnk (id, transfer_token_permission_id, transfer_token_id, transfer_token_permission_ord) FROM stdin;
\.


--
-- Data for Name: strapi_transfer_tokens; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_transfer_tokens (id, document_id, name, description, access_key, last_used_at, expires_at, lifespan, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
\.


--
-- Data for Name: strapi_webhooks; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_webhooks (id, name, url, headers, events, enabled) FROM stdin;
\.


--
-- Data for Name: strapi_workflows; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_workflows (id, document_id, name, content_types, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
\.


--
-- Data for Name: strapi_workflows_stage_required_to_publish_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_workflows_stage_required_to_publish_lnk (id, workflow_id, workflow_stage_id) FROM stdin;
\.


--
-- Data for Name: strapi_workflows_stages; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_workflows_stages (id, document_id, name, color, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
\.


--
-- Data for Name: strapi_workflows_stages_permissions_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_workflows_stages_permissions_lnk (id, workflow_stage_id, permission_id, permission_ord) FROM stdin;
\.


--
-- Data for Name: strapi_workflows_stages_workflow_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.strapi_workflows_stages_workflow_lnk (id, workflow_stage_id, workflow_id, workflow_stage_ord) FROM stdin;
\.


--
-- Data for Name: up_permissions; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.up_permissions (id, document_id, action, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
1	tk45sgykvz6zq2iavkgkn7r7	plugin::users-permissions.user.me	2025-05-19 17:57:27.812	2025-05-19 17:57:27.812	2025-05-19 17:57:27.813	\N	\N	\N
2	vh9i6hzxsjenwniswbmbluwv	plugin::users-permissions.auth.changePassword	2025-05-19 17:57:27.812	2025-05-19 17:57:27.812	2025-05-19 17:57:27.814	\N	\N	\N
3	bacelxztk1suuqgubsa9q3k4	plugin::users-permissions.auth.callback	2025-05-19 17:57:27.831	2025-05-19 17:57:27.831	2025-05-19 17:57:27.831	\N	\N	\N
4	pvllhtmlo4172vyh83a4pnji	plugin::users-permissions.auth.connect	2025-05-19 17:57:27.831	2025-05-19 17:57:27.831	2025-05-19 17:57:27.832	\N	\N	\N
5	qwtdlhx41id50gchirfn8zml	plugin::users-permissions.auth.forgotPassword	2025-05-19 17:57:27.831	2025-05-19 17:57:27.831	2025-05-19 17:57:27.832	\N	\N	\N
7	s59h02ytorb7kb4k75g2svgd	plugin::users-permissions.auth.register	2025-05-19 17:57:27.831	2025-05-19 17:57:27.831	2025-05-19 17:57:27.833	\N	\N	\N
6	fyf6ut9vb7uqu9cj4zl4igld	plugin::users-permissions.auth.resetPassword	2025-05-19 17:57:27.831	2025-05-19 17:57:27.831	2025-05-19 17:57:27.832	\N	\N	\N
8	n9agwihouiykfrcmfdbti6d9	plugin::users-permissions.auth.emailConfirmation	2025-05-19 17:57:27.831	2025-05-19 17:57:27.831	2025-05-19 17:57:27.833	\N	\N	\N
9	g2ivu1tjjh77zgf6p4njjvb5	plugin::users-permissions.auth.sendEmailConfirmation	2025-05-19 17:57:27.831	2025-05-19 17:57:27.831	2025-05-19 17:57:27.833	\N	\N	\N
\.


--
-- Data for Name: up_permissions_role_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.up_permissions_role_lnk (id, permission_id, role_id, permission_ord) FROM stdin;
1	2	1	1
2	1	1	1
3	3	2	1
4	4	2	1
5	7	2	1
6	5	2	1
7	6	2	1
8	8	2	1
9	9	2	2
\.


--
-- Data for Name: up_roles; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.up_roles (id, document_id, name, description, type, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
1	y4l3jaalfebxxornzfirnswb	Authenticated	Default role given to authenticated user.	authenticated	2025-05-19 17:57:27.797	2025-05-19 17:57:27.797	2025-05-19 17:57:27.797	\N	\N	\N
2	ekzrdc40n2jloc6ww4no1q9z	Public	Default role given to unauthenticated user.	public	2025-05-19 17:57:27.802	2025-05-19 17:57:27.802	2025-05-19 17:57:27.802	\N	\N	\N
\.


--
-- Data for Name: up_users; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.up_users (id, document_id, username, email, provider, password, reset_password_token, confirmation_token, confirmed, blocked, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
\.


--
-- Data for Name: up_users_role_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.up_users_role_lnk (id, user_id, role_id, user_ord) FROM stdin;
\.


--
-- Data for Name: upload_folders; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.upload_folders (id, document_id, name, path_id, path, created_at, updated_at, published_at, created_by_id, updated_by_id, locale) FROM stdin;
\.


--
-- Data for Name: upload_folders_parent_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.upload_folders_parent_lnk (id, folder_id, inv_folder_id, folder_ord) FROM stdin;
\.


--
-- Data for Name: variants; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.variants (id, document_id, variant_option, variant_value, quantity, created_at, updated_at, published_at, created_by_id, updated_by_id, locale, base_price, sale_price, sku) FROM stdin;
1	g6vueffzda3f1rfm3t7lduf8	Dung tích	Chai lớn hương đậu nành 120ml	0	2025-05-20 15:52:21.205	2025-05-20 16:18:07.36	\N	1	1	\N	120000	120000	DIVI-123
4	g6vueffzda3f1rfm3t7lduf8	Dung tích	Chai lớn hương đậu nành 120ml	0	2025-05-20 15:52:21.205	2025-05-20 16:18:07.36	2025-05-20 16:18:07.43	1	1	\N	120000	120000	DIVI-123
5	xehaihn8ylhoicsql0liyncv	Dung tích	Chai nhỏ hương dâu tằm 90ml	20	2025-05-20 16:19:09.022	2025-05-27 16:56:25.452	\N	1	1	\N	80000	69000	DIVI-122
7	xehaihn8ylhoicsql0liyncv	Dung tích	Chai nhỏ hương dâu tằm 90ml	20	2025-05-20 16:19:09.022	2025-05-27 16:56:25.452	2025-05-27 16:56:25.705	1	1	\N	80000	69000	DIVI-122
10	t0vleim7dz2tffouikmc8m5a	Phân loại	Dụng cụ ủ tóc abc	30	2025-05-27 17:10:53.343	2025-05-27 17:10:53.343	\N	1	1	\N	400000	400000	DIVI-9221
11	t0vleim7dz2tffouikmc8m5a	Phân loại	Dụng cụ ủ tóc abc	30	2025-05-27 17:10:53.343	2025-05-27 17:10:53.343	2025-05-27 17:10:53.396	1	1	\N	400000	400000	DIVI-9221
12	yaif5h3cprgjjkizeovfbj4m	dung tích	300ml	3900	2025-05-28 17:54:35.29	2025-05-28 17:54:35.29	\N	1	1	\N	20000	18000	DIVI-1232
13	yaif5h3cprgjjkizeovfbj4m	dung tích	300ml	3900	2025-05-28 17:54:35.29	2025-05-28 17:54:35.29	2025-05-28 17:54:35.428	1	1	\N	20000	18000	DIVI-1232
\.


--
-- Data for Name: variants_product_lnk; Type: TABLE DATA; Schema: public; Owner: dinhanh
--

COPY public.variants_product_lnk (id, variant_id, product_id, variant_ord) FROM stdin;
25	10	12	0
26	11	13	1
20	5	10	1
21	1	10	2
27	12	10	3
28	7	14	1
29	4	14	2
30	13	14	3
\.


--
-- Name: admin_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.admin_permissions_id_seq', 282, true);


--
-- Name: admin_permissions_role_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.admin_permissions_role_lnk_id_seq', 282, true);


--
-- Name: admin_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.admin_roles_id_seq', 3, true);


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 1, true);


--
-- Name: admin_users_roles_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.admin_users_roles_lnk_id_seq', 1, true);


--
-- Name: banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.banners_id_seq', 6, true);


--
-- Name: brands_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.brands_id_seq', 30, true);


--
-- Name: categories_brands_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.categories_brands_lnk_id_seq', 36, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.categories_id_seq', 14, true);


--
-- Name: components_shared_media_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.components_shared_media_id_seq', 1, false);


--
-- Name: components_shared_quotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.components_shared_quotes_id_seq', 1, false);


--
-- Name: components_shared_rich_texts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.components_shared_rich_texts_id_seq', 1, false);


--
-- Name: components_shared_seos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.components_shared_seos_id_seq', 1, false);


--
-- Name: components_shared_sliders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.components_shared_sliders_id_seq', 1, false);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, false);


--
-- Name: files_folder_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.files_folder_lnk_id_seq', 1, false);


--
-- Name: files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.files_id_seq', 17, true);


--
-- Name: files_related_mph_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.files_related_mph_id_seq', 111, true);


--
-- Name: globals_cmps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.globals_cmps_id_seq', 1, false);


--
-- Name: globals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.globals_id_seq', 1, false);


--
-- Name: i18n_locale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.i18n_locale_id_seq', 1, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: order_items_order_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.order_items_order_lnk_id_seq', 1, false);


--
-- Name: order_items_variant_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.order_items_variant_lnk_id_seq', 1, false);


--
-- Name: orders_customer_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.orders_customer_lnk_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: product_list_blocks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.product_list_blocks_id_seq', 9, true);


--
-- Name: product_list_blocks_products_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.product_list_blocks_products_lnk_id_seq', 14, true);


--
-- Name: products_brand_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.products_brand_lnk_id_seq', 14, true);


--
-- Name: products_category_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.products_category_lnk_id_seq', 14, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.products_id_seq', 14, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.services_id_seq', 4, true);


--
-- Name: strapi_api_token_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_api_token_permissions_id_seq', 14, true);


--
-- Name: strapi_api_token_permissions_token_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_api_token_permissions_token_lnk_id_seq', 14, true);


--
-- Name: strapi_api_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_api_tokens_id_seq', 3, true);


--
-- Name: strapi_core_store_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_core_store_settings_id_seq', 49, true);


--
-- Name: strapi_database_schema_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_database_schema_id_seq', 38, true);


--
-- Name: strapi_history_versions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_history_versions_id_seq', 1, false);


--
-- Name: strapi_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_migrations_id_seq', 1, false);


--
-- Name: strapi_migrations_internal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_migrations_internal_id_seq', 6, true);


--
-- Name: strapi_release_actions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_release_actions_id_seq', 1, false);


--
-- Name: strapi_release_actions_release_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_release_actions_release_lnk_id_seq', 1, false);


--
-- Name: strapi_releases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_releases_id_seq', 1, false);


--
-- Name: strapi_transfer_token_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_transfer_token_permissions_id_seq', 1, false);


--
-- Name: strapi_transfer_token_permissions_token_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_transfer_token_permissions_token_lnk_id_seq', 1, false);


--
-- Name: strapi_transfer_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_transfer_tokens_id_seq', 1, false);


--
-- Name: strapi_webhooks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_webhooks_id_seq', 1, false);


--
-- Name: strapi_workflows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_workflows_id_seq', 1, false);


--
-- Name: strapi_workflows_stage_required_to_publish_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_workflows_stage_required_to_publish_lnk_id_seq', 1, false);


--
-- Name: strapi_workflows_stages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_workflows_stages_id_seq', 1, false);


--
-- Name: strapi_workflows_stages_permissions_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_workflows_stages_permissions_lnk_id_seq', 1, false);


--
-- Name: strapi_workflows_stages_workflow_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.strapi_workflows_stages_workflow_lnk_id_seq', 1, false);


--
-- Name: up_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.up_permissions_id_seq', 9, true);


--
-- Name: up_permissions_role_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.up_permissions_role_lnk_id_seq', 9, true);


--
-- Name: up_roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.up_roles_id_seq', 2, true);


--
-- Name: up_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.up_users_id_seq', 1, false);


--
-- Name: up_users_role_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.up_users_role_lnk_id_seq', 1, false);


--
-- Name: upload_folders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.upload_folders_id_seq', 1, false);


--
-- Name: upload_folders_parent_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.upload_folders_parent_lnk_id_seq', 1, false);


--
-- Name: variants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.variants_id_seq', 13, true);


--
-- Name: variants_product_lnk_id_seq; Type: SEQUENCE SET; Schema: public; Owner: dinhanh
--

SELECT pg_catalog.setval('public.variants_product_lnk_id_seq', 30, true);


--
-- Name: admin_permissions admin_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_pkey PRIMARY KEY (id);


--
-- Name: admin_permissions_role_lnk admin_permissions_role_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_permissions_role_lnk
    ADD CONSTRAINT admin_permissions_role_lnk_pkey PRIMARY KEY (id);


--
-- Name: admin_permissions_role_lnk admin_permissions_role_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_permissions_role_lnk
    ADD CONSTRAINT admin_permissions_role_lnk_uq UNIQUE (permission_id, role_id);


--
-- Name: admin_roles admin_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: admin_users_roles_lnk admin_users_roles_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_users_roles_lnk
    ADD CONSTRAINT admin_users_roles_lnk_pkey PRIMARY KEY (id);


--
-- Name: admin_users_roles_lnk admin_users_roles_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_users_roles_lnk
    ADD CONSTRAINT admin_users_roles_lnk_uq UNIQUE (user_id, role_id);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY (id);


--
-- Name: categories_brands_lnk categories_brands_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.categories_brands_lnk
    ADD CONSTRAINT categories_brands_lnk_pkey PRIMARY KEY (id);


--
-- Name: categories_brands_lnk categories_brands_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.categories_brands_lnk
    ADD CONSTRAINT categories_brands_lnk_uq UNIQUE (category_id, brand_id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: components_shared_media components_shared_media_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.components_shared_media
    ADD CONSTRAINT components_shared_media_pkey PRIMARY KEY (id);


--
-- Name: components_shared_quotes components_shared_quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.components_shared_quotes
    ADD CONSTRAINT components_shared_quotes_pkey PRIMARY KEY (id);


--
-- Name: components_shared_rich_texts components_shared_rich_texts_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.components_shared_rich_texts
    ADD CONSTRAINT components_shared_rich_texts_pkey PRIMARY KEY (id);


--
-- Name: components_shared_seos components_shared_seos_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.components_shared_seos
    ADD CONSTRAINT components_shared_seos_pkey PRIMARY KEY (id);


--
-- Name: components_shared_sliders components_shared_sliders_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.components_shared_sliders
    ADD CONSTRAINT components_shared_sliders_pkey PRIMARY KEY (id);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: files_folder_lnk files_folder_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.files_folder_lnk
    ADD CONSTRAINT files_folder_lnk_pkey PRIMARY KEY (id);


--
-- Name: files_folder_lnk files_folder_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.files_folder_lnk
    ADD CONSTRAINT files_folder_lnk_uq UNIQUE (file_id, folder_id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: files_related_mph files_related_mph_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.files_related_mph
    ADD CONSTRAINT files_related_mph_pkey PRIMARY KEY (id);


--
-- Name: globals_cmps globals_cmps_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.globals_cmps
    ADD CONSTRAINT globals_cmps_pkey PRIMARY KEY (id);


--
-- Name: globals globals_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.globals
    ADD CONSTRAINT globals_pkey PRIMARY KEY (id);


--
-- Name: globals_cmps globals_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.globals_cmps
    ADD CONSTRAINT globals_uq UNIQUE (entity_id, cmp_id, field, component_type);


--
-- Name: i18n_locale i18n_locale_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.i18n_locale
    ADD CONSTRAINT i18n_locale_pkey PRIMARY KEY (id);


--
-- Name: order_items_order_lnk order_items_order_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items_order_lnk
    ADD CONSTRAINT order_items_order_lnk_pkey PRIMARY KEY (id);


--
-- Name: order_items_order_lnk order_items_order_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items_order_lnk
    ADD CONSTRAINT order_items_order_lnk_uq UNIQUE (order_item_id, order_id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_items_variant_lnk order_items_variant_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items_variant_lnk
    ADD CONSTRAINT order_items_variant_lnk_pkey PRIMARY KEY (id);


--
-- Name: order_items_variant_lnk order_items_variant_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items_variant_lnk
    ADD CONSTRAINT order_items_variant_lnk_uq UNIQUE (order_item_id, variant_id);


--
-- Name: orders_customer_lnk orders_customer_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.orders_customer_lnk
    ADD CONSTRAINT orders_customer_lnk_pkey PRIMARY KEY (id);


--
-- Name: orders_customer_lnk orders_customer_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.orders_customer_lnk
    ADD CONSTRAINT orders_customer_lnk_uq UNIQUE (order_id, customer_id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_list_blocks product_list_blocks_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.product_list_blocks
    ADD CONSTRAINT product_list_blocks_pkey PRIMARY KEY (id);


--
-- Name: product_list_blocks_products_lnk product_list_blocks_products_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.product_list_blocks_products_lnk
    ADD CONSTRAINT product_list_blocks_products_lnk_pkey PRIMARY KEY (id);


--
-- Name: product_list_blocks_products_lnk product_list_blocks_products_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.product_list_blocks_products_lnk
    ADD CONSTRAINT product_list_blocks_products_lnk_uq UNIQUE (product_list_block_id, product_id);


--
-- Name: products_brand_lnk products_brand_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products_brand_lnk
    ADD CONSTRAINT products_brand_lnk_pkey PRIMARY KEY (id);


--
-- Name: products_brand_lnk products_brand_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products_brand_lnk
    ADD CONSTRAINT products_brand_lnk_uq UNIQUE (product_id, brand_id);


--
-- Name: products_category_lnk products_category_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products_category_lnk
    ADD CONSTRAINT products_category_lnk_pkey PRIMARY KEY (id);


--
-- Name: products_category_lnk products_category_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products_category_lnk
    ADD CONSTRAINT products_category_lnk_uq UNIQUE (product_id, category_id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- Name: strapi_api_token_permissions strapi_api_token_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_api_token_permissions
    ADD CONSTRAINT strapi_api_token_permissions_pkey PRIMARY KEY (id);


--
-- Name: strapi_api_token_permissions_token_lnk strapi_api_token_permissions_token_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_api_token_permissions_token_lnk
    ADD CONSTRAINT strapi_api_token_permissions_token_lnk_pkey PRIMARY KEY (id);


--
-- Name: strapi_api_token_permissions_token_lnk strapi_api_token_permissions_token_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_api_token_permissions_token_lnk
    ADD CONSTRAINT strapi_api_token_permissions_token_lnk_uq UNIQUE (api_token_permission_id, api_token_id);


--
-- Name: strapi_api_tokens strapi_api_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_api_tokens
    ADD CONSTRAINT strapi_api_tokens_pkey PRIMARY KEY (id);


--
-- Name: strapi_core_store_settings strapi_core_store_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_core_store_settings
    ADD CONSTRAINT strapi_core_store_settings_pkey PRIMARY KEY (id);


--
-- Name: strapi_database_schema strapi_database_schema_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_database_schema
    ADD CONSTRAINT strapi_database_schema_pkey PRIMARY KEY (id);


--
-- Name: strapi_history_versions strapi_history_versions_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_history_versions
    ADD CONSTRAINT strapi_history_versions_pkey PRIMARY KEY (id);


--
-- Name: strapi_migrations_internal strapi_migrations_internal_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_migrations_internal
    ADD CONSTRAINT strapi_migrations_internal_pkey PRIMARY KEY (id);


--
-- Name: strapi_migrations strapi_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_migrations
    ADD CONSTRAINT strapi_migrations_pkey PRIMARY KEY (id);


--
-- Name: strapi_release_actions strapi_release_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_release_actions
    ADD CONSTRAINT strapi_release_actions_pkey PRIMARY KEY (id);


--
-- Name: strapi_release_actions_release_lnk strapi_release_actions_release_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_release_actions_release_lnk
    ADD CONSTRAINT strapi_release_actions_release_lnk_pkey PRIMARY KEY (id);


--
-- Name: strapi_release_actions_release_lnk strapi_release_actions_release_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_release_actions_release_lnk
    ADD CONSTRAINT strapi_release_actions_release_lnk_uq UNIQUE (release_action_id, release_id);


--
-- Name: strapi_releases strapi_releases_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_releases
    ADD CONSTRAINT strapi_releases_pkey PRIMARY KEY (id);


--
-- Name: strapi_transfer_token_permissions strapi_transfer_token_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions
    ADD CONSTRAINT strapi_transfer_token_permissions_pkey PRIMARY KEY (id);


--
-- Name: strapi_transfer_token_permissions_token_lnk strapi_transfer_token_permissions_token_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions_token_lnk
    ADD CONSTRAINT strapi_transfer_token_permissions_token_lnk_pkey PRIMARY KEY (id);


--
-- Name: strapi_transfer_token_permissions_token_lnk strapi_transfer_token_permissions_token_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions_token_lnk
    ADD CONSTRAINT strapi_transfer_token_permissions_token_lnk_uq UNIQUE (transfer_token_permission_id, transfer_token_id);


--
-- Name: strapi_transfer_tokens strapi_transfer_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_transfer_tokens
    ADD CONSTRAINT strapi_transfer_tokens_pkey PRIMARY KEY (id);


--
-- Name: strapi_webhooks strapi_webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_webhooks
    ADD CONSTRAINT strapi_webhooks_pkey PRIMARY KEY (id);


--
-- Name: strapi_workflows strapi_workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows
    ADD CONSTRAINT strapi_workflows_pkey PRIMARY KEY (id);


--
-- Name: strapi_workflows_stage_required_to_publish_lnk strapi_workflows_stage_required_to_publish_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stage_required_to_publish_lnk
    ADD CONSTRAINT strapi_workflows_stage_required_to_publish_lnk_pkey PRIMARY KEY (id);


--
-- Name: strapi_workflows_stage_required_to_publish_lnk strapi_workflows_stage_required_to_publish_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stage_required_to_publish_lnk
    ADD CONSTRAINT strapi_workflows_stage_required_to_publish_lnk_uq UNIQUE (workflow_id, workflow_stage_id);


--
-- Name: strapi_workflows_stages_permissions_lnk strapi_workflows_stages_permissions_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages_permissions_lnk
    ADD CONSTRAINT strapi_workflows_stages_permissions_lnk_pkey PRIMARY KEY (id);


--
-- Name: strapi_workflows_stages_permissions_lnk strapi_workflows_stages_permissions_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages_permissions_lnk
    ADD CONSTRAINT strapi_workflows_stages_permissions_lnk_uq UNIQUE (workflow_stage_id, permission_id);


--
-- Name: strapi_workflows_stages strapi_workflows_stages_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages
    ADD CONSTRAINT strapi_workflows_stages_pkey PRIMARY KEY (id);


--
-- Name: strapi_workflows_stages_workflow_lnk strapi_workflows_stages_workflow_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages_workflow_lnk
    ADD CONSTRAINT strapi_workflows_stages_workflow_lnk_pkey PRIMARY KEY (id);


--
-- Name: strapi_workflows_stages_workflow_lnk strapi_workflows_stages_workflow_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages_workflow_lnk
    ADD CONSTRAINT strapi_workflows_stages_workflow_lnk_uq UNIQUE (workflow_stage_id, workflow_id);


--
-- Name: up_permissions up_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_permissions
    ADD CONSTRAINT up_permissions_pkey PRIMARY KEY (id);


--
-- Name: up_permissions_role_lnk up_permissions_role_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_permissions_role_lnk
    ADD CONSTRAINT up_permissions_role_lnk_pkey PRIMARY KEY (id);


--
-- Name: up_permissions_role_lnk up_permissions_role_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_permissions_role_lnk
    ADD CONSTRAINT up_permissions_role_lnk_uq UNIQUE (permission_id, role_id);


--
-- Name: up_roles up_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_roles
    ADD CONSTRAINT up_roles_pkey PRIMARY KEY (id);


--
-- Name: up_users up_users_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_users
    ADD CONSTRAINT up_users_pkey PRIMARY KEY (id);


--
-- Name: up_users_role_lnk up_users_role_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_users_role_lnk
    ADD CONSTRAINT up_users_role_lnk_pkey PRIMARY KEY (id);


--
-- Name: up_users_role_lnk up_users_role_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_users_role_lnk
    ADD CONSTRAINT up_users_role_lnk_uq UNIQUE (user_id, role_id);


--
-- Name: upload_folders_parent_lnk upload_folders_parent_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.upload_folders_parent_lnk
    ADD CONSTRAINT upload_folders_parent_lnk_pkey PRIMARY KEY (id);


--
-- Name: upload_folders_parent_lnk upload_folders_parent_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.upload_folders_parent_lnk
    ADD CONSTRAINT upload_folders_parent_lnk_uq UNIQUE (folder_id, inv_folder_id);


--
-- Name: upload_folders upload_folders_path_id_index; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_path_id_index UNIQUE (path_id);


--
-- Name: upload_folders upload_folders_path_index; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_path_index UNIQUE (path);


--
-- Name: upload_folders upload_folders_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_pkey PRIMARY KEY (id);


--
-- Name: variants variants_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_pkey PRIMARY KEY (id);


--
-- Name: variants_product_lnk variants_product_lnk_pkey; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.variants_product_lnk
    ADD CONSTRAINT variants_product_lnk_pkey PRIMARY KEY (id);


--
-- Name: variants_product_lnk variants_product_lnk_uq; Type: CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.variants_product_lnk
    ADD CONSTRAINT variants_product_lnk_uq UNIQUE (variant_id, product_id);


--
-- Name: admin_permissions_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_permissions_created_by_id_fk ON public.admin_permissions USING btree (created_by_id);


--
-- Name: admin_permissions_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_permissions_documents_idx ON public.admin_permissions USING btree (document_id, locale, published_at);


--
-- Name: admin_permissions_role_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_permissions_role_lnk_fk ON public.admin_permissions_role_lnk USING btree (permission_id);


--
-- Name: admin_permissions_role_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_permissions_role_lnk_ifk ON public.admin_permissions_role_lnk USING btree (role_id);


--
-- Name: admin_permissions_role_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_permissions_role_lnk_oifk ON public.admin_permissions_role_lnk USING btree (permission_ord);


--
-- Name: admin_permissions_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_permissions_updated_by_id_fk ON public.admin_permissions USING btree (updated_by_id);


--
-- Name: admin_roles_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_roles_created_by_id_fk ON public.admin_roles USING btree (created_by_id);


--
-- Name: admin_roles_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_roles_documents_idx ON public.admin_roles USING btree (document_id, locale, published_at);


--
-- Name: admin_roles_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_roles_updated_by_id_fk ON public.admin_roles USING btree (updated_by_id);


--
-- Name: admin_users_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_users_created_by_id_fk ON public.admin_users USING btree (created_by_id);


--
-- Name: admin_users_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_users_documents_idx ON public.admin_users USING btree (document_id, locale, published_at);


--
-- Name: admin_users_roles_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_users_roles_lnk_fk ON public.admin_users_roles_lnk USING btree (user_id);


--
-- Name: admin_users_roles_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_users_roles_lnk_ifk ON public.admin_users_roles_lnk USING btree (role_id);


--
-- Name: admin_users_roles_lnk_ofk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_users_roles_lnk_ofk ON public.admin_users_roles_lnk USING btree (role_ord);


--
-- Name: admin_users_roles_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_users_roles_lnk_oifk ON public.admin_users_roles_lnk USING btree (user_ord);


--
-- Name: admin_users_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX admin_users_updated_by_id_fk ON public.admin_users USING btree (updated_by_id);


--
-- Name: banners_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX banners_created_by_id_fk ON public.banners USING btree (created_by_id);


--
-- Name: banners_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX banners_documents_idx ON public.banners USING btree (document_id, locale, published_at);


--
-- Name: banners_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX banners_updated_by_id_fk ON public.banners USING btree (updated_by_id);


--
-- Name: brands_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX brands_created_by_id_fk ON public.brands USING btree (created_by_id);


--
-- Name: brands_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX brands_documents_idx ON public.brands USING btree (document_id, locale, published_at);


--
-- Name: brands_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX brands_updated_by_id_fk ON public.brands USING btree (updated_by_id);


--
-- Name: categories_brands_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX categories_brands_lnk_fk ON public.categories_brands_lnk USING btree (category_id);


--
-- Name: categories_brands_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX categories_brands_lnk_ifk ON public.categories_brands_lnk USING btree (brand_id);


--
-- Name: categories_brands_lnk_ofk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX categories_brands_lnk_ofk ON public.categories_brands_lnk USING btree (brand_ord);


--
-- Name: categories_brands_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX categories_brands_lnk_oifk ON public.categories_brands_lnk USING btree (category_ord);


--
-- Name: categories_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX categories_created_by_id_fk ON public.categories USING btree (created_by_id);


--
-- Name: categories_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX categories_documents_idx ON public.categories USING btree (document_id, locale, published_at);


--
-- Name: categories_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX categories_updated_by_id_fk ON public.categories USING btree (updated_by_id);


--
-- Name: customers_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX customers_created_by_id_fk ON public.customers USING btree (created_by_id);


--
-- Name: customers_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX customers_documents_idx ON public.customers USING btree (document_id, locale, published_at);


--
-- Name: customers_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX customers_updated_by_id_fk ON public.customers USING btree (updated_by_id);


--
-- Name: files_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX files_created_by_id_fk ON public.files USING btree (created_by_id);


--
-- Name: files_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX files_documents_idx ON public.files USING btree (document_id, locale, published_at);


--
-- Name: files_folder_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX files_folder_lnk_fk ON public.files_folder_lnk USING btree (file_id);


--
-- Name: files_folder_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX files_folder_lnk_ifk ON public.files_folder_lnk USING btree (folder_id);


--
-- Name: files_folder_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX files_folder_lnk_oifk ON public.files_folder_lnk USING btree (file_ord);


--
-- Name: files_related_mph_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX files_related_mph_fk ON public.files_related_mph USING btree (file_id);


--
-- Name: files_related_mph_idix; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX files_related_mph_idix ON public.files_related_mph USING btree (related_id);


--
-- Name: files_related_mph_oidx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX files_related_mph_oidx ON public.files_related_mph USING btree ("order");


--
-- Name: files_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX files_updated_by_id_fk ON public.files USING btree (updated_by_id);


--
-- Name: globals_component_type_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX globals_component_type_idx ON public.globals_cmps USING btree (component_type);


--
-- Name: globals_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX globals_created_by_id_fk ON public.globals USING btree (created_by_id);


--
-- Name: globals_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX globals_documents_idx ON public.globals USING btree (document_id, locale, published_at);


--
-- Name: globals_entity_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX globals_entity_fk ON public.globals_cmps USING btree (entity_id);


--
-- Name: globals_field_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX globals_field_idx ON public.globals_cmps USING btree (field);


--
-- Name: globals_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX globals_updated_by_id_fk ON public.globals USING btree (updated_by_id);


--
-- Name: i18n_locale_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX i18n_locale_created_by_id_fk ON public.i18n_locale USING btree (created_by_id);


--
-- Name: i18n_locale_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX i18n_locale_documents_idx ON public.i18n_locale USING btree (document_id, locale, published_at);


--
-- Name: i18n_locale_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX i18n_locale_updated_by_id_fk ON public.i18n_locale USING btree (updated_by_id);


--
-- Name: order_items_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX order_items_created_by_id_fk ON public.order_items USING btree (created_by_id);


--
-- Name: order_items_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX order_items_documents_idx ON public.order_items USING btree (document_id, locale, published_at);


--
-- Name: order_items_order_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX order_items_order_lnk_fk ON public.order_items_order_lnk USING btree (order_item_id);


--
-- Name: order_items_order_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX order_items_order_lnk_ifk ON public.order_items_order_lnk USING btree (order_id);


--
-- Name: order_items_order_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX order_items_order_lnk_oifk ON public.order_items_order_lnk USING btree (order_item_ord);


--
-- Name: order_items_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX order_items_updated_by_id_fk ON public.order_items USING btree (updated_by_id);


--
-- Name: order_items_variant_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX order_items_variant_lnk_fk ON public.order_items_variant_lnk USING btree (order_item_id);


--
-- Name: order_items_variant_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX order_items_variant_lnk_ifk ON public.order_items_variant_lnk USING btree (variant_id);


--
-- Name: order_items_variant_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX order_items_variant_lnk_oifk ON public.order_items_variant_lnk USING btree (order_item_ord);


--
-- Name: orders_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX orders_created_by_id_fk ON public.orders USING btree (created_by_id);


--
-- Name: orders_customer_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX orders_customer_lnk_fk ON public.orders_customer_lnk USING btree (order_id);


--
-- Name: orders_customer_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX orders_customer_lnk_ifk ON public.orders_customer_lnk USING btree (customer_id);


--
-- Name: orders_customer_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX orders_customer_lnk_oifk ON public.orders_customer_lnk USING btree (order_ord);


--
-- Name: orders_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX orders_documents_idx ON public.orders USING btree (document_id, locale, published_at);


--
-- Name: orders_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX orders_updated_by_id_fk ON public.orders USING btree (updated_by_id);


--
-- Name: product_list_blocks_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX product_list_blocks_created_by_id_fk ON public.product_list_blocks USING btree (created_by_id);


--
-- Name: product_list_blocks_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX product_list_blocks_documents_idx ON public.product_list_blocks USING btree (document_id, locale, published_at);


--
-- Name: product_list_blocks_products_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX product_list_blocks_products_lnk_fk ON public.product_list_blocks_products_lnk USING btree (product_list_block_id);


--
-- Name: product_list_blocks_products_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX product_list_blocks_products_lnk_ifk ON public.product_list_blocks_products_lnk USING btree (product_id);


--
-- Name: product_list_blocks_products_lnk_ofk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX product_list_blocks_products_lnk_ofk ON public.product_list_blocks_products_lnk USING btree (product_ord);


--
-- Name: product_list_blocks_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX product_list_blocks_updated_by_id_fk ON public.product_list_blocks USING btree (updated_by_id);


--
-- Name: products_brand_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX products_brand_lnk_fk ON public.products_brand_lnk USING btree (product_id);


--
-- Name: products_brand_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX products_brand_lnk_ifk ON public.products_brand_lnk USING btree (brand_id);


--
-- Name: products_category_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX products_category_lnk_fk ON public.products_category_lnk USING btree (product_id);


--
-- Name: products_category_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX products_category_lnk_ifk ON public.products_category_lnk USING btree (category_id);


--
-- Name: products_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX products_created_by_id_fk ON public.products USING btree (created_by_id);


--
-- Name: products_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX products_documents_idx ON public.products USING btree (document_id, locale, published_at);


--
-- Name: products_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX products_updated_by_id_fk ON public.products USING btree (updated_by_id);


--
-- Name: services_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX services_created_by_id_fk ON public.services USING btree (created_by_id);


--
-- Name: services_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX services_documents_idx ON public.services USING btree (document_id, locale, published_at);


--
-- Name: services_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX services_updated_by_id_fk ON public.services USING btree (updated_by_id);


--
-- Name: strapi_api_token_permissions_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_api_token_permissions_created_by_id_fk ON public.strapi_api_token_permissions USING btree (created_by_id);


--
-- Name: strapi_api_token_permissions_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_api_token_permissions_documents_idx ON public.strapi_api_token_permissions USING btree (document_id, locale, published_at);


--
-- Name: strapi_api_token_permissions_token_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_api_token_permissions_token_lnk_fk ON public.strapi_api_token_permissions_token_lnk USING btree (api_token_permission_id);


--
-- Name: strapi_api_token_permissions_token_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_api_token_permissions_token_lnk_ifk ON public.strapi_api_token_permissions_token_lnk USING btree (api_token_id);


--
-- Name: strapi_api_token_permissions_token_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_api_token_permissions_token_lnk_oifk ON public.strapi_api_token_permissions_token_lnk USING btree (api_token_permission_ord);


--
-- Name: strapi_api_token_permissions_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_api_token_permissions_updated_by_id_fk ON public.strapi_api_token_permissions USING btree (updated_by_id);


--
-- Name: strapi_api_tokens_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_api_tokens_created_by_id_fk ON public.strapi_api_tokens USING btree (created_by_id);


--
-- Name: strapi_api_tokens_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_api_tokens_documents_idx ON public.strapi_api_tokens USING btree (document_id, locale, published_at);


--
-- Name: strapi_api_tokens_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_api_tokens_updated_by_id_fk ON public.strapi_api_tokens USING btree (updated_by_id);


--
-- Name: strapi_history_versions_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_history_versions_created_by_id_fk ON public.strapi_history_versions USING btree (created_by_id);


--
-- Name: strapi_release_actions_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_release_actions_created_by_id_fk ON public.strapi_release_actions USING btree (created_by_id);


--
-- Name: strapi_release_actions_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_release_actions_documents_idx ON public.strapi_release_actions USING btree (document_id, locale, published_at);


--
-- Name: strapi_release_actions_release_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_release_actions_release_lnk_fk ON public.strapi_release_actions_release_lnk USING btree (release_action_id);


--
-- Name: strapi_release_actions_release_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_release_actions_release_lnk_ifk ON public.strapi_release_actions_release_lnk USING btree (release_id);


--
-- Name: strapi_release_actions_release_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_release_actions_release_lnk_oifk ON public.strapi_release_actions_release_lnk USING btree (release_action_ord);


--
-- Name: strapi_release_actions_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_release_actions_updated_by_id_fk ON public.strapi_release_actions USING btree (updated_by_id);


--
-- Name: strapi_releases_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_releases_created_by_id_fk ON public.strapi_releases USING btree (created_by_id);


--
-- Name: strapi_releases_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_releases_documents_idx ON public.strapi_releases USING btree (document_id, locale, published_at);


--
-- Name: strapi_releases_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_releases_updated_by_id_fk ON public.strapi_releases USING btree (updated_by_id);


--
-- Name: strapi_transfer_token_permissions_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_transfer_token_permissions_created_by_id_fk ON public.strapi_transfer_token_permissions USING btree (created_by_id);


--
-- Name: strapi_transfer_token_permissions_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_transfer_token_permissions_documents_idx ON public.strapi_transfer_token_permissions USING btree (document_id, locale, published_at);


--
-- Name: strapi_transfer_token_permissions_token_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_transfer_token_permissions_token_lnk_fk ON public.strapi_transfer_token_permissions_token_lnk USING btree (transfer_token_permission_id);


--
-- Name: strapi_transfer_token_permissions_token_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_transfer_token_permissions_token_lnk_ifk ON public.strapi_transfer_token_permissions_token_lnk USING btree (transfer_token_id);


--
-- Name: strapi_transfer_token_permissions_token_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_transfer_token_permissions_token_lnk_oifk ON public.strapi_transfer_token_permissions_token_lnk USING btree (transfer_token_permission_ord);


--
-- Name: strapi_transfer_token_permissions_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_transfer_token_permissions_updated_by_id_fk ON public.strapi_transfer_token_permissions USING btree (updated_by_id);


--
-- Name: strapi_transfer_tokens_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_transfer_tokens_created_by_id_fk ON public.strapi_transfer_tokens USING btree (created_by_id);


--
-- Name: strapi_transfer_tokens_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_transfer_tokens_documents_idx ON public.strapi_transfer_tokens USING btree (document_id, locale, published_at);


--
-- Name: strapi_transfer_tokens_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_transfer_tokens_updated_by_id_fk ON public.strapi_transfer_tokens USING btree (updated_by_id);


--
-- Name: strapi_workflows_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_created_by_id_fk ON public.strapi_workflows USING btree (created_by_id);


--
-- Name: strapi_workflows_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_documents_idx ON public.strapi_workflows USING btree (document_id, locale, published_at);


--
-- Name: strapi_workflows_stage_required_to_publish_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_stage_required_to_publish_lnk_fk ON public.strapi_workflows_stage_required_to_publish_lnk USING btree (workflow_id);


--
-- Name: strapi_workflows_stage_required_to_publish_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_stage_required_to_publish_lnk_ifk ON public.strapi_workflows_stage_required_to_publish_lnk USING btree (workflow_stage_id);


--
-- Name: strapi_workflows_stages_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_stages_created_by_id_fk ON public.strapi_workflows_stages USING btree (created_by_id);


--
-- Name: strapi_workflows_stages_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_stages_documents_idx ON public.strapi_workflows_stages USING btree (document_id, locale, published_at);


--
-- Name: strapi_workflows_stages_permissions_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_stages_permissions_lnk_fk ON public.strapi_workflows_stages_permissions_lnk USING btree (workflow_stage_id);


--
-- Name: strapi_workflows_stages_permissions_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_stages_permissions_lnk_ifk ON public.strapi_workflows_stages_permissions_lnk USING btree (permission_id);


--
-- Name: strapi_workflows_stages_permissions_lnk_ofk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_stages_permissions_lnk_ofk ON public.strapi_workflows_stages_permissions_lnk USING btree (permission_ord);


--
-- Name: strapi_workflows_stages_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_stages_updated_by_id_fk ON public.strapi_workflows_stages USING btree (updated_by_id);


--
-- Name: strapi_workflows_stages_workflow_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_stages_workflow_lnk_fk ON public.strapi_workflows_stages_workflow_lnk USING btree (workflow_stage_id);


--
-- Name: strapi_workflows_stages_workflow_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_stages_workflow_lnk_ifk ON public.strapi_workflows_stages_workflow_lnk USING btree (workflow_id);


--
-- Name: strapi_workflows_stages_workflow_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_stages_workflow_lnk_oifk ON public.strapi_workflows_stages_workflow_lnk USING btree (workflow_stage_ord);


--
-- Name: strapi_workflows_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX strapi_workflows_updated_by_id_fk ON public.strapi_workflows USING btree (updated_by_id);


--
-- Name: up_permissions_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_permissions_created_by_id_fk ON public.up_permissions USING btree (created_by_id);


--
-- Name: up_permissions_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_permissions_documents_idx ON public.up_permissions USING btree (document_id, locale, published_at);


--
-- Name: up_permissions_role_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_permissions_role_lnk_fk ON public.up_permissions_role_lnk USING btree (permission_id);


--
-- Name: up_permissions_role_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_permissions_role_lnk_ifk ON public.up_permissions_role_lnk USING btree (role_id);


--
-- Name: up_permissions_role_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_permissions_role_lnk_oifk ON public.up_permissions_role_lnk USING btree (permission_ord);


--
-- Name: up_permissions_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_permissions_updated_by_id_fk ON public.up_permissions USING btree (updated_by_id);


--
-- Name: up_roles_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_roles_created_by_id_fk ON public.up_roles USING btree (created_by_id);


--
-- Name: up_roles_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_roles_documents_idx ON public.up_roles USING btree (document_id, locale, published_at);


--
-- Name: up_roles_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_roles_updated_by_id_fk ON public.up_roles USING btree (updated_by_id);


--
-- Name: up_users_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_users_created_by_id_fk ON public.up_users USING btree (created_by_id);


--
-- Name: up_users_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_users_documents_idx ON public.up_users USING btree (document_id, locale, published_at);


--
-- Name: up_users_role_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_users_role_lnk_fk ON public.up_users_role_lnk USING btree (user_id);


--
-- Name: up_users_role_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_users_role_lnk_ifk ON public.up_users_role_lnk USING btree (role_id);


--
-- Name: up_users_role_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_users_role_lnk_oifk ON public.up_users_role_lnk USING btree (user_ord);


--
-- Name: up_users_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX up_users_updated_by_id_fk ON public.up_users USING btree (updated_by_id);


--
-- Name: upload_files_created_at_index; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX upload_files_created_at_index ON public.files USING btree (created_at);


--
-- Name: upload_files_ext_index; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX upload_files_ext_index ON public.files USING btree (ext);


--
-- Name: upload_files_folder_path_index; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX upload_files_folder_path_index ON public.files USING btree (folder_path);


--
-- Name: upload_files_name_index; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX upload_files_name_index ON public.files USING btree (name);


--
-- Name: upload_files_size_index; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX upload_files_size_index ON public.files USING btree (size);


--
-- Name: upload_files_updated_at_index; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX upload_files_updated_at_index ON public.files USING btree (updated_at);


--
-- Name: upload_folders_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX upload_folders_created_by_id_fk ON public.upload_folders USING btree (created_by_id);


--
-- Name: upload_folders_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX upload_folders_documents_idx ON public.upload_folders USING btree (document_id, locale, published_at);


--
-- Name: upload_folders_parent_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX upload_folders_parent_lnk_fk ON public.upload_folders_parent_lnk USING btree (folder_id);


--
-- Name: upload_folders_parent_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX upload_folders_parent_lnk_ifk ON public.upload_folders_parent_lnk USING btree (inv_folder_id);


--
-- Name: upload_folders_parent_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX upload_folders_parent_lnk_oifk ON public.upload_folders_parent_lnk USING btree (folder_ord);


--
-- Name: upload_folders_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX upload_folders_updated_by_id_fk ON public.upload_folders USING btree (updated_by_id);


--
-- Name: variants_created_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX variants_created_by_id_fk ON public.variants USING btree (created_by_id);


--
-- Name: variants_documents_idx; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX variants_documents_idx ON public.variants USING btree (document_id, locale, published_at);


--
-- Name: variants_product_lnk_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX variants_product_lnk_fk ON public.variants_product_lnk USING btree (variant_id);


--
-- Name: variants_product_lnk_ifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX variants_product_lnk_ifk ON public.variants_product_lnk USING btree (product_id);


--
-- Name: variants_product_lnk_oifk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX variants_product_lnk_oifk ON public.variants_product_lnk USING btree (variant_ord);


--
-- Name: variants_updated_by_id_fk; Type: INDEX; Schema: public; Owner: dinhanh
--

CREATE INDEX variants_updated_by_id_fk ON public.variants USING btree (updated_by_id);


--
-- Name: admin_permissions admin_permissions_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: admin_permissions_role_lnk admin_permissions_role_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_permissions_role_lnk
    ADD CONSTRAINT admin_permissions_role_lnk_fk FOREIGN KEY (permission_id) REFERENCES public.admin_permissions(id) ON DELETE CASCADE;


--
-- Name: admin_permissions_role_lnk admin_permissions_role_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_permissions_role_lnk
    ADD CONSTRAINT admin_permissions_role_lnk_ifk FOREIGN KEY (role_id) REFERENCES public.admin_roles(id) ON DELETE CASCADE;


--
-- Name: admin_permissions admin_permissions_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_permissions
    ADD CONSTRAINT admin_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: admin_roles admin_roles_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: admin_roles admin_roles_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_roles
    ADD CONSTRAINT admin_roles_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: admin_users admin_users_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: admin_users_roles_lnk admin_users_roles_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_users_roles_lnk
    ADD CONSTRAINT admin_users_roles_lnk_fk FOREIGN KEY (user_id) REFERENCES public.admin_users(id) ON DELETE CASCADE;


--
-- Name: admin_users_roles_lnk admin_users_roles_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_users_roles_lnk
    ADD CONSTRAINT admin_users_roles_lnk_ifk FOREIGN KEY (role_id) REFERENCES public.admin_roles(id) ON DELETE CASCADE;


--
-- Name: admin_users admin_users_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: banners banners_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: banners banners_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: brands brands_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: brands brands_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: categories_brands_lnk categories_brands_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.categories_brands_lnk
    ADD CONSTRAINT categories_brands_lnk_fk FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: categories_brands_lnk categories_brands_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.categories_brands_lnk
    ADD CONSTRAINT categories_brands_lnk_ifk FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: categories categories_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: categories categories_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: customers customers_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: customers customers_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: files files_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: files_folder_lnk files_folder_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.files_folder_lnk
    ADD CONSTRAINT files_folder_lnk_fk FOREIGN KEY (file_id) REFERENCES public.files(id) ON DELETE CASCADE;


--
-- Name: files_folder_lnk files_folder_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.files_folder_lnk
    ADD CONSTRAINT files_folder_lnk_ifk FOREIGN KEY (folder_id) REFERENCES public.upload_folders(id) ON DELETE CASCADE;


--
-- Name: files_related_mph files_related_mph_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.files_related_mph
    ADD CONSTRAINT files_related_mph_fk FOREIGN KEY (file_id) REFERENCES public.files(id) ON DELETE CASCADE;


--
-- Name: files files_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: globals globals_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.globals
    ADD CONSTRAINT globals_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: globals_cmps globals_entity_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.globals_cmps
    ADD CONSTRAINT globals_entity_fk FOREIGN KEY (entity_id) REFERENCES public.globals(id) ON DELETE CASCADE;


--
-- Name: globals globals_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.globals
    ADD CONSTRAINT globals_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: i18n_locale i18n_locale_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.i18n_locale
    ADD CONSTRAINT i18n_locale_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: i18n_locale i18n_locale_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.i18n_locale
    ADD CONSTRAINT i18n_locale_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: order_items order_items_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: order_items_order_lnk order_items_order_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items_order_lnk
    ADD CONSTRAINT order_items_order_lnk_fk FOREIGN KEY (order_item_id) REFERENCES public.order_items(id) ON DELETE CASCADE;


--
-- Name: order_items_order_lnk order_items_order_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items_order_lnk
    ADD CONSTRAINT order_items_order_lnk_ifk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_items order_items_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: order_items_variant_lnk order_items_variant_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items_variant_lnk
    ADD CONSTRAINT order_items_variant_lnk_fk FOREIGN KEY (order_item_id) REFERENCES public.order_items(id) ON DELETE CASCADE;


--
-- Name: order_items_variant_lnk order_items_variant_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.order_items_variant_lnk
    ADD CONSTRAINT order_items_variant_lnk_ifk FOREIGN KEY (variant_id) REFERENCES public.variants(id) ON DELETE CASCADE;


--
-- Name: orders orders_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: orders_customer_lnk orders_customer_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.orders_customer_lnk
    ADD CONSTRAINT orders_customer_lnk_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: orders_customer_lnk orders_customer_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.orders_customer_lnk
    ADD CONSTRAINT orders_customer_lnk_ifk FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON DELETE CASCADE;


--
-- Name: orders orders_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: product_list_blocks product_list_blocks_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.product_list_blocks
    ADD CONSTRAINT product_list_blocks_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: product_list_blocks_products_lnk product_list_blocks_products_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.product_list_blocks_products_lnk
    ADD CONSTRAINT product_list_blocks_products_lnk_fk FOREIGN KEY (product_list_block_id) REFERENCES public.product_list_blocks(id) ON DELETE CASCADE;


--
-- Name: product_list_blocks_products_lnk product_list_blocks_products_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.product_list_blocks_products_lnk
    ADD CONSTRAINT product_list_blocks_products_lnk_ifk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_list_blocks product_list_blocks_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.product_list_blocks
    ADD CONSTRAINT product_list_blocks_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: products_brand_lnk products_brand_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products_brand_lnk
    ADD CONSTRAINT products_brand_lnk_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products_brand_lnk products_brand_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products_brand_lnk
    ADD CONSTRAINT products_brand_lnk_ifk FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE;


--
-- Name: products_category_lnk products_category_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products_category_lnk
    ADD CONSTRAINT products_category_lnk_fk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: products_category_lnk products_category_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products_category_lnk
    ADD CONSTRAINT products_category_lnk_ifk FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: products products_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: products products_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: services services_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: services services_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_api_token_permissions strapi_api_token_permissions_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_api_token_permissions
    ADD CONSTRAINT strapi_api_token_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_api_token_permissions_token_lnk strapi_api_token_permissions_token_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_api_token_permissions_token_lnk
    ADD CONSTRAINT strapi_api_token_permissions_token_lnk_fk FOREIGN KEY (api_token_permission_id) REFERENCES public.strapi_api_token_permissions(id) ON DELETE CASCADE;


--
-- Name: strapi_api_token_permissions_token_lnk strapi_api_token_permissions_token_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_api_token_permissions_token_lnk
    ADD CONSTRAINT strapi_api_token_permissions_token_lnk_ifk FOREIGN KEY (api_token_id) REFERENCES public.strapi_api_tokens(id) ON DELETE CASCADE;


--
-- Name: strapi_api_token_permissions strapi_api_token_permissions_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_api_token_permissions
    ADD CONSTRAINT strapi_api_token_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_api_tokens strapi_api_tokens_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_api_tokens
    ADD CONSTRAINT strapi_api_tokens_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_api_tokens strapi_api_tokens_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_api_tokens
    ADD CONSTRAINT strapi_api_tokens_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_history_versions strapi_history_versions_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_history_versions
    ADD CONSTRAINT strapi_history_versions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_release_actions strapi_release_actions_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_release_actions
    ADD CONSTRAINT strapi_release_actions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_release_actions_release_lnk strapi_release_actions_release_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_release_actions_release_lnk
    ADD CONSTRAINT strapi_release_actions_release_lnk_fk FOREIGN KEY (release_action_id) REFERENCES public.strapi_release_actions(id) ON DELETE CASCADE;


--
-- Name: strapi_release_actions_release_lnk strapi_release_actions_release_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_release_actions_release_lnk
    ADD CONSTRAINT strapi_release_actions_release_lnk_ifk FOREIGN KEY (release_id) REFERENCES public.strapi_releases(id) ON DELETE CASCADE;


--
-- Name: strapi_release_actions strapi_release_actions_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_release_actions
    ADD CONSTRAINT strapi_release_actions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_releases strapi_releases_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_releases
    ADD CONSTRAINT strapi_releases_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_releases strapi_releases_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_releases
    ADD CONSTRAINT strapi_releases_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_transfer_token_permissions strapi_transfer_token_permissions_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions
    ADD CONSTRAINT strapi_transfer_token_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_transfer_token_permissions_token_lnk strapi_transfer_token_permissions_token_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions_token_lnk
    ADD CONSTRAINT strapi_transfer_token_permissions_token_lnk_fk FOREIGN KEY (transfer_token_permission_id) REFERENCES public.strapi_transfer_token_permissions(id) ON DELETE CASCADE;


--
-- Name: strapi_transfer_token_permissions_token_lnk strapi_transfer_token_permissions_token_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions_token_lnk
    ADD CONSTRAINT strapi_transfer_token_permissions_token_lnk_ifk FOREIGN KEY (transfer_token_id) REFERENCES public.strapi_transfer_tokens(id) ON DELETE CASCADE;


--
-- Name: strapi_transfer_token_permissions strapi_transfer_token_permissions_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_transfer_token_permissions
    ADD CONSTRAINT strapi_transfer_token_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_transfer_tokens strapi_transfer_tokens_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_transfer_tokens
    ADD CONSTRAINT strapi_transfer_tokens_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_transfer_tokens strapi_transfer_tokens_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_transfer_tokens
    ADD CONSTRAINT strapi_transfer_tokens_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_workflows strapi_workflows_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows
    ADD CONSTRAINT strapi_workflows_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_workflows_stage_required_to_publish_lnk strapi_workflows_stage_required_to_publish_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stage_required_to_publish_lnk
    ADD CONSTRAINT strapi_workflows_stage_required_to_publish_lnk_fk FOREIGN KEY (workflow_id) REFERENCES public.strapi_workflows(id) ON DELETE CASCADE;


--
-- Name: strapi_workflows_stage_required_to_publish_lnk strapi_workflows_stage_required_to_publish_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stage_required_to_publish_lnk
    ADD CONSTRAINT strapi_workflows_stage_required_to_publish_lnk_ifk FOREIGN KEY (workflow_stage_id) REFERENCES public.strapi_workflows_stages(id) ON DELETE CASCADE;


--
-- Name: strapi_workflows_stages strapi_workflows_stages_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages
    ADD CONSTRAINT strapi_workflows_stages_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_workflows_stages_permissions_lnk strapi_workflows_stages_permissions_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages_permissions_lnk
    ADD CONSTRAINT strapi_workflows_stages_permissions_lnk_fk FOREIGN KEY (workflow_stage_id) REFERENCES public.strapi_workflows_stages(id) ON DELETE CASCADE;


--
-- Name: strapi_workflows_stages_permissions_lnk strapi_workflows_stages_permissions_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages_permissions_lnk
    ADD CONSTRAINT strapi_workflows_stages_permissions_lnk_ifk FOREIGN KEY (permission_id) REFERENCES public.admin_permissions(id) ON DELETE CASCADE;


--
-- Name: strapi_workflows_stages strapi_workflows_stages_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages
    ADD CONSTRAINT strapi_workflows_stages_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: strapi_workflows_stages_workflow_lnk strapi_workflows_stages_workflow_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages_workflow_lnk
    ADD CONSTRAINT strapi_workflows_stages_workflow_lnk_fk FOREIGN KEY (workflow_stage_id) REFERENCES public.strapi_workflows_stages(id) ON DELETE CASCADE;


--
-- Name: strapi_workflows_stages_workflow_lnk strapi_workflows_stages_workflow_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows_stages_workflow_lnk
    ADD CONSTRAINT strapi_workflows_stages_workflow_lnk_ifk FOREIGN KEY (workflow_id) REFERENCES public.strapi_workflows(id) ON DELETE CASCADE;


--
-- Name: strapi_workflows strapi_workflows_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.strapi_workflows
    ADD CONSTRAINT strapi_workflows_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: up_permissions up_permissions_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_permissions
    ADD CONSTRAINT up_permissions_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: up_permissions_role_lnk up_permissions_role_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_permissions_role_lnk
    ADD CONSTRAINT up_permissions_role_lnk_fk FOREIGN KEY (permission_id) REFERENCES public.up_permissions(id) ON DELETE CASCADE;


--
-- Name: up_permissions_role_lnk up_permissions_role_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_permissions_role_lnk
    ADD CONSTRAINT up_permissions_role_lnk_ifk FOREIGN KEY (role_id) REFERENCES public.up_roles(id) ON DELETE CASCADE;


--
-- Name: up_permissions up_permissions_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_permissions
    ADD CONSTRAINT up_permissions_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: up_roles up_roles_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_roles
    ADD CONSTRAINT up_roles_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: up_roles up_roles_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_roles
    ADD CONSTRAINT up_roles_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: up_users up_users_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_users
    ADD CONSTRAINT up_users_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: up_users_role_lnk up_users_role_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_users_role_lnk
    ADD CONSTRAINT up_users_role_lnk_fk FOREIGN KEY (user_id) REFERENCES public.up_users(id) ON DELETE CASCADE;


--
-- Name: up_users_role_lnk up_users_role_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_users_role_lnk
    ADD CONSTRAINT up_users_role_lnk_ifk FOREIGN KEY (role_id) REFERENCES public.up_roles(id) ON DELETE CASCADE;


--
-- Name: up_users up_users_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.up_users
    ADD CONSTRAINT up_users_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: upload_folders upload_folders_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: upload_folders_parent_lnk upload_folders_parent_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.upload_folders_parent_lnk
    ADD CONSTRAINT upload_folders_parent_lnk_fk FOREIGN KEY (folder_id) REFERENCES public.upload_folders(id) ON DELETE CASCADE;


--
-- Name: upload_folders_parent_lnk upload_folders_parent_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.upload_folders_parent_lnk
    ADD CONSTRAINT upload_folders_parent_lnk_ifk FOREIGN KEY (inv_folder_id) REFERENCES public.upload_folders(id) ON DELETE CASCADE;


--
-- Name: upload_folders upload_folders_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.upload_folders
    ADD CONSTRAINT upload_folders_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: variants variants_created_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_created_by_id_fk FOREIGN KEY (created_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- Name: variants_product_lnk variants_product_lnk_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.variants_product_lnk
    ADD CONSTRAINT variants_product_lnk_fk FOREIGN KEY (variant_id) REFERENCES public.variants(id) ON DELETE CASCADE;


--
-- Name: variants_product_lnk variants_product_lnk_ifk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.variants_product_lnk
    ADD CONSTRAINT variants_product_lnk_ifk FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: variants variants_updated_by_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: dinhanh
--

ALTER TABLE ONLY public.variants
    ADD CONSTRAINT variants_updated_by_id_fk FOREIGN KEY (updated_by_id) REFERENCES public.admin_users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

