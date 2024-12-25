
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

CREATE SCHEMA IF NOT EXISTS "drizzle";

ALTER SCHEMA "drizzle" OWNER TO "postgres";

CREATE SCHEMA IF NOT EXISTS "next_auth";

ALTER SCHEMA "next_auth" OWNER TO "postgres";

CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";

COMMENT ON SCHEMA "public" IS 'standard public schema';

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

CREATE TYPE "public"."billingPeriod" AS ENUM (
    'MONTHLY',
    'YEARLY'
);

ALTER TYPE "public"."billingPeriod" OWNER TO "postgres";

CREATE TYPE "public"."role" AS ENUM (
    'MEMBER',
    'ADMIN'
);

ALTER TYPE "public"."role" OWNER TO "postgres";

CREATE TYPE "public"."status" AS ENUM (
    'DRAFT',
    'ACTIVE',
    'ARCHIVED'
);

ALTER TYPE "public"."status" OWNER TO "postgres";

CREATE TYPE "public"."transReason" AS ENUM (
    'PURCHASE',
    'RETURN',
    'FOUND',
    'SALE',
    'WASTE',
    'INTERNAL_USE',
    'DONATION',
    'TRANSFER',
    'ADJUSMENT'
);

ALTER TYPE "public"."transReason" OWNER TO "postgres";

CREATE TYPE "public"."type" AS ENUM (
    'IN',
    'OUT'
);

ALTER TYPE "public"."type" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "next_auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select
  	coalesce(
		nullif(current_setting('request.jwt.claim.sub', true), ''),
		(nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
	)::uuid
$$;

ALTER FUNCTION "next_auth"."uid"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "drizzle"."__drizzle_migrations" (
    "id" integer NOT NULL,
    "hash" "text" NOT NULL,
    "created_at" bigint
);

ALTER TABLE "drizzle"."__drizzle_migrations" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "drizzle"."__drizzle_migrations_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "drizzle"."__drizzle_migrations_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "drizzle"."__drizzle_migrations_id_seq" OWNED BY "drizzle"."__drizzle_migrations"."id";

CREATE TABLE IF NOT EXISTS "next_auth"."accounts" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "type" "text" NOT NULL,
    "provider" "text" NOT NULL,
    "providerAccountId" "text" NOT NULL,
    "refresh_token" "text",
    "access_token" "text",
    "expires_at" bigint,
    "token_type" "text",
    "scope" "text",
    "id_token" "text",
    "session_state" "text",
    "oauth_token_secret" "text",
    "oauth_token" "text",
    "userId" "uuid"
);

ALTER TABLE "next_auth"."accounts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "next_auth"."sessions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "expires" timestamp with time zone NOT NULL,
    "sessionToken" "text" NOT NULL,
    "userId" "uuid"
);

ALTER TABLE "next_auth"."sessions" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "next_auth"."users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" "text",
    "email" "text",
    "emailVerified" timestamp with time zone,
    "image" "text"
);

ALTER TABLE "next_auth"."users" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "next_auth"."verification_tokens" (
    "identifier" "text",
    "token" "text" NOT NULL,
    "expires" timestamp with time zone NOT NULL
);

ALTER TABLE "next_auth"."verification_tokens" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."accounts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);

ALTER TABLE "public"."accounts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."categories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "name" "text" NOT NULL,
    "shopId" "uuid" NOT NULL,
    "color" "text"
);

ALTER TABLE "public"."categories" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."invitation" (
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "fromUserId" "uuid" NOT NULL,
    "fromShopId" "uuid" NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "role" "public"."role" NOT NULL
);

ALTER TABLE "public"."invitation" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."member" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "shopId" "uuid" NOT NULL,
    "userId" "uuid" NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "role" "public"."role" DEFAULT 'ADMIN'::"public"."role" NOT NULL
);

