import { getSnbpSummary } from "@/services/getSnbpSummary";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const school = new URL(request.url).searchParams.get("school");
    if (!school) {
        return Response.json({
            ok: false,
            err: 'missing school',
        }, {
            status: 400,
        });
    }

    const results = await getSnbpSummary(school);
    return Response.json({
        data: results ? results : null,
    });
}