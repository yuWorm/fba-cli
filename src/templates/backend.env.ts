// src/templates/backend.env.ts — 后端 .env 模板
import type { InfraConfig, DatabaseType } from "../lib/infra.js";
import { randomBytes } from "crypto";

export interface BackendEnvConfig {
  databaseType: string;
  databaseSchema: string;
  dbHost: string;
  dbPort: number;
  dbUser: string;
  dbPassword: string;
  redisHost: string;
  redisPort: number;
  redisPassword: string;
  redisDatabase: number;
  tokenSecretKey: string;
  celeryBrokerRedisDatabase: number;
  celeryRabbitmqHost: string;
  celeryRabbitmqPort: number;
  celeryRabbitmqUsername: string;
  celeryRabbitmqPassword: string;
}

export function generateTokenSecret(): string {
  return randomBytes(32).toString("base64url");
}

export function getDefaultBackendEnv(
  infraConfig?: Partial<InfraConfig>,
  dbType?: DatabaseType,
): BackendEnvConfig {
  const resolvedDbType = dbType ?? infraConfig?.dbType ?? "postgresql";
  const isMySQL = resolvedDbType === "mysql";
  return {
    databaseType: resolvedDbType,
    databaseSchema: infraConfig?.dbName ?? "fba",
    dbHost: infraConfig?.dbHost ?? "127.0.0.1",
    dbPort: infraConfig?.dbPort ?? (isMySQL ? 3306 : 5432),
    dbUser: infraConfig?.dbUser ?? (isMySQL ? "root" : "postgres"),
    dbPassword: infraConfig?.dbPassword ?? "123456",
    redisHost: infraConfig?.redisHost ?? "127.0.0.1",
    redisPort: infraConfig?.redisPort ?? 6379,
    redisPassword: infraConfig?.redisPassword ?? "",
    redisDatabase: 0,
    tokenSecretKey: generateTokenSecret(),
    celeryBrokerRedisDatabase: 1,
    celeryRabbitmqHost: infraConfig?.mqHost ?? "127.0.0.1",
    celeryRabbitmqPort: infraConfig?.mqPort ?? 5672,
    celeryRabbitmqUsername: infraConfig?.mqUser ?? "guest",
    celeryRabbitmqPassword: infraConfig?.mqPassword ?? "guest",
  };
}

export function serializeBackendEnv(config: BackendEnvConfig): string {
  return `# Env
ENVIRONMENT='dev'
# Database
DATABASE_TYPE='${config.databaseType}'
DATABASE_SCHEMA='${config.databaseSchema}'
DATABASE_HOST='${config.dbHost}'
DATABASE_PORT=${config.dbPort}
DATABASE_USER='${config.dbUser}'
DATABASE_PASSWORD='${config.dbPassword}'

# Redis
REDIS_HOST='${config.redisHost}'
REDIS_PORT=${config.redisPort}
REDIS_PASSWORD='${config.redisPassword}'
REDIS_DATABASE=${config.redisDatabase}

# Token
TOKEN_SECRET_KEY='${config.tokenSecretKey}'

# Celery
CELERY_BROKER_REDIS_DATABASE=${config.celeryBrokerRedisDatabase}

# Rabbitmq
CELERY_RABBITMQ_HOST='${config.celeryRabbitmqHost}'
CELERY_RABBITMQ_PORT=${config.celeryRabbitmqPort}
CELERY_RABBITMQ_USERNAME='${config.celeryRabbitmqUsername}'
CELERY_RABBITMQ_PASSWORD='${config.celeryRabbitmqPassword}'

# [ Plugin ] oauth2
OAUTH2_GITHUB_CLIENT_ID='test'
OAUTH2_GITHUB_CLIENT_SECRET='test'
OAUTH2_GOOGLE_CLIENT_ID='test'
OAUTH2_GOOGLE_CLIENT_SECRET='test'

# [ Plugin ] email
EMAIL_USERNAME=''
EMAIL_PASSWORD=''
`;
}
