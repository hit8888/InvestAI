async function checkEmailDomainMX(domain: string) {
  const url = `https://dns.google/resolve?name=${domain}&type=MX`;
  const res = await fetch(url);
  const data = await res.json();

  // Status 3 means NXDOMAIN - domain doesn't exist
  if (data.Status === 3) {
    return {
      valid: false,
      reason: 'Please enter a valid domain',
    };
  }

  // Status 0 means success - check for MX records in Answer
  if (data.Status === 0) {
    if (data.Answer && data.Answer.length > 0) {
      return {
        valid: true,
        records: data.Answer.map((a: { data: string }) => a.data),
      };
    }

    // Domain exists but no MX records found
    // Check if domain exists by looking at Authority records
    if (data.Authority && data.Authority.length > 0) {
      return {
        valid: false,
        reason: 'Please enter a valid domain',
      };
    }
  }

  // Handle other status codes or unexpected responses
  return {
    valid: false,
    reason: 'Please enter a valid domain',
  };
}

export async function handleEmailDomainCheck(email: string) {
  const domain = email.split('@')[1];
  if (!domain) return;

  const res = await checkEmailDomainMX(domain);
  return res;
}
