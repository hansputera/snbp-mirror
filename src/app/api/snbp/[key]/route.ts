import { getSnbp } from "@/services/getSnbp";
import { SnbpDocumentData } from "@/types/document";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const key = new URL(request.url).pathname.split('/').at(-1);
    const data = await getSnbp(key as string).catch((err) => ({ err: err.message })) as SnbpDocumentData | { err: string };

    if ('err' in data) {
        return Response.json({
            ok: false,
            err: data.err,
        }, {
            status: 404,
        });
    }

    return Response.json(data.data, {
        status: 200,
        headers: {
            'X-Fetched-At': data.fetched_at.toString(),
            'X-Id': data.id,
        },
    });
}