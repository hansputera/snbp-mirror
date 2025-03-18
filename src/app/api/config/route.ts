import { getSnbpConfig } from "@/services/getSnbpConfig";

export async function GET() {
    const config = await getSnbpConfig();

    return Response.json(config);
}