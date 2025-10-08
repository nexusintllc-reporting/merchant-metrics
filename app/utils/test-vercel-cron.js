export async function testVercelCron() {
  const response = await fetch('http://localhost:3000/api/cron', {
    headers: {
      'Authorization': `Bearer ${process.env.CRON_SECRET}`
    }
  });
  
  const result = await response.json();
  console.log('Vercel cron test result:', result);
  return result;
}