ALTER TABLE "public"."member" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."movement" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "productId" "uuid" NOT NULL,
    "amount" bigint NOT NULL,
    "type" "public"."type" NOT NULL,
    "transactionId" "uuid" NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "userId" "uuid" NOT NULL,
    "shopId" "uuid" NOT NULL,
    "productDetails" "jsonb" NOT NULL
);

ALTER TABLE "public"."movement" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."plan" (
    "id" smallint NOT NULL,
    "monthlyPrice" numeric NOT NULL,
    "memberLimit" smallint NOT NULL,
    "yearlyPrice" numeric NOT NULL,
    "name" "text" NOT NULL,
    "productsLimit" smallint NOT NULL
);

ALTER TABLE "public"."plan" OWNER TO "postgres";

ALTER TABLE "public"."plan" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."package_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);

CREATE TABLE IF NOT EXISTS "public"."products" (
    "name" "text" NOT NULL,
    "currentStock" bigint NOT NULL,
    "cost" bigint NOT NULL,
    "price" bigint NOT NULL,
    "commission" bigint NOT NULL,
    "barcode" "text",
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "shopId" "uuid" NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "userId" "uuid" NOT NULL,
    "description" "text",
    "status" "public"."status" NOT NULL,
    "categoryId" "uuid",
    "images" "text"[]
);

ALTER TABLE "public"."products" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."shop" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "userId" "uuid" NOT NULL,
    "description" "text"
);

ALTER TABLE "public"."shop" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."subscription" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "planId" smallint NOT NULL,
    "shopId" "uuid" NOT NULL,
    "boughtBy" "uuid" NOT NULL,
    "startDate" timestamp with time zone NOT NULL,
    "endDate" timestamp with time zone NOT NULL,
    "billingPeriod" "public"."billingPeriod" NOT NULL
);

ALTER TABLE "public"."subscription" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."transaction" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "date" timestamp with time zone NOT NULL,
    "shopId" "uuid" NOT NULL,
    "createdAt" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "public"."type" NOT NULL,
    "amount" bigint NOT NULL,
    "userId" "uuid" NOT NULL,
    "reason" "public"."transReason" NOT NULL
);

ALTER TABLE "public"."transaction" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."user" (
    "id" "uuid" NOT NULL,
    "email" "text" NOT NULL
);

ALTER TABLE "public"."user" OWNER TO "postgres";

ALTER TABLE ONLY "drizzle"."__drizzle_migrations" ALTER COLUMN "id" SET DEFAULT "nextval"('"drizzle"."__drizzle_migrations_id_seq"'::"regclass");

ALTER TABLE ONLY "drizzle"."__drizzle_migrations"
    ADD CONSTRAINT "__drizzle_migrations_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."users"
    ADD CONSTRAINT "email_unique" UNIQUE ("email");

ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "provider_unique" UNIQUE ("provider", "providerAccountId");

ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessiontoken_unique" UNIQUE ("sessionToken");

ALTER TABLE ONLY "next_auth"."verification_tokens"
    ADD CONSTRAINT "token_identifier_unique" UNIQUE ("token", "identifier");

ALTER TABLE ONLY "next_auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."verification_tokens"
    ADD CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("token");

