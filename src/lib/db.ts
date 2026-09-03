import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { DEFAULT_MONGODB_URI, MONGODB_MAX_POOL_SIZE } from "./constants";

const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: MONGODB_MAX_POOL_SIZE,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

type RouteContext = { params: Promise<Record<string, string>> };
type RouteHandler = (
  request: Request,
  context?: RouteContext
) => Promise<NextResponse>;

export function withDB(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      await connectDB();
      return await handler(request, context);
    } catch {
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
