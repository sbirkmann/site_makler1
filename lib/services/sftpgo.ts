import "server-only";

type SftpGoUser = {
  username: string;
  password?: string;
  status: number;
  home_dir: string;
  permissions: Record<string, string[]>;
};

function config() {
  return {
    baseUrl: (process.env.SFTPGO_API_URL ?? "http://localhost:8088").replace(/\/$/, ""),
    username: process.env.SFTPGO_ADMIN_USERNAME ?? "makler-admin",
    password: process.env.SFTPGO_ADMIN_PASSWORD ?? "change-me-in-env",
  };
}

async function token() {
  const c = config();
  const response = await fetch(`${c.baseUrl}/api/v2/token`, {
    headers: { Authorization: `Basic ${Buffer.from(`${c.username}:${c.password}`).toString("base64")}` },
    cache: "no-store",
  });
  if (!response.ok) throw new Error("SFTPGo-Verbindung fehlgeschlagen.");
  const body = (await response.json()) as { access_token?: string };
  if (!body.access_token) throw new Error("SFTPGo hat kein Zugriffstoken geliefert.");
  return { baseUrl: c.baseUrl, value: body.access_token };
}

export async function createSftpGoUser(username: string, password: string, homeDir: string) {
  const auth = await token();
  const user: SftpGoUser = {
    username,
    password,
    status: 1,
    home_dir: homeDir,
    permissions: { "/": ["list", "download", "upload", "create_dirs"] },
  };
  const response = await fetch(`${auth.baseUrl}/api/v2/users`, {
    method: "POST",
    headers: { Authorization: `Bearer ${auth.value}`, "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error("FTP-Benutzer konnte nicht angelegt werden.");
}

export async function deleteSftpGoUser(username: string) {
  const auth = await token();
  const response = await fetch(`${auth.baseUrl}/api/v2/users/${encodeURIComponent(username)}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${auth.value}` },
  });
  if (!response.ok && response.status !== 404) throw new Error("FTP-Benutzer konnte nicht gelöscht werden.");
}
