-- First add the column as nullable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "salt" TEXT DEFAULT md5(random()::text);

-- Make the column required after setting defaults
ALTER TABLE "User" ALTER COLUMN "salt" SET NOT NULL;