import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import type { AttributeValue } from "@aws-sdk/client-dynamodb";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { Readable } from "node:stream";

type DynamoIntakeItem = {
  id: { S: string };
  s3_key: { S: string };
  public_key_id: { S: string };
  urgency: { S: string };
  coarse_region?: { S?: string; NULL?: boolean };
  work_type?: { S?: string; NULL?: boolean };
  status?: { S: string };
  expires_at: { S: string };
  expires_at_epoch?: { N: string };
};

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

async function streamToString(stream: unknown) {
  if (typeof stream === "string") return stream;
  if (stream instanceof Uint8Array) return Buffer.from(stream).toString("utf8");
  if (stream instanceof Readable) {
    const chunks: Buffer[] = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return Buffer.concat(chunks).toString("utf8");
  }
  // AWS SDK v3 in Node returns Readable for GetObject.Body.
  throw new Error("Unexpected S3 object body type.");
}

export type SyncedAwsIntake = {
  id: string;
  s3_key: string;
  ciphertext: string;
  public_key_id: string;
  urgency: string;
  coarse_region: string | null;
  work_type: string | null;
  status: string;
  expires_at: string;
  received_at: string;
};

export async function fetchAwsIntakes(opts?: { limit?: number }) {
  const region = process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? "us-east-1";
  const tableName = requireEnv("INTAKE_TABLE_NAME");
  const bucketName = requireEnv("CIPHERTEXT_BUCKET_NAME");

  const dynamo = new DynamoDBClient({ region });
  const s3 = new S3Client({ region });

  const limit = Math.max(1, Math.min(500, opts?.limit ?? 200));
  const items: SyncedAwsIntake[] = [];

  let startKey: Record<string, AttributeValue> | undefined;
  while (items.length < limit) {
    const page = await dynamo.send(
      new ScanCommand({
        TableName: tableName,
        Limit: Math.min(100, limit - items.length),
        ExclusiveStartKey: startKey,
      }),
    );

    const pageItems = (page.Items ?? []) as unknown as DynamoIntakeItem[];
    for (const item of pageItems) {
      const s3_key = item.s3_key.S;
      const id = item.id.S;
      // We currently don't store an explicit created_at in Dynamo; keep a stable-ish ordering proxy.
      // (expires_at_epoch is present and monotonic enough for "newest first" locally.)
      const receivedAt = item.expires_at_epoch?.N
        ? new Date(Number(item.expires_at_epoch.N) * 1000).toISOString()
        : new Date().toISOString();

      const s3Resp = await s3.send(
        new GetObjectCommand({
          Bucket: bucketName,
          Key: s3_key,
        }),
      );

      const raw = await streamToString(s3Resp.Body);
      const parsed = JSON.parse(raw) as { ciphertext?: string; expires_at?: string };

      items.push({
        id,
        s3_key,
        ciphertext: String(parsed.ciphertext ?? ""),
        public_key_id: item.public_key_id.S,
        urgency: item.urgency.S,
        coarse_region: item.coarse_region?.S ?? null,
        work_type: item.work_type?.S ?? null,
        status: item.status?.S ?? "new",
        expires_at: item.expires_at.S,
        received_at: receivedAt,
      });
    }

    startKey = page.LastEvaluatedKey as Record<string, AttributeValue> | undefined;
    if (!startKey) break;
  }

  return items;
}
