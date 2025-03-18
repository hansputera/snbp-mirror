import { SNBP_URL } from "@/const";
import { SnbpConfig } from "@/types/snbp";
import ky from "ky";

export const getSnbpConfig = async (): Promise<SnbpConfig> => {
    const response = await ky.get<SnbpConfig>('./config.json', {
        prefixUrl: SNBP_URL,
        headers: {
            'Content-Type': 'application/json',
        }
    }).json();

    // Modify the authoritative URL
    response.authoritative = new URL('./static/', process.env.APP_URL).href;

    return response;
}