ALTER TABLE ONLY "public"."accounts"
    ADD CONSTRAINT "accounts_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."invitation"
    ADD CONSTRAINT "invitation_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."member"
    ADD CONSTRAINT "member_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."movement"
    ADD CONSTRAINT "movement_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."plan"
    ADD CONSTRAINT "package_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."shop"
    ADD CONSTRAINT "shop_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."subscription"
    ADD CONSTRAINT "subscription_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."transaction"
    ADD CONSTRAINT "transaction_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "next_auth"."accounts"
    ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "next_auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "next_auth"."sessions"
    ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "next_auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."shop"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."invitation"
    ADD CONSTRAINT "invitation_fromShopId_fkey" FOREIGN KEY ("fromShopId") REFERENCES "public"."shop"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."invitation"
    ADD CONSTRAINT "invitation_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."member"
    ADD CONSTRAINT "member_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."shop"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."member"
    ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."movement"
    ADD CONSTRAINT "movement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."movement"
    ADD CONSTRAINT "movement_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."shop"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."movement"
    ADD CONSTRAINT "movement_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "public"."transaction"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."movement"
    ADD CONSTRAINT "movement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."shop"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."shop"
    ADD CONSTRAINT "shop_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."subscription"
    ADD CONSTRAINT "subscription_boughtBy_fkey" FOREIGN KEY ("boughtBy") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."subscription"
    ADD CONSTRAINT "subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "public"."plan"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."subscription"
    ADD CONSTRAINT "subscription_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "public"."shop"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."transaction"
    ADD CONSTRAINT "transaction_shopId_fkey1" FOREIGN KEY ("shopId") REFERENCES "public"."shop"("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE ONLY "public"."transaction"
    ADD CONSTRAINT "transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON UPDATE CASCADE ON DELETE CASCADE;

CREATE POLICY "Enable read access for all users" ON "public"."member" FOR SELECT USING (true);

CREATE POLICY "Enable read access for all users" ON "public"."subscription" FOR SELECT USING (true);

ALTER TABLE "public"."accounts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."categories" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."invitation" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."member" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."movement" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."plan" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."products" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."shop" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."subscription" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."transaction" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."user" ENABLE ROW LEVEL SECURITY;

ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";

GRANT USAGE ON SCHEMA "next_auth" TO "service_role";

GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON TABLE "next_auth"."accounts" TO "service_role";

GRANT ALL ON TABLE "next_auth"."sessions" TO "service_role";

GRANT ALL ON TABLE "next_auth"."users" TO "service_role";

GRANT ALL ON TABLE "next_auth"."verification_tokens" TO "service_role";

GRANT ALL ON TABLE "public"."accounts" TO "anon";
GRANT ALL ON TABLE "public"."accounts" TO "authenticated";
GRANT ALL ON TABLE "public"."accounts" TO "service_role";

GRANT ALL ON TABLE "public"."categories" TO "anon";
GRANT ALL ON TABLE "public"."categories" TO "authenticated";
GRANT ALL ON TABLE "public"."categories" TO "service_role";

GRANT ALL ON TABLE "public"."invitation" TO "anon";
GRANT ALL ON TABLE "public"."invitation" TO "authenticated";
GRANT ALL ON TABLE "public"."invitation" TO "service_role";

GRANT ALL ON TABLE "public"."member" TO "anon";
GRANT ALL ON TABLE "public"."member" TO "authenticated";
GRANT ALL ON TABLE "public"."member" TO "service_role";

GRANT ALL ON TABLE "public"."movement" TO "anon";
GRANT ALL ON TABLE "public"."movement" TO "authenticated";
GRANT ALL ON TABLE "public"."movement" TO "service_role";

GRANT ALL ON TABLE "public"."plan" TO "anon";
GRANT ALL ON TABLE "public"."plan" TO "authenticated";
GRANT ALL ON TABLE "public"."plan" TO "service_role";

GRANT ALL ON SEQUENCE "public"."package_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."package_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."package_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";

GRANT ALL ON TABLE "public"."shop" TO "anon";
GRANT ALL ON TABLE "public"."shop" TO "authenticated";
GRANT ALL ON TABLE "public"."shop" TO "service_role";

GRANT ALL ON TABLE "public"."subscription" TO "anon";
GRANT ALL ON TABLE "public"."subscription" TO "authenticated";
GRANT ALL ON TABLE "public"."subscription" TO "service_role";

GRANT ALL ON TABLE "public"."transaction" TO "anon";
GRANT ALL ON TABLE "public"."transaction" TO "authenticated";
GRANT ALL ON TABLE "public"."transaction" TO "service_role";

GRANT ALL ON TABLE "public"."user" TO "anon";
GRANT ALL ON TABLE "public"."user" TO "authenticated";
GRANT ALL ON TABLE "public"."user" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

RESET ALL;
