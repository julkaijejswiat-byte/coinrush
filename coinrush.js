// To uruchamiasz na SERWERZE (nie w przeglądarce!)
// np. jako Vercel Function (plik /api/withdraw.js)

export default async function handler(req, res) {
  const { paypalEmail, amount } = req.body;
  
  // Pobierz token PayPal
  const tokenRes = await fetch('https://api.paypal.com/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const { access_token } = await tokenRes.json();
  
  // Wyślij wypłatę
  const payout = await fetch('https://api.paypal.com/v1/payments/payouts', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + access_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      sender_batch_header: { email_subject: 'Twoja wypłata z CoinRush!' },
      items: [{
        recipient_type: 'EMAIL',
        amount: { value: amount, currency: 'PLN' },
        receiver: paypalEmail,
        note: 'Wypłata z CoinRush'
      }]
    })
  });
  
  res.json({ success: true });
}