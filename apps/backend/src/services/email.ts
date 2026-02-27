export async function sendMockEmail(to: string, subject: string, body: string) {
  console.log(`[mock-email] to=${to} subject=${subject} body=${body}`);
}
