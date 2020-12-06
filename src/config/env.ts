import dotenv from "dotenv";
dotenv.config();

function assertEnv(envvar: string): string {
	if (process.env[envvar] === undefined) {
		throw new Error(`Missing environment variable ${envvar}`);
	}
	return process.env[envvar] as string;
}

export const octokitToken: string = assertEnv("OCTOKIT_TOKEN